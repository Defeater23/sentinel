import os
import logging
import time
import numpy as np
import onnxruntime as ort  # type: ignore

logger = logging.getLogger("sentinel.classifier_loader")

CLASS_NAMES = [
    "car", "truck", "bus", "motorcycle", "bicycle", "pedestrian",
    "auto_rickshaw", "cattle", "dog", "pothole", "construction_debris",
    "speed_breaker", "cycle_rickshaw", "handcart", "tractor"
]

class ClassifierLoader:
    def __init__(self, model_path: str, enable_gpu: bool = False):
        self.model_path = model_path
        self.loaded = False
        self.session = None
        self.load_error = None
        
        if os.path.exists(model_path):
            try:
                providers = ["CUDAExecutionProvider", "CPUExecutionProvider"] if enable_gpu else ["CPUExecutionProvider"]
                self.session = ort.InferenceSession(model_path, providers=providers)
                self.loaded = True
                logger.info(f"Successfully loaded Classifier model from {model_path}")
            except Exception as e:
                self.load_error = str(e)
                logger.error(f"Failed to load Classifier model from {model_path}: {e}")
        else:
            logger.warning(f"Classifier model weights not found at {model_path}. Fallback to mock.")

    def run(self, images: np.ndarray) -> list:
        """
        Runs inference on Model 2 (Classifier).
        Input:
            images: float32 [1, 3, 640, 640]
        Returns:
            detections: list of dicts matching Schema Detection
        """
        if not self.loaded:
            return self._generate_mock_detections()
            
        inputs = {self.session.get_inputs()[0].name: images}
        outputs = self.session.run(None, inputs)
        # outputs[0] is output0 shape (1, 19, 8400)
        return self._post_process(outputs[0])

    def _post_process(self, output0: np.ndarray) -> list:
        # Squeeze output to shape (19, 8400)
        out = output0[0]
        boxes = out[0:4, :]     # (4, 8400) (cx, cy, w, h normalized w.r.t 640x640)
        scores = out[4:19, :]   # (15, 8400) (class confidences)
        
        class_ids = np.argmax(scores, axis=0)
        max_scores = np.max(scores, axis=0)
        
        # Filter by confidence threshold (0.4)
        keep_indices = max_scores >= 0.4
        if not np.any(keep_indices):
            return []
            
        boxes_to_keep = boxes[:, keep_indices]
        scores_to_keep = max_scores[keep_indices]
        class_ids_to_keep = class_ids[keep_indices]
        
        cx, cy, w, h = boxes_to_keep[0], boxes_to_keep[1], boxes_to_keep[2], boxes_to_keep[3]
        x1 = np.clip(cx - w / 2.0, 0.0, 1.0)
        y1 = np.clip(cy - h / 2.0, 0.0, 1.0)
        x2 = np.clip(cx + w / 2.0, 0.0, 1.0)
        y2 = np.clip(cy + h / 2.0, 0.0, 1.0)
        
        boxes_xyxy = np.stack([x1, y1, x2, y2], axis=1)  # shape (K, 4)
        
        # Apply class-wise NMS
        keep_final = []
        for c in np.unique(class_ids_to_keep):
            class_mask = class_ids_to_keep == c
            class_boxes = boxes_xyxy[class_mask]
            class_scores = scores_to_keep[class_mask]
            class_indices = np.where(class_mask)[0]
            
            keep_indices_for_class = self._nms(class_boxes, class_scores, 0.45)
            for idx in keep_indices_for_class:
                keep_final.append(class_indices[idx])
                
        # Build list of detections
        results = []
        for idx in keep_final:
            cid = int(class_ids_to_keep[idx])
            results.append({
                "class_id": cid,
                "class_name": CLASS_NAMES[cid],
                "confidence": float(scores_to_keep[idx]),
                "bbox": boxes_xyxy[idx].tolist()  # [x1, y1, x2, y2]
            })
            
        # Sort by confidence descending
        return sorted(results, key=lambda x: -x["confidence"])

    def _nms(self, boxes: np.ndarray, scores: np.ndarray, iou_threshold: float) -> list:
        if len(boxes) == 0:
            return []
            
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 2]
        y2 = boxes[:, 3]
        areas = (x2 - x1) * (y2 - y1)
        
        order = scores.argsort()[::-1]
        keep = []
        
        while order.size > 0:
            i = order[0]
            keep.append(i)
            
            if order.size == 1:
                break
                
            xx1 = np.maximum(x1[i], x1[order[1:]])
            yy1 = np.maximum(y1[i], y1[order[1:]])
            xx2 = np.minimum(x2[i], x2[order[1:]])
            yy2 = np.minimum(y2[i], y2[order[1:]])
            
            w = np.maximum(0.0, xx2 - xx1)
            h = np.maximum(0.0, yy2 - yy1)
            inter = w * h
            
            union = areas[i] + areas[order[1:]] - inter
            union = np.maximum(union, 1e-6)  # avoid division by zero
            ovr = inter / union
            
            inds = np.where(ovr <= iou_threshold)[0]
            order = order[inds + 1]
            
        return keep

    def _generate_mock_detections(self) -> list:
        """
        Generates dynamic mock detections representing objects moving on an Indian road.
        Cattle crosses slowly from left to right, Auto Rickshaw moves slightly.
        """
        t = time.time()
        # A slow 12-second cycle for cattle crossing
        phase = (t % 12.0) / 12.0
        
        # Cattle (hazard object, class_id=7) crossing the road
        cattle_x1 = 0.15 + 0.45 * phase
        cattle_y1 = 0.40 + 0.05 * np.sin(phase * np.pi)
        cattle_x2 = cattle_x1 + 0.28
        cattle_y2 = cattle_y1 + 0.32
        
        # Auto Rickshaw (vehicle, class_id=6) ahead in lane, weaving slightly
        rickshaw_x1 = 0.25 + 0.12 * np.sin(t * 0.8)
        rickshaw_y1 = 0.48
        rickshaw_x2 = rickshaw_x1 + 0.18
        rickshaw_y2 = rickshaw_y1 + 0.28
        
        detections = [
            {
                "class_id": 7,
                "class_name": "cattle",
                "confidence": float(np.clip(0.85 + 0.10 * np.cos(t * 0.3), 0.70, 0.98)),
                "bbox": [
                    float(np.clip(cattle_x1, 0.0, 1.0)),
                    float(np.clip(cattle_y1, 0.0, 1.0)),
                    float(np.clip(cattle_x2, 0.0, 1.0)),
                    float(np.clip(cattle_y2, 0.0, 1.0))
                ]
            },
            {
                "class_id": 6,
                "class_name": "auto_rickshaw",
                "confidence": float(np.clip(0.80 + 0.08 * np.sin(t * 0.5), 0.65, 0.95)),
                "bbox": [
                    float(np.clip(rickshaw_x1, 0.0, 1.0)),
                    float(np.clip(rickshaw_y1, 0.0, 1.0)),
                    float(np.clip(rickshaw_x2, 0.0, 1.0)),
                    float(np.clip(rickshaw_y2, 0.0, 1.0))
                ]
            }
        ]
        return sorted(detections, key=lambda x: -x["confidence"])

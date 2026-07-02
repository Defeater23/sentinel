import os
import logging
import time
import numpy as np
import onnxruntime as ort  # type: ignore

logger = logging.getLogger("sentinel.risk_loader")

try:
    from core.risk_scorer import RiskScorer, Detection as RiskDetection
    HAS_REAL_RISK = True
except Exception as e:
    logger.warning(f"Failed to import real RiskScorer: {e}. Falling back to mock risk scoring.")
    HAS_REAL_RISK = False

class RiskLoader:
    def __init__(self, model_path: str, enable_gpu: bool = False):
        self.model_path = model_path
        self.loaded = False
        self.session = None
        self.load_error = None
        self.scorer = None
        
        if os.path.exists(model_path):
            try:
                providers = ["CUDAExecutionProvider", "CPUExecutionProvider"] if enable_gpu else ["CPUExecutionProvider"]
                self.session = ort.InferenceSession(model_path, providers=providers)
                self.loaded = True
                logger.info(f"Successfully loaded Risk model from {model_path}")
            except Exception as e:
                self.load_error = str(e)
                logger.error(f"Failed to load Risk model from {model_path}: {e}")
        else:
            logger.warning(f"Risk model weights not found at {model_path}. Fallback to mock.")

        if HAS_REAL_RISK:
            try:
                self.scorer = RiskScorer()
                logger.info("Successfully initialized real RiskScorer")
            except Exception as e:
                logger.error(f"Failed to initialize real RiskScorer: {e}")
                self.scorer = None

    def run(self, sequence: np.ndarray, detections: list) -> float:
        """
        Runs inference on Model 3 (Risk).
        Input:
            sequence: float32 [1, 5, 542] (5 frames of embedding + detection vectors)
            detections: current list of detections (used for mock scoring fallback)
        Returns:
            risk_score: float in [0.0, 1.0]
        """
        if self.scorer is not None:
            try:
                for det in detections:
                    bbox = det["bbox"]
                    x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]
                    
                    risk_det = RiskDetection(
                        class_name=det["class_name"],
                        confidence=det["confidence"],
                        x1=x1,
                        y1=y1,
                        x2=x2,
                        y2=y2,
                        image_width=1.0,
                        image_height=1.0
                    )
                    score_res = self.scorer.score_detection(risk_det)
                    
                    # Update det dict in-place
                    det["risk_score"] = score_res["risk_score"]
                    det["risk_level"] = score_res["risk_level"]
                    det["box_area_ratio"] = score_res["box_area_ratio"]
                    det["center_x_norm"] = score_res["center_x_norm"]
                    det["center_y_norm"] = score_res["center_y_norm"]
                
                # Overall risk is max of individual object risks
                if detections:
                    return max(det["risk_score"] for det in detections)
                return 0.0
            except Exception as e:
                logger.error(f"Error during real RiskScorer execution: {e}")
                return self._generate_mock_risk(detections)
                
        # If real scorer is not initialized but model is loaded (though we expect mock fallback)
        if not self.loaded:
            return self._generate_mock_risk(detections)
            
        inputs = {self.session.get_inputs()[0].name: sequence}
        outputs = self.session.run(None, inputs)
        # outputs[0] is risk_score shape (1,) or (1, 1)
        score = outputs[0]
        if isinstance(score, np.ndarray):
            score = score.item()
        return float(np.clip(score, 0.0, 1.0))

    def _generate_mock_risk(self, detections: list) -> float:
        if not detections:
            # Low baseline risk
            return float(np.clip(0.12 + 0.03 * np.sin(time.time()), 0.0, 1.0))
            
        # Correlate risk with the highest confidence detection
        max_conf = max(d["confidence"] for d in detections)
        has_animal = any(d["class_name"] == "animal" for d in detections)
        has_rickshaw = any(d["class_name"] == "auto_rickshaw" for d in detections)
        
        if has_animal:
            # Animal causes high collision risk
            return float(np.clip(max_conf * 0.94, 0.0, 1.0))
        elif has_rickshaw:
            # Rickshaws are moderately risky
            return float(np.clip(max_conf * 0.65, 0.0, 1.0))
        else:
            return float(np.clip(max_conf * 0.50, 0.0, 1.0))

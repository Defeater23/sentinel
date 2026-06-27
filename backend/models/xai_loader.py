import os
import base64
import logging
import cv2  # type: ignore
import numpy as np

logger = logging.getLogger("sentinel.xai_loader")

class XaiLoader:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.loaded = False
        self.cam = None
        self.pytorch_model = None
        self.model = None
        self.load_error = None

        if os.path.exists(model_path):
            try:
                # Dynamic imports to avoid crashing if torch/ultralytics/grad-cam are not installed yet
                import torch  # type: ignore
                from ultralytics import YOLO  # type: ignore
                from pytorch_grad_cam import GradCAM  # type: ignore

                # Load the YOLO model
                self.model = YOLO(model_path)
                self.pytorch_model = self.model.model  # underlying nn.Module
                
                # YOLOv8 target layer: last conv layer in YOLOv8 backbone.
                # For YOLOv8m, this is self.pytorch_model.model[-2].
                # We will check backbone architecture to ensure it works.
                self.target_layer = [self.pytorch_model.model[-2]]
                self.cam = GradCAM(model=self.pytorch_model, target_layers=self.target_layer)
                self.loaded = True
                logger.info(f"Successfully loaded PyTorch XAI (GradCAM) model from {model_path}")
            except Exception as e:
                self.load_error = str(e)
                logger.error(f"Failed to load PyTorch XAI model from {model_path}: {e}")
        else:
            logger.warning(f"PyTorch classifier weights for XAI not found at {model_path}. Fallback to mock.")

    def run(self, img_bgr: np.ndarray, detections: list) -> str:
        """
        Generates Grad-CAM saliency map and returns a base64 encoded PNG overlay.
        Args:
            img_bgr: Original frame as np.ndarray (H, W, 3)
            detections: List of current detections
        Returns:
            base64_png_str: Base64 string of PNG file or None
        """
        if not detections:
            return None

        if not self.loaded:
            return self._generate_mock_saliency(img_bgr, detections)

        try:
            import torch  # type: ignore
            from pytorch_grad_cam.utils.image import show_cam_on_image  # type: ignore

            # Resize to 640x640 as required by model 2
            resized_bgr = cv2.resize(img_bgr, (640, 640))
            frame_rgb = cv2.cvtColor(resized_bgr, cv2.COLOR_BGR2RGB)
            input_tensor = torch.from_numpy(frame_rgb).permute(2, 0, 1).float() / 255.0
            input_tensor = input_tensor.unsqueeze(0)  # [1, 3, 640, 640]

            # Run Grad-CAM (targets the highest-confidence class detection)
            # Default behavior targets the first element (top confidence)
            grayscale_cam = self.cam(input_tensor=input_tensor)  # shape [1, 640, 640]
            grayscale_cam = grayscale_cam[0]  # shape [640, 640]

            # Normalize and overlay
            rgb_norm = frame_rgb.astype(np.float32) / 255.0
            cam_image = show_cam_on_image(rgb_norm, grayscale_cam, use_rgb=True)

            # Convert camel_image (RGB float) back to BGR uint8
            cam_image_bgr = cv2.cvtColor((cam_image * 255.0).astype(np.uint8), cv2.COLOR_RGB2BGR)
            _, buffer = cv2.imencode(".png", cam_image_bgr)
            return base64.b64encode(buffer).decode("utf-8")
        except Exception as e:
            logger.error(f"Error running real XAI Grad-CAM: {e}. Falling back to mock.")
            return self._generate_mock_saliency(img_bgr, detections)

    def _generate_mock_saliency(self, img_bgr: np.ndarray, detections: list) -> str:
        """
        Generates a realistic mock Grad-CAM overlay by drawing a Gaussian blob
        centered at the primary bounding box and blending it with the camera frame.
        """
        try:
            frame_resized = cv2.resize(img_bgr, (640, 640))
            img_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)

            mask = np.zeros((640, 640), dtype=np.float32)
            if detections:
                det = detections[0]
                x1, y1, x2, y2 = det["bbox"]
                
                # Convert normalized coords to pixel coords
                cx = int((x1 + x2) / 2.0 * 640.0)
                cy = int((y1 + y2) / 2.0 * 640.0)
                r = max(int((x2 - x1) / 2.0 * 640.0), int((y2 - y1) / 2.0 * 640.0), 20)

                # Generate Gaussian blob
                y_grid, x_grid = np.ogrid[:640, :640]
                dist_sq = (x_grid - cx) ** 2 + (y_grid - cy) ** 2
                sigma = r * 0.8
                mask = np.exp(-dist_sq / (2 * (sigma ** 2)))

            normed = (mask * 255).astype(np.uint8)
            heatmap = cv2.applyColorMap(normed, cv2.COLORMAP_JET)
            heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

            # Blend heatmap and original image
            img_float = img_rgb.astype(np.float32) / 255.0
            heatmap_float = heatmap_rgb.astype(np.float32) / 255.0

            mask_expanded = np.expand_dims(mask, axis=2)  # [640, 640, 1]
            # Blend original frame and colored heatmap based on Gaussian weights
            blended = img_float * (1.0 - 0.5 * mask_expanded) + heatmap_float * (0.5 * mask_expanded)
            blended = np.clip(blended * 255.0, 0.0, 255.0).astype(np.uint8)

            # Convert back to BGR for PNG encoding
            blended_bgr = cv2.cvtColor(blended, cv2.COLOR_RGB2BGR)
            _, buffer = cv2.imencode(".png", blended_bgr)
            return base64.b64encode(buffer).decode("utf-8")
        except Exception as e:
            logger.error(f"Error generating mock saliency: {e}")
            return None

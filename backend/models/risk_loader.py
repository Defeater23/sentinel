import os
import logging
import time
import numpy as np
import onnxruntime as ort  # type: ignore

logger = logging.getLogger("sentinel.risk_loader")

class RiskLoader:
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
                logger.info(f"Successfully loaded Risk model from {model_path}")
            except Exception as e:
                self.load_error = str(e)
                logger.error(f"Failed to load Risk model from {model_path}: {e}")
        else:
            logger.warning(f"Risk model weights not found at {model_path}. Fallback to mock.")

    def run(self, sequence: np.ndarray, detections: list) -> float:
        """
        Runs inference on Model 3 (Risk).
        Input:
            sequence: float32 [1, 5, 542] (5 frames of embedding + detection vectors)
            detections: current list of detections (used for mock scoring fallback)
        Returns:
            risk_score: float in [0.0, 1.0]
        """
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
        has_cattle = any(d["class_name"] == "cattle" for d in detections)
        has_rickshaw = any(d["class_name"] == "auto_rickshaw" for d in detections)
        
        if has_cattle:
            # Cattle causes high collision risk
            return float(np.clip(max_conf * 0.94, 0.0, 1.0))
        elif has_rickshaw:
            # Rickshaws are moderately risky
            return float(np.clip(max_conf * 0.65, 0.0, 1.0))
        else:
            return float(np.clip(max_conf * 0.50, 0.0, 1.0))

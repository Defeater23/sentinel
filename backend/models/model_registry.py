import os
from core.config import settings
from models.fusion_loader import FusionLoader
from models.classifier_loader import ClassifierLoader
from models.risk_loader import RiskLoader
from models.xai_loader import XaiLoader

class ModelRegistry:
    def __init__(self):
        self.models = {}

    def load_all(self):
        model_dir = settings.model_dir
        enable_gpu = settings.enable_gpu

        # Define weight file paths as per DATA_CONTRACTS.md
        fusion_path = os.path.join(model_dir, "model1_fusion.onnx")
        classifier_path = os.path.join(model_dir, "model2_classifier.onnx")
        risk_path = os.path.join(model_dir, "model3_risk.onnx")
        xai_path = os.path.join(model_dir, "model2_best.pt")  # Option A PyTorch weights

        # Instantiate loaders (graceful failure fallbacks built-in)
        self.models["fusion"] = FusionLoader(fusion_path, enable_gpu=enable_gpu)
        self.models["classifier"] = ClassifierLoader(classifier_path, enable_gpu=enable_gpu)
        self.models["risk"] = RiskLoader(risk_path, enable_gpu=enable_gpu)
        self.models["xai"] = XaiLoader(xai_path)

    def get(self, name: str):
        return self.models.get(name)

    def get_status(self) -> dict:
        """
        Returns the load status and weight paths of each model for the /health endpoint.
        """
        status = {}
        for name, loader in self.models.items():
            status[name] = {
                "loaded": loader.loaded,
                "path": loader.model_path,
                "error": getattr(loader, "load_error", None)
            }
        return status

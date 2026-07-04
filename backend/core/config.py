import os
from pydantic import BaseModel

class Settings(BaseModel):
    model_dir: str = os.getenv("MODEL_DIR", "./models/weights")
    inference_fps: int = int(os.getenv("INFERENCE_FPS", "10"))
    risk_threshold_high: float = float(os.getenv("RISK_THRESHOLD_HIGH", "0.6"))
    risk_threshold_critical: float = float(os.getenv("RISK_THRESHOLD_CRITICAL", "0.8"))
    enable_gpu: bool = os.getenv("ENABLE_GPU", "false").lower() in ("true", "1", "yes")
    log_level: str = os.getenv("LOG_LEVEL", "info")
    mock_mode_force: bool = os.getenv("MOCK_MODE_FORCE", "false").lower() in ("true", "1", "yes")
    xai_throttle_rate: int = int(os.getenv("XAI_THROTTLE_RATE", "3"))

settings = Settings()

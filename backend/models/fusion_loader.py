import os
import json
import logging
import numpy as np
import onnxruntime as ort  # type: ignore

logger = logging.getLogger("sentinel.fusion_loader")

class FusionLoader:
    def __init__(self, model_path: str, enable_gpu: bool = False):
        self.model_path = model_path
        self.loaded = False
        self.session = None
        self.load_error = None
        
        if os.path.exists(model_path):
            try:
                # Use CUDA if enabled, fallback to CPU
                providers = ["CUDAExecutionProvider", "CPUExecutionProvider"] if enable_gpu else ["CPUExecutionProvider"]
                self.session = ort.InferenceSession(model_path, providers=providers)
                self.loaded = True
                logger.info(f"Successfully loaded Fusion model from {model_path}")
            except Exception as e:
                self.load_error = str(e)
                logger.error(f"Failed to load Fusion model from {model_path}: {e}")
        else:
            logger.warning(f"Fusion model weights not found at {model_path}. Fallback to mock.")

    def run(self, camera: np.ndarray, lidar: np.ndarray, radar: np.ndarray, imu_gps: np.ndarray):
        """
        Runs inference on Model 1 (Fusion).
        Inputs:
            camera: float32 [1, 3, 640, 640]
            lidar: float32 [1, 2000, 4]
            radar: float32 [1, 50, 3]
            imu_gps: float32 [1, 12]
        Returns:
            scene_embedding: np.ndarray shape (1, 512)
            scene_graph_json: str (JSON representation of scene graph)
        """
        if not self.loaded:
            # Generate mock scene embedding and standard scene graph
            scene_embedding = np.zeros((1, 512), dtype=np.float32)
            scene_graph = {
                "nodes": [
                    {"id": "ego", "label": "ego vehicle", "type": "ego", "x": 320.0, "y": 400.0},
                    {"id": "obj_0", "label": "cattle", "type": "hazard", "x": 280.0, "y": 180.0},
                    {"id": "obj_1", "label": "auto_rickshaw", "type": "vehicle", "x": 150.0, "y": 250.0}
                ],
                "edges": [
                    {"source": "ego", "target": "obj_0", "relation": "approaching", "distance_m": 8.4},
                    {"source": "ego", "target": "obj_1", "relation": "following", "distance_m": 22.1}
                ]
            }
            return scene_embedding, json.dumps(scene_graph)

        inputs = {
            "camera": camera,
            "lidar": lidar,
            "radar": radar,
            "imu_gps": imu_gps
        }
        outputs = self.session.run(None, inputs)
        # outputs[0]: scene_embedding, outputs[1]: scene_graph_json
        scene_graph_str = outputs[1]
        if isinstance(scene_graph_str, np.ndarray):
            scene_graph_str = scene_graph_str.item()
        if isinstance(scene_graph_str, bytes):
            scene_graph_str = scene_graph_str.decode("utf-8")
        return outputs[0], scene_graph_str

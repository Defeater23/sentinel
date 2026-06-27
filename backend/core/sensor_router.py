import base64
import cv2  # type: ignore
import numpy as np
from typing import Optional, List, Union
from schemas.sensor_input import IMUData, GPSData, RadarTarget

def decode_camera_frame(frame_b64: str) -> np.ndarray:
    """
    Decodes a base64 encoded camera frame string to a standard BGR numpy array.
    """
    try:
        # Strip metadata header if present (e.g. data:image/jpeg;base64,...)
        if "," in frame_b64:
            frame_b64 = frame_b64.split(",")[1]
        img_bytes = base64.b64decode(frame_b64)
        arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("CV2 failed to decode image bytes.")
        return img
    except Exception as e:
        raise ValueError(f"Failed to decode camera_frame base64: {e}")

def prepare_classifier_image(img_bgr: np.ndarray) -> np.ndarray:
    """
    Normalizes a BGR image to RGB, resizes to 640x640, scales to [0, 1],
    and transposes to NCHW float32 format for Model 2 (Classifier).
    """
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(img_rgb, (640, 640))
    float_img = resized.astype(np.float32) / 255.0
    transposed = float_img.transpose(2, 0, 1)  # (3, 640, 640)
    return np.expand_dims(transposed, axis=0)  # (1, 3, 640, 640)

def prepare_fusion_image(img_bgr: np.ndarray) -> np.ndarray:
    """
    Normalizes a BGR image to RGB, resizes to 640x640, scales to [0, 1],
    applies ImageNet mean and std deviation normalization, and
    transposes to NCHW float32 format for Model 1 (Fusion).
    """
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(img_rgb, (640, 640))
    float_img = resized.astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    normalized = (float_img - mean) / std
    transposed = normalized.transpose(2, 0, 1)  # (3, 640, 640)
    return np.expand_dims(transposed, axis=0)  # (1, 3, 640, 640)

def prepare_lidar(points: Optional[List[List[float]]]) -> np.ndarray:
    """
    Converts variable length lidar points to a fixed float32[1, 2000, 4] tensor,
    zero-padding or truncating as necessary.
    """
    out = np.zeros((2000, 4), dtype=np.float32)
    if points:
        n = min(len(points), 2000)
        for i in range(n):
            pt = points[i]
            for j in range(min(len(pt), 4)):
                out[i, j] = float(pt[j])
    return np.expand_dims(out, axis=0)  # (1, 2000, 4)

def prepare_radar(targets: Optional[Union[List[RadarTarget], List[dict]]]) -> np.ndarray:
    """
    Converts variable length radar targets to a fixed float32[1, 50, 3] tensor,
    zero-padding or truncating as necessary.
    """
    out = np.zeros((50, 3), dtype=np.float32)
    if targets:
        n = min(len(targets), 50)
        for i in range(n):
            t = targets[i]
            if hasattr(t, "range_m"):  # Pydantic model
                out[i, 0] = float(t.range_m)
                out[i, 1] = float(t.velocity_mps)
                out[i, 2] = float(t.azimuth_deg)
            elif isinstance(t, dict):  # raw dict
                out[i, 0] = float(t.get("range_m", 0.0))
                out[i, 1] = float(t.get("velocity_mps", 0.0))
                out[i, 2] = float(t.get("azimuth_deg", 0.0))
    return np.expand_dims(out, axis=0)  # (1, 50, 3)

def prepare_imu_gps(
    imu: Optional[Union[IMUData, dict]], 
    gps: Optional[Union[GPSData, dict]]
) -> np.ndarray:
    """
    Encodes optional IMU and GPS telemetry fields into a combined float32[1, 12] tensor.
    Vector structure: [accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, lat, lon, speed, heading, 0, 0]
    """
    out = np.zeros(12, dtype=np.float32)
    if imu:
        if isinstance(imu, dict):
            out[0] = float(imu.get("accel_x", 0.0))
            out[1] = float(imu.get("accel_y", 0.0))
            out[2] = float(imu.get("accel_z", 0.0))
            out[3] = float(imu.get("gyro_x", 0.0))
            out[4] = float(imu.get("gyro_y", 0.0))
            out[5] = float(imu.get("gyro_z", 0.0))
        else:
            out[0] = float(getattr(imu, "accel_x", 0.0))
            out[1] = float(getattr(imu, "accel_y", 0.0))
            out[2] = float(getattr(imu, "accel_z", 0.0))
            out[3] = float(getattr(imu, "gyro_x", 0.0))
            out[4] = float(getattr(imu, "gyro_y", 0.0))
            out[5] = float(getattr(imu, "gyro_z", 0.0))
    if gps:
        if isinstance(gps, dict):
            out[6] = float(gps.get("lat", 0.0))
            out[7] = float(gps.get("lon", 0.0))
            out[8] = float(gps.get("speed_kmh", 0.0))
            out[9] = float(gps.get("heading_deg", 0.0))
        else:
            out[6] = float(getattr(gps, "lat", 0.0))
            out[7] = float(getattr(gps, "lon", 0.0))
            out[8] = float(getattr(gps, "speed_kmh", 0.0))
            out[9] = float(getattr(gps, "heading_deg", 0.0))
    return np.expand_dims(out, axis=0)  # (1, 12)

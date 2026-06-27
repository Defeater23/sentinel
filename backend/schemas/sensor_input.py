from pydantic import BaseModel
from typing import Optional, List

class IMUData(BaseModel):
    accel_x: float
    accel_y: float
    accel_z: float
    gyro_x: float
    gyro_y: float
    gyro_z: float

class GPSData(BaseModel):
    lat: float
    lon: float
    speed_kmh: float
    heading_deg: float

class RadarTarget(BaseModel):
    range_m: float
    velocity_mps: float
    azimuth_deg: float

class SensorPayload(BaseModel):
    camera_frame: str                                   # base64 encoded JPEG/PNG
    frame_id: Optional[int] = 0
    lidar_points: Optional[List[List[float]]] = None    # list of [x, y, z, intensity]
    radar_targets: Optional[List[RadarTarget]] = None   # list of radar targets
    imu: Optional[IMUData] = None
    gps: Optional[GPSData] = None
    timestamp: Optional[float] = 0.0

import {
  Camera,
  Radar,
  Compass,
  MapPin,
  Cpu,
  Wifi,
  ScanLine,
} from "lucide-react";

const SENSORS = [
  { key: "camera", label: "Camera", icon: Camera, required: true },
  { key: "lidar", label: "LiDAR", icon: ScanLine, required: false },
  { key: "radar", label: "Radar", icon: Radar, required: false },
  { key: "imu", label: "IMU", icon: Compass, required: false },
  { key: "gps", label: "GPS", icon: MapPin, required: false },
  { key: "edge_device", label: "Edge Device", icon: Cpu, required: false },
  { key: "websocket", label: "WebSocket", icon: Wifi, required: false },
];

const STATUS_STYLES = {
  Online: { bg: "bg-sentinel-success-soft", text: "text-sentinel-success", dot: "bg-sentinel-success" },
  Missing: { bg: "bg-sentinel-bg-alt", text: "text-sentinel-muted", dot: "bg-sentinel-muted-light" },
  Simulated: { bg: "bg-sentinel-accent-soft", text: "text-sentinel-ink", dot: "bg-sentinel-accent-dark" },
};

const DEFAULT_STATUS = {
  camera: "Online",
  lidar: "Missing",
  radar: "Missing",
  imu: "Simulated",
  gps: "Simulated",
  edge_device: "Online",
  websocket: "Missing",
};

export default function SensorStatus({ sensorStatus, connected }) {
  const status = {
    ...DEFAULT_STATUS,
    ...sensorStatus,
    websocket: connected ? "Online" : sensorStatus?.websocket || "Missing",
  };

  return (
    <div className="glass-card-dark p-5">
      <p className="text-xs font-semibold text-sentinel-gray uppercase tracking-widest mb-4">
        Vehicle Sensor Status
      </p>
      <div className="space-y-2.5">
        {SENSORS.map(({ key, label, icon: Icon, required }) => {
          const s = status[key] || "Missing";
          const style = STATUS_STYLES[s] || STATUS_STYLES.Missing;

          return (
            <div
              key={key}
              className="flex items-center justify-between py-2 px-3 rounded-xl surface-muted hover:bg-sentinel-bg-soft transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-sentinel-gray" />
                <span className="text-sm font-medium text-sentinel-ink">
                  {label}
                  {required && <span className="text-red-500 ml-0.5">*</span>}
                </span>
              </div>
              <span className={`pill-badge ${style.bg} ${style.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${s === "Online" ? "animate-blink-live" : ""}`} />
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

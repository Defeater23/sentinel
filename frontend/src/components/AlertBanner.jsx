import { AlertTriangle } from "lucide-react";

export default function AlertBanner({ alert }) {
  if (!alert?.fire) return null;

  const isCritical = alert.level === "CRITICAL";
  const isHigh = alert.level === "HIGH";

  const styles = isCritical
    ? "bg-sentinel-danger-soft border-sentinel-danger text-rose-900 animate-pulse-critical"
    : isHigh
    ? "bg-sentinel-warning-soft border-sentinel-warning text-amber-900"
    : "bg-sentinel-warning-soft border-amber-400 text-amber-900";

  const iconColor = isCritical ? "text-sentinel-danger" : isHigh ? "text-sentinel-warning" : "text-amber-600";

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 border-2 flex items-start gap-4 transition-all duration-300 ${styles}`}
      role="alert"
    >
      <div className={`flex-shrink-0 p-2 rounded-xl ${isCritical ? "bg-rose-100" : isHigh ? "bg-amber-100" : "bg-amber-50"}`}>
        <AlertTriangle className={`w-6 h-6 ${iconColor} ${isCritical ? "animate-pulse" : ""}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`pill-badge text-white ${
              isCritical ? "bg-sentinel-danger" : isHigh ? "bg-sentinel-warning" : "bg-amber-500"
            }`}
          >
            {alert.level || "ALERT"}
          </span>
          <span className="text-xs text-gray-500 font-medium">Voice alert active</span>
        </div>
        <p className="font-bold text-base sm:text-lg leading-snug">{alert.english}</p>
        {alert.hindi && (
          <p className="hindi-text text-gray-600 text-base sm:text-lg mt-1 leading-snug">
            {alert.hindi}
          </p>
        )}
      </div>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";
import { getClassColor, getRiskColor } from "../utils/riskColors";

export default function DetectionPanel({ detections = [], riskLabel }) {
  return (
    <div className="glass-card-dark p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-sentinel-accent-dark" />
          <p className="text-xs font-semibold text-sentinel-gray uppercase tracking-widest">
            Road Hazards Detected
          </p>
        </div>
        <span className="text-xs font-medium text-sentinel-gray">
          {detections.length} hazard{detections.length !== 1 ? "s" : ""}
        </span>
      </div>

      {detections.length === 0 ? (
        <div className="text-center py-8 text-sentinel-gray text-sm">
          No hazards detected — road looks clear
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {detections.map((det, i) => {
            const color = getClassColor(det.class_name);

            return (
              <div
                key={`${det.class_name}-${i}`}
                className="flex items-center justify-between p-3 rounded-xl surface-muted hover:bg-sentinel-bg-soft transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-semibold text-sentinel-ink capitalize truncate">
                    {det.class_name.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {(det.confidence * 100).toFixed(0)}% sure
                  </span>
                  {riskLabel && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase hidden sm:inline"
                      style={{
                        backgroundColor: `${getRiskColor(riskLabel)}15`,
                        color: getRiskColor(riskLabel),
                      }}
                    >
                      {riskLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

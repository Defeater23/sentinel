import { ArrowRight, ShieldCheck, Eye, Gauge, OctagonAlert } from "lucide-react";
import { getRiskColor } from "../utils/riskColors";

const ACTIONS = {
  LOW: {
    icon: ShieldCheck,
    title: "Continue Driving",
    description: "Road conditions look clear. Stay aware of surroundings.",
  },
  MEDIUM: {
    icon: Eye,
    title: "Stay Alert",
    description: "Objects detected nearby. Monitor speed and lane position.",
  },
  HIGH: {
    icon: Gauge,
    title: "Slow Down",
    description: "Hazard detected ahead. Reduce speed and prepare to react.",
  },
  CRITICAL: {
    icon: OctagonAlert,
    title: "Brake / Avoid Obstacle",
    description: "Immediate action required. Brake assist recommended.",
  },
};

export default function RecommendedAction({ riskLabel = "LOW" }) {
  const action = ACTIONS[riskLabel] || ACTIONS.LOW;
  const color = getRiskColor(riskLabel);
  const Icon = action.icon;

  return (
    <div className="glass-card-dark p-5">
      <p className="text-xs font-semibold text-sentinel-gray uppercase tracking-widest mb-3">
        Recommended Action
      </p>
      <div
        className="flex items-start gap-4 p-4 rounded-2xl border transition-colors duration-500"
        style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
      >
        <div
          className="p-2.5 rounded-xl flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="font-display font-bold text-lg text-sentinel-ink">{action.title}</p>
          <p className="text-sm text-sentinel-gray mt-1 leading-relaxed">{action.description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-sentinel-gray flex-shrink-0 mt-1 hidden sm:block" />
      </div>
    </div>
  );
}

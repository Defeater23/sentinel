import { useState } from "react";
import {
  ScanLine,
  MapPin,
  AlertTriangle,
  Volume2,
  Eye,
  WifiOff,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Real-Time Hazard Detection",
    description: "Spots vehicles, pedestrians, potholes, cracks, and animals as you drive.",
    highlight: "Potholes · Pedestrians · Animals",
  },
  {
    icon: MapPin,
    title: "Indian Road Intelligence",
    description: "Built for auto-rickshaws, uneven roads, dense traffic, and local hazards.",
    highlight: "Auto-rickshaws · Dense traffic",
  },
  {
    icon: AlertTriangle,
    title: "Smart Collision Warning",
    description: "Risk-based alerts before a situation turns dangerous.",
    highlight: "Early brake assist · Risk scoring",
  },
  {
    icon: Volume2,
    title: "Hindi + English Voice Alerts",
    description: "Speaks to the driver in Hindi and English for faster reaction.",
    highlight: "हिंदी + English · Hands-free",
  },
  {
    icon: Eye,
    title: "Explainable Safety View",
    description: "Highlights exactly which object triggered the warning on screen.",
    highlight: "Visual heatmap · Clear reason",
  },
  {
    icon: WifiOff,
    title: "Offline Edge Operation",
    description: "Keeps working on highways and rural roads without cloud or network.",
    highlight: "No internet needed · Edge AI",
  },
];

export default function FeatureCards() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="section-padding bg-sentinel-bg-soft relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <span className="pill-badge bg-sentinel-accent-soft text-sentinel-ink border border-sentinel-accent/50 mb-4">
            ADAS Features
          </span>
          <h2 className="section-title font-display">Safety Built for Every Drive</h2>
          <p className="section-subtitle mx-auto mt-4 font-body">
            Tap a feature to explore — six core capabilities that protect drivers on Indian roads.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const isActive = active === i;

            return (
              <button
                key={feature.title}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`feature-card text-left glass-card p-6 border transition-all duration-300 group ${
                  isActive
                    ? "feature-card-active border-sentinel-accent border-l-4 border-l-sentinel-accent-dark"
                    : "border-sentinel-border-subtle hover:border-sentinel-accent/50"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-sentinel-accent/10 to-sentinel-bg-soft opacity-0 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "group-hover:opacity-50"
                  }`}
                />

                <div className="relative z-10">
                  <div
                    className={`icon-chip mb-4 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-display font-bold text-sentinel-ink">{feature.title}</h3>
                  <p className="text-sm text-sentinel-muted mt-2 leading-relaxed font-body">
                    {feature.description}
                  </p>

                  <div
                    className={`mt-4 flex items-center justify-between transition-all duration-300 ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-60 sm:opacity-80"
                    }`}
                  >
                    <span className="text-xs font-display font-medium text-sentinel-muted bg-sentinel-bg px-3 py-1 rounded-full border border-sentinel-border">
                      {feature.highlight}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 text-sentinel-ink transition-transform duration-300 ${
                        isActive ? "translate-x-1" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 glass-card px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-sentinel-accent/30 bg-sentinel-bg-soft">
          <div>
            <p className="text-xs font-display font-bold text-sentinel-muted uppercase tracking-wider">
              Featured capability
            </p>
            <p className="font-display font-bold text-lg text-sentinel-ink mt-0.5">
              {FEATURES[active].title}
            </p>
          </div>
          <p className="text-sm text-sentinel-muted font-body max-w-md">{FEATURES[active].description}</p>
        </div>
      </div>
    </section>
  );
}

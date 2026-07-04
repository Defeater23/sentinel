import { MapPin, AlertTriangle, Lightbulb, Users, ArrowDown, Camera } from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Watches the Road",
    description: "Camera feed scans the scene in real time.",
    icon: Camera,
  },
  {
    step: 2,
    title: "Spots Indian Road Hazards",
    description: "Detects potholes, pedestrians, animals, auto-rickshaws, trucks, cracks, and road obstacles.",
    icon: MapPin,
  },
  {
    step: 3,
    title: "Understands Danger Level",
    description: "Scores the scene based on distance, position, object type, and urgency.",
    icon: AlertTriangle,
  },
  {
    step: 4,
    title: "Explains the Alert",
    description: "Highlights the risky object and tells the driver why the alert fired.",
    icon: Lightbulb,
  },
  {
    step: 5,
    title: "Learns Across the Fleet",
    description: "Improves fleet intelligence without uploading raw camera footage.",
    icon: Users,
  },
];

export default function PipelineSection() {
  return (
    <section id="protect" className="section-padding bg-sentinel-bg-soft">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="pill-badge bg-sentinel-accent-soft text-sentinel-ink border border-sentinel-accent/50 mb-4">
            How It Works
          </span>
          <h2 className="section-title font-display">How SENTINEL Protects the Driver</h2>
          <p className="section-subtitle mx-auto mt-4 font-body">
            From watching the road to warning the driver — every step is built for real Indian driving conditions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.slice(0, 3).map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </div>

        <div className="flex justify-center my-5">
          <ArrowDown className="w-5 h-5 text-sentinel-muted-light" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {STEPS.slice(3).map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }) {
  const Icon = step.icon;
  return (
    <div className="glass-card p-6 border border-sentinel-border-subtle hover:border-sentinel-accent/50 hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="icon-chip group-hover:bg-sentinel-accent/30 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-sentinel-muted font-display tabular-nums">
          0{step.step}
        </span>
      </div>
      <h3 className="text-lg font-display font-bold text-sentinel-ink">{step.title}</h3>
      <p className="text-sm text-sentinel-muted mt-2 leading-relaxed font-body">{step.description}</p>
    </div>
  );
}

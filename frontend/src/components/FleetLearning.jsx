import { Car, Server, Shield, ArrowDown, Lock, Filter, Sparkles } from "lucide-react";

const VEHICLES = [
  { id: 1, label: "Vehicle 1", update: "Local safety insights captured" },
  { id: 2, label: "Vehicle 2", update: "Local safety insights captured" },
  { id: 3, label: "Vehicle 3", update: "Local safety insights captured" },
];

const BENEFITS = [
  { icon: Shield, title: "No raw video upload", desc: "Camera footage never leaves the vehicle." },
  { icon: Filter, title: "Only summarized safety updates", desc: "Anonymous insights shared, not personal data." },
  { icon: Lock, title: "Secure aggregation", desc: "Encrypted updates combined on a trusted server." },
  { icon: Sparkles, title: "Better safety for the full fleet", desc: "Every vehicle gets smarter over time." },
];

export default function FleetLearning() {
  return (
    <section id="fleet" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="pill-badge bg-sentinel-accent-soft text-sentinel-ink border border-sentinel-accent/50 mb-4">
              <Lock className="w-3 h-3" />
              Privacy-First
            </span>
            <h2 className="section-title font-display">Privacy-First Fleet Learning</h2>
            <p className="section-subtitle mt-4 font-body">
              Every vehicle can help improve safety without exposing raw driving footage.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-4 rounded-xl surface-muted hover:border-sentinel-accent/40 transition-colors"
                >
                  <Icon className="w-5 h-5 text-sentinel-accent-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-sentinel-ink font-display">{title}</p>
                    <p className="text-xs text-sentinel-muted mt-0.5 font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="space-y-3">
              {VEHICLES.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-4 p-4 rounded-xl surface-muted"
                >
                  <div className="icon-chip !p-2.5">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-sentinel-ink font-display">{v.label}</p>
                    <p className="text-xs text-sentinel-muted font-body">{v.update}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center my-4">
              <ArrowDown className="w-5 h-5 text-sentinel-muted-light animate-bounce" />
            </div>

            <div className="p-5 rounded-xl bg-sentinel-accent-soft border border-sentinel-accent/40 text-center">
              <Filter className="w-6 h-6 mx-auto mb-2 text-sentinel-ink" />
              <p className="font-display font-bold text-sentinel-ink">Privacy Filter</p>
              <p className="text-xs text-sentinel-muted mt-1 font-body">Strips personal data before sharing</p>
            </div>

            <div className="flex justify-center my-4">
              <ArrowDown className="w-5 h-5 text-sentinel-muted-light animate-bounce" />
            </div>

            <div className="p-5 rounded-xl bg-sentinel-ink text-white text-center">
              <Server className="w-6 h-6 mx-auto mb-2 text-sentinel-accent" />
              <p className="font-display font-bold">Secure Fleet Server</p>
              <p className="text-xs text-white/60 mt-1 font-body">Combines anonymous safety updates</p>
            </div>

            <div className="flex justify-center my-4">
              <ArrowDown className="w-5 h-5 text-sentinel-muted-light animate-bounce" />
            </div>

            <div className="p-5 rounded-xl bg-sage-gradient text-white text-center shadow-glow">
              <p className="font-display font-bold text-lg">Improved ADAS Intelligence</p>
              <p className="text-xs text-white/85 mt-1 font-body">Safer driving for every vehicle in the fleet</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const SCENARIO_OPTIONS = [
  { key: "auto", label: "Auto cycle", color: "#64748B" },
  { key: "LOW", label: "Clear road", color: "#059669" },
  { key: "MEDIUM", label: "Medium", color: "#D97706" },
  { key: "HIGH", label: "High", color: "#EA580C" },
  { key: "CRITICAL", label: "Critical", color: "#E11D48" },
];

export default function DemoScenarioPicker({ value, onChange, disabled }) {
  if (disabled) return null;

  return (
    <div className="glass-card-dark p-3 sm:p-4">
      <p className="text-[10px] sm:text-xs font-display font-semibold text-sentinel-muted uppercase tracking-widest mb-2">
        Demo Scenario
      </p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {SCENARIO_OPTIONS.map(({ key, label, color }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-all duration-200 border ${
                active
                  ? "text-white shadow-md scale-105"
                  : "bg-sentinel-bg-soft text-sentinel-muted border-sentinel-border hover:border-sentinel-accent/40"
              }`}
              style={
                active ? { backgroundColor: color, borderColor: color } : undefined
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

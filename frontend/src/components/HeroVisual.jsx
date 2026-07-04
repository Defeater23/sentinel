import { useState } from "react";
import { ScanLine, Volume2, WifiOff, AlertTriangle, MapPin } from "lucide-react";

const BADGES = [
  { icon: ScanLine, label: "Live Hazard Detection", pos: "top-4 -left-2 lg:-left-6", delay: "0s" },
  { icon: Volume2, label: "Hindi Voice Alerts", pos: "top-16 -right-2 lg:-right-8", delay: "0.5s" },
  { icon: WifiOff, label: "Offline Edge AI", pos: "bottom-28 -left-4 lg:-left-10", delay: "1s" },
  { icon: AlertTriangle, label: "Smart Brake Warning", pos: "bottom-16 -right-2 lg:-right-6", delay: "1.5s" },
  { icon: MapPin, label: "Indian Road Ready", pos: "bottom-4 left-1/2 -translate-x-1/2", delay: "2s" },
];

export default function HeroVisual() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px]">
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-glass-lg border border-sentinel-border bg-sentinel-accent-soft">
        {!imgFailed ? (
          <img
            src="/sentinel-hero-car.png"
            alt="SENTINEL ADAS safety system on Indian roads"
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <HeroFallback />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
      </div>

      <div className="absolute top-8 right-6 lg:right-10 glass-card px-4 py-3 z-20 animate-float max-w-[200px] bg-white/95 border-sentinel-border">
        <p className="text-[10px] font-bold text-sentinel-danger uppercase tracking-wider">Critical Alert</p>
        <p className="text-sm font-bold text-sentinel-ink mt-0.5 leading-tight">Pothole Ahead</p>
        <p className="text-xs text-sentinel-muted mt-1 font-body">Brake Assist Suggested</p>
      </div>

      {BADGES.map(({ icon: Icon, label, pos, delay }) => (
        <div
          key={label}
          className={`absolute ${pos} z-20 glass-card px-3 py-2 flex items-center gap-2 shadow-glass animate-float bg-white/95`}
          style={{ animationDelay: delay }}
        >
          <div className="p-1.5 rounded-lg bg-sentinel-accent-soft">
            <Icon className="w-3.5 h-3.5 text-sentinel-ink" />
          </div>
          <span className="text-xs font-semibold text-sentinel-ink whitespace-nowrap font-display">{label}</span>
        </div>
      ))}
    </div>
  );
}

function HeroFallback() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-sentinel-accent via-sentinel-accent-soft to-sentinel-bg">
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-sentinel-accent-dark/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-12 h-full flex flex-col justify-around opacity-40">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-6 bg-white/80 rounded-sm" />
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-44 h-16">
        <div className="absolute bottom-0 w-full h-9 bg-sentinel-ink/80 rounded-t-3xl" />
        <div className="absolute -bottom-1 left-5 w-9 h-9 rounded-full bg-sentinel-ink border-4 border-sentinel-muted" />
        <div className="absolute -bottom-1 right-5 w-9 h-9 rounded-full bg-sentinel-ink border-4 border-sentinel-muted" />
      </div>

      <div className="absolute top-[38%] left-[22%] w-20 h-14 border-2 border-sentinel-danger rounded-lg">
        <span className="absolute -top-5 left-0 text-[10px] font-bold text-sentinel-danger bg-white px-1.5 py-0.5 rounded">
          pothole 91%
        </span>
      </div>
    </div>
  );
}

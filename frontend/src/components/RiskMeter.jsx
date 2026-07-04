import { useEffect, useRef, useState } from "react";
import { getRiskColor } from "../utils/riskColors";

export default function RiskMeter({ score = 0, label = "LOW" }) {
  const canvasRef = useRef(null);
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const start = displayScore;
    const target = score * 100;
    const startTime = performance.now();
    const duration = 600;

    const animate = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(start + (target - start) * eased);
      if (t < 1) animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 120;
    const cy = 115;
    const r = 85;
    const color = getRiskColor(label);

    ctx.clearRect(0, 0, 240, 150);

    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.stroke();

    const progress = Math.min(1, displayScore / 100);
    const endAngle = Math.PI + progress * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.stroke();

    const glowX = cx + r * Math.cos(endAngle);
    const glowY = cy + r * Math.sin(endAngle);
    ctx.beginPath();
    ctx.arc(glowX, glowY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = "bold 36px Museo, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(displayScore.toFixed(0), cx, cy + 8);

    ctx.fillStyle = "#9CA3AF";
    ctx.font = "500 11px Forum, serif";
    ctx.fillText("DRIVING RISK", cx, cy + 28);
  }, [displayScore, label]);

  const color = getRiskColor(label);

  return (
    <div className="glass-card-dark p-6 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <p className="text-xs font-semibold text-sentinel-gray uppercase tracking-widest">
          Current Driving Risk
        </p>
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      </div>
      <canvas ref={canvasRef} width={240} height={150} className="w-full max-w-[240px]" />
      <div
        className="mt-3 px-4 py-1.5 rounded-full text-sm font-display font-bold tracking-wide transition-colors duration-500"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {label}
      </div>
    </div>
  );
}

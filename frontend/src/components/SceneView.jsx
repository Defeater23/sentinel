import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, Wifi, WifiOff } from "lucide-react";
import { getRiskColor, getClassColor } from "../utils/riskColors";
import { drawAnimatedRoad } from "../utils/animatedRoad";

export default function SceneView({
  videoRef,
  detections = [],
  saliencyMap,
  riskLabel = "LOW",
  connected,
  onVideoReady,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const saliencyImgRef = useRef(null);
  const [videoMissing, setVideoMissing] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef?.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    if (video && videoLoaded && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, W, H);
    } else {
      drawAnimatedRoad(ctx, W, H, Date.now());
    }

    // Saliency overlay
    if (saliencyMap && saliencyImgRef.current?.complete) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(saliencyImgRef.current, 0, 0, W, H);
      ctx.globalAlpha = 1.0;
    }

    // Bounding boxes
    const riskColor = getRiskColor(riskLabel);
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox;
      const bx = x1 * W;
      const by = y1 * H;
      const bw = (x2 - x1) * W;
      const bh = (y2 - y1) * H;
      const color = getClassColor(det.class_name);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, by, bw, bh);

      // Corner accents
      const cornerLen = Math.min(16, bw / 4, bh / 4);
      ctx.lineWidth = 3;
      [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(
        ([cx, cy, dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cornerLen * dx, cy);
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + cornerLen * dy);
          ctx.stroke();
        }
      );

      // Label background
      const label = `${det.class_name} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = "bold 11px Museo, sans-serif";
      const textW = ctx.measureText(label).width + 12;
      ctx.fillStyle = color;
      ctx.fillRect(bx, by - 22, textW, 20);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, bx + 6, by - 8);
    });

    // Scan line effect
    const scanY = (Date.now() / 20) % H;
    ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(W, scanY);
    ctx.stroke();
  }, [videoRef, detections, saliencyMap, riskLabel, videoLoaded]);

  useEffect(() => {
    if (saliencyMap) {
      const img = new Image();
      img.onload = () => {
        saliencyImgRef.current = img;
      };
      img.onerror = () => {
        saliencyImgRef.current = null;
      };
      img.src = `data:image/png;base64,${saliencyMap}`;
    } else {
      saliencyImgRef.current = null;
    }
  }, [saliencyMap]);

  useEffect(() => {
    const loop = () => {
      drawFrame();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawFrame]);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleLoaded = () => {
      setVideoLoaded(true);
      setVideoMissing(false);
      onVideoReady?.();
    };
    const handleError = () => {
      setVideoMissing(true);
      setVideoLoaded(false);
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);

    if (video.readyState >= 2) handleLoaded();

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("error", handleError);
    };
  }, [videoRef, onVideoReady]);

  const riskColor = getRiskColor(riskLabel);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-sentinel-accent-dark shadow-glass-lg group border border-sentinel-border">
      <canvas ref={canvasRef} width={960} height={540} className="w-full h-auto block" />

      {/* Risk badge */}
      <div
        className="absolute top-4 left-4 pill-badge backdrop-blur-md border"
        style={{
          backgroundColor: `${riskColor}18`,
          color: riskColor,
          borderColor: `${riskColor}40`,
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: riskColor }}
        />
        {riskLabel} RISK
      </div>

      {/* Connection badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {!connected && (
          <span className="pill-badge bg-white/90 text-sentinel-ink border border-sentinel-border">
            DEMO MODE
          </span>
        )}
        <span
          className={`pill-badge backdrop-blur-md ${
            connected
              ? "bg-sentinel-success-soft/95 text-sentinel-success border border-sentinel-accent/50"
              : "bg-black/60 text-white border border-white/20"
          }`}
        >
          {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {connected ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {/* Bottom overlay controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 pill-badge bg-black/50 backdrop-blur-md text-white border border-white/10">
          <Camera className="w-3.5 h-3.5" />
          {videoLoaded && !videoMissing ? "Camera Feed" : "Simulated Road Feed"}
        </div>
        {saliencyMap && (
          <div className="pill-badge bg-sentinel-accent-soft/90 backdrop-blur-md text-sentinel-ink border border-sentinel-accent/50">
            XAI Heatmap Active
          </div>
        )}
      </div>

      {/* Hidden video element */}
      <video
        ref={videoRef}
        src="/demo_footage.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="hidden"
      />
    </div>
  );
}

/** Animated Indian-road placeholder when demo_footage.mp4 is unavailable */

export function drawAnimatedRoad(ctx, W, H, t) {
  const horizon = H * 0.42;
  const speed = t * 0.00012;

  // Sky — sage palette
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#E4EBDF");
  sky.addColorStop(0.6, "#D1DBCB");
  sky.addColorStop(1, "#A8BCA1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, horizon);

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(W * 0.75, horizon * 0.35, 60, 0, Math.PI * 2);
  ctx.fill();

  // Distant buildings silhouette
  ctx.fillStyle = "#4A5D42";
  for (let i = 0; i < 12; i++) {
    const bx = (i * W) / 10 - ((speed * 200) % (W / 10));
    const bh = 30 + (i % 4) * 25;
    ctx.fillRect(bx, horizon - bh, W / 12, bh);
  }

  // Road surface
  const roadGrad = ctx.createLinearGradient(0, horizon, 0, H);
  roadGrad.addColorStop(0, "#888888");
  roadGrad.addColorStop(1, "#555555");
  ctx.fillStyle = roadGrad;
  ctx.beginPath();
  ctx.moveTo(W * 0.15, horizon);
  ctx.lineTo(W * 0.85, horizon);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Road edge lines
  ctx.strokeStyle = "#ffffff44";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W * 0.15, horizon);
  ctx.lineTo(0, H);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.85, horizon);
  ctx.lineTo(W, H);
  ctx.stroke();

  // Center dashed lines (moving)
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 4;
  const dashOffset = (speed * 800) % 80;
  for (let y = horizon + 20; y < H; y += 50) {
    const progress = (y - horizon) / (H - horizon);
    const laneW = W * 0.7 * progress;
    const cx = W / 2;
    const dashH = 25 * progress + 8;
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(cx - 2, y + dashOffset - 80, 4, dashH);
  }

  // Dashboard / hood
  const hoodGrad = ctx.createLinearGradient(0, H * 0.72, 0, H);
  hoodGrad.addColorStop(0, "#1a1a2e");
  hoodGrad.addColorStop(1, "#0f0f1a");
  ctx.fillStyle = hoodGrad;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.78);
  ctx.lineTo(W, H * 0.78);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Windshield frame
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.moveTo(W * 0.2, H * 0.78);
  ctx.lineTo(W * 0.8, H * 0.78);
  ctx.lineTo(W * 0.72, H * 0.55);
  ctx.lineTo(W * 0.28, H * 0.55);
  ctx.closePath();
  ctx.fill();

  // AI scan grid on road area
  ctx.strokeStyle = "rgba(168, 188, 161, 0.2)";
  ctx.lineWidth = 1;
  const gridScroll = (speed * 400) % 40;
  for (let y = horizon; y < H * 0.78; y += 40) {
    const p = (y - horizon) / (H * 0.78 - horizon);
    const left = W * 0.15 + (W * 0.35) * (1 - p);
    const right = W * 0.85 - (W * 0.35) * (1 - p);
    ctx.beginPath();
    ctx.moveTo(left, y + gridScroll);
    ctx.lineTo(right, y + gridScroll);
    ctx.stroke();
  }

  // Simulated auto-rickshaw silhouette (moving)
  const rickX = W * 0.35 + Math.sin(t * 0.001) * 30;
  const rickY = H * 0.58;
  ctx.fillStyle = "#B45309";
  ctx.fillRect(rickX, rickY, 50, 30);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(rickX + 5, rickY - 20, 40, 22);

  // Demo label
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "11px Forum, serif";
  ctx.textAlign = "right";
  ctx.fillText("Simulated road feed · add demo_footage.mp4 for real video", W - 12, H - 12);
}

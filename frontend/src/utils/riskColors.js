export const RISK_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.3,
  HIGH: 0.6,
  CRITICAL: 0.8,
};

export const RISK_COLORS = {
  LOW: "#6B8F5E",
  MEDIUM: "#B45309",
  HIGH: "#C2410C",
  CRITICAL: "#B91C1C",
};

export const RISK_BG = {
  LOW: "rgba(107, 143, 94, 0.12)",
  MEDIUM: "rgba(180, 83, 9, 0.1)",
  HIGH: "rgba(194, 65, 12, 0.1)",
  CRITICAL: "rgba(185, 28, 28, 0.1)",
};

export const CLASS_COLORS = {
  car: "#4A5D42",
  truck: "#555555",
  bus: "#666666",
  motorcycle: "#8FA886",
  bicycle: "#6B8F5E",
  pedestrian: "#6B8F5E",
  rider: "#5A7A50",
  auto_rickshaw: "#B45309",
  animal: "#B91C1C",
  cattle: "#B91C1C",
  dog: "#B91C1C",
  traffic_sign: "#4A5D42",
  traffic_light: "#888888",
  vehicle_fallback: "#888888",
  pothole: "#C2410C",
  crack: "#B45309",
  hazard: "#B91C1C",
  construction_debris: "#B91C1C",
  speed_breaker: "#B45309",
  cycle_rickshaw: "#8FA886",
  handcart: "#A8BCA1",
  tractor: "#666666",
  default: "#888888",
};

export const CLASS_ALIASES = {
  cattle: "animal",
  dog: "animal",
  construction_debris: "hazard",
  speed_breaker: "hazard",
  cycle_rickshaw: "vehicle",
  handcart: "vehicle",
  tractor: "vehicle",
};

export function getRiskLabel(score) {
  if (score >= RISK_THRESHOLDS.CRITICAL) return "CRITICAL";
  if (score >= RISK_THRESHOLDS.HIGH) return "HIGH";
  if (score >= RISK_THRESHOLDS.MEDIUM) return "MEDIUM";
  return "LOW";
}

export function getRiskColor(label) {
  return RISK_COLORS[label] || RISK_COLORS.LOW;
}

export function getClassColor(className) {
  const normalized = CLASS_ALIASES[className] || className;
  return CLASS_COLORS[normalized] || CLASS_COLORS[className] || CLASS_COLORS.default;
}

export function normalizeClassName(className) {
  return CLASS_ALIASES[className] || className;
}

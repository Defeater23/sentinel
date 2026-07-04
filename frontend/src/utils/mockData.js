import { getRiskLabel } from "./riskColors";

export const SCENARIOS = {
  LOW: {
    name: "LOW",
    risk_score: 0.15,
    recommended_action: "Continue driving",
    detections: [{ class_id: 0, class_name: "car", confidence: 0.88, bbox: [0.55, 0.48, 0.78, 0.72] }],
    alert: { fire: false, english: "", hindi: "", level: "LOW" },
    scene_graph: {
      nodes: [
        { id: "ego", label: "your vehicle", type: "ego" },
        { id: "obj_0", label: "car", type: "vehicle" },
      ],
      edges: [{ source: "ego", target: "obj_0", relation: "following" }],
    },
  },
  MEDIUM: {
    name: "MEDIUM",
    risk_score: 0.42,
    recommended_action: "Stay alert",
    detections: [
      { class_id: 6, class_name: "auto_rickshaw", confidence: 0.81, bbox: [0.28, 0.52, 0.48, 0.85] },
      { class_id: 5, class_name: "pedestrian", confidence: 0.76, bbox: [0.62, 0.4, 0.72, 0.78] },
    ],
    alert: { fire: false, english: "", hindi: "", level: "MEDIUM" },
    scene_graph: {
      nodes: [
        { id: "ego", label: "your vehicle", type: "ego" },
        { id: "obj_0", label: "auto-rickshaw", type: "vehicle" },
        { id: "obj_1", label: "pedestrian", type: "hazard" },
      ],
      edges: [
        { source: "ego", target: "obj_0", relation: "near" },
        { source: "ego", target: "obj_1", relation: "approaching" },
      ],
    },
  },
  HIGH: {
    name: "HIGH",
    risk_score: 0.68,
    recommended_action: "Slow down",
    detections: [
      { class_id: 9, class_name: "pothole", confidence: 0.89, bbox: [0.35, 0.58, 0.55, 0.75] },
      { class_id: 1, class_name: "truck", confidence: 0.91, bbox: [0.08, 0.35, 0.38, 0.78] },
    ],
    alert: {
      fire: true,
      english: "CAUTION: pothole and truck ahead. Reduce speed.",
      hindi: "सावधान: आगे गड्ढा और ट्रक है। गति कम करें।",
      level: "HIGH",
    },
    scene_graph: {
      nodes: [
        { id: "ego", label: "your vehicle", type: "ego" },
        { id: "obj_0", label: "pothole", type: "hazard" },
        { id: "obj_1", label: "truck", type: "vehicle" },
      ],
      edges: [
        { source: "ego", target: "obj_0", relation: "approaching" },
        { source: "ego", target: "obj_1", relation: "following" },
      ],
    },
  },
  CRITICAL: {
    name: "CRITICAL",
    risk_score: 0.88,
    recommended_action: "Brake / Avoid obstacle",
    detections: [
      { class_id: 7, class_name: "animal", confidence: 0.93, bbox: [0.38, 0.45, 0.52, 0.65] },
      { class_id: 9, class_name: "pothole", confidence: 0.87, bbox: [0.42, 0.62, 0.58, 0.78] },
    ],
    alert: {
      fire: true,
      english: "Warning: hazard ahead. Brake assist recommended.",
      hindi: "चेतावनी: आगे खतरा है। कृपया ब्रेक लगाएं।",
      level: "CRITICAL",
    },
    scene_graph: {
      nodes: [
        { id: "ego", label: "your vehicle", type: "ego" },
        { id: "obj_0", label: "animal", type: "hazard" },
        { id: "obj_1", label: "pothole", type: "hazard" },
      ],
      edges: [
        { source: "ego", target: "obj_0", relation: "approaching" },
        { source: "ego", target: "obj_1", relation: "approaching" },
      ],
    },
  },
};

const SCENARIO_ORDER = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
let autoIndex = 0;

function buildResponse(scenario) {
  const jitter = () => (Math.random() - 0.5) * 0.03;

  const detections = scenario.detections.map((d) => ({
    ...d,
    confidence: Math.min(0.99, Math.max(0.5, d.confidence + jitter())),
    bbox: d.bbox.map((v) => Math.min(0.98, Math.max(0.02, v + jitter() * 0.3))),
  }));

  const risk_score = Math.min(0.99, Math.max(0.05, scenario.risk_score + jitter()));
  const risk_label = getRiskLabel(risk_score);

  return {
    detections,
    risk_score,
    risk_label,
    recommended_action: scenario.recommended_action,
    saliency_map: null,
    scene_graph: scenario.scene_graph,
    alert: {
      ...scenario.alert,
      fire: scenario.alert.fire || risk_label === "CRITICAL" || risk_label === "HIGH",
      level: risk_label,
    },
    latency_ms: 42 + Math.random() * 20,
    timestamp: Date.now() / 1000,
    sensor_status: {
      camera: "Online",
      lidar: "Missing",
      radar: "Simulated",
      imu: "Simulated",
      gps: "Online",
      edge_device: "Online",
      websocket: "Simulated",
    },
  };
}

/** @param {'auto'|'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} mode */
export function generateMockResponse(mode = "auto") {
  if (mode === "auto") {
    const key = SCENARIO_ORDER[autoIndex];
    autoIndex = (autoIndex + 1) % SCENARIO_ORDER.length;
    return buildResponse(SCENARIOS[key]);
  }
  return buildResponse(SCENARIOS[mode] || SCENARIOS.LOW);
}

export const SAMPLE_JSON_RESPONSE = {
  detections: [{ class_name: "pothole", confidence: 0.91, bbox: [0.31, 0.44, 0.62, 0.79] }],
  risk_score: 0.83,
  risk_label: "CRITICAL",
  alert: {
    fire: true,
    english: "Warning: hazard ahead. Brake assist recommended.",
    hindi: "चेतावनी: आगे खतरा है। कृपया ब्रेक लगाएं।",
    level: "CRITICAL",
  },
  latency_ms: 47.3,
};

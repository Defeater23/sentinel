import { useState } from "react";
import { Shield, Clock, WifiOff, ChevronDown, ChevronUp } from "lucide-react";
import SceneView from "./SceneView";
import RiskMeter from "./RiskMeter";
import AlertBanner from "./AlertBanner";
import SceneGraph from "./SceneGraph";
import SensorStatus from "./SensorStatus";
import DetectionPanel from "./DetectionPanel";
import RecommendedAction from "./RecommendedAction";
import DriverVoiceAlert from "./DriverVoiceAlert";
import DemoScenarioPicker from "./DemoScenarioPicker";
import { getRiskColor } from "../utils/riskColors";

export default function LiveDashboard({
  inferenceData,
  connected,
  videoRef,
  onVideoReady,
  voiceMuted,
  onToggleVoice,
  demoScenario,
  onDemoScenarioChange,
}) {
  const [sensorsOpen, setSensorsOpen] = useState(false);
  const data = inferenceData || {};
  const riskLabel = data.risk_label || "LOW";
  const isEmergency = riskLabel === "HIGH" || riskLabel === "CRITICAL";

  const emergencyStrip = isEmergency ? (
    <div
      className={`px-4 py-3 rounded-2xl flex items-center gap-3 border-2 ${
        riskLabel === "CRITICAL"
          ? "bg-sentinel-danger-soft border-rose-300 animate-pulse-critical"
          : "bg-sentinel-warning-soft border-amber-300"
      }`}
    >
      <span
        className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
        style={{ backgroundColor: getRiskColor(riskLabel) }}
      />
      <p className="font-display font-bold text-sm sm:text-base" style={{ color: getRiskColor(riskLabel) }}>
        {riskLabel === "CRITICAL"
          ? "Emergency — immediate driver action required"
          : "Elevated risk — slow down and stay alert"}
      </p>
    </div>
  ) : null;

  return (
    <section id="dashboard" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-sentinel-accent-dark" />
                  <span className="pill-badge bg-sentinel-accent-soft text-sentinel-ink border border-sentinel-accent/40">
                    Live Safety
                  </span>
                  {!connected && (
                    <span className="pill-badge bg-sentinel-bg-soft text-sentinel-muted border border-sentinel-border">
                      <WifiOff className="w-3 h-3" />
                      Offline Mode Ready
                    </span>
                  )}
                </div>
                <h2 className="section-title font-display">Live Safety Dashboard</h2>
                <p className="section-subtitle mt-2 font-body">
                  See hazards, risk level, alerts, and scene understanding in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start">
                {data.latency_ms != null && connected && (
                  <div className="flex items-center gap-2 glass-card px-3 py-2">
                    <Clock className="w-4 h-4 text-sentinel-muted" />
                    <span className="text-sm font-semibold text-sentinel-ink">
                      {data.latency_ms.toFixed(0)}ms
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block">
              <DemoScenarioPicker
                value={demoScenario}
                onChange={onDemoScenarioChange}
                disabled={connected}
              />
            </div>
          </div>

          {/* Mobile sticky bar */}
          {!connected && (
            <div className="md:hidden sticky top-16 z-40 -mx-4 px-4 py-2 bg-white/95 backdrop-blur-md border-b border-sentinel-border-subtle mb-4 space-y-2">
              {emergencyStrip}
              <DemoScenarioPicker
                value={demoScenario}
                onChange={onDemoScenarioChange}
                disabled={connected}
              />
            </div>
          )}

          <div className="hidden md:block mb-6">{emergencyStrip}</div>

          {data.alert?.fire && (
            <div className="mb-4 md:mb-6">
              <AlertBanner alert={data.alert} />
            </div>
          )}

          {/* Mobile quick stats */}
          <div className="lg:hidden grid grid-cols-2 gap-3 mb-4">
            <RiskMeter score={data.risk_score ?? 0} label={riskLabel} />
            <div className="glass-card-dark p-4 flex flex-col justify-center text-center">
              <p className="text-[10px] font-display font-semibold text-sentinel-gray uppercase tracking-widest mb-1">
                Driver Alert
              </p>
              {data.alert?.fire ? (
                <p className="text-xs font-semibold text-sentinel-red">Active warning</p>
              ) : (
                <p className="text-xs text-sentinel-gray font-body">Monitoring</p>
              )}
              <button
                type="button"
                onClick={onToggleVoice}
                className="mt-2 text-[10px] font-display font-semibold text-sentinel-ink underline"
              >
                {voiceMuted ? "Unmute voice" : "Mute voice"}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              <SceneView
                videoRef={videoRef}
                detections={data.detections || []}
                saliencyMap={data.saliency_map}
                riskLabel={riskLabel}
                connected={connected}
                onVideoReady={onVideoReady}
              />
              <RecommendedAction riskLabel={riskLabel} />
            </div>

            <div className="hidden lg:block space-y-6">
              <RiskMeter score={data.risk_score ?? 0} label={riskLabel} />
              <DriverVoiceAlert
                alert={data.alert}
                voiceMuted={voiceMuted}
                onToggleVoice={onToggleVoice}
              />
              <SensorStatus sensorStatus={data.sensor_status} connected={connected} />
              <div className="glass-card-dark p-5 text-center">
                <p className="text-xs font-semibold text-sentinel-gray uppercase tracking-widest mb-2">
                  Driver Alert Status
                </p>
                {data.alert?.fire ? (
                  <p className="text-sm font-semibold text-sentinel-red">Active warning in progress</p>
                ) : (
                  <>
                    <p className="text-sm text-sentinel-gray font-body">Monitoring — no active warnings</p>
                    <div className="mt-3 flex justify-center">
                      <span className="live-dot" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Detection + graph */}
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mt-4 lg:mt-6">
            <DetectionPanel detections={data.detections || []} riskLabel={riskLabel} />
            <SceneGraph data={data.scene_graph} title="Road Scene Understanding" />
          </div>

          {/* Mobile sensors — collapsible */}
          <div className="lg:hidden mt-4">
            <button
              type="button"
              onClick={() => setSensorsOpen(!sensorsOpen)}
              className="w-full glass-card-dark p-4 flex items-center justify-between"
            >
              <span className="text-xs font-display font-semibold text-sentinel-gray uppercase tracking-widest">
                Vehicle Sensor Status
              </span>
              {sensorsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {sensorsOpen && (
              <div className="mt-2">
                <SensorStatus sensorStatus={data.sensor_status} connected={connected} />
              </div>
            )}
          </div>
        </div>
    </section>
  );
}

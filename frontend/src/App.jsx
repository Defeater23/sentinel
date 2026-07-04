import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LiveDashboard from "./components/LiveDashboard";
import FeatureCards from "./components/FeatureCards";
import PipelineSection from "./components/PipelineSection";
import FleetLearning from "./components/FleetLearning";
import ScrollReveal from "./components/ScrollReveal";
import { useWebSocket } from "./hooks/useWebSocket";
import { useVoiceAlert } from "./hooks/useVoiceAlert";
import { generateMockResponse } from "./utils/mockData";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/stream";
const MOCK_INTERVAL_MS = 2500;

export default function App() {
  const { lastMessage, sendJson, connected } = useWebSocket(WS_URL);
  const { speak, muted, toggleMute } = useVoiceAlert();
  const [inferenceData, setInferenceData] = useState(null);
  const [demoScenario, setDemoScenario] = useState("auto");
  const videoRef = useRef(null);

  useEffect(() => {
    if (!lastMessage || !connected) return;
    try {
      const data = typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;
      setInferenceData(data);
      if (data.alert?.fire) speak(data.alert);
    } catch {
      /* ignore */
    }
  }, [lastMessage, connected, speak]);

  const refreshMock = useCallback(
    (scenario = demoScenario) => {
      const mock = generateMockResponse(scenario);
      setInferenceData(mock);
      if (mock.alert?.fire) speak(mock.alert);
    },
    [demoScenario, speak]
  );

  useEffect(() => {
    if (connected) return;

    refreshMock(demoScenario);

    const interval = setInterval(() => refreshMock(demoScenario), MOCK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [connected, demoScenario, refreshMock]);

  const handleScenarioChange = (scenario) => {
    setDemoScenario(scenario);
    if (!connected) refreshMock(scenario);
  };

  useEffect(() => {
    if (!connected) return;

    const captureAndSend = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 640;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, 640, 640);
        sendJson({
          camera_frame: canvas.toDataURL("image/jpeg", 0.8).split(",")[1],
          frame_id: Date.now(),
          timestamp: Date.now() / 1000,
        });
      } catch {
        /* silent */
      }
    };

    const interval = setInterval(captureAndSend, 100);
    return () => clearInterval(interval);
  }, [connected, sendJson]);

  return (
    <div className="site-frame">
      <div className="site-shell">
      <Navbar connected={connected} />
      <Hero />

      <ScrollReveal>
        <LiveDashboard
          inferenceData={inferenceData}
          connected={connected}
          videoRef={videoRef}
          onVideoReady={() => {}}
          voiceMuted={muted}
          onToggleVoice={toggleMute}
          demoScenario={demoScenario}
          onDemoScenarioChange={handleScenarioChange}
        />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <FeatureCards />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <PipelineSection />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <FleetLearning />
      </ScrollReveal>

      <footer className="py-8 text-center text-sm text-sentinel-muted border-t border-sentinel-border-subtle bg-sentinel-bg-soft font-body">
        <p className="font-display font-semibold text-sentinel-ink">SENTINEL</p>
        <p className="mt-1">Your AI Co-Pilot for Safer Indian Roads</p>
      </footer>
      </div>
    </div>
  );
}

import { useCallback, useRef, useState } from "react";

const COOLDOWN_MS = 4000;

export function useVoiceAlert() {
  const [muted, setMuted] = useState(false);
  const lastSpoken = useRef("");
  const lastTime = useRef(0);
  const cooldownTimer = useRef(null);

  const stopAlerts = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      if (!prev) stopAlerts();
      return !prev;
    });
  }, [stopAlerts]);

  const speak = useCallback(
    (alert) => {
      if (muted) return;
      if (!alert?.fire) return;
      if (!window.speechSynthesis) return;

      const hindi = alert.hindi?.trim();
      const english = alert.english?.trim();
      const text = hindi || english;
      if (!text) return;

      const now = Date.now();
      if (text === lastSpoken.current && now - lastTime.current < COOLDOWN_MS) {
        return;
      }

      lastSpoken.current = text;
      lastTime.current = now;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = hindi ? "hi-IN" : "en-IN";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        cooldownTimer.current = setTimeout(() => {
          lastSpoken.current = "";
        }, COOLDOWN_MS);
      };

      window.speechSynthesis.speak(utterance);
    },
    [muted]
  );

  return { speak, muted, toggleMute, stopAlerts };
};

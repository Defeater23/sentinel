import { Volume2, VolumeX, Mic } from "lucide-react";

export default function DriverVoiceAlert({ alert, voiceMuted, onToggleVoice }) {
  const hasAlert = alert?.fire && (alert.english || alert.hindi);

  return (
    <div className="glass-card-dark p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {voiceMuted ? (
            <VolumeX className="w-4 h-4 text-sentinel-muted" />
          ) : (
            <Volume2 className="w-4 h-4 text-sentinel-ink" />
          )}
          <p className="text-xs font-semibold text-sentinel-muted uppercase tracking-widest">
            Driver Voice Alert
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleVoice}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors font-display ${
            voiceMuted
              ? "bg-sentinel-ink text-white hover:bg-sentinel-primary-dark"
              : "bg-sentinel-bg-soft text-sentinel-muted hover:bg-sentinel-accent-soft border border-sentinel-border"
          }`}
        >
          {voiceMuted ? "Unmute" : "Mute alerts"}
        </button>
      </div>

      {voiceMuted && (
        <p className="text-xs text-sentinel-muted mb-3 px-1 font-body">Voice alerts paused for this demo.</p>
      )}

      {hasAlert ? (
        <div className="space-y-3">
          {alert.hindi && (
            <div className="p-3 rounded-xl bg-sentinel-accent-soft border border-sentinel-accent/40">
              <p className="text-[10px] font-bold text-sentinel-ink uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mic className="w-3 h-3" /> Hindi
              </p>
              <p className="hindi-text text-base font-semibold text-sentinel-ink leading-snug">
                {alert.hindi}
              </p>
            </div>
          )}
          {alert.english && (
            <div className="p-3 rounded-xl surface-muted">
              <p className="text-[10px] font-bold text-sentinel-muted uppercase tracking-wider mb-1">
                English
              </p>
              <p className="text-sm font-semibold text-sentinel-ink leading-snug font-body">
                {alert.english}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <Mic className="w-8 h-8 text-sentinel-border mx-auto mb-2" />
          <p className="text-sm text-sentinel-muted font-body">No voice alert — scene is safe</p>
        </div>
      )}
    </div>
  );
}

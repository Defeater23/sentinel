import { useState } from "react";
import { ArrowRight } from "lucide-react";
import HeroVisual from "./HeroVisual";
import ScrollReveal from "./ScrollReveal";

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-mesh-hero pointer-events-none" />
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-sentinel-accent/20 rounded-full blur-3xl" />

      <div className="relative section-padding w-full max-w-7xl mx-auto pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <ScrollReveal direction="left">
            <div>
              <div className="inline-flex items-center gap-2 pill-badge bg-sentinel-accent-soft text-sentinel-ink border border-sentinel-accent/40 mb-6">
                <span className="live-dot" />
                Edge AI · Indian Roads · Real-Time Safety
              </div>

              <h1 className="font-display text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[0.95] text-sentinel-ink">
                SENTINEL
              </h1>

              <p className="mt-5 text-xl sm:text-2xl font-display font-semibold text-sentinel-ink">
                Your AI Co-Pilot for Safer Indian Roads
              </p>

              <p className="mt-5 text-lg text-sentinel-muted max-w-lg leading-relaxed font-body">
                Detect hazards, understand risk, and alert the driver in real time — even without internet.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => scrollTo("dashboard")} className="btn-primary font-display">
                  Launch Safety Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => scrollTo("features")} className="btn-secondary font-display">
                  See ADAS Features
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <HeroVisual />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "#hero" },
  { label: "Live Safety", href: "#dashboard" },
  { label: "ADAS Features", href: "#features" },
  { label: "Fleet Privacy", href: "#fleet" },
];

export default function Navbar({ connected }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-glass border-b border-sentinel-border-subtle"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNav("#hero");
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sentinel-ink group-hover:bg-sentinel-primary-dark transition-colors flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold tracking-tight text-sentinel-ink block">
                SENTINEL
              </span>
              <span className="text-[10px] font-semibold text-sentinel-muted uppercase tracking-[0.15em] hidden sm:block">
                AI Safety · ADAS Co-Pilot
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="px-3.5 py-2 text-sm font-medium text-sentinel-muted hover:text-sentinel-ink rounded-full hover:bg-sentinel-bg-soft transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`pill-badge ${
                connected
                  ? "bg-sentinel-success-soft text-sentinel-success border border-sentinel-accent/50"
                  : "bg-sentinel-bg-soft text-sentinel-demo border border-sentinel-border"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connected ? "bg-sentinel-success animate-blink-live" : "bg-sentinel-muted-light"
                }`}
              />
              {connected ? "LIVE" : "DEMO MODE"}
            </span>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-sentinel-bg-soft"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-sentinel-border-subtle">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-sentinel-muted hover:text-sentinel-ink hover:bg-sentinel-bg-soft rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

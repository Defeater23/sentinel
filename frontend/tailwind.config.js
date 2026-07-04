/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sentinel: {
          /* Sage frame — outer background from reference */
          bg: "#D1DBCB",
          "bg-alt": "#E4EBDF",
          "bg-soft": "#EDF2E9",
          surface: "#FFFFFF",
          border: "#C8D4C0",
          "border-subtle": "#E0E8DA",
          ink: "#000000",
          muted: "#555555",
          "muted-light": "#888888",
          /* Product accent — muted sage green */
          primary: "#000000",
          "primary-dark": "#1A1A1A",
          accent: "#A8BCA1",
          "accent-dark": "#8FA886",
          "accent-soft": "#D1DBCB",
          "accent-muted": "#C5D4BE",
          danger: "#B91C1C",
          "danger-soft": "#FEF2F2",
          warning: "#B45309",
          "warning-soft": "#FFFBEB",
          success: "#6B8F5E",
          "success-soft": "#EEF4EA",
          demo: "#4A5D42",
          "demo-soft": "#E8EDE4",
          /* legacy aliases */
          card: "#FFFFFF",
          gray: "#555555",
          red: "#B91C1C",
          orange: "#B45309",
          blue: "#6B8F5E",
          cyan: "#A8BCA1",
          green: "#6B8F5E",
          yellow: "#B45309",
        },
      },
      fontFamily: {
        sans: ["Forum", "Georgia", "Times New Roman", "serif"],
        display: ["Museo", "MuseoModerno", "system-ui", "sans-serif"],
        body: ["Forum", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        frame: "2.75rem",
      },
      boxShadow: {
        glass:
          "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)",
        "glass-lg":
          "0 4px 12px rgba(0, 0, 0, 0.05), 0 24px 48px rgba(0, 0, 0, 0.08)",
        glow: "0 0 32px rgba(168, 188, 161, 0.35)",
        "glow-accent": "0 0 24px rgba(168, 188, 161, 0.25)",
        "glow-danger": "0 0 24px rgba(185, 28, 28, 0.2)",
        frame: "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "pulse-critical": "pulse-critical 1.5s ease-in-out infinite",
        "blink-live": "blink-live 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-critical": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(185, 28, 28, 0.3)" },
          "50%": { boxShadow: "0 0 0 10px rgba(185, 28, 28, 0)" },
        },
        "blink-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backdropBlur: { xs: "2px" },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(at 90% 10%, rgba(168, 188, 161, 0.25) 0px, transparent 50%), radial-gradient(at 10% 90%, rgba(209, 219, 203, 0.4) 0px, transparent 50%)",
        "mesh-section":
          "radial-gradient(at 100% 0%, rgba(168, 188, 161, 0.15) 0px, transparent 45%)",
        "brand-gradient": "linear-gradient(135deg, #000000 0%, #2D2D2D 100%)",
        "sage-gradient": "linear-gradient(135deg, #A8BCA1 0%, #8FA886 100%)",
      },
    },
  },
  plugins: [],
};

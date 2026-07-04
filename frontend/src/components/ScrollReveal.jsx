import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  const { ref, visible } = useScrollReveal();
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const transforms = {
    up: visible || reducedMotion ? "translateY(0)" : "translateY(32px)",
    left: visible || reducedMotion ? "translateX(0)" : "translateX(-32px)",
    right: visible || reducedMotion ? "translateX(0)" : "translateX(32px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      style={{
        opacity: visible || reducedMotion ? 1 : 0,
        transform: direction === "none" ? undefined : transforms[direction],
        transition: reducedMotion
          ? "none"
          : `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

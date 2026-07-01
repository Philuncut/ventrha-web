"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Site-weites, dezentes Dot-Grid im Hintergrund.
 * Driftet beim Scrollen langsamer als der Vordergrund (Parallax).
 * Fixiert im Viewport, rein dekorativ, GPU-Transform (translateY).
 */
export function BackgroundFX() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Über 4000px Scroll driftet das Pattern nur ~180px -> deutlich langsamer.
  const y = useTransform(scrollY, [0, 4000], [0, -180]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-[-15%]"
        style={{
          y: reduce ? 0 : y,
          willChange: "transform",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.4px)",
          backgroundSize: "30px 30px",
          opacity: 0.04,
          maskImage:
            "radial-gradient(ellipse 100% 80% at 50% 30%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 80% at 50% 30%, #000 55%, transparent 100%)",
        }}
      />
    </div>
  );
}

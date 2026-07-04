"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/container";

/**
 * Section-Auftakt im Stil der WorldSplit-Sektion – nur gespiegelt: Beim Scrollen
 * wächst rechts das große VENTRHA-Logo von klein auf groß (mit leichtem
 * Reinschieben von rechts und Glow), links kommt der Text gestaffelt nach
 * (Eyebrow -> Headline -> Absatz). prefers-reduced-motion zeigt die Endansicht.
 */
export function BrandReveal({
  eyebrow,
  lines,
  children,
  logo = "/icon-dark.png",
  className = "",
}: {
  eyebrow: string;
  lines: string[];
  children?: ReactNode;
  logo?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0006,
  });

  // Logo: schnell von klein auf groß (voll bei ~0.35), leichtes Slide von rechts.
  const gScale = useTransform(p, [0, 0.35], [0.68, 1]);
  const gX = useTransform(p, [0, 0.35], [48, 0]);
  const gOpacity = useTransform(p, [0, 0.14], [0, 1]);

  // Text nach und nach: Eyebrow -> Headline -> Absatz – früh startend.
  const eyO = useTransform(p, [0.1, 0.24], [0, 1]);
  const eyY = useTransform(p, [0.1, 0.24], [20, 0]);
  const hdO = useTransform(p, [0.2, 0.38], [0, 1]);
  const hdY = useTransform(p, [0.2, 0.38], [24, 0]);
  const paO = useTransform(p, [0.32, 0.54], [0, 1]);
  const paY = useTransform(p, [0.32, 0.54], [22, 0]);

  return (
    <section
      ref={ref}
      className={`relative min-h-[78vw] overflow-x-clip py-16 sm:min-h-[56vh] sm:py-24 ${className}`}
    >
      {/* Großes Logo – ragt rechts ins Bild, wächst mit dem Scroll.
          Als leuchtende Akzent-Silhouette (wie die Weltkugel), halbtransparent,
          damit es hinter dem Text als Glow-Backdrop liegen darf statt zu decken. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 aspect-square w-[60vw] max-w-[440px] -translate-y-1/2 translate-x-[26%] sm:w-[42vw] sm:translate-x-[16%]"
      >
        <motion.div
          style={reduce ? undefined : { scale: gScale, x: gX, opacity: gOpacity }}
          className="relative h-full w-full"
        >
          {/* Weicher Glow-Kern dahinter */}
          <div
            className="absolute inset-[-20%] rounded-full"
            style={{
              background: "var(--gradient-accent)",
              filter: "blur(80px)",
              opacity: 0.32,
            }}
          />
          {/* Logo-Form, gefüllt mit dem Marken-Gradient (blau -> cyan) */}
          <div
            className="absolute inset-0"
            style={{
              background: "var(--gradient-accent)",
              opacity: 0.72,
              WebkitMaskImage: `url(${logo})`,
              maskImage: `url(${logo})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              filter: "drop-shadow(0 0 26px rgba(59,130,246,0.5))",
            }}
          />
        </motion.div>
      </div>

      {/* Text – links, kommt gestaffelt beim Scrollen */}
      <Container className="relative flex items-center">
        <div className="relative w-[58%] sm:w-auto sm:max-w-lg">
          <motion.span
            style={reduce ? undefined : { opacity: eyO, y: eyY }}
            className="eyebrow block text-accent"
          >
            {eyebrow}
          </motion.span>
          <motion.h2
            style={reduce ? undefined : { opacity: hdO, y: hdY }}
            className="font-display mt-3 text-balance text-4xl font-extrabold leading-[1.03] text-foreground sm:text-5xl lg:text-6xl"
          >
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h2>
          {children != null && (
            <motion.div style={reduce ? undefined : { opacity: paO, y: paY }}>
              {children}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}

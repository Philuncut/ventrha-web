"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const COLS = 4;
const ROWS = 4;
const SPREAD = 168; // px, wie weit die Bruchstücke nach außen fliegen

// Kacheln des Logos vorberechnen: Rasterposition, Bildausschnitt, Flugvektor.
const TILES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const ox = (c - (COLS - 1) / 2) / ((COLS - 1) / 2); // -1..1
  const oy = (r - (ROWS - 1) / 2) / ((ROWS - 1) / 2); // -1..1
  return {
    c,
    r,
    bgX: (c / (COLS - 1)) * 100,
    bgY: (r / (ROWS - 1)) * 100,
    dx: ox * SPREAD,
    dy: oy * SPREAD,
    rot: (ox + oy) * 16,
  };
});

type Tile = (typeof TILES)[number];

/** Einzelnes Logo-Bruchstück – scroll-gescrubbt: baut sich auf, fliegt weg. */
function Shard({
  p,
  tile,
  logo,
}: {
  p: MotionValue<number>;
  tile: Tile;
  logo: string;
}) {
  const opacity = useTransform(p, [0, 0.12, 0.38, 0.55], [0, 1, 1, 0]);
  const scale = useTransform(p, [0, 0.18, 0.38, 0.55], [0.6, 1, 1, 0.5]);
  const x = useTransform(p, [0.3, 0.55], [0, tile.dx]);
  const y = useTransform(p, [0.3, 0.55], [0, tile.dy]);
  const rotate = useTransform(p, [0.3, 0.55], [0, tile.rot]);

  return (
    <motion.span
      aria-hidden
      className="absolute block"
      style={{
        left: `${tile.c * (100 / COLS)}%`,
        top: `${tile.r * (100 / ROWS)}%`,
        width: `${100 / COLS}%`,
        height: `${100 / ROWS}%`,
        backgroundImage: `url(${logo})`,
        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${tile.bgX}% ${tile.bgY}%`,
        backgroundRepeat: "no-repeat",
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
    />
  );
}

/** Headline-Zeile, die scroll-gescrubbt aus einer Maske hochfährt. */
function Line({
  p,
  text,
  index,
}: {
  p: MotionValue<number>;
  text: string;
  index: number;
}) {
  const start = 0.5 + index * 0.07;
  const y = useTransform(p, [start, start + 0.16], ["115%", "0%"]);
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span style={{ y }} className="block">
        {text}
      </motion.span>
    </span>
  );
}

/**
 * Spektakulärer Section-Auftakt: Das VENTRHA-Logo scrollt herein, zerbricht in
 * Segmente und aus den Bruchstücken steigt der Text hervor. Vollständig an den
 * Scroll gekoppelt -> beim Hochscrollen setzt sich alles wieder zusammen.
 * prefers-reduced-motion -> statisch.
 */
export function LogoShatterHeading({
  eyebrow,
  lines,
  children,
  logo = "/icon-marketing-dark.png",
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
    damping: 28,
    mass: 0.5,
    restDelta: 0.0005,
  });

  const eyeO = useTransform(p, [0.46, 0.6], [0, 1]);
  const eyeY = useTransform(p, [0.46, 0.6], [12, 0]);
  const eyeLS = useTransform(p, [0.46, 0.6], ["0.5em", "0.2em"]);
  const paraStart = 0.6 + lines.length * 0.07;
  const paraO = useTransform(p, [paraStart, paraStart + 0.16], [0, 1]);
  const paraY = useTransform(p, [paraStart, paraStart + 0.16], [20, 0]);
  const glowO = useTransform(p, [0.2, 0.42, 0.58], [0, 0.35, 0]);
  const glowS = useTransform(p, [0.2, 0.58], [0.6, 1.7]);

  if (reduce) {
    return (
      <div className={`relative mx-auto max-w-3xl text-center ${className}`}>
        <span className="eyebrow block text-accent">{eyebrow}</span>
        <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
          {lines.join(" ")}
        </h2>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative mx-auto max-w-3xl text-center ${className}`}
    >
      {/* Logo-Splitter-Bühne */}
      <div className="relative mx-auto mb-10 h-64 w-64 sm:h-80 sm:w-80">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent) 0%, transparent 70%)",
            filter: "blur(24px)",
            opacity: glowO,
            scale: glowS,
          }}
        />
        {TILES.map((t, i) => (
          <Shard key={i} p={p} tile={t} logo={logo} />
        ))}
      </div>

      {/* Text steigt aus den Bruchstücken */}
      <motion.span
        style={{ opacity: eyeO, y: eyeY, letterSpacing: eyeLS }}
        className="eyebrow block text-accent"
      >
        {eyebrow}
      </motion.span>
      <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
        {lines.map((line, i) => (
          <Line key={i} p={p} text={line} index={i} />
        ))}
      </h2>
      {children != null && (
        <motion.div style={{ opacity: paraO, y: paraY }}>{children}</motion.div>
      )}
    </div>
  );
}

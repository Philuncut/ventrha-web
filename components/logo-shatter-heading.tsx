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
  // Logo schon beim Reinscrollen sichtbar (Opacity 1), erst beim Zerbrechen weg.
  const opacity = useTransform(p, [0, 0.38, 0.55], [1, 1, 0]);
  const scale = useTransform(p, [0, 0.4, 0.55], [1, 1, 0.5]);
  const x = useTransform(p, [0.3, 0.55], [0, tile.dx]);
  const y = useTransform(p, [0.3, 0.55], [0, tile.dy]);
  const rotate = useTransform(p, [0.3, 0.55], [0, tile.rot]);
  // Beim Wegfliegen kräftig aufleuchten und nachglühen (Accent-Glow).
  const filter = useTransform(
    p,
    [0.26, 0.4, 0.55],
    [
      "drop-shadow(0 0 0px rgba(96,165,250,0))",
      "drop-shadow(0 0 26px rgba(96,165,250,1))",
      "drop-shadow(0 0 42px rgba(96,165,250,0.7))",
    ],
  );

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
        filter,
      }}
    />
  );
}

/**
 * Spektakulärer Section-Auftakt: Das VENTRHA-Logo scrollt herein, zerbricht in
 * Segmente – und während die Segmente wegfliegen, blastet der Text aus der
 * Mitte heraus (übergroß + unscharf -> knackscharf). Vollständig an den Scroll
 * gekoppelt, setzt sich beim Hochscrollen wieder zusammen.
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

  // Gepinnt: der Effekt wird über den Scroll gescrubbt, während Logo/Text
  // mittig im Viewport stehen -> zusammengebautes Logo immer zentriert.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // Eyebrow blastet zuerst rein
  const eyeO = useTransform(p, [0.4, 0.54], [0, 1]);
  const eyeScale = useTransform(p, [0.4, 0.54], [1.5, 1]);
  const eyeBlur = useTransform(p, [0.4, 0.54], ["blur(8px)", "blur(0px)"]);
  // Headline blastet aus der Mitte: übergroß + unscharf -> scharf
  const hO = useTransform(p, [0.45, 0.66], [0, 1]);
  const hScale = useTransform(p, [0.45, 0.66], [1.32, 1]);
  const hBlur = useTransform(p, [0.45, 0.66], ["blur(20px)", "blur(0px)"]);
  // Absatz danach
  const paraO = useTransform(p, [0.7, 0.84], [0, 1]);
  const paraY = useTransform(p, [0.7, 0.84], [22, 0]);
  const paraBlur = useTransform(p, [0.7, 0.84], ["blur(6px)", "blur(0px)"]);
  // Aufblitzender Glow im Moment der Explosion
  const glowO = useTransform(p, [0.2, 0.44, 0.62], [0, 0.4, 0]);
  const glowS = useTransform(p, [0.2, 0.62], [0.6, 1.8]);

  if (reduce) {
    return (
      <div
        className={`relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32 ${className}`}
      >
        <span className="eyebrow block text-accent">{eyebrow}</span>
        <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
          {lines.join(" ")}
        </h2>
        {children}
      </div>
    );
  }

  return (
    <section ref={ref} className={`relative h-[140vh] ${className}`}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="relative w-full max-w-3xl text-center">
          {/* Logo-Splitter-Bühne */}
          <div className="relative mx-auto mb-10 h-64 w-64 sm:h-80 sm:w-80">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent) 0%, transparent 70%)",
            filter: "blur(28px)",
            opacity: glowO,
            scale: glowS,
          }}
        />
        {TILES.map((t, i) => (
          <Shard key={i} p={p} tile={t} logo={logo} />
        ))}
      </div>

      {/* Text blastet aus der Mitte heraus */}
      <motion.span
        style={{ opacity: eyeO, scale: eyeScale, filter: eyeBlur }}
        className="eyebrow block text-accent"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        style={{
          opacity: hO,
          scale: hScale,
          filter: hBlur,
          transformOrigin: "center",
        }}
        className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl"
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </motion.h2>
          {children != null && (
            <motion.div
              style={{ opacity: paraO, y: paraY, filter: paraBlur }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

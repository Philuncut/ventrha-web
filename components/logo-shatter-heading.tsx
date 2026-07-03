"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -20% 0px" } as const;

const COLS = 4;
const ROWS = 4;
const SPREAD = 96; // px, wie weit die Bruchstücke nach außen fliegen

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

/**
 * Spektakulärer Section-Auftakt: Das VENTRHA-Logo scrollt herein, zerbricht in
 * Segmente (jede Kachel fliegt nach außen und verblasst) und aus den Bruch-
 * stücken steigt der Text hervor. prefers-reduced-motion -> statisch.
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

  const tileV: Variants = {
    hidden: { opacity: 0, scale: 0.6, x: 0, y: 0, rotate: 0 },
    visible: (t: (typeof TILES)[number]) => ({
      opacity: [0, 1, 1, 0],
      scale: [0.6, 1, 1, 0.5],
      x: [0, 0, 0, t.dx],
      y: [0, 0, 0, t.dy],
      rotate: [0, 0, 0, t.rot],
      transition: { duration: 1.8, times: [0, 0.22, 0.46, 1], ease: "easeInOut" },
    }),
  };

  const eyebrowV: Variants = {
    hidden: { opacity: 0, y: 12, letterSpacing: "0.5em" },
    visible: {
      opacity: 1,
      y: 0,
      letterSpacing: "0.2em",
      transition: { duration: 0.7, ease: EASE, delay: 0.95 },
    },
  };
  const lineV: Variants = {
    hidden: { y: "115%" },
    visible: (i: number) => ({
      y: 0,
      transition: { duration: 0.85, ease: EASE, delay: 1.05 + i * 0.13 },
    }),
  };
  const paraV: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: 1.15 + lines.length * 0.13 },
    },
  };
  const glowV: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: [0, 0.35, 0],
      scale: [0.5, 1.4, 1.7],
      transition: { duration: 1.7, times: [0, 0.5, 1], ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`relative mx-auto max-w-3xl text-center ${className}`}
    >
      {/* Logo-Splitter-Bühne */}
      <div className="relative mx-auto mb-8 h-28 w-28 sm:h-36 sm:w-36">
        <motion.span
          aria-hidden
          variants={glowV}
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        {TILES.map((t, i) => (
          <motion.span
            key={i}
            custom={t}
            variants={tileV}
            aria-hidden
            className="absolute block"
            style={{
              left: `${t.c * (100 / COLS)}%`,
              top: `${t.r * (100 / ROWS)}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
              backgroundImage: `url(${logo})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${t.bgX}% ${t.bgY}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>

      {/* Text steigt aus den Bruchstücken */}
      <motion.span variants={eyebrowV} className="eyebrow block text-accent">
        {eyebrow}
      </motion.span>
      <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.12em]">
            <motion.span custom={i} variants={lineV} className="block">
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
      {children != null && <motion.div variants={paraV}>{children}</motion.div>}
    </motion.div>
  );
}

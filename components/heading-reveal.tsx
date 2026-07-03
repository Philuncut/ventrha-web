"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -18% 0px" } as const;

/**
 * Cinematische Section-Überschrift: Eyebrow zieht die Laufweite zusammen,
 * Headline fährt zeilenweise aus einer Maske hoch, Absatz wird nachgeschoben,
 * dahinter skaliert ein Accent-Glow auf. prefers-reduced-motion -> statisch.
 */
export function HeadingReveal({
  eyebrow,
  lines,
  children,
  className = "",
}: {
  eyebrow: string;
  lines: string[];
  children?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  };
  const eyebrowV: Variants = {
    hidden: reduce
      ? {}
      : { opacity: 0, y: 12, letterSpacing: "0.5em" },
    visible: {
      opacity: 1,
      y: 0,
      letterSpacing: "0.2em",
      transition: { duration: reduce ? 0 : 0.7, ease: EASE },
    },
  };
  const lineV: Variants = {
    hidden: { y: reduce ? 0 : "115%" },
    visible: {
      y: 0,
      transition: { duration: reduce ? 0 : 0.9, ease: EASE },
    },
  };
  const paraV: Variants = {
    hidden: reduce ? {} : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: EASE },
    },
  };
  const glowV: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.7 },
    visible: {
      opacity: 0.16,
      scale: 1,
      transition: { duration: reduce ? 0 : 1.2, ease: EASE },
    },
  };

  return (
    <motion.div
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT}
      className={`relative mx-auto max-w-3xl text-center ${className}`}
    >
      <motion.div
        aria-hidden
        variants={glowV}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent) 0%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      <motion.span variants={eyebrowV} className="eyebrow block text-accent">
        {eyebrow}
      </motion.span>

      <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.12em]">
            <motion.span variants={lineV} className="block">
              {line}
            </motion.span>
          </span>
        ))}
      </h2>

      {children != null && (
        <motion.div variants={paraV}>{children}</motion.div>
      )}
    </motion.div>
  );
}

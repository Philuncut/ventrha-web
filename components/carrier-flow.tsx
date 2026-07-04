"use client";

import { motion, useReducedMotion } from "framer-motion";

const NODES = ["DHL", "GLS", "Hermes", "+ mehr"];

/**
 * Kleine „Live-Routing"-Visualisierung für die Flaggschiff-Karte: drei Carrier
 * als Knoten auf einer Linie, dazwischen ein wandernder Impuls – greift das
 * Routen-/Puls-Motiv der Weltkugel auf. Statisch bei reduzierter Bewegung.
 */
export function CarrierFlow() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex w-full items-center justify-between gap-2">
      {/* Verbindungslinie */}
      <div className="pointer-events-none absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      {/* Wandernder Impuls entlang der Linie */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_3px_var(--accent)]"
          animate={{ left: ["8%", "92%"] }}
          transition={{
            duration: 2.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.3,
          }}
        />
      )}

      {NODES.map((n, i) => (
        <motion.span
          key={n}
          className="relative z-10 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
          initial={reduce ? false : { opacity: 0.7 }}
          animate={
            reduce
              ? {}
              : {
                  opacity: [0.7, 1, 0.7],
                  borderColor: [
                    "var(--border-strong)",
                    "var(--accent)",
                    "var(--border-strong)",
                  ],
                }
          }
          transition={
            reduce
              ? {}
              : {
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.5,
                }
          }
        >
          {n}
        </motion.span>
      ))}
    </div>
  );
}

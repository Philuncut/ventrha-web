"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";
import { Globe } from "@/components/globe";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -15% 0px" } as const;

/**
 * Übergang direkt nach der zentralen Weltkugel: links fliegt eine große halbe
 * Erde aus dem Bildrand herein, rechts der Text. Beide animieren beim Eintritt
 * in den Viewport (fly-in). prefers-reduced-motion zeigt die statische Ansicht.
 */
export function WorldSplit() {
  const reduce = useReducedMotion();
  const fromLeft = reduce
    ? {}
    : { initial: { opacity: 0, x: -90 }, whileInView: { opacity: 1, x: 0 } };
  const fromRight = reduce
    ? {}
    : { initial: { opacity: 0, x: 70 }, whileInView: { opacity: 1, x: 0 } };

  return (
    <section className="relative min-h-[82vw] overflow-hidden border-b border-border py-16 sm:min-h-[60vh] sm:py-24">
      {/* Halbe Weltkugel – ragt links aus dem Bild, groß */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 aspect-square w-[82vw] -translate-x-1/2 -translate-y-1/2 sm:w-[52vw] sm:max-w-[620px]"
      >
        <motion.div
          {...fromLeft}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative h-full w-full"
        >
          <div
            className="absolute inset-[-8%] rounded-full"
            style={{
              background: "var(--gradient-accent)",
              filter: "blur(70px)",
              opacity: 0.45,
            }}
          />
          <Globe className="relative h-full w-full" />
        </motion.div>
      </div>

      {/* Text – rechts */}
      <Container className="relative flex items-center">
        <motion.div
          {...fromRight}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="ml-auto w-[56%] text-right sm:w-auto sm:max-w-md"
        >
          <span className="eyebrow text-accent">Weltweit</span>
          <h2 className="font-display mt-3 text-balance text-3xl font-extrabold leading-[1.05] text-foreground sm:text-4xl lg:text-5xl">
            Ein Klick bis ans andere Ende der Welt
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-muted sm:text-lg">
            Von Wien in jede Zeitzone: VENTRHA erzeugt Label und Zollpapiere für
            jedes Zielland automatisch – du drückst nur auf Senden.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

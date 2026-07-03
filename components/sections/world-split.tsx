"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/container";
import { Globe } from "@/components/globe";

/**
 * Übergang direkt nach der zentralen Weltkugel – bewusst ohne Trennstriche,
 * damit er optisch aus dem Globe-Teil herausfließt. Beim Scrollen wächst links
 * eine große halbe Erde von klein auf groß (mit leichtem Reinschieben), rechts
 * kommt der Text nach und nach. prefers-reduced-motion zeigt die Endansicht.
 */
export function WorldSplit() {
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

  // Erde: schnell von klein auf groß (voll bei ~0.45), dazu leichtes Slide von
  // links.
  const gScale = useTransform(p, [0, 0.45], [0.62, 1]);
  const gX = useTransform(p, [0, 0.45], [-44, 0]);
  const gOpacity = useTransform(p, [0, 0.16], [0, 1]);

  // Text nach und nach: Eyebrow -> Headline -> Absatz.
  const eyO = useTransform(p, [0.2, 0.35], [0, 1]);
  const eyY = useTransform(p, [0.2, 0.35], [20, 0]);
  const hdO = useTransform(p, [0.34, 0.52], [0, 1]);
  const hdY = useTransform(p, [0.34, 0.52], [24, 0]);
  const paO = useTransform(p, [0.5, 0.72], [0, 1]);
  const paY = useTransform(p, [0.5, 0.72], [22, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[82vw] overflow-x-clip py-16 sm:min-h-[60vh] sm:py-24"
    >
      {/* Halbe Weltkugel – ragt links aus dem Bild, wächst mit dem Scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 aspect-square w-[82vw] -translate-x-1/2 -translate-y-1/2 sm:w-[52vw] sm:max-w-[620px]"
      >
        <motion.div
          style={
            reduce ? undefined : { scale: gScale, x: gX, opacity: gOpacity }
          }
          className="relative h-full w-full"
        >
          <div
            className="absolute inset-[-28%] rounded-full"
            style={{
              background: "var(--gradient-accent)",
              filter: "blur(90px)",
              opacity: 0.4,
            }}
          />
          <Globe className="relative h-full w-full" />
        </motion.div>
      </div>

      {/* Text – rechts, kommt gestaffelt beim Scrollen */}
      <Container className="relative flex items-center">
        <div className="ml-auto w-[56%] text-right sm:w-auto sm:max-w-md">
          <motion.span
            style={reduce ? undefined : { opacity: eyO, y: eyY }}
            className="eyebrow block text-accent"
          >
            Weltweit
          </motion.span>
          <motion.h2
            style={reduce ? undefined : { opacity: hdO, y: hdY }}
            className="font-display mt-3 text-balance text-3xl font-extrabold leading-[1.05] text-foreground sm:text-4xl lg:text-5xl"
          >
            Ein Klick bis ans andere Ende der Welt
          </motion.h2>
          <motion.p
            style={reduce ? undefined : { opacity: paO, y: paY }}
            className="mt-4 text-pretty text-base leading-7 text-muted sm:text-lg"
          >
            Von Wien in jede Zeitzone: VENTRHA erzeugt Label und Zollpapiere für
            jedes Zielland automatisch – du drückst nur auf Senden.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

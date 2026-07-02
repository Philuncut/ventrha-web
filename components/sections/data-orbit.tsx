"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/container";
import { Globe } from "@/components/globe";

/** Weltkugel + Glow + ins Kugelbild eingebranntes Logo. */
function GlobeCore() {
  return (
    <>
      <div
        aria-hidden
        className="orbit-core-glow absolute inset-[-6%] rounded-full"
        style={{ background: "var(--gradient-accent)", filter: "blur(60px)" }}
      />
      <Globe className="relative h-full w-full" />
      {/* Logo wirkt in die Kugel eingestanzt (Blend-Mode) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/icon-marketing-dark.png"
          alt="VENTRHA"
          width={720}
          height={720}
          priority
          className="relative w-[64%] opacity-90 mix-blend-overlay"
        />
        <Image
          src="/icon-marketing-dark.png"
          alt=""
          aria-hidden
          width={720}
          height={720}
          className="absolute w-[64%] opacity-25"
        />
      </div>
    </>
  );
}

function TextBlock() {
  return (
    <>
      <span className="eyebrow text-accent">Ein Hub</span>
      <h2 className="font-display mt-3 text-balance text-3xl font-extrabold leading-[1.05] text-foreground sm:text-4xl lg:text-5xl">
        Alle Carrier, alle Shops – ein System
      </h2>
    </>
  );
}

export function DataOrbit() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Messung startet bereits beim Eintreten der Sektion ("start end"), nicht
  // erst beim Andocken. So reagiert die Erde ab dem ersten sichtbaren Pixel.
  // Bei h-[230vh] + sticky h-screen dockt die Sektion bei ~0.43 an (100/230).
  // Der Einflug (0..Andocken) ist immer 100vh lang -> Feeling bleibt gleich,
  // egal wie hoch die Sektion ist; die Höhe steuert nur die gepinnte Dauer.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // Scroll-Fortschritt über eine Spring glätten -> buttrige, leicht nachlaufende
  // Bewegung statt harter 1:1-Kopplung an den Finger.
  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0006,
  });

  // Erde zieht sich lang auf (bis leicht nach dem Andocken), steht dann groß da
  // und schrumpft erst ganz am Ende weg.
  const scale = useTransform(p, [0, 0.49, 0.73, 0.96], [0.35, 1, 1, 0.5]);
  const globeOpacity = useTransform(p, [0, 0.11, 0.78, 0.96], [0, 1, 1, 0]);
  // Text wird nacheinander nachgeschoben (Eyebrow -> Headline -> Text) in der
  // angedockten Phase, unter der Kugel; kurze Lesepause, dann Ausblend-Swap.
  const OUT: [number, number] = [0.75, 0.93];
  const eyO = useTransform(p, [0.37, 0.47, ...OUT], [0, 1, 1, 0]);
  const eyY = useTransform(p, [0.37, 0.47], [22, 0]);
  const hdO = useTransform(p, [0.45, 0.56, ...OUT], [0, 1, 1, 0]);
  const hdY = useTransform(p, [0.45, 0.56], [26, 0]);
  const paO = useTransform(p, [0.53, 0.64, ...OUT], [0, 1, 1, 0]);
  const paY = useTransform(p, [0.53, 0.64], [24, 0]);

  // Statische Variante bei reduzierter Bewegung.
  if (reduce) {
    return (
      <section className="relative overflow-hidden border-y border-border py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <TextBlock />
            <p className="mt-6 text-pretty text-lg leading-8 text-muted sm:text-xl">
              Deine Shop-Systeme und Versanddienstleister laufen bei VENTRHA
              zusammen – automatisch verbunden.
            </p>
          </div>
          <div className="relative mx-auto mt-12 aspect-square w-[min(70vh,90vw)]">
            <GlobeCore />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[230vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-start gap-6 overflow-hidden border-y border-border px-6 pt-[12vh] sm:gap-8">
        {/* Erde – kommt klein rein und wächst mit dem Scroll */}
        <motion.div
          style={{ scale, opacity: globeOpacity, willChange: "transform" }}
          className="relative aspect-square w-[min(54vh,88vw)] shrink-0"
        >
          <GlobeCore />
        </motion.div>

        {/* Text – unter der Kugel, nacheinander nachgeschoben, gut lesbar */}
        <div className="max-w-2xl text-center">
          <motion.span
            style={{ opacity: eyO, y: eyY }}
            className="eyebrow block text-accent"
          >
            Ein Hub
          </motion.span>
          <motion.h2
            style={{ opacity: hdO, y: hdY }}
            className="font-display mt-3 text-balance text-3xl font-extrabold leading-[1.05] text-foreground sm:text-4xl lg:text-5xl"
          >
            Alle Carrier, alle Shops – ein System
          </motion.h2>
          <motion.p
            style={{ opacity: paO, y: paY }}
            className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-muted sm:text-lg"
          >
            Deine Shop-Systeme und Versanddienstleister laufen bei VENTRHA
            zusammen – automatisch verbunden.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Erde ist sofort sichtbar, wächst zur vollen Größe und schrumpft wieder weg.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.38, 0.64, 1],
    [0.68, 1, 1, 0.6],
  );
  const globeOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.86, 1],
    [0.4, 1, 1, 0],
  );
  // Text schießt früh nach – unter der Kugel, gut lesbar – und geht wieder.
  const headOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.2, 0.78, 0.92],
    [0, 1, 1, 0],
  );
  const headY = useTransform(scrollYProgress, [0.08, 0.2], [28, 0]);
  const paraOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.3, 0.78, 0.92],
    [0, 1, 1, 0],
  );

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
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden border-y border-border px-6 sm:gap-8">
        {/* Erde (skaliert mit dem Scroll) */}
        <motion.div
          style={{ scale, opacity: globeOpacity, willChange: "transform" }}
          className="relative aspect-square w-[min(52vh,86vw)] shrink-0"
        >
          <GlobeCore />
        </motion.div>

        {/* Text – unter der Kugel, gut lesbar; blendet beim Scrollen ein/aus */}
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="max-w-2xl text-center"
        >
          <TextBlock />
          <motion.p
            style={{ opacity: paraOpacity }}
            className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-muted sm:text-lg"
          >
            Deine Shop-Systeme und Versanddienstleister laufen bei VENTRHA
            zusammen – automatisch verbunden.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

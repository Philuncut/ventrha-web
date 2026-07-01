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
      <h2 className="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
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

  // Erde: klein -> wächst zur vollen Größe -> schrumpft wieder weg.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.62, 1],
    [0.5, 1.06, 1.06, 0.4],
  );
  const globeOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.82, 0.98],
    [0, 1, 1, 0],
  );
  // Text schießt beim Scrollen nach und verschwindet wieder.
  const headOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.7, 0.84],
    [0, 1, 1, 0],
  );
  const headY = useTransform(scrollYProgress, [0.04, 0.18], [44, 0]);
  const paraOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.32, 0.7, 0.84],
    [0, 1, 1, 0],
  );
  const paraY = useTransform(scrollYProgress, [0.16, 0.32], [30, 0]);

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
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden border-y border-border">
        {/* Erde (skaliert mit dem Scroll) */}
        <motion.div
          style={{ scale, opacity: globeOpacity, willChange: "transform" }}
          className="relative aspect-square w-[min(62vh,92vw)]"
        >
          <GlobeCore />
        </motion.div>

        {/* Text – blendet beim Scrollen ein und wieder aus */}
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="pointer-events-none absolute inset-x-0 top-[8vh] px-6 text-center"
        >
          <TextBlock />
          <motion.p
            style={{ opacity: paraOpacity, y: paraY }}
            className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-muted sm:text-xl"
          >
            Deine Shop-Systeme und Versanddienstleister laufen bei VENTRHA
            zusammen – automatisch verbunden.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

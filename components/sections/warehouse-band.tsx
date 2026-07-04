"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/container";

/**
 * Dunkel-moody Vollbild-Band: ein echtes Versandlager (Menschen bei der Arbeit)
 * mit sanftem Scroll-Parallax, dunklem Marken-Overlay (blau→cyan Tint) und oben/
 * unten in die Seite verlaufend, damit es nahtlos ins dunkle Design fließt.
 * Foto: Pexels (kommerziell frei) – https://www.pexels.com/photo/4483862/
 */
export function WarehouseBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-y border-border"
    >
      {/* Foto mit sanftem Parallax (leicht überskaliert -> keine Ränder) */}
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-0 -z-10 scale-110"
      >
        <Image
          src="/warehouse.jpg"
          alt="Team bei der Arbeit in einem Versandlager"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dunkles Overlay + Marken-Tint; Text-Seite (links) zusätzlich abgedunkelt */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-background/55" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, rgba(10,10,11,0.82) 34%, rgba(10,10,11,0.25) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--background) 0%, transparent 20%, transparent 80%, var(--background) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(120deg, rgba(59,130,246,0.16) 0%, rgba(34,211,238,0.05) 60%, transparent 100%)",
        }}
      />

      <Container className="relative flex min-h-[68vh] items-center py-24 sm:py-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="eyebrow block text-accent">Aus dem Lager</span>
          <h2 className="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.03] text-foreground sm:text-5xl">
            Gebaut für den echten Versandalltag
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-8 text-muted">
            Ob ein Paket oder tausend – VENTRHA hält deinem Team den Rücken frei:
            vom Wareneingang bis zum fertigen Versandlabel.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

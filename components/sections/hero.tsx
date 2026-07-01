"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { AppWindow } from "@/components/app-window";

const worksWith = ["DHL", "GLS", "Post AT", "WooCommerce"];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: an den Hero-Fortschritt gekoppelt (0 = oben, 1 = herausgescrollt).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 170]);
  const shotY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  // Gestaffelter Einstieg: Eyebrow -> Headline -> Text -> CTAs -> Vertrauensleiste.
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border"
    >
      {/* Leuchtende Blau→Cyan-Glows – laggen beim Scrollen (Parallax) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ y: glowY, willChange: "transform" }}
      >
        <motion.div
          className="absolute left-1/2 top-[-8%] h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 62%)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: reduce ? 0.28 : 0 }}
          animate={
            reduce
              ? { opacity: 0.28 }
              : { opacity: [0.22, 0.34, 0.22], scale: [1, 1.08, 1] }
          }
          transition={
            reduce
              ? { duration: 1 }
              : { duration: 11, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.div
          className="absolute right-[6%] top-[26%] h-[400px] w-[400px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, var(--accent-2) 0%, transparent 60%)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: reduce ? 0.18 : 0 }}
          animate={
            reduce
              ? { opacity: 0.18 }
              : { opacity: [0.12, 0.24, 0.12], x: [0, 26, 0], y: [0, -18, 0] }
          }
          transition={
            reduce
              ? { duration: 1 }
              : { duration: 14, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>

      <Container className="pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40">
        <motion.div
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-surface/70 px-4 py-2 text-muted backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent)]" />
            <span className="eyebrow">Versandsoftware für Online-Händler</span>
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display mt-8 text-balance text-5xl font-extrabold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl"
          >
            Versand <span className="text-gradient italic">neu gedacht.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted sm:text-xl"
          >
            VENTRHA verbindet deinen Shop mit allen wichtigen Carriern, erzeugt
            Labels und Zollformulare automatisch – vom Auftrag zum fertigen
            Versandlabel in einem Klick.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="#kontakt" size="lg">
              Interesse melden
            </ButtonLink>
            <ButtonLink href="#features" size="lg" variant="secondary">
              Funktionen ansehen
            </ButtonLink>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-14 flex flex-col items-center gap-4"
          >
            <span className="eyebrow text-muted-2">Funktioniert mit</span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-medium text-muted">
              {worksWith.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mt-20 max-w-5xl"
          style={{ y: shotY, willChange: "transform" }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 44, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: EASE, delay: reduce ? 0 : 0.75 }}
          >
            <AppWindow
              src="/screen1.png"
              alt="VENTRHA Dashboard mit offenen Bestellungen, Kundenstatus und internationalen Sendungen"
              width={1503}
              height={834}
              title="VENTRHA – Dashboard"
              priority
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

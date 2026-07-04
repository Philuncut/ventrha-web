"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { Reveal } from "@/components/reveal";

/** Ein Plan – Preise zentral, damit sie leicht anpassbar sind. */
const PRICE = {
  monthly: { amount: "19,90 €", unit: "/ Monat", note: "monatlich abgerechnet" },
  yearly: {
    amount: "191 €",
    unit: "/ Jahr",
    note: "20 % gespart · entspricht 15,92 € / Monat",
  },
} as const;

/** Alles, was im Plan enthalten ist. */
const included = [
  "Alle Carrier: DHL, GLS, Hermes & mehr",
  "Automatische Zollformulare (CN22/CN23, Invoice)",
  "Multi-Shop-Anbindung (WooCommerce & mehr)",
  "Automatischer Label-Druck in einem Klick",
  "Regel-Engine für die Carrier-Wahl",
  "Mehrsprachige Oberfläche",
  "Multi-Tenant für mehrere Standorte",
  "Laufende Updates & Support",
];

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
      fill="none"
    >
      <circle cx="10" cy="10" r="9" className="fill-accent-soft" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pricing() {
  const reduce = useReducedMotion();
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const p = PRICE[billing];

  return (
    <section
      id="preise"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <Container className="py-24 sm:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow block text-accent">Preise</span>
          <h2 className="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.03] text-foreground sm:text-5xl">
            Ein Preis. Alles drin.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-8 text-muted">
            Kein Tarif-Dschungel: Alle Funktionen in einem Plan. Kostenlos
            testen, monatlich kündbar.
          </p>
        </Reveal>

        {/* Umschalter Monatlich / Jährlich */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-accent text-on-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Monatlich
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === "yearly"
                  ? "bg-accent text-on-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Jährlich
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  billing === "yearly"
                    ? "bg-white/20 text-on-accent"
                    : "bg-accent-soft text-accent"
                }`}
              >
                −20 %
              </span>
            </button>
          </div>
        </div>

        {/* Plan-Karte */}
        <Reveal delay={0.05} className="mx-auto mt-10 max-w-md">
          <div className="ring-gradient relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
            />
            <div className="relative">
              <h3 className="font-display text-xl font-bold text-foreground">
                VENTRHA Komplett
              </h3>
              <p className="mt-1 text-sm text-muted">
                Der volle Funktionsumfang – ohne Kleingedrucktes.
              </p>

              <div className="mt-6 flex items-end gap-2">
                <motion.span
                  key={billing}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-5xl font-extrabold leading-none text-foreground"
                >
                  {p.amount}
                </motion.span>
                <span className="pb-1 text-muted">{p.unit}</span>
              </div>
              <p className="mt-2 text-sm text-muted-2">{p.note}</p>

              <ButtonLink
                href="#kontakt"
                size="lg"
                className="mt-7 w-full"
              >
                Jetzt starten
              </ButtonLink>
              <p className="mt-3 text-center text-sm text-muted">
                14 Tage kostenlos testen · keine Kreditkarte nötig
              </p>

              <div className="my-8 h-px bg-border" />

              <ul className="space-y-3.5">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-foreground"
                  >
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-md text-center text-sm text-muted-2">
          Preise inkl. gesetzlicher USt. · monatlich kündbar, keine
          Mindestlaufzeit.
        </p>
      </Container>
    </section>
  );
}

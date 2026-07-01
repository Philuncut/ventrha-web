import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import {
  TruckIcon,
  CustomsIcon,
  PlugIcon,
  PrinterIcon,
} from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type OrbitItem = {
  label: string;
  angle: number; // Startwinkel in Grad
  icon?: Icon;
  accent?: boolean;
};

type Ring = {
  radius: number; // % der Bühnenbreite
  duration: number; // Sekunden pro Umlauf
  reverse?: boolean; // Umlaufrichtung
  items: OrbitItem[];
};

// Zwei Ringe, gegenläufig – repräsentieren den Datenfluss um VENTRHA.
const rings: Ring[] = [
  {
    radius: 38,
    duration: 48,
    items: [
      { label: "WooCommerce", angle: 0, icon: PlugIcon },
      { label: "DHL Paket", angle: 72, icon: TruckIcon, accent: true },
      { label: "CN23 · Zoll", angle: 144, icon: CustomsIcon },
      { label: "Label gedruckt", angle: 216, icon: PrinterIcon },
      { label: "#10428", angle: 288 },
    ],
  },
  {
    radius: 24,
    duration: 34,
    reverse: true,
    items: [
      { label: "GLS · SendDrop", angle: 40, accent: true },
      { label: "AT · DE · FR", angle: 150 },
      { label: "Tracking ✓", angle: 260 },
    ],
  },
];

function Chip({ item }: { item: OrbitItem }) {
  return (
    <div
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur ${
        item.accent
          ? "border-accent/40 bg-accent-soft/80 text-foreground shadow-[0_0_20px_-4px_var(--accent)]"
          : "border-border-strong bg-surface/80 text-muted"
      }`}
    >
      {item.icon ? (
        <item.icon
          width={14}
          height={14}
          className={item.accent ? "text-accent" : "text-muted-2"}
        />
      ) : (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            item.accent ? "bg-accent" : "bg-muted-2"
          }`}
        />
      )}
      {item.label}
    </div>
  );
}

export function DataOrbit() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24 sm:py-32">
      {/* Zentraler Lichtschein */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
        }}
      />

      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-accent">Ein Hub</span>
          <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
            Dein ganzer Versand –<br className="hidden sm:block" /> um einen Punkt
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted sm:text-xl">
            Shops, Carrier, Zollpapiere und Tracking laufen bei VENTRHA
            zusammen – automatisch verbunden.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative mx-auto mt-16 aspect-square w-full max-w-[560px]"
        >
          <div className="absolute inset-0 origin-center scale-[0.78] sm:scale-100">
          {/* Statische Orbit-Bahnen */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/50"
          />

          {/* Rotierende Ringe mit Daten-Chips */}
          {rings.map((ring, ri) => (
            <div
              key={ri}
              className="orbit-ring"
              style={
                {
                  "--orbit-dur": `${ring.duration}s`,
                  "--orbit-dir": ring.reverse ? "reverse" : "normal",
                  "--orbit-dir-rev": ring.reverse ? "normal" : "reverse",
                } as React.CSSProperties
              }
            >
              {ring.items.map((item) => (
                <div
                  key={item.label}
                  className="orbit-arm"
                  style={{
                    width: `${ring.radius}%`,
                    transform: `rotate(${item.angle}deg)`,
                  }}
                >
                  <div className="orbit-chip-pos">
                    <div
                      className="orbit-upright"
                      style={
                        {
                          "--orbit-dur": `${ring.duration}s`,
                          "--orbit-dir-rev": ring.reverse
                            ? "normal"
                            : "reverse",
                        } as React.CSSProperties
                      }
                    >
                      <div style={{ transform: `rotate(${-item.angle}deg)` }}>
                        <Chip item={item} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Zentrum: Logo groß mit pulsierendem Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="orbit-core-glow absolute inset-0 -z-10 rounded-[2rem]"
                style={{
                  background: "var(--gradient-accent)",
                  filter: "blur(36px)",
                }}
              />
              <div className="ring-gradient flex h-32 w-32 items-center justify-center rounded-[2rem] border border-border-strong bg-surface/90 backdrop-blur sm:h-40 sm:w-40">
                <Image
                  src="/icon-dark.png"
                  alt="VENTRHA"
                  width={112}
                  height={112}
                  className="h-20 w-20 sm:h-24 sm:w-24"
                />
              </div>
            </div>
          </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

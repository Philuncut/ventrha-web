import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Globe } from "@/components/globe";

type OrbitItem = {
  label: string;
  angle: number; // Startwinkel in Grad
};

type Ring = {
  radius: number; // % der Bühnenbreite (Desktop)
  radiusSm: number; // % der Bühnenbreite (Mobile)
  duration: number; // Sekunden pro Umlauf
  reverse?: boolean; // Umlaufrichtung
  items: OrbitItem[];
};

// Carrier & Shop-Systeme, die auf einem Ring um die Erde kreisen.
const rings: Ring[] = [
  {
    radius: 44,
    radiusSm: 37,
    duration: 64,
    items: [
      { label: "DHL", angle: 0 },
      { label: "UPS", angle: 51 },
      { label: "Shopify", angle: 103 },
      { label: "Wix", angle: 154 },
      { label: "WooCommerce", angle: 206 },
      { label: "FedEx", angle: 257 },
      { label: "GLS", angle: 309 },
    ],
  },
];

function Chip({ item, glowDelay }: { item: OrbitItem; glowDelay: number }) {
  return (
    <div
      className="chip-glow flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border-strong bg-surface/90 px-3 py-1.5 text-[11px] font-semibold text-foreground backdrop-blur sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
      style={{ animationDelay: `${glowDelay}s` }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
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
            Alle Carrier, alle Shops –<br className="hidden sm:block" /> ein
            System
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted sm:text-xl">
            Deine Shop-Systeme und Versanddienstleister laufen bei VENTRHA
            zusammen – automatisch verbunden.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative mx-auto mt-16 aspect-square w-full max-w-[900px]"
        >
          <div className="absolute inset-0">
            {/* Weltkugel (füllt die Bühne) + Logo im Kern – hinter den Chips */}
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div
                aria-hidden
                className="orbit-core-glow absolute inset-[-6%] rounded-full"
                style={{
                  background: "var(--gradient-accent)",
                  filter: "blur(60px)",
                }}
              />
              <Globe className="relative h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  aria-hidden
                  className="absolute h-[36%] w-[36%] rounded-full bg-background/55 blur-lg"
                />
                <Image
                  src="/icon-marketing-dark.png"
                  alt="VENTRHA"
                  width={420}
                  height={420}
                  priority
                  className="relative w-[40%]"
                />
              </div>
            </div>

            {/* Rotierende Marken-Chips – über dem Kugelrand */}
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
                {ring.items.map((item, idx) => (
                  <div
                    key={item.label}
                    className="orbit-arm"
                    style={
                      {
                        "--orbit-r": `${ring.radius}%`,
                        "--orbit-r-sm": `${ring.radiusSm}%`,
                        transform: `rotate(${item.angle}deg)`,
                      } as React.CSSProperties
                    }
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
                          <Chip
                            item={item}
                            glowDelay={-(idx * 9) / ring.items.length}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

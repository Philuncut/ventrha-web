import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Globe } from "@/components/globe";

type OrbitItem = {
  label: string;
  angle: number; // Startwinkel in Grad
  accent?: boolean;
};

type Ring = {
  radius: number; // % der Bühnenbreite
  duration: number; // Sekunden pro Umlauf
  reverse?: boolean; // Umlaufrichtung
  items: OrbitItem[];
};

// Carrier & Shop-Systeme, die um VENTRHA kreisen.
const rings: Ring[] = [
  {
    radius: 40,
    duration: 48,
    items: [
      { label: "DHL", angle: 0, accent: true },
      { label: "UPS", angle: 90 },
      { label: "FedEx", angle: 180 },
      { label: "WooCommerce", angle: 270, accent: true },
    ],
  },
  {
    radius: 28,
    duration: 34,
    reverse: true,
    items: [
      { label: "GLS", angle: 60 },
      { label: "Shopify", angle: 180, accent: true },
      { label: "Wix", angle: 300 },
    ],
  },
];

function Chip({ item }: { item: OrbitItem }) {
  return (
    <div
      className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur ${
        item.accent
          ? "border-accent/40 bg-accent-soft/80 text-foreground shadow-[0_0_22px_-4px_var(--accent)]"
          : "border-border-strong bg-surface/80 text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          item.accent ? "bg-accent" : "bg-muted-2"
        }`}
      />
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

            {/* Rotierende Ringe mit Chips */}
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

            {/* Zentrum: halbtransparente Weltkugel mit Logo davor */}
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[44%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div
                aria-hidden
                className="orbit-core-glow absolute inset-[-16%] rounded-full"
                style={{
                  background: "var(--gradient-accent)",
                  filter: "blur(46px)",
                }}
              />
              <Globe className="relative h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  aria-hidden
                  className="absolute h-[44%] w-[44%] rounded-full bg-background/55 blur-md"
                />
                <Image
                  src="/icon-marketing-dark.png"
                  alt="VENTRHA"
                  width={200}
                  height={200}
                  priority
                  className="relative w-[46%]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

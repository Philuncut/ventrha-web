import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { AppWindow } from "@/components/app-window";

const worksWith = ["DHL", "GLS", "Post AT", "WooCommerce"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Feines Raster im Hintergrund */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 0%, #000 40%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 0%, #000 40%, transparent 82%)",
        }}
      />
      {/* Leuchtende Blau→Cyan-Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-8%] -z-10 h-[620px] w-[1100px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[28%] -z-10 h-[380px] w-[380px] rounded-full opacity-20 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent-2) 0%, transparent 60%)",
        }}
      />

      <Container className="pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-surface/70 px-4 py-2 text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent)]" />
            <span className="eyebrow">Versandsoftware für Online-Händler</span>
          </span>

          <h1 className="font-display mt-8 text-balance text-5xl font-extrabold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
            Versand{" "}
            <span className="text-gradient italic">neu gedacht.</span>
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted sm:text-xl">
            VENTRHA verbindet deinen Shop mit allen wichtigen Carriern, erzeugt
            Labels und Zollformulare automatisch – vom Auftrag zum fertigen
            Versandlabel in einem Klick.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#kontakt" size="lg">
              Interesse melden
            </ButtonLink>
            <ButtonLink href="#features" size="lg" variant="secondary">
              Funktionen ansehen
            </ButtonLink>
          </div>

          <div className="mt-14 flex flex-col items-center gap-4">
            <span className="eyebrow text-muted-2">Funktioniert mit</span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-medium text-muted">
              {worksWith.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <AppWindow
            src="/screen1.png"
            alt="VENTRHA Dashboard mit offenen Bestellungen, Kundenstatus und internationalen Sendungen"
            width={1503}
            height={834}
            title="VENTRHA – Dashboard"
            priority
          />
        </div>
      </Container>
    </section>
  );
}

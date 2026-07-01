import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { AppWindow } from "@/components/app-window";

const worksWith = ["DHL", "GLS", "Post AT", "WooCommerce"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Dezenter Lichtschein + Raster im Hintergrund */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
        }}
      />

      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Versandsoftware für Online-Händler
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Versand{" "}
            <span className="italic text-accent">neu gedacht.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted">
            VENTRHA verbindet deinen Shop mit allen wichtigen Carriern, erzeugt
            Labels und Zollformulare automatisch – vom Auftrag zum fertigen
            Versandlabel in einem Klick.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#kontakt" size="lg">
              Interesse melden
            </ButtonLink>
            <ButtonLink href="#features" size="lg" variant="secondary">
              Funktionen ansehen
            </ButtonLink>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-muted-2">
              Funktioniert mit
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted">
              {worksWith.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
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

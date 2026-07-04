import { Container } from "@/components/container";
import { Stagger, StaggerItem } from "@/components/reveal";
import { BrandReveal } from "@/components/brand-reveal";
import { CarrierFlow } from "@/components/carrier-flow";
import { features, extras } from "@/lib/content";

export function Features() {
  const [flagship, ...rest] = features;

  return (
    <section id="features" className="relative border-b border-border">
      <BrandReveal
        eyebrow="Funktionen"
        lines={["Alles für den Versand –", "in einer Software"]}
      >
        <p className="mt-6 text-pretty text-lg leading-8 text-muted sm:text-xl">
          VENTRHA übernimmt die wiederkehrenden Handgriffe im Versand, damit du
          dich um dein Geschäft kümmern kannst.
        </p>
      </BrandReveal>

      <Container className="pb-24 sm:pb-32">
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {/* Flaggschiff – breit, mit Live-Routing */}
          <StaggerItem className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-border-strong sm:col-span-2 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-strong bg-accent-soft text-accent">
                  <flagship.icon />
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold text-foreground sm:text-3xl">
                  {flagship.title}
                </h3>
                <p className="mt-3 leading-7 text-muted">
                  {flagship.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {flagship.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-sm text-foreground"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-6">
                <span className="eyebrow text-muted-2">Live-Routing</span>
                <div className="mt-7">
                  <CarrierFlow />
                </div>
                <p className="mt-7 text-sm leading-6 text-muted">
                  VENTRHA wählt den passenden Carrier je Bestellung automatisch –
                  nach deinen Regeln.
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Übrige Funktionen – letzte Karte breit für ausgewogenes Bento */}
          {rest.map((feature, i) => (
            <StaggerItem
              key={feature.title}
              className={`group h-full rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-border-strong ${
                i === rest.length - 1 ? "sm:col-span-2" : ""
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-strong bg-accent-soft text-accent">
                <feature.icon />
              </div>
              <h3 className="font-display mt-6 text-2xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 leading-7 text-muted">{feature.description}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger className="mt-4 grid gap-4 sm:grid-cols-3">
          {extras.map((extra) => (
            <StaggerItem
              key={extra.title}
              className="flex h-full gap-4 rounded-2xl border border-border bg-surface/60 p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-strong text-muted">
                <extra.icon width={20} height={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{extra.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {extra.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

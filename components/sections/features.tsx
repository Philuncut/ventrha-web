import { Container } from "@/components/container";
import { features, extras } from "@/lib/content";

export function Features() {
  return (
    <section id="features" className="border-b border-border py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            Funktionen
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Alles für den Versand – in einer Software
          </h2>
          <p className="mt-4 text-pretty text-lg leading-8 text-muted">
            VENTRHA übernimmt die wiederkehrenden Handgriffe im Versand, damit du
            dich um dein Geschäft kümmern kannst.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-border-strong"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-strong bg-accent-soft text-accent">
                <feature.icon />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 leading-7 text-muted">{feature.description}</p>
              <ul className="mt-5 flex flex-col gap-2">
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
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {extras.map((extra) => (
            <div
              key={extra.title}
              className="flex gap-4 rounded-2xl border border-border bg-surface/60 p-6"
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
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

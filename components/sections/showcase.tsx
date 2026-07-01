import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/container";
import { AppWindow } from "@/components/app-window";
import { screenshots } from "@/lib/content";

/** Prüft zur Build-Zeit, ob ein Screenshot in public/ liegt. */
function hasFile(file: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", file));
  } catch {
    return false;
  }
}

/** Platzhalter im Fensterstil, solange ein Screenshot noch fehlt. */
function PlaceholderWindow({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-border-strong" />
        <span className="h-3 w-3 rounded-full bg-border-strong" />
        <span className="h-3 w-3 rounded-full bg-border-strong" />
        <span className="ml-3 text-xs text-muted-2">{title}</span>
      </div>
      <div className="flex aspect-[1503/834] items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]">
        <span className="text-sm text-muted-2">Screenshot folgt</span>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="einblicke" className="border-b border-border py-28 sm:py-40">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow text-accent">Einblicke</span>
          <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
            Ein Blick in die App
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted sm:text-xl">
            VENTRHA ist eine Desktop-Anwendung für Windows – aufgeräumt,
            schnell und auf den Versandalltag zugeschnitten.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-20 sm:gap-32">
          {screenshots.map((shot, i) => {
            const reversed = i % 2 === 1;
            const available = hasFile(shot.file);
            return (
              <div
                key={shot.file}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div className={reversed ? "lg:order-2" : ""}>
                  <span className="eyebrow text-accent">{shot.eyebrow}</span>
                  <h3 className="font-display mt-4 text-3xl font-extrabold leading-[1.05] text-foreground sm:text-4xl">
                    {shot.title}
                  </h3>
                  <p className="mt-5 text-lg leading-8 text-muted">
                    {shot.description}
                  </p>
                </div>
                <div className={reversed ? "lg:order-1" : ""}>
                  {available ? (
                    <AppWindow
                      src={`/${shot.file}`}
                      alt={`VENTRHA – ${shot.title}`}
                      width={shot.width}
                      height={shot.height}
                      title={`VENTRHA – ${shot.eyebrow}`}
                    />
                  ) : (
                    <PlaceholderWindow title={`VENTRHA – ${shot.eyebrow}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

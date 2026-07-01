import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Globe } from "@/components/globe";

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
              {/* Logo fast über den ganzen Erdball */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  aria-hidden
                  className="absolute h-[58%] w-[58%] rounded-full bg-background/45 blur-2xl"
                />
                <Image
                  src="/icon-marketing-dark.png"
                  alt="VENTRHA"
                  width={720}
                  height={720}
                  priority
                  className="relative w-[82%] drop-shadow-[0_0_30px_rgba(10,10,11,0.6)]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

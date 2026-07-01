"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { ArrowRightIcon } from "@/components/icons";
import { site } from "@/lib/site";

const benefits = [
  "Unverbindliche Vorstellung der Software",
  "Beratung zu Carriern & Shop-Anbindung",
  "Antwort in der Regel innerhalb eines Werktags",
];

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const shop = String(data.get("shop") ?? "");
    const message = String(data.get("message") ?? "");

    const body = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Shop-System: ${shop || "—"}`,
      "",
      message,
    ].join("\n");

    const href = `mailto:${site.email}?subject=${encodeURIComponent(
      "Interesse an VENTRHA",
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  }

  return (
    <section id="kontakt" className="py-28 sm:py-40">
      <Container>
        <Reveal className="ring-gradient grid gap-12 rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow text-accent">Kontakt</span>
            <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl">
              Interesse an VENTRHA?
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted">
              VENTRHA wird gerade als eigenständiges Produkt aufgebaut. Melde
              dich unverbindlich – wir zeigen dir, wie VENTRHA deinen Versand
              automatisiert.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-sm leading-6">{b}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-muted">
              Lieber direkt schreiben?{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-accent hover:text-accent-strong"
              >
                {site.email}
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" />
              <Field
                label="E-Mail"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <Field
              label="Shop-System"
              name="shop"
              placeholder="z. B. WooCommerce"
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-medium text-foreground"
              >
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Erzähl uns kurz von deinem Versand …"
                className="rounded-xl border border-border-strong bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-medium text-on-accent transition-colors hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Anfrage senden
              <ArrowRightIcon width={18} height={18} />
            </button>

            {sent && (
              <p className="text-sm text-muted" role="status">
                Dein E-Mail-Programm sollte sich mit der vorausgefüllten Anfrage
                geöffnet haben. Falls nicht, schreib uns direkt an{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-accent hover:text-accent-strong"
                >
                  {site.email}
                </a>
                .
              </p>
            )}
          </form>
        </Reveal>
      </Container>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 rounded-xl border border-border-strong bg-background px-4 text-sm text-foreground placeholder:text-muted-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

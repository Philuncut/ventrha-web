"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/button";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="shrink-0" aria-label="VENTRHA Startseite">
            <Brand size="md" />
          </a>

          {/* Desktop-Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <ButtonLink href="#kontakt" size="md">
              Interesse melden
            </ButtonLink>
          </div>

          {/* Mobile-Umschalter */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menü umschalten"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile-Menü */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background md:hidden"
        >
          <Container className="py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface"
                >
                  {item.label}
                </a>
              ))}
              <ButtonLink
                href="#kontakt"
                size="lg"
                className="mt-3"
                onClick={() => setOpen(false)}
              >
                Interesse melden
              </ButtonLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

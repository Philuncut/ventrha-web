import { Container } from "@/components/container";
import { Brand } from "@/components/brand";
import { navItems, site } from "@/lib/site";

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Brand size="md" />
            <p className="mt-4 text-sm leading-6 text-muted">
              {site.description}
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-2">
              Navigation
            </span>
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

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-2">
              Kontakt
            </span>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Alle Rechte vorbehalten.
          </p>
          <p>Eine Software von UncutTV.</p>
        </div>
      </Container>
    </footer>
  );
}

/**
 * Zentrale Seiten-Konstanten (Navigation, Kontakt, Marke).
 * Einzige Quelle der Wahrheit – wird von Header, Footer und Sektionen genutzt.
 */

export const site = {
  name: "VENTRHA",
  tagline: "Versand neu gedacht.",
  description:
    "Die Versandsoftware für Online-Händler: Multi-Carrier-Labels, automatische Zollformulare und Multi-Shop-Anbindung.",
  email: "office@uncuttv.at",
  url: "https://ventrha.com",
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Einblicke", href: "#einblicke" },
  { label: "Preise", href: "#preise" },
  { label: "Kontakt", href: "#kontakt" },
];

/** Vorformulierter mailto-Link für Interessenten. */
export const contactMailto = `mailto:${site.email}?subject=${encodeURIComponent(
  "Interesse an VENTRHA",
)}&body=${encodeURIComponent(
  "Hallo VENTRHA-Team,\n\nich interessiere mich für eure Versandsoftware und würde gerne mehr erfahren.\n\nUnser Shop-System: \nUngefähres Versandvolumen pro Monat: \n\nViele Grüße",
)}`;

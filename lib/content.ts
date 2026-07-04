import type { ComponentType, SVGProps } from "react";
import {
  CustomsIcon,
  GlobeIcon,
  LayersIcon,
  PlugIcon,
  PrinterIcon,
  SlidersIcon,
  TruckIcon,
} from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export type Feature = {
  icon: Icon;
  title: string;
  description: string;
  points: string[];
};

/** Vier Hauptfunktionen – die Kernbotschaft der Seite. */
export const features: Feature[] = [
  {
    icon: TruckIcon,
    title: "Multi-Carrier-Versand",
    description:
      "Ein Tool für alle Versanddienstleister. VENTRHA wählt den passenden Carrier je Bestellung automatisch anhand deiner Regeln.",
    points: ["DHL Paket direkt", "GLS & Hermes", "Und viele weitere Carrier"],
  },
  {
    icon: CustomsIcon,
    title: "Automatische Zollformulare",
    description:
      "Für internationale Sendungen erzeugt VENTRHA die richtigen Zollpapiere automatisch – abhängig vom Empfängerland.",
    points: ["Commercial Invoice", "CN22 & CN23", "Länderabhängig korrekt"],
  },
  {
    icon: PlugIcon,
    title: "Multi-Shop-Anbindung",
    description:
      "Bestellungen werden direkt aus deinem Shop synchronisiert. Die offene Architektur erlaubt weitere Shop-Adapter.",
    points: ["WooCommerce", "Offene Adapter-Architektur", "Automatischer Sync"],
  },
  {
    icon: PrinterIcon,
    title: "Automatischer Label-Druck",
    description:
      "Vom Auftrag zum fertigen Versandlabel in einem Klick – Labels landen direkt auf deinem Drucker, ganz ohne Copy-and-paste.",
    points: ["Direkter Druckerausgang", "Ein-Klick-Workflow", "Kein manuelles Eintippen"],
  },
];

export type Screenshot = {
  /** Dateiname in public/ – erscheint automatisch, sobald vorhanden. */
  file: string;
  width: number;
  height: number;
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * App-Einblicke als alternierende Reihen.
 * Noch fehlende Screenshots werden als Platzhalter dargestellt.
 */
export const screenshots: Screenshot[] = [
  {
    file: "screen1.png",
    width: 1503,
    height: 834,
    eyebrow: "Überblick",
    title: "Alles Wichtige auf einen Blick",
    description:
      "Das Dashboard zeigt offene Bestellungen, den Versandstatus deiner Kunden und internationale Sendungen mit Zollbedarf – live und sortiert.",
  },
  {
    file: "screen2.png",
    width: 1503,
    height: 834,
    eyebrow: "Bestellungen",
    title: "Aufträge automatisch synchronisiert",
    description:
      "Bestellungen laufen direkt aus deinem Shop ein. Filtere nach Status, Land oder Carrier und bearbeite den Versand im Stapel.",
  },
  {
    file: "screen3.png",
    width: 1503,
    height: 834,
    eyebrow: "Label & Zoll",
    title: "Label und Zollpapiere in einem Schritt",
    description:
      "Carrier wählen, Label erzeugen, Zollformulare automatisch beilegen – und direkt an den Drucker senden. Ohne Medienbruch.",
  },
];

export type Extra = {
  icon: Icon;
  title: string;
  description: string;
};

/** Zusätzliche Fähigkeiten – als kompakte Leiste. */
export const extras: Extra[] = [
  {
    icon: SlidersIcon,
    title: "Regel-Engine",
    description:
      "Carrier-Wahl pro Bestellung nach Land oder Default-Regel – einmal einrichten, dauerhaft automatisch.",
  },
  {
    icon: GlobeIcon,
    title: "Mehrsprachig",
    description:
      "Oberfläche in Deutsch, Englisch, Französisch, Italienisch, Spanisch und Niederländisch.",
  },
  {
    icon: LayersIcon,
    title: "Multi-Tenant",
    description:
      "Als SaaS aufgebaut: mehrere Mandanten und Standorte sauber getrennt verwaltbar.",
  },
];

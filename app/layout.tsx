import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ventrha.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VENTRHA – Versand neu gedacht",
    template: "%s · VENTRHA",
  },
  description:
    "VENTRHA ist die Versandsoftware für Online-Händler: Multi-Carrier-Labels, automatische Zollformulare und Multi-Shop-Anbindung – vom Shop zum Versandlabel in einem Klick.",
  keywords: [
    "Versandsoftware",
    "Multi-Carrier",
    "Versandlabels",
    "Zollformulare",
    "WooCommerce Versand",
    "DHL",
    "GLS",
    "E-Commerce Versand",
  ],
  authors: [{ name: "VENTRHA" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "VENTRHA",
    title: "VENTRHA – Versand neu gedacht",
    description:
      "Multi-Carrier-Versand, automatische Zollformulare und Multi-Shop-Anbindung für Online-Händler.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VENTRHA – Versand neu gedacht",
    description:
      "Multi-Carrier-Versand, automatische Zollformulare und Multi-Shop-Anbindung für Online-Händler.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

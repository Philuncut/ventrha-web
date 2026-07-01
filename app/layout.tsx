import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.ico",
    apple: "/icon.png",
  },
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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

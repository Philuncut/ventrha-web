"use client";

import { useEffect, useRef } from "react";
import {
  geoOrthographic,
  geoPath,
  geoGraticule,
  geoInterpolate,
  geoDistance,
  type GeoPermissibleObjects,
} from "d3-geo";

/**
 * Rotierende Weltkugel auf Canvas (orthografische Projektion mit echten
 * Ländergrenzen). Versandrouten von Wien zu Weltstädten mit wanderndem
 * Lichtimpuls. Pro Frame neu gezeichnet -> flüssige Rotation ohne DOM-Last.
 * Kartendaten werden dynamisch nachgeladen (nicht im Initial-Bundle).
 * prefers-reduced-motion stoppt die Drehung (statische Ansicht).
 */

// Knotenpunkte weltweit (Index 0 = VENTRHA-Hub Wien).
const CITIES: [number, number][] = [
  [16.37, 48.21], // Wien (Hub)
  [-0.13, 51.51], // London
  [-74.0, 40.71], // New York
  [55.27, 25.2], // Dubai
  [3.39, 6.52], // Lagos
  [28.98, 41.01], // Istanbul
  [103.8, 1.35], // Singapur
  [139.69, 35.68], // Tokio
  [-46.63, -23.55], // São Paulo
  [-118.24, 34.05], // Los Angeles
  [28.04, -26.2], // Johannesburg
  [72.87, 19.07], // Mumbai
  [31.24, 30.04], // Kairo
  [151.21, -33.87], // Sydney
  [121.47, 31.23], // Shanghai
];

// Verbindungen (Index-Paare): viele vom Hub, dazu ein paar Stadt-zu-Stadt.
const PAIRS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [0, 9], [0, 10], [0, 11], [0, 12], [0, 13],
  [1, 2], [3, 11], [6, 7], [6, 13], [2, 9], [5, 12], [7, 14],
];

// Großkreis-Routen (dicht abgetastet) einmalig vorberechnen.
const ROUTES = PAIRS.map(([ai, bi]) => {
  const a = CITIES[ai];
  const b = CITIES[bi];
  const interp = geoInterpolate(a, b);
  return {
    a,
    b,
    line: {
      type: "LineString" as const,
      coordinates: Array.from({ length: 40 }, (_, i) => interp(i / 39)),
    },
  };
});

const graticule = geoGraticule().step([20, 20])();
const HALF_PI = Math.PI / 2;
const RUST = "hsla(16, 95%, 54%, 1)";
const LILA = "hsla(287, 80%, 69%, 1)";

export function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const projection = geoOrthographic().clipAngle(90).precision(0.4);
    const pathGen = geoPath(projection, ctx);

    let size = 0;
    let R = 0;
    let dpr = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let land: any = null;
    let lambda = -12; // Start: Europa zentriert
    const phi = -22; // leichte Neigung
    let raf = 0;
    let last = performance.now();
    let mounted = true;

    function resize() {
      // clientWidth = unskalierte Layout-Breite (ignoriert CSS-transform: scale
      // der Eltern). Sonst würde der Canvas beim Mount in der herunterskalierten
      // Größe angelegt und beim Aufziehen unscharf hochskaliert.
      size = Math.max(1, canvas!.clientWidth);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(size * dpr);
      canvas!.height = Math.round(size * dpr);
      R = size / 2 - 2;
      projection.scale(R).translate([size / 2, size / 2]);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function draw(t: number) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      projection.rotate([lambda, phi]);
      const center: [number, number] = [-lambda, -phi];

      // Langsam wandernder Farbton für alle Linien (Blau -> Cyan -> Indigo).
      const hue = 214 + Math.sin(t / 2200) * 36; // ~178..250
      const line = (a: number) => `hsla(${hue}, 85%, 63%, ${a})`;
      const lineBright = (a: number) => `hsla(${hue}, 95%, 72%, ${a})`;

      // Kugelkörper
      const g = ctx.createRadialGradient(
        size * 0.4,
        size * 0.34,
        R * 0.1,
        size / 2,
        size / 2,
        R,
      );
      g.addColorStop(0, `hsla(${hue}, 85%, 58%, 0.16)`);
      g.addColorStop(0.6, `hsla(${hue}, 85%, 58%, 0.03)`);
      g.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, R, 0, 2 * Math.PI);
      ctx.fillStyle = g;
      ctx.fill();

      // Gitternetz
      ctx.beginPath();
      pathGen(graticule as GeoPermissibleObjects);
      ctx.strokeStyle = line(0.13);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Länder
      if (land) {
        ctx.beginPath();
        for (const f of land.features) pathGen(f);
        ctx.fillStyle = line(0.1);
        ctx.fill();
        ctx.strokeStyle = line(0.4);
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Rand
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, R, 0, 2 * Math.PI);
      ctx.strokeStyle = line(0.55);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Routen + wandernder Lichtimpuls (ab und zu in Rost / Lila)
      for (let i = 0; i < ROUTES.length; i++) {
        const r = ROUTES[i];
        const da = geoDistance(r.a, center);
        const db = geoDistance(r.b, center);
        if (Math.min(da, db) >= HALF_PI + 0.45) continue; // ganz auf der Rückseite

        ctx.setLineDash([]);
        ctx.beginPath();
        pathGen(r.line);
        ctx.strokeStyle = line(0.26);
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Farbe des Impulses: meist Blau/Cyan; nur wenige Routen blitzen
        // gelegentlich in Rost bzw. Lila auf (seltener, mit Glow).
        let col = lineBright(1);
        let colored = false;
        if (i % 4 === 0) {
          const cyc = (t / 1000 + i * 5) % 32;
          if (cyc < 1.6) {
            col = RUST;
            colored = true;
          } else if (cyc >= 16 && cyc < 17.6) {
            col = LILA;
            colored = true;
          }
        }

        const period = 2600;
        const off = (((t + i * 430) % period) / period) * 420;
        ctx.beginPath();
        pathGen(r.line);
        ctx.setLineDash([7, 420]);
        ctx.lineDashOffset = -off;
        ctx.strokeStyle = col;
        ctx.lineWidth = colored ? 2.2 : 1.8;
        ctx.shadowColor = col;
        ctx.shadowBlur = colored ? 9 : 0;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.setLineDash([]);

      // Knoten mit Ping
      const node = (coord: [number, number], base: number, phase: number) => {
        if (geoDistance(coord, center) >= HALF_PI - 0.02) return;
        const p = projection(coord);
        if (!p) return;
        const period = 2800;
        const ph = (((t + phase) % period) / period) as number;
        ctx.beginPath();
        ctx.arc(p[0], p[1], base + ph * base * 2.3, 0, 2 * Math.PI);
        ctx.fillStyle = lineBright(0.5 * (1 - ph));
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p[0], p[1], base, 0, 2 * Math.PI);
        ctx.fillStyle = lineBright(1);
        ctx.fill();
      };
      for (let i = 0; i < CITIES.length; i++)
        node(CITIES[i], size * (i === 0 ? 0.009 : 0.005), i * 300);
    }

    function frame(now: number) {
      const dt = now - last;
      last = now;
      lambda += dt * 0.006; // ~6°/s -> eine Umdrehung in 60s
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    // Kartendaten dynamisch laden
    Promise.all([
      import("world-atlas/countries-110m.json"),
      import("topojson-client"),
    ]).then(([w, topo]) => {
      if (!mounted) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const world = w.default as any;
      land = topo.feature(world, world.objects.countries);
      if (reduce) draw(0);
    });

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      role="img"
      aria-label="Rotierende Weltkugel mit VENTRHAs globalem Versandnetzwerk"
    />
  );
}

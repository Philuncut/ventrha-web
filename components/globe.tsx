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

const ACCENT = "#3b82f6";
const ACCENT2 = "#22d3ee";

// VENTRHA-Hub (Wien) + Zielstädte.
const HUB: [number, number] = [16.37, 48.21];
const CITIES: [number, number][] = [
  [-0.13, 51.51], // London
  [-74.0, 40.71], // New York
  [55.27, 25.2], // Dubai
  [3.39, 6.52], // Lagos
  [28.98, 41.01], // Istanbul
  [103.8, 1.35], // Singapur
];

// Großkreis-Routen (dicht abgetastet) einmalig vorberechnen.
const ROUTES = CITIES.map((target) => ({
  target,
  line: {
    type: "LineString" as const,
    coordinates: Array.from({ length: 48 }, (_, i) =>
      geoInterpolate(HUB, target)(i / 47),
    ),
  },
}));

const graticule = geoGraticule().step([20, 20])();
const HALF_PI = Math.PI / 2;

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
      const rect = canvas!.getBoundingClientRect();
      size = Math.max(1, rect.width);
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

      // Kugelkörper
      const g = ctx.createRadialGradient(
        size * 0.4,
        size * 0.34,
        R * 0.1,
        size / 2,
        size / 2,
        R,
      );
      g.addColorStop(0, "rgba(59,130,246,0.16)");
      g.addColorStop(0.6, "rgba(59,130,246,0.03)");
      g.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, R, 0, 2 * Math.PI);
      ctx.fillStyle = g;
      ctx.fill();

      // Gitternetz
      ctx.beginPath();
      pathGen(graticule as GeoPermissibleObjects);
      ctx.strokeStyle = "rgba(59,130,246,0.13)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Länder
      if (land) {
        ctx.beginPath();
        for (const f of land.features) pathGen(f);
        ctx.fillStyle = "rgba(59,130,246,0.11)";
        ctx.fill();
        ctx.strokeStyle = "rgba(59,130,246,0.4)";
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Rand
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, R, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(59,130,246,0.55)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Routen + wandernder Lichtimpuls
      for (let i = 0; i < ROUTES.length; i++) {
        const r = ROUTES[i];
        if (geoDistance(r.target, center) >= HALF_PI - 0.03) continue;
        ctx.setLineDash([]);
        ctx.beginPath();
        pathGen(r.line);
        ctx.strokeStyle = "rgba(59,130,246,0.4)";
        ctx.lineWidth = 0.9;
        ctx.stroke();

        const period = 2600;
        const off = (((t + i * 480) % period) / period) * 420;
        ctx.beginPath();
        pathGen(r.line);
        ctx.setLineDash([7, 420]);
        ctx.lineDashOffset = -off;
        ctx.strokeStyle = ACCENT2;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Knoten mit Ping
      const node = (
        coord: [number, number],
        color: string,
        base: number,
        phase: number,
      ) => {
        if (geoDistance(coord, center) >= HALF_PI - 0.02) return;
        const p = projection(coord);
        if (!p) return;
        const period = 2800;
        const ph = (((t + phase) % period) / period) as number;
        ctx.beginPath();
        ctx.arc(p[0], p[1], base + ph * base * 2.3, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(34,211,238,${0.5 * (1 - ph)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p[0], p[1], base, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      };
      for (let i = 0; i < ROUTES.length; i++)
        node(ROUTES[i].target, ACCENT, size * 0.006, i * 460);
      node(HUB, ACCENT2, size * 0.009, 0);
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

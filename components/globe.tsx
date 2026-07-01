import {
  geoOrthographic,
  geoPath,
  geoGraticule10,
  geoInterpolate,
  geoDistance,
} from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";

/**
 * Halbtransparente Weltkugel als SVG (orthografische Projektion mit echten
 * Ländergrenzen). Versandrouten von Wien zu Weltstädten als animierte
 * Verbindungslinien mit wanderndem Lichtimpuls. Geometrie wird zur Build-Zeit
 * berechnet -> statisches SVG, keine Client-Last. reduced-motion greift über
 * die globale CSS-Regel.
 */

const R = 98;
// Blickzentrum (lon, lat): Europa/Mittelmeer im Fokus.
const CENTER: [number, number] = [12, 28];

const projection = geoOrthographic()
  .scale(R)
  .translate([100, 100])
  .rotate([-CENTER[0], -CENTER[1]])
  .clipAngle(90);

const path = geoPath(projection);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const world = worldData as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countries = (feature(world, world.objects.countries) as any).features as {
  id: string;
}[];

const graticuleD = path(geoGraticule10()) ?? undefined;
const sphereD = path({ type: "Sphere" }) ?? undefined;

// VENTRHA-Hub (Wien) + Zielstädte für die Routen.
const HUB: [number, number] = [16.37, 48.21];
const cities: { name: string; coord: [number, number] }[] = [
  { name: "London", coord: [-0.13, 51.51] },
  { name: "New York", coord: [-74.0, 40.71] },
  { name: "Dubai", coord: [55.27, 25.2] },
  { name: "Lagos", coord: [3.39, 6.52] },
  { name: "Istanbul", coord: [28.98, 41.01] },
];

/** Ist ein Punkt auf der sichtbaren Erdhalbkugel? */
function isVisible(c: [number, number]): boolean {
  return geoDistance(c, CENTER) < Math.PI / 2 - 0.03;
}

/** Großkreis-Route als dicht abgetastete Linie (folgt der Kugel). */
function routePath(a: [number, number], b: [number, number]): string | undefined {
  const interp = geoInterpolate(a, b);
  const pts = Array.from({ length: 44 }, (_, i) => interp(i / 43));
  return path({ type: "LineString", coordinates: pts }) ?? undefined;
}

const hubXY = projection(HUB);
const visibleCities = cities.filter((c) => isVisible(c.coord));

export function Globe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Globales Versandnetzwerk von VENTRHA"
    >
      <defs>
        <radialGradient id="globe-sphere" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="globe-arc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
        <clipPath id="globe-clip">
          <circle cx={100} cy={100} r={R} />
        </clipPath>
      </defs>

      {/* Kugelkörper */}
      {sphereD && <path d={sphereD} fill="url(#globe-sphere)" />}

      <g clipPath="url(#globe-clip)">
        {/* Gitternetz */}
        {graticuleD && (
          <path
            d={graticuleD}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.14"
            strokeWidth="0.5"
          />
        )}

        {/* Länder */}
        <g
          fill="var(--accent)"
          fillOpacity="0.13"
          stroke="var(--accent)"
          strokeOpacity="0.4"
          strokeWidth="0.4"
        >
          {countries.map((c, i) => {
            const d = path(
              c as unknown as Parameters<typeof path>[0],
            );
            return d ? <path key={c.id ?? i} d={d} /> : null;
          })}
        </g>
      </g>

      {/* Rand */}
      <circle
        cx={100}
        cy={100}
        r={R}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Routen: faint Basis + wandernder Lichtimpuls */}
      <g fill="none" strokeLinecap="round">
        {visibleCities.map((city, i) => {
          const d = routePath(HUB, city.coord);
          if (!d) return null;
          return (
            <g key={city.name}>
              <path
                d={d}
                stroke="var(--accent)"
                strokeOpacity="0.45"
                strokeWidth="0.9"
              />
              <path
                d={d}
                pathLength={120}
                stroke="url(#globe-arc-grad)"
                strokeWidth="2.1"
                className="globe-arc"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </g>
          );
        })}
      </g>

      {/* Zielknoten */}
      <g>
        {visibleCities.map((city, i) => {
          const xy = projection(city.coord);
          if (!xy) return null;
          return (
            <g key={city.name}>
              <circle
                cx={xy[0]}
                cy={xy[1]}
                r={2.6}
                fill="var(--accent)"
                fillOpacity="0.5"
                className="globe-ping"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
              <circle cx={xy[0]} cy={xy[1]} r={1.5} fill="var(--accent-2)" />
            </g>
          );
        })}

        {/* Hub Wien */}
        {hubXY && (
          <>
            <circle
              cx={hubXY[0]}
              cy={hubXY[1]}
              r={3.4}
              fill="var(--accent-2)"
              fillOpacity="0.55"
              className="globe-ping"
            />
            <circle
              cx={hubXY[0]}
              cy={hubXY[1]}
              r={2}
              fill="var(--accent-2)"
            />
          </>
        )}
      </g>
    </svg>
  );
}

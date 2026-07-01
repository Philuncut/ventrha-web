/**
 * Halbtransparente Weltkugel als SVG: Gitternetz (Meridiane/Breitenkreise),
 * Knotenpunkte mit Ping und Verbindungsbögen, über die ein Lichtimpuls wandert.
 * Reine SVG/CSS-Animation (GPU), keine 3D-Bibliothek. reduced-motion greift
 * über die globale CSS-Regel.
 */

const C = 100;
const R = 96;

// Knotenpunkte auf der Kugeloberfläche (2D-Projektion).
const nodes: [number, number][] = [
  [66, 56],
  [140, 66],
  [156, 122],
  [96, 158],
  [42, 116],
];

// Verbindungen zwischen den Knoten (Netz).
const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
];

// Quadratischer Bogen, der vom Zentrum weg nach außen wölbt (über die Kugel).
function arcPath([ai, bi]: [number, number]): string {
  const [ax, ay] = nodes[ai];
  const [bx, by] = nodes[bi];
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const k = 0.5;
  const cx = mx + (mx - C) * k;
  const cy = my + (my - C) * k;
  return `M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
}

// Breitenkreise als flache Ellipsen.
const parallels = [-58, -30, 0, 30, 58].map((y) => ({
  cy: C + y,
  rx: Math.sqrt(R * R - y * y),
  ry: Math.sqrt(R * R - y * y) * 0.16,
}));

export function Globe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Globales Versandnetzwerk"
    >
      <defs>
        <radialGradient id="globe-sphere" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
          <stop offset="58%" stopColor="var(--accent)" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
        <linearGradient id="globe-arc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>

      {/* Kugelkörper + Rand */}
      <circle cx={C} cy={C} r={R} fill="url(#globe-sphere)" />
      <circle
        cx={C}
        cy={C}
        r={R}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Gitternetz */}
      <g stroke="var(--accent)" strokeOpacity="0.3" fill="none" strokeWidth="1">
        {parallels.map((p, i) => (
          <ellipse key={`p${i}`} cx={C} cy={p.cy} rx={p.rx} ry={p.ry} />
        ))}
        <ellipse cx={C} cy={C} rx={78} ry={R} />
        <ellipse cx={C} cy={C} rx={42} ry={R} />
        <line x1={C} y1={C - R} x2={C} y2={C + R} />
      </g>

      {/* Verbindungsbögen: faint Basis + wandernder Lichtimpuls */}
      <g fill="none" strokeLinecap="round">
        {edges.map((e, i) => {
          const d = arcPath(e);
          return (
            <g key={`e${i}`}>
              <path
                d={d}
                stroke="var(--accent)"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <path
                d={d}
                pathLength={120}
                stroke="url(#globe-arc-grad)"
                strokeWidth="1.75"
                className="globe-arc"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </g>
          );
        })}
      </g>

      {/* Knotenpunkte mit Ping */}
      <g>
        {nodes.map(([x, y], i) => (
          <g key={`n${i}`}>
            <circle
              cx={x}
              cy={y}
              r={3}
              fill="var(--accent)"
              fillOpacity="0.5"
              className="globe-ping"
              style={{ animationDelay: `${i * 0.55}s` }}
            />
            <circle cx={x} cy={y} r={1.8} fill="var(--accent-2)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

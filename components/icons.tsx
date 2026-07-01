import type { SVGProps } from "react";

/**
 * Schlanke, strichbasierte Icons (24×24, currentColor).
 * Bewusst reduziert, passend zum monochromen Markenauftritt.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** Multi-Carrier-Versand */
export function TruckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2 5h11v11H2z" />
      <path d="M13 8h4l3 3v5h-7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </Base>
  );
}

/** Automatische Zollformulare */
export function CustomsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M14 2v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </Base>
  );
}

/** Multi-Shop-Anbindung */
export function PlugIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 22v-5" />
      <path d="M9 7V2" />
      <path d="M15 7V2" />
      <path d="M7 7h10v4a5 5 0 0 1-10 0z" />
    </Base>
  );
}

/** Automatischer Label-Druck */
export function PrinterIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </Base>
  );
}

/** Regel-Engine */
export function SlidersIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M2 14h4M10 8h4M18 16h4" />
    </Base>
  );
}

/** Mehrsprachigkeit */
export function GlobeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
    </Base>
  );
}

/** Multi-Tenant */
export function LayersIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </Base>
  );
}

/** Pfeil (Links/CTAs) */
export function ArrowRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Base>
  );
}

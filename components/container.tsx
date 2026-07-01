import type { ReactNode } from "react";

/** Zentrierter Inhaltsrahmen mit konsistenter maximaler Breite und Rändern. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

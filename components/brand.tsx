import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Marken-Lockup: weißes Icon (transparent) + Wortmarke im Logo-Stil.
 * Für dunkle Hintergründe. `size` skaliert Icon und Schriftgröße gemeinsam.
 */
export function Brand({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 30, text: "text-xl" },
    lg: { icon: 40, text: "text-3xl" },
  }[size];

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/icon-dark.png"
        alt=""
        aria-hidden
        width={dims.icon}
        height={dims.icon}
        priority
        className="h-auto w-auto"
        style={{ width: dims.icon, height: dims.icon }}
      />
      <span className={`wordmark ${dims.text} leading-none text-foreground`}>
        {site.name}
      </span>
    </span>
  );
}

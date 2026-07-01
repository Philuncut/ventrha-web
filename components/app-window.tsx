import Image from "next/image";

/**
 * Rahmen im Stil eines Desktop-Fensters (VENTRHA ist eine Desktop-App).
 * Zeigt einen App-Screenshot mit Titelleiste und Ampel-Punkten.
 */
export function AppWindow({
  src,
  alt,
  width,
  height,
  title = "VENTRHA",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl shadow-black/50 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted-2">{title}</span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="block h-auto w-full"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
    </div>
  );
}

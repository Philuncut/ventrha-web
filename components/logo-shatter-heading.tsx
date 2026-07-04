"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/* ── Farben (RGB) für die glühenden Partikel ─────────────────────────────── */
const FG = [247, 247, 248] as const; // Foreground – finaler Textton
const BLUE = [96, 165, 250] as const; // Accent
const CYAN = [34, 211, 238] as const; // Accent-2

type Pt = { x: number; y: number };
type Particle = {
  sx: number; // Quelle (Logo-Pixel)
  sy: number;
  ex: number; // Explosionsziel
  ey: number;
  dx: number; // Ziel (Text-Pixel)
  dy: number;
  seed: number; // 0..1 – Stagger/Streuung
  cool: boolean; // Flugfarbe blau vs. cyan
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const frac = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t); // smoothstep

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Glüh-Sprite (radialer Verlauf) einmalig vorrendern – schnell per drawImage. */
function makeSprite(rgb: readonly number[], size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  const [red, gr, bl] = rgb;
  grad.addColorStop(0, `rgba(${red},${gr},${bl},1)`);
  grad.addColorStop(0.3, `rgba(${red},${gr},${bl},0.7)`);
  grad.addColorStop(1, `rgba(${red},${gr},${bl},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Punktwolke aus einem gezeichneten Offscreen-Canvas ziehen. */
function samplePoints(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  step: number,
): Pt[] {
  const pts: Pt[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > 90) pts.push({ x: x0 + x, y: y0 + y });
    }
  }
  return pts;
}

/** Fisher-Yates – für organische Zuordnung Logo↔Text (Schwarm statt Wischen). */
function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Spektakulärer Section-Auftakt: Das scharfe VENTRHA-Logo löst sich beim
 * Scrollen in hunderte glühende Partikel auf, die nach außen explodieren, nach
 * unten strömen – und sich exakt zur Headline zusammensetzen. Zum Schluss
 * blendet der echte (scharfe, zugängliche) DOM-Text ein. Scroll-gescrubbt.
 * prefers-reduced-motion -> statisch.
 */
export function LogoShatterHeading({
  eyebrow,
  lines,
  children,
  logo = "/icon-marketing-dark.png",
  className = "",
}: {
  eyebrow: string;
  lines: string[];
  children?: ReactNode;
  logo?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const textEl = textRef.current;
    if (!section || !canvas || !textEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let sprites: { fg: HTMLCanvasElement; blue: HTMLCanvasElement; cyan: HTMLCanvasElement } | null =
      null;
    let logoImg: HTMLImageElement | null = null;
    let logoCx = 0;
    let logoCy = 0;
    let lx0 = 0;
    let ly0 = 0;
    let logoSize = 0;

    /* Logo- und Text-Punktwolken sampeln und Partikel bilden. */
    async function build() {
      const vh = window.innerHeight;
      W = section!.clientWidth;
      H = vh; // Bühne = ein Viewport (sticky)

      // Sichtbares Canvas (scharf via DPR).
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = W < 640;
      const maxN = small ? 1000 : 1600;

      // ── Logo-Punkte (aus dem scharfen Bitmap) ──────────────────────
      logoSize = clamp(Math.min(W * 0.5, 300), 160, 300);
      logoCx = W / 2;
      logoCy = H * 0.3;
      lx0 = logoCx - logoSize / 2;
      ly0 = logoCy - logoSize / 2;
      const off = document.createElement("canvas");
      off.width = Math.ceil(logoSize);
      off.height = Math.ceil(logoSize);
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      try {
        logoImg = await loadImage(logo!);
      } catch {
        return; // Logo nicht ladbar -> statischer DOM-Text bleibt sichtbar
      }
      octx.drawImage(logoImg, 0, 0, off.width, off.height);
      const logoData = octx.getImageData(0, 0, off.width, off.height).data;
      let srcPts = samplePoints(logoData, off.width, off.height, lx0, ly0, 2);

      // ── Text-Punkte: jede Zeile exakt in ihre gemessene <span>-Box ─
      const cRect = canvas!.getBoundingClientRect();
      const spanRects = lineRefs.current
        .slice(0, lines.length)
        .map((el) => el?.getBoundingClientRect());
      const h2 = lineRefs.current[0]?.parentElement;
      if (!h2 || spanRects.some((r) => !r)) return;
      const cs = getComputedStyle(h2);
      const tOff = document.createElement("canvas");
      tOff.width = Math.ceil(W);
      tOff.height = Math.ceil(H);
      const tctx = tOff.getContext("2d", { willReadFrequently: true })!;
      tctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      tctx.fillStyle = "#fff";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      (tctx as unknown as { letterSpacing: string }).letterSpacing =
        cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      lines.forEach((line, i) => {
        const r = spanRects[i]!;
        tctx.fillText(
          line,
          r.left - cRect.left + r.width / 2,
          r.top - cRect.top + r.height / 2,
        );
      });
      const textData = tctx.getImageData(0, 0, tOff.width, tOff.height).data;
      let dstPts = samplePoints(textData, tOff.width, tOff.height, 0, 0, 2);

      if (!srcPts.length || !dstPts.length) return;

      // Beide Wolken auf gleiche Anzahl bringen (gleichmäßig ausdünnen).
      const N = Math.min(srcPts.length, dstPts.length, maxN);
      const thin = (pts: Pt[]) => {
        const out: Pt[] = [];
        const stepF = pts.length / N;
        for (let i = 0; i < N; i++) out.push(pts[Math.floor(i * stepF)]);
        return out;
      };
      srcPts = thin(shuffle(srcPts));
      dstPts = thin(shuffle(dstPts));

      // ── Partikel bilden (inkl. Explosionsziel nach außen/unten) ────
      const minWH = Math.min(W, H);
      particles = srcPts.map((s, i) => {
        const d = dstPts[i];
        const ang = Math.random() * Math.PI * 2;
        const dist = minWH * (0.28 + Math.random() * 0.42);
        return {
          sx: s.x,
          sy: s.y,
          ex: logoCx + Math.cos(ang) * dist,
          ey: logoCy + Math.sin(ang) * dist * 0.7 + minWH * 0.12,
          dx: d.x,
          dy: d.y,
          seed: Math.random(),
          cool: Math.random() < 0.5,
        };
      });

      const spriteSize = Math.round((small ? 22 : 28) * dpr);
      sprites = {
        fg: makeSprite(FG, spriteSize),
        blue: makeSprite(BLUE, spriteSize),
        cyan: makeSprite(CYAN, spriteSize),
      };
    }

    /* Ein Frame: aktuellen Scroll-Fortschritt bestimmen und zeichnen. */
    function render() {
      const rect = section!.getBoundingClientRect();
      // Framer-Offset ["start end","end end"].
      const P = clamp((window.innerHeight - rect.top) / rect.height, 0, 1);

      ctx!.clearRect(0, 0, W, H);

      // Handoff: Canvas raus, scharfer DOM-Text rein.
      const canvasO = 1 - frac(P, 0.88, 1);
      canvas!.style.opacity = String(canvasO);
      textEl!.style.opacity = String(frac(P, 0.85, 0.98));
      if (canvasO <= 0.001) return;

      // Glow hinter dem noch zusammenhängenden Logo.
      const coreO = (1 - frac(P, 0.42, 0.62)) * 0.5;
      if (coreO > 0.01) {
        const rG = Math.min(W * 0.36, 260);
        const g = ctx!.createRadialGradient(logoCx, logoCy, 0, logoCx, logoCy, rG);
        g.addColorStop(0, `rgba(59,130,246,${coreO})`);
        g.addColorStop(1, "rgba(59,130,246,0)");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, W, H);
      }

      // Scharfes Logo-Bitmap im Ruhezustand – löst sich beim Explodieren auf.
      const logoO = 1 - frac(P, 0.4, 0.52);
      if (logoImg && logoO > 0.01) {
        ctx!.globalAlpha = logoO;
        ctx!.drawImage(logoImg, lx0, ly0, logoSize, logoSize);
        ctx!.globalAlpha = 1;
      }

      if (!sprites) return;
      const partLayer = frac(P, 0.4, 0.5); // Partikel erscheinen zur Explosion

      ctx!.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const st = p.seed * 0.05;
        const e = smooth(frac(P, 0.42 + st, 0.58 + st)); // Explosion
        const c = smooth(frac(P, 0.58 + st, 0.82 + st)); // Sammeln zum Text

        let x: number;
        let y: number;
        if (P < 0.58 + st) {
          x = lerp(p.sx, p.ex, e);
          y = lerp(p.sy, p.ey, e);
        } else {
          x = lerp(p.ex, p.dx, c);
          y = lerp(p.ey, p.dy, c);
        }

        const flight = e * (1 - c); // 0 in Ruhe, 1 mitten im Flug
        const sprite =
          flight > 0.15 ? (p.cool ? sprites.cyan : sprites.blue) : sprites.fg;
        // Ruhende Partikel etwas größer -> Text/Logo wirken dichter, weniger dottig.
        const size = (3.2 + flight * 4) * (0.85 + p.seed * 0.35);
        ctx!.globalAlpha = partLayer * (0.6 + 0.4 * (1 - flight));
        ctx!.drawImage(sprite, x - size / 2, y - size / 2, size, size);
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
    }

    function loop() {
      if (visible) render();
      raf = requestAnimationFrame(loop);
    }

    let resizeT = 0;
    function onResize() {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(build, 180);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(section);

    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    Promise.resolve(fontsReady).then(build);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [reduce, logo, eyebrow, lines]);

  /* Reduzierte Bewegung -> statische, zentrierte Überschrift. */
  if (reduce) {
    return (
      <div
        className={`relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32 ${className}`}
      >
        <span className="eyebrow block text-accent">{eyebrow}</span>
        <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
          {lines.join(" ")}
        </h2>
        {children}
      </div>
    );
  }

  return (
    <section ref={sectionRef} className={`relative h-[200vh] ${className}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Partikel-Bühne */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
        />

        {/* Echter Text – zugänglich & SEO; blendet am Ende scharf ein. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div ref={textRef} className="max-w-3xl opacity-0">
            <span className="eyebrow block text-accent">{eyebrow}</span>
            <h2 className="font-display mt-5 text-balance text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
              {lines.map((line, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="block"
                >
                  {line}
                </span>
              ))}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

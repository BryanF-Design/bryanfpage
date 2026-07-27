"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Esquina de telaraña: el detalle de autor que cose las secciones.
 *
 * No es un adorno genérico — es geometría de red real. Radios que salen de un
 * nodo de anclaje y anillos que **caen** hacia él (las cuadráticas tiran del
 * punto medio hacia adentro), que es exactamente lo que hace una tela de araña
 * bajo su propio peso. Una tela perfectamente circular se lee como diana; una
 * que cuelga se lee como tela.
 *
 * Se dibuja sola al entrar en viewport, del ancla hacia afuera: el hilo se
 * lanza y se tensa.
 */

const ANGLES = [8, 26, 45, 64, 82].map((deg) => (deg * Math.PI) / 180);
const RINGS = [26, 48, 70, 92];
const SPOKE_START = 5;
const SPOKE_END = 104;

const at = (r: number, a: number) => [r * Math.cos(a), r * Math.sin(a)] as const;
const n = (v: number) => v.toFixed(2);

/** Anillo con caída: control point tirado hacia el ancla en cada tramo. */
function ringPath(r: number): string {
  const [x0, y0] = at(r, ANGLES[0]);
  let d = `M ${n(x0)} ${n(y0)}`;
  for (let i = 1; i < ANGLES.length; i++) {
    const [cx, cy] = at(r * 0.86, (ANGLES[i - 1] + ANGLES[i]) / 2);
    const [x, y] = at(r, ANGLES[i]);
    d += ` Q ${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
  }
  return d;
}

const RING_PATHS = RINGS.map(ringPath);
const SPOKES = ANGLES.map((a) => {
  const [x1, y1] = at(SPOKE_START, a);
  const [x2, y2] = at(SPOKE_END, a);
  return { x1: n(x1), y1: n(y1), x2: n(x2), y2: n(y2) };
});

const CORNER_TRANSFORM = {
  tl: undefined,
  tr: "scaleX(-1)",
  bl: "scaleY(-1)",
  br: "scale(-1, -1)",
} as const;

const CORNER_POSITION = {
  tl: "left-0 top-0",
  tr: "right-0 top-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
} as const;

interface WebCornerProps {
  /** Esquina donde se ancla la tela. */
  corner?: keyof typeof CORNER_TRANSFORM;
  /** Lado del cuadro en px. */
  size?: number;
  /** Opacidad del conjunto (por defecto ya viene discreto). */
  opacity?: number;
  /** Tinta del nodo de anclaje: lima por defecto, bermellón para acentuar. */
  tone?: "primary" | "redline";
  className?: string;
}

export function WebCorner({
  corner = "tl",
  size = 132,
  opacity = 0.28,
  tone = "primary",
  className,
}: WebCornerProps) {
  const reduced = useReducedMotion();
  const stroke = tone === "redline" ? "hsl(var(--redline))" : "hsl(var(--primary))";

  // Bajo reduced-motion la tela ya está tejida: nada se dibuja, solo aparece.
  const draw = reduced
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: "-40px" },
      };

  return (
    <svg
      aria-hidden
      viewBox="0 0 110 110"
      width={size}
      height={size}
      style={{ transform: CORNER_TRANSFORM[corner], opacity }}
      className={cn(
        "pointer-events-none absolute select-none",
        CORNER_POSITION[corner],
        className
      )}
    >
      <g fill="none" stroke={stroke} strokeWidth={0.8} strokeLinecap="round">
        {SPOKES.map((s, i) => (
          <motion.line
            key={`spoke-${i}`}
            {...s}
            {...draw}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
          />
        ))}
        {RING_PATHS.map((d, i) => (
          <motion.path
            key={`ring-${i}`}
            d={d}
            {...draw}
            transition={{
              duration: 0.55,
              delay: 0.22 + i * 0.07,
              ease: [0.2, 0, 0, 1],
            }}
          />
        ))}
      </g>
      {/* Nodo de anclaje: donde el hilo se clava. */}
      <circle cx="3.2" cy="3.2" r="2.4" fill={stroke} opacity={0.85} />
    </svg>
  );
}

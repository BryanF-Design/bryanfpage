import { cn } from "@/lib/utils";

interface CircleBadgeProps {
  /** Texto que corre por el anillo. Se repite hasta cerrar la circunferencia. */
  text: string;
  /** Marca del centro. */
  center?: string;
  size?: number;
  className?: string;
}

/**
 * 円章 — sello circular.
 *
 * El recurso que los pósters brutalistas ponen sobre la fotografía: un anillo
 * de texto en mono con una inicial dentro. Aquí cierra el retrato del hero y
 * hace de firma de autor, así que es puro ornamento (`aria-hidden`): lo que
 * dice ya está escrito en texto plano a su lado.
 *
 * Es un SVG con `textPath`, sin dependencias ni tipografía extra.
 */
export function CircleBadge({
  text,
  center = "B.",
  size = 132,
  className,
}: CircleBadgeProps) {
  // Un separador cada repetición para que el anillo se lea como una cinta.
  const ring = `${text} · `.repeat(2);

  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full border border-foreground/25 bg-background/85 backdrop-blur-sm",
        className
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <path
            id="circle-badge-path"
            d="M50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
            fill="none"
          />
        </defs>
        <text
          className="fill-foreground/60 font-mono uppercase"
          style={{ fontSize: 7.4, letterSpacing: "0.22em" }}
        >
          <textPath href="#circle-badge-path" startOffset="0">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="font-display text-2xl font-bold leading-none text-primary">
        {center}
      </span>
    </span>
  );
}

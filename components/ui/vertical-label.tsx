import { cn } from "@/lib/utils";

interface VerticalLabelProps {
  /** Texto japonés (tategaki, de arriba abajo). */
  jp: string;
  /** Lectura o traducción corta, en mono rotada. Opcional. */
  romaji?: string;
  tone?: "primary" | "muted";
  className?: string;
}

const TONE = {
  primary: "text-primary/70",
  muted: "text-muted-foreground/60",
} as const;

/**
 * Etiqueta vertical al margen de una sección — 縦書き.
 *
 * Es ornamento por diseño: el japonés nunca carga información que haga falta
 * para operar el sitio (por eso el `aria-hidden`), y cuando lleva romaji va al
 * lado en mono, que es como se etiqueta un instrumento. El hairline superior
 * la ancla al borde, igual que las marcas de un tablero.
 */
export function VerticalLabel({
  jp,
  romaji,
  tone = "muted",
  className,
}: VerticalLabelProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute flex select-none flex-col items-center gap-3",
        TONE[tone],
        className
      )}
    >
      <span className="h-10 w-px bg-gradient-to-b from-transparent to-current opacity-50" />
      <span className="vertical-jp font-jp text-[11px] leading-none md:text-xs">
        {jp}
      </span>
      {romaji && (
        <span className="vertical-jp font-mono text-[9px] uppercase tracking-[0.3em] opacity-70">
          {romaji}
        </span>
      )}
      <span className="h-10 w-px bg-gradient-to-t from-transparent to-current opacity-50" />
    </div>
  );
}

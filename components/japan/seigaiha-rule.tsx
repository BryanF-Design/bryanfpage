import { cn } from "@/lib/utils";

interface SeigaihaRuleProps {
  /** Marca el tramo con bermellón en vez de tinta. Úsalo con moderación. */
  signal?: boolean;
  className?: string;
}

/**
 * 青海波 — la costura ancha.
 *
 * Entre paneles la hoja normalmente deja ver solo una costura fina. En tres
 * puntos del recorrido la costura se ensancha y deja ver el patrón de olas
 * impreso en el propio washi: un respiro entre tramos, como el pie de olas
 * que cierra los pósters de la referencia. CSS puro, cero bytes de imagen.
 */
export function SeigaihaRule({ signal = false, className }: SeigaihaRuleProps) {
  return (
    <div
      aria-hidden
      className={cn("relative -my-1 h-[26px] w-full overflow-hidden rounded-full", className)}
    >
      <div
        className={cn(
          "seigaiha seigaiha-ink absolute inset-0",
          signal && "seigaiha-signal"
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-sheet via-transparent to-sheet" />
    </div>
  );
}

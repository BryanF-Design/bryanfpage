import { cn } from "@/lib/utils";

interface SeigaihaRuleProps {
  /** Marca el tramo con bermellón en vez de hueso. Úsalo con moderación. */
  signal?: boolean;
  className?: string;
}

/**
 * 青海波 — la banda de olas.
 *
 * En los pósters de la carpeta el patrón de olas cierra la composición por
 * abajo. Aquí hace el trabajo que faltaba entre secciones: el recorrido tenía
 * pantallas enteras de negro muerto donde un bloque terminaba y el siguiente
 * todavía no empezaba, y el ojo no tenía nada que leer.
 *
 * Es CSS puro —tres radiales desfasados sobre una retícula— así que no cuesta
 * una petición ni un byte de imagen.
 */
export function SeigaihaRule({ signal = false, className }: SeigaihaRuleProps) {
  return (
    <div
      aria-hidden
      className={cn("relative h-[26px] w-full overflow-hidden", className)}
    >
      <div
        className={cn(
          "seigaiha absolute inset-0",
          signal && "seigaiha-signal"
        )}
      />
      {/* Se desvanece hacia los cantos para que la banda no choque con el
          marco de página. */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
}

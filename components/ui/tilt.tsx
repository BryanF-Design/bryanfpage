import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Se conservan por compatibilidad con las composiciones existentes. */
  max?: number;
  reveal?: boolean;
  revealDelay?: number;
}

/**
 * Antes inclinaba la tarjeta en 3D siguiendo al puntero: con capturas
 * dentro, cada movimiento re-rasterizaba la imagen y el texto se veía
 * borroso. En el sistema 8-bit la tarjeta sube un par de píxeles al pasar
 * (CSS puro, solo transform) y las entradas las maneja `[data-fx]`.
 */
export function Tilt({ children, className }: TiltProps) {
  return (
    <div
      className={cn(
        "h-full transition-transform duration-200 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Se conservan por compatibilidad con las composiciones existentes. */
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  className?: string;
}

/**
 * Contenedor de composición con mejora progresiva real.
 *
 * El contenido se entrega visible desde el HTML inicial: no depende de
 * hidratación, IntersectionObserver ni preferencias de movimiento para poder
 * leerse. Esto evita que un fallo de JS deje títulos, FAQs o CTAs en opacity 0
 * y reduce el trabajo del hilo principal en las landings comerciales.
 */
export function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>;
}

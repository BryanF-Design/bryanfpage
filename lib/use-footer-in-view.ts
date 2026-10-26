"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * True once #site-footer scrolls into view. Fixed UI (header, chat, a11y
 * panel, social rail) uses this to get out of the way instead of stacking on
 * top of the footer.
 *
 * Se mide con el scroll y se busca el footer en cada medición (no se observa
 * un nodo fijo): en varias páginas el footer llega en un chunk dinámico y al
 * hidratar se reemplaza, así que un IntersectionObserver montado al inicio
 * se quedaba mirando un nodo que ya no estaba (o ninguno) y el header nunca
 * se retiraba.
 */
export function useFooterInView() {
  const [inView, setInView] = useState(false);
  // Se vuelve a medir al cambiar de página: los flotantes viven en el
  // layout y el footer de la página anterior ya no existe.
  const pathname = usePathname();

  useEffect(() => {
    setInView(false);
    let last = false;
    let frame = 0;
    let timeout: number | undefined;

    const measure = () => {
      frame = 0;
      const footer = document.getElementById("site-footer");
      const rect = footer?.getBoundingClientRect();
      // Igual que el margen de antes: cuenta cuando entra al 90 % de la pantalla.
      const next = !!rect && rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
      if (next === last) return;
      last = next;
      // Debounced so momentum/rubber-band scroll bouncing right at the
      // footer's edge doesn't flip this state back and forth.
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setInView(next), 150);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.clearTimeout(timeout);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return inView;
}

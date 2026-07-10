"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Progreso de una sección cruzando el viewport, escrito en un ref
 * (0 = su tope acaba de asomar por abajo, 1 = su base acaba de salir por
 * arriba). Cero re-renders de React: las escenas 3D lo leen en su propio
 * RAF, igual que hace el hero con la laptop.
 */
export function useSectionProgress(targetRef: RefObject<HTMLElement>) {
  const progressRef = useRef(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const passed = window.innerHeight - rect.top;
      progressRef.current = Math.min(1, Math.max(0, passed / total));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetRef]);

  return progressRef;
}

"use client";

import { useEffect } from "react";

/**
 * Secciones que se mudaron del inicio a su propia página. Los enlaces viejos
 * (`/#lumina`, `/#bryan`…) que haya en redes, correos o buscadores llegan a
 * la página nueva en vez de quedarse arriba del inicio sin explicación.
 */
const MOVED: Record<string, string> = {
  bryan: "/conoceme",
  stack: "/conoceme",
  lumina: "/lumina",
  "lumina-journey": "/lumina",
  presencia: "/contacto#presencia",
};

export function LegacyHashRedirect() {
  useEffect(() => {
    const target = MOVED[window.location.hash.slice(1)];
    if (target) window.location.replace(target);
  }, []);
  return null;
}

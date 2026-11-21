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
  "lumina-journey": "/lumina",
  presencia: "/contacto#presencia",
  "servicios-entrada": "/crear-web#servicios-entrada",
};

/**
 * Secciones que siguen en el inicio con otro nombre (rearmado de nov 2026):
 * el enlace viejo salta a la sección nueva sin recargar.
 */
const RENAMED: Record<string, string> = {
  projects: "casos",
  "casos-de-estudio": "casos",
  conoce: "nosotros",
};

export function LegacyHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = MOVED[hash];
    if (target) {
      window.location.replace(target);
      return;
    }
    const renamed = RENAMED[hash];
    if (renamed) {
      const el = document.getElementById(renamed);
      history.replaceState(null, "", `#${renamed}`);
      el?.scrollIntoView();
    }
  }, []);
  return null;
}

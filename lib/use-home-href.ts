"use client";

import { usePathname } from "next/navigation";

/**
 * Enlace a una sección del inicio que funciona desde cualquier página: en
 * el inicio queda como `#id` (salto dentro de la página, como siempre) y en
 * las páginas a las que se movieron secciones (/conoceme, /lumina…) pasa a
 * `/#id` para volver al inicio en esa sección.
 */
export function useHomeHref(id: string) {
  const pathname = usePathname();
  return pathname === "/" ? `#${id}` : `/#${id}`;
}

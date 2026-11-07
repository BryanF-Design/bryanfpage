"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { isReducedMotionRequested } from "@/lib/motion-preference";

// La primera carga ya tiene su telón (el preloader del layout); la transición
// solo corre en las navegaciones dentro del sitio. Con la bandera a nivel de
// módulo, el HTML del servidor y la hidratación pintan lo mismo (sin telón) y
// cada página nueva que monta el cliente después sí lo trae.
let hydrated = false;

/**
 * Next.js vuelve a montar este template en cada cambio de página: aquí vive la
 * transición. Un telón de tinta con la marca B oficial sube y descubre la
 * página nueva (CSS en globals.css, .page-curtain). Es fijo y sin clics, así
 * que no mueve el contenido ni el header, y con movimiento reducido no sale.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showCurtain =
    hydrated && typeof window !== "undefined" && !pathname.startsWith("/cv") && !isReducedMotionRequested();

  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    // Precarga la marca para que la primera transición ya la tenga lista.
    const mark = new window.Image();
    mark.src = "/img/LOGOTIPO.png";
  }, []);

  return (
    <>
      {showCurtain && (
        <div aria-hidden className="page-curtain">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/LOGOTIPO.png" alt="" width={849} height={1016} className="page-curtain__mark" />
        </div>
      )}
      {children}
    </>
  );
}

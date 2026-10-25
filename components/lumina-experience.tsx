"use client";

import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/sections/site-header";
import { ChapterOrder } from "@/components/sections/chapter-mark";
import { LuminaFeature } from "@/components/sections/lumina-feature";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const LuminaJourney = dynamic(() =>
  import("@/components/sections/lumina-journey").then((m) => m.LuminaJourney)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);
const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);

/**
 * /lumina — todo lo que hace la asesora IA: quién es, qué puede hacer en el
 * sitio (llevarte a secciones, enseñarte proyectos, armar tu paquete) y el
 * recorrido completo de la plática al pago.
 */
export function LuminaExperience() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="sheet-main">
        <ChapterOrder order={[8]}>
          <LuminaFeature />
          <LuminaJourney />
          <ClosingCta />
        </ChapterOrder>
      </main>
      <SiteFooter />
    </>
  );
}

"use client";

import dynamic from "next/dynamic";

import { CasosIndex } from "@/components/pages/casos-index";
import { Showreel } from "@/components/pages/showreel";
import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { ProjectCases } from "@/components/sections/projects-showcase";
import { useLanguage } from "@/lib/i18n/context";

const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/** /casos — índice filtrable con modal y los casos completos (Problema / Decisión / Resultado). */
export function CasosPage() {
  const { t } = useLanguage();
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.casos.eyebrow}
        title={t.pages.casos.title}
        subtitle={t.pages.casos.subtitle}
      />
      {/* Índice con filtros (?tipo=) y modal; debajo, los casos contados a fondo. */}
      <CasosIndex />
      {/* P2 · Showreel: cada sitio en movimiento, con pausa global. */}
      <Showreel />
      <ProjectCases hideHeading />
      <ClosingCta />
    </SubPageShell>
  );
}

"use client";

import dynamic from "next/dynamic";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { ProjectCases } from "@/components/sections/projects-showcase";
import { useLanguage } from "@/lib/i18n/context";

const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/** /casos — los casos de estudio completos (Problema / Decisión / Resultado). */
export function CasosPage() {
  const { t } = useLanguage();
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.casos.eyebrow}
        title={t.pages.casos.title}
        subtitle={t.pages.casos.subtitle}
      />
      <ProjectCases hideHeading />
      <ClosingCta />
    </SubPageShell>
  );
}

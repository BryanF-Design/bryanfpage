"use client";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { CasosList } from "@/components/pages/casos-list";
import { useLanguage } from "@/lib/i18n/context";

/** /casos: CortMart con cifras reales y los 4 casos completos, todos visibles. */
export function CasosPage() {
  const { t } = useLanguage();
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.casos.eyebrow}
        title={t.pages.casos.title}
        subtitle={t.pages.casos.subtitle}
      />
      <CasosList />
    </SubPageShell>
  );
}

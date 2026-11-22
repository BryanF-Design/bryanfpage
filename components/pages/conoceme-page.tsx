"use client";

import dynamic from "next/dynamic";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { MeetBryan } from "@/components/sections/meet-bryan";
import { useLanguage } from "@/lib/i18n/context";

const StackOrbit = dynamic(() =>
  import("@/components/sections/stack-orbit").then((m) => m.StackOrbit)
);
const ProcessOrbital = dynamic(() =>
  import("@/components/sections/process-orbital").then((m) => m.ProcessOrbital)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/** /conoceme — la historia de Bryan, su proceso completo y su stack. */
export function ConocemePage() {
  const { t } = useLanguage();
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.conoceme.eyebrow}
        title={t.pages.conoceme.title}
        subtitle={t.pages.conoceme.subtitle}
      />
      <MeetBryan chapter={1} />
      {/* El proceso completo, paso por paso (el inicio muestra 4 en corto). */}
      <ProcessOrbital chapter={2} />
      <StackOrbit chapter={3} />
      <ClosingCta />
    </SubPageShell>
  );
}

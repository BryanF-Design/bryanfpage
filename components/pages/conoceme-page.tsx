"use client";

import dynamic from "next/dynamic";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { MeetBryan } from "@/components/sections/meet-bryan";
import { useLanguage } from "@/lib/i18n/context";

const StackOrbit = dynamic(() =>
  import("@/components/sections/stack-orbit").then((m) => m.StackOrbit)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/** /conoceme — la historia de Bryan y su stack completo (antes en el inicio). */
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
      <StackOrbit chapter={2} />
      <ClosingCta />
    </SubPageShell>
  );
}

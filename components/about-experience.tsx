"use client";

import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/sections/site-header";
import { ChapterOrder } from "@/components/sections/chapter-mark";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { MeetBryan } from "@/components/sections/meet-bryan";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { useLanguage } from "@/lib/i18n/context";

const ProcessOrbital = dynamic(() =>
  import("@/components/sections/process-orbital").then((m) => m.ProcessOrbital)
);
const StackOrbit = dynamic(() =>
  import("@/components/sections/stack-orbit").then((m) => m.StackOrbit)
);
const ProjectCases = dynamic(() =>
  import("@/components/sections/projects-showcase").then((m) => m.ProjectCases)
);
const WorldPresence = dynamic(() =>
  import("@/components/sections/world-presence").then((m) => m.WorldPresence)
);
const ClientsMarquee = dynamic(() =>
  import("@/components/sections/clients-marquee").then((m) => m.ClientsMarquee)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);
const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

/**
 * /conoce-a-bryan — quién está detrás del estudio: su historia, cómo trabaja,
 * con qué herramientas, casos de estudio, dónde ha trabajado y para quién.
 */
export function AboutExperience() {
  const { t } = useLanguage();
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="sheet-main">
        <ChapterOrder order={[3, 4, 5, 9]}>
          <MeetBryan />
          <ProcessOrbital />
          <MarqueeBand words={t.marquee.words} outline />
          <StackOrbit />
          <ProjectCases />
          <WorldPresence />
          <ClientsMarquee />
          <ClosingCta />
        </ChapterOrder>
      </main>
      <LuminaChat />
      <SiteFooter />
    </>
  );
}

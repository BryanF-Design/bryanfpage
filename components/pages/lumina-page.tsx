"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { LuminaFeature, openLuminaChat } from "@/components/sections/lumina-feature";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const LuminaJourney = dynamic(() =>
  import("@/components/sections/lumina-journey").then((m) => m.LuminaJourney)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/** /lumina — la asesora IA: presentación, chat de ejemplo y su recorrido. */
export function LuminaPage() {
  const { t } = useLanguage();
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.lumina.eyebrow}
        title={t.pages.lumina.title}
        subtitle={t.pages.lumina.subtitle}
        aside={
          <div className="flex items-center gap-4 rounded-card bg-mint p-3 pr-4 ring-1 ring-ink/[0.05] sm:p-4">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-lime">
              <Image
                src="/img/brand/lumina-normal.webp"
                alt=""
                fill
                sizes="64px"
                className="scale-[1.4] object-cover object-[50%_18%]"
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-sm font-semibold text-ink/70">{t.lumina.online}</span>
              <Button size="lg" variant="ink" onClick={() => openLuminaChat()} className="justify-between pr-2.5">
                {t.lumina.open}
                <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
              </Button>
            </div>
          </div>
        }
      />
      <LuminaFeature />
      <LuminaJourney chapter={1} />
      <ClosingCta />
    </SubPageShell>
  );
}

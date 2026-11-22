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
  // (antes: video en bucle; ahora retrato fijo, no depende del movimiento)
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.lumina.eyebrow}
        title={t.pages.lumina.title}
        subtitle={t.pages.lumina.subtitle}
        aside={
          // Retrato de Lumina sobre su fondo oscuro.
          <div className="overflow-hidden rounded-card bg-black shadow-soft ring-1 ring-ink/[0.05]">
            <div className="relative aspect-[16/10]">
              {/* Retrato nuevo de Lumina (auditoría P1-3): cara entera, sin
                  recortes ni video. */}
              <Image
                src="/img/lumina/retrato-lumina.webp"
                alt={t.lumina.name}
                fill
                priority
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="object-cover object-[50%_35%]"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:left-4 sm:top-4">
                <span aria-hidden className="size-2 rounded-full bg-lime" />
                {t.lumina.online}
              </span>
            </div>
            <div className="p-3 sm:p-4">
              <Button size="lg" onClick={() => openLuminaChat()} className="w-full justify-between pr-2.5">
                {t.lumina.open}
                <ButtonArrow tone="ink" className="-mr-0.5 ml-2" />
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

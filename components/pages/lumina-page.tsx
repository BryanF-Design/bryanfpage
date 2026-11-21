"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { LuminaFeature, openLuminaChat } from "@/components/sections/lumina-feature";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const LuminaJourney = dynamic(() =>
  import("@/components/sections/lumina-journey").then((m) => m.LuminaJourney)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/** /lumina — la asesora IA: presentación, chat de ejemplo y su recorrido. */
export function LuminaPage() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();
  return (
    <SubPageShell>
      <PageIntro
        eyebrow={t.pages.lumina.eyebrow}
        title={t.pages.lumina.title}
        subtitle={t.pages.lumina.subtitle}
        aside={
          // Lumina trabajando en su laptop (video en bucle, sin audio): la
          // tarjeta oscura continúa el fondo negro del video.
          <div className="overflow-hidden rounded-card bg-black shadow-soft ring-1 ring-ink/[0.05]">
            <div className="relative aspect-[16/10]">
              {reduced ? (
                <Image
                  src="/img/lumina/v2/trabajando-poster.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-cover object-[40%_12%]"
                />
              ) : (
                <video
                  className="absolute inset-0 size-full object-cover object-[40%_12%]"
                  poster="/img/lumina/v2/trabajando-poster.webp"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden
                >
                  <source src="/video/lumina-trabajando.webm" type="video/webm" />
                  <source src="/video/lumina-trabajando.mp4" type="video/mp4" />
                </video>
              )}
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

"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkle } from "lucide-react";

import { openLuminaChat } from "@/components/sections/lumina-feature";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

/**
 * Inicio: Bryan y Lumina en dos tarjetas cortas, lado a lado. Su historia
 * completa vive en /conoceme y /lumina; aquí solo foto, una línea y enlace.
 */
export function HomeTeasers() {
  const { t } = useLanguage();

  return (
    <section
      id="conoce"
      aria-label={`${t.home.bryanCta} · ${t.home.luminaCta}`}
      className="grid gap-gutter lg:grid-cols-2"
    >
      {/* Bryan */}
      <div data-fx="up" className="min-w-0">
        <article className="panel panel-forest relative flex h-full flex-col overflow-hidden sm:flex-row">
          <div className="relative z-[1] flex flex-1 flex-col items-start gap-4 p-5 sm:p-7 lg:p-8">
            <span className="eyebrow pl-3">
              <span aria-hidden className="size-2 rounded-full bg-lime" />
              {t.home.bryanEyebrow}
            </span>
            <div className="flex items-center gap-3.5">
              {/* Teléfono: la foto va en un avatar junto al nombre. */}
              <span aria-hidden className="relative size-16 shrink-0 overflow-hidden rounded-full bg-lime sm:hidden">
                <Image
                  src="/img/brand/bryan-cutout.webp"
                  alt=""
                  width={1122}
                  height={1114}
                  sizes="128px"
                  className="absolute left-[-30%] top-[-2%] w-[170%] max-w-none"
                />
              </span>
              <h2 className="leading-tight text-white">
                <span className="display-title block text-[clamp(1.9rem,3vw,2.6rem)]">Bryan F.</span>
                <span className="mt-1 block text-sm font-semibold text-white/70">{t.about.role}</span>
              </h2>
            </div>
            <p className="max-w-md text-pretty text-base leading-relaxed text-white/85">{t.home.bryanLine}</p>
            <Button asChild size="lg" className="mt-auto pr-2.5">
              <Link href="/conoceme">
                {t.home.bryanCta}
                <ButtonArrow tone="ink" className="-mr-0.5 ml-2" />
              </Link>
            </Button>
          </div>
          {/* Foto: Bryan sobre un disco lima, recortado en la base del panel. */}
          <div aria-hidden className="relative hidden shrink-0 sm:block sm:w-[42%]">
            <span className="absolute bottom-[-18%] left-1/2 aspect-square w-[78%] max-w-[16rem] -translate-x-1/2 rounded-full bg-lime sm:bottom-[-10%] sm:w-[92%]" />
            <Image
              src="/img/brand/bryan-cutout.webp"
              alt=""
              width={1122}
              height={1114}
              sizes="(min-width: 1024px) 18rem, (min-width: 640px) 40vw, 16rem"
              className="absolute bottom-0 left-1/2 h-[112%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[92%]"
            />
          </div>
        </article>
      </div>

      {/* Lumina */}
      <div data-fx="up" className="min-w-0" style={{ "--fx-delay": "90ms" } as CSSProperties}>
        <article className="panel panel-lime relative flex h-full flex-col overflow-hidden sm:flex-row">
          <div className="relative z-[1] flex flex-1 flex-col items-start gap-4 p-5 sm:p-7 lg:p-8">
            <span className="eyebrow bg-white/60 pl-3">
              <Sparkle aria-hidden className="h-3.5 w-3.5 fill-ink" />
              {t.home.luminaEyebrow}
            </span>
            <div className="flex items-center gap-3.5">
              <span aria-hidden className="relative size-16 shrink-0 overflow-hidden rounded-full bg-white/60 sm:hidden">
                <Image
                  src="/img/brand/lumina-normal.webp"
                  alt=""
                  fill
                  sizes="64px"
                  className="scale-[1.4] object-cover object-[50%_18%]"
                />
              </span>
              <h2 className="leading-tight text-ink">
                <span className="display-title block text-[clamp(1.9rem,3vw,2.6rem)]">{t.lumina.name}</span>
              </h2>
            </div>
            <p className="max-w-md text-pretty text-base leading-relaxed text-ink/80">{t.home.luminaLine}</p>
            <div className="mt-auto flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" variant="ink" className="justify-between pr-2.5">
                <Link href="/lumina">
                  {t.home.luminaCta}
                  <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="white" onClick={() => openLuminaChat()}>
                {t.home.luminaChat}
              </Button>
            </div>
          </div>
          <div aria-hidden className="relative hidden shrink-0 sm:block sm:w-[38%]">
            <span className="absolute bottom-[-18%] left-1/2 aspect-square w-[78%] max-w-[16rem] -translate-x-1/2 rounded-full bg-white/50 sm:bottom-[-10%] sm:w-[92%]" />
            <Image
              src="/img/brand/lumina-normal.webp"
              alt=""
              width={864}
              height={1121}
              sizes="(min-width: 1024px) 14rem, (min-width: 640px) 34vw, 13rem"
              className="absolute bottom-0 left-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[88%]"
            />
          </div>
        </article>
      </div>
    </section>
  );
}

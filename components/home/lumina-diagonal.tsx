"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkle } from "lucide-react";

import { openLuminaChat } from "@/components/sections/lumina-feature";
import { Button } from "@/components/ui/button";
import { GestureIcon } from "@/components/ui/gesture-icon";
import { Magnetic } from "@/components/ui/magnetic";
import { useLanguage } from "@/lib/i18n/context";

/**
 * Prompt 5 · Diagonal Lumina: banda verde oscuro con corte inclinado en CSS
 * (clip-path; en teléfono el ángulo se suaviza), que entra desde fuera del
 * lienzo una sola vez (preset 02 + preset 10 del demo). "Ella es Lumina." +
 * una línea + "Pregúntale a Lumina" (abre el chat) y tres chips que mandan la
 * pregunta: Lumina contesta en corto y mueve la página a la sección que
 * responde, con un resaltado lima de 2 s.
 */
export function LuminaDiagonal() {
  const { t } = useLanguage();
  const l = t.v2.lumina;

  return (
    <section id="lumina" aria-labelledby="lumina-title" className="offcanvas-clip">
      <div className="reveal reveal-right">
        <div className="diag-cut diag-cut--lg panel panel-forest relative grid overflow-hidden px-5 pb-14 pt-16 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] md:items-center md:gap-8 md:py-20 lg:px-12">
          <div aria-hidden className="mesh-glow-a opacity-60" />
          <div className="relative z-[1] flex flex-col items-start gap-5">
            <span className="eyebrow pl-3">
              <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime" />
              {t.home.luminaEyebrow}
            </span>
            <h2 id="lumina-title" className="display-xl text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95] text-white">
              {l.title}
            </h2>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-white/80">{l.line}</p>
            <Magnetic>
              <Button size="lg" className="gap-2.5 pr-2.5" onClick={() => openLuminaChat()}>
                <GestureIcon gesture="lumina">
                  <span className="relative block size-8 overflow-hidden rounded-full bg-white">
                    <Image src="/img/lumina/v2/face/normal.webp" alt="" width={32} height={32} className="absolute inset-0 h-full w-full object-cover" />
                  </span>
                </GestureIcon>
                {l.cta}
                <span aria-hidden className="btn-arrow size-9 bg-ink text-lime">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Button>
            </Magnetic>
            {/* Chips tocables: cada uno manda su pregunta a Lumina. */}
            <ul className="flex flex-wrap gap-2.5" aria-label={l.cta}>
              {l.chips.map((chip, i) => (
                <li key={chip} className="reveal" style={{ "--stagger": i + 1 } as CSSProperties}>
                  <button
                    type="button"
                    onClick={() => openLuminaChat(chip)}
                    className="lumina-chip inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-[0.9375rem] font-semibold text-white ring-1 ring-white/20"
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-lime" />
                    {chip}
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/lumina" className="link-grow relative inline-flex min-h-11 items-center pr-5 text-sm font-semibold text-white/75 hover:text-white">
              {t.home.luminaCta}
            </Link>
          </div>
          {/* Lumina asoma por el canto de la banda. */}
          <div aria-hidden className="pointer-events-none relative mx-auto -mb-14 mt-6 w-[62%] max-w-[18rem] md:-mb-20 md:mt-0 md:w-full md:max-w-[22rem] md:self-end">
            <span className="absolute inset-x-[6%] bottom-0 aspect-square rounded-full bg-lime/90" />
            <Image
              src="/img/lumina/v2/cutout/normal.webp"
              alt=""
              width={1058}
              height={1100}
              sizes="(min-width: 768px) 22rem, 62vw"
              className="relative h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

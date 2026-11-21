"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkle } from "lucide-react";

import { openLuminaChat } from "@/components/sections/lumina-feature";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

/**
 * Diagonal Lumina (#lumina): panel bosque con texto crema, cortado en diagonal
 * con `clip-path` (ángulo menor en teléfono, ver `.diag-cut` en globals.css).
 * Botón que abre el chat y tres preguntas que se pueden tocar: cada una abre
 * a Lumina con esa pregunta ya enviada. El detalle completo vive en /lumina.
 */
export function HomeLuminaDiagonal() {
  const { t } = useLanguage();
  const l = t.homeV3.lumina;

  return (
    <section id="lumina" aria-label={l.title} className="relative">
      <div data-fx="panel">
        <div className="diag-cut diag-cut-down panel panel-forest relative grid overflow-hidden px-5 pb-12 pt-14 sm:px-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-8 lg:px-12 lg:pb-16 lg:pt-20">
          <div aria-hidden className="mesh-glow-b opacity-70" />
          <div className="relative z-[1] flex min-w-0 flex-col items-start gap-5">
            <span className="eyebrow pl-3">
              <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime" />
              {l.eyebrow}
            </span>
            <h2 className="display-xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.9] text-white normal-case">
              {l.title}
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">{l.line}</p>
            <Button size="lg" className="bg-lime pr-2.5 text-ink" onClick={() => openLuminaChat()}>
              <MessageCircle aria-hidden className="h-5 w-5" />
              {l.cta}
              <ButtonArrow tone="ink" className="-mr-0.5 ml-2" />
            </Button>
            <ul role="list" className="flex flex-wrap gap-2">
              {l.chips.map((chip) => (
                <li key={chip}>
                  <button
                    type="button"
                    onClick={() => openLuminaChat(chip)}
                    className="min-h-11 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition-[transform,background-color,color] duration-200 hover:-translate-y-0.5 hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                  >
                    {chip}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden className="relative mx-auto mt-6 aspect-square w-[min(18rem,70vw)] md:mt-0 md:w-full md:max-w-[22rem]">
            <span className="absolute inset-[8%] rounded-full bg-lime/90" />
            <Image
              src="/img/lumina/v2/cutout/normal.webp"
              alt=""
              width={1058}
              height={1100}
              sizes="(min-width: 768px) 22rem, 70vw"
              className="float-y absolute bottom-0 left-1/2 h-[104%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Diagonal Nosotros (#nosotros): hoja crema con la foto de Bryan, el corte en
 * diagonal hacia arriba y una sola línea. La historia completa vive en
 * /conoceme.
 */
export function HomeAboutDiagonal() {
  const { t } = useLanguage();
  const a = t.homeV3.about;

  return (
    <section id="nosotros" aria-label={a.title} className="relative">
      <div data-fx="panel">
        <div className="diag-cut diag-cut-up panel relative grid overflow-hidden px-5 pb-0 pt-14 shadow-soft sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-8 lg:px-12 lg:pt-20">
          <div aria-hidden className="relative order-2 mx-auto mt-8 aspect-[1122/1114] w-[min(18rem,72vw)] md:order-1 md:mt-0 md:w-full md:max-w-[24rem]">
            <span className="absolute bottom-[-12%] left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full bg-lime" />
            <Image
              src="/img/brand/bryan-cutout.webp"
              alt=""
              width={1122}
              height={1114}
              sizes="(min-width: 768px) 24rem, 72vw"
              className="relative h-auto w-full"
            />
          </div>
          <div className="relative order-1 flex min-w-0 flex-col items-start gap-5 md:order-2 md:pb-16 lg:pb-20">
            <span className="eyebrow pl-3">
              <span aria-hidden className="size-2 rounded-full bg-lime" />
              {a.eyebrow}
            </span>
            <h2 className="display-xl text-balance text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.92] text-ink normal-case">
              {a.title}
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-ink/75 md:text-lg">{a.line}</p>
            <Button asChild size="lg" variant="ink" className="pr-2.5">
              <Link href="/conoceme">
                {a.cta}
                <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

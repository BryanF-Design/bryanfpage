"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button, ButtonArrow } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { useLanguage } from "@/lib/i18n/context";
import { useParallax8 } from "@/lib/motion-fx";

/**
 * Prompt 7 · Diagonal Nosotros: fondo crema con corte inclinado, foto de
 * Bryan con parallax de 8 px (transform) y entrada suave una sola vez.
 * "Soy Bryan. Yo diseño y yo programo." + una línea + "Conoce a Bryan".
 * La historia completa vive en /conoceme. Lumina trae aquí a quien pregunta
 * "¿Quién es Bryan?".
 */
export function AboutDiagonal() {
  const { t } = useLanguage();
  const a = t.v2.about;
  const photo = useRef<HTMLDivElement>(null);
  useParallax8(photo);

  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="offcanvas-clip">
      <div className="reveal reveal-left">
        <div className="diag-cut diag-cut--lg diag-cut--rev panel relative grid overflow-hidden bg-[hsl(var(--canvas))] px-5 pt-14 ring-1 ring-inset ring-ink/[0.06] sm:px-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-center md:gap-8 md:pt-16 lg:px-12">
          {/* Foto: Bryan sobre un disco lima, con parallax de 8 px. */}
          <div aria-hidden className="relative order-2 mx-auto mt-6 w-[78%] max-w-[22rem] md:order-1 md:mt-0 md:w-full md:max-w-[26rem] md:self-end">
            <span className="absolute inset-x-[4%] bottom-[-6%] aspect-square rounded-full bg-lime" />
            <div ref={photo} className="relative will-change-transform">
              <Image
                src="/img/brand/bryan-cutout.webp"
                alt=""
                width={1122}
                height={1114}
                sizes="(min-width: 768px) 26rem, 78vw"
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="relative z-[1] order-1 flex flex-col items-start gap-5 pb-4 md:order-2 md:pb-16">
            <span className="eyebrow bg-white pl-3">
              <span aria-hidden className="size-2 rounded-full bg-lime" />
              {t.home.bryanEyebrow}
            </span>
            <h2 id="nosotros-title" className="display-xl max-w-[14ch] text-balance text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[0.95] text-ink">
              {a.title}
            </h2>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-ink/75">{a.line}</p>
            <Magnetic>
              <Button asChild size="lg" variant="ink" className="pr-2.5">
                <Link href="/conoceme">
                  {a.cta}
                  <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

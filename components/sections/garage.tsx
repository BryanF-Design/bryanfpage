"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { WebCorner } from "@/components/ui/web-corner";
import { VerticalLabel } from "@/components/ui/vertical-label";
import { LazyMount } from "@/components/three/lazy-mount";
import { useSectionProgress } from "@/lib/use-section-progress";
import { useLanguage } from "@/lib/i18n/context";
import { vtecLevel } from "@/lib/vtec";

const TypeRScene = dynamic(
  () => import("@/components/three/typer-scene").then((m) => m.TypeRScene),
  { ssr: false }
);

/**
 * 「ガレージ」 — la sección de autor.
 *
 * El encargo era "que se note quién soy sin perder lo profesional", y la
 * manera de no caer en página de fan es no hablar nunca de gustos: cada
 * obsesión entra como argumento de trabajo. El coche no está porque le guste
 * a Bryan, está porque explica por qué su sitio pesa lo que pesa.
 */
export function Garage() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="garage"
      aria-label={t.garage.eyebrow}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-60" />
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-40" />
      <WebCorner corner="tr" size={168} opacity={0.22} />

      <VerticalLabel
        jp={t.garage.verticalJp}
        romaji={t.garage.verticalRomaji}
        tone="primary"
        // A la derecha: el rail de redes ocupa el margen izquierdo y las dos
        // capas se pisaban.
        className="right-2 top-[30%] hidden xl:flex"
      />

      <div className="container relative">
        <SectionHeading
          eyebrow={t.garage.eyebrow}
          title={t.garage.title}
          subtitle={t.garage.subtitle}
        />
      </div>

      {/* Escenario del coche: a sangre, para que quepa entero y respire. */}
      <div className="relative mt-10 md:mt-14">
        <LazyMount
          className="relative h-[42svh] min-h-[260px] w-full md:h-[56svh] md:min-h-[380px]"
          rootMargin="400px"
        >
          <TypeRScene
            progressRef={progress}
            revRef={vtecLevel}
            className="absolute inset-0"
          />
        </LazyMount>

        {/* La pista habla de puntero y de teclado: en táctil no aplica
            ninguna de las dos cosas, así que ahí no se muestra. */}
        <p className="tech-label pointer-events-none absolute inset-x-0 bottom-0 hidden text-center text-muted-foreground/70 md:block">
          {t.garage.hint}
        </p>
      </div>

      {/* Ficha técnica: la placa del coche, en la voz mono del sitio. */}
      <div className="container relative mt-8 md:mt-10">
        <Reveal>
          <dl className="grid grid-cols-2 divide-x divide-y divide-border border border-border sm:grid-cols-4 sm:divide-y-0">
            {[
              { k: t.garage.spec.modelLabel, v: t.garage.spec.model, jp: true },
              { k: t.garage.spec.codeLabel, v: t.garage.spec.code },
              { k: t.garage.spec.colorLabel, v: t.garage.spec.color },
              { k: t.garage.spec.engineLabel, v: t.garage.spec.engine },
            ].map((row) => (
              <div key={row.k} className="flex flex-col gap-1.5 px-4 py-4">
                <dt className="tech-label text-muted-foreground/70">{row.k}</dt>
                <dd
                  className={
                    row.jp
                      ? "font-jp text-sm text-foreground"
                      : "font-mono text-sm text-foreground"
                  }
                >
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Las tres obsesiones, cada una traducida a una forma de trabajar. */}
      <div className="container relative mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
        {t.garage.cards.map((card, i) => (
          <Reveal key={card.index} delay={i * 0.08}>
            <article className="hud-frame halftone elevate group relative flex h-full flex-col gap-4 overflow-hidden bg-card/60 p-6 md:p-7">
              {/* Marca de agua: el kanji ocupando el fondo de la tarjeta. */}
              <span
                aria-hidden
                className="font-jp pointer-events-none absolute -bottom-6 -right-2 select-none text-[7rem] leading-none text-primary/[0.06] transition-colors duration-500 group-hover:text-primary/[0.11]"
              >
                {card.jp}
              </span>

              <header className="relative flex items-baseline justify-between gap-3">
                <span className="font-display text-3xl font-bold text-primary/80">
                  {card.index}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-jp text-base text-foreground/80">{card.jp}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    {card.romaji}
                  </span>
                </span>
              </header>

              <h3 className="relative font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {card.title}
              </h3>
              <p className="relative flex-1 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                {card.body}
              </p>
              <p className="tech-label relative border-t border-border pt-4 text-primary/70">
                {card.spec}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const WHATSAPP = "https://wa.me/525663012505";

const PRINCIPLE_MARKS = [
  { jp: "精度", romaji: "seido" },
  { jp: "リズム", romaji: "rizumu" },
  { jp: "つながり", romaji: "tsunagari" },
] as const;

/**
 * 作 — quién hace esto.
 *
 * Es la hoja de papel del recorrido: tinta sobre hueso, en medio de una página
 * que por lo demás es tinta sobre tinta. Ese contraste es lo que hace que el
 * capítulo personal se lea como una pausa y no como una sección más.
 *
 * Se condensó respecto de la versión anterior: el bloque de influencias se fue
 * al capítulo del Civic (que es donde ese texto tiene imagen que lo sostenga) y
 * los tres criterios de trabajo quedaron plegados. Lo que se ve de entrada es
 * lo mínimo que hay que saber — quién es, qué hace, cómo se le escribe.
 */
export function AboutChapter() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  return (
    <section
      ref={sectionRef}
      id="bryan"
      aria-labelledby="bryan-title"
      className="paper-panel relative isolate overflow-hidden border-y border-[#07110d]/25"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgba(7,17,13,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(7,17,13,0.06)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-14 -z-10 size-[30rem] rounded-full bg-[radial-gradient(circle,rgba(180,227,50,0.25),transparent_68%)]"
      />

      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: nameY }}
        className="pointer-events-none absolute left-0 top-12 -z-10 w-full select-none whitespace-nowrap"
      >
        <span className="block text-center font-display text-[30vw] font-bold uppercase leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(7,17,13,0.16)] md:text-[17vw]">
          Bryan&nbsp;F.
        </span>
      </motion.div>

      <div className="container relative z-10 py-14 md:py-20">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-3 border-y border-[#07110d]/25 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#07110d]/65">
          <span className="inline-flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-6 place-items-center border border-[#e8342a]/60 font-jp text-[11px] leading-none text-[#e8342a]"
            >
              作
            </span>
            {t.about.eyebrow}
          </span>
          <span>CDMX · MX — EST. 2020</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-16">
          {/* ——— El escritorio ————————————————————————————————— */}
          <div className="relative order-2 lg:order-1">
            <div
              aria-hidden
              className="absolute -bottom-3 -left-3 size-full border border-[#07110d]/30 bg-primary"
            />
            <figure className="relative border border-[#07110d]/45 bg-[#07110d]">
              <div className="amiten relative aspect-[4/3] w-full overflow-hidden sm:aspect-[4/3.2]">
                <Image
                  src="/img/me/about-photo.png"
                  alt={t.about.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  loading="lazy"
                  className="object-cover object-[58%_center] sm:object-center"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07110d] via-[#07110d]/30 to-transparent"
                />
                <div aria-hidden className="absolute inset-y-0 right-0 w-1 bg-[#e8342a]" />
                <span className="absolute bottom-4 left-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#f2f3ec]">
                  Bryan F.
                  <span className="mt-1 block text-primary">{t.about.role}</span>
                </span>
              </div>
              <figcaption className="border-t border-[#f2f3ec]/15 px-5 py-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-[#f2f3ec]/70">
                {t.about.quote}
              </figcaption>
            </figure>
          </div>

          {/* ——— El texto ——————————————————————————————————————— */}
          <div className="relative order-1 flex flex-col items-start lg:order-2 lg:pb-6">
            <h2
              id="bryan-title"
              className="max-w-2xl font-display text-[clamp(2rem,4.2vw,3.6rem)] font-bold uppercase leading-[0.92] tracking-[-0.05em] text-[#07110d]"
            >
              {t.about.title}
            </h2>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#07110d]/70">
              {t.about.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {t.about.chips.map((chip) => (
                <span
                  key={chip}
                  className="border border-[#07110d]/30 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#07110d]/75 md:text-[10px]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  {t.about.ctaPrimary}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#07110d]/40 bg-transparent text-[#07110d] hover:bg-[#07110d] hover:text-[#f2f3ec]"
              >
                <Link href="#proceso">{t.about.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ——— Los tres criterios, plegados ——————————————————— */}
        <Disclosure
          label={t.about.principlesLabel}
          labelOpen={t.ui.collapse}
          className="mt-12 md:mt-16"
          triggerClassName="w-full justify-between border-t border-[#07110d]/30 pt-5 text-[#07110d]/70 hover:text-[#07110d]"
        >
          <div className="grid divide-y divide-[#07110d]/25 border-y border-[#07110d]/30 md:grid-cols-3 md:divide-x md:divide-y-0">
            {t.about.principles.map((principle, index) => (
              <article
                key={principle.title}
                className="flex flex-col px-0 py-6 md:px-6 md:first:pl-0 md:last:pr-0"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className="font-display text-4xl font-semibold leading-none tabular-nums text-[#07110d]/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-right font-mono text-[9px] uppercase tracking-[0.16em] text-[#07110d]/55"
                    aria-label={PRINCIPLE_MARKS[index]?.romaji}
                  >
                    <span lang="ja" className="block font-jp text-base text-[#07110d]">
                      {PRINCIPLE_MARKS[index]?.jp}
                    </span>
                    {PRINCIPLE_MARKS[index]?.romaji}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-[#07110d]">
                  {principle.title}
                </h3>
                <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-[#07110d]/70">
                  {principle.body}
                </p>
                <p className="mt-5 border-t border-[#07110d]/20 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-[#07110d]/55">
                  {principle.detail}
                </p>
              </article>
            ))}
          </div>
        </Disclosure>
      </div>
    </section>
  );
}

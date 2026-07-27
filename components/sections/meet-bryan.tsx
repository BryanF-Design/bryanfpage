"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const WHATSAPP = "https://wa.me/525663012505";

const PRINCIPLE_MARKS = [
  { jp: "精度", romaji: "seido" },
  { jp: "リズム", romaji: "rizumu" },
  { jp: "つながり", romaji: "tsunagari" },
] as const;

/**
 * Puente de autor.
 *
 * Primero presenta a Bryan y el trato directo; después traduce sus influencias
 * en tres criterios concretos de trabajo. La cultura personal vive en el
 * razonamiento —precisión, ritmo y conexión—, no en utilería temática.
 */
export function MeetBryan() {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], ["10%", "-22%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const gray = useTransform(scrollYProgress, [0.08, 0.32], [1, 0]);
  const photoFilter = useMotionTemplate`grayscale(${gray})`;
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.06, 1]);

  return (
    <section
      ref={sectionRef}
      id="bryan"
      aria-labelledby="bryan-title"
      className="paper-panel relative isolate overflow-hidden border-t border-[#07110d]/25"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgba(7,17,13,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(7,17,13,0.06)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(180,227,50,0.25),transparent_68%)]"
      />

      <motion.div
        aria-hidden
        style={reducedMotion ? undefined : { y: nameY }}
        className="pointer-events-none absolute left-0 top-20 -z-10 w-full select-none whitespace-nowrap md:top-8"
      >
        <span className="block text-center font-display text-[31vw] font-bold uppercase leading-none text-transparent opacity-70 [-webkit-text-stroke:1px_rgba(7,17,13,0.16)] md:text-[18vw]">
          Bryan&nbsp;F.
        </span>
      </motion.div>

      <div className="container relative z-10 pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-y border-[#07110d]/25 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#07110d]/65 md:mb-16">
          <span className="inline-flex items-center gap-3">
            <span aria-hidden className="h-1.5 w-1.5 bg-[#e8342a]" />
            {t.about.eyebrow}
          </span>
          <span
            aria-label={
              locale === "ja"
                ? "hashiri"
                : `hashiri · ${t.experience.driving}`
            }
          >
            <span lang="ja" className="font-jp text-[#07110d]">
              走り
            </span>
            <span aria-hidden> / </span>
            hashiri{locale === "ja" ? null : ` · ${t.experience.driving}`}
          </span>
          <span>CDMX · MX</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-end lg:gap-20">
          <motion.div
            style={reducedMotion ? undefined : { y: photoY }}
            className="relative order-2 lg:order-1"
          >
            <div aria-hidden className="absolute -bottom-3 -left-3 h-full w-full border border-[#07110d]/30 bg-primary md:-bottom-4 md:-left-4" />
            <figure className="relative border border-[#07110d]/45 bg-[#07110d]">
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:h-[68svh] lg:min-h-[36rem] lg:aspect-auto">
                <motion.div
                  style={
                    reducedMotion
                      ? undefined
                      : { filter: photoFilter, scale: photoScale }
                  }
                  className="absolute inset-0"
                >
                  <Image
                    src="/img/me/about-photo.png"
                    alt={t.about.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover object-[58%_center] sm:object-center"
                  />
                </motion.div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07110d] via-[#07110d]/35 to-transparent" />
                <div aria-hidden className="absolute inset-y-0 right-0 w-1 bg-[#e8342a]" />

                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={
                    reducedMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.5,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="absolute bottom-5 left-5 right-6 flex flex-wrap items-end justify-between gap-3 md:bottom-7 md:left-7 md:right-8"
                >
                  <span className="max-w-[16rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#f2f3ec] md:text-[11px]">
                    Bryan F.
                    <span className="mt-1 block text-primary">{t.about.role}</span>
                  </span>
                  <span className="h-10 w-px bg-[#f2f3ec]/35" aria-hidden />
                </motion.div>
              </div>
              <figcaption className="border-t border-[#f2f3ec]/15 px-5 py-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-[#f2f3ec]/70 md:px-7">
                {t.about.quote}
              </figcaption>
            </figure>
          </motion.div>

          <div className="relative order-1 flex flex-col items-start pb-2 lg:order-2 lg:pb-10">
            <h2
              id="bryan-title"
              className="max-w-2xl font-display text-[clamp(2.7rem,6.5vw,5.9rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em] text-[#07110d]"
            >
              {t.about.title}
            </h2>

            <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-[#07110d]/70 md:text-lg">
              {t.about.subtitle}
            </p>

            <div className="mt-8 max-w-xl border-y border-[#07110d]/25 py-6">
              <p className="mb-3 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#07110d]/65">
                <span aria-hidden className="h-px w-8 bg-[#e8342a]" />
                {t.about.inspirationLabel}
              </p>
              <p className="text-pretty font-display text-xl font-medium leading-snug text-[#07110d] md:text-2xl">
                {t.about.inspiration}
              </p>
            </div>

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

        <div className="relative mt-16 border-y border-[#07110d]/30 md:mt-24">
          <p className="border-b border-[#07110d]/25 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#07110d]/65">
            {t.about.principlesLabel}
          </p>

          <div className="grid divide-y divide-[#07110d]/25 md:grid-cols-3 md:divide-x md:divide-y-0">
            {t.about.principles.map((principle, index) => (
              <motion.article
                key={principle.title}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={
                  reducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: reducedMotion ? 0 : 0.5,
                  delay: reducedMotion ? 0 : index * 0.08,
                  ease: [0.2, 0, 0, 1],
                }}
                className="group relative flex min-h-64 flex-col px-0 py-7 md:px-7 md:py-8 md:first:pl-0 md:last:pr-0"
              >
                <div className="mb-7 flex items-start justify-between gap-4">
                  <span className="font-display text-5xl font-semibold leading-none tabular-nums text-[#07110d]/15 transition-colors group-hover:text-[#e8342a]/70">
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
                <h3 className="font-display text-2xl font-bold tracking-tight text-[#07110d]">
                  {principle.title}
                </h3>
                <p className="mt-4 flex-1 text-pretty leading-relaxed text-[#07110d]/70">
                  {principle.body}
                </p>
                <p className="mt-6 border-t border-[#07110d]/20 pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-[#07110d]/55">
                  {principle.detail}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

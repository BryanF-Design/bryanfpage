"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

const PRINCIPLE_MARKS = [
  { jp: "精度", romaji: "seido" },
  { jp: "リズム", romaji: "rizumu" },
  { jp: "つながり", romaji: "tsunagari" },
] as const;

/**
 * 作者 — el autor, en bento.
 *
 * El retrato ocupa una columna completa y entra desde la izquierda; el relato
 * entra desde la derecha en un panel musgo, y los tres criterios de trabajo
 * caen como fichas debajo. La foto pasa de grises a color mientras la miras,
 * igual que antes; lo que cambia es la composición: ya no es un bloque de
 * papel, es parte de la hoja.
 */
export function MeetBryan() {
  const { t, locale } = useLanguage();

  return (
    <section
      id="bryan"
      aria-labelledby="bryan-title"
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      {/* Retrato */}
      <div data-fx="left" className="min-w-0 lg:col-span-5 lg:row-span-3">
        <figure className="panel relative h-full min-h-[30rem] overflow-hidden sm:min-h-[36rem]">
          <div className="amiten absolute inset-0 overflow-hidden rounded-[inherit]">
            {/* Foto fija: antes un filtro de grises y una escala seguían al
                scroll y repintaban la imagen completa en cada cuadro. */}
            <Image
              src="/img/me/about-photo.png"
              alt={t.about.photoAlt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-[56%_center]"
            />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div className="notch notch-tr">
            <span className="tag-pill">
              <span aria-hidden lang="ja" className="seal">
                作
              </span>
              CDMX · MX
            </span>
          </div>

          <figcaption className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-5 md:p-7">
            <span className="flex flex-wrap items-center gap-2">
              <span className="px-shape bg-primary px-3 py-1.5 font-display text-[1.3rem] uppercase leading-none tracking-[0.04em] text-primary-foreground">
                Bryan F.
              </span>
              <span className="px-shape bg-background/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/85">
                {t.about.role}
              </span>
            </span>
            <span className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-foreground/75 md:text-[11px]">
              {t.about.quote}
            </span>
          </figcaption>
        </figure>
      </div>

      {/* Relato */}
      <div data-fx="right" className="min-w-0 lg:col-span-7" style={{ "--fx-delay": "80ms" } as CSSProperties}>
        <div className="panel panel-moss relative h-full overflow-hidden p-6 md:p-10 lg:p-12">
          <span
            aria-hidden
            className="ghost-word drift-x absolute -bottom-[0.1em] left-0 text-[30vw] lg:text-[15vw]"
          >
            Bryan&nbsp;F.
          </span>

          <div className="relative flex flex-wrap items-center gap-3">
            <span className="tag-pill">
              <span aria-hidden lang="ja" className="seal">
                作
              </span>
              {t.about.eyebrow}
            </span>
            <span className="chapter-index flex items-center gap-2">
              <span aria-hidden lang="ja" className="font-jp tracking-[0.2em]">
                章
              </span>
              <span>
                <b>03</b> / 10
              </span>
              <span
                aria-label={locale === "ja" ? "hashiri" : `hashiri · ${t.experience.driving}`}
                className="hidden sm:inline"
              >
                ·{" "}
                <span lang="ja" className="font-jp">
                  走り
                </span>{" "}
                hashiri{locale === "ja" ? null : ` · ${t.experience.driving}`}
              </span>
            </span>
          </div>

          <div data-fx="up" className="relative mt-8">
            <h2
              id="bryan-title"
              className="display-xl max-w-3xl text-[clamp(2.9rem,6.2vw,5.6rem)] text-foreground"
            >
              {t.about.title}
            </h2>
          </div>

          <p className="relative mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
            {t.about.subtitle}
          </p>

          <div className="px-shape relative mt-8 max-w-2xl bg-background/70 p-5 md:p-6">
            <p className="mb-3 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              <span aria-hidden className="h-[2px] w-8 rounded-full bg-signal" />
              {t.about.inspirationLabel}
            </p>
            <p className="text-pretty text-[1.05rem] font-medium leading-relaxed text-foreground md:text-lg">
              {t.about.inspiration}
            </p>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-2">
            {t.about.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-foreground/20 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/80 md:text-[10px]"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {t.about.ctaPrimary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#proceso">{t.about.ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Criterios */}
      <div data-fx="up" className="min-w-0 lg:col-span-7">
        <p className="panel flex min-h-12 items-center gap-3 rounded-full px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span aria-hidden className="size-2 rounded-full bg-primary" />
          {t.about.principlesLabel}
        </p>
      </div>

      <div className="grid min-w-0 gap-gutter md:grid-cols-3 lg:col-span-7">
        {t.about.principles.map((principle, index) => (
          <div
            key={principle.title}
            data-fx="drop"
            style={{ "--fx-delay": `${index * 110}ms` } as CSSProperties}
            className="min-w-0"
          >
            <article
              className={cn(
                "panel group relative flex h-full min-h-72 flex-col overflow-hidden p-6 md:p-7",
                index === 0 && "panel-lime"
              )}
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "display-xl text-[4.5rem] leading-[0.8] transition-transform duration-500 group-hover:-rotate-6",
                    index === 0 ? "text-foreground" : "text-foreground/20 group-hover:text-primary"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-right font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"
                  aria-label={PRINCIPLE_MARKS[index]?.romaji}
                >
                  <span lang="ja" className="block font-jp text-base text-foreground">
                    {PRINCIPLE_MARKS[index]?.jp}
                  </span>
                  {PRINCIPLE_MARKS[index]?.romaji}
                </span>
              </div>
              <h3 className="display-xl text-[2.2rem] text-foreground">{principle.title}</h3>
              <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
              <p className="mt-6 rounded-full border border-foreground/15 px-3 py-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                {principle.detail}
              </p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

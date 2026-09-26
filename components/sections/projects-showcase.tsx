"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { Tilt } from "@/components/ui/tilt";
import { Button } from "@/components/ui/button";
import { LazyMount } from "@/components/three/lazy-mount";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

// Lead with these four, then fold the rest behind "Mostrar más" so the
// section doesn't turn into an endless scroll of all live projects.
const FEATURED_SLUGS = [
  "koi-arquitectura-vercel-app",
  "element-experiences-com",
  "efficientplasticolors-com",
  "nkmohcafe-com",
] as const;

type FeaturedSlug = (typeof FEATURED_SLUGS)[number];

const isFeaturedSlug = (slug: string): slug is FeaturedSlug =>
  (FEATURED_SLUGS as readonly string[]).includes(slug);

const orderedProjects = [
  ...FEATURED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is (typeof projects)[number] => Boolean(p)
  ),
  ...projects.filter((p) => !isFeaturedSlug(p.slug)),
];

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const CASE_FIELDS = ["problem", "decision", "result"] as const;

/**
 * 作品 — el trabajo, en bento.
 *
 * Cabecera en dos paneles (rótulo gigante + bajada con contador) y debajo
 * una retícula de fichas que entran volando desde fuera del lienzo,
 * alternando lado. Cada ficha enmarca su captura en una ventana redondeada
 * con una pestaña recortada donde vive el dominio — el mismo recurso de la
 * hoja, ahora dentro de la tarjeta.
 */
export function ProjectsShowcase() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? orderedProjects : orderedProjects.slice(0, 6);

  return (
    <section
      id="projects"
      aria-label={t.projects.eyebrow}
      className="relative flex scroll-mt-[calc(var(--header-h)+1rem)] flex-col gap-gutter"
    >
      {/* Legacy anchor: keep older internal links (#portafolio) landing here. */}
      <span id="portafolio" className="absolute -top-24" aria-hidden />

      <div className="grid gap-gutter lg:grid-cols-12">
        <div data-fx="panel" className="min-w-0 lg:col-span-8">
          <div className="panel panel-moss relative flex h-full min-h-[22rem] flex-col justify-between gap-10 overflow-hidden p-6 md:p-10 lg:p-12">
            <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-40 [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_65%)]" />
            <span
              aria-hidden
              className="ghost-word drift-x absolute -right-[0.05em] bottom-[-0.1em] text-[34vw] lg:text-[22vw]"
            >
              {t.projects.rotatingWords[0]}
            </span>
            <ChapterMark
              kanji="作品"
              romaji="sakuhin"
              label={t.projects.eyebrow}
              index={2}
              total={CHAPTER_TOTAL}
              className="relative"
            />
            <div data-fx="up" className="relative">
              <h2 className="display-xl text-[clamp(3.6rem,11vw,10rem)] text-foreground">
                <span className="block">{t.projects.titlePrefix}</span>
                <span className="block text-primary">{t.projects.rotatingWords[0]}</span>
              </h2>
            </div>
          </div>
        </div>

        <div data-fx="right" className="min-w-0 lg:col-span-4" style={{ "--fx-delay": "120ms" } as CSSProperties}>
          <div className="panel relative flex h-full flex-col justify-between gap-10 overflow-hidden p-6 md:p-8">
            <span aria-hidden lang="ja" className="pointer-events-none absolute -right-4 -top-6 select-none font-jp text-[9rem] leading-none text-foreground/[0.04]">
              作
            </span>
            <p className="relative max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.projects.subtitle}
            </p>
            <div aria-hidden className="relative flex items-end justify-between gap-4">
              <span className="display-xl text-[5.5rem] leading-[0.8] text-foreground md:text-[7rem]">
                {String(visibleProjects.length).padStart(2, "0")}
              </span>
              <span className="flex flex-col items-end gap-2 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="size-2.5 rounded-full bg-signal shadow-[0_0_14px_hsl(var(--signal)/0.7)]" />
                01 — {String(orderedProjects.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        {visibleProjects.map((p, idx) => {
          const projectCase = isFeaturedSlug(p.slug) ? t.projects.cases[p.slug] : undefined;
          const wide = idx === 0 || idx === 3;
          // Entran desde el lado donde viven en la retícula.
          const fromLeft = idx % 2 === 0;

          return (
            <div
              key={p.slug}
              data-fx={fromLeft ? "left" : "right"}
              style={{ "--fx-delay": `${(idx % 2) * 90}ms` } as CSSProperties}
              className={cn(
                "min-w-0 md:col-span-6",
                idx === 0 && "lg:col-span-8",
                idx === 1 && "lg:col-span-4",
                idx === 2 && "lg:col-span-5",
                idx === 3 && "lg:col-span-7",
                idx >= 4 && "lg:col-span-6"
              )}
            >
              <Tilt max={2.2} className="h-full">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel group flex h-full flex-col overflow-hidden p-[var(--gutter)] transition-[box-shadow] duration-500 hover:shadow-[0_30px_70px_-35px_hsl(var(--primary)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sheet))]"
                >
                  {/* Ventana de la captura, con pestaña recortada. */}
                  <div
                    className={cn(
                      "amiten relative aspect-[4/3] overflow-hidden rounded-inner bg-secondary/30",
                      wide && "lg:aspect-[16/9]"
                    )}
                    style={{ "--notch-bg": "var(--background)" } as CSSProperties}
                  >
                    <LazyMount
                      rootMargin="320px"
                      className="absolute inset-0"
                      fallback={<div aria-hidden className="dot-grid h-full w-full opacity-40" />}
                    >
                      <Image
                        src={mobileShot(p.slug)}
                        alt={`${p.name} — captura del sitio`}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 3rem), 50vw"
                        quality={60}
                        loading="lazy"
                        className="object-cover object-top group-hover:scale-[1.04] motion-reduce:transform-none md:hidden"
                      />
                      <Image
                        src={desktopShot(p.slug)}
                        alt={`${p.name} — captura del sitio`}
                        fill
                        sizes="(min-width: 1280px) 60vw, (min-width: 768px) 50vw, 100vw"
                        quality={60}
                        loading="lazy"
                        className="hidden object-cover object-top group-hover:scale-[1.04] motion-reduce:transform-none md:block"
                      />
                    </LazyMount>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-16 bg-gradient-to-t from-background/60 to-transparent"
                    />
                    <div className="notch notch-tr z-[4]">
                      <span className="inline-flex min-h-9 max-w-[12rem] items-center truncate rounded-full bg-secondary px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/80 sm:max-w-none">
                        {hostname(p.url)}
                      </span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:rotate-45 group-hover:scale-110">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="absolute bottom-3 left-4 z-[4] display-xl text-[3.5rem] leading-none text-foreground/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)] md:text-[4.5rem]"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5 sm:px-4 sm:pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="display-xl text-[clamp(2rem,3.4vw,3rem)] leading-[0.9] text-foreground transition-colors group-hover:text-primary">
                        {p.name}
                      </h3>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {t.projects.descs[p.slug] ?? p.desc}
                      </p>
                    </div>

                    {projectCase && (
                      <dl className="mt-5 grid gap-2">
                        {CASE_FIELDS.map((field) => (
                          <div
                            key={field}
                            className="grid grid-cols-[5.25rem_minmax(0,1fr)] items-start gap-3 rounded-2xl bg-secondary/60 px-3.5 py-3 sm:grid-cols-[6.25rem_minmax(0,1fr)]"
                          >
                            <dt className="inline-flex w-fit items-center rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[10px]">
                              {t.projects.caseLabels[field]}
                            </dt>
                            <dd className="text-[13px] leading-relaxed text-foreground/80">
                              {projectCase[field]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 font-display text-base font-bold uppercase tracking-[0.06em] text-foreground/85 transition-colors group-hover:text-primary">
                      <span className="h-[2px] w-7 rounded-full bg-primary transition-all duration-500 group-hover:w-12" />
                      {t.projects.visitSite}
                    </span>
                  </div>
                </a>
              </Tilt>
            </div>
          );
        })}
      </div>

      {!showAll && orderedProjects.length > visibleProjects.length && (
        <div data-fx="pop" className="flex justify-center py-2">
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowAll(true)}
            className="focus-visible:ring-offset-[hsl(var(--sheet))]"
          >
            {t.projects.showMore}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}

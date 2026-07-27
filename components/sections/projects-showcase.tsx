"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { Tilt } from "@/components/ui/tilt";
import { Button } from "@/components/ui/button";
import { LazyMount } from "@/components/three/lazy-mount";
import { SeigaihaRule } from "@/components/japan/seigaiha-rule";
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

export function ProjectsShowcase() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? orderedProjects : orderedProjects.slice(0, 6);

  return (
    <section
      id="projects"
      aria-label={t.projects.eyebrow}
      className="relative isolate overflow-hidden border-t border-border py-20 md:py-28"
    >
      {/* Legacy anchor: keep older internal links (#portafolio) landing here. */}
      <span id="portafolio" className="absolute -top-24" aria-hidden />
      <div aria-hidden className="route-grid absolute inset-0 -z-20 opacity-30" />
      <div aria-hidden className="japan-halftone absolute inset-0 -z-10 opacity-25" />
      {/* Aquí flotaba la TractionLine a 13% de opacidad, desbordada un 18% por
          la derecha: la firma de marca convertida en ruido de fondo. Sigue
          existiendo donde una firma tiene sentido —el cierre del footer— y su
          lugar aquí lo toma la banda de olas, que sí separa dos bloques. */}
      <SeigaihaRule className="absolute inset-x-0 top-0 -z-10 opacity-70" />

      <div className="container relative">
        <div className="grid gap-8 border-y border-border py-7 lg:grid-cols-12 lg:items-end lg:gap-10 md:py-9">
          <div className="lg:col-span-8">
            <ChapterMark
              kanji="作品"
              romaji="sakuhin"
              label={t.projects.eyebrow}
              index={2}
              total={CHAPTER_TOTAL}
              className="mb-6"
            />
            <h2 className="max-w-4xl font-display text-[clamp(2.65rem,7vw,6.8rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em]">
              <span className="block">{t.projects.titlePrefix}</span>
              <span className="block text-primary">
                {t.projects.rotatingWords[0]}
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end">
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground lg:text-right md:text-lg">
              {t.projects.subtitle}
            </p>
            <div
              aria-hidden
              className="flex w-full items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-foreground/55 lg:max-w-xs"
            >
              <span>01</span>
              <span className="h-px flex-1 bg-border" />
              <span>{String(visibleProjects.length).padStart(2, "0")}</span>
              <span className="h-1.5 w-1.5 bg-signal" />
            </div>
          </div>
        </div>

        {/* Cada pieza se presenta como un dossier: evidencia grande, ficha
            breve y datos del caso. Sin marcos de navegador ni utilería. */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-12 md:gap-6">
          {visibleProjects.map((p, idx) => {
            const projectCase = isFeaturedSlug(p.slug) ? t.projects.cases[p.slug] : undefined;
            const wide = idx === 0 || idx === 3;

            return (
              <Tilt
                key={p.slug}
                reveal
                max={1.5}
                revealDelay={(idx % 2) * 0.08}
                className={cn(
                  "min-w-0 md:col-span-6",
                  idx === 0 && "lg:col-span-8",
                  idx === 1 && "lg:col-span-4",
                  idx === 2 && "lg:col-span-5",
                  idx === 3 && "lg:col-span-7",
                  idx >= 4 && "lg:col-span-6"
                )}
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-panel group flex h-full flex-col overflow-hidden transition-colors duration-300 hover:border-primary/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex min-h-12 items-center gap-4 border-b border-border px-4 py-3 sm:px-5">
                    <span className="font-display text-2xl font-semibold tabular-nums text-foreground/25 transition-colors group-hover:text-primary/70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px min-w-4 flex-1 bg-border transition-colors group-hover:bg-primary/40" />
                    <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {hostname(p.url)}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/55 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  {/* 網点. Las capturas entraban a color pleno y no
                      pertenecían al mismo mundo de tinta que la interfaz. La
                      trama las integra y se retira al pasar el puntero, que es
                      cuando de verdad estás mirando la pieza. */}
                  <div
                    className={cn(
                      "amiten relative aspect-[4/3] overflow-hidden bg-secondary/20",
                      wide && "lg:aspect-[16/9]"
                    )}
                  >
                    <LazyMount
                      rootMargin="320px"
                      className="absolute inset-0"
                      fallback={<div aria-hidden className="route-grid h-full w-full opacity-40" />}
                    >
                      <Image
                        src={mobileShot(p.slug)}
                        alt={`${p.name} — captura del sitio`}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 3rem), 50vw"
                        quality={60}
                        loading="lazy"
                        className="object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-material)] group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none md:hidden"
                      />
                      <Image
                        src={desktopShot(p.slug)}
                        alt={`${p.name} — captura del sitio`}
                        fill
                        sizes="(min-width: 1280px) 60vw, (min-width: 768px) 50vw, 100vw"
                        quality={60}
                        loading="lazy"
                        className="hidden object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-material)] group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none md:block"
                      />
                    </LazyMount>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/50 to-transparent"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="font-display text-[clamp(1.45rem,3vw,2.35rem)] font-semibold leading-[1.02] tracking-tight text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {t.projects.descs[p.slug] ?? p.desc}
                    </p>

                    {projectCase && (
                      <dl className="mt-5 divide-y divide-border/80 border-y border-border/80">
                        {CASE_FIELDS.map((field) => (
                          <div
                            key={field}
                            className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[5.75rem_minmax(0,1fr)]"
                          >
                            <dt className="pt-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-primary sm:text-[10px]">
                              {t.projects.caseLabels[field]}
                            </dt>
                            <dd className="text-[13px] leading-relaxed text-foreground/75">
                              {projectCase[field]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/80 transition-colors group-hover:text-primary">
                      <span className="h-px w-7 bg-primary transition-all duration-300 group-hover:w-10" />
                      {t.projects.visitSite}
                    </span>
                  </div>
                </a>
              </Tilt>
            );
          })}
        </div>

        {!showAll && orderedProjects.length > visibleProjects.length && (
          <div className="mt-12 flex items-center gap-5 md:mt-16">
            <span aria-hidden className="h-px flex-1 bg-border" />
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="rounded-none border-border bg-background/70 font-mono text-[10px] uppercase tracking-[0.15em] hover:border-primary/60"
            >
              {t.projects.showMore}
              <ChevronDown className="ml-1.5 h-4 w-4" />
            </Button>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>
        )}
      </div>
    </section>
  );
}

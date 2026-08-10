"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { Disclosure } from "@/components/ui/disclosure";
import { LazyMount } from "@/components/three/lazy-mount";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

// Cuatro piezas al frente. Son las cuatro que tienen caso escrito en el
// diccionario, así que son las únicas que pueden sostener un dossier.
const FEATURED_SLUGS = [
  "koi-arquitectura-vercel-app",
  "element-experiences-com",
  "efficientplasticolors-com",
  "nkmohcafe-com",
] as const;

type FeaturedSlug = (typeof FEATURED_SLUGS)[number];

const isFeatured = (slug: string): slug is FeaturedSlug =>
  (FEATURED_SLUGS as readonly string[]).includes(slug);

const featured = FEATURED_SLUGS.map((slug) =>
  projects.find((p) => p.slug === slug)
).filter((p): p is (typeof projects)[number] => Boolean(p));

const rest = projects.filter((p) => !isFeatured(p.slug));

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const CASE_FIELDS = ["problem", "decision", "result"] as const;

/**
 * 作品 — la rejilla de trabajo.
 *
 * Antes eran seis dossieres completos, uno debajo de otro, cada uno con
 * captura grande y tres párrafos de caso siempre abiertos: más de seis mil
 * píxeles de scroll para la misma información.
 *
 * La referencia lo resuelve con un bento de cuatro piezas, cada una con su
 * bloque de color, y todo lo demás detrás de un «ver todos». Eso es lo que
 * hay aquí: cuatro piezas con evidencia grande, el caso plegado dentro de
 * cada una, y las otras dieciocho como índice —nombre, dominio, oficio— que
 * es como se listan las obras en un catálogo, no como se exhiben.
 */
export function WorkGrid() {
  const { t } = useLanguage();

  // Encuadre del bento: ancha, angosta, angosta, ancha.
  const SPANS = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-5",
    "lg:col-span-7",
  ] as const;
  // En teléfono todas las capturas van a 16/10: el bento sólo existe a partir
  // de lg, y en una columna el 4/3 sólo añadía scroll.
  //
  // En lg las dos piezas de cada renglón tienen anchos distintos (7 y 5
  // columnas), así que para que sus capturas midan lo mismo de alto la
  // angosta necesita una proporción más cuadrada: 687 px × 10/16 ≈ 485 px ×
  // 8/7. Sin eso, la tarjeta baja se estiraba y dejaba un hueco muerto entre
  // la imagen y el pie.
  const RATIOS = [
    "aspect-[16/10]",
    "aspect-[16/10] lg:aspect-[8/7]",
    "aspect-[16/10] lg:aspect-[8/7]",
    "aspect-[16/10]",
  ] as const;
  // El bloque de color que la referencia pone en una de cada tres piezas.
  const ACCENTS = ["ink", "lime", "bone", "signal"] as const;

  return (
    <section
      id="projects"
      aria-label={t.projects.eyebrow}
      className="relative isolate overflow-hidden border-b border-border py-16 md:py-24"
    >
      <span id="portafolio" className="absolute -top-24" aria-hidden />
      <div aria-hidden className="route-grid absolute inset-0 -z-20 opacity-25" />
      <div aria-hidden className="japan-halftone absolute inset-0 -z-10 opacity-20" />

      <div className="container relative">
        <div className="grid gap-6 border-b border-border pb-7 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <ChapterMark
              kanji="作品"
              romaji="sakuhin"
              label={t.projects.eyebrow}
              index={2}
              total={CHAPTER_TOTAL}
              className="mb-6"
            />
            <h2 className="max-w-4xl font-display text-[clamp(2.4rem,7vw,5.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em]">
              <span className="block">{t.projects.titlePrefix}</span>
              <span className="block text-primary">{t.projects.rotatingWords[0]}</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
            <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground lg:text-right md:text-base">
              {t.projects.subtitle}
            </p>
            <span
              aria-hidden
              className="flex w-full items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-foreground/55 lg:max-w-[15rem]"
            >
              <span>04</span>
              <span className="h-px flex-1 bg-border" />
              <span>{String(projects.length).padStart(2, "0")}</span>
              <span className="size-1.5 bg-signal" />
            </span>
          </div>
        </div>

        <div className="relative mt-8 flex gap-5 md:mt-12">
          {/* 縦組み: la etiqueta al canto que la referencia pone junto a la
              rejilla. Ornamento — el título ya está arriba. */}
          <span
            aria-hidden
            className="hidden shrink-0 items-start pt-2 xl:flex"
          >
            <span className="vertical-jp font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/30">
              {t.ui.featuredWork}
            </span>
          </span>

          <div className="grid min-w-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-12">
            {featured.map((p, idx) => (
              <WorkCard
                key={p.slug}
                index={idx}
                project={p}
                accent={ACCENTS[idx]}
                ratio={RATIOS[idx]}
                className={SPANS[idx]}
              />
            ))}
          </div>
        </div>

        {/* ——— El resto, como índice ——————————————————————————— */}
        <Disclosure
          label={`${t.ui.viewAllProjects} (${rest.length})`}
          labelOpen={t.ui.collapse}
          className="mt-10 md:mt-14"
          triggerClassName="w-full justify-between border-t border-border pt-5"
        >
          <ul className="grid border-t border-border sm:grid-cols-2">
            {rest.map((p, i) => (
              <li key={p.slug} className={cn("border-b border-border", i % 2 === 0 && "sm:border-r")}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[4.5rem] items-center gap-4 px-1 py-4 transition-colors hover:bg-primary/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-4"
                >
                  <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-foreground/35">
                    {String(i + 5).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {t.projects.descs[p.slug] ?? p.desc}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/35 md:inline">
                    {hostname(p.url)}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-foreground/40 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </section>
  );
}

const ACCENT_HEADER = {
  ink: "bg-card/60 text-foreground",
  lime: "bg-primary text-primary-foreground",
  bone: "paper-panel",
  signal: "bg-card/60 text-foreground",
} as const;

const ACCENT_RULE = {
  ink: "bg-border",
  lime: "bg-primary",
  bone: "bg-foreground/70",
  signal: "bg-signal",
} as const;

function WorkCard({
  project,
  index,
  accent,
  ratio,
  className,
}: {
  project: (typeof projects)[number];
  index: number;
  accent: keyof typeof ACCENT_HEADER;
  ratio: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const projectCase = isFeatured(project.slug)
    ? t.projects.cases[project.slug]
    : undefined;

  return (
    <article
      className={cn(
        "editorial-panel group flex min-w-0 flex-col overflow-hidden transition-colors duration-300 hover:border-primary/55",
        className
      )}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        {/* Cabecera con bloque de color: es lo que separa una pieza de la
            siguiente en la referencia, antes que la captura. */}
        <div
          className={cn(
            "flex min-h-14 items-baseline gap-3 px-4 py-3 sm:px-5",
            ACCENT_HEADER[accent]
          )}
        >
          <span className="font-display text-2xl font-bold tabular-nums leading-none opacity-45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="text-lg leading-none opacity-35">
            /
          </span>
          <h3 className="min-w-0 flex-1 truncate font-display text-lg font-bold uppercase leading-none tracking-tight sm:text-xl">
            {project.name}
          </h3>
          <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        <span aria-hidden className={cn("h-px w-full", ACCENT_RULE[accent])} />

        <div className={cn("amiten relative overflow-hidden bg-secondary/20", ratio)}>
          <LazyMount
            rootMargin="320px"
            className="absolute inset-0"
            fallback={<div aria-hidden className="route-grid size-full opacity-40" />}
          >
            <Image
              src={mobileShot(project.slug)}
              alt={`${project.name} — ${t.projects.descs[project.slug] ?? project.desc}`}
              fill
              sizes="(max-width: 767px) calc(100vw - 3rem), 50vw"
              quality={60}
              loading="lazy"
              className="object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-material)] group-hover:scale-[1.025] motion-reduce:transform-none md:hidden"
            />
            <Image
              src={desktopShot(project.slug)}
              alt={`${project.name} — ${t.projects.descs[project.slug] ?? project.desc}`}
              fill
              sizes="(min-width: 1280px) 55vw, (min-width: 768px) 50vw, 100vw"
              quality={60}
              loading="lazy"
              className="hidden object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-material)] group-hover:scale-[1.025] motion-reduce:transform-none md:block"
            />
          </LazyMount>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/55 to-transparent"
          />
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="truncate">{t.projects.descs[project.slug] ?? project.desc}</span>
          <span aria-hidden className="h-px flex-1 bg-border" />
          <span className="hidden shrink-0 sm:inline">{hostname(project.url)}</span>
        </p>

        {/* El dossier ya no vive abierto: quien quiere el caso lo pide. */}
        {projectCase && (
          <Disclosure
            label={t.ui.detail}
            labelOpen={t.ui.hideDetail}
            className="mt-auto"
            triggerClassName="w-full justify-between border-t border-border pt-4"
            contentClassName="pt-3"
          >
            <dl className="divide-y divide-border border-y border-border">
              {CASE_FIELDS.map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
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
          </Disclosure>
        )}
      </div>
    </article>
  );
}

"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Lightbulb,
  Lock,
  Sparkle,
  Target,
  TrendingUp,
} from "lucide-react";

import { projects, desktopShot, mobileShot, type Project } from "@/lib/projects";
import { SitePreview } from "@/components/site-preview";
import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

/**
 * Recientes: seis lanzamientos con captura (dos filas en escritorio). Mixteca
 * es el destacado (aquí y en el hero), así que no se repite aquí.
 * Van en su propia lista: mantener un múltiplo de seis para que llenen filas
 * completas de dos y de tres columnas.
 */
const RECENT_SLUGS = [
  "gecomex-web-vercel-app",
  "ceahestructural-com-mx",
  "efficientplasticolors-com",
  "koi-arquitectura-vercel-app",
  "epiko-vercel-app",
  "goldenrepublic-com-mx",
];

/** Solo los estrenos de verdad llevan "Nuevo": si todo es nuevo, nada lo es. */
const NEW_SLUGS = new Set([
  "gecomex-web-vercel-app",
  "ceahestructural-com-mx",
  "efficientplasticolors-com",
]);

/** El protagonista (escritorio + teléfono); también es el destacado del hero. */
const FEATURED_SLUG = "mixteca-web-vercel-app";

/** Los cuatro casos con problema, decisión y resultado en el diccionario. */
const CASE_SLUGS = [
  "koi-arquitectura-vercel-app",
  "element-experiences-com",
  "efficientplasticolors-com",
  "nkmohcafe-com",
] as const;
type CaseSlug = (typeof CASE_SLUGS)[number];

const CASE_FIELDS = [
  { key: "problem", Icon: Target },
  { key: "decision", Icon: Lightbulb },
  { key: "result", Icon: TrendingUp },
] as const;

const hasShots = (p: Project) => p.shots !== false;
const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");

const bySlug = new Map(projects.map((p) => [p.slug, p]));
const featuredProject = bySlug.get(FEATURED_SLUG) ?? projects[0];
const recentGrid = RECENT_SLUGS.map((slug) => bySlug.get(slug)).filter(
  (p): p is Project => p !== undefined && hasShots(p) && p.slug !== featuredProject.slug
);
const restProjects = projects.filter(
  (p) => p.slug !== featuredProject.slug && !recentGrid.includes(p)
);
/** El resto con captura va a la retícula; los que aún no la tienen, a una
 *  lista tipo app (nunca una ficha de relleno). */
const restTiles = restProjects.filter(hasShots);
const launching = restProjects.filter((p) => !hasShots(p));
const RECENT_COUNT = recentGrid.length + 1;

/** El teléfono del contador y su pila: sitios que no salen en el hero, el
 *  destacado, los recientes ni los casos, para no repetir caras. */
const COUNT_PHONE = "ndt360-com-mx";
const COUNT_AVATARS = ["mielyabejas-mx", "bravologix-com-mx", "gruposum-com"];
/** La pila de "+N": tres del resto con cabecera oscura (se leen en el lima). */
const MORE_AVATARS = ["grupocosma-com", "nezga-arquitectos-vercel-app", "distribuidorajemar-com"];

// Cierre de "Todos": ocupa justo los huecos que deja la última fila de su
// retícula (dos columnas en teléfono y tableta, tres en escritorio). Los
// recientes van en su propia lista, así que solo cuenta el resto.
const restCells = restTiles.length;
const closerSpan = (restCells + (launching.length > 0 ? 2 : 0)) % 2 ? "col-span-1" : "col-span-2";
const closerDeskCells = (restCells + (launching.length > 0 ? 1 : 0)) % 3;
const closerWide = closerDeskCells === 0;
const closerLgSpan = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-1"][closerDeskCells];

const fx = (ms: number) => ({ "--fx-delay": `${ms}ms` }) as CSSProperties;

/** Resalta `accent` dentro de `title` (serif itálica; solo color en CJK). */
function accentTitle(title: string, accent: string): ReactNode {
  const at = accent ? title.indexOf(accent) : -1;
  if (at < 0) return title;
  const cjk = /[　-鿿]/.test(accent);
  return (
    <>
      {title.slice(0, at)}
      <span
        className={cn(
          "text-forest",
          !cjk && "font-serif text-[1.08em] font-normal italic tracking-[-0.01em]"
        )}
      >
        {accent}
      </span>
      {title.slice(at + accent.length)}
    </>
  );
}

/** Punto "en vivo" con pulso suave. */
function LiveDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative flex size-2", className)}>
      <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />
      <span className="relative size-2 rounded-full bg-current" />
    </span>
  );
}

/** Pila de avatares redondos con capturas móviles. */
function ShotStack({
  slugs,
  ring = "ring-lime",
  className,
}: {
  slugs: string[];
  ring?: string;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("flex -space-x-3", className)}>
      {slugs.map((slug) => (
        <span
          key={slug}
          className={cn("relative size-10 overflow-hidden rounded-full bg-white ring-[3px]", ring)}
        >
          <Image src={mobileShot(slug)} alt="" fill sizes="40px" className="object-cover object-top" />
        </span>
      ))}
    </span>
  );
}

/** Barra de navegador: tres puntos y la URL en píldora. */
function BrowserBar({
  host,
  className,
  pillClassName,
}: {
  host: string;
  className?: string;
  pillClassName?: string;
}) {
  return (
    <div aria-hidden className={cn("flex h-9 shrink-0 items-center gap-2 px-2.5 sm:h-10 sm:px-3.5", className)}>
      <span className="flex gap-1">
        <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
        <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
        <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
      </span>
      <span
        className={cn(
          "mx-auto flex h-6 min-w-0 max-w-[78%] flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground/[0.07] px-2.5 text-xs font-semibold text-foreground/85 sm:h-7 sm:max-w-[64%] sm:px-3",
          pillClassName
        )}
      >
        <Lock className="size-3 shrink-0" />
        <span className="truncate">{host}</span>
      </span>
      <span className="hidden w-[2.4rem] sm:block" />
    </div>
  );
}

/** Teléfono con la captura móvil recortada desde arriba. */
function PhoneMock({
  slug,
  alt,
  sizes,
  className,
  style,
  cover,
}: {
  slug: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Sin captura todavía: la portada de marca (nombre y dominio). */
  cover?: { name: string; host: string };
}) {
  return (
    <div
      className={cn(
        "aspect-[390/800] bg-ink p-[3.2%] shadow-[0_34px_60px_-24px_hsl(var(--ink)/0.7)] ring-1 ring-white/10",
        className
      )}
      style={{ borderRadius: "16% / 7.8%", ...style }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-white"
        style={{ borderRadius: "13% / 6.3%" }}
      >
        <span aria-hidden className="relative block h-[5.5%] shrink-0 bg-white">
          <span className="absolute left-1/2 top-[30%] h-[52%] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
        </span>
        <span className="relative block flex-1">
          {cover ? (
            <SitePreview name={cover.name} host={cover.host} compact />
          ) : (
            <Image src={mobileShot(slug)} alt={alt} fill sizes={sizes} quality={70} className="object-cover object-top" />
          )}
        </span>
      </div>
    </div>
  );
}

/**
 * Ficha del catálogo: en escritorio, la misma barra de navegador sobre la
 * captura en todas las fichas (la URL se ilumina al pasar el puntero); en
 * teléfono, la captura móvil. Debajo, el nombre y su giro. Con `rail`, en
 * teléfono es una tarjeta ancha del carrusel (captura apaisada y el pie en
 * una fila); de md en adelante es idéntica.
 */
function ProjectTile({
  project,
  isNew,
  linkRef,
  rail = false,
}: {
  project: Project;
  isNew: boolean;
  linkRef?: (node: HTMLAnchorElement | null) => void;
  rail?: boolean;
}) {
  const { t } = useLanguage();
  const host = hostname(project.url);
  const desc = t.projects.descs[project.slug] || project.desc || host;
  const badge = (className?: string) => (
    <span
      className={cn(
        "inline-flex h-7 w-fit shrink-0 items-center gap-1 rounded-full bg-lime-soft px-2.5 text-xs font-bold text-ink sm:h-8 sm:px-3",
        className
      )}
    >
      <Sparkle aria-hidden className="h-3 w-3 fill-lime-deep text-lime-deep" />
      {t.projects.newBadge}
    </span>
  );

  return (
    <a
      ref={linkRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-pop group flex h-full flex-col p-1.5 transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:shadow-float sm:p-2.5 md:pt-1"
    >
      <BrowserBar
        host={host}
        className="hidden md:flex"
        pillClassName="transition-colors duration-300 group-hover:bg-lime-soft group-hover:text-ink"
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-inner bg-mint md:aspect-[1440/1000]",
          rail ? "aspect-[4/3]" : "aspect-[4/5]"
        )}
        style={{ "--notch-bg": "var(--card)" } as CSSProperties}
      >
        <Image
          src={mobileShot(project.slug)}
          alt={`${project.name} — versión móvil del sitio`}
          fill
          sizes={rail ? "(max-width: 639px) 80vw, (max-width: 767px) 46vw, 1px" : "(max-width: 767px) 50vw, 1px"}
          quality={70}
          className="object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] md:hidden"
        />
        <Image
          src={desktopShot(project.slug)}
          alt={`${project.name} — captura del sitio`}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 1px"
          quality={70}
          className="hidden object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] md:block"
        />
        {/* En el carrusel el "Nuevo" flota sobre la captura para que el
            nombre tenga todo el ancho; de md en adelante va en el pie. */}
        {rail && isNew && badge("absolute right-2 top-2 z-10 shadow-soft md:hidden")}
        <span className="notch notch-br">
          <span className="grid size-9 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:rotate-45 sm:size-11">
            <ArrowUpRight aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        </span>
      </div>

      <div
        className={cn(
          "flex flex-1 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-3 sm:pb-2.5 sm:pt-4",
          rail ? "flex-row items-end justify-between gap-3 px-2" : "flex-col gap-2 px-1.5"
        )}
      >
        <div className="min-w-0">
          <h3
            // El tamaño va antes del interlineado: cn() quita un `leading-*`
            // que quede antes de un `text-*`.
            className={cn(
              "display-title",
              rail ? "text-[1.25rem]" : "text-[1.0625rem]",
              "leading-[1.08] text-foreground sm:text-[1.5rem]"
            )}
          >
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[0.9375rem] leading-snug text-muted-foreground sm:text-sm">
            {desc}
          </p>
        </div>
        {isNew && badge(rail ? "hidden md:inline-flex" : undefined)}
      </div>
    </a>
  );
}

/**
 * Lanzamientos que todavía no tienen captura: filas tipo app (punto en vivo,
 * nombre y dominio). Se vacía sola cuando cada sitio tenga su captura.
 */
function LaunchList({
  items,
  firstLinkRef,
}: {
  items: Project[];
  firstLinkRef?: (node: HTMLAnchorElement | null) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="card-pop flex h-full flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="display-title text-[1.375rem] leading-[1.08] text-foreground sm:text-[1.5rem]">
            {t.projects.launchedTitle}
          </h3>
          <p className="mt-1.5 text-pretty text-sm leading-snug text-muted-foreground">
            {t.projects.launchedNote}
          </p>
        </div>
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink">
          <Sparkle className="h-5 w-5 fill-ink" />
        </span>
      </div>
      {/* En escritorio la lista llena la celda: las filas se reparten el alto. */}
      <ul role="list" className="flex flex-col gap-1 rounded-card bg-mint p-1.5 lg:flex-1">
        {items.map((project, index) => (
          <li key={project.slug} className="flex lg:flex-1">
            <a
              ref={index === 0 ? firstLinkRef : undefined}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 w-full items-center gap-3 rounded-inner px-2.5 py-2 transition-colors duration-200 hover:bg-white"
            >
              <span
                aria-hidden
                className="display-title grid size-10 shrink-0 place-items-center rounded-full bg-ink text-base text-lime"
              >
                {project.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9375rem] font-semibold text-foreground">
                  {project.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <LiveDot className="shrink-0 text-forest" />
                  <span className="truncate">{hostname(project.url)}</span>
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="h-4 w-4 shrink-0 text-forest transition-transform duration-300 group-hover:rotate-45"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Tarjeta grande: el lanzamiento destacado en escritorio y en teléfono. */
function FeaturedProject({ project }: { project: Project }) {
  const { t } = useLanguage();
  const [lead, ...tail] = project.name.split(" ");
  const desc = t.projects.descs[project.slug] ?? project.desc;
  const host = hostname(project.url);
  const live = project.shots === false;

  return (
    <article className="panel panel-forest relative grid items-center gap-6 overflow-hidden p-4 pt-[4.25rem] sm:p-7 sm:pt-20 md:gap-8 lg:grid-cols-12 lg:gap-6 lg:p-10 lg:pt-10">
      {/* Fondo: un parche de puntos lima. */}
      <span
        aria-hidden
        className="dot-cluster pointer-events-none absolute -bottom-6 right-[-1rem] h-48 w-64 opacity-25 [mask-image:radial-gradient(circle_at_70%_70%,black,transparent_72%)] lg:h-72 lg:w-96"
      />

      <div className="notch notch-tl">
        <span className="tag-pill pr-4">
          <span className="seal">
            <Sparkle aria-hidden className="h-3.5 w-3.5 fill-ink" />
          </span>
          {t.hero.featured}
        </span>
      </div>

      <div className="relative z-[1] flex flex-col items-start gap-4 md:gap-5 lg:col-span-5 lg:gap-6 lg:pt-16">
        <h3 className="text-white">
          <span
            className={cn(
              "display-xl block",
              // Nombres largos (p. ej. "Mixteca") bajan de tamaño para no
              // invadir la columna de los dispositivos.
              lead.length > 5 ? "text-[clamp(3.75rem,7.2vw,7rem)]" : "text-[clamp(4.25rem,10.5vw,9.5rem)]"
            )}
          >
            {lead}
          </span>
          {tail.length > 0 && (
            <span className="mt-1 block font-serif text-[clamp(2.5rem,4.8vw,4.5rem)] italic leading-[0.9] text-lime">
              {tail.join(" ")}
            </span>
          )}
        </h3>
        {desc && (
          <p className="max-w-md text-pretty text-base leading-relaxed text-white/80 md:text-lg">{desc}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3.5 text-sm font-semibold text-white">
            <LiveDot className="text-lime" />
            {t.projects.live}
          </span>
          <span className="inline-flex h-9 items-center rounded-full bg-white/10 px-3.5 text-sm font-semibold text-white">
            {host}
          </span>
        </div>
        <Button asChild size="lg" className="mt-1 w-full pr-2.5 sm:w-auto">
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            {t.projects.visitSite}
            <span className="sr-only"> — {project.name}</span>
            <ButtonArrow tone="ink" className="-mr-0.5 ml-auto sm:ml-2" />
          </a>
        </Button>
      </div>

      {/* Dispositivos: navegador de escritorio y el teléfono encima, a la
          izquierda y un poco más abajo. En teléfono el navegador va a todo lo
          ancho y el teléfono lo pisa desde abajo, sin recortarse. Sin captura
          todavía, ambos muestran la portada de marca. */}
      <div className="relative lg:col-span-7">
        <div className="relative pb-10 pl-[15%] sm:pb-14 lg:pb-10 lg:pl-[13%]">
          <div className="surface-white rounded-card p-1.5 shadow-float sm:p-2">
            <BrowserBar host={host} />
            <div className="relative aspect-[1440/1000] overflow-hidden rounded-inner bg-mint">
              {live ? (
                <SitePreview name={project.name} host={host} />
              ) : (
                <Image
                  src={desktopShot(project.slug)}
                  alt={`${project.name} — captura del sitio en escritorio`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 86vw"
                  quality={75}
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>
          <PhoneMock
            slug={project.slug}
            cover={live ? { name: project.name, host } : undefined}
            alt={`${project.name} — captura del sitio en móvil`}
            sizes="(min-width: 1024px) 15rem, 30vw"
            className="absolute bottom-0 left-0 w-[27%] max-w-[15rem] md:w-[30%]"
          />
          <Sparkle
            aria-hidden
            className="float-y absolute -right-1 -top-4 h-8 w-8 fill-lime text-lime sm:h-10 sm:w-10 lg:-right-3 lg:-top-6"
          />
        </div>
      </div>
    </article>
  );
}

/**
 * Casos de estudio — sección propia en tres piezas: cabecera con pestañas en
 * píldora, escenario crema con el teléfono (numerado 01/04, editorial) y el
 * detalle en filas tipo app. En teléfono el escenario queda entre las
 * pestañas y el detalle.
 */
export function ProjectCases() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slug: CaseSlug = CASE_SLUGS[active];
  const project = bySlug.get(slug);
  const projectCase = t.projects.cases[slug];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = CASE_SLUGS.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % CASE_SLUGS.length
        : event.key === "ArrowLeft"
          ? (active + last) % CASE_SLUGS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  if (!project) return null;
  const desc = t.projects.descs[slug] ?? project.desc;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="casos-de-estudio"
      aria-label={t.projects.casesTitle}
      className="grid gap-gutter lg:grid-cols-12 lg:grid-rows-[auto_1fr]"
    >
      {/* Cabecera + pestañas. */}
      <div data-fx="panel" className="min-w-0 lg:col-span-7">
        <div className="panel flex h-full flex-col gap-6 p-5 shadow-soft sm:gap-7 sm:p-7 lg:p-10">
          <SectionHeading
            eyebrow={t.projects.casesEyebrow}
            title={t.projects.casesTitle}
            subtitle={t.projects.casesSubtitle}
          />
          <div
            role="tablist"
            aria-label={t.projects.casesTitle}
            onKeyDown={onKeyDown}
            className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {CASE_SLUGS.map((caseSlug, index) => {
              const selected = index === active;
              return (
                <button
                  key={caseSlug}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`case-tab-${caseSlug}`}
                  aria-selected={selected}
                  aria-controls="case-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={cn(
                    "h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors duration-200",
                    selected
                      ? "bg-ink text-white"
                      : "border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/[0.03]"
                  )}
                >
                  {bySlug.get(caseSlug)?.name ?? caseSlug}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Escenario crema: número editorial, órbita y el teléfono que sube
          desde el borde inferior. */}
      <div
        data-fx="right"
        className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
        style={fx(120)}
      >
        <div className="panel relative h-[23rem] overflow-hidden bg-cream shadow-soft sm:h-[27rem] lg:h-full lg:min-h-[36rem]">
          <span
            aria-hidden
            className="dot-cluster pointer-events-none absolute bottom-6 left-4 h-32 w-40 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_20%_80%,black,transparent_72%)] sm:h-40 sm:w-52"
          />
          <svg
            aria-hidden
            viewBox="0 0 400 140"
            className="pointer-events-none absolute left-1/2 top-[38%] w-[124%] -translate-x-1/2 text-forest/30"
          >
            <ellipse cx="200" cy="70" rx="190" ry="44" fill="none" stroke="currentColor" strokeWidth="1.25" transform="rotate(-10 200 70)" />
          </svg>
          <p
            aria-hidden
            className="absolute left-5 top-4 z-[2] flex items-baseline gap-1.5 font-serif italic text-forest sm:left-7 sm:top-6"
          >
            <span className="text-[3.25rem] leading-none sm:text-[4.5rem]">{pad(active + 1)}</span>
            <span className="text-lg text-muted-foreground sm:text-xl">/ {pad(CASE_SLUGS.length)}</span>
          </p>
          <span className="absolute right-4 top-5 z-[2] inline-flex h-9 max-w-[calc(100%-9rem)] items-center gap-2 rounded-full bg-white px-3.5 text-sm font-semibold text-ink shadow-soft sm:right-6 sm:top-7">
            <LiveDot className="shrink-0 text-forest" />
            <span className="truncate">{hostname(project.url)}</span>
          </span>
          <Sparkle aria-hidden className="float-y absolute bottom-8 right-6 z-[2] h-7 w-7 fill-lime text-lime-deep sm:right-10 lg:h-9 lg:w-9" />
          <div
            key={slug}
            className="absolute inset-x-0 bottom-0 flex justify-center duration-700 animate-in fade-in-0 slide-in-from-bottom-6"
          >
            <PhoneMock
              slug={slug}
              alt={`${project.name} — captura del sitio en móvil`}
              sizes="(min-width: 1024px) 20rem, 13rem"
              className="w-[12.5rem] translate-y-[30%] sm:w-[14.5rem] sm:translate-y-[22%] lg:w-[min(19.5rem,62%)] lg:translate-y-[7%]"
            />
          </div>
        </div>
      </div>

      {/* Detalle del caso. */}
      <div data-fx="up" className="min-w-0 lg:col-span-7 lg:row-start-2" style={fx(80)}>
        <div
          role="tabpanel"
          id="case-panel"
          aria-labelledby={`case-tab-${slug}`}
          className="panel flex h-full min-w-0 flex-col gap-5 p-4 shadow-soft sm:p-7 lg:p-8"
        >
          <div key={slug} className="flex flex-col gap-4 duration-500 animate-in fade-in-0 slide-in-from-bottom-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 pt-1 sm:px-0 sm:pt-0">
              <p className="display-title text-[1.6rem] text-foreground sm:text-[2rem]">{project.name}</p>
              {desc && <p className="text-sm font-semibold text-muted-foreground">{desc}</p>}
            </div>
            {/* Cada fila es dt + dd directos; el icono vive dentro del dt. */}
            <dl className="rounded-card bg-mint p-1.5 sm:p-2">
              {CASE_FIELDS.map(({ key, Icon }, index) => (
                <div
                  key={key}
                  className={cn(
                    "relative min-h-[4.5rem] rounded-inner py-3.5 pl-[4.375rem] pr-3 sm:min-h-[4.75rem] sm:py-4 sm:pl-[4.75rem] sm:pr-4",
                    index === 1 && "bg-white"
                  )}
                >
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-forest">
                    <span
                      aria-hidden
                      className="absolute left-3 top-3.5 grid size-11 place-items-center rounded-full bg-ink text-lime sm:left-4 sm:top-4"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {t.projects.caseLabels[key]}
                  </dt>
                  <dd className="mt-1 text-pretty text-[0.95rem] leading-relaxed text-foreground/85 sm:text-base">
                    {projectCase[key]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <Button asChild variant="ink" size="lg" className="w-full pr-2.5 sm:w-fit">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {t.projects.visitSite}
              <span className="sr-only"> — {project.name}</span>
              <ButtonArrow tone="lime" className="-mr-0.5 ml-auto sm:ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * Portafolio — catálogo tipo app.
 *
 * Cabecera en bento (titular + contador lima), el lanzamiento destacado en
 * un panel bosque con navegador y teléfono, y la retícula: seis recientes con
 * captura y la tarjeta "+N"; en "Todos", el resto, los recién lanzados sin
 * captura en una lista y el cierre hacia el configurador. En teléfono los
 * recientes son un carrusel con imán y el resto va a dos columnas con la
 * captura móvil, como una tienda.
 *
 * Los casos de estudio son su propia sección (`ProjectCases`). Mientras la
 * página no la monte aparte, el portafolio la incluye al final (`withCases`).
 */
export function ProjectsShowcase({ withCases = true }: { withCases?: boolean } = {}) {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [focusRest, setFocusRest] = useState(false);
  const firstRestRef = useRef<HTMLAnchorElement | null>(null);
  const setFirstRest = (node: HTMLAnchorElement | null) => {
    firstRestRef.current = node;
  };

  // Al desplegar desde la tarjeta "Mostrar más", el foco pasa al primer
  // proyecto nuevo para que el teclado no se quede en un botón que ya no está.
  useEffect(() => {
    if (!focusRest || !showAll) return;
    firstRestRef.current?.focus({ preventScroll: true });
    setFocusRest(false);
  }, [focusRest, showAll]);

  // Carrusel de teléfono: al tabular, la ficha enfocada se alinea completa
  // (el navegador deja a medias la que asoma). En la retícula no hay
  // desplazamiento horizontal y no hace nada.
  const reducedMotion = useReducedMotionPreference();
  const onRailFocus = (event: FocusEvent<HTMLUListElement>) => {
    const rail = event.currentTarget;
    if (rail.scrollWidth <= rail.clientWidth) return;
    const item = (event.target as HTMLElement).closest("li");
    if (!item || item.parentElement !== rail) return;
    const offset =
      item.getBoundingClientRect().left -
      rail.getBoundingClientRect().left -
      (parseFloat(getComputedStyle(rail).paddingLeft) || 0);
    if (Math.abs(offset) < 2) return;
    rail.scrollTo({ left: rail.scrollLeft + offset, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const filters = [
    { label: t.projects.recent, count: RECENT_COUNT, pressed: !showAll, all: false },
    { label: t.projects.all, count: projects.length, pressed: showAll, all: true },
  ];

  return (
    <section id="projects" aria-label={t.projects.eyebrow} className="relative flex flex-col gap-gutter">
      {/* Ancla heredada: los enlaces viejos a #portafolio caen aquí. */}
      <span id="portafolio" aria-hidden className="absolute left-0 top-0" />

      {/* Cabecera en bento: titular + contador. */}
      <div className="grid gap-gutter lg:grid-cols-12">
        <div data-fx="panel" className="min-w-0 lg:col-span-7">
          <div className="panel relative flex h-full flex-col justify-between gap-6 overflow-hidden p-5 shadow-soft sm:p-7 md:gap-8 lg:p-10">
            <SectionHeading
              eyebrow={t.projects.eyebrow}
              chapter={{ index: 2 }}
              title={accentTitle(t.projects.title, t.projects.titleAccent)}
              subtitle={t.projects.subtitle}
            />
            <div role="group" aria-label={t.projects.eyebrow} className="flex w-fit gap-1 rounded-full bg-ink/[0.05] p-1">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  aria-pressed={filter.pressed}
                  onClick={() => setShowAll(filter.all)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full pl-4 pr-2 text-sm font-semibold transition-colors duration-200",
                    filter.pressed ? "bg-ink text-white" : "text-ink hover:bg-ink/[0.06]"
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-xs font-bold",
                      filter.pressed ? "bg-lime text-ink" : "bg-white text-ink"
                    )}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contador lima: la cifra a la izquierda y un teléfono que sube
            desde el borde inferior, como las tarjetas de las referencias.
            En teléfono es una franja: cifra y texto en una fila, el
            teléfono asoma más bajo y la pila de avatares se guarda. */}
        <div data-fx="right" className="min-w-0 lg:col-span-5" style={fx(120)}>
          <div className="panel panel-lime relative flex h-full min-h-[10rem] overflow-hidden p-5 sm:p-7 md:min-h-[22rem] lg:p-8">
            <span
              aria-hidden
              className="dot-cluster pointer-events-none absolute -top-2 left-[32%] h-24 w-40 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_50%_30%,black,transparent_70%)] md:-bottom-4 md:top-auto md:left-[38%] md:h-40 md:w-48 md:[mask-image:radial-gradient(circle_at_50%_70%,black,transparent_70%)]"
            />
            <svg
              aria-hidden
              viewBox="0 0 400 140"
              className="pointer-events-none absolute right-[-18%] top-[18%] hidden w-[80%] text-ink/25 md:block"
            >
              <ellipse cx="200" cy="70" rx="190" ry="44" fill="none" stroke="currentColor" strokeWidth="1.25" transform="rotate(-12 200 70)" />
            </svg>
            <div className="relative z-[1] flex w-[66%] flex-col justify-between gap-4 md:w-[56%] md:gap-6 lg:w-[54%]">
              <span className="eyebrow w-fit bg-white/60 pl-3">
                <LiveDot className="text-forest" />
                {t.projects.live}
              </span>
              <div className="flex items-end gap-3 md:block">
                <p className="display-xl shrink-0 text-[5rem] leading-[0.8] text-ink md:text-[clamp(5.5rem,9vw,8.5rem)]">
                  {projects.length}
                </p>
                <p className="max-w-[14rem] text-[0.95rem] font-semibold leading-snug text-ink md:mt-3">
                  {t.projects.countLabel}
                </p>
              </div>
              <ShotStack slugs={COUNT_AVATARS} className="hidden md:flex" />
            </div>
            <PhoneMock
              slug={COUNT_PHONE}
              alt=""
              sizes="(min-width: 1024px) 13rem, 9.5rem"
              className="absolute bottom-0 right-4 w-[30%] max-w-[8rem] translate-y-[48%] sm:right-8 md:w-[40%] md:max-w-[13rem] md:translate-y-[18%] lg:right-5 lg:w-[38%] xl:right-7"
            />
            <Sparkle
              aria-hidden
              className="float-y absolute right-4 top-4 h-7 w-7 fill-ink text-ink sm:right-6 sm:top-6"
            />
          </div>
        </div>
      </div>

      {/* El lanzamiento destacado. */}
      <div data-fx="panel" className="min-w-0">
        <FeaturedProject project={featuredProject} />
      </div>

      {/* Recientes. De md en adelante, retícula (seis fichas: filas completas
          de dos y de tres columnas). En teléfono, un carrusel con imán que
          deja asomar la siguiente ficha; cada enlace sigue en el orden de
          tabulación y el navegador desplaza el carrusel al enfocarlo. */}
      <ul
        role="list"
        aria-label={t.projects.recent}
        onFocus={onRailFocus}
        className="-mx-[var(--gutter)] -my-2 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] pb-4 pt-2 [scrollbar-width:none] md:mx-0 md:my-0 md:grid md:grid-cols-2 md:gap-gutter md:overflow-visible md:p-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {recentGrid.map((project, index) => (
          <li
            key={project.slug}
            data-fx="up"
            // En el carrusel las fichas fuera de pantalla no deben esperar a
            // "entrar" para verse: se muestran fijas por debajo de md.
            className="w-[80%] min-w-0 shrink-0 snap-start sm:w-[46%] max-md:[&>*]:!transform-none max-md:[&>*]:!opacity-100 md:w-auto"
            style={fx((index % 3) * 80)}
          >
            <ProjectTile project={project} isNew={NEW_SLUGS.has(project.slug)} rail />
          </li>
        ))}
      </ul>

      {/* El resto detrás de "Mostrar más": aparece justo debajo, donde
          estaba la tarjeta "+N". */}
      {showAll || restProjects.length === 0 ? (
        <ul role="list" className="grid grid-cols-2 gap-2.5 sm:gap-gutter lg:grid-cols-3">
          {showAll && launching.length > 0 && (
            <li data-fx="up" className="col-span-2 min-w-0 lg:col-span-1">
              <LaunchList items={launching} firstLinkRef={setFirstRest} />
            </li>
          )}

          {showAll &&
            restTiles.map((project, index) => (
              <li key={project.slug} data-fx="up" className="min-w-0" style={fx((index % 3) * 80)}>
                <ProjectTile
                  project={project}
                  isNew={false}
                  linkRef={index === 0 && launching.length === 0 ? setFirstRest : undefined}
                />
              </li>
            ))}

          <li data-fx="pop" className={cn("min-w-0", closerSpan, closerLgSpan)}>
            {/* Cierre del catálogo: toda la ficha lleva al configurador. */}
            <Link
              href="#precios"
              className={cn(
                "panel-lime group relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-card p-4 transition-transform duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 sm:p-7",
                closerWide && "lg:flex-row lg:items-center lg:p-8"
              )}
            >
              <span
                aria-hidden
                className="dot-cluster pointer-events-none absolute -right-2 bottom-16 h-24 w-28 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_80%_50%,black,transparent_70%)] lg:bottom-auto lg:top-[-0.5rem] lg:h-32 lg:w-48 lg:[mask-image:radial-gradient(circle_at_85%_15%,black,transparent_70%)]"
              />
              <span className="display-title relative max-w-[18ch] text-[clamp(1.35rem,3vw,2.75rem)] text-ink">
                {t.projects.nextTitle}
              </span>
              <span
                className={cn(
                  "relative flex items-center justify-between gap-3",
                  closerWide && "lg:h-14 lg:rounded-full lg:bg-ink lg:pl-7 lg:pr-2.5 lg:text-lime"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-bold text-ink sm:text-base",
                    closerWide && "lg:text-[0.9375rem] lg:font-semibold lg:text-lime"
                  )}
                >
                  {t.nav.armaTuWeb}
                </span>
                <span
                  className={cn(
                    "btn-arrow size-11 bg-ink text-lime",
                    closerWide && "lg:size-9 lg:bg-white lg:text-ink"
                  )}
                >
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        </ul>
      ) : (
        <div data-fx="pop" className="min-w-0" style={fx(120)}>
          <div className="panel-lime relative flex flex-col gap-4 overflow-hidden rounded-card p-4 sm:p-7 md:gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-7">
            <span
              aria-hidden
              className="dot-cluster pointer-events-none absolute -right-2 -top-2 h-32 w-40 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_85%_15%,black,transparent_70%)] lg:left-[38%] lg:right-auto lg:top-auto lg:-bottom-6 lg:h-32 lg:w-56 lg:[mask-image:radial-gradient(circle_at_50%_70%,black,transparent_70%)]"
            />
            <div className="relative flex items-center gap-4 sm:gap-6">
              <p className="display-xl text-[clamp(4.25rem,8vw,6.5rem)] leading-[0.8] text-ink">
                +{restProjects.length}
              </p>
              <div className="flex flex-col gap-2.5">
                <ShotStack slugs={MORE_AVATARS} className="hidden md:flex" />
                <p className="text-base font-semibold leading-snug text-ink">{t.projects.moreLabel}</p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => {
                setShowAll(true);
                setFocusRest(true);
              }}
              className="relative w-full justify-between pr-2.5 lg:w-auto lg:min-w-[19rem]"
            >
              {t.projects.showMore}
              <span aria-hidden className="grid size-9 place-items-center rounded-full bg-lime text-ink">
                <ChevronDown className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      )}

      {withCases && <ProjectCases />}
    </section>
  );
}

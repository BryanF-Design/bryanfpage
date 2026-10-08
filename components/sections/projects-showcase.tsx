"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
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
import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/** Los nueve lanzamientos recientes, en el orden en que se presumen. */
const RECENT_SLUGS = [
  "urban-flip-com",
  "gecomex-web-vercel-app",
  "ceahestructural-com-mx",
  "efficientplasticolors-com",
  "koi-arquitectura-vercel-app",
  "bioslaboratorios-com",
  "haften-lyart-vercel-app",
  "sermaqro-com",
  "epiko-vercel-app",
];

/** El protagonista (escritorio + teléfono). Gecomex ya vive en el hero. */
const FEATURED_SLUG = "ceahestructural-com-mx";

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

const bySlug = new Map(projects.map((p) => [p.slug, p]));
const recentProjects = RECENT_SLUGS.map((slug) => bySlug.get(slug)).filter(
  (p): p is Project => Boolean(p)
);
const featuredProject = bySlug.get(FEATURED_SLUG) ?? recentProjects[0];
const recentGrid = recentProjects.filter((p) => p.slug !== featuredProject.slug);
const restProjects = projects.filter(
  (p) => p.slug !== featuredProject.slug && !RECENT_SLUGS.includes(p.slug)
);
const RECENT_COUNT = recentGrid.length + 1;

const hasShots = (p: Project) => p.shots !== false;
const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");

// Los sitios sin captura todavía llevan una "pantalla en vivo" de marca; el
// tono rota en el orden en que aparecen para que nunca se repitan seguidos.
const LIVE_TONES = ["ink", "lime", "forest", "mint"] as const;
type LiveTone = (typeof LIVE_TONES)[number];
const toneBySlug = new Map<string, LiveTone>();
[...recentGrid, ...restProjects]
  .filter((p) => !hasShots(p))
  .forEach((p, i) => toneBySlug.set(p.slug, LIVE_TONES[i % LIVE_TONES.length]));

const TONE_SURFACE: Record<LiveTone, string> = {
  ink: "panel-ink",
  lime: "panel-lime",
  forest: "panel-forest",
  mint: "panel-mint",
};
const TONE_NAME: Record<LiveTone, string> = {
  ink: "text-lime",
  lime: "text-ink",
  forest: "text-white",
  mint: "text-ink",
};

/** Avatares de captura para las pilas (comparten caché con el hero). */
const COUNT_AVATARS = ["koi-arquitectura-vercel-app", "efficientplasticolors-com", "epiko-vercel-app"];
/** El teléfono del contador: el mismo lanzamiento que presume el hero. */
const COUNT_PHONE = "gecomex-web-vercel-app";
const MORE_AVATARS = restProjects.filter(hasShots).slice(0, 3).map((p) => p.slug);

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
function ShotStack({ slugs, ring = "ring-lime" }: { slugs: string[]; ring?: string }) {
  return (
    <span aria-hidden className="flex -space-x-3">
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
function BrowserBar({ host, className }: { host: string; className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-8 shrink-0 items-center gap-2 px-2.5 sm:h-10 sm:px-3.5", className)}>
      <span className="flex gap-1">
        <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
        <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
        <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
      </span>
      <span className="mx-auto flex h-5 min-w-0 max-w-[78%] flex-1 items-center justify-center gap-1 rounded-full bg-foreground/[0.07] px-2 text-[10px] font-semibold text-foreground/65 sm:h-7 sm:max-w-[64%] sm:gap-1.5 sm:px-3 sm:text-xs">
        <Lock className="size-2.5 shrink-0 sm:size-3" />
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
}: {
  slug: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
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
          <Image src={mobileShot(slug)} alt={alt} fill sizes={sizes} quality={70} className="object-cover object-top" />
        </span>
      </div>
    </div>
  );
}

/**
 * Pantalla de marca para un sitio que aún no tiene captura: barra de
 * navegador, el nombre en rótulo grande y el estado "en línea". Nunca se
 * pinta una imagen rota.
 */
function LiveScreen({ project, tone, label, cta }: { project: Project; tone: LiveTone; label: string; cta: string }) {
  const longest = Math.max(...project.name.split(/\s+/).map((w) => w.length));
  // El rótulo llena el ancho sin partir palabras: se ajusta a la más larga.
  const size = `min(20cqi, ${(100 / (longest * 0.72)).toFixed(2)}cqi)`;

  return (
    <div className={cn("absolute inset-0 flex flex-col", TONE_SURFACE[tone])}>
      <BrowserBar host={hostname(project.url)} className="border-b border-foreground/10" />
      <div className="relative flex flex-1 flex-col justify-start gap-3 overflow-hidden p-3 pt-3.5 [container-type:inline-size] sm:justify-between sm:gap-2 sm:p-6">
        <span
          aria-hidden
          className={cn(
            "dot-cluster pointer-events-none absolute -right-2 -top-2 h-24 w-24 [mask-image:radial-gradient(circle_at_80%_20%,black,transparent_70%)] sm:h-36 sm:w-44",
            tone === "lime" ? "opacity-60 [filter:brightness(0.55)]" : "opacity-80"
          )}
        />
        <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground/10 px-2 py-1 text-[10px] font-bold text-foreground sm:px-2.5 sm:text-xs">
          <LiveDot className={tone === "lime" || tone === "mint" ? "text-forest" : "text-lime"} />
          {label}
        </span>
        <span
          className={cn("display-xl relative my-auto block leading-[0.86] sm:my-0", TONE_NAME[tone])}
          style={{ fontSize: size }}
        >
          {project.name}
        </span>
        <span className="relative hidden w-fit items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-xs font-semibold text-background sm:inline-flex">
          {cta}
          <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

/** Ficha de proyecto del catálogo: captura (o pantalla en vivo) + nombre. */
function ProjectTile({
  project,
  isNew,
  linkRef,
}: {
  project: Project;
  isNew: boolean;
  linkRef?: (node: HTMLAnchorElement | null) => void;
}) {
  const { t } = useLanguage();
  const desc = t.projects.descs[project.slug] ?? project.desc;
  const host = hostname(project.url);
  const tone = toneBySlug.get(project.slug);

  return (
    <a
      ref={linkRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-pop group flex h-full flex-col p-1.5 transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:shadow-float sm:p-2.5"
    >
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-inner bg-mint md:aspect-[1440/1000]"
        style={{ "--notch-bg": "var(--card)" } as CSSProperties}
      >
        {hasShots(project) ? (
          <>
            <Image
              src={mobileShot(project.slug)}
              alt={`${project.name} — versión móvil del sitio`}
              fill
              sizes="(max-width: 767px) 50vw, 1px"
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
          </>
        ) : (
          <LiveScreen
            project={project}
            tone={tone ?? "ink"}
            label={t.projects.live}
            cta={t.projects.visitSite}
          />
        )}
        <span className="notch notch-br">
          <span className="grid size-9 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:rotate-45 sm:size-11">
            <ArrowUpRight aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1.5 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-3 sm:pb-2.5 sm:pt-4">
        <div className="min-w-0">
          <h3 className="display-title text-[1.0625rem] leading-[1.08] text-foreground sm:text-[1.5rem]">
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm">
            {desc || host}
          </p>
        </div>
        {isNew ? (
          <span className="inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full bg-lime-soft px-2 text-[11px] font-bold text-ink sm:h-8 sm:px-3 sm:text-xs">
            <Sparkle aria-hidden className="h-3 w-3 fill-lime-deep text-lime-deep" />
            {t.projects.newBadge}
          </span>
        ) : (
          <span className="hidden max-w-[45%] shrink-0 truncate rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:inline">
            {host}
          </span>
        )}
      </div>
    </a>
  );
}

/** Tarjeta grande: el lanzamiento destacado en escritorio y en teléfono. */
function FeaturedProject({ project }: { project: Project }) {
  const { t } = useLanguage();
  const [lead, ...tail] = project.name.split(" ");
  const desc = t.projects.descs[project.slug] ?? project.desc;
  const host = hostname(project.url);

  return (
    <article className="panel panel-forest relative grid items-center gap-8 overflow-hidden p-4 pt-[4.25rem] sm:p-7 sm:pt-20 lg:grid-cols-12 lg:gap-6 lg:p-10 lg:pt-10">
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

      <div className="relative z-[1] flex flex-col items-start gap-5 lg:col-span-5 lg:gap-6 lg:pt-16">
        <h3 className="text-white">
          <span className="display-xl block text-[clamp(4.25rem,10.5vw,9.5rem)]">{lead}</span>
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
          <span className="inline-flex h-9 items-center rounded-full bg-white/10 px-3.5 text-sm font-semibold text-white/85">
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

      {/* Dispositivos: navegador de escritorio y el teléfono encima. */}
      <div className="relative lg:col-span-7">
        <div className="relative pb-12 pl-[17%] sm:pb-16 lg:pb-10 lg:pl-[13%]">
          <div className="surface-white rounded-card p-1.5 shadow-float sm:p-2">
            <BrowserBar host={host} />
            <div className="relative aspect-[1440/1000] overflow-hidden rounded-inner bg-mint">
              <Image
                src={desktopShot(project.slug)}
                alt={`${project.name} — captura del sitio en escritorio`}
                fill
                sizes="(min-width: 1024px) 50vw, 86vw"
                quality={75}
                className="object-cover object-top"
              />
            </div>
          </div>
          <PhoneMock
            slug={project.slug}
            alt={`${project.name} — captura del sitio en móvil`}
            sizes="(min-width: 1024px) 15rem, 36vw"
            className="absolute bottom-0 left-0 w-[34%] max-w-[15rem] lg:w-[30%]"
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

/** Casos de estudio: pestañas en píldora, filas tipo app y el teléfono. */
function CaseStudies() {
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

  return (
    <div className="panel relative grid gap-5 p-4 shadow-soft sm:gap-6 sm:p-7 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:p-10">
      <div className="flex flex-col gap-2 px-1 pt-1 sm:px-0 sm:pt-0 lg:col-span-7">
        <h3 className="display-title text-[clamp(2rem,3.4vw,3.25rem)] text-foreground">
          {t.projects.casesTitle}
        </h3>
        <p className="max-w-xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-base">
          {t.projects.casesSubtitle}
        </p>
      </div>

      <div
        role="tablist"
        aria-label={t.projects.casesTitle}
        onKeyDown={onKeyDown}
        className="-mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:col-span-7 lg:row-start-2 [&::-webkit-scrollbar]:hidden"
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

      {/* Escenario lima: el teléfono sube desde el borde inferior. */}
      <div className="panel-lime relative h-[20rem] overflow-hidden rounded-card sm:h-[24rem] lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:h-auto lg:min-h-[34rem]">
        <span
          aria-hidden
          className="dot-cluster pointer-events-none absolute bottom-4 left-4 h-28 w-32 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_20%_80%,black,transparent_72%)] sm:h-36 sm:w-48 lg:bottom-auto lg:top-4 lg:[mask-image:radial-gradient(circle_at_20%_20%,black,transparent_72%)]"
        />
        <svg
          aria-hidden
          viewBox="0 0 400 140"
          className="pointer-events-none absolute left-1/2 top-[30%] w-[118%] -translate-x-1/2 text-ink/25"
        >
          <ellipse cx="200" cy="70" rx="190" ry="44" fill="none" stroke="currentColor" strokeWidth="1.25" transform="rotate(-10 200 70)" />
        </svg>
        <span className="absolute left-4 top-4 z-[2] inline-flex h-9 max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-white/75 px-3.5 text-sm font-semibold text-ink lg:left-auto lg:right-5 lg:top-5">
          <LiveDot className="text-forest" />
          <span className="truncate">{hostname(project.url)}</span>
        </span>
        <Sparkle aria-hidden className="float-y absolute bottom-6 left-[18%] z-[2] h-7 w-7 fill-ink text-ink lg:hidden" />
        <div
          key={slug}
          className="absolute inset-x-0 bottom-0 flex justify-end pr-[9%] duration-700 animate-in fade-in-0 slide-in-from-bottom-6 sm:justify-center sm:pr-0"
        >
          <PhoneMock
            slug={slug}
            alt={`${project.name} — captura del sitio en móvil`}
            sizes="(min-width: 1024px) 17rem, 12rem"
            className="w-[11.5rem] translate-y-[33%] sm:w-[14rem] sm:translate-y-[24%] lg:w-[17rem] lg:translate-y-[16%]"
          />
        </div>
      </div>

      <div
        role="tabpanel"
        id="case-panel"
        aria-labelledby={`case-tab-${slug}`}
        className="flex min-w-0 flex-col gap-4 lg:col-span-7 lg:row-start-3"
      >
        <div key={slug} className="flex flex-col gap-4 duration-500 animate-in fade-in-0 slide-in-from-bottom-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 sm:px-0">
            <p className="display-title text-[1.6rem] text-foreground sm:text-[2rem]">{project.name}</p>
            {desc && <p className="text-sm font-semibold text-muted-foreground">{desc}</p>}
          </div>
          <dl className="rounded-card bg-mint p-1.5 sm:p-2">
            {CASE_FIELDS.map(({ key, Icon }, index) => (
              <div
                key={key}
                className={cn(
                  "flex items-start gap-3.5 rounded-inner px-3 py-3.5 sm:gap-4 sm:px-4 sm:py-4",
                  index === 1 && "bg-white"
                )}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-forest">
                    {t.projects.caseLabels[key]}
                  </dt>
                  <dd className="mt-1 text-pretty text-[0.95rem] leading-relaxed text-foreground/85 sm:text-base">
                    {projectCase[key]}
                  </dd>
                </div>
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
  );
}

/**
 * Portafolio — catálogo tipo app.
 *
 * Cabecera en bento (titular + contador lima), el lanzamiento destacado en
 * un panel bosque con navegador y teléfono, la retícula de fichas con los
 * nueve sitios recientes primero (el resto detrás de "Mostrar más") y los
 * cuatro casos de estudio en pestañas. En teléfono las fichas van a dos
 * columnas con la captura móvil, como una tienda.
 */
export function ProjectsShowcase() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [focusRest, setFocusRest] = useState(false);
  const firstRestRef = useRef<HTMLAnchorElement | null>(null);

  // Al desplegar desde la ficha "Mostrar más", el foco pasa al primer
  // proyecto nuevo para que el teclado no se quede en un botón que ya no está.
  useEffect(() => {
    if (!focusRest || !showAll) return;
    firstRestRef.current?.focus({ preventScroll: true });
    setFocusRest(false);
  }, [focusRest, showAll]);

  const gridProjects = showAll ? [...recentGrid, ...restProjects] : recentGrid;
  const filters = [
    { label: t.projects.recent, count: RECENT_COUNT, pressed: !showAll, all: false },
    { label: t.projects.all, count: projects.length, pressed: showAll, all: true },
  ];

  return (
    <section
      id="projects"
      aria-label={t.projects.eyebrow}
      className="relative flex scroll-mt-[calc(var(--header-h)+1rem)] flex-col gap-gutter"
    >
      {/* Legacy anchor: keep older internal links (#portafolio) landing here. */}
      <span id="portafolio" className="absolute -top-24" aria-hidden />

      {/* Cabecera en bento: titular + contador. */}
      <div className="grid gap-gutter lg:grid-cols-12">
        <div data-fx="panel" className="min-w-0 lg:col-span-7">
          <div className="panel relative flex h-full flex-col justify-between gap-8 overflow-hidden p-5 shadow-soft sm:p-7 lg:p-10">
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
            desde el borde inferior, como las tarjetas de las referencias. */}
        <div data-fx="right" className="min-w-0 lg:col-span-5" style={fx(120)}>
          <div className="panel panel-lime relative flex h-full min-h-[19rem] overflow-hidden p-5 sm:min-h-[22rem] sm:p-7 lg:p-8">
            <span
              aria-hidden
              className="dot-cluster pointer-events-none absolute -bottom-4 left-[38%] h-40 w-48 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_50%_70%,black,transparent_70%)]"
            />
            <svg
              aria-hidden
              viewBox="0 0 400 140"
              className="pointer-events-none absolute right-[-18%] top-[18%] w-[80%] text-ink/25"
            >
              <ellipse cx="200" cy="70" rx="190" ry="44" fill="none" stroke="currentColor" strokeWidth="1.25" transform="rotate(-12 200 70)" />
            </svg>
            <div className="relative z-[1] flex w-[56%] flex-col justify-between gap-6 lg:w-[54%]">
              <span className="eyebrow w-fit bg-white/60 pl-3">
                <LiveDot className="text-forest" />
                {t.projects.live}
              </span>
              <div>
                <p className="display-xl text-[clamp(5.5rem,9vw,8.5rem)] leading-[0.8] text-ink">
                  {projects.length}
                </p>
                <p className="mt-3 max-w-[14rem] text-[0.95rem] font-semibold leading-snug text-ink">
                  {t.projects.countLabel}
                </p>
              </div>
              <ShotStack slugs={COUNT_AVATARS} />
            </div>
            <PhoneMock
              slug={COUNT_PHONE}
              alt=""
              sizes="(min-width: 1024px) 13rem, 9.5rem"
              className="absolute bottom-0 right-4 w-[40%] max-w-[13rem] translate-y-[18%] sm:right-8 lg:right-5 lg:w-[38%] xl:right-7"
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

      {/* Catálogo: recientes primero; el resto detrás de "Mostrar más". */}
      <ul role="list" className="grid grid-cols-2 gap-2.5 sm:gap-gutter lg:grid-cols-3">
        {gridProjects.map((project, index) => {
          const isRest = index >= recentGrid.length;
          return (
            <li
              key={project.slug}
              data-fx="up"
              className="min-w-0"
              style={fx(((isRest ? index - recentGrid.length : index) % 3) * 80)}
            >
              <ProjectTile
                project={project}
                isNew={!isRest}
                linkRef={
                  index === recentGrid.length
                    ? (node) => {
                        firstRestRef.current = node;
                      }
                    : undefined
                }
              />
            </li>
          );
        })}

        {!showAll && restProjects.length > 0 ? (
          <li data-fx="pop" className="col-span-2 min-w-0 lg:col-span-1" style={fx(160)}>
            <div className="panel-lime relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-card p-5 sm:p-7">
              <span
                aria-hidden
                className="dot-cluster pointer-events-none absolute -right-2 -top-2 h-36 w-44 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_85%_15%,black,transparent_70%)]"
              />
              <ShotStack slugs={MORE_AVATARS} />
              <div className="relative">
                <p className="display-xl text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.8] text-ink">
                  +{restProjects.length}
                </p>
                <p className="mt-2 text-base font-semibold text-ink">{t.projects.moreLabel}</p>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  setShowAll(true);
                  setFocusRest(true);
                }}
                className="relative w-full justify-between pr-2.5"
              >
                {t.projects.showMore}
                <span aria-hidden className="grid size-9 place-items-center rounded-full bg-lime text-ink">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </li>
        ) : (
          <li data-fx="pop" className="col-span-1 min-w-0 lg:col-span-3">
            {/* Cierre del catálogo: toda la ficha lleva al configurador. */}
            <Link
              href="#precios"
              className="panel-lime group relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-card p-4 transition-transform duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 sm:p-7 lg:flex-row lg:items-center lg:p-8"
            >
              <span
                aria-hidden
                className="dot-cluster pointer-events-none absolute -right-2 bottom-16 h-24 w-28 opacity-90 [filter:brightness(0.62)] [mask-image:radial-gradient(circle_at_80%_50%,black,transparent_70%)] lg:bottom-auto lg:top-[-0.5rem] lg:h-32 lg:w-48 lg:[mask-image:radial-gradient(circle_at_85%_15%,black,transparent_70%)]"
              />
              <span className="display-title relative max-w-[18ch] text-[clamp(1.35rem,3vw,2.75rem)] text-ink">
                {t.projects.nextTitle}
              </span>
              <span className="relative flex items-center justify-between gap-3 lg:h-14 lg:rounded-full lg:bg-ink lg:pl-7 lg:pr-2.5 lg:text-lime">
                <span className="text-sm font-bold text-ink sm:text-base lg:text-[0.9375rem] lg:font-semibold lg:text-lime">
                  {t.nav.armaTuWeb}
                </span>
                <span className="btn-arrow size-11 bg-ink text-lime lg:size-9 lg:bg-white lg:text-ink">
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        )}
      </ul>

      <div data-fx="panel" className="min-w-0">
        <CaseStudies />
      </div>
    </section>
  );
}

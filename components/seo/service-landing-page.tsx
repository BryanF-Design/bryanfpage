import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Heart,
  House,
  MessageCircle,
  Sparkle,
} from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { PageFrame } from "@/components/japan/page-frame";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { desktopShot, mobileShot, projects, type Project } from "@/lib/projects";
import {
  BRAND_NAME,
  SITE_URL,
  WHATSAPP_URL,
  getRelatedServicePages,
  type ServicePage,
} from "@/lib/seo/service-pages";
import { cn } from "@/lib/utils";

interface ServiceLandingPageProps {
  page: ServicePage;
}

// Las landings SEO son español-primero (así se indexan); la banda usa las
// mismas palabras del sitio sin arrastrar el diccionario al servidor.
const MARQUEE_WORDS = ["Diseño", "Código", "SEO", "Performance", "E-commerce", "Branding"];

/** El recorte de los paneles blancos dentro del marco (el hueco es blanco, no lienzo). */
const NOTCH_ON_WHITE = { "--notch-bg": "0 0% 100%" } as CSSProperties;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function buildServiceSchema(page: ServicePage) {
  const url = `${SITE_URL}/${page.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.serviceType,
    serviceType: page.serviceType,
    description: page.metaDescription,
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    provider: {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/img/logotipo-blanco.png`,
    },
    url,
  };
}

function buildBreadcrumbSchema(page: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.serviceType,
        item: `${SITE_URL}/${page.slug}`,
      },
    ],
  };
}

function buildFaqSchema(page: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Parte el titular como el hero del home: la primera línea en itálica gruesa
 * (el servicio, si el título empieza con él) y el resto en rótulo. El h1
 * conserva el texto completo para el rastreador.
 */
function splitTitle(title: string, serviceType: string): [string, string] {
  if (title.toLowerCase().startsWith(serviceType.toLowerCase())) {
    return [title.slice(0, serviceType.length), title.slice(serviceType.length).trim()];
  }
  const [first, ...rest] = title.split(" ");
  return [first, rest.join(" ")];
}

/** Los casos de la página que existen en el portafolio (con su captura). */
function findCases(names: string[]) {
  return names.map((name) => ({
    name,
    project: projects.find((p) => p.name === name && p.shots !== false) as Project | undefined,
  }));
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fx(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

function hd(ms: number) {
  return { "--hd": `${ms}ms` } as CSSProperties;
}

/**
 * Cabecera de sección: chip numerado y titular en Archivo.
 * (`suppressHydrationWarning` en los `data-fx`: el observer del layout marca
 * `data-fx-in` antes de hidratar lo que ya está en pantalla.)
 */
function LandingHeading({
  index,
  eyebrow,
  title,
  id,
  size = "lg",
  className,
}: {
  index: number;
  eyebrow: string;
  title: ReactNode;
  id?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-4 md:gap-5", className)}>
      <span className="eyebrow">
        <b>{pad(index)}</b>
        {eyebrow}
      </span>
      <div suppressHydrationWarning data-fx="up" className="max-w-full">
        <h2
          id={id}
          className={cn(
            "display-title text-balance text-foreground",
            size === "lg"
              ? "text-[clamp(2.15rem,3.9vw,3.6rem)]"
              : "text-[clamp(2rem,3vw,2.75rem)]"
          )}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

/** Órbita fina (como la del hero) alrededor de un personaje. */
function Orbit({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 140" className={cn("pointer-events-none", className)}>
      <ellipse
        cx="200"
        cy="70"
        rx="190"
        ry="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        transform="rotate(-9 200 70)"
      />
    </svg>
  );
}

export function ServiceLandingPage({ page }: ServiceLandingPageProps) {
  const relatedPages = getRelatedServicePages(page);
  const [titleLead, titleRest] = splitTitle(page.title, page.serviceType);
  const cases = findCases(page.relatedCases);
  const shownCases = cases.filter((c) => c.project);
  const featured = shownCases[0]?.project;

  return (
    <>
      <JsonLd data={buildServiceSchema(page)} />
      <JsonLd data={buildBreadcrumbSchema(page)} />
      <JsonLd data={buildFaqSchema(page)} />
      <SpanishPageLanguage />

      <PageFrame />
      <ScrollProgress />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main" data-language="es-only">
        {/* ——— Hero: marco blanco con el titular partido y un panel lima del
            que sale Bryan, con el caso de referencia como tarjeta. ——— */}
        <section
          id="servicio"
          aria-labelledby="landing-title"
          className="panel relative overflow-visible p-4 shadow-soft sm:p-6 lg:p-10"
        >
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="relative flex min-w-0 flex-col items-start gap-5 pt-1 lg:col-span-6 lg:gap-6 lg:pt-0">
              <nav
                aria-label="Breadcrumb"
                className="hero-in hero-in-fade inline-flex max-w-full items-center gap-1 rounded-full bg-ink/[0.05] p-1 pr-4 text-sm font-semibold"
                style={hd(40)}
              >
                <Link
                  href="/"
                  className="inline-flex h-10 min-w-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-ink shadow-[0_4px_14px_-8px_hsl(var(--ink)/0.45)] transition-colors hover:bg-lime"
                >
                  <House aria-hidden className="h-3.5 w-3.5" />
                  Inicio
                </Link>
                <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-ink/35" />
                <span aria-current="page" className="truncate text-ink/70">
                  {page.serviceType}
                </span>
              </nav>

              <span className="hero-in hero-in-fade eyebrow pl-3 sm:hidden" style={hd(80)}>
                <span aria-hidden className="size-2 rounded-full bg-lime-deep" />
                {page.eyebrow}
              </span>

              <h1 id="landing-title" className="hero-in hero-in-up text-ink" style={hd(100)}>
                <span className="display-italic block text-[clamp(2.3rem,4.6vw,4.5rem)] leading-[1.02] text-forest">
                  {titleLead}
                  <Sparkle
                    aria-hidden
                    className="float-y relative -top-[0.55em] ml-1 inline-block size-[0.5em] fill-lime text-lime-deep"
                  />
                </span>{" "}
                <span className="display-title mt-1 block text-balance text-[clamp(2.1rem,3.9vw,3.9rem)] leading-[1.02]">
                  {titleRest}
                </span>
              </h1>

              <p
                className="hero-in hero-in-fade max-w-xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg"
                style={hd(180)}
              >
                {page.intro}
              </p>

              <div
                className="hero-in hero-in-up flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row"
                style={hd(240)}
              >
                <Button asChild size="lg" variant="ink" className="pr-2.5">
                  <TrackedWhatsAppLink href={WHATSAPP_URL} service={page.slug}>
                    <MessageCircle aria-hidden className="h-[1.1rem] w-[1.1rem] text-lime" />
                    Cotizar por WhatsApp
                    <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                  </TrackedWhatsAppLink>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/#projects">
                    Ver proyectos
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {shownCases.length > 0 && (
                <div
                  className="hero-in hero-in-fade flex items-center gap-3 rounded-full bg-ink/[0.05] py-1.5 pl-1.5 pr-4 lg:mt-auto"
                  style={hd(300)}
                >
                  <span className="flex -space-x-3">
                    {shownCases.map(({ project }) => (
                      <span
                        key={project!.slug}
                        className="relative size-10 overflow-hidden rounded-full bg-white ring-[3px] ring-white"
                      >
                        <Image
                          src={mobileShot(project!.slug)}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover object-top"
                        />
                      </span>
                    ))}
                  </span>
                  <span className="text-sm font-semibold leading-tight text-ink">
                    +100 proyectos lanzados
                  </span>
                  <Heart aria-hidden className="h-4 w-4 fill-ink text-ink" />
                </div>
              )}
            </div>

            {/* Panel lima: Bryan sale por arriba; el recorte de los costados
                y la base lo hace el clip, así la cabeza cruza el canto. */}
            <div
              className="hero-in hero-in-up relative mt-14 min-w-0 sm:mt-20 lg:col-span-6 lg:mt-0 lg:self-end"
              style={hd(160)}
            >
              <Orbit className="float-y absolute -top-11 left-[3%] w-[94%] text-ink/25 sm:-top-16 sm:left-[14%] sm:w-[72%] lg:-top-24 lg:left-[24%] lg:w-[80%]" />
              <div className="panel-lime relative h-[23rem] rounded-[calc(var(--r-panel)-0.5rem)] sm:h-[30rem] lg:h-[28rem]">
                <span className="notch notch-tl hidden sm:flex" style={NOTCH_ON_WHITE}>
                  <span className="eyebrow pl-3">
                    <span aria-hidden className="size-2 rounded-full bg-lime-deep" />
                    {page.eyebrow}
                  </span>
                </span>

                {/* El clip deja salir a Bryan solo por arriba del panel. */}
                <div
                  aria-hidden
                  className="absolute inset-0 [clip-path:inset(-60%_0_0_0_round_0_0_calc(var(--r-panel)-0.5rem)_calc(var(--r-panel)-0.5rem))]"
                >
                  <Image
                    src="/img/brand/bryan-cutout.webp"
                    alt=""
                    width={623}
                    height={558}
                    priority
                    sizes="(min-width: 1024px) 36rem, 34rem"
                    className="absolute bottom-0 left-1/2 h-[calc(100%+2.75rem)] w-auto max-w-none -translate-x-[45%] sm:left-auto sm:right-[-8%] sm:h-[calc(100%+3.5rem)] sm:translate-x-0 lg:right-[-12%] lg:h-[calc(100%+5rem)]"
                  />
                </div>
                <Sparkle
                  aria-hidden
                  className="float-y absolute right-5 top-5 h-8 w-8 fill-ink text-ink lg:right-7 lg:top-7"
                />

                {featured && (
                  <a
                    href={featured.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group card-pop absolute inset-x-3 bottom-3 z-10 flex gap-3 p-2.5 transition-transform duration-300 hover:-translate-y-1 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[15rem] sm:flex-col lg:bottom-5 lg:left-5"
                  >
                    <span className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-inner bg-mint sm:w-full">
                      <Image
                        src={desktopShot(featured.slug)}
                        alt={`${featured.name} — captura del sitio`}
                        fill
                        sizes="(min-width: 640px) 15rem, 7rem"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:px-1 sm:pb-0.5">
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-ink/55">Caso de referencia</span>
                        <span className="block truncate text-base font-bold text-ink">{featured.name}</span>
                        {featured.desc && (
                          <span className="block truncate text-xs text-ink/60">{featured.desc}</span>
                        )}
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-lime">
                        <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ——— Problemas: cabecera con Lumina dudando y la lista estilo app. ——— */}
        <section
          id="problemas"
          aria-labelledby="problemas-title"
          className="grid gap-gutter lg:grid-cols-12"
        >
          <div suppressHydrationWarning data-fx="left" className="min-w-0 lg:col-span-5">
            <div className="panel flex h-full flex-col overflow-hidden px-5 pt-6 shadow-soft sm:px-7 sm:pt-7 lg:px-10 lg:pt-10">
              <LandingHeading
                id="problemas-title"
                index={1}
                eyebrow="Problemas reales"
                title="Lo que esta página ayuda a resolver"
              />
              {/* Lumina duda sobre un disco lima, con su globo de diálogo. */}
              <div className="relative mt-4 flex justify-end lg:mt-auto lg:pt-6">
                <div className="relative mr-1 w-[9.5rem] sm:w-[11.5rem] lg:mr-2 lg:w-[14rem]">
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full bg-lime"
                  />
                  <span className="absolute right-[86%] top-[16%] z-[1] inline-flex items-center gap-2 whitespace-nowrap rounded-full rounded-br-md bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-pop">
                    <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime" />
                    ¿Te suena?
                  </span>
                  <Image
                    src="/img/brand/lumina-duda.webp"
                    alt=""
                    aria-hidden
                    width={900}
                    height={968}
                    sizes="(min-width: 1024px) 14rem, 12rem"
                    className="relative h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div suppressHydrationWarning data-fx="right" className="min-w-0 lg:col-span-7" style={fx(90)}>
            <div className="panel flex h-full flex-col gap-1 p-2 shadow-soft sm:p-3">
              <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-3 sm:px-4">
                <span className="text-sm font-semibold text-muted-foreground">Situaciones frecuentes</span>
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2.5 text-xs font-bold text-lime">
                  {page.problems.length}
                </span>
              </div>
              <ul className="flex flex-1 flex-col gap-1.5">
                {page.problems.map((problem, i) => (
                  <li
                    key={problem}
                    className="flex flex-1 items-center gap-4 rounded-card bg-mint px-4 py-5 ring-1 ring-ink/[0.04] sm:gap-5 sm:px-5 lg:px-6"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-[0.95rem] font-bold text-lime">
                      {pad(i + 1)}
                    </span>
                    <p className="min-w-0 flex-1 text-pretty text-base font-semibold leading-snug text-ink sm:text-lg">
                      {problem}
                    </p>
                    <span
                      aria-hidden
                      className="hidden size-10 shrink-0 place-items-center rounded-full bg-lime text-ink sm:grid"
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ——— Solución en bosque + entregables en mosaicos claros. ——— */}
        <section id="solucion" aria-labelledby="solucion-title" className="grid gap-gutter lg:grid-cols-12">
          <div suppressHydrationWarning data-fx="left" className="min-w-0 lg:col-span-7">
            <div className="panel panel-forest relative flex h-full flex-col overflow-hidden p-5 pb-20 sm:p-7 sm:pb-24 lg:p-10 lg:pb-28">
              <div
                aria-hidden
                className="dot-cluster absolute -right-2 -top-2 h-28 w-40 opacity-40 [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)] lg:h-44 lg:w-64 lg:opacity-50"
              />
              <LandingHeading
                id="solucion-title"
                index={2}
                eyebrow="Solución"
                title="Una ejecución completa, no una pieza suelta"
                className="relative"
              />
              <p className="relative mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                {page.solution}
              </p>
              <p className="relative mt-8 font-serif text-[clamp(1.75rem,3vw,2.5rem)] italic leading-none text-lime lg:mt-auto lg:pt-10">
                Diseño, código y estrategia.
              </p>

              <span className="notch notch-br">
                <TrackedWhatsAppLink
                  href={WHATSAPP_URL}
                  service={page.slug}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-5 pr-1.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:h-14 sm:pl-6"
                >
                  Cotizar este servicio
                  <span aria-hidden className="btn-arrow size-9 bg-lime text-ink sm:size-11">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </TrackedWhatsAppLink>
              </span>
            </div>
          </div>

          <div suppressHydrationWarning data-fx="right" className="min-w-0 lg:col-span-5" style={fx(90)}>
            <div className="panel flex h-full flex-col p-5 shadow-soft sm:p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Entregables</p>
                  <h3 className="display-title mt-1 text-[clamp(1.75rem,2.4vw,2.25rem)] text-ink">
                    Lo que recibes
                  </h3>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lime font-display text-lg font-bold text-ink">
                  {page.deliverables.length}
                </span>
              </div>
              <ul className="mt-6 grid flex-1 gap-2.5 sm:grid-cols-2">
                {page.deliverables.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 rounded-inner bg-mint p-3.5 pr-4 ring-1 ring-ink/[0.04] transition-transform duration-300 hover:-translate-y-1 sm:flex-col sm:items-stretch sm:justify-between sm:gap-5 sm:p-5"
                  >
                    <span className="flex shrink-0 items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-full bg-ink text-lime">
                        <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                      <span className="hidden text-xs font-bold text-ink/40 sm:inline">{pad(i + 1)}</span>
                    </span>
                    <p className="text-[0.975rem] font-semibold leading-snug text-ink">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Cinta de la hoja: la misma que en el home. */}
        <MarqueeBand words={MARQUEE_WORDS} angle={-2} />

        {/* ——— Proceso: pasos como tarjetas de app; el primero, activo. ——— */}
        <section
          id="proceso"
          aria-labelledby="proceso-title"
          className="panel p-5 shadow-soft sm:p-7 lg:p-10"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <LandingHeading
              id="proceso-title"
              index={3}
              eyebrow="Proceso"
              title="Cómo avanzamos sin improvisar"
            />
            <div aria-hidden className="hidden items-center gap-1.5 pb-3 lg:flex">
              {page.process.map((step, i) => (
                <span
                  key={step}
                  className={cn("h-2.5 rounded-full", i === 0 ? "w-10 bg-ink" : "w-2.5 bg-ink/20")}
                />
              ))}
            </div>
          </div>

          <ol className="mt-8 grid gap-2.5 md:grid-cols-2 lg:mt-10 lg:grid-cols-4">
            {page.process.map((step, index) => (
              <li key={step} suppressHydrationWarning data-fx="up" style={fx(index * 80)} className="min-w-0">
                <div
                  className={cn(
                    "flex h-full items-center gap-4 rounded-card p-4 md:flex-col md:items-stretch md:gap-8 md:p-6",
                    index === 0 ? "bg-lime" : "bg-mint ring-1 ring-ink/[0.04]"
                  )}
                >
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-base font-bold text-lime">
                      {pad(index + 1)}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "hidden h-0 flex-1 border-t-2 border-dashed md:block",
                        index === 0 ? "border-ink/30" : "border-ink/15"
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "hidden size-8 shrink-0 place-items-center rounded-full md:grid",
                        index === 0 ? "bg-white text-ink" : "bg-white text-ink/50"
                      )}
                    >
                      {index === page.process.length - 1 ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                  <p className="text-pretty text-base font-semibold leading-snug text-ink md:text-[1.0625rem]">
                    {step}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ——— Diferenciadores: el único panel oscuro de la página. ——— */}
        <section
          id="diferenciadores"
          aria-labelledby="diferenciadores-title"
          className="panel panel-ink relative overflow-hidden p-5 sm:p-7 lg:p-10"
        >
          <div aria-hidden className="mesh-glow-a opacity-70" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col justify-between gap-8 lg:col-span-5">
              <LandingHeading
                id="diferenciadores-title"
                index={4}
                eyebrow="Diferenciadores"
                title={
                  <>
                    Por qué construirlo con <span className="text-lime">{BRAND_NAME}</span>
                  </>
                }
              />
              <div className="flex items-center gap-3 self-start rounded-full bg-white/[0.07] py-1.5 pl-1.5 pr-5 ring-1 ring-white/10">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-lime">
                  <Image
                    src="/img/brand/bryan-cutout.webp"
                    alt=""
                    width={623}
                    height={558}
                    sizes="96px"
                    className="absolute left-[-30%] top-[-2%] w-[170%] max-w-none"
                  />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-bold text-white">Bryan F.</span>
                  <span className="block text-xs text-white/65">Trabajas directo con quien diseña y programa</span>
                </span>
              </div>
            </div>

            <ul className="grid gap-2.5 sm:grid-cols-2 lg:col-span-7">
              {page.differentiators.map((item, i) => (
                <li key={item} suppressHydrationWarning data-fx="pop" style={fx(i * 80)} className="min-w-0">
                  <div
                    className={cn(
                      "flex h-full items-center gap-4 rounded-card p-4 sm:min-h-[11rem] sm:flex-col sm:items-stretch sm:justify-between sm:gap-6 sm:p-6",
                      i === 0 ? "bg-lime text-ink" : "bg-white/[0.06] text-white ring-1 ring-white/10"
                    )}
                  >
                    <span className="flex shrink-0 items-center justify-between">
                      <span
                        className={cn(
                          "grid size-10 place-items-center rounded-full",
                          i === 0 ? "bg-ink text-lime" : "bg-lime text-ink"
                        )}
                      >
                        <Sparkle aria-hidden className="h-4 w-4 fill-current" />
                      </span>
                      <span className={cn("hidden text-sm font-bold sm:inline", i === 0 ? "text-ink/50" : "text-white/40")}>
                        {pad(i + 1)}
                      </span>
                    </span>
                    <p className="text-pretty text-base font-semibold leading-snug sm:text-lg">{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— Preguntas frecuentes: visibles siempre (coinciden con el schema). ——— */}
        <section id="preguntas" aria-labelledby="preguntas-title" className="grid gap-gutter lg:grid-cols-12">
          <div suppressHydrationWarning data-fx="left" className="min-w-0 lg:col-span-5">
            <div className="panel relative flex h-full flex-col gap-8 overflow-hidden p-5 shadow-soft sm:p-7 lg:p-10">
              <div
                aria-hidden
                className="dot-cluster absolute -right-3 -top-3 h-36 w-48 opacity-60 [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
              />
              <LandingHeading
                id="preguntas-title"
                index={5}
                eyebrow="Preguntas frecuentes"
                title="Respuestas antes de cotizar"
                className="relative"
              />
              <div className="panel-ink relative mt-auto flex flex-col gap-4 rounded-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink">
                    <MessageCircle aria-hidden className="h-5 w-5" />
                  </span>
                  <p className="text-[0.975rem] font-semibold leading-snug text-white">
                    ¿Tu duda no está aquí? Escríbenos y lo platicamos.
                  </p>
                </div>
                <Button asChild className="w-full justify-between pl-6 pr-2">
                  <TrackedWhatsAppLink href={WHATSAPP_URL} service={page.slug}>
                    Preguntar por WhatsApp
                    <ButtonArrow tone="ink" className="-mr-0.5" />
                  </TrackedWhatsAppLink>
                </Button>
              </div>
            </div>
          </div>

          <div suppressHydrationWarning data-fx="right" className="min-w-0 lg:col-span-7" style={fx(90)}>
            <div className="panel flex h-full flex-col gap-1.5 p-2 shadow-soft sm:p-3">
              {page.faqs.map((faq, i) => (
                <article
                  key={faq.question}
                  className="flex flex-1 gap-4 rounded-card bg-mint p-5 ring-1 ring-ink/[0.04] sm:gap-5 sm:p-6"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-ink/60 ring-1 ring-ink/10">
                    {pad(i + 1)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-pretty font-display text-[1.2rem] font-bold leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-pretty text-[0.975rem] leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Casos reales con captura (a lo ancho) y, debajo, la franja
            de servicios relacionados en bosque. ——— */}
        <section id="casos" aria-labelledby="casos-title" suppressHydrationWarning data-fx="up">
          <div className="panel overflow-hidden p-5 shadow-soft sm:p-7 lg:p-10">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
              <LandingHeading
                id="casos-title"
                index={6}
                eyebrow="Casos como referencia"
                title="Evidencia disponible sin inventar métricas"
                className="lg:col-span-7"
              />
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-5 lg:pb-1.5">
                Estos proyectos existen en el portafolio del sitio y sirven como
                referencia visual. No se agregan resultados, rankings ni métricas
                que no estén documentadas.
              </p>
            </div>
            <ul className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:mt-10 [&::-webkit-scrollbar]:hidden">
              {cases.map(({ name, project }, i) => (
                <li key={name} className="w-[80%] shrink-0 snap-start sm:w-auto">
                  {project ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col gap-3 rounded-card bg-mint p-2 ring-1 ring-ink/[0.05] transition-transform duration-300 hover:-translate-y-1 lg:p-2.5"
                    >
                      <span className="relative aspect-[16/11] overflow-hidden rounded-inner bg-white">
                        <Image
                          src={desktopShot(project.slug)}
                          alt={`${project.name} — captura del sitio`}
                          fill
                          sizes="(min-width: 1024px) 28rem, (min-width: 640px) 31vw, 78vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm">
                          {pad(i + 1)}
                        </span>
                      </span>
                      <span className="flex items-center justify-between gap-2 px-2 pb-2 lg:px-3 lg:pb-3">
                        <span className="min-w-0">
                          <span className="block truncate text-lg font-bold text-ink">{project.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {project.desc || new URL(project.url).hostname.replace(/^www\./, "")}
                          </span>
                        </span>
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
                          <ArrowUpRight
                            aria-hidden
                            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                          />
                        </span>
                      </span>
                    </a>
                  ) : (
                    <span className="flex h-full min-h-24 items-center rounded-card bg-mint px-5 font-bold text-ink">
                      {name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <nav aria-labelledby="relacionados-title" suppressHydrationWarning data-fx="up">
          <div className="panel panel-forest relative overflow-hidden p-5 sm:p-7 lg:p-10">
            <Orbit className="absolute -right-24 -top-8 w-[26rem] text-white/15 lg:right-[38%] lg:w-[34rem]" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <LandingHeading
                id="relacionados-title"
                index={7}
                eyebrow="Enlaces relacionados"
                title="Servicios que suelen conectarse"
                size="md"
                className="lg:col-span-4"
              />
              <ul className="grid gap-2 sm:grid-cols-3 sm:gap-2.5 lg:col-span-8">
                {relatedPages.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/${related.slug}`}
                      className="group flex h-full min-h-14 items-center justify-between gap-3 rounded-full bg-white/[0.08] py-2 pl-5 pr-2 font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-lime hover:text-ink sm:min-h-[8.5rem] sm:flex-col-reverse sm:items-start sm:rounded-card sm:p-5"
                    >
                      <span className="text-[1.0625rem] leading-snug sm:font-display sm:text-xl sm:font-bold sm:tracking-[-0.02em]">
                        {related.serviceType}
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink transition-colors group-hover:bg-ink group-hover:text-lime sm:self-end">
                        <ArrowUpRight
                          aria-hidden
                          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* ——— Cierre en lima, como el del home. ——— */}
        <section id="contacto" aria-labelledby="contacto-title" suppressHydrationWarning data-fx="panel">
          <div className="panel panel-lime relative overflow-hidden p-5 sm:p-8 lg:p-12">
            <Orbit className="absolute right-[34%] top-[-3rem] hidden w-[34rem] text-ink/20 lg:block" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="flex flex-col items-start gap-5 lg:col-span-7">
                <span className="eyebrow bg-white/60">
                  <b>{pad(8)}</b>
                  Siguiente paso
                </span>
                <h2
                  id="contacto-title"
                  className="display-xl text-balance text-[clamp(2.75rem,6.2vw,5.75rem)] text-ink"
                >
                  Cuéntanos qué necesitas construir o mejorar
                </h2>
              </div>
              <div className="flex flex-col lg:col-span-5">
                {/* Lumina se asoma por encima de la tarjeta: su sudadera se
                    funde con la tinta y la órbita le rodea la cabeza. */}
                <div aria-hidden className="relative z-0 -mb-8 mr-4 w-[8.5rem] self-end sm:mr-8 sm:w-[10rem] lg:w-[11.5rem]">
                  <Orbit className="float-y absolute left-[-45%] top-[6%] w-[190%] text-ink/25" />
                  <Image
                    src="/img/brand/lumina-normal.webp"
                    alt=""
                    width={900}
                    height={1059}
                    sizes="(min-width: 1024px) 12rem, 9rem"
                    className="relative h-auto w-full"
                  />
                </div>
                <div className="panel-ink relative z-10 flex flex-col gap-6 rounded-card p-5 shadow-float sm:p-7">
                  <Sparkle aria-hidden className="absolute right-5 top-5 h-6 w-6 fill-lime text-lime" />
                  <p className="pr-8 text-pretty text-base leading-relaxed text-white/80 md:text-[1.0625rem]">
                    Te respondemos con una ruta clara: alcance recomendado,
                    prioridades, tiempos aproximados y datos que necesitamos para
                    cotizar sin inflar el proyecto.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Button asChild size="lg" className="w-full justify-between bg-lime pl-6 pr-2.5 text-ink">
                      <TrackedWhatsAppLink href={WHATSAPP_URL} service={page.slug}>
                        Hablar por WhatsApp
                        <ButtonArrow tone="ink" className="-mr-0.5" />
                      </TrackedWhatsAppLink>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full border-white/25 text-white">
                      <Link href="/#precios">Armar cotización</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}

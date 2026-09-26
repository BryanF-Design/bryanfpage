import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Floating3d } from "@/components/three/floating-3d";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { PageFrame } from "@/components/japan/page-frame";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import {
  BRAND_NAME,
  SITE_URL,
  WHATSAPP_URL,
  getRelatedServicePages,
  type ServicePage,
} from "@/lib/seo/service-pages";

interface ServiceLandingPageProps {
  page: ServicePage;
}

// Las landings SEO son español-primero (así se indexan); la banda usa las
// mismas palabras del sitio sin arrastrar el diccionario al servidor.
const MARQUEE_WORDS = ["Diseño", "Código", "SEO", "Performance", "E-commerce", "Branding"];

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

/** Cabecera de sección compartida por todas las landings. */
function LandingHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
  delay?: number;
}) {
  return (
    <Reveal>
      <div className="flex flex-col items-start gap-5">
        <p className="tag-pill pl-4">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </p>
        <div data-fx="up">
          <h2 className="display-xl max-w-2xl text-[clamp(2.6rem,5.5vw,4.75rem)] text-foreground">
            {title}
          </h2>
        </div>
      </div>
    </Reveal>
  );
}

function delay(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

export function ServiceLandingPage({ page }: ServiceLandingPageProps) {
  const relatedPages = getRelatedServicePages(page);

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
        {/* Hero en bento: titular en musgo, enfoque del servicio en tinta. */}
        <section className="grid gap-gutter lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <div className="hero-in hero-in-left panel panel-moss relative overflow-hidden px-6 pb-10 pt-[calc(var(--header-h)+2rem)] md:px-12 md:pb-14 lg:px-14">
            <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-40 [mask-image:radial-gradient(ellipse_at_90%_10%,black,transparent_60%)]" />
            <div className="relative max-w-3xl">
              <nav
                aria-label="Breadcrumb"
                className="mb-8 inline-flex items-center gap-2 rounded-full bg-background/60 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <Link
                  href="/"
                  className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-primary"
                >
                  Inicio
                </Link>
                <span className="text-primary">/</span>
                <span className="text-foreground">{page.serviceType}</span>
              </nav>

              <p className="tag-pill mb-5 pl-4">
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {page.eyebrow}
              </p>
              <h1 className="display-xl text-[clamp(3rem,7vw,6.5rem)] text-foreground">
                {page.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/75">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <TrackedWhatsAppLink href={WHATSAPP_URL} service={page.slug}>
                    <MessageCircle className="h-4 w-4" />
                    Cotizar por WhatsApp
                  </TrackedWhatsAppLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/#projects">
                    Ver proyectos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <aside
            className="hero-in hero-in-right panel relative flex flex-col justify-end overflow-hidden p-6 md:p-8"
            style={{ "--hd": "140ms" } as CSSProperties}
          >
            <div aria-hidden className="hinomaru-dots left-1/2 top-[34%] aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-30" />
            <Floating3d variant="icosahedron" className="relative mx-auto h-44 w-44" />
            <p className="tech-label relative mt-4 text-primary">Enfoque del servicio</p>
            <p className="display-xl relative mt-2 text-[2.4rem] text-foreground">
              {page.serviceType}
            </p>
            <p className="relative mt-4 text-sm leading-6 text-muted-foreground">{page.solution}</p>
          </aside>
        </section>

        <section className="grid gap-gutter lg:grid-cols-[0.8fr_1.2fr]">
          <div data-fx="left" className="min-w-0">
            <div className="panel h-full p-6 md:p-10">
              <LandingHeading eyebrow="Problemas reales" title="Lo que esta página ayuda a resolver" />
            </div>
          </div>
          <div className="grid gap-gutter md:grid-cols-3">
            {page.problems.map((problem, i) => (
              <div key={problem} data-fx="drop" style={delay(i * 90)} className="min-w-0">
                <div className="panel flex h-full flex-col gap-5 p-6">
                  <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{problem}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-gutter lg:grid-cols-2">
          <div data-fx="left" className="min-w-0">
            <div className="panel panel-moss h-full p-6 md:p-10">
              <LandingHeading eyebrow="Solución" title="Una ejecución completa, no una pieza suelta" />
              <p className="mt-6 text-base leading-8 text-foreground/75">{page.solution}</p>
            </div>
          </div>
          <div className="grid gap-gutter sm:grid-cols-2">
            {page.deliverables.map((item, i) => (
              <div key={item} data-fx="right" style={delay(i * 70)} className="min-w-0">
                <div className="panel h-full p-6 transition-transform duration-500 hover:-translate-y-1">
                  <span aria-hidden className="display-xl mb-4 block text-3xl text-foreground/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cinta de la hoja: la misma que en el home. */}
        <MarqueeBand words={MARQUEE_WORDS} angle={-2} />

        <section className="grid gap-gutter lg:grid-cols-2">
          <div data-fx="left" className="min-w-0">
            <div className="panel h-full p-6 md:p-10">
              <LandingHeading eyebrow="Proceso" title="Cómo avanzamos sin improvisar" />
            </div>
          </div>
          <ol className="grid gap-gutter">
            {page.process.map((step, index) => (
              <li key={step} data-fx="right" style={delay(index * 80)} className="min-w-0">
                <div className="panel flex items-start gap-5 p-5 md:p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display text-xl font-black text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-2.5 text-base leading-7 text-muted-foreground">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-gutter">
          <div data-fx="panel">
            <div className="panel panel-moss p-6 md:p-10">
              <LandingHeading eyebrow="Diferenciadores" title={`Por qué construirlo con ${BRAND_NAME}`} />
            </div>
          </div>
          <div className="grid gap-gutter sm:grid-cols-2 md:grid-cols-4">
            {page.differentiators.map((item, i) => (
              <div key={item} data-fx="rise" style={delay(i * 80)} className="min-w-0">
                <div className={i === 0 ? "panel panel-lime h-full p-6" : "panel h-full p-6"}>
                  <span className="display-xl mb-4 block text-4xl text-foreground/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-gutter lg:grid-cols-[0.85fr_1.15fr]">
          <div data-fx="left" className="min-w-0">
            <div className="panel h-full p-6 md:p-10">
              <LandingHeading eyebrow="Preguntas frecuentes" title="Respuestas antes de cotizar" />
            </div>
          </div>
          <div className="panel grid gap-2 p-[var(--gutter)] md:p-4">
            {page.faqs.map((faq, i) => (
              <div key={faq.question} data-fx="up" style={delay(i * 60)}>
                <article className="rounded-inner bg-secondary/70 p-5 ring-1 ring-foreground/5 md:p-6">
                  <h3 className="font-display text-[1.35rem] font-extrabold uppercase leading-tight text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-gutter lg:grid-cols-2">
          <div data-fx="left" className="min-w-0">
            <div className="panel h-full p-6 md:p-10">
              <LandingHeading eyebrow="Enlaces relacionados" title="Servicios que suelen conectarse" />
              <div className="mt-8 grid gap-2">
                {relatedPages.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/${related.slug}`}
                    className="group flex min-h-12 items-center justify-between rounded-full bg-secondary px-5 py-3 text-sm text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {related.serviceType}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div data-fx="right" className="min-w-0">
            <div className="panel panel-moss h-full p-6 md:p-10">
              <LandingHeading eyebrow="Casos como referencia" title="Evidencia disponible sin inventar métricas" />
              <p className="mt-6 text-base leading-8 text-foreground/75">
                Estos proyectos existen en el portafolio del sitio y sirven como
                referencia visual. No se agregan resultados, rankings ni métricas
                que no estén documentadas.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2 text-sm text-foreground/85">
                {page.relatedCases.map((name) => (
                  <li key={name} className="rounded-full bg-background/60 px-4 py-2.5">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Cierre en lima, como el del home. */}
        <section data-fx="panel">
          <div className="panel panel-lime relative overflow-hidden px-6 py-12 md:px-12 md:py-16">
            <Floating3d
              variant="torusKnot"
              opacity={0.2}
              className="pointer-events-none absolute inset-0"
            />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <LandingHeading eyebrow="Siguiente paso" title="Cuéntanos qué necesitas construir o mejorar" />
                <p className="mt-5 text-base leading-8 text-foreground/80">
                  Te respondemos con una ruta clara: alcance recomendado,
                  prioridades, tiempos aproximados y datos que necesitamos para
                  cotizar sin inflar el proyecto.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    Hablar por WhatsApp
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-foreground/40 sm:w-auto">
                  <Link href="/#precios">Armar cotización</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}

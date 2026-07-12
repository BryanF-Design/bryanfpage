import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Floating3d } from "@/components/three/floating-3d";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
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

/** Cabecera de sección compartida por todas las landings (mismo plano de obra). */
function LandingHeading({
  eyebrow,
  title,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <p className="tech-label inline-flex items-center gap-3 text-primary">
          <span className="h-1.5 w-1.5 bg-primary" />
          {eyebrow}
        </p>
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}

export function ServiceLandingPage({ page }: ServiceLandingPageProps) {
  const relatedPages = getRelatedServicePages(page);

  return (
    <>
      <JsonLd data={buildServiceSchema(page)} />
      <JsonLd data={buildBreadcrumbSchema(page)} />
      <JsonLd data={buildFaqSchema(page)} />

      <ScrollProgress />
      <SiteHeader />

      <main className="bg-background">
        {/* Hero con el mismo lenguaje del home: retícula, glow y display XXL */}
        <section className="relative overflow-hidden border-b border-border pb-16 pt-32 md:pb-24 md:pt-40">
          <div aria-hidden className="bg-blueprint absolute inset-0" />
          <div aria-hidden className="mesh-glow-a absolute inset-0" />

          <div className="container relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <Reveal blur={0} y={16}>
                <nav
                  aria-label="Breadcrumb"
                  className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  <Link href="/" className="transition-colors hover:text-primary">
                    Inicio
                  </Link>
                  <span className="text-primary">/</span>
                  <span className="text-foreground">{page.serviceType}</span>
                </nav>
              </Reveal>

              <Reveal delay={0.05}>
                <p className="tech-label mb-4 inline-flex items-center gap-3 text-primary">
                  <span className="h-1.5 w-1.5 bg-primary" />
                  {page.eyebrow}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-foreground md:text-5xl xl:text-6xl">
                  {page.title}
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {page.intro}
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <TrackedWhatsAppLink
                      href={WHATSAPP_URL}
                      service={page.slug}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Cotizar por WhatsApp
                    </TrackedWhatsAppLink>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href="/#projects">
                      Ver proyectos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <aside className="glass corner-ticks rounded-lg p-6">
                <Floating3d
                  variant="icosahedron"
                  className="relative mx-auto -mt-2 h-44 w-44"
                />
                <p className="tech-label text-primary">Enfoque del servicio</p>
                <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                  {page.serviceType}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {page.solution}
                </p>
              </aside>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <LandingHeading eyebrow="Problemas reales" title="Lo que esta página ayuda a resolver" />
            <div className="grid gap-4 md:grid-cols-3">
              {page.problems.map((problem, i) => (
                <Reveal key={problem} delay={i * 0.08} className="h-full">
                  <div className="glass elevate corner-ticks h-full rounded-lg p-5">
                    <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {problem}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
          <div aria-hidden className="mesh-glow-b opacity-50" />
          <div className="container relative grid gap-10 lg:grid-cols-2">
            <div>
              <LandingHeading eyebrow="Solución" title="Una ejecución completa, no una pieza suelta" />
              <Reveal delay={0.1}>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  {page.solution}
                </p>
              </Reveal>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.deliverables.map((item, i) => (
                <Reveal key={item} delay={i * 0.06} className="h-full">
                  <div className="elevate h-full rounded-lg border border-border p-5 hover:border-primary/40">
                    <p className="text-sm leading-6 text-foreground">{item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Créditos de taller: misma banda ligada al scroll que el home */}
        <MarqueeBand words={MARQUEE_WORDS} />

        <section className="border-b border-border py-16 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
            <LandingHeading eyebrow="Proceso" title="Cómo avanzamos sin improvisar" />
            <ol className="relative grid gap-6">
              <div
                aria-hidden
                className="absolute bottom-5 left-5 top-5 w-px bg-border"
              />
              {page.process.map((step, index) => (
                <Reveal key={step} delay={index * 0.08}>
                  <li className="grid grid-cols-[2.5rem_1fr] items-start gap-4">
                    <span className="glass corner-ticks relative z-10 flex h-10 w-10 items-center justify-center rounded-md font-mono text-xs tracking-[0.14em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-2 text-base leading-7 text-muted-foreground">
                      {step}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container">
            <LandingHeading eyebrow="Diferenciadores" title={`Por qué construirlo con ${BRAND_NAME}`} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {page.differentiators.map((item, i) => (
                <Reveal key={item} delay={i * 0.07} className="h-full">
                  <div className="glass elevate h-full rounded-lg p-5 hover:border-primary/40">
                    <span className="mb-3 block font-mono text-xs tracking-[0.18em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
          <div aria-hidden className="mesh-glow-c opacity-50" />
          <div className="container relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <LandingHeading eyebrow="Preguntas frecuentes" title="Respuestas antes de cotizar" />
            <div className="grid gap-4">
              {page.faqs.map((faq, i) => (
                <Reveal key={faq.question} delay={i * 0.06}>
                  <article className="elevate rounded-lg border border-border p-5 hover:border-primary/40">
                    <h3 className="font-medium text-foreground">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-2">
            <div>
              <LandingHeading eyebrow="Enlaces relacionados" title="Servicios que suelen conectarse" />
              <div className="mt-8 grid gap-3">
                {relatedPages.map((related, i) => (
                  <Reveal key={related.slug} delay={i * 0.06}>
                    <Link
                      href={`/${related.slug}`}
                      className="elevate group flex items-center justify-between rounded-lg border border-border px-4 py-3.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {related.serviceType}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <LandingHeading eyebrow="Casos como referencia" title="Evidencia disponible sin inventar métricas" />
              <Reveal delay={0.1}>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  Estos proyectos existen en el portafolio del sitio y sirven como
                  referencia visual. No se agregan resultados, rankings ni métricas
                  que no estén documentadas.
                </p>
              </Reveal>
              <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                {page.relatedCases.map((name, i) => (
                  <Reveal key={name} delay={0.15 + i * 0.06}>
                    <li className="rounded-lg border border-border px-4 py-3">
                      {name}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Cierre con el mismo 3D de ambiente que el CTA del home */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <Floating3d
            variant="torusKnot"
            opacity={0.2}
            className="pointer-events-none absolute inset-0 -z-10"
          />
          <div className="container relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <LandingHeading eyebrow="Siguiente paso" title="Cuéntanos qué necesitas construir o mejorar" />
              <Reveal delay={0.1}>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Te respondemos con una ruta clara: alcance recomendado,
                  prioridades, tiempos aproximados y datos que necesitamos para
                  cotizar sin inflar el proyecto.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.18} className="w-full md:w-auto">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    Hablar por WhatsApp
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/#precios">Armar cotización</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

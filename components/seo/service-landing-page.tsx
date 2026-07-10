import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
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
    name: page.serviceType,
    serviceType: page.serviceType,
    description: page.metaDescription,
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    provider: {
      "@type": "ProfessionalService",
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

export function ServiceLandingPage({ page }: ServiceLandingPageProps) {
  const relatedPages = getRelatedServicePages(page);

  return (
    <>
      <JsonLd data={buildServiceSchema(page)} />
      <JsonLd data={buildBreadcrumbSchema(page)} />
      <JsonLd data={buildFaqSchema(page)} />

      <SiteHeader />

      <main className="bg-background">
        <section className="border-b border-border px-4 pt-36 pb-20 md:pt-40 md:pb-24">
          <div className="container grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Link href="/" className="hover:text-primary">
                  Inicio
                </Link>
                <span>/</span>
                <span className="text-foreground">{page.serviceType}</span>
              </nav>

              <p className="tech-label mb-4 text-primary">
                {page.eyebrow}
              </p>
              <h1 className="font-display text-4xl font-semibold text-foreground md:text-6xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Cotizar por WhatsApp
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/#portafolio">
                    Ver proyectos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <aside className="glass rounded-lg p-6">
              <p className="text-sm font-medium text-primary">Keyword principal</p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                {page.keyword}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Página comercial creada para resolver una intención de contratación,
                no para generar contenido masivo.
              </p>
            </aside>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="tech-label text-primary">
                Problemas reales
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Lo que esta página ayuda a resolver
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {page.problems.map((problem) => (
                <div key={problem} className="glass rounded-lg p-5">
                  <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-2">
            <div>
              <p className="tech-label text-primary">
                Solución
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Una ejecución completa, no una pieza suelta
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                {page.solution}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.deliverables.map((item) => (
                <div key={item} className="rounded-lg border border-border p-5">
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="tech-label text-primary">
                Proceso
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Cómo avanzamos sin improvisar
              </h2>
            </div>
            <ol className="grid gap-4">
              {page.process.map((step, index) => (
                <li key={step} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-base leading-7 text-muted-foreground">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-24">
          <div className="container">
            <div className="max-w-2xl">
              <p className="tech-label text-primary">
                Diferenciadores
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Por qué construirlo con BryanF Design
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {page.differentiators.map((item) => (
                <div key={item} className="glass rounded-lg p-5">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="tech-label text-primary">
                Preguntas frecuentes
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Respuestas antes de cotizar
              </h2>
            </div>
            <div className="grid gap-4">
              {page.faqs.map((faq) => (
                <article key={faq.question} className="rounded-lg border border-border p-5">
                  <h3 className="font-medium text-foreground">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-2">
            <div>
              <p className="tech-label text-primary">
                Enlaces relacionados
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Servicios que suelen conectarse
              </h2>
              <div className="mt-8 grid gap-3">
                {relatedPages.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/${related.slug}`}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {related.serviceType}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="tech-label text-primary">
                Casos como referencia
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Evidencia disponible sin inventar métricas
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                Estos proyectos existen en el portafolio del sitio y sirven como
                referencia visual. No se agregan resultados, rankings ni métricas
                que no estén documentadas.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                {page.relatedCases.map((name) => (
                  <li key={name} className="rounded-lg border border-border px-4 py-3">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="tech-label text-primary">
                Siguiente paso
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Cuéntanos qué necesitas construir o mejorar
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Te respondemos con una ruta clara: alcance recomendado,
                prioridades, tiempos aproximados y datos que necesitamos para
                cotizar sin inflar el proyecto.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Hablar por WhatsApp
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#precios">Armar cotización</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

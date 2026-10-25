import Image from "next/image";
import Link from "next/link";
import { Check, Clock, FileText, Infinity as InfinityIcon, ShieldCheck, Sparkle, X } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, ButtonArrow } from "@/components/ui/button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { LeadForm } from "@/components/sections/lead-form";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { SubscriptionButtons } from "@/components/subscription-buttons";
import { AccessShowcase } from "@/components/subscription/access-showcase";
import { PanelDemo } from "@/components/subscription/panel-demo";
import { WorkExamples } from "@/components/subscription/work-examples";
import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo/service-pages";
import {
  SUBSCRIPTION_FAQ,
  SUBSCRIPTION_FAQ_ALL,
  SUBSCRIPTION_POLICY,
  SUBSCRIPTION_PRICE_LABEL,
  SUBSCRIPTION_STEPS,
} from "@/lib/subscription";

const PRICE = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
}).format(SUBSCRIPTION_PLAN.price);

/** Portal de clientes de Stripe (enlace sin código del Dashboard), si existe. */
const PORTAL_URL = /^https:\/\/billing\.stripe\.com\//.test(process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "")
  ? process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL
  : "";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/suscripcion#service`,
  name: "Suscripción Todo Digital",
  serviceType: "Diseño y desarrollo web por suscripción",
  description: `Todo lo digital de tu negocio por ${SUBSCRIPTION_PRICE_LABEL} al mes: páginas web, cambios ilimitados, tarjetas digitales y más, con entregas de 1 a 2 días hábiles.`,
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "México" },
  url: `${SITE_URL}/suscripcion`,
  offers: {
    "@type": "Offer",
    price: SUBSCRIPTION_PLAN.price,
    priceCurrency: "MXN",
    url: `${SITE_URL}/suscripcion`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: SUBSCRIPTION_PLAN.price,
      priceCurrency: "MXN",
      unitCode: "MON",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/suscripcion#preguntas`,
  mainEntity: SUBSCRIPTION_FAQ.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow w-fit pl-3">
      <span aria-hidden className="size-2 rounded-full bg-lime" />
      {children}
    </span>
  );
}

/**
 * /suscripcion — el plan mensual "Todo Digital". Página en español (como las
 * landings de servicio): precio, qué incluye, cómo funciona, comparativa con
 * el pago único, política y preguntas frecuentes. El texto vive en
 * lib/subscription.ts y el precio en lib/catalog.ts.
 */
export function SubscriptionPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <SpanishPageLanguage />
      <ScrollProgress />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* ——— Portada: la promesa y la tarjeta de precio. ——— */}
        <section aria-labelledby="sub-title" data-lumina-topic="plan" className="grid gap-gutter lg:grid-cols-12">
          <div className="panel relative flex flex-col justify-between gap-8 overflow-hidden p-5 pt-6 shadow-soft sm:p-8 lg:col-span-7 lg:p-10">
            {/* Destellos que flotan detrás del titular. */}
            <Sparkle aria-hidden className="float-y absolute right-[8%] top-[10%] h-8 w-8 fill-lime text-lime-deep opacity-80" />
            <Sparkle
              aria-hidden
              style={{ animationDelay: "-2.5s" }}
              className="float-y absolute right-[22%] top-[26%] hidden h-4 w-4 fill-lime text-lime-deep opacity-70 sm:block"
            />
            <div className="relative flex flex-col items-start gap-5">
              <span className="hero-in hero-in-up">
                <Eyebrow>Suscripción Todo Digital</Eyebrow>
              </span>
              <h1
                id="sub-title"
                className="display-title text-balance text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.94] text-ink"
              >
                <span className="hero-line">
                  <span style={{ "--hd": "60ms" } as React.CSSProperties}>Todo lo digital</span>
                </span>
                <span className="hero-line">
                  <span style={{ "--hd": "160ms" } as React.CSSProperties}>de tu negocio,</span>
                </span>
                <span className="hero-line">
                  <span style={{ "--hd": "260ms" } as React.CSSProperties}>
                    por <span className="relative inline-block">
                      <span className="relative z-10">{PRICE}</span>
                      <span aria-hidden className="sub-underline absolute inset-x-[-0.06em] bottom-[0.08em] -z-0 h-[0.32em] rounded-full bg-lime" />
                    </span>{" "}
                    al mes
                  </span>
                </span>
              </h1>
              <p
                style={{ "--hd": "380ms" } as React.CSSProperties}
                className="hero-in hero-in-up max-w-xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg"
              >
                Páginas web, cambios ilimitados, tarjetas digitales, firmas, gráficos y todo lo que tu
                negocio necesite en digital. Lo pides, lo hacemos y en 1 a 2 días hábiles lo tienes.
              </p>
            </div>
            <ul className="relative grid gap-2 sm:grid-cols-3">
              {[
                { Icon: InfinityIcon, text: "Cambios ilimitados" },
                { Icon: Clock, text: "Entregas en 1 a 2 días hábiles" },
                { Icon: ShieldCheck, text: "Sin plazo forzoso" },
              ].map(({ Icon, text }, i) => (
                <li
                  key={text}
                  style={{ "--hd": `${480 + i * 90}ms` } as React.CSSProperties}
                  className="hero-in hero-in-up flex items-center gap-3 rounded-card bg-mint p-3 text-sm font-semibold leading-snug text-ink ring-1 ring-inset ring-ink/[0.06]"
                >
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-lime">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div
            id="plan"
            style={{ "--hd": "200ms" } as React.CSSProperties}
            className="hero-in hero-in-right scroll-mt-[calc(var(--header-h)+var(--gutter))] lg:col-span-5"
          >
            <div className="panel panel-ink relative flex h-full flex-col gap-6 overflow-hidden p-5 sm:p-8">
              <div aria-hidden className="mesh-glow-a opacity-60" />
              <div aria-hidden className="sub-shine" />
              <div className="relative flex items-center justify-between gap-3">
                <p className="display-title text-[1.6rem] leading-none text-white">Tu plan</p>
                <span className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3.5 text-xs font-bold text-white">
                  <span aria-hidden className="size-2 rounded-full bg-lime" />
                  Mensual
                </span>
              </div>
              <div className="relative">
                <p className="flex items-baseline gap-2">
                  <span className="display-xl text-[clamp(3.25rem,7vw,4.75rem)] leading-[0.9] tabular-nums text-lime">
                    {PRICE}
                  </span>
                  <span className="text-base font-bold text-white/70">MXN / mes</span>
                </p>
                <p className="mt-2 text-sm text-white/65">Cobro automático cada mes · cancela cuando quieras</p>
              </div>
              <ul className="relative flex flex-col gap-2.5">
                {[
                  "Las páginas web que necesites",
                  "Cambios ilimitados",
                  "Tarjetas digitales y firmas de correo",
                  "Gráficos para redes, SEO y mantenimiento",
                  "Hosting de tus sitios incluido",
                ].map((item, i) => (
                  <li
                    key={item}
                    style={{ "--hd": `${520 + i * 80}ms` } as React.CSSProperties}
                    className="hero-in hero-in-left flex items-center gap-2.5 text-[0.9375rem] text-white/85"
                  >
                    <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-ink">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="relative mt-auto">
                <SubscriptionButtons />
              </div>
              <p className="relative text-center text-xs leading-relaxed text-white/60">
                Al suscribirte aceptas la{" "}
                <a href="#politica" className="underline underline-offset-2 hover:text-lime">
                  política de la suscripción
                </a>{" "}
                y los{" "}
                <a href="/terminos" className="underline underline-offset-2 hover:text-lime">
                  términos
                </a>
                .
                {PORTAL_URL ? (
                  <>
                    {" "}
                    ¿Ya eres suscriptor?{" "}
                    <a href={PORTAL_URL} className="underline underline-offset-2 hover:text-lime">
                      Administra o cancela aquí
                    </a>
                    .
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </section>

        {/* ——— A qué tienes acceso: pestañas con escenas animadas ——— */}
        <section aria-labelledby="incluye-title" data-lumina-topic="incluye" className="panel p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <div data-fx="up" className="flex flex-col gap-4">
            <Eyebrow>A qué tienes acceso</Eyebrow>
            <h2 id="incluye-title" className="display-title max-w-3xl text-balance text-[clamp(2rem,4.2vw,3.4rem)] leading-[0.98] text-ink">
              Si es digital y tu negocio lo necesita, entra
            </h2>
            <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">
              Un estudio completo de diseño y desarrollo trabajando para tu negocio cada mes. Esto es lo que puedes pedir:
            </p>
          </div>
          <AccessShowcase />
        </section>

        {/* ——— Tu panel ——— */}
        <section id="tu-panel" aria-labelledby="tu-panel-title" className="panel scroll-mt-[calc(var(--header-h)+var(--gutter))] overflow-hidden p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <div data-fx="up" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Eyebrow>Tu panel</Eyebrow>
            <h2 id="tu-panel-title" className="display-title text-balance text-[clamp(2rem,4.2vw,3.4rem)] leading-[0.98] text-ink">
              Todo tu plan, en un solo lugar
            </h2>
            <p className="text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">
              Al suscribirte tienes tu propio panel: ves cuántos días faltan para tu próximo cobro, pides lo que
              necesites con un toque y administras tu tarjeta o tus facturas cuando quieras.
            </p>
          </div>
          <PanelDemo />
        </section>

        {/* ——— Ejemplos de trabajo ——— */}
        <section aria-labelledby="trabajos-title" data-lumina-topic="trabajos" className="panel overflow-hidden px-0 py-6 shadow-soft sm:py-8 lg:py-10">
          <div data-fx="up" className="flex flex-col gap-4 px-5 sm:px-8 lg:px-10">
            <Eyebrow>Ejemplos de trabajo</Eyebrow>
            <h2 id="trabajos-title" className="display-title max-w-3xl text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] text-ink">
              Así se ve lo que entregamos
            </h2>
            <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground">
              Sitios reales de negocios reales. Tócalos para visitarlos: así de rápido y cuidado sale cada solicitud.
            </p>
          </div>
          <WorkExamples />
        </section>

        {/* ——— Cómo funciona + tiempos ——— */}
        <section aria-labelledby="como-title" className="grid gap-gutter lg:grid-cols-12">
          <div className="panel p-5 pt-6 shadow-soft sm:p-8 lg:col-span-8 lg:p-10">
            <Eyebrow>Cómo funciona</Eyebrow>
            <h2 id="como-title" className="display-title mt-4 text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] text-ink">
              Pides, entregamos, repites
            </h2>
            <ol data-fx="up" style={{ "--fx-delay": "330ms" } as React.CSSProperties} className="mt-8 grid gap-3 sm:grid-cols-2">
              {SUBSCRIPTION_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  style={{ "--fx-delay": `${i * 110}ms` } as React.CSSProperties}
                  className="flex gap-4 rounded-card bg-mint p-4 ring-1 ring-inset ring-ink/[0.06] sm:p-5"
                >
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-lime">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[1.0625rem] font-bold leading-snug text-ink">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink/70">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="panel panel-lime relative flex flex-col justify-between gap-6 overflow-hidden p-5 sm:p-8 lg:col-span-4">
            <div className="flex flex-col gap-3">
              <span aria-hidden className="grid size-14 place-items-center rounded-full bg-ink text-lime">
                <Clock className="h-6 w-6" />
              </span>
              <p className="display-title text-[1.9rem] leading-tight text-ink">1 a 2 días hábiles por solicitud</p>
              <p className="text-[0.975rem] leading-relaxed text-ink/75">
                Aunque todo está incluido, el tiempo depende de la complejidad de lo que pidas. Un cambio de
                texto puede salir el mismo día; una tienda completa se entrega por partes, cada una en 1 a 2
                días hábiles.
              </p>
            </div>
            <Image
              src="/img/brand/lumina-enfocada.webp"
              alt=""
              width={852}
              height={1162}
              sizes="10rem"
              className="float-y h-auto w-32 self-end"
            />
          </aside>
        </section>

        {/* ——— Comparativa ——— */}
        <section aria-labelledby="compara-title" className="panel p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <Eyebrow>¿Cuál te conviene?</Eyebrow>
          <h2 id="compara-title" className="display-title mt-4 text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] text-ink">
            Pago único o suscripción
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div data-fx="left" className="flex">
            <article className="flex flex-1 flex-col gap-4 rounded-card bg-mint p-5 ring-1 ring-inset ring-ink/[0.06] sm:p-6">
              <p className="text-sm font-bold text-ink/60">Proyecto de pago único</p>
              <p className="display-title text-[2rem] leading-none text-ink">Desde $3,500 MXN</p>
              <ul className="flex flex-col gap-2 text-sm text-ink/80">
                <li className="flex gap-2"><Check aria-hidden className="h-4 w-4 shrink-0 text-forest" />Un sitio, listo para publicar</li>
                <li className="flex gap-2"><Check aria-hidden className="h-4 w-4 shrink-0 text-forest" />Cambios hasta que lo apruebes</li>
                <li className="flex gap-2"><X aria-hidden className="h-4 w-4 shrink-0 text-ink/40" />Cambios posteriores, aparte</li>
                <li className="flex gap-2"><X aria-hidden className="h-4 w-4 shrink-0 text-ink/40" />Tarjetas, firmas y gráficos, aparte</li>
              </ul>
              <p className="text-sm text-ink/70">Ideal si tu sitio casi no va a cambiar.</p>
              <Button asChild variant="outline" className="mt-auto w-fit">
                <Link href="/crear-web">Cotizar pago único</Link>
              </Button>
            </article>
            </div>
            <div data-fx="right" style={{ "--fx-delay": "120ms" } as React.CSSProperties} className="flex">
            <article className="relative flex flex-1 flex-col overflow-hidden gap-4 rounded-card bg-ink p-5 text-white sm:p-6 ring-1 ring-inset ring-lime/25">
              <p className="text-sm font-bold text-lime">Suscripción Todo Digital</p>
              <p className="display-title text-[2rem] leading-none text-white">{PRICE} MXN / mes</p>
              <ul className="flex flex-col gap-2 text-sm text-white/85">
                <li className="flex gap-2"><Check aria-hidden className="h-4 w-4 shrink-0 text-lime" />Las páginas que necesites</li>
                <li className="flex gap-2"><Check aria-hidden className="h-4 w-4 shrink-0 text-lime" />Cambios ilimitados, siempre</li>
                <li className="flex gap-2"><Check aria-hidden className="h-4 w-4 shrink-0 text-lime" />Tarjetas, firmas, gráficos y SEO incluidos</li>
                <li className="flex gap-2"><Check aria-hidden className="h-4 w-4 shrink-0 text-lime" />Cancelas cuando quieras</li>
              </ul>
              <p className="text-sm text-white/70">Ideal si tu negocio se mueve: promociones, productos, campañas.</p>
              <Button asChild className="mt-auto w-fit bg-lime pr-2 text-ink">
                <a href="#plan">
                  Suscribirme
                  <ButtonArrow tone="ink" className="ml-2 -mr-0.5" />
                </a>
              </Button>
            </article>
            </div>
          </div>
        </section>

        {/* ——— Política ——— */}
        <section id="politica" aria-labelledby="politica-title" className="panel scroll-mt-[calc(var(--header-h)+var(--gutter))] p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>Política de la suscripción</Eyebrow>
            <h2 id="politica-title" className="display-title max-w-3xl text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] text-ink">
              Las reglas, claras desde el principio
            </h2>
          </div>
          <dl data-fx="up" style={{ "--fx-delay": "300ms" } as React.CSSProperties} className="mt-8 grid gap-3 md:grid-cols-2">
            {SUBSCRIPTION_POLICY.map((rule, i) => (
              <div
                key={rule.title}
                style={{ "--fx-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
                className="flex gap-4 rounded-card bg-mint p-4 ring-1 ring-inset ring-ink/[0.06] sm:p-5">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold tabular-nums text-ink/75 ring-1 ring-ink/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <dt className="text-[1rem] font-bold leading-snug text-ink">{rule.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink/75">{rule.body}</dd>
                </span>
              </div>
            ))}
          </dl>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <FileText aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            Esta política forma parte de nuestros{" "}
            <a href="/terminos" className="font-semibold text-ink underline underline-offset-2">
              Términos y Condiciones
            </a>
            .
          </p>
        </section>

        {/* ——— Preguntas frecuentes ——— */}
        <section id="preguntas" aria-labelledby="preguntas-title" className="panel scroll-mt-[calc(var(--header-h)+var(--gutter))] p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 id="preguntas-title" className="display-title text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] text-ink">
              Lo que más nos preguntan de la suscripción
            </h2>
            <Accordion type="single" collapsible defaultValue="0" className="mt-4 flex w-full flex-col gap-2">
              {SUBSCRIPTION_FAQ.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={String(i)}
                  className="rounded-card border-0 bg-mint px-4 ring-1 ring-ink/[0.05] transition-colors data-[state=open]:bg-lime data-[state=open]:ring-0 sm:px-5"
                >
                  <AccordionTrigger className="min-h-[4rem] gap-3 py-3 text-left text-[1.0625rem] font-bold leading-snug text-ink">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-2 text-[0.9375rem] leading-relaxed text-ink/80">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button asChild size="lg" variant="ink" className="mt-2 w-full justify-between pl-6 pr-2.5 sm:w-fit">
              <Link href="/suscripcion/preguntas-frecuentes">
                Ver las {SUBSCRIPTION_FAQ_ALL.length} preguntas, por tema
                <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
              </Link>
            </Button>
          </div>
        </section>

        <LeadForm forceSpanish source="suscripcion" />
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}

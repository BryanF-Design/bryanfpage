"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { useLanguage } from "@/lib/i18n/context";
import { STUDIO_FACTS } from "@/lib/catalog";
import { LIVE_CASE } from "@/lib/barber-os";
import { mobileShot, projects } from "@/lib/projects";
import { PhoneMockup } from "@/components/home/phone-mockup";

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

/**
 * Prueba social como índice: tres casos reales, cada uno con nombre, giro,
 * una frase de lo que se hizo y su número. Los números de CortMart son los
 * del panel (51 visitas, 98% de asistencia, 50 clientes), en Fraunces
 * gigante. Debajo, una tira lenta con nombres de clientes con sitio en línea.
 * Sin íconos ni cajitas: tipografía grande y espacio.
 */
export function HomeCases() {
  const { t } = useLanguage();
  const c = t.homeV2.cases;
  const efficient = bySlug("efficientplasticolors-com");
  const koi = bySlug("koi-arquitectura-vercel-app");
  const [visits, attendance, clients] = LIVE_CASE.stats;
  const whatsapp = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(t.homeV2.hero.whatsappMsg)}`;

  const rows = [
    {
      key: efficient.slug,
      name: efficient.name,
      sector: t.projects.descs[efficient.slug] || efficient.desc,
      done: t.projects.cases["efficientplasticolors-com"].decision,
      number: c.efficient.number,
      label: c.efficient.label,
      href: `/casos#${efficient.slug}`,
      shot: mobileShot(efficient.slug),
    },
    {
      key: koi.slug,
      name: koi.name,
      sector: t.projects.descs[koi.slug] || koi.desc,
      done: t.projects.cases["koi-arquitectura-vercel-app"].decision,
      number: c.koi.number,
      label: c.koi.label,
      href: `/casos#${koi.slug}`,
      shot: mobileShot(koi.slug),
    },
  ];

  return (
    <section id="casos" aria-labelledby="casos-title" className="flex flex-col gap-12 md:gap-16">
      <header className="reveal max-w-3xl">
        <h2 id="casos-title" className="section-title">{c.title}</h2>
        <p className="mt-4 text-lg text-ink/65">{c.subtitle}</p>
      </header>

      {/* CortMart: el caso con los números del panel, a todo lo ancho. */}
      <article className="reveal reveal-left border-t border-ink/15 pt-8 md:pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">{LIVE_CASE.name}</h3>
          <p className="text-sm font-medium text-ink/60">{c.cortmart.sector}</p>
        </div>
        <p className="mt-3 max-w-2xl text-lg text-ink/75">{c.cortmart.done}</p>
        <dl className="mt-8 grid grid-cols-3 gap-4 md:gap-10">
          {[visits, attendance, clients].map((stat, i) => (
            <div key={stat.label} className="min-w-0">
              <dd className="big-number">
                {stat.value}
                {stat.suffix}
              </dd>
              <dt className="mt-2 text-sm text-ink/65 md:text-base">{c.cortmart.stats[i]}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink/55">{c.cortmart.note}</p>
          <Link href="/sistema-para-barberias" className="text-link">
            {c.seeCase}
          </Link>
        </div>
      </article>

      {/* Los otros dos: imagen + nombre + qué se hizo + su número. */}
      <div className="grid gap-12 md:grid-cols-2 md:gap-10">
        {rows.map((row, i) => (
          <article
            key={row.key}
            className={`reveal ${i === 0 ? "reveal-left" : "reveal-right"} group flex flex-col border-t border-ink/15 pt-8`}
          >
            <Link
              href={row.href}
              aria-label={`${c.seeCase}: ${row.name}`}
              className="lift-card block rounded-card bg-[hsl(60_6%_92%)] px-6 py-10"
            >
              <PhoneMockup src={row.shot} alt={`Sitio de ${row.name} en un teléfono`} />
            </Link>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{row.name}</h3>
              <p className="text-sm font-medium text-ink/60">{row.sector}</p>
            </div>
            {row.done && <p className="mt-3 text-base text-ink/75">{row.done}</p>}
            <p className="mt-5 flex items-baseline gap-3">
              <span className="big-number big-number--sm">{row.number}</span>
              <span className="text-sm text-ink/65 md:text-base">{row.label}</span>
            </p>
            <Link href={row.href} className="text-link mt-5 self-start">
              {c.seeCase}
            </Link>
          </article>
        ))}
      </div>

      <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" variant="ink" className="h-14 gap-2.5 px-7">
          <TrackedWhatsAppLink href={whatsapp} service="casos_quiero_mi_pagina">
            <FaWhatsapp aria-hidden className="h-5 w-5 text-lime" />
            {t.homeV2.hero.ctaWhatsapp}
          </TrackedWhatsAppLink>
        </Button>
        <Link href="/casos" className="text-link sm:ml-4">
          {c.allCases}
        </Link>
      </div>
    </section>
  );
}

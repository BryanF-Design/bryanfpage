"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { PhoneMockup } from "@/components/home/phone-mockup";
import { useLanguage } from "@/lib/i18n/context";
import { LIVE_CASE } from "@/lib/barber-os";
import { mobileShot, projects } from "@/lib/projects";

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

/**
 * Prompt 2 · Prueba social: tres casos reales grandes (en lugar de la tira de
 * 7 miniaturas y la sección de cifras suelta: los números viven aquí).
 *  - CortMart / Barber OS: cifras reales del panel en Fraunces gigante.
 *  - Efficient Plasticolors y Koi Arquitectura: su sitio real dentro de un
 *    teléfono que gira al entrar ("hero turn"); al pasar el mouse la captura
 *    se oscurece y aparece "Ver caso →" (patrón ui.live).
 * Entrada escalonada de izquierda a derecha, una sola vez. Sin video.
 * MC Spine y Golden Muuse aún no tienen texto ni capturas en el repo: no se
 * inventan, entran cuando Bryan los pase.
 */
export function SocialProof() {
  const { t } = useLanguage();
  const c = t.v2.cases;
  const efficient = bySlug("efficientplasticolors-com");
  const koi = bySlug("koi-arquitectura-vercel-app");

  const phones = [
    {
      project: efficient,
      problem: t.projects.cases["efficientplasticolors-com"].problem,
      done: t.projects.cases["efficientplasticolors-com"].decision,
      number: c.efficient.number,
      label: c.efficient.label,
    },
    {
      project: koi,
      problem: t.projects.cases["koi-arquitectura-vercel-app"].problem,
      done: t.projects.cases["koi-arquitectura-vercel-app"].decision,
      number: c.koi.number,
      label: c.koi.label,
    },
  ];

  return (
    <section id="casos" aria-labelledby="casos-title" className="flex flex-col gap-gutter">
      <div className="panel px-5 pb-6 pt-7 shadow-soft sm:px-8 sm:pt-9 lg:px-10 lg:pt-12">
        <SectionHeading
          eyebrow={t.projects.casesEyebrow}
          title={<span id="casos-title">{c.title}</span>}
          subtitle={c.subtitle}
        />
      </div>

      <div className="grid gap-gutter lg:grid-cols-3">
        {/* CortMart: números grandes y quietos, con su nota de origen. */}
        <article className="reveal panel panel-ink relative flex flex-col overflow-hidden p-6 sm:p-8" style={{ ["--stagger" as string]: 0 }}>
          <div aria-hidden className="mesh-glow-a opacity-70" />
          <div className="relative flex items-center justify-between gap-3">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">{c.cortmart.sector}</span>
          </div>
          <h3 className="relative mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-white">{LIVE_CASE.name}</h3>
          <p className="relative mt-2 text-[0.975rem] text-white/75">{c.cortmart.done}</p>
          <dl className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
            {LIVE_CASE.stats.map((stat, i) => (
              <div key={stat.label} className="reveal reveal-up" style={{ ["--stagger" as string]: i }}>
                <dd className="display-xl text-[clamp(3rem,6vw,4.5rem)] leading-none text-lime">
                  {stat.value}
                  {stat.suffix}
                </dd>
                <dt className="mt-1 text-sm text-white/70">{c.cortmart.stats[i]}</dt>
              </div>
            ))}
          </dl>
          <p className="relative mt-6 text-xs text-white/55">{c.cortmart.note}</p>
          <Button asChild size="lg" variant="white" className="relative mt-6 w-full justify-between pl-6 pr-2.5">
            <Link href="/sistema-para-barberias">
              {c.viewCase}
              <ButtonArrow tone="ink" className="-mr-0.5" />
            </Link>
          </Button>
        </article>

        {phones.map((item, i) => (
          <article
            key={item.project.slug}
            className="reveal panel flex flex-col overflow-hidden p-4 shadow-soft sm:p-5"
            style={{ ["--stagger" as string]: i + 1 }}
          >
            {/* La captura real en un teléfono; al hover se oscurece y aparece
                la acción. Todo el bloque lleva al caso. */}
            <Link
              href={`/casos#${item.project.slug}`}
              className="case-card relative block overflow-hidden rounded-card bg-mint px-6 py-8"
              aria-label={`${c.viewCase}: ${item.project.name}`}
            >
              <PhoneMockup src={mobileShot(item.project.slug)} alt={`Sitio de ${item.project.name} en un teléfono`} />
              <span aria-hidden className="case-card__shade absolute inset-0 bg-ink/55" />
              <span
                aria-hidden
                className="case-card__cta absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink"
              >
                {c.viewCase}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{item.project.name}</h3>
                <a
                  href={item.project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-ink/60 hover:text-ink"
                >
                  {t.projects.visitSite}
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="mt-3 text-[0.9375rem] text-ink/70">
                <span className="font-semibold text-ink">{t.projects.caseLabels.problem}: </span>
                {item.problem}
              </p>
              <p className="mt-2 text-[0.9375rem] text-ink/70">
                <span className="font-semibold text-ink">{t.projects.caseLabels.decision}: </span>
                {item.done}
              </p>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="display-xl text-[3.25rem] leading-none text-ink">{item.number}</span>
                <span className="text-sm text-ink/65">{item.label}</span>
              </p>
              <Button asChild size="lg" variant="ink" className="mt-6 w-full justify-between pl-6 pr-2.5">
                <Link href={`/casos#${item.project.slug}`}>
                  {c.viewCase}
                  <ButtonArrow tone="lime" className="-mr-0.5" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

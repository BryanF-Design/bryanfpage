"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkle } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";
import { LIVE_CASE } from "@/lib/barber-os";
import { mobileShot, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const fx = (ms: number) => ({ "--fx-delay": `${ms}ms` }) as CSSProperties;
const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** Teléfono con la primera pantalla real del sitio; gira un poco al entrar. */
function CasePhone({ slug, alt, className }: { slug: string; alt: string; className?: string }) {
  return (
    <div className={cn("phone-turn relative mx-auto w-[9.5rem] sm:w-[11rem]", className)}>
      <div
        className="aspect-[390/800] bg-ink p-[3.2%] shadow-[0_34px_60px_-24px_hsl(var(--ink)/0.7)] ring-1 ring-white/10"
        style={{ borderRadius: "16% / 7.8%" }}
      >
        <div className="relative h-full w-full overflow-hidden bg-white" style={{ borderRadius: "13% / 6.3%" }}>
          <Image
            src={mobileShot(slug)}
            alt={alt}
            fill
            sizes="176px"
            quality={70}
            className="object-cover object-top"
          />
          <span aria-hidden className="absolute left-1/2 top-[1.6%] h-[2.8%] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

/**
 * Prueba social del inicio: tres casos con resultado en vez de una tira de
 * capturas. CortMart va a lo ancho con las cifras reales de su panel en
 * número grande; Efficient y Koi, con su teléfono, una línea de reto, una de
 * lo que se hizo y su número. Cada tarjeta termina en "Ver caso".
 */
export function HomeCases() {
  const { t } = useLanguage();
  const c = t.homeV3.cases;
  const rows = [
    { slug: "efficientplasticolors-com", copy: c.efficient },
    { slug: "koi-arquitectura-vercel-app", copy: c.koi },
  ];

  return (
    <section id="casos" aria-label={c.title} className="panel p-5 shadow-soft sm:p-7 lg:p-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
        <Button asChild size="lg" variant="outline" className="shrink-0 self-start lg:self-auto">
          <Link href="/casos">
            {c.allCases}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* CortMart: el caso con números del panel, a todo lo ancho. */}
      <div data-fx="left" className="mt-8 lg:mt-10">
        <article className="panel-ink relative grid gap-8 overflow-hidden rounded-card p-5 sm:p-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:p-10">
          <div aria-hidden className="mesh-glow-a opacity-60" />
          <div className="relative flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow pl-3">
                <span aria-hidden className="size-2 rounded-full bg-lime" />
                {c.cortmart.sector}
              </span>
              <h3 className="display-title text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-white">
                {c.cortmart.name}
              </h3>
            </div>
            <dl className="grid gap-2 text-[0.975rem] leading-snug text-white/80 sm:text-base">
              <div className="flex gap-2">
                <dt className="shrink-0 font-semibold text-lime">{c.problemLabel}:</dt>
                <dd>{c.cortmart.problem}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 font-semibold text-lime">{c.doneLabel}:</dt>
                <dd>{c.cortmart.done}</dd>
              </div>
            </dl>
            {/* Las cifras quietas y grandes: sin contador animado. */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {LIVE_CASE.stats.map((stat, i) => (
                <div key={stat.label} data-fx="up" style={fx(80 * i)} className="min-w-0">
                  <div>
                    <dd className="display-xl text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.85] text-lime">
                      {stat.value}
                      {stat.suffix}
                    </dd>
                    <dt className="mt-2 text-sm font-semibold text-white/75">{c.cortmart.stats[i]}</dt>
                  </div>
                </div>
              ))}
            </dl>
            <p className="text-xs leading-snug text-white/55">{c.cortmart.note}</p>
            <Button asChild size="lg" className="self-start bg-lime pr-2.5 text-ink">
              <Link href="/sistema-para-barberias" data-track-cta="casos_cortmart">
                {c.seeCase}
                <ButtonArrow tone="ink" className="-mr-0.5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* El sistema real en una ventana de navegador que gira al entrar. */}
          <div className="relative min-w-0 [perspective:1200px]">
            <div className="phone-turn relative mx-auto max-w-[30rem] overflow-hidden rounded-inner bg-white shadow-[0_40px_80px_-30px_hsl(0_0%_0%/0.7)] ring-1 ring-white/10">
              <span aria-hidden className="flex h-7 items-center gap-1.5 bg-[hsl(var(--canvas))] px-3">
                <span className="size-2 rounded-full bg-ink/20" />
                <span className="size-2 rounded-full bg-ink/20" />
                <span className="size-2 rounded-full bg-lime" />
              </span>
              <Image
                src="/img/cv/shots/cortmart.webp"
                alt="Barbería CortMart, que agenda y fideliza a sus clientes con Barber OS"
                width={960}
                height={726}
                sizes="(min-width: 1024px) 30rem, 90vw"
                className="block h-auto w-full"
              />
            </div>
            <Sparkle aria-hidden className="float-y absolute -right-1 -top-3 h-8 w-8 fill-lime text-lime" />
          </div>
        </article>
      </div>

      {/* Efficient y Koi: teléfono, reto, lo que se hizo y su número. */}
      <div className="mt-gutter grid gap-gutter md:grid-cols-2">
        {rows.map(({ slug, copy }, i) => {
          const project = bySlug(slug);
          if (!project) return null;
          const sector = t.projects.descs[slug as keyof typeof t.projects.descs] || project.desc;
          return (
            <div key={slug} data-fx={i === 0 ? "left" : "right"} className="min-w-0">
              <article className="group grid h-full gap-6 rounded-card bg-mint p-5 ring-1 ring-ink/[0.05] transition-transform duration-300 hover:-translate-y-0.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-6">
                <Link href={`/casos#${slug}`} aria-label={`${c.seeCase}: ${project.name}`} className="[perspective:900px]">
                  <CasePhone slug={slug} alt={`Sitio de ${project.name} en un teléfono`} />
                </Link>
                <div className="flex min-w-0 flex-col gap-3">
                  <div>
                    <h3 className="display-title text-[clamp(1.4rem,2.2vw,1.85rem)] leading-tight text-ink">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-ink/60">{sector}</p>
                  </div>
                  <p className="text-[0.9375rem] leading-snug text-ink/80">
                    <span className="font-semibold text-forest">{c.problemLabel}: </span>
                    {copy.problem}
                  </p>
                  <p className="text-[0.9375rem] leading-snug text-ink/80">
                    <span className="font-semibold text-forest">{c.doneLabel}: </span>
                    {copy.done}
                  </p>
                  <p className="flex items-baseline gap-3">
                    <span className="display-xl text-[clamp(2.75rem,5vw,3.75rem)] leading-[0.85] text-ink">
                      {copy.number}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-ink/70">{copy.label}</span>
                  </p>
                  <Link
                    href={`/casos#${slug}`}
                    className="mt-1 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink"
                  >
                    {c.seeCase}
                    <span className="grid size-9 place-items-center rounded-full bg-ink text-lime">
                      <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </Link>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

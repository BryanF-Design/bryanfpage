"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { PhoneMockup } from "@/components/home/phone-mockup";
import { useLanguage } from "@/lib/i18n/context";
import { STUDIO_FACTS } from "@/lib/catalog";
import { LIVE_CASE } from "@/lib/barber-os";
import { mobileShot, projects } from "@/lib/projects";

/** Los casos con problema, decisión, resultado y número reales (diccionario). */
const CASE_SLUGS = [
  "koi-arquitectura-vercel-app",
  "efficientplasticolors-com",
  "element-experiences-com",
  "nkmohcafe-com",
] as const;

/**
 * /casos: todos los casos visibles a la vez (antes eran pestañas y el HTML
 * solo traía uno). Arriba CortMart con las cifras de su panel; después los 4
 * casos completos, cada uno con su ancla (/casos#slug) y el sitio real en un
 * teléfono. Cierra con WhatsApp.
 */
export function CasosList() {
  const { t } = useLanguage();
  const labels = t.projects.caseLabels;
  const whatsapp = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(t.homeV2.hero.whatsappMsg)}`;

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      {/* CortMart: caso en vivo con las cifras reales del panel. */}
      <article id="cortmart" className="reveal scroll-mt-28 border-t border-ink/15 pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="section-title">{LIVE_CASE.name}</h2>
          <p className="text-sm font-medium text-ink/60">{t.homeV2.cases.cortmart.sector}</p>
        </div>
        <p className="mt-3 max-w-2xl text-lg text-ink/75">{t.homeV2.cases.cortmart.done}</p>
        <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
          {LIVE_CASE.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="big-number big-number--sm">
                {stat.value}
                {stat.suffix}
              </dd>
              <dt className="mt-2 text-sm text-ink/65">{stat.label}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink/55">{t.homeV2.cases.cortmart.note}</p>
          <Link href="/sistema-para-barberias" className="text-link">
            {t.homeV2.navBarberias}
          </Link>
        </div>
      </article>

      {CASE_SLUGS.map((slug, i) => {
        const project = projects.find((p) => p.slug === slug);
        const data = t.projects.cases[slug];
        if (!project || !data) return null;
        return (
          <article
            key={slug}
            id={slug}
            className="grid scroll-mt-28 items-center gap-10 border-t border-ink/15 pt-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16"
          >
            <div className={`reveal ${i % 2 ? "reveal-right md:order-2" : "reveal-left"} min-w-0`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="section-title">{project.name}</h2>
                <p className="text-sm font-medium text-ink/60">{t.projects.descs[slug] || project.desc}</p>
              </div>
              <dl className="mt-8 grid gap-6">
                {(["problem", "decision", "result"] as const).map((key) => (
                  <div key={key} className="grid gap-1 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
                    <dt className="text-sm font-semibold text-ink/55">{labels[key]}</dt>
                    <dd className="text-base text-ink/80 md:text-lg">{data[key]}</dd>
                  </div>
                ))}
                <div className="grid gap-1 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
                  <dt className="text-sm font-semibold text-ink/55">{labels.metric}</dt>
                  <dd className="font-display text-xl font-medium text-ink md:text-2xl">{data.metric}</dd>
                </div>
              </dl>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-link mt-6 gap-1.5">
                {t.projects.visitSite}
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
            </div>
            <div className={`reveal ${i % 2 ? "reveal-left md:order-1" : "reveal-right"} rounded-card bg-[hsl(60_6%_92%)] px-6 py-10`}>
              <PhoneMockup src={mobileShot(slug)} alt={`Sitio de ${project.name} en un teléfono`} />
            </div>
          </article>
        );
      })}

      <div className="reveal flex flex-col items-start gap-4 border-t border-ink/15 pt-10">
        <h2 className="section-title">{t.homeV2.closing.title}</h2>
        <Button asChild size="lg" variant="lime" className="h-14 gap-2.5 px-7">
          <TrackedWhatsAppLink href={whatsapp} service="casos_cierre">
            <FaWhatsapp aria-hidden className="h-5 w-5" />
            {t.homeV2.hero.ctaWhatsapp}
          </TrackedWhatsAppLink>
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { useLanguage } from "@/lib/i18n/context";
import { CONFIGURATOR_PLANS, SOFTWARE_FROM, STUDIO_FACTS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const price = (id: string) => CONFIGURATOR_PLANS.find((p) => p.id === id)?.price ?? 0;
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * Precios: tres puntos de partida (Landing, Sitio completo y Software), cada
 * uno con 3 líneas de qué incluye y su WhatsApp prellenado. Los precios salen
 * de lib/catalog.ts. Debajo, los extras en una sola línea y la garantía y
 * formas de pago junto al precio. El titular de la columna izquierda
 * acompaña el scroll (sticky) en escritorio.
 */
export function HomePricing() {
  const { t } = useLanguage();
  const p = t.homeV2.pricing;
  const plans = [
    { id: "landing", data: p.plans.landing, amount: money(price("landing")), from: false, featured: false },
    { id: "site", data: p.plans.site, amount: money(price("full")), from: false, featured: true },
    { id: "software", data: p.plans.software, amount: money(SOFTWARE_FROM), from: true, featured: false },
  ];

  return (
    <section id="precios" aria-labelledby="precios-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-14">
      <header className="reveal lg:sticky-follow lg:self-start">
        <h2 id="precios-title" className="section-title">{p.title}</h2>
        <p className="mt-4 text-lg text-ink/65">{p.subtitle}</p>
        <ul className="mt-8 hidden flex-col gap-2 text-sm text-ink/65 lg:flex">
          {p.micro.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </header>

      <div className="flex min-w-0 flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <article
              key={plan.id}
              className={cn(
                "reveal lift-card flex flex-col rounded-card p-6 md:p-7",
                plan.featured ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10"
              )}
              style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{plan.data.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-ink">{p.recommended}</span>
                )}
              </div>
              <p className="mt-5 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums lg:text-[2.4rem] xl:text-5xl">
                {plan.from && <span className="mr-2 align-middle font-sans text-sm font-medium opacity-70">{p.from}</span>}
                {plan.amount}
                <span className="ml-1.5 inline-block align-middle font-sans text-sm font-medium opacity-60">MXN</span>
              </p>
              <ul className={cn("mt-6 flex flex-1 flex-col gap-2.5 text-[0.9375rem]", plan.featured ? "text-white/80" : "text-ink/75")}>
                {plan.data.bullets.map((b) => (
                  <li key={b} className="border-t border-current/10 pt-2.5 [border-color:currentColor] [border-top-color:color-mix(in_srgb,currentColor_15%,transparent)]">
                    {b}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                variant={plan.featured ? "lime" : "ink"}
                className="mt-7 h-12 w-full gap-2"
              >
                <TrackedWhatsAppLink
                  href={`https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(plan.data.msg)}`}
                  service={`precios_${plan.id}`}
                >
                  <FaWhatsapp aria-hidden className={cn("h-4 w-4", plan.featured ? "text-ink" : "text-lime")} />
                  {plan.data.cta}
                </TrackedWhatsAppLink>
              </Button>
            </article>
          ))}
        </div>

        <div className="reveal flex flex-col gap-3 border-t border-ink/15 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.9375rem] text-ink/75">{p.extras}</p>
          <Link href="/crear-web" className="text-link shrink-0">
            {p.extrasLink}
          </Link>
        </div>
        <ul className="flex flex-col gap-1.5 text-sm text-ink/65 lg:hidden">
          {p.micro.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

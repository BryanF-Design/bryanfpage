"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Check, ShieldCheck, Sparkle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { useLanguage } from "@/lib/i18n/context";
import { HOME_PRICING, STUDIO_FACTS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const fx = (ms: number) => ({ "--fx-delay": `${ms}ms` }) as CSSProperties;
const money = (mxn: number) => `$${mxn.toLocaleString("en-US")}`;

/**
 * Precios del inicio (#precios): tres tarjetas a la vista, cada una con lo
 * que incluye y su WhatsApp prellenado con el paquete. La recomendada va en
 * tinta. Debajo, los extras en una línea y las condiciones de pago. Los
 * números salen de `lib/catalog.ts`.
 */
export function HomePricing() {
  const { t } = useLanguage();
  const p = t.homeV3.pricing;

  return (
    <section id="precios" aria-label={p.title} className="panel relative p-5 shadow-soft sm:p-7 lg:p-10">
      <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

      <ul role="list" className="mt-8 grid gap-gutter md:grid-cols-3 lg:mt-10">
        {HOME_PRICING.map((tier, i) => {
          const copy = p.tiers[tier.id];
          const price = money(tier.price);
          const featured = tier.featured;
          const href = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(
            p.whatsappMsg(copy.name, `${tier.from ? `${p.from} ` : ""}${price} MXN`)
          )}`;
          return (
            <li key={tier.id} data-fx="right" style={fx(i * 90)} className="min-w-0">
              <article
                className={cn(
                  "price-card relative flex h-full flex-col gap-5 rounded-card p-5 sm:p-6 lg:p-7",
                  featured ? "panel-ink shadow-pop" : "bg-[hsl(var(--canvas))] ring-1 ring-ink/[0.06]"
                )}
              >
                {featured && (
                  <span className="-mb-2 inline-flex items-center gap-1.5 self-start rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
                    <Sparkle aria-hidden className="h-3.5 w-3.5 fill-ink" />
                    {p.recommended}
                  </span>
                )}
                <div>
                  <h3 className={cn("text-lg font-bold", featured ? "text-white" : "text-ink")}>{copy.name}</h3>
                  <p className={cn("mt-1 text-sm", featured ? "text-white/70" : "text-ink/65")}>{copy.line}</p>
                </div>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  {tier.from && (
                    <span className={cn("text-sm font-semibold", featured ? "text-white/70" : "text-ink/60")}>
                      {p.from}
                    </span>
                  )}
                  <span
                    className={cn(
                      "display-xl text-[clamp(2.75rem,5vw,4rem)] leading-[0.9]",
                      featured ? "text-lime" : "text-ink"
                    )}
                  >
                    {price}
                  </span>
                  <span className={cn("text-sm font-semibold", featured ? "text-white/70" : "text-ink/60")}>
                    {p.perProject}
                  </span>
                </p>
                <ul role="list" className="flex flex-col gap-2.5">
                  {copy.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug">
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                          featured ? "bg-lime text-ink" : "bg-ink text-lime"
                        )}
                      >
                        <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className={featured ? "text-white/85" : "text-ink/80"}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={featured ? "default" : "ink"}
                  className={cn("mt-auto w-full justify-between pr-2.5", featured && "bg-lime text-ink")}
                >
                  <TrackedWhatsAppLink href={href} service={`precios_${tier.id}`}>
                    <FaWhatsapp aria-hidden className={cn("h-5 w-5", featured ? "text-ink" : "text-lime")} />
                    {p.cta}
                    <ButtonArrow tone={featured ? "ink" : "lime"} className="ml-auto -mr-0.5" />
                  </TrackedWhatsAppLink>
                </Button>
              </article>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-3 text-sm leading-snug text-ink/70 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <p className="font-semibold text-ink">
          {p.extras}{" "}
          <Link href="/crear-web" className="ml-1 whitespace-nowrap text-forest underline decoration-lime decoration-2 underline-offset-4 hover:decoration-forest">
            {p.extrasLink}
          </Link>
        </p>
        <p className="flex items-start gap-2 lg:max-w-[46ch]">
          <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
          {p.micro}
        </p>
      </div>
    </section>
  );
}

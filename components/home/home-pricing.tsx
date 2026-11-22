"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Code2, LayoutTemplate, Settings2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { GestureIcon, type Gesture } from "@/components/ui/gesture-icon";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { useLanguage } from "@/lib/i18n/context";
import { CONFIGURATOR_PLANS, ENTRY_SERVICE_PRICES } from "@/lib/catalog";
import { cardLoader } from "@/lib/image-loaders";
import { desktopShot } from "@/lib/projects";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const planPrice = (id: string) => CONFIGURATOR_PLANS.find((p) => p.id === id)?.price;

/** Precio con un pulso lima suave al entrar en vista, una sola vez. */
function PriceTag({ children, from, label }: { children: string; from?: string; label?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <p ref={ref} className="relative mt-4 inline-flex items-baseline gap-2">
      <span aria-hidden className={cn("price-glow absolute -inset-x-4 -inset-y-2 rounded-full bg-lime/45", on && "is-on")} />
      {from && <span className="relative text-sm font-semibold opacity-70">{from}</span>}
      <span className="display-xl relative text-[clamp(2.75rem,4.4vw,3.75rem)] leading-none tabular-nums">{children}</span>
      <span className="relative text-sm font-semibold opacity-60">MXN{label ? ` ${label}` : ""}</span>
    </p>
  );
}

/**
 * Prompt 3 · Precios (id="precios"): Landing $2,000, Sitio completo $3,500
 * (recomendado, borde lima) y Software a medida desde $10,000. Cada tarjeta
 * con un sitio real adentro (imagen al 103% al hover), 3 líneas de qué
 * incluye y su WhatsApp prellenado. Entran escalonadas y el precio da un
 * pulso lima una vez. Debajo, los extras y la garantía/pagos al lado del
 * precio. Los precios salen de lib/catalog.ts (software: lista de precios).
 */
export function HomePricing() {
  const { t } = useLanguage();
  const p = t.v2.pricing;
  const plans: {
    id: string;
    data: (typeof p.plans)["landing"];
    amount: string;
    from?: boolean;
    featured?: boolean;
    shot: string;
    icon: typeof Code2;
    gesture: Gesture;
  }[] = [
    { id: "landing", data: p.plans.landing, amount: money(ENTRY_SERVICE_PRICES.find((e) => e.id === "landingEsencial")?.price ?? 2000), shot: desktopShot("mixteca-web-vercel-app"), icon: LayoutTemplate, gesture: "design" },
    { id: "site", data: p.plans.site, amount: money(planPrice("full") ?? 3500), featured: true, shot: desktopShot("koi-arquitectura-vercel-app"), icon: Code2, gesture: "code" },
    { id: "software", data: p.plans.software, amount: money(10000), from: true, shot: desktopShot("homeflowoficial-com"), icon: Settings2, gesture: "gear" },
  ];

  return (
    <section id="precios" aria-labelledby="precios-title" className="flex flex-col gap-gutter">
      <div className="panel px-5 pb-6 pt-7 shadow-soft sm:px-8 sm:pt-9 lg:px-10 lg:pt-12">
        <SectionHeading
          eyebrow={t.nav.precios}
          title={<span id="precios-title">{p.title}</span>}
          subtitle={p.micro.join(" · ")}
        />
      </div>

      <div className="grid gap-gutter md:grid-cols-3">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <article
              key={plan.id}
              className={cn(
                "reveal price-card panel flex flex-col overflow-hidden p-4 sm:p-5",
                plan.featured ? "panel-ink ring-2 ring-lime" : "shadow-soft"
              )}
              style={{ ["--stagger" as string]: i }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-inner bg-mint">
                <Image
                  src={plan.shot}
                  alt=""
                  fill
                  loader={cardLoader}
                  sizes="(min-width: 768px) 30vw, 92vw"
                  className="price-card__img object-cover object-top"
                />
                {plan.featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
                    {p.recommended}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                <div data-gesture-host className="flex items-center gap-3">
                  <span className={cn("grid size-10 place-items-center rounded-full", plan.featured ? "bg-lime text-ink" : "bg-ink text-lime")}>
                    <GestureIcon gesture={plan.gesture}>
                      <Icon aria-hidden className="h-5 w-5" />
                    </GestureIcon>
                  </span>
                  <h3 className="text-lg font-semibold">{plan.data.name}</h3>
                </div>
                <PriceTag from={plan.from ? p.from : undefined}>{plan.amount}</PriceTag>
                <ul className={cn("mt-5 flex flex-1 flex-col gap-2 text-[0.9375rem]", plan.featured ? "text-white/80" : "text-ink/75")}>
                  {plan.data.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  className={cn("mt-6 w-full gap-2", plan.featured ? "bg-lime text-ink" : "bg-ink text-white hover:-translate-y-0.5")}
                >
                  <TrackedWhatsAppLink
                    href={`https://wa.me/525663012505?text=${encodeURIComponent(plan.data.msg)}`}
                    service={`precios_${plan.id}`}
                  >
                    <GestureIcon gesture="heart">
                      <FaWhatsapp aria-hidden className={cn("h-4 w-4", plan.featured ? "text-ink" : "text-lime")} />
                    </GestureIcon>
                    {plan.data.cta}
                  </TrackedWhatsAppLink>
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="reveal reveal-up panel flex flex-col gap-3 px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-[0.9375rem] font-medium text-ink/80">{p.extras}</p>
        <Link href="/crear-web" className="nav-underline relative inline-flex min-h-11 shrink-0 items-center px-4 font-semibold text-ink">
          {p.extrasLink}
        </Link>
      </div>
    </section>
  );
}

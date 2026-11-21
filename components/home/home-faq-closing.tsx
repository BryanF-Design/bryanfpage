"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { useLanguage } from "@/lib/i18n/context";
import { STUDIO_FACTS } from "@/lib/catalog";

/**
 * FAQ de la home: 4 preguntas (tiempos, costos, qué se necesita y qué se
 * entrega), respuestas de 2 líneas máximo, con <details> nativo (sin JS).
 * El resto vive en /contacto. El FAQPage de la home se arma con estas mismas
 * preguntas (app/page.tsx).
 */
export function HomeFaq() {
  const { t } = useLanguage();
  const f = t.homeV2.faq;
  const whatsapp = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(t.homeV2.hero.whatsappMsg)}`;
  return (
    <section id="faq" aria-labelledby="faq-title" className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-14">
      <header className="reveal">
        <h2 id="faq-title" className="section-title">{f.title}</h2>
        <Link href="/contacto#faq" className="text-link mt-6 inline-block">
          {f.more}
        </Link>
      </header>
      <div className="reveal flex flex-col">
        {f.items.map((item) => (
          <details key={item.q} className="faq-item group border-t border-ink/15 last:border-b">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-xl font-medium md:text-2xl [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus aria-hidden className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="max-w-2xl pb-6 text-base text-ink/70 md:text-lg">{item.a}</p>
          </details>
        ))}
        <Button asChild size="lg" variant="ink" className="mt-8 h-14 gap-2.5 self-start px-7">
          <TrackedWhatsAppLink href={whatsapp} service="faq_whatsapp">
            <FaWhatsapp aria-hidden className="h-5 w-5 text-lime" />
            {t.homeV2.hero.ctaWhatsapp}
          </TrackedWhatsAppLink>
        </Button>
      </div>
    </section>
  );
}

/** Cierre: una pregunta, el botón grande de WhatsApp y el precio de entrada. */
export function HomeClosing() {
  const { t } = useLanguage();
  const c = t.homeV2.closing;
  const whatsapp = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(t.homeV2.hero.whatsappMsg)}`;
  return (
    <section aria-labelledby="cierre-title" className="reveal flex flex-col items-center py-10 text-center md:py-20">
      <h2 id="cierre-title" className="hero-title">{c.title}</h2>
      <Button asChild size="lg" variant="lime" className="lift mt-10 h-16 gap-3 px-9 text-lg">
        <TrackedWhatsAppLink href={whatsapp} service="cierre_quiero_mi_pagina">
          <FaWhatsapp aria-hidden className="h-6 w-6" />
          {c.cta}
        </TrackedWhatsAppLink>
      </Button>
      <p className="mt-6 text-base text-ink/65">{c.price}</p>
    </section>
  );
}

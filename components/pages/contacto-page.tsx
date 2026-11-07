"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { PageIntro } from "@/components/pages/page-intro";
import { SubPageShell } from "@/components/pages/sub-page-shell";
import { useLanguage } from "@/lib/i18n/context";

const WorldPresence = dynamic(() =>
  import("@/components/sections/world-presence").then((m) => m.WorldPresence)
);
const Faq = dynamic(() => import("@/components/sections/faq").then((m) => m.Faq));
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);

/**
 * /contacto — canales de contacto, todas las preguntas frecuentes y los
 * lugares donde hemos trabajado (los dos últimos, antes en el inicio).
 */
export function ContactoPage({ faqJsonLd }: { faqJsonLd: Record<string, unknown> }) {
  const { t } = useLanguage();
  const channels = [
    {
      Icon: FaWhatsapp,
      label: t.pages.contacto.whatsapp,
      value: t.closingCta.ctaSecondary,
      href: "https://wa.me/525663012505",
      external: true,
    },
    {
      Icon: Mail,
      label: t.pages.contacto.email,
      value: "bryanf@bryanfdesign.com",
      href: "mailto:bryanf@bryanfdesign.com",
      external: false,
    },
    {
      Icon: Phone,
      label: t.pages.contacto.phone,
      value: "+52 56 6301 2505",
      href: "tel:+525663012505",
      external: false,
    },
  ];

  return (
    <SubPageShell jsonLd={[faqJsonLd]}>
      <PageIntro
        eyebrow={t.pages.contacto.eyebrow}
        title={t.pages.contacto.title}
        subtitle={t.pages.contacto.subtitle}
        aside={
          <ul data-fx="stagger" className="flex flex-col gap-2">
            {channels.map(({ Icon, label, value, href, external }, i) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={
                    i === 0
                      ? "group flex min-h-16 items-center gap-4 rounded-card bg-lime p-3 pr-3.5 text-ink transition-transform duration-200 hover:-translate-y-0.5"
                      : "group flex min-h-16 items-center gap-4 rounded-card bg-mint p-3 pr-3.5 text-ink ring-1 ring-ink/[0.05] transition-transform duration-200 hover:-translate-y-0.5"
                  }
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-xs font-bold uppercase tracking-[0.08em] text-ink/60">{label}</span>
                    <span className="block break-words text-[0.975rem] font-semibold">{value}</span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 transition-colors group-hover:bg-ink group-hover:text-lime">
                    <ArrowUpRight aria-hidden className="h-4 w-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        }
      />
      <Faq chapter={1} />
      <WorldPresence chapter={2} />
      <ClosingCta />
    </SubPageShell>
  );
}

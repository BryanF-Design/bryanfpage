"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { trackEvent } from "@/lib/analytics";
import { HankoSeal } from "@/components/ui/hanko-seal";
import { TractionLine } from "@/components/ui/traction-line";

const GOOGLE_MAPS_REVIEW = "https://maps.app.goo.gl/CWNcgPfAZt31K3ey6";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
];

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

export function SiteFooter({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT, locale } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const activeLocale = spanishOnly ? "es" : locale;

  const nav = [
    { label: t.nav.inicio, href: "/" },
    { label: t.nav.proceso, href: "/#proceso" },
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.serviciosEntrada, href: "/#servicios-entrada" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  const services = [
    { label: t.footer.services.desarrolloWeb, href: "/desarrollo-web-mexico" },
    { label: t.footer.services.disenoWeb, href: "/diseno-web-mexico" },
    { label: t.footer.services.uxUi, href: "/diseno-ux-ui-mexico" },
    { label: t.footer.services.paginasNegocios, href: "/paginas-web-para-negocios" },
    { label: t.footer.services.softwareMedida, href: "/software-a-medida-mexico" },
    { label: t.footer.services.mantenimientoWeb, href: "/mantenimiento-web-mexico" },
  ];

  return (
    <footer
      id="site-footer"
      className="relative grid gap-gutter px-[var(--gutter)] pb-[var(--gutter)] md:grid-cols-2 lg:grid-cols-12"
      aria-label={t.footer.legalLabel}
    >
      {/* Marca */}
      <div data-fx="up" className="min-w-0 md:col-span-2 lg:col-span-4">
        <div className="panel flex h-full flex-col gap-6 overflow-hidden p-6 md:p-8">
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            sizes="140px"
            style={{ height: 44, width: "auto" }}
            className="self-start object-contain"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t.footer.tagline}</span>
            {t.footer.taglineRest}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            {social.map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground/75 transition-[background-color,color,transform] duration-300 [transition-timing-function:var(--ease-pop)] hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div data-fx="up" className="min-w-0 lg:col-span-2" style={{ "--fx-delay": "60ms" } as CSSProperties}>
        <nav aria-label={t.footer.navLabel} className="panel h-full p-6 md:p-7">
          <p className="tech-label mb-4 text-primary">{t.footer.navLabel}</p>
          <ul className="flex flex-col text-sm">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-11 min-w-11 items-center text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={CLIENT_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t.footer.clientQuestion}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Servicios */}
      <div data-fx="up" className="min-w-0 lg:col-span-3" style={{ "--fx-delay": "120ms" } as CSSProperties}>
        <nav aria-label={t.footer.servicesLabel} className="panel h-full p-6 md:p-7">
          <p className="tech-label mb-4 text-primary">{t.footer.servicesLabel}</p>
          <ul className="flex flex-col text-sm">
            {services.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-11 min-w-11 items-center text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Legal + contacto */}
      <div data-fx="up" className="min-w-0 md:col-span-2 lg:col-span-3" style={{ "--fx-delay": "180ms" } as CSSProperties}>
        <div className="panel panel-moss h-full p-6 md:p-7">
          <p className="tech-label mb-4 text-primary">{t.footer.legalLabel}</p>
          <ul className="flex flex-col text-sm">
            <li>
              <Link href="/privacidad" className="inline-flex min-h-11 min-w-11 items-center text-foreground/80 transition-colors hover:text-primary">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="inline-flex min-h-11 min-w-11 items-center text-foreground/80 transition-colors hover:text-primary">
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <a href="tel:+525663012505" className="inline-flex min-h-11 min-w-11 items-center text-foreground/80 transition-colors hover:text-primary">
                +52 56 6301 2505
              </a>
            </li>
            <li>
              <a href="mailto:bryanf@bryanfdesign.com.mx" className="inline-flex min-h-11 min-w-11 items-center break-all text-foreground/80 transition-colors hover:text-primary">
                bryanf@bryanfdesign.com.mx
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/525663012505"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("generate_lead", { method: "whatsapp", location: "footer" })}
                className="inline-flex min-h-11 min-w-11 items-center text-foreground/80 transition-colors hover:text-primary"
              >
                {t.closingCta.ctaSecondary}
              </a>
            </li>
            <li>
              <a
                href={GOOGLE_MAPS_REVIEW}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t.footer.reviewGoogle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Firma: el nombre a lo ancho de la hoja y la barra legal. */}
      <div data-fx="panel" className="min-w-0 md:col-span-2 lg:col-span-12">
        <div className="panel relative overflow-hidden">
          <TractionLine className="pointer-events-none absolute -bottom-10 right-0 hidden h-52 w-[min(760px,85vw)] opacity-[0.12] md:block" />
          <p
            aria-hidden
            className="display-xl drift-x-rev select-none whitespace-nowrap px-4 pt-6 text-[19vw] leading-[0.78] text-foreground/[0.07] md:pt-8"
          >
            BryanF Design
          </p>
          <div className="relative grid items-center gap-4 border-t border-foreground/10 px-6 py-5 text-xs text-muted-foreground sm:grid-cols-[1fr_auto] md:px-8 lg:grid-cols-[1fr_auto_1fr]">
            <span className="flex items-center gap-4">
              <HankoSeal label={t.footer.signatureLabel} />
              {t.footer.copyright(new Date().getFullYear())}
            </span>
            <span className="hidden text-center font-mono text-[9px] uppercase tracking-[0.2em] text-primary lg:block">
              <span lang="ja">精度</span> / SEIDO
              {activeLocale === "ja" ? null : ` / ${t.experience.precision}`}
            </span>
            <span className="sm:text-right">
              {t.footer.acceptPrefix}{" "}
              <Link href="/privacidad" className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-primary">
                {t.footer.privacy}
              </Link>{" "}
              {t.footer.and}{" "}
              <Link href="/terminos" className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-primary">
                {t.footer.terms}
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

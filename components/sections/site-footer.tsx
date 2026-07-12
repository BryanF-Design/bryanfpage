"use client";

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
import { trackEvent } from "@/lib/analytics";

const GOOGLE_MAPS_REVIEW = "https://maps.app.goo.gl/CWNcgPfAZt31K3ey6";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram", glow: "#E1306C" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook", glow: "#1877F2" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp", glow: "#25D366" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn", glow: "#0A66C2" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub", glow: "#FFFFFF" },
];

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

export function SiteFooter() {
  const { t } = useLanguage();

  const nav = [
    { label: t.nav.inicio, href: "/" },
    { label: t.nav.proceso, href: "/#proceso" },
    { label: t.nav.proyectos, href: "/#projects" },
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
    <footer id="site-footer" className="relative overflow-hidden border-t border-border bg-background" aria-label={t.footer.legalLabel}>
      <div aria-hidden className="mesh-glow-b opacity-40" />
      <div className="container relative grid gap-10 py-14 md:grid-cols-[1.3fr_0.85fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            style={{ height: 46, width: "auto" }}
            className="object-contain"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t.footer.tagline}</span>
            {t.footer.taglineRest}
          </p>
          <div className="flex gap-3">
            {social.map(({ Icon, href, label, glow }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ ["--glow" as string]: glow }}
                className="glass elevate flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:border-[var(--glow)] hover:text-[var(--glow)] hover:shadow-[0_0_16px_var(--glow)]"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav aria-label={t.footer.navLabel}>
          <p className="tech-label mb-4 text-muted-foreground">
            {t.footer.navLabel}
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-foreground/80 transition-colors hover:text-primary"
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
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t.footer.clientQuestion}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t.footer.servicesLabel}>
          <p className="tech-label mb-4 text-muted-foreground">
            {t.footer.servicesLabel}
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            {services.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal + contacto */}
        <div>
          <p className="tech-label mb-4 text-muted-foreground">
            {t.footer.legalLabel}
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/privacidad" className="text-foreground/80 transition-colors hover:text-primary">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="text-foreground/80 transition-colors hover:text-primary">
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <a href="tel:+525663012505" className="text-foreground/80 transition-colors hover:text-primary">
                +52 56 6301 2505
              </a>
            </li>
            <li>
              <a href="mailto:bryanf@bryanfdesign.com.mx" className="text-foreground/80 transition-colors hover:text-primary">
                bryanf@bryanfdesign.com.mx
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/525663012505"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("generate_lead", { method: "whatsapp", location: "footer" })}
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                {t.closingCta.ctaSecondary}
              </a>
            </li>
            <li>
              <a
                href={GOOGLE_MAPS_REVIEW}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t.footer.reviewGoogle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>{t.footer.copyright(new Date().getFullYear())}</span>
          <span>
            {t.footer.acceptPrefix}{" "}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-primary">
              {t.footer.privacy}
            </Link>{" "}
            {t.footer.and}{" "}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-primary">
              {t.footer.terms}
            </Link>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}

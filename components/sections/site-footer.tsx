"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, LogIn, Mail, Phone, Star } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const GOOGLE_MAPS_REVIEW = "https://maps.app.goo.gl/CWNcgPfAZt31K3ey6";
const WHATSAPP = "https://wa.me/525663012505";

const social = [
  {
    Icon: FaInstagram,
    href: "https://www.instagram.com/bryanf_design/",
    label: "Instagram",
  },
  {
    Icon: FaFacebookF,
    href: "https://www.facebook.com/share/1R1rS2ToKf/",
    label: "Facebook",
  },
  { Icon: FaWhatsapp, href: WHATSAPP, label: "WhatsApp" },
  {
    Icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/bryanfdesigner",
    label: "LinkedIn",
  },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
];

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

const linkClass =
  "group/link inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] text-white/70 transition-colors hover:text-white lg:min-h-10";
// En teléfono las listas de enlaces son chips (como los filtros de las
// referencias); desde sm vuelven a ser columnas de texto.
const chipListClass = "flex flex-wrap gap-2 sm:flex-col sm:gap-0";
const chipLinkClass =
  "group/link inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/[0.06] px-4 text-[0.9375rem] text-white/80 ring-1 ring-white/10 transition-colors hover:text-white sm:rounded-none sm:bg-transparent sm:px-0 sm:text-white/70 sm:ring-0 lg:min-h-10";
const headingClass =
  "mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-lime";

/** Flecha que asoma al pasar el puntero por un enlace de columna. */
function LinkArrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="hidden h-3.5 w-3.5 -translate-x-1 text-lime opacity-0 transition-[opacity,transform] duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100 sm:block"
    />
  );
}

/**
 * Pie de página — un panel de tinta dentro de los márgenes de la página.
 * Marca, frase y redes a la izquierda; navegación, servicios y contacto en
 * columnas; la reseña de Google como fila tipo app; el nombre a todo lo ancho
 * (ajustado con unidades de contenedor) y la barra legal con "volver arriba".
 * `spanishOnly` fuerza el diccionario en español (páginas SEO en español).
 */
export function SiteFooter({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const reducedMotion = useReducedMotionPreference();

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
    {
      label: t.footer.services.paginasNegocios,
      href: "/paginas-web-para-negocios",
    },
    {
      label: t.footer.services.softwareMedida,
      href: "/software-a-medida-mexico",
    },
    {
      label: t.footer.services.mantenimientoWeb,
      href: "/mantenimiento-web-mexico",
    },
  ];

  const contact = [
    {
      Icon: Phone,
      label: "+52 56 6301 2505",
      href: "tel:+525663012505",
      external: false,
    },
    {
      Icon: Mail,
      // <wbr>: si la columna es angosta, el correo corta en la arroba.
      label: (
        <>
          bryanf@
          <wbr />
          bryanfdesign.com.mx
        </>
      ),
      href: "mailto:bryanf@bryanfdesign.com.mx",
      external: false,
    },
    {
      Icon: FaWhatsapp,
      label: t.closingCta.ctaSecondary,
      href: WHATSAPP,
      external: true,
    },
  ];

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <footer
      id="site-footer"
      aria-label={t.footer.legalLabel}
      className="mx-auto w-full max-w-[1520px] px-[var(--gutter)] pb-[var(--gutter)]"
    >
      <div data-fx="panel">
        <div className="panel panel-ink overflow-hidden px-5 pb-5 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pb-8 lg:pt-14">
          <div aria-hidden className="mesh-glow-a opacity-60" />

          <div className="relative grid gap-10 xl:grid-cols-12 xl:gap-8">
            {/* Marca, frase, redes y reseña. */}
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between xl:col-span-4 xl:flex-col xl:items-start xl:justify-start">
              <div className="flex flex-col items-start gap-6">
                <Link
                  href="/"
                  className="rounded-full"
                  aria-label="BryanF Design — inicio"
                >
                  <Image
                    src="/img/brand/logo-light.png"
                    alt="BryanF Design"
                    width={720}
                    height={253}
                    sizes="150px"
                    className="h-11 w-auto md:h-12"
                  />
                </Link>
                <p className="max-w-sm text-pretty text-lg leading-snug text-white/65">
                  <span className="font-serif text-[1.35em] italic leading-none text-lime">
                    {t.footer.tagline}
                  </span>
                  {t.footer.taglineRest}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {social.map(({ Icon, href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="grid size-11 place-items-center rounded-full bg-white/[0.08] text-white ring-1 ring-white/10 transition-[background-color,color,transform] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:bg-lime hover:text-ink"
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Reseña en Google: fila tipo app con icono redondo y flecha. */}
              <a
                href={GOOGLE_MAPS_REVIEW}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-1 flex w-full max-w-md items-center gap-4 rounded-card bg-white/[0.06] p-3 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1] sm:p-3.5 lg:max-w-sm xl:max-w-md"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white">
                  <FcGoogle aria-hidden className="h-6 w-6" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span aria-hidden className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-lime text-lime" />
                    ))}
                  </span>
                  <span className="text-[0.9375rem] font-semibold leading-snug text-white">
                    {t.footer.reviewGoogle}
                  </span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight aria-hidden className="h-5 w-5" />
                </span>
              </a>
            </div>

            <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1.3fr] lg:gap-8 xl:col-span-8">
              {/* Navegación */}
              <nav aria-label={t.footer.navLabel} className="min-w-0">
                <p className={headingClass}>{t.footer.navLabel}</p>
                <ul className={chipListClass}>
                  {nav.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={chipLinkClass}>
                        {l.label}
                        <LinkArrow />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={CLIENT_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-lime/40 px-4 text-sm font-semibold text-lime transition-colors hover:bg-lime hover:text-ink"
                >
                  <LogIn aria-hidden className="h-4 w-4" />
                  {t.footer.clientQuestion}
                </Link>
              </nav>

              {/* Servicios */}
              <nav aria-label={t.footer.servicesLabel} className="min-w-0">
                <p className={headingClass}>{t.footer.servicesLabel}</p>
                <ul className={chipListClass}>
                  {services.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={chipLinkClass}>
                        {l.label}
                        <LinkArrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Legal y contacto */}
              <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                <p className={headingClass}>{t.footer.legalLabel}</p>
                <ul className="flex flex-col gap-1">
                  {contact.map(({ Icon, label, href, external }) => (
                    <li key={href}>
                      <a
                        href={href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group/link flex min-h-11 items-center gap-3 text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-lime transition-colors group-hover/link:bg-lime group-hover/link:text-ink">
                          <Icon aria-hidden className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 break-words">{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="mt-3 flex flex-col border-t border-white/10 pt-2">
                  <li>
                    <Link href="/privacidad" className={linkClass}>
                      {t.footer.privacy}
                      <LinkArrow />
                    </Link>
                  </li>
                  <li>
                    <Link href="/terminos" className={linkClass}>
                      {t.footer.terms}
                      <LinkArrow />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* El nombre a todo lo ancho; el tamaño sale del ancho del panel. */}
          <div className="relative mt-12 [container-type:inline-size] lg:mt-16">
            {/* Teléfono: dos líneas; desde sm: una sola. El tamaño en `cqw`
                sobrescribe al de `vw` donde el navegador lo soporta. */}
            <p
              aria-hidden
              className="display-xl select-none whitespace-nowrap text-[28vw] leading-[0.8] sm:hidden"
            >
              <span
                className="block text-white"
                style={{ fontSize: "30.3cqw" }}
              >
                BryanF
              </span>
              <span className="block text-lime" style={{ fontSize: "31.8cqw" }}>
                Design
              </span>
            </p>
            <p
              aria-hidden
              className="display-xl hidden select-none whitespace-nowrap text-[14vw] leading-[0.8] sm:block"
              style={{ fontSize: "15.25cqw" }}
            >
              <span className="text-white">BryanF </span>
              <span className="text-lime">Design</span>
            </p>
          </div>

          {/* Barra legal */}
          <div className="relative mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:gap-6">
            <span>{t.footer.copyright(new Date().getFullYear())}</span>
            <span className="md:text-right">
              {t.footer.acceptPrefix}{" "}
              <Link
                href="/privacidad"
                className="underline underline-offset-2 transition-colors hover:text-lime"
              >
                {t.footer.privacy}
              </Link>{" "}
              {t.footer.and}{" "}
              <Link
                href="/terminos"
                className="underline underline-offset-2 transition-colors hover:text-lime"
              >
                {t.footer.terms}
              </Link>
              .
            </span>
            <button
              type="button"
              onClick={backToTop}
              className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-white/[0.08] pl-4 pr-1.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-white/[0.14]"
            >
              {t.nav.backToTop}
              <span className="grid size-8 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:-translate-y-0.5">
                <ArrowUp aria-hidden className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

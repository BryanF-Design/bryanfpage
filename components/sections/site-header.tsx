"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { STUDIO_FACTS } from "@/lib/catalog";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { useFooterInView } from "@/lib/use-footer-in-view";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion-presets";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
];

/**
 * Barra superior fija sobre el lienzo crema: logotipo real a la izquierda,
 * menú (Servicios, Casos, Barberías, Conóceme, Precios) y el botón de
 * WhatsApp siempre visible a la derecha. El acceso de clientes vive en el
 * pie. Por debajo de 1024 px la navegación va en una hoja que baja desde la
 * barra.
 */
export function SiteHeader({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const reducedMotion = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // Al llegar al pie (que crece a pantalla completa) el header se retira
  // hacia arriba; vuelve en cuanto se sube. Con el menú abierto no se va.
  const footerInView = useFooterInView();
  const hidden = footerInView && !open;
  const headerRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const services = [
    { label: t.footer.services.paginasNegocios, href: "/paginas-web-para-negocios" },
    { label: t.footer.services.disenoWeb, href: "/diseno-web-mexico" },
    { label: t.footer.services.desarrolloWeb, href: "/desarrollo-web-mexico" },
    { label: t.footer.services.uxUi, href: "/diseno-ux-ui-mexico" },
    { label: t.footer.services.softwareMedida, href: "/software-a-medida-mexico" },
    { label: t.footer.services.mantenimientoWeb, href: "/mantenimiento-web-mexico" },
  ];
  const links = [
    { label: t.homeV2.navCasos, href: "/casos" },
    { label: t.homeV2.navBarberias, href: "/sistema-para-barberias" },
    { label: t.homeV2.navConoceme, href: "/conoceme" },
    { label: t.nav.precios, href: "/#precios" },
  ];
  const whatsappHref = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(t.homeV2.hero.whatsappMsg)}`;
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // El menú se comporta como un diálogo: bloquea el scroll de fondo, atrapa
  // el foco, se cierra con Escape y aparta los botones flotantes.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus());
        return;
      }
      if (e.key === "Tab") {
        const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = [headerRef.current, menuPanelRef.current]
          .flatMap((region) =>
            region ? Array.from(region.querySelectorAll<HTMLElement>(selector)) : []
          )
          .filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    const focusTimer = window.setTimeout(() => firstMenuLinkRef.current?.focus());
    window.addEventListener("keydown", onKey);
    desktopQuery.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove("menu-open");
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      desktopQuery.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[100] px-[var(--gutter)] pt-[calc(var(--gutter)*0.75)] transition-[transform,visibility] duration-500 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none md:pt-[var(--gutter)]",
          hidden && "invisible -translate-y-[calc(100%+1rem)]"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 rounded-[18px] px-3 transition-[background-color,box-shadow] duration-300 md:h-[4.5rem] md:px-5",
            scrolled || open
              ? "bg-[hsl(var(--canvas)/0.92)] shadow-[0_0_0_1px_hsl(var(--ink)/0.07)] backdrop-blur-md"
              : "bg-transparent"
          )}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex h-12 shrink-0 items-center px-1"
            aria-label="Inicio de BryanF Design"
          >
            {/* Logotipo real (texto con slash lima), en su proporción 720:253. */}
            <Image
              src="/img/brand/logo-dark.png"
              alt="BryanF Design"
              width={720}
              height={253}
              priority
              sizes="(min-width: 768px) 128px, 108px"
              className="h-[38px] w-auto md:h-[45px]"
            />
          </Link>

          <nav
            aria-label={t.nav.menu}
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => {
              setHovered(null);
              setServicesOpen(false);
            }}
          >
            <div className="relative" onMouseEnter={() => setServicesOpen(true)}>
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="nav-services"
                onClick={() => setServicesOpen((v) => !v)}
                onKeyDown={(e) => e.key === "Escape" && setServicesOpen(false)}
                className="inline-flex h-10 items-center gap-1 rounded-full px-4 text-[0.9375rem] font-medium text-ink/75 transition-colors hover:text-ink"
              >
                {t.homeV2.navServicios}
                <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
              </button>
              {servicesOpen && (
                <ul
                  id="nav-services"
                  className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white p-2 shadow-float ring-1 ring-ink/[0.06]"
                >
                  {services.map((sv) => (
                    <li key={sv.href}>
                      <Link
                        href={sv.href}
                        onClick={() => setServicesOpen(false)}
                        className="block rounded-xl px-3 py-2.5 text-[0.9375rem] text-ink/80 transition-colors hover:bg-ink/[0.05] hover:text-ink"
                      >
                        {sv.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="relative inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium text-ink/75 transition-colors hover:text-ink"
              >
                {hovered === i && (
                  <motion.span
                    layoutId={reducedMotion ? undefined : "nav-hover-pill"}
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-ink/[0.06]"
                    transition={SPRING}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {!spanishOnly && <LanguageSwitcher />}
            {/* WhatsApp siempre visible (también en teléfono, solo el ícono). */}
            <Button asChild variant="ink" className="h-11 gap-2 px-3.5 sm:px-5">
              <TrackedWhatsAppLink href={whatsappHref} service="header_whatsapp">
                <FaWhatsapp aria-hidden className="h-5 w-5 text-lime" />
                <span className="sr-only sm:not-sr-only">{t.homeV2.hero.ctaWhatsapp}</span>
              </TrackedWhatsAppLink>
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t.nav.closeMenu : t.nav.menu}
              aria-controls="mobile-site-menu"
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full bg-ink text-white transition-transform active:scale-95 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuPanelRef}
            id="mobile-site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 0%" }}
            className="fixed inset-x-[var(--gutter)] bottom-[var(--gutter)] top-[calc(var(--gutter)*0.75+4.25rem)] z-[99] flex flex-col overflow-y-auto rounded-panel bg-white shadow-[0_30px_80px_-30px_hsl(var(--ink)/0.5)] lg:hidden"
          >
            <nav aria-label={t.nav.menu} className="flex flex-1 flex-col px-5 pb-6 pt-4 sm:px-8">
              <ul className="flex flex-col">
                <li className="border-b border-ink/[0.07] py-3">
                  <span className="display-title block text-[clamp(1.75rem,8vw,2.75rem)] text-ink">
                    {t.homeV2.navServicios}
                  </span>
                  <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                    {services.map((sv, i) => (
                      <li key={sv.href}>
                        <Link
                          ref={i === 0 ? firstMenuLinkRef : undefined}
                          href={sv.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center text-base text-ink/75 hover:text-ink"
                        >
                          {sv.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reducedMotion ? 0 : 0.04 + i * 0.04,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-ink/[0.07]"
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-[4rem] items-center justify-between gap-4 py-2"
                    >
                      <span className="display-title text-[clamp(1.75rem,8vw,2.75rem)] text-ink">
                        {l.label}
                      </span>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/[0.05] text-ink transition-colors group-hover:bg-lime">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                <Button asChild size="lg" variant="ink" className="w-full gap-2 sm:flex-1">
                  <TrackedWhatsAppLink href={whatsappHref} service="menu_whatsapp">
                    <FaWhatsapp aria-hidden className="h-5 w-5 text-lime" />
                    {t.homeV2.hero.ctaWhatsapp}
                  </TrackedWhatsAppLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:flex-1">
                  <Link href="/#precios" onClick={() => setOpen(false)}>
                    {t.homeV2.hero.ctaPrices}
                  </Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-medium text-ink/55">CDMX · México</span>
                <div className="flex gap-2">
                  {social.map(({ Icon, href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid size-11 place-items-center rounded-full bg-ink/[0.05] text-ink/70 transition-colors hover:bg-lime hover:text-ink"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            {/* Con aria-modal el botón de la barra queda fuera del diálogo para
                los lectores de pantalla: este cierre lo repite por dentro. */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.setTimeout(() => menuButtonRef.current?.focus());
              }}
              className="sr-only focus:not-sr-only focus:mx-5 focus:mb-5 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
            >
              {t.nav.closeMenu}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

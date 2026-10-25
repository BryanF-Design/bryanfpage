"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LogIn } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { useFooterInView } from "@/lib/use-footer-in-view";
import { cn } from "@/lib/utils";
import { SeasonBadge } from "@/components/season/season-badge";
import { SeasonStrip } from "@/components/season/season-strip";

// Panel de los suscriptores, dentro del mismo sitio.
const CLIENT_PORTAL = "/mi-panel";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
];

/**
 * Barra flotante: una píldora blanca con la marca, la navegación y las
 * acciones, como la cabecera de las referencias. Gana sombra al hacer
 * scroll. Por debajo de 1024 px la navegación vive en una hoja tinta que se
 * revela desde el botón del menú, con los enlaces numerados en rótulo grande.
 */
export function SiteHeader({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const reducedMotion = useReducedMotionPreference();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // Al llegar al pie (que crece a pantalla completa) el header se retira
  // hacia arriba; vuelve en cuanto se sube. Con el menú abierto no se va, y
  // en páginas cortas (el pie ya se ve arriba) tampoco: solo si ya se bajó.
  const footerInView = useFooterInView();
  const hidden = footerInView && !open && scrolled;
  const headerRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const links = [
    // El sitio se dividió en páginas: la home (trabajo, cotización y dudas),
    // la suscripción, Lumina y Conoce a Bryan.
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.suscripcion, href: "/suscripcion" },
    { label: t.nav.lumina, href: "/lumina" },
    { label: t.nav.conoce, href: "/conoce-a-bryan" },
  ];

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
            "pointer-events-auto mx-auto flex h-[3.75rem] max-w-[1488px] items-center justify-between gap-3 rounded-full bg-white pl-3 pr-2 ring-1 ring-ink/[0.06] transition-shadow duration-300 md:h-16 md:pl-4",
            scrolled || open
              ? "shadow-[0_18px_40px_-22px_hsl(var(--shade)/0.45)]"
              : "shadow-[0_8px_24px_-20px_hsl(var(--shade)/0.3)]"
          )}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="relative flex h-11 shrink-0 items-center rounded-full px-1"
            aria-label="BryanF Design — inicio"
            data-lumina="logo"
          >
            <Image
              src="/img/brand/logo-dark.png"
              alt="BryanF Design"
              width={720}
              height={253}
              priority
              sizes="(min-width: 768px) 128px, 112px"
              className="logo-invert h-[2.1rem] w-auto md:h-10"
            />
            <SeasonBadge />
          </Link>

          <nav
            aria-label={t.nav.menu}
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="relative inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-semibold text-ink/75 transition-colors hover:text-ink xl:px-5"
              >
                {hovered === i && (
                  <motion.span
                    layoutId={reducedMotion ? undefined : "nav-hover-pill"}
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-ink/[0.06]"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {!spanishOnly && (
              <span data-lumina="idioma" className="contents">
                <LanguageSwitcher />
              </span>
            )}
            <Link
              href={CLIENT_PORTAL}
              className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/75 transition-colors hover:bg-ink/[0.05] hover:text-ink xl:inline-flex"
            >
              <LogIn className="h-4 w-4" />
              {t.nav.cliente}
            </Link>
            <Button asChild variant="ink" className="hidden h-11 pl-5 pr-2 sm:inline-flex">
              <Link href="/#precios" data-lumina="arma-tu-web">
                {t.nav.armaTuWeb}
                <ButtonArrow tone="lime" className="-mr-0.5" />
              </Link>
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t.nav.closeMenu : t.nav.menu}
              aria-controls="mobile-site-menu"
              aria-expanded={open}
              className="menu-toggle relative grid size-11 place-items-center rounded-full bg-ink text-white transition-transform active:scale-95 lg:hidden"
              data-open={open}
            >
              {/* Tres líneas que se vuelven una ×. */}
              <span aria-hidden className="menu-toggle-lines">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
        <SeasonStrip hidden={scrolled || open} />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuPanelRef}
            id="mobile-site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            // Se revela en un círculo que nace del botón del menú (arriba a la
            // derecha) y se recoge hacia él al cerrar.
            initial={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.6rem) -1.6rem)" }}
            animate={reducedMotion ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 2.6rem) -1.6rem)" }}
            exit={reducedMotion ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.6rem) -1.6rem)" }}
            transition={{ duration: reducedMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-menu fixed inset-x-[var(--gutter)] bottom-[var(--gutter)] top-[calc(var(--gutter)*0.75+4.25rem)] z-[99] flex flex-col overflow-y-auto overscroll-contain rounded-panel bg-ink text-white shadow-[0_30px_80px_-30px_hsl(var(--shade)/0.6)] lg:hidden"
          >
            <span aria-hidden className="mobile-menu-glow" />
            <nav aria-label={t.nav.menu} className="relative flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">{t.nav.menu}</p>
              <ul className="flex flex-col">
                {links.map((l, i) => {
                  const current = l.href.startsWith("/#") ? false : pathname === l.href;
                  return (
                    <motion.li
                      key={l.href}
                      initial={reducedMotion ? false : { opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reducedMotion ? 0 : 0.12 + i * 0.05,
                        duration: 0.42,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="border-b border-white/[0.08]"
                    >
                      <Link
                        ref={i === 0 ? firstMenuLinkRef : undefined}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={current ? "page" : undefined}
                        className="group flex min-h-[4.25rem] items-center gap-4 py-2"
                      >
                        <span className="w-7 shrink-0 text-xs font-bold tabular-nums text-lime/80">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "display-title flex-1 text-[clamp(2rem,9vw,3.25rem)] transition-[color,transform] duration-300 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1 group-active:translate-x-1",
                            current ? "text-lime" : "text-white"
                          )}
                        >
                          {l.label}
                        </span>
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white transition-[background-color,color,transform] duration-300 group-hover:rotate-45 group-hover:bg-lime group-hover:text-ink">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.38, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-auto grid grid-cols-2 gap-2.5 pt-8"
              >
                <Link
                  href="/#precios"
                  onClick={() => setOpen(false)}
                  className="group flex min-h-[6.5rem] flex-col justify-between rounded-card bg-lime p-4 text-ink transition-transform active:scale-[0.98]"
                >
                  <ButtonArrow tone="ink" className="ml-0 self-end transition-transform group-hover:-rotate-45" />
                  <span className="text-[1.0625rem] font-bold leading-tight">{t.nav.armaTuWeb}</span>
                </Link>
                <Link
                  href={CLIENT_PORTAL}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-[6.5rem] flex-col justify-between rounded-card bg-white/[0.08] p-4 text-white ring-1 ring-inset ring-white/10 transition-[transform,background-color] hover:bg-white/[0.12] active:scale-[0.98]"
                >
                  <LogIn className="h-5 w-5 self-end text-lime" />
                  <span className="text-[1.0625rem] font-bold leading-tight">{t.nav.cliente}</span>
                </Link>
              </motion.div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-medium text-white/55">CDMX · México</span>
                <div className="flex gap-2">
                  {social.map(({ Icon, href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid size-11 place-items-center rounded-full bg-white/[0.08] text-white/75 transition-colors hover:bg-lime hover:text-ink"
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
              className="sr-only focus:not-sr-only focus:mx-5 focus:mb-5 focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
            >
              {t.nav.closeMenu}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

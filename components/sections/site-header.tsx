"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

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
 * scroll. Por debajo de 1024 px la navegación vive en una hoja que baja
 * desde la barra, con los enlaces en rótulo grande.
 */
export function SiteHeader({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const reducedMotion = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const links = [
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.servicios, href: "/#servicios-entrada" },
    { label: t.nav.lumina, href: "/#lumina" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.faq, href: "/#faq" },
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
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-[var(--gutter)] pt-[calc(var(--gutter)*0.75)] md:pt-[var(--gutter)]"
      >
        <div
          className={cn(
            "pointer-events-auto mx-auto flex h-[3.75rem] max-w-[1488px] items-center justify-between gap-3 rounded-full bg-white/95 pl-4 pr-2 ring-1 ring-ink/[0.06] transition-shadow duration-300 md:h-16 md:pl-5",
            scrolled || open
              ? "shadow-[0_18px_40px_-22px_hsl(var(--ink)/0.45)]"
              : "shadow-[0_8px_24px_-20px_hsl(var(--ink)/0.3)]"
          )}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center rounded-full"
            aria-label="BryanF Design — inicio"
          >
            <Image
              src="/img/brand/logo-dark.png"
              alt="BryanF Design"
              width={720}
              height={253}
              priority
              sizes="120px"
              className="h-7 w-auto md:h-8"
            />
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
            {!spanishOnly && <LanguageSwitcher />}
            <Link
              href={CLIENT_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/75 transition-colors hover:bg-ink/[0.05] hover:text-ink xl:inline-flex"
            >
              <LogIn className="h-4 w-4" />
              {t.nav.cliente}
            </Link>
            <Button asChild variant="ink" className="hidden h-11 pl-5 pr-2 sm:inline-flex">
              <Link href="/#precios">
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
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 0%" }}
            className="fixed inset-x-[var(--gutter)] bottom-[var(--gutter)] top-[calc(var(--gutter)*0.75+4.25rem)] z-[99] flex flex-col overflow-y-auto rounded-panel bg-white shadow-[0_30px_80px_-30px_hsl(var(--ink)/0.5)] lg:hidden"
          >
            <nav aria-label={t.nav.menu} className="flex flex-1 flex-col px-5 pb-6 pt-4 sm:px-8">
              <ul className="flex flex-col">
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
                      ref={i === 0 ? firstMenuLinkRef : undefined}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-[4.25rem] items-center justify-between gap-4 py-2"
                    >
                      <span className="display-title text-[clamp(2rem,9vw,3.25rem)] text-ink">
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
                <Button asChild size="lg" variant="ink" className="w-full pr-2 sm:flex-1">
                  <Link href="/#precios" onClick={() => setOpen(false)}>
                    {t.nav.armaTuWeb}
                    <ButtonArrow tone="lime" className="ml-auto -mr-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:flex-1">
                  <Link
                    href={CLIENT_PORTAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    {t.nav.cliente}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

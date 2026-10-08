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

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
];

/**
 * La cabecera no flota sobre la página: está recortada en ella. Tres
 * pestañas de washi cuelgan del canto superior de la hoja y cada una sostiene
 * sus píldoras de tinta — la marca, la navegación y las acciones. Lo que
 * pasa por debajo (el hero, los paneles) se lee como cortado alrededor.
 *
 * Por debajo de 1024 px la navegación se muda a un panel que entra desde
 * fuera del lienzo, con los enlaces en rótulo gigante.
 */
export function SiteHeader({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const reducedMotion = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const links = [
    { label: t.nav.lumina, href: "/#lumina" },
    { label: t.nav.servicios, href: "/#servicios-entrada" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  // Bloquea el scroll de fondo mientras el menú está abierto y ciérralo
  // con Escape — el panel se comporta como un diálogo de verdad.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Los botones flotantes se apartan mientras el menú ocupa la pantalla.
    document.documentElement.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus());
        return;
      }
      if (e.key === "Tab") {
        const selector =
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = [headerRef.current, menuPanelRef.current]
          .flatMap((region) =>
            region
              ? Array.from(region.querySelectorAll<HTMLElement>(selector))
              : []
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
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] grid grid-cols-[minmax(0,1fr)_auto] items-start lg:grid-cols-[1fr_auto_1fr]"
      >
        {/* Pestaña izquierda: la marca. */}
        <div className="tab tab-l justify-self-start">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="nav-pill group gap-2.5 px-4 transition-transform duration-150 hover:-translate-y-0.5"
            aria-label="BryanF Design — inicio"
          >
            <span
              aria-hidden
              className="px-blink size-2.5 bg-primary motion-reduce:animate-none"
            />
            <Image
              src="/img/logotipo-blanco.png"
              alt="BryanF Design"
              width={2904}
              height={1016}
              priority
              sizes="(max-width: 767px) 80px, 92px"
              style={{ height: 26, width: "auto" }}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Pestaña central: la navegación, con una píldora que sigue al puntero. */}
        <div className="tab tab-c hidden justify-self-center lg:flex">
          <nav
            aria-label={t.nav.menu}
            className="nav-pill gap-0.5 px-1"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="relative inline-flex min-h-9 min-w-11 items-center justify-center px-3.5 pb-[2px] font-display text-[1.2rem] uppercase leading-none tracking-[0.05em] text-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary xl:px-4"
              >
                {hovered === i && (
                  <motion.span
                    layoutId={reducedMotion ? undefined : "nav-hover-pill"}
                    aria-hidden
                    className="px-shape absolute inset-0 -z-0 bg-primary"
                    transition={{ type: "spring", stiffness: 520, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Pestaña derecha: idioma y acciones. */}
        <div className="tab tab-r justify-self-end">
          {!spanishOnly && (
            <div className="nav-pill px-free px-1 [&_button]:min-h-11 [&_button]:min-w-11">
              <LanguageSwitcher />
            </div>
          )}
          <Link
            href={CLIENT_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-pill hidden gap-2 px-4 pb-[2px] font-display text-[1.2rem] uppercase leading-none tracking-[0.04em] transition-colors hover:text-primary xl:inline-flex"
          >
            <LogIn className="h-3.5 w-3.5 text-primary" />
            {t.nav.cliente}
          </Link>
          <Button
            asChild
            className="hidden min-h-11 sm:inline-flex"
          >
            <Link href="/#precios">
              {t.nav.armaTuWeb}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.closeMenu : t.nav.menu}
            aria-controls="mobile-site-menu"
            aria-expanded={open}
            className="nav-pill w-11 justify-center text-primary active:translate-y-0.5 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Panel del menú. Vive FUERA del <header>: el header es un grid fijo y
          encerraría este panel dentro de su caja. Empieza en el canto de la
          hoja, así que las pestañas quedan recortadas también sobre él. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuPanelRef}
            id="mobile-site-menu"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="panel panel-moss fixed inset-[var(--gutter)] z-[99] flex flex-col overflow-y-auto pt-[var(--header-h)] lg:hidden"
          >
            <span
              aria-hidden
              lang="ja"
              className="pointer-events-none absolute -bottom-6 -right-4 select-none font-jp text-[46vw] leading-none text-foreground/[0.04]"
            >
              道
            </span>
            <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]" />

            <nav
              aria-label={t.nav.menu}
              className="relative z-10 flex flex-1 flex-col justify-center gap-1 px-5 py-8 sm:px-8"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={reducedMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: reducedMotion ? 0 : 0.06 + i * 0.04,
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    ref={i === 0 ? firstMenuLinkRef : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-11 items-center justify-between gap-4 px-2 py-2 transition-colors active:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <span className="display-xl flex items-center gap-3 text-[clamp(2.75rem,13vw,5rem)] text-foreground transition-colors group-hover:text-primary">
                      <span aria-hidden className="text-[0.5em] text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">▶</span>
                      {l.label}
                    </span>
                    <span className="btn-px btn-px-outline grid size-11 shrink-0 place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.26, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button asChild size="lg" className="w-full sm:flex-1" onClick={() => setOpen(false)}>
                  <Link href="/#precios">{t.nav.armaTuWeb}</Link>
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
              </motion.div>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.32, duration: 0.3 }}
                className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-foreground/15 pt-6"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  CDMX · MX — EST. 2020
                </span>
                <div className="flex gap-2">
                  {social.map(({ Icon, href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="btn-px flex h-11 w-11 items-center justify-center bg-background/70 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

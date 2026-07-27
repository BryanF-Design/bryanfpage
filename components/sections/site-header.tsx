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

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
];

/**
 * Barra técnica de borde a borde: hairline inferior, navegación en mono
 * mayúsculas — la primera línea del "plano de obra" en todas las páginas.
 * En móvil abre un menú de pantalla completa con los enlaces en display
 * gigante (antes el teléfono no tenía navegación alguna).
 */
export function SiteHeader({ spanishOnly = false }: { spanishOnly?: boolean }) {
  const { t: localizedT } = useLanguage();
  const t = spanishOnly ? DICTIONARIES.es : localizedT;
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const links = [
    { label: t.nav.proceso, href: "/#proceso" },
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  // Bloquea el scroll de fondo mientras el menú está abierto y ciérralo
  // con Escape — el overlay se comporta como un diálogo de verdad.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    const focusTimer = window.setTimeout(() => firstMenuLinkRef.current?.focus());
    window.addEventListener("keydown", onKey);
    desktopQuery.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      desktopQuery.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <>
    <header
      ref={headerRef}
      className="glass-nav fixed inset-x-0 top-0 z-[100] border-b border-border"
    >
      <div className="container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex min-h-11 min-w-0 items-center justify-self-start rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="BryanF Design — inicio"
        >
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            priority
            sizes="(max-width: 767px) 104px, 140px"
            style={{ height: 36, width: "auto" }}
            className="object-contain"
          />
        </Link>

        <nav
          aria-label={t.nav.menu}
          className="hidden items-center justify-center gap-5 md:flex xl:gap-8"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1 sm:gap-2">
          {!spanishOnly && (
            <div className="[&_button]:min-h-11 [&_button]:min-w-11 [&_button]:focus-visible:outline-none [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-primary">
              <LanguageSwitcher />
            </div>
          )}
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="hidden min-h-11 lg:inline-flex"
          >
            <Link href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              {t.nav.cliente}
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden min-h-11 sm:inline-flex">
            <Link href="/#precios">{t.nav.armaTuWeb}</Link>
          </Button>

          {/* Disparador del menú móvil */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.closeMenu : t.nav.menu}
            aria-controls="mobile-site-menu"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>

    {/* Menú móvil de pantalla completa. Vive FUERA del <header>: su
        backdrop-filter lo volvería containing block y encerraría este
        panel fixed dentro de la barra. */}
    <AnimatePresence>
        {open && (
          <motion.div
            ref={menuPanelRef}
            id="mobile-site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 top-[61px] z-[99] flex flex-col overflow-y-auto bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />
            <div aria-hidden className="mesh-glow-a absolute inset-0 opacity-70" />

            <nav
              aria-label={t.nav.menu}
              className="container relative z-10 flex flex-1 flex-col justify-center gap-1 py-10"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: 0.06 + i * 0.06, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                >
                  <Link
                    ref={i === 0 ? firstMenuLinkRef : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-11 items-baseline justify-between rounded-sm border-b border-border py-4 active:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <span className="font-display text-4xl font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {l.label}
                    </span>
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.32, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="mt-8 flex flex-col gap-3"
              >
                <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/#precios">{t.nav.armaTuWeb}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link
                    href={CLIENT_PORTAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t.nav.cliente}
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8 flex items-center justify-between border-t border-border pt-6"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
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
                      className="glass flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-[color,transform] hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

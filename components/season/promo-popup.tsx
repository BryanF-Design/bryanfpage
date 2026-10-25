"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

import { useReducedMotionPreference } from "@/lib/motion-preference";
import { popupActive } from "@/lib/seasons";

import { Calaverita, Cempasuchil, Copo, EtiquetaPrecio, GorroNavidad } from "./season-art";
import { useSiteSettings } from "./site-settings-provider";

const QUIET_PATHS = ["/admin", "/mi-panel", "/gracias", "/armar-mi-brief"];

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * Pop-up de promoción del Panel BryanF: sale una vez por visita, a los
 * `delay` segundos, nunca en el panel, el pago o el brief. Es un diálogo
 * modal accesible (Escape, clic fuera y botón cerrar).
 */
export function PromoPopup() {
  const { settings, season, discountsOn } = useSiteSettings();
  const pathname = usePathname() || "/";
  const reduced = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const p = settings.popup;
  const key = `bfd-popup-${hash(`${p.title}|${p.text}`)}`;
  const quiet = QUIET_PATHS.some((q) => pathname.startsWith(q));

  useEffect(() => {
    if (quiet || !popupActive(settings, Date.now())) return;
    try {
      if (window.sessionStorage.getItem(key) === "1") return;
    } catch {
      /* sin storage */
    }
    const timer = window.setTimeout(() => {
      // Nunca encima del chat abierto o de un menú.
      if (document.querySelector('[aria-controls="lumina-chat-panel"][aria-expanded="true"]')) return;
      if (document.documentElement.classList.contains("menu-open")) return;
      restoreRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {
        /* sin storage */
      }
    }, p.delay * 1000);
    return () => window.clearTimeout(timer);
  }, [quiet, settings, key, p.delay]);

  useEffect(() => {
    if (!open) return;
    const focus = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    window.setTimeout(() => restoreRef.current?.focus?.(), 0);
  }

  const discount = discountsOn && settings.discounts.global > 0 ? settings.discounts.global : 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] grid place-items-center bg-ink/45 px-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            aria-describedby={p.text ? "promo-text" : undefined}
            className="season-popup relative w-full max-w-[26rem] overflow-hidden rounded-[2rem] bg-white p-6 pt-8 text-ink shadow-[0_40px_90px_-30px_hsl(var(--shade)/0.7)] ring-1 ring-ink/[0.06] sm:p-8"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 24 }}
          >
            <span aria-hidden className="season-popup-glow" />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            <span aria-hidden className="relative mb-4 flex items-end gap-1">
              {season === "muertos" ? (
                <>
                  <Calaverita className="h-14 w-14 -rotate-6" />
                  <Cempasuchil className="h-8 w-8" />
                </>
              ) : season === "navidad" ? (
                <>
                  <GorroNavidad className="h-12 w-14" />
                  <Copo className="h-7 w-7 text-sky-300" />
                </>
              ) : (
                <EtiquetaPrecio className="h-12 w-16" fill="#e5484d" text={discount ? `${discount}%` : "%"} />
              )}
            </span>
            {discount > 0 && (
              <span className="relative mb-2 inline-flex rounded-full bg-lime px-3 py-1 text-xs font-black uppercase tracking-wide text-ink">
                {settings.discounts.label || "Promoción"} · -{discount}%
              </span>
            )}
            <h2 id="promo-title" className="display-title relative text-[clamp(1.75rem,6vw,2.25rem)] leading-[0.95]">
              {p.title || "Tenemos algo para ti"}
            </h2>
            {p.text && (
              <p id="promo-text" className="relative mt-3 text-[0.9375rem] leading-relaxed text-ink/70">
                {p.text}
              </p>
            )}
            <div className="relative mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href={p.href || "/#precios"}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[0.9375rem] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
              >
                {p.cta || "Ver la promoción"}
                <ArrowRight aria-hidden className="h-4 w-4 text-lime" />
              </Link>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[0.9375rem] font-semibold text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                Ahora no
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

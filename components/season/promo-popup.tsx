"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { popupActive, posterKicker, seasonDef, seasonEndsAt, timeLeft } from "@/lib/seasons";

import { SeasonPoster } from "./season-poster";
import { useSiteSettings } from "./site-settings-provider";

const QUIET_PATHS = ["/admin", "/mi-panel", "/gracias", "/armar-mi-brief"];
/** El pop-up de temporada (sin uno propio) sale a los N segundos. */
const SEASON_DELAY = 9;

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * Pop-up de promoción. Dos fuentes:
 *  · el propio del Panel BryanF (Avisos y pop-up): sale una vez por visita;
 *  · si no hay uno propio y hay temporada con "Pop-up" encendido, el de la
 *    temporada: sale una sola vez por visitante en toda la temporada.
 * En temporada, los dos se visten de cartel (season-poster). Nunca en el
 * panel, el pago o el brief; nunca encima del chat o del menú. Es un diálogo
 * modal accesible (Escape, clic fuera, botón cerrar y foco atrapado).
 */
export function PromoPopup() {
  const { settings, season, discountsOn } = useSiteSettings();
  const pathname = usePathname() || "/";
  const reduced = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const p = settings.popup;
  const quiet = QUIET_PATHS.some((q) => pathname.startsWith(q));

  const custom = popupActive(settings, now);
  const seasonal = !custom && !!season && settings.season.ranges[season].popup;
  const year = new Date(now).getFullYear();
  // Propio: una vez por visita (cambia con el texto). Temporada: una vez por
  // visitante y por año (localStorage).
  const key = custom ? `bfd-popup-${hash(`${p.title}|${p.text}`)}` : `bfd-popup-season-${season}-${year}`;
  const store = custom ? "sessionStorage" : "localStorage";
  const delay = custom ? p.delay : SEASON_DELAY;

  useEffect(() => {
    if (quiet || (!custom && !seasonal)) return;
    try {
      if (window[store].getItem(key) === "1") return;
    } catch {
      /* sin storage */
    }
    let timer = 0;
    const show = () => {
      // Con el chat o el menú abiertos no se encima: lo intenta otra vez luego.
      const busy =
        document.querySelector('[aria-controls="lumina-chat-panel"][aria-expanded="true"]') ||
        document.documentElement.classList.contains("menu-open");
      if (busy) {
        timer = window.setTimeout(show, 5000);
        return;
      }
      restoreRef.current = document.activeElement as HTMLElement | null;
      setNow(Date.now());
      setOpen(true);
      try {
        window[store].setItem(key, "1");
      } catch {
        /* sin storage */
      }
    };
    timer = window.setTimeout(show, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [quiet, custom, seasonal, key, store, delay]);

  useEffect(() => {
    if (!open) return;
    const focus = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
  const def = season ? seasonDef(season) : null;
  const endsAt = custom ? (p.endsAt ? Date.parse(p.endsAt) : null) : season ? seasonEndsAt(settings, season, now) : null;
  const endsIn = endsAt && endsAt > now ? timeLeft(endsAt - now) : null;
  const href = (custom && p.href) || "/#precios";
  const cta = (custom && p.cta) || (def ? (discount ? `${def.poster.cta} con -${discount}%` : def.poster.cta) : "Ver la promoción");

  const notNow = (
    <button
      type="button"
      onClick={close}
      className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[0.9375rem] font-semibold text-current opacity-75 transition-opacity hover:opacity-100"
    >
      Ahora no
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] grid place-items-center overflow-y-auto bg-ink/55 px-4 py-6 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            aria-describedby="promo-text"
            className={cn(
              "season-popup relative w-full overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]",
              season ? "max-w-[27rem]" : "max-w-[26rem] bg-white p-6 pt-8 text-ink ring-1 ring-ink/[0.06] sm:p-8"
            )}
            data-season-popup={season ?? "aviso"}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.92, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 240, damping: 22 }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className={cn(
                "absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full transition-colors",
                season ? "bg-black/35 text-white backdrop-blur hover:bg-black/55" : "text-ink/60 hover:bg-ink/[0.06] hover:text-ink"
              )}
            >
              <X aria-hidden className="h-5 w-5" />
            </button>

            {season && def ? (
              <SeasonPoster
                season={season}
                compact
                copy={{
                  titleId: "promo-title",
                  textId: "promo-text",
                  kicker: posterKicker(settings, season),
                  title: def.poster.title,
                  lead: (custom && p.title) || def.poster.lead,
                  text: (custom && p.text) || def.poster.text,
                  cta,
                  href,
                  onCta: () => setOpen(false),
                  discount,
                  discountLabel: settings.discounts.label || def.name,
                  endsIn,
                  secondary: notNow,
                }}
              />
            ) : (
              <>
                <span aria-hidden className="season-popup-glow" />
                {discount > 0 && (
                  <span className="relative mb-3 inline-flex rounded-full bg-lime px-3 py-1 text-xs font-black uppercase tracking-wide text-ink">
                    {settings.discounts.label || "Promoción"} · -{discount}%
                  </span>
                )}
                <h2 id="promo-title" className="display-title relative pr-8 text-[clamp(1.9rem,6.5vw,2.5rem)] leading-[0.95]">
                  {p.title || "Tenemos algo para ti"}
                </h2>
                <p id="promo-text" className="relative mt-3 text-[0.9375rem] leading-relaxed text-ink/70">
                  {p.text}
                  {endsIn && <span className="mt-2 block text-sm font-semibold text-ink">Termina en {endsIn}</span>}
                </p>
                <div className="relative mt-6 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[0.9375rem] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    {cta}
                    <ArrowRight aria-hidden className="h-4 w-4 text-lime" />
                  </Link>
                  {notNow}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Moon, Sparkle, X } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { seasonDef } from "@/lib/seasons";
import { applyTheme, currentTheme } from "@/lib/theme";
import { useSiteSettings } from "@/components/season/site-settings-provider";

/**
 * LUMINA "SALTA" JUNTO A LO QUE ESTÁS VIENDO.
 *
 * A diferencia de la burbuja del botón (abajo a la derecha), estos avisos
 * aparecen pegados al elemento del que hablan, con una flecha que lo señala:
 *  - Ayuda para pagar: si alguien se queda mucho en los botones de pago
 *    (`[data-lumina-pay]`), cambia opciones una y otra vez o pasa por los
 *    botones sin decidirse, Lumina pregunta si necesita ayuda.
 *  - Modo oscuro / claro: una vez por visitante, señala el botón del tema.
 *  - Temporada: un saludo por visita cuando hay temporada activa.
 *
 * Uno a la vez, nunca con el chat o el menú abiertos, y con pausa entre uno y
 * otro. Cualquier parte del sitio puede pedir uno con el evento `lumina:tip`.
 */

export interface LuminaTip {
  id: string;
  /** Selector del elemento a señalar. */
  target: string;
  title?: string;
  text: string;
  /** Botón principal. */
  cta: string;
  /** Mensaje que se manda a Lumina al tocar el botón (abre el chat). */
  ask?: string;
  /** Acción propia en lugar de abrir el chat. */
  action?: "toggle-theme" | "go-prices";
  dismiss?: string;
  /** "left": a un costado del elemento si cabe (para no tapar precios). */
  prefer?: "left";
}

const GAP_MS = 45_000;
const STORE = "bfd-lumina-tips-v1";
const THEME_TIP_KEY = "bfd-tip-theme";

/** Umbrales del "titubeo" en los pagos. */
const PAY_DWELL_MS = 40_000;
const PAY_CHANGES = 7;
const PAY_HOVERS = 3;

interface TipState {
  shown: string[];
  last: number;
}

function readState(): TipState {
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORE) || "{}") as Partial<TipState>;
    return { shown: Array.isArray(raw.shown) ? raw.shown : [], last: Number(raw.last) || 0 };
  } catch {
    return { shown: [], last: 0 };
  }
}

function writeState(state: TipState) {
  try {
    window.sessionStorage.setItem(STORE, JSON.stringify(state));
  } catch {
    /* sin storage */
  }
}

function visible(el: Element | null): el is HTMLElement {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
}

/** ¿Hay algo encima que mande más (chat, menú, diálogo)? */
function busy() {
  const root = document.documentElement;
  return (
    root.classList.contains("menu-open") ||
    !!document.querySelector('[aria-controls="lumina-chat-panel"][aria-expanded="true"]') ||
    !!document.querySelector('[role="dialog"][aria-modal="true"]')
  );
}

interface Place {
  top: number;
  left: number;
  /** Posición de la flecha a lo largo del borde que señala. */
  arrow: number;
  side: "below" | "above" | "left";
}

function placeNear(target: HTMLElement, card: HTMLElement, prefer?: "left"): Place {
  const margin = 12;
  const gap = 14;
  const r = target.getBoundingClientRect();
  const w = card.offsetWidth;
  const h = card.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // A un costado (si se pidió y cabe): no tapa lo que se está viendo.
  if (prefer === "left" && r.left - gap - w >= margin) {
    const middle = Math.min(Math.max(r.top, margin + 24), Math.min(r.bottom, vh - margin - 24));
    const top = Math.min(Math.max(margin, middle - h / 2), vh - h - margin);
    return { top, left: r.left - gap - w, arrow: Math.min(Math.max(22, middle - top), h - 22), side: "left" };
  }
  // Debajo si cabe (o si arriba tampoco); si no, arriba.
  const below = r.bottom + gap + h <= vh - margin || r.top - gap - h < margin;
  const rawTop = below ? r.bottom + gap : r.top - gap - h;
  const top = Math.min(Math.max(margin, rawTop), vh - h - margin);
  const center = r.left + r.width / 2;
  const left = Math.min(Math.max(margin, center - w / 2), vw - w - margin);
  const arrow = Math.min(Math.max(22, center - left), w - 22);
  return { top, left, arrow, side: below ? "below" : "above" };
}

const ARROW_STYLE: Record<Place["side"], (arrow: number) => React.CSSProperties> = {
  below: (a) => ({ left: a - 8, top: -7, transform: "rotate(45deg)" }),
  above: (a) => ({ left: a - 8, bottom: -7, transform: "rotate(225deg)" }),
  left: (a) => ({ top: a - 8, right: -7, transform: "rotate(135deg)" }),
};

export function LuminaTips() {
  const pathname = usePathname() || "/";
  const reduced = useReducedMotionPreference();
  const { season, settings, discountsOn } = useSiteSettings();
  const [tip, setTip] = useState<LuminaTip | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<LuminaTip | null>(null);
  tipRef.current = tip;

  const show = useCallback((next: LuminaTip, opts: { force?: boolean } = {}) => {
    if (tipRef.current || busy()) return false;
    const state = readState();
    if (state.shown.includes(next.id)) return false;
    if (!opts.force && Date.now() - state.last < GAP_MS) return false;
    const target = document.querySelector(next.target);
    if (!visible(target)) return false;
    writeState({ shown: [...state.shown, next.id], last: Date.now() });
    target.classList.remove("lumina-spot");
    void target.offsetWidth;
    target.classList.add("lumina-spot");
    window.setTimeout(() => target.classList.remove("lumina-spot"), 2600);
    setPlace(null);
    setTip(next);
    trackEvent("lumina_tip", { id: next.id });
    return true;
  }, []);

  const close = useCallback(() => setTip(null), []);

  // Marca en <html> para que la burbuja de Lumina no salga al mismo tiempo.
  useEffect(() => {
    const root = document.documentElement;
    if (tip) root.setAttribute("data-lumina-tip", tip.id);
    else root.removeAttribute("data-lumina-tip");
  }, [tip]);

  // Se cierra sola, con Escape, al abrir el chat o al cambiar de página.
  useEffect(() => {
    if (!tip) return;
    const timer = window.setTimeout(close, 14_000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onChat = (e: Event) => {
      if ((e as CustomEvent<{ open?: boolean }>).detail?.open) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("lumina:visibility", onChat);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lumina:visibility", onChat);
    };
  }, [tip, close]);

  useEffect(() => {
    setTip(null);
  }, [pathname]);

  // Sigue al elemento al hacer scroll o cambiar el tamaño.
  useLayoutEffect(() => {
    if (!tip) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const target = document.querySelector<HTMLElement>(tip.target);
      const card = cardRef.current;
      if (!target || !card) return;
      if (!visible(target)) {
        setTip(null);
        return;
      }
      setPlace(placeNear(target, card, tip.prefer));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [tip]);

  // Otros componentes pueden pedir un aviso.
  useEffect(() => {
    const onTip = (e: Event) => {
      const detail = (e as CustomEvent<LuminaTip>).detail;
      if (detail?.id && detail.target && detail.text) show(detail, { force: true });
    };
    window.addEventListener("lumina:tip", onTip);
    return () => window.removeEventListener("lumina:tip", onTip);
  }, [show]);

  // ——— Ayuda para pagar: tiempo, cambios y pasadas por los botones ———
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let dwell = 0;
    let changes = 0;
    let hovers = 0;
    let lastTick = Date.now();
    const zones = () => Array.from(document.querySelectorAll<HTMLElement>("[data-lumina-pay]"));

    const offer = (reason: string) => {
      const zone = zones().find(visible);
      if (!zone) return;
      const kind = zone.dataset.luminaPay;
      const id = `pay-help-${kind}`;
      const sel = `[data-lumina-pay="${kind}"]`;
      const shown = show({
        id,
        target: sel,
        title: "¿Te ayudo a decidir?",
        text:
          kind === "suscripcion"
            ? "Veo que lo estás pensando. Te cuento cómo funciona el cobro mes a mes, cómo cancelas y qué incluye. Sin compromiso."
            : "Llevas un rato armando tu paquete. Te explico las formas de pago, el anticipo del 50 % o te digo qué te conviene.",
        cta: "Sí, ayúdame",
        ask:
          kind === "suscripcion"
            ? "Estoy por suscribirme pero tengo dudas con el pago. ¿Me ayudas?"
            : "Estoy en el cotizador y tengo dudas para decidir y pagar. ¿Me ayudas?",
        dismiss: "Estoy bien",
        prefer: "left",
      });
      if (shown) trackEvent("lumina_pay_help", { kind, reason });
    };

    const tick = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTick;
      lastTick = now;
      if (document.visibilityState !== "visible") return;
      if (zones().some(visible)) dwell += elapsed;
      if (dwell >= PAY_DWELL_MS) offer("dwell");
    }, 1_000);

    // Cambiar opciones del cotizador una y otra vez ("jugando con el sistema"):
    // radios y switches (change) y los botones de + / − (click).
    const count = () => {
      changes += 1;
      if (changes >= PAY_CHANGES) offer("changes");
    };
    const onChange = (e: Event) => {
      if ((e.target as HTMLElement).closest?.("#precios")) count();
    };
    const onStep = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest?.("#precios button");
      if (button && !button.closest("[data-lumina-pay]")) count();
    };
    // Pasar por los botones de pago sin tocarlos.
    let inside = false;
    const onOver = (e: PointerEvent) => {
      const zone = (e.target as HTMLElement).closest?.("[data-lumina-pay]");
      if (zone && !inside) {
        inside = true;
        hovers += 1;
        if (hovers >= PAY_HOVERS && dwell > 12_000) offer("hovers");
      } else if (!zone) inside = false;
    };
    const onPayClick = (e: MouseEvent) => {
      // Ya decidió: no hay que interrumpir.
      if ((e.target as HTMLElement).closest?.("[data-lumina-pay] button")) {
        dwell = -Infinity;
        changes = -Infinity;
      }
    };
    document.addEventListener("change", onChange, true);
    document.addEventListener("click", onStep, true);
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("click", onPayClick, true);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("click", onStep, true);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onPayClick, true);
    };
  }, [pathname, show]);

  // ——— Saludo de temporada (una vez por visita) ———
  useEffect(() => {
    if (!season || pathname.startsWith("/admin")) return;
    const timer = window.setTimeout(() => {
      const discount = discountsOn && settings.discounts.global > 0 ? settings.discounts.global : 0;
      show(
        {
          id: `season-${season}`,
          target: '[data-lumina="logo"]',
          text: discount
            ? `${seasonDef(season).greeting} Hay ${discount}% de descuento${settings.discounts.label ? ` por ${settings.discounts.label}` : ""}.`
            : seasonDef(season).greeting,
          cta: discount ? "Ver precios" : "Platicar con Lumina",
          action: discount ? "go-prices" : undefined,
          ask: discount ? undefined : "¡Hola Lumina! ¿Qué me recomiendas para mi negocio?",
          dismiss: "Ahora no",
        },
        { force: true }
      );
    }, 9_000);
    return () => window.clearTimeout(timer);
  }, [season, pathname, show, settings, discountsOn]);

  // ——— Modo oscuro / claro (una vez por visitante) ———
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    try {
      if (window.localStorage.getItem(THEME_TIP_KEY) === "1") return;
    } catch {
      return;
    }
    let scrolled = false;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) scrolled = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onTheme = () => {
      try {
        window.localStorage.setItem(THEME_TIP_KEY, "1");
      } catch {
        /* sin storage */
      }
    };
    window.addEventListener("bfd:theme", onTheme);
    const timer = window.setInterval(() => {
      if (!scrolled) return;
      const dark = currentTheme() === "dark";
      const ok = show({
        id: "theme",
        target: '[data-lumina="tema"]',
        text: dark
          ? "¿Sabías que también hay modo claro? ☀️ Cámbialo aquí cuando quieras, sin perder nada."
          : "¿Sabías que puedes cambiar a modo oscuro? 🌙 Tócalo aquí cuando quieras; se ve increíble de noche.",
        cta: dark ? "Probar modo claro" : "Probar modo oscuro",
        action: "toggle-theme",
        dismiss: "Luego",
      });
      if (ok) {
        onTheme();
        window.clearInterval(timer);
      }
    }, 6_000);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("bfd:theme", onTheme);
    };
  }, [pathname, show]);

  function primary() {
    const current = tip;
    if (!current) return;
    setTip(null);
    trackEvent("lumina_tip_open", { id: current.id });
    if (current.action === "toggle-theme") {
      applyTheme(
        currentTheme() === "dark" ? "light" : "dark",
        true,
        document.querySelector<HTMLElement>('[data-lumina="tema"]')
      );
      return;
    }
    if (current.action === "go-prices") {
      const prices = document.getElementById("precios");
      if (prices) prices.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      else window.location.href = "/#precios";
      return;
    }
    window.dispatchEvent(new CustomEvent("lumina:open", { detail: { message: current.ask } }));
  }

  return (
    <AnimatePresence>
      {tip && (
        <motion.div
          key={tip.id}
          ref={cardRef}
          role="status"
          aria-live="polite"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: place?.side === "above" ? 16 : place?.side === "left" ? 0 : -16 }}
          animate={place ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, transition: { duration: 0.16 } }}
          transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 22, mass: 0.8 }}
          style={{
            top: place?.top ?? -9999,
            left: place?.left ?? 0,
            transformOrigin:
              place?.side === "left"
                ? `100% ${place.arrow}px`
                : `${place?.arrow ?? 40}px ${place?.side === "above" ? "100%" : "0%"}`,
          }}
          className="fixed z-[126] w-[min(20rem,calc(100vw-1.5rem))]"
        >
          {/* Flecha que señala el elemento (del color de marca: se ve sobre blanco). */}
          <span
            aria-hidden
            className="absolute z-10 size-4 rounded-[3px] bg-lime [clip-path:polygon(0_0,100%_0,0_100%)]"
            style={ARROW_STYLE[place?.side ?? "below"](place?.arrow ?? 40)}
          />
          <div className="lumina-tip relative flex items-start gap-3 rounded-[1.5rem] bg-white p-3 pr-10 text-ink shadow-float ring-2 ring-lime">
            <span aria-hidden className="relative size-11 shrink-0">
              <span className="float-y absolute inset-0 overflow-hidden rounded-full bg-ink ring-[3px] ring-lime">
                <Image src="/img/lumina/sorprendida.webp" alt="" fill sizes="44px" className="object-cover" />
              </span>
              <Sparkle className="absolute -right-1 -top-1 h-4 w-4 fill-lime text-lime-deep" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-forest">{tip.title || "Lumina"}</span>
              <span className="mt-0.5 block text-[0.875rem] leading-snug">{tip.text}</span>
              <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={primary}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-xs font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
                >
                  {tip.action === "toggle-theme" ? (
                    <Moon aria-hidden className="h-3.5 w-3.5 text-lime" />
                  ) : tip.action === "go-prices" ? (
                    <ArrowRight aria-hidden className="h-3.5 w-3.5 text-lime" />
                  ) : (
                    <MessageCircle aria-hidden className="h-3.5 w-3.5 text-lime" />
                  )}
                  {tip.cta}
                </button>
                {tip.dismiss && (
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold text-ink/65 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                  >
                    {tip.dismiss}
                  </button>
                )}
              </span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar aviso de Lumina"
              className="absolute right-1 top-1 grid size-10 place-items-center rounded-full text-ink/55 transition-colors hover:text-ink"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

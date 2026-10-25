"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Check,
  Infinity as InfinityIcon,
  LayoutTemplate,
  Mail,
  Nfc,
  Phone,
  Sparkle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { desktopShot, mobileShot } from "@/lib/projects";
import { SUBSCRIPTION_INCLUDES } from "@/lib/subscription";

const ICONS: LucideIcon[] = [LayoutTemplate, InfinityIcon, Nfc, TrendingUp];
const CYCLE_MS = 6500;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Escena 1: sitios reales en escritorio y teléfono. */
function SitesScene() {
  return (
    <div className="relative h-full w-full">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute left-[4%] top-[10%] w-[78%] overflow-hidden rounded-[1rem] bg-white shadow-[0_30px_60px_-30px_hsl(var(--shade)/0.7)] ring-1 ring-ink/10"
      >
        <div className="flex gap-1 bg-ink/[0.06] px-3 py-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-ink/20" />
          ))}
        </div>
        <Image src={desktopShot("element-experiences-com")} alt="" width={1440} height={1000} sizes="28rem" className="h-auto w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="absolute bottom-[6%] right-[4%] w-[30%] overflow-hidden rounded-[1.4rem] border-[5px] border-ink bg-ink shadow-[0_30px_50px_-24px_hsl(var(--shade)/0.8)]"
      >
        <Image src={mobileShot("nkmohcafe-com")} alt="" width={390} height={845} sizes="9rem" className="h-auto w-full" />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute left-[8%] bottom-[10%] inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-ink shadow-soft"
      >
        <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
        Publicado
      </motion.span>
    </div>
  );
}

/** Escena 2: solicitudes que se van palomeando, sin límite. */
const REQUESTS = [
  "Cambiar los precios de temporada",
  "Nueva foto del equipo en Nosotros",
  "Banner de la promoción del mes",
  "Agregar 6 productos a la tienda",
  "Botón de WhatsApp en el menú",
];
function ChangesScene() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(reduce ? REQUESTS.length : 0);
  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setDone((d) => (d >= REQUESTS.length ? d : d + 1)), 850);
    return () => window.clearInterval(timer);
  }, [reduce]);
  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-sm rounded-[1.4rem] bg-white p-4 shadow-[0_30px_60px_-30px_hsl(var(--shade)/0.6)] ring-1 ring-ink/10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink">Tus solicitudes</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-lime">
            <InfinityIcon aria-hidden className="h-3.5 w-3.5" /> sin límite
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {REQUESTS.map((text, i) => {
            const ok = i < done;
            return (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                className={cn(
                  "flex items-center gap-2.5 rounded-full px-2 py-1.5 text-[0.8125rem] transition-colors duration-500",
                  ok ? "bg-lime/40 text-ink" : "bg-mint text-ink/70"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full transition-all duration-500",
                    ok ? "scale-100 bg-ink text-lime" : "scale-90 bg-white text-transparent ring-1 ring-ink/15"
                  )}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className={cn("flex-1", ok && "font-semibold")}>{text}</span>
                <span className="text-[0.6875rem] font-bold text-ink/50">{ok ? "Entregado" : i === done ? "En proceso" : "En cola"}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Escena 3: tarjeta digital y firma de correo. */
function IdentityScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, rotateY: -40, y: 20 }}
        animate={{ opacity: 1, rotateY: 0, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ transformPerspective: 900 }}
        className="relative z-10 w-[62%] max-w-[17rem] -translate-y-6 rounded-[1.4rem] bg-ink p-4 text-white shadow-[0_30px_60px_-24px_hsl(var(--shade)/0.8)]"
      >
        <div aria-hidden className="mesh-glow-a opacity-70" />
        <div className="relative flex items-start justify-between">
          <span className="grid size-10 place-items-center rounded-full bg-lime text-sm font-black text-ink">TN</span>
          <Nfc aria-hidden className="h-5 w-5 text-lime" />
        </div>
        <p className="relative mt-6 text-lg font-bold leading-tight">Tu Nombre</p>
        <p className="relative text-xs text-white/65">Dirección comercial · Tu Negocio</p>
        <div className="relative mt-4 flex gap-1.5">
          {["WhatsApp", "Sitio", "Mapa"].map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[0.625rem] font-semibold">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        className="absolute bottom-[8%] right-[6%] w-[64%] max-w-[18rem] rounded-[1.1rem] bg-white p-3 shadow-[0_24px_50px_-26px_hsl(var(--shade)/0.6)] ring-1 ring-ink/10"
      >
        <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink/45">Firma de correo</p>
        <div className="mt-2 flex items-center gap-2.5 border-l-[3px] border-lime pl-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-ink text-[0.625rem] font-black text-lime">TN</span>
          <span className="text-[0.6875rem] leading-tight text-ink">
            <b className="block text-[0.75rem]">Tu Nombre</b>
            <span className="flex items-center gap-1 text-ink/60">
              <Phone aria-hidden className="h-2.5 w-2.5" /> 55 0000 0000 · <Mail aria-hidden className="h-2.5 w-2.5" /> hola@tunegocio.com
            </span>
          </span>
        </div>
      </motion.div>
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute left-[10%] top-[12%]"
      >
        <Sparkle className="h-7 w-7 fill-lime text-lime" />
      </motion.span>
    </div>
  );
}

/** Escena 4: un reporte de ejemplo con barras que crecen. */
const BARS = [32, 41, 38, 52, 61, 58, 74, 88];
function GrowthScene() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-sm rounded-[1.4rem] bg-white p-4 shadow-[0_30px_60px_-30px_hsl(var(--shade)/0.6)] ring-1 ring-ink/10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink">Visitas de tu sitio</p>
          <span className="rounded-full bg-mint px-2.5 py-1 text-[0.6875rem] font-semibold text-ink/60">Ejemplo</span>
        </div>
        <div className="mt-4 flex h-36 items-end gap-2">
          {BARS.map((h, i) => (
            <motion.span
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: EASE }}
              className={cn("flex-1 rounded-t-[0.5rem]", i === BARS.length - 1 ? "bg-lime" : "bg-ink/80")}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ["SEO", "Google"],
            ["Analytics", "Medición"],
            ["Leads", "WhatsApp"],
          ].map(([a, b]) => (
            <span key={a} className="rounded-[0.8rem] bg-mint px-2 py-2">
              <b className="block text-xs text-ink">{a}</b>
              <span className="text-[0.625rem] text-ink/55">{b}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const SCENES = [SitesScene, ChangesScene, IdentityScene, GrowthScene];

/**
 * "A qué tienes acceso": los cuatro grupos de lib/subscription.ts como
 * pestañas que avanzan solas (se detienen al pasar el puntero o al elegir
 * una), cada una con una escena animada que lo muestra.
 */
export function AccessShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const timer = window.setTimeout(() => setActive((a) => (a + 1) % SUBSCRIPTION_INCLUDES.length), CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, inView, reduce]);

  const group = SUBSCRIPTION_INCLUDES[active];
  const Scene = SCENES[active] ?? SitesScene;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="mt-8 grid gap-4 lg:grid-cols-12"
    >
      <div className="flex flex-col gap-2 lg:col-span-5">
        <div role="tablist" aria-label="Qué incluye" className="flex flex-col gap-2">
          {SUBSCRIPTION_INCLUDES.map((g, i) => {
            const Icon = ICONS[i] ?? Sparkle;
            const on = i === active;
            return (
              <button
                key={g.title}
                type="button"
                role="tab"
                id={`incluye-tab-${i}`}
                aria-selected={on}
                aria-controls="incluye-panel"
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={cn(
                  "relative flex items-center gap-3 overflow-hidden rounded-card p-3 text-left transition-colors duration-300 sm:p-4",
                  on ? "bg-ink text-white" : "bg-mint text-ink hover:bg-ink/[0.06]"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-full transition-colors",
                    on ? "bg-lime text-ink" : "bg-ink text-lime"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="display-title flex-1 text-[1.2rem] leading-tight">{g.title}</span>
                {on && !reduce && !paused && (
                  <motion.span
                    key={`bar-${active}`}
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: inView ? 1 : 0 }}
                    transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    className="absolute inset-x-0 bottom-0 h-1 origin-left bg-lime"
                  />
                )}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.ul
            key={group.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex flex-col gap-2 px-1"
          >
            {group.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-ink/85">
                <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-ink">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div
        id="incluye-panel"
        role="tabpanel"
        aria-labelledby={`incluye-tab-${active}`}
        className="relative min-h-[20rem] overflow-hidden rounded-card bg-[radial-gradient(120%_90%_at_80%_10%,hsl(var(--lime)/0.45),transparent_60%),hsl(var(--mint))] ring-1 ring-inset ring-ink/[0.06] sm:min-h-[24rem] lg:col-span-7"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Scene />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

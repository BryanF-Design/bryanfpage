"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  Check,
  Clock,
  CreditCard,
  Infinity as InfinityIcon,
  LayoutTemplate,
  ListOrdered,
  Loader2,
  LogOut,
  Mail,
  Nfc,
  Palette,
  PenLine,
  Sparkle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { SUBSCRIPTION_INCLUDES } from "@/lib/subscription";
import type { PanelData } from "./panel-types";

const DAY = 86_400_000;
const WHATSAPP = "525663012505";
const TZ = "America/Mexico_City";

export type { PanelData } from "./panel-types";

const STATUS: Record<PanelData["status"], { label: string; tone: string }> = {
  active: { label: "Activa", tone: "bg-lime text-ink" },
  trialing: { label: "Activa", tone: "bg-lime text-ink" },
  past_due: { label: "Cobro pendiente", tone: "bg-destructive text-white" },
  paused: { label: "En pausa", tone: "bg-white/15 text-white" },
  pending: { label: "Por confirmar", tone: "bg-white/15 text-white" },
  canceled: { label: "Cancelada", tone: "bg-white/15 text-white" },
  other: { label: "En revisión", tone: "bg-white/15 text-white" },
};

/** Lo que el suscriptor pide con un toque (abre WhatsApp con el mensaje listo). */
const QUICK_ASKS: Array<{ Icon: LucideIcon; label: string; text: string }> = [
  { Icon: LayoutTemplate, label: "Una página nueva", text: "Necesito una página nueva:" },
  { Icon: PenLine, label: "Cambio en mi sitio", text: "Necesito un cambio en mi sitio:" },
  { Icon: Palette, label: "Gráfico para redes", text: "Necesito un gráfico para redes:" },
  { Icon: Nfc, label: "Tarjeta digital", text: "Necesito una tarjeta digital:" },
  { Icon: Mail, label: "Firma de correo", text: "Necesito una firma de correo:" },
];

const INCLUDE_ICONS = [LayoutTemplate, InfinityIcon, Nfc, TrendingUp];

function money(value: number, currency: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function date(ms: number | null) {
  if (!ms) return "—";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", timeZone: TZ }).format(ms);
}

function firstName(name: string, email: string) {
  const first = name.trim().split(/\s+/)[0];
  return first || email.split("@")[0];
}

/** Anillo con los días que faltan para el próximo cobro. */
function DaysRing({ days, progress }: { days: number; progress: number }) {
  const reduce = useReducedMotion();
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-32 shrink-0 place-items-center sm:size-36">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="9" className="text-white/10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="hsl(var(--lime))"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - progress) : c }}
          whileInView={{ strokeDashoffset: c * (1 - progress) }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="text-center leading-none">
        <span className="display-title block text-[2.4rem] tabular-nums text-lime sm:text-[2.75rem]">{Math.max(0, days)}</span>
        <span className="mt-1 block text-[0.6875rem] font-semibold text-white/65">{days === 1 ? "día" : "días"}</span>
      </span>
    </div>
  );
}

/**
 * Mi panel del suscriptor. `demo` lo pinta con datos de ejemplo dentro de la
 * página de suscripción: los botones se ven pero no hacen nada.
 */
export function SubscriberPanelView({
  data,
  demo = false,
  onManage,
  managing = false,
  onLogout,
}: {
  data: PanelData;
  demo?: boolean;
  onManage?: () => void;
  managing?: boolean;
  onLogout?: () => void;
}) {
  const status = STATUS[data.status];
  const active = data.status === "active" || data.status === "trialing";
  const days = data.nextChargeAt ? Math.ceil((data.nextChargeAt - data.now) / DAY) : 0;
  const span = data.nextChargeAt && data.periodStart ? data.nextChargeAt - data.periodStart : 30 * DAY;
  // El anillo muestra lo que QUEDA del mes pagado.
  const progress = data.nextChargeAt ? Math.min(1, Math.max(0.04, (data.nextChargeAt - data.now) / span)) : 0;
  const who = firstName(data.name, data.email);

  const ask = (text: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Bryan, soy ${data.name || data.email} (suscripción Todo Digital). ${text} `)}`;

  const stagger = (i: number) => ({ "--fx-delay": `${i * 70}ms` }) as React.CSSProperties;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Saludo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-11 place-items-center rounded-full bg-ink text-lg font-bold uppercase text-lime">
            {who.charAt(0)}
          </span>
          <div className="leading-tight">
            <p className="display-title text-xl text-ink sm:text-2xl">Hola, {who}</p>
            <p className="text-xs text-ink/60 sm:text-sm">{data.email}</p>
          </div>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <LogOut aria-hidden className="h-4 w-4" />
            Salir
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        {/* Plan y próximo cobro */}
        <div data-fx="up" className="lg:col-span-7">
          <section className="relative flex h-full flex-col gap-5 overflow-hidden rounded-card bg-ink p-5 text-white sm:p-6">
            <div aria-hidden className="mesh-glow-a opacity-50" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white/60">Tu plan</p>
                <p className="display-title mt-1 text-[1.6rem] leading-none">Todo Digital</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold", status.tone)}>{status.label}</span>
            </div>
            <div className="relative flex flex-wrap items-center gap-5">
              {active && data.nextChargeAt && !data.cancelAtPeriodEnd ? (
                <DaysRing days={days} progress={progress} />
              ) : (
                <span aria-hidden className="grid size-32 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/50 sm:size-36">
                  <CalendarClock className="h-10 w-10" />
                </span>
              )}
              <dl className="flex min-w-0 flex-1 flex-col gap-3 text-sm">
                <div>
                  <dt className="text-white/60">
                    {data.cancelAtPeriodEnd ? "Tu acceso termina" : active ? "Próximo cobro" : "Estado"}
                  </dt>
                  <dd className="text-lg font-bold">
                    {active && data.nextChargeAt
                      ? date(data.nextChargeAt)
                      : data.cancelAtPeriodEnd
                        ? date(data.nextChargeAt)
                        : status.label}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <dt className="text-white/60">Mensualidad</dt>
                    <dd className="font-bold tabular-nums">{money(data.amount, data.currency)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Suscrito desde</dt>
                    <dd className="font-bold">{date(data.startedAt)}</dd>
                  </div>
                  {data.charges !== null && (
                    <div>
                      <dt className="text-white/60">Meses pagados</dt>
                      <dd className="font-bold tabular-nums">{data.charges}</dd>
                    </div>
                  )}
                </div>
              </dl>
            </div>
            {data.status === "past_due" && (
              <p className="relative rounded-[1rem] bg-destructive/20 px-4 py-3 text-sm font-medium">
                No pudimos cobrar tu mensualidad. Actualiza tu tarjeta para que no se pause tu suscripción.
              </p>
            )}
            <div className="relative mt-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={demo ? undefined : onManage}
                aria-disabled={demo || managing}
                tabIndex={demo ? -1 : undefined}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                {managing ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <CreditCard aria-hidden className="h-4 w-4 text-lime" />}
                {data.provider === "stripe"
                  ? "Tarjeta, facturas o cancelar"
                  : data.provider === "mercadopago"
                    ? "Administrar en Mercado Pago"
                    : "Pagar o cambiar mi plan"}
              </button>
            </div>
          </section>
        </div>

        {/* Pedir algo nuevo */}
        <div data-fx="up" style={stagger(1)} className="lg:col-span-5">
          <section className="flex h-full flex-col gap-4 rounded-card bg-lime p-5 text-ink sm:p-6">
            <div>
              <p className="display-title text-[1.4rem] leading-tight">¿Qué necesitas hoy?</p>
              <p className="mt-1 text-sm text-ink/75">Toca una opción y escríbenos los detalles. Llega en 1 a 2 días hábiles.</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {QUICK_ASKS.map(({ Icon, label, text }, i) => {
                const inner = (
                  <>
                    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-lime">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{label}</span>
                    <FaWhatsapp aria-hidden className="h-4 w-4 text-forest transition-transform group-hover:scale-110" />
                  </>
                );
                const cls =
                  "group flex min-h-11 items-center gap-3 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors hover:bg-white";
                return (
                  <motion.li
                    key={label}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {demo ? (
                      <span className={cls}>{inner}</span>
                    ) : (
                      <a href={ask(text)} target="_blank" rel="noopener noreferrer" className={cls}>
                        {inner}
                      </a>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Lo que incluye */}
        <div data-fx="up" style={stagger(2)} className="lg:col-span-7">
          <section className="h-full rounded-card bg-white p-5 ring-1 ring-ink/[0.08] sm:p-6">
            <p className="display-title text-[1.3rem] text-ink">Tu plan incluye</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {SUBSCRIPTION_INCLUDES.map((group, i) => {
                const Icon = INCLUDE_ICONS[i] ?? Sparkle;
                return (
                  <li key={group.title} className="flex gap-3 rounded-[1.1rem] bg-mint p-3">
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-lime">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink">{group.title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink/65">{group.items.slice(0, 2).join(" · ")}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Cómo trabajamos */}
        <div data-fx="up" style={stagger(3)} className="lg:col-span-5">
          <section className="h-full rounded-card bg-white p-5 ring-1 ring-ink/[0.08] sm:p-6">
            <p className="display-title text-[1.3rem] text-ink">Así trabajamos</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {[
                { Icon: Clock, title: "1 a 2 días hábiles", body: "por solicitud, según su complejidad" },
                { Icon: ListOrdered, title: "Una solicitud a la vez", body: "manda todas: van en orden" },
                { Icon: CalendarClock, title: "Lunes a viernes, 9 a 19 h", body: "hora de Ciudad de México" },
              ].map(({ Icon, title, body }) => (
                <li key={title} className="flex items-center gap-3">
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-lime text-ink">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{title}</span>
                    <span className="block text-ink/60">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-xs text-ink/55">
              <Check aria-hidden className="h-3.5 w-3.5 text-forest" strokeWidth={3} />
              Cambios ilimitados en todo lo que entregamos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

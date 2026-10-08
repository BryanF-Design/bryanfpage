"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Building2,
  Check,
  Copy,
  CreditCard,
  LayoutPanelTop,
  Loader2,
  Mail,
  Minus,
  Nfc,
  Plus,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkle,
  Store,
  TicketPercent,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SiStripe, SiMercadopago } from "react-icons/si";

const STRIPE_BRAND = "#635BFF";
const MERCADOPAGO_BRAND = "#00B1EA";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { trackEvent } from "@/lib/analytics";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  formatMoney,
  getUsdMxnRate,
  mxnToUsd,
  type Currency,
} from "@/lib/currency";
import {
  CONFIGURATOR_MODULES as MODULE_META,
  CONFIGURATOR_PLANS as PLAN_META,
  SECTION_PRICE,
} from "@/lib/catalog";

/** Íconos redondos de cada paquete y módulo, por id del catálogo. */
const PLAN_ICONS: Record<string, LucideIcon> = {
  full: Rocket,
  update: RefreshCw,
  maintenance: ShieldCheck,
};
const MODULE_ICONS: Record<string, LucideIcon> = {
  ecommerce: Store,
  payments: CreditCard,
  maintenance: Wrench,
};

/** "1. Elige tu paquete" → "Elige tu paquete": el número va en su insignia. */
function stepText(label: string) {
  return label.replace(/^\s*\d+\s*[.)．、]\s*/, "");
}

/** Cabecera de paso: insignia redonda numerada + título. */
function StepHeader({ n, id, label }: { n: number; id?: string; label: string }) {
  return (
    <span id={id} className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-[0.9375rem] font-bold tabular-nums text-lime">
        {n}
      </span>
      <span className="display-title text-[1.45rem] leading-tight sm:text-[1.7rem]">{stepText(label)}</span>
    </span>
  );
}

/** Un paso del cobro: la insignia y un riel punteado que baja al siguiente. */
function Step({ children, last = false }: { children: ReactNode; last?: boolean }) {
  return (
    <div className="relative">
      {!last && (
        <span
          aria-hidden
          className="absolute bottom-[-2.25rem] left-5 top-12 hidden w-0 -translate-x-1/2 border-l-2 border-dashed border-ink/15 sm:block"
        />
      )}
      {children}
    </div>
  );
}

/** Pila de medios de pago, como la prueba social de las referencias. */
function PayStack({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-center -space-x-2.5", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-white ring-[3px] ring-[hsl(var(--nb,var(--canvas)))]">
        <SiStripe className="h-4 w-4" style={{ color: STRIPE_BRAND }} />
      </span>
      <span className="grid size-11 place-items-center rounded-full bg-white ring-[3px] ring-[hsl(var(--nb,var(--canvas)))]">
        <SiMercadopago className="h-5 w-5" style={{ color: MERCADOPAGO_BRAND }} />
      </span>
      <span className="grid size-11 place-items-center rounded-full bg-ink text-lime ring-[3px] ring-[hsl(var(--nb,var(--canvas)))]">
        <Building2 className="h-4 w-4" />
      </span>
      <span className="grid size-11 place-items-center rounded-full bg-lime text-ink ring-[3px] ring-[hsl(var(--nb,var(--canvas)))]">
        <ShieldCheck className="h-4 w-4" />
      </span>
    </span>
  );
}

const WA_PHONE = "525663012505";
const USD_MXN_RATE = getUsdMxnRate(process.env.NEXT_PUBLIC_USD_MXN_RATE);

const BANK_VALUES = {
  banco: "BBVA Bancomer",
  titular: "Bryan Fernando López López",
  cuenta: "1534366643",
  clabe: "012180015343666431",
  swift: "BCMRMXMMPYM",
};

function getPlans(t: Dictionary) {
  return PLAN_META.map((m) => ({
    ...m,
    ...t.configurator.plans[m.id as keyof typeof t.configurator.plans],
  }));
}

function getModules(t: Dictionary) {
  return MODULE_META.map((m) => ({
    ...m,
    label: t.configurator.modules[m.id as keyof typeof t.configurator.modules],
  }));
}

function getBank(t: Dictionary) {
  return (Object.keys(BANK_VALUES) as (keyof typeof BANK_VALUES)[]).map((key) => ({
    label: t.configurator.bank[key],
    value: BANK_VALUES[key],
  }));
}

function formatMXN(value: number) {
  return formatMoney(value, "MXN");
}

const QUOTE_KEY = "bryanf_quote_v1";

export function Configurator({ hideHeading = false }: { hideHeading?: boolean } = {}) {
  const { t } = useLanguage();
  const PLANS = getPlans(t);
  const MODULES = getModules(t);
  const BANK = getBank(t);

  const [planId, setPlanId] = useState<string>("full");
  const [mods, setMods] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState(0);
  const [mode, setMode] = useState<"liquidacion" | "anticipo">("liquidacion");
  const [currency, setCurrency] = useState<Currency>("MXN");
  const [restored, setRestored] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [transfer, setTransfer] = useState(false);
  const [copied, setCopied] = useState("");

  const plan = PLANS.find((p) => p.id === planId)!;

  // Preselección por enlace: Lumina (o cualquier CTA) puede mandar a
  // /crear-web?plan=full&modules=ecommerce,payments&sections=2 y el cotizador
  // arranca con esa configuración. El deep-link gana sobre lo guardado.
  // Retomar después: si no hay deep-link, restaura lo guardado en el dispositivo.
  // Sólo cliente (localStorage/URL no existen en SSR).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hasDeepLink =
        params.has("plan") || params.has("modules") || params.has("sections");
      if (hasDeepLink) {
        const p = params.get("plan");
        if (p && PLAN_META.some((x) => x.id === p)) setPlanId(p);
        const wanted = (params.get("modules") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (wanted.length) {
          setMods(
            Object.fromEntries(
              MODULE_META.filter((m) => wanted.includes(m.id)).map((m) => [m.id, true])
            )
          );
        }
        const sec = Number(params.get("sections"));
        if (Number.isFinite(sec)) setSections(Math.max(0, Math.min(50, Math.floor(sec))));
        const dlMode = params.get("mode");
        if (dlMode === "anticipo" || dlMode === "liquidacion") setMode(dlMode);
        const dlCur = params.get("currency");
        if (dlCur === "MXN" || dlCur === "USD") setCurrency(dlCur);
        setRestored(true);
        return;
      }
    } catch {
      /* URL no disponible */
    }
    try {
      const raw = window.localStorage.getItem(QUOTE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Record<string, unknown>;
        if (s && typeof s === "object") {
          if (typeof s.planId === "string" && PLAN_META.some((p) => p.id === s.planId))
            setPlanId(s.planId);
          if (s.mods && typeof s.mods === "object")
            setMods(
              Object.fromEntries(
                Object.entries(s.mods as Record<string, unknown>).filter(
                  ([k, v]) => MODULE_META.some((m) => m.id === k) && typeof v === "boolean"
                )
              ) as Record<string, boolean>
            );
          const sec = Number(s.sections);
          if (Number.isFinite(sec)) setSections(Math.max(0, Math.min(50, Math.floor(sec))));
          if (s.mode === "anticipo" || s.mode === "liquidacion") setMode(s.mode);
          if (s.currency === "MXN" || s.currency === "USD") setCurrency(s.currency);
        }
      }
    } catch {
      /* storage bloqueado o corrupto */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(
        QUOTE_KEY,
        JSON.stringify({ planId, mods, sections, mode, currency })
      );
    } catch {
      /* storage bloqueado */
    }
  }, [restored, planId, mods, sections, mode, currency]);

  // Cada partida vive en MXN (precio fuente); la vista y el cobro se derivan
  // según la moneda elegida, con redondeo hacia arriba por partida en USD
  // para que la suma mostrada siempre cuadre con el total mostrado.
  const items = useMemo(() => {
    const list: { source: string; price: number }[] = [
      { source: plan.name, price: plan.price },
    ];
    MODULES.forEach((m) => {
      if (mods[m.id]) list.push({ source: m.label, price: m.price });
    });
    if (sections > 0)
      list.push({
        source: t.configurator.additionalSectionsLabel(sections),
        price: sections * SECTION_PRICE,
      });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, mods, sections, t]);

  const inCurrency = (mxn: number) =>
    currency === "MXN" ? mxn : mxnToUsd(mxn, USD_MXN_RATE);
  const display = (mxn: number) => formatMoney(inCurrency(mxn), currency);

  const projectTotal = useMemo(
    () => Math.max(0, Math.round(items.reduce((a, b) => a + inCurrency(b.price), 0))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, currency]
  );
  const projectTotalMxn = useMemo(
    () => Math.max(0, Math.round(items.reduce((a, b) => a + b.price, 0))),
    [items]
  );
  const payableNow =
    mode === "anticipo" ? Math.ceil(projectTotal * 0.5) : projectTotal;
  const payableNowMxn =
    mode === "anticipo" ? Math.ceil(projectTotalMxn * 0.5) : projectTotalMxn;

  const moduleList =
    items
      .slice(1)
      .map((i) => i.source)
      .join(", ") || t.configurator.none;

  function applyCoupon() {
    // No hay cupones activos por defecto (igual que el sitio actual).
    if (!coupon.trim()) {
      setCouponMsg("");
      return;
    }
    setCouponMsg(t.configurator.couponNoneActive);
  }

  async function pay(endpoint: string, label: string) {
    setLoading(label);
    setStatus(t.configurator.opening(label));
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: projectTotal,
          currency,
          modalidad: mode,
          // Selección estructurada: el servidor recompone el precio desde el
          // catálogo con esto y cobra su propio total (no el del navegador).
          selection: {
            planId,
            moduleIds: MODULES.filter((m) => mods[m.id]).map((m) => m.id),
            sections,
          },
          descripcion: `Configura tu Proyecto Web - ${plan.name}`,
          metadata: {
            flow: "fast-track",
            modules: moduleList,
            coupon: coupon.trim() || "none",
            currency,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus(t.configurator.openFailed(String(data.error || res.status)));
        return;
      }
      const url = data.checkoutUrl || data.initPoint;
      if (url) {
        trackEvent("begin_checkout", {
          payment_provider: label,
          value: payableNowMxn,
          currency,
        });
        window.open(url, "_blank", "noopener,noreferrer");
        setStatus(t.configurator.openedInTab(label));
      } else {
        setStatus(t.configurator.noPaymentLink);
      }
    } catch {
      setStatus(t.configurator.connectionError);
    } finally {
      setLoading(null);
    }
  }

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  }

  // Enviar cotización por correo: abre el cliente de correo del usuario con el
  // resumen ya redactado (sin backend, funciona siempre).
  function emailQuote() {
    const lines = items.map((it) => `• ${it.source}: ${display(it.price)}`).join("\n");
    const body = `${t.configurator.summary}:\n${lines}\n\n${t.configurator.totalProject}: ${formatMoney(
      projectTotal,
      currency
    )}\n${t.configurator.payNow}: ${formatMoney(payableNow, currency)}`;
    window.location.href = `mailto:bryanf@bryanfdesign.com.mx?subject=${encodeURIComponent(
      t.configurator.emailQuoteSubject
    )}&body=${encodeURIComponent(body)}`;
  }

  // La transferencia siempre es a cuenta mexicana: montos en MXN.
  const transferMsg = encodeURIComponent(
    t.configurator.whatsappTransferMsg({
      plan: plan.name,
      modules: moduleList,
      mode: mode === "anticipo" ? t.configurator.modeAdvanceLabel : t.configurator.modeFullLabel,
      total: formatMXN(projectTotalMxn),
      payNow: formatMXN(payableNowMxn),
    })
  );

  // Íconos del resumen, en el mismo orden que `items`: paquete, módulos
  // activos y secciones adicionales.
  const itemIcons: LucideIcon[] = [
    PLAN_ICONS[plan.id] ?? Rocket,
    ...MODULES.filter((m) => mods[m.id]).map((m) => MODULE_ICONS[m.id] ?? Plus),
    ...(sections > 0 ? [LayoutPanelTop] : []),
  ];

  return (
    <section
      id="precios"
      aria-label={t.configurator.title}
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      {/* IZQUIERDA: la configuración, como una pantalla de cobro. */}
      <div data-fx="up" className="min-w-0 lg:col-span-7 xl:col-span-8">
        <div className="panel relative flex h-full flex-col gap-9 p-4 pt-5 shadow-soft sm:gap-10 sm:p-7 lg:p-10">
          {!hideHeading && (
            <>
              <div className="notch notch-tr hidden sm:flex">
                <PayStack />
              </div>
              <SectionHeading
                eyebrow={t.configurator.eyebrow}
                title={t.configurator.title}
                subtitle={t.configurator.subtitle}
                chapter={{ index: 8 }}
                className="relative px-1 sm:px-0 [&_p]:text-[0.975rem] md:[&_p]:text-base"
              />
            </>
          )}

          {/* Paso 1: paquetes. */}
          <Step>
            <p className="px-1 sm:px-0">
              <StepHeader n={1} id="configurator-plan-label" label={t.configurator.step1} />
            </p>
            <div
              role="group"
              aria-labelledby="configurator-plan-label"
              className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-3 sm:gap-3 sm:pl-14"
            >
              {PLANS.map((p) => {
                const active = p.id === planId;
                const Icon = PLAN_ICONS[p.id] ?? Rocket;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPlanId(p.id)}
                    className={cn(
                      "group relative grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 rounded-card p-3.5 text-left text-ink transition-[background-color,box-shadow,transform] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:content-start sm:items-start sm:gap-y-0 sm:p-4 lg:p-5",
                      active
                        ? "bg-lime shadow-[0_18px_36px_-20px_hsl(var(--lime-deep)/0.95)]"
                        : "bg-mint ring-1 ring-inset ring-ink/10 hover:ring-ink/30"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-11 place-items-center rounded-full transition-colors duration-300 sm:col-start-1 sm:row-start-1",
                        active ? "bg-ink text-lime" : "bg-white text-ink ring-1 ring-ink/10"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 sm:col-span-2 sm:row-start-2 sm:mt-5">
                      <span className="flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-tight">
                        {p.name}
                        {p.featured && (
                          <Sparkle aria-hidden className="h-3.5 w-3.5 shrink-0 fill-ink text-ink" />
                        )}
                      </span>
                      <span className="display-title mt-1 block text-[1.6rem] tabular-nums sm:mt-1.5 sm:text-[2rem]">
                        {display(p.price)}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-7 place-items-center rounded-full transition-all duration-300 [transition-timing-function:var(--ease-pop)] sm:col-start-2 sm:row-start-1 sm:justify-self-end",
                        active
                          ? "scale-100 bg-ink text-lime"
                          : "scale-90 text-transparent ring-[1.5px] ring-inset ring-ink/25"
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span
                      className={cn(
                        "col-span-3 text-pretty text-sm leading-snug sm:col-span-2 sm:row-start-3 sm:mt-2",
                        active ? "text-ink/75" : "text-muted-foreground"
                      )}
                    >
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Paso 2: módulos extra y secciones. */}
          <Step>
            <p className="px-1 sm:px-0">
              <StepHeader n={2} id="configurator-modules-label" label={t.configurator.step2} />
            </p>
            <div
              role="group"
              aria-labelledby="configurator-modules-label"
              className="mt-4 flex flex-col gap-1.5 rounded-card bg-mint p-1.5 ring-1 ring-inset ring-ink/[0.06] sm:ml-14 sm:mt-5"
            >
              {MODULES.map((m) => {
                const Icon = MODULE_ICONS[m.id] ?? Plus;
                return (
                  <label
                    key={m.id}
                    className="flex min-h-16 cursor-pointer items-center gap-3 rounded-[calc(var(--r-card)-0.375rem)] bg-white p-2.5 pr-3 transition-colors duration-300 hover:bg-white/70 has-[:checked]:bg-lime-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink sm:p-3 sm:pr-4"
                  >
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <span className="text-[0.9375rem] font-semibold leading-snug text-ink">{m.label}</span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-forest sm:text-base">
                        +{display(m.price)}
                      </span>
                    </span>
                    <span className="relative ml-1 inline-flex shrink-0">
                      <input
                        type="checkbox"
                        role="switch"
                        checked={!!mods[m.id]}
                        onChange={(e) =>
                          setMods((s) => ({ ...s, [m.id]: e.target.checked }))
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="block h-7 w-12 rounded-full bg-ink/15 transition-colors duration-300 peer-checked:bg-ink"
                      />
                      <span
                        aria-hidden
                        className="absolute left-1 top-1 size-5 rounded-full bg-white shadow-[0_2px_6px_hsl(var(--ink)/0.3)] transition-transform duration-300 [transition-timing-function:var(--ease-pop)] peer-checked:translate-x-5 peer-checked:bg-lime"
                      />
                    </span>
                  </label>
                );
              })}

              {/* Contador de secciones. */}
              <div className="flex min-h-16 flex-wrap items-center gap-3 rounded-[calc(var(--r-card)-0.375rem)] bg-white p-2.5 sm:p-3">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime"
                >
                  <LayoutPanelTop className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-semibold leading-snug text-ink">
                    {t.configurator.extraSections}
                  </span>
                  <span className="block text-sm tabular-nums text-muted-foreground">
                    +{display(SECTION_PRICE)} {t.configurator.perUnit}
                  </span>
                </span>
                <span className="flex items-center gap-1 rounded-full bg-mint p-1 ring-1 ring-inset ring-ink/[0.06]">
                  <button
                    type="button"
                    onClick={() => setSections((n) => Math.max(0, n - 1))}
                    className="grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_1px_2px_hsl(var(--ink)/0.12)] transition-transform hover:scale-105 active:scale-95"
                    aria-label={t.configurator.removeSection}
                  >
                    <Minus aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <span
                    className="display-title w-9 text-center text-2xl tabular-nums"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {sections}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSections((n) => n + 1)}
                    className="grid size-11 place-items-center rounded-full bg-ink text-lime transition-transform hover:scale-105 active:scale-95"
                    aria-label={t.configurator.addSection}
                  >
                    <Plus aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </span>
              </div>
            </div>
          </Step>

          {/* Paso 3: modalidad, moneda y cupón. */}
          <Step last>
            <fieldset>
              <legend className="px-1 sm:px-0">
                <StepHeader n={3} label={t.configurator.step3} />
              </legend>
              <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-mint p-1 ring-1 ring-inset ring-ink/[0.06] sm:ml-14 sm:mt-5">
                {[
                  { v: "liquidacion", label: t.configurator.paymentFull },
                  { v: "anticipo", label: t.configurator.paymentAdvance },
                ].map((o) => (
                  <label
                    key={o.v}
                    className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-center text-sm font-semibold leading-tight text-ink/70 transition-colors duration-300 hover:text-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-mint"
                  >
                    <input
                      type="radio"
                      name="payment-mode"
                      value={o.v}
                      checked={mode === o.v}
                      onChange={() => setMode(o.v as "liquidacion" | "anticipo")}
                      className="sr-only"
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-5 sm:ml-14 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4">
              <div>
                <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
                  {t.configurator.currencyLabel}
                </p>
                <div
                  role="group"
                  aria-label={t.configurator.currencyLabel}
                  className="grid grid-cols-2 gap-1 rounded-full bg-mint p-1 ring-1 ring-inset ring-ink/[0.06] sm:inline-grid"
                >
                  {(["MXN", "USD"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={currency === c}
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "min-h-12 min-w-[4.75rem] rounded-full px-4 text-sm font-bold tracking-[0.02em] transition-colors duration-300",
                        currency === c
                          ? "bg-ink text-white"
                          : "text-ink/65 hover:text-ink"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <label
                  htmlFor="configurator-coupon"
                  className="mb-2 block px-1 text-xs font-semibold text-muted-foreground"
                >
                  {t.configurator.couponLabel}
                </label>
                <div className="flex items-center gap-1 rounded-full bg-mint p-1 pl-4 ring-1 ring-inset ring-ink/[0.06] focus-within:ring-2 focus-within:ring-ink">
                  <TicketPercent aria-hidden className="h-5 w-5 shrink-0 text-ink/45" />
                  <input
                    id="configurator-coupon"
                    name="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t.configurator.couponPlaceholder}
                    aria-describedby={couponMsg ? "configurator-coupon-status" : undefined}
                    autoComplete="off"
                    className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[0.9375rem] font-medium text-ink outline-none placeholder:text-ink/40 focus-visible:outline-none"
                  />
                  <Button type="button" variant="ink" onClick={applyCoupon} className="h-12 shrink-0 px-5">
                    {t.configurator.apply}
                  </Button>
                </div>
              </div>
              {(currency === "USD" || couponMsg) && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  {currency === "USD" && (
                    <p className="flex items-start gap-2 px-1 text-sm leading-snug text-muted-foreground">
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-lime-deep" />
                      {t.configurator.currencyNote(String(USD_MXN_RATE))}
                    </p>
                  )}
                  {couponMsg && (
                    <p
                      id="configurator-coupon-status"
                      role="status"
                      className="flex items-start gap-2 px-1 text-sm leading-snug text-muted-foreground"
                    >
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-signal" />
                      {couponMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Step>
        </div>
      </div>

      {/* DERECHA: el resumen como tarjeta negra, con el total en lima. */}
      <div
        data-fx="up"
        className="min-w-0 lg:col-span-5 xl:col-span-4"
        style={{ "--fx-delay": "120ms" } as CSSProperties}
      >
        <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--gutter))]">
          <div className="panel panel-ink relative flex flex-col gap-5 overflow-hidden p-4 pt-5 sm:p-7">
            <div aria-hidden className="mesh-glow-a opacity-60" />

            <div className="relative flex items-center justify-between gap-3 px-1 sm:px-0">
              <p className="display-title text-[1.75rem] leading-none text-white">
                {t.configurator.summary}
              </p>
              <span className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3.5 text-xs font-bold tracking-[0.04em] text-white">
                <span aria-hidden className="size-2 rounded-full bg-lime" />
                {currency}
              </span>
            </div>

            {/* Partidas: filas con ícono redondo, como la actividad reciente. */}
            <ul className="relative flex flex-col rounded-card bg-white/[0.05] px-3 ring-1 ring-inset ring-white/10 sm:px-4">
              {items.map((it, i) => {
                const Icon = itemIcons[i] ?? Plus;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full",
                        i === 0 ? "bg-lime text-ink" : "bg-white/10 text-lime"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-snug text-white/80">{it.source}</span>
                    <span className="shrink-0 text-[0.9375rem] font-bold tabular-nums text-white">
                      {display(it.price)}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* El total, como la tarjeta de la referencia. */}
            <div className="relative overflow-hidden rounded-card bg-[linear-gradient(140deg,hsl(160_20%_17%),hsl(160_32%_6%))] p-5 ring-1 ring-inset ring-white/10 sm:p-6">
              <svg
                aria-hidden
                viewBox="0 0 320 160"
                fill="none"
                className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.06]"
                preserveAspectRatio="xMidYMid slice"
              >
                <path d="M-10 120 H70 a14 14 0 0 0 14 -14 V60 a14 14 0 0 1 14 -14 H180" stroke="currentColor" strokeWidth="1.5" />
                <path d="M-10 140 H110 a14 14 0 0 0 14 -14 V96 a14 14 0 0 1 14 -14 H230" stroke="currentColor" strokeWidth="1.5" />
                <path d="M150 -10 V20 a14 14 0 0 0 14 14 H330" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <Sparkle aria-hidden className="absolute right-[5.25rem] top-5 h-5 w-5 fill-lime text-lime" />

              <div className="relative flex items-stretch gap-4">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/70">{t.configurator.payNow}</span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.6875rem] font-bold text-white/85">
                      {mode === "anticipo"
                        ? t.configurator.modeAdvanceLabel
                        : t.configurator.modeFullLabel}
                    </span>
                  </p>
                  <p className="display-xl mt-3 break-all text-[clamp(3.25rem,6vw,4.25rem)] leading-[0.9] tabular-nums text-lime">
                    {formatMoney(payableNow, currency)}
                  </p>
                  {currency === "USD" && (
                    <p className="mt-1.5 text-xs font-medium tabular-nums text-white/60">
                      ≈ {formatMXN(payableNowMxn)}
                    </p>
                  )}
                  <p aria-hidden className="mt-4 flex gap-3 text-sm font-bold tracking-[0.18em] text-white/35">
                    <span>••••</span>
                    <span>••••</span>
                    <span>{String(projectTotalMxn).slice(-4).padStart(4, "0")}</span>
                  </p>
                </div>
                <span
                  aria-hidden
                  className="flex w-12 shrink-0 items-center justify-center rounded-full bg-lime text-ink sm:w-14"
                >
                  <Nfc className="h-5 w-5" />
                </span>
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-dashed border-white/15 pt-4 text-sm">
                <span className="text-white/65">{t.configurator.totalProject}</span>
                <span className="font-bold tabular-nums text-white">
                  {formatMoney(projectTotal, currency)}
                </span>
              </div>
            </div>

            {/* Botones de pago. */}
            <div className="relative flex flex-col gap-2.5">
              <Button
                size="lg"
                onClick={() => pay("/api/stripe-checkout", "Stripe")}
                disabled={!!loading || projectTotal <= 0}
                className="w-full justify-between whitespace-normal pl-2 pr-2.5 text-left leading-tight"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white">
                    {loading === "Stripe" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-ink" />
                    ) : (
                      <SiStripe
                        className="h-4 w-4"
                        style={{ color: STRIPE_BRAND }}
                        aria-hidden
                      />
                    )}
                  </span>
                  {t.configurator.payStripe}
                </span>
                <ButtonArrow tone="ink" className="mr-0 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="white"
                onClick={() => pay("/api/mercadopago", "Mercado Pago")}
                disabled={!!loading || projectTotal <= 0}
                className="w-full justify-between whitespace-normal pl-2 pr-2.5 text-left leading-tight"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00B1EA]/10">
                    {loading === "Mercado Pago" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-ink" />
                    ) : (
                      <SiMercadopago
                        className="h-5 w-5"
                        style={{ color: MERCADOPAGO_BRAND }}
                        aria-hidden
                      />
                    )}
                  </span>
                  {t.configurator.payMercadoPago}
                </span>
                <ButtonArrow tone="ink" className="mr-0 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setTransfer((prev) => !prev)}
                aria-expanded={transfer}
                aria-controls="bank-transfer-details"
                className="w-full justify-start gap-3 whitespace-normal border-white/20 pl-2 text-left leading-tight text-white hover:border-white/50 hover:bg-white/[0.06]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-lime">
                  <Building2 className="h-4 w-4" />
                </span>
                {t.configurator.payTransfer}
                <Plus
                  aria-hidden
                  className={cn(
                    "ml-auto mr-2 h-4 w-4 transition-transform duration-300",
                    transfer && "rotate-45"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                onClick={emailQuote}
                disabled={projectTotal <= 0}
                className="w-full text-white/80 hover:bg-white/[0.06] hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {t.configurator.emailQuote}
              </Button>
            </div>

            {status && (
              <p
                className="relative flex items-start gap-2.5 rounded-inner bg-white/[0.07] px-4 py-3 text-sm leading-snug text-white/85"
                role="status"
              >
                <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-lime" />
                {status}
              </p>
            )}

            {/* Datos para transferencia. */}
            {transfer && (
              <div
                id="bank-transfer-details"
                className="relative flex flex-col rounded-card bg-white/[0.05] p-4 ring-1 ring-inset ring-white/10 sm:p-5"
              >
                <p className="mb-2 text-sm leading-snug text-white/75">
                  {t.configurator.transferInstructions(formatMXN(payableNowMxn))}
                </p>
                {BANK.map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-3 border-b border-white/10 py-2 last:border-0"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-white/55">{b.label}</span>
                      <span className="block break-words text-[0.9375rem] font-bold tabular-nums tracking-[0.01em] text-white">
                        {b.value}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copy(b.value, b.label)}
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-lime hover:text-ink"
                      aria-label={t.configurator.copyLabel(b.label)}
                    >
                      {copied === b.label ? (
                        <Check className="h-4 w-4 text-lime" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
                <div className="mt-3 flex flex-col gap-2">
                  <Button asChild className="w-full whitespace-normal text-center leading-tight">
                    <a
                      href={`https://wa.me/${WA_PHONE}?text=${transferMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("begin_checkout", {
                          payment_provider: "bank_transfer",
                          value: payableNowMxn,
                          currency,
                        })
                      }
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      {t.configurator.sendWhatsapp}
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full whitespace-normal text-center leading-tight"
                  >
                    <a href="mailto:bryanf@bryanfdesign.com.mx?subject=Comprobante%20de%20transferencia%20-%20BryanF%20Design">
                      {t.configurator.sendEmail}
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <p className="relative px-2 text-center text-xs leading-relaxed text-white/60">
              <ShieldCheck aria-hidden className="-mt-0.5 mr-1.5 inline h-4 w-4 text-lime" />
              {t.configurator.securePaymentPrefix}{" "}
              <a
                href="/terminos"
                className="rounded-sm py-3 underline underline-offset-2 transition-colors hover:text-lime"
              >
                {t.configurator.terms}
              </a>{" "}
              {t.configurator.and}{" "}
              <a
                href="/privacidad"
                className="rounded-sm py-3 underline underline-offset-2 transition-colors hover:text-lime"
              >
                {t.configurator.privacyNotice}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

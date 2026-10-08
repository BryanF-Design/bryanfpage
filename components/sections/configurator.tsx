"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Check,
  Copy,
  Building2,
  Loader2,
  Mail,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SiStripe, SiMercadopago } from "react-icons/si";

const STRIPE_BRAND = "#635BFF";
const MERCADOPAGO_BRAND = "#00B1EA";

import { Button } from "@/components/ui/button";
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

  return (
    <section
      id="precios"
      aria-label={t.configurator.title}
      className="relative flex flex-col gap-gutter"
    >
        {!hideHeading && (
          <div data-fx="panel">
            <div className="panel panel-lime relative overflow-hidden p-6 md:p-10 lg:p-12">
              <span
                aria-hidden
                lang="ja"
                className="drift-y pointer-events-none absolute -right-4 -top-8 select-none font-jp text-[11rem] leading-none text-[hsl(150_42%_6%/0.08)] md:text-[15rem]"
              >
                見積
              </span>
              <SectionHeading
                eyebrow={t.configurator.eyebrow}
                title={t.configurator.title}
                subtitle={t.configurator.subtitle}
                chapter={{ kanji: "見積", romaji: "mitsumori", index: 8 }}
                size="xl"
                className="relative"
              />
            </div>
          </div>
        )}

        <div className="grid gap-gutter lg:grid-cols-[1.3fr_1fr]">
          {/* LEFT: configuration */}
          <div data-fx="left" className="min-w-0">
          <div className="panel flex h-full flex-col gap-9 p-4 sm:p-6 md:p-9">
            {/* Plans */}
            <div>
              <p
                id="configurator-plan-label"
                className="mb-4 font-display text-[1.6rem] font-black uppercase leading-none text-foreground"
              >
                {t.configurator.step1}
              </p>
              <div
                role="group"
                aria-labelledby="configurator-plan-label"
                className="grid gap-3 sm:grid-cols-3"
              >
                {PLANS.map((p) => {
                  const active = p.id === planId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setPlanId(p.id)}
                      className={cn(
                        "group relative flex min-h-11 flex-col px-shape p-4 text-left transition-[background-color,box-shadow,transform] duration-300 [transition-timing-function:var(--ease-material)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active
                          ? "bg-primary text-primary-foreground shadow-[0_18px_40px_-20px_hsl(var(--primary)/0.9)]"
                          : "bg-secondary text-foreground ring-1 ring-foreground/10 hover:ring-primary/50"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute right-3 top-3 grid size-6 place-items-center rounded-full transition-all duration-300",
                          active
                            ? "scale-100 bg-[hsl(150_42%_6%)] text-[hsl(76_76%_58%)]"
                            : "scale-75 bg-foreground/10 text-transparent"
                        )}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="pr-7 text-sm font-semibold">
                        {p.name}
                      </span>
                      <span className="mt-2 font-display text-[2rem] font-black leading-none">
                        {display(p.price)}
                      </span>
                      <span
                        className={cn(
                          "mt-2 text-xs",
                          active ? "text-primary-foreground/75" : "text-muted-foreground"
                        )}
                      >
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modules */}
            <div>
              <p
                id="configurator-modules-label"
                className="mb-4 font-display text-[1.6rem] font-black uppercase leading-none text-foreground"
              >
                {t.configurator.step2}
              </p>
              <div
                role="group"
                aria-labelledby="configurator-modules-label"
                className="flex flex-col gap-2"
              >
                {MODULES.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-full px-5 py-3 transition-colors duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
                      mods[m.id]
                        ? "bg-primary/15 ring-1 ring-primary/60"
                        : "bg-secondary ring-1 ring-foreground/10 hover:ring-primary/40"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!mods[m.id]}
                        onChange={(e) =>
                          setMods((s) => ({ ...s, [m.id]: e.target.checked }))
                        }
                        className="h-4 w-4 accent-primary focus-visible:outline-none"
                      />
                      <span className="text-sm text-foreground">{m.label}</span>
                    </span>
                    <span className="shrink-0 font-display text-[1.15rem] leading-none text-primary">
                      +{display(m.price)}
                    </span>
                  </label>
                ))}

                {/* Sections counter */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-shape bg-secondary py-2 pl-5 pr-2 ring-1 ring-foreground/10">
                  <span className="text-sm text-foreground">
                    {t.configurator.extraSections}
                    <span className="ml-1 font-mono text-xs text-muted-foreground">
                      (+{display(SECTION_PRICE)} {t.configurator.perUnit})
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSections((n) => Math.max(0, n - 1))}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-background text-lg text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={t.configurator.removeSection}
                    >
                      −
                    </button>
                    <span
                      className="w-7 text-center font-display text-2xl font-black"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {sections}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSections((n) => n + 1)}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-background text-lg text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={t.configurator.addSection}
                    >
                      +
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Payment mode + currency + coupon */}
            <div className="grid gap-5 px-shape bg-secondary/60 p-4 ring-1 ring-foreground/10 sm:grid-cols-3 sm:p-5">
              <fieldset>
                <legend className="tech-label mb-2 text-primary">
                  {t.configurator.step3}
                </legend>
                <div className="flex flex-col gap-2">
                  {[
                    { v: "liquidacion", label: t.configurator.paymentFull },
                    { v: "anticipo", label: t.configurator.paymentAdvance },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-1 text-sm text-foreground focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
                    >
                      <input
                        type="radio"
                        name="payment-mode"
                        value={o.v}
                        checked={mode === o.v}
                        onChange={() => setMode(o.v as "liquidacion" | "anticipo")}
                        className="h-4 w-4 accent-primary focus-visible:outline-none"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <p className="tech-label mb-2 text-primary">
                  {t.configurator.currencyLabel}
                </p>
                <div
                  role="group"
                  aria-label={t.configurator.currencyLabel}
                  className="inline-flex overflow-hidden rounded-full bg-background p-1 ring-1 ring-foreground/10"
                >
                  {(["MXN", "USD"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={currency === c}
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "min-h-11 min-w-11 rounded-full px-4 py-2 font-mono text-xs font-medium tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                        currency === c
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {currency === "USD" && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.configurator.currencyNote(String(USD_MXN_RATE))}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="configurator-coupon"
                  className="tech-label mb-2 block text-primary"
                >
                  {t.configurator.couponLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    id="configurator-coupon"
                    name="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t.configurator.couponPlaceholder}
                    aria-describedby={couponMsg ? "configurator-coupon-status" : undefined}
                    autoComplete="off"
                    className="min-h-11 min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyCoupon}
                    className="min-h-11"
                  >
                    {t.configurator.apply}
                  </Button>
                </div>
                {couponMsg && (
                  <p
                    id="configurator-coupon-status"
                    role="status"
                    className="mt-2 text-xs text-muted-foreground"
                  >
                    {couponMsg}
                  </p>
                )}
              </div>
            </div>
          </div>

          </div>

          {/* RIGHT: summary + pay */}
          <div data-fx="right" className="min-w-0" style={{ "--fx-delay": "120ms" } as CSSProperties}>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--gutter))]">
            <div className="panel panel-moss relative flex flex-col gap-4 overflow-hidden p-6 md:p-8">
              <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_50%)]" />
              <p className="relative flex items-center justify-between gap-3">
                <span className="font-display text-[1.6rem] font-black uppercase leading-none text-foreground">
                  {t.configurator.summary}
                </span>
                <span aria-hidden lang="ja" className="grid size-9 place-items-center rounded-full bg-primary font-jp text-xs text-primary-foreground">
                  見
                </span>
              </p>
              <div className="relative flex flex-col gap-2 px-shape bg-background/55 p-4">
                {items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-foreground/70">{it.source}</span>
                    <span className="font-display text-[1.15rem] leading-none text-foreground">
                      {display(it.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative border-t border-dashed border-foreground/20 pt-4">
                <div className="flex items-center justify-between text-sm text-foreground/70">
                  <span>{t.configurator.totalProject}</span>
                  <span className="font-display text-[1.15rem] leading-none">{formatMoney(projectTotal, currency)}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t.configurator.payNow}
                  </span>
                  <span className="font-display text-[3.25rem] font-black leading-none text-primary md:text-[3.75rem]">
                    {formatMoney(payableNow, currency)}
                  </span>
                </div>
                {currency === "USD" && (
                  <p className="mt-1 text-right font-mono text-xs text-muted-foreground">
                    ≈ {formatMXN(payableNowMxn)}
                  </p>
                )}
              </div>

              {/* Pay buttons */}
              <div className="relative flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => pay("/api/stripe-checkout", "Stripe")}
                  disabled={!!loading || projectTotal <= 0}
                  className="min-h-11 w-full"
                >
                  {loading === "Stripe" ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <SiStripe
                      className="mr-1 h-4 w-4"
                      style={{ color: STRIPE_BRAND }}
                      aria-hidden
                    />
                  )}
                  {t.configurator.payStripe}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => pay("/api/mercadopago", "Mercado Pago")}
                  disabled={!!loading || projectTotal <= 0}
                  className="min-h-11 w-full"
                >
                  {loading === "Mercado Pago" ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <SiMercadopago
                      className="mr-1 h-4 w-4"
                      style={{ color: MERCADOPAGO_BRAND }}
                      aria-hidden
                    />
                  )}
                  {t.configurator.payMercadoPago}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTransfer((prev) => !prev)}
                  aria-expanded={transfer}
                  aria-controls="bank-transfer-details"
                  className="min-h-11 w-full"
                >
                  <Building2 className="mr-1 h-4 w-4" />
                  {t.configurator.payTransfer}
                </Button>
                <Button
                  variant="ghost"
                  onClick={emailQuote}
                  disabled={projectTotal <= 0}
                  className="w-full"
                >
                  <Mail className="mr-1 h-4 w-4" />
                  {t.configurator.emailQuote}
                </Button>
              </div>

              {status && (
                <p className="relative rounded-2xl bg-background/60 px-4 py-3 text-xs text-foreground/80" role="status">
                  {status}
                </p>
              )}

              {/* Transfer details */}
              {transfer && (
                <div
                  id="bank-transfer-details"
                  className="relative mt-1 flex flex-col gap-2 px-shape bg-background/70 p-4"
                >
                  <p className="text-xs text-muted-foreground">
                    {t.configurator.transferInstructions(formatMXN(payableNowMxn))}
                  </p>
                  {BANK.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-display text-[1.15rem] leading-none text-foreground">
                          {b.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => copy(b.value, b.label)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={t.configurator.copyLabel(b.label)}
                        >
                          {copied === b.label ? (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 flex flex-col gap-2">
                    <Button asChild size="sm" className="min-h-11 w-full">
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
                        <FaWhatsapp className="mr-1 h-4 w-4" />
                        {t.configurator.sendWhatsapp}
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="min-h-11 w-full"
                    >
                      <a href="mailto:bryanf@bryanfdesign.com.mx?subject=Comprobante%20de%20transferencia%20-%20BryanF%20Design">
                        {t.configurator.sendEmail}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <p className="relative pt-1 text-center text-[11px] text-foreground/65">
                {t.configurator.securePaymentPrefix}{" "}
                <a
                  href="/terminos"
                  className="inline-flex min-h-11 items-center rounded-sm underline transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {t.configurator.terms}
                </a>{" "}
                {t.configurator.and}{" "}
                <a
                  href="/privacidad"
                  className="inline-flex min-h-11 items-center rounded-sm underline transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {t.configurator.privacyNotice}
                </a>
                .
              </p>
            </div>
          </div>
          </div>
        </div>
    </section>
  );
}

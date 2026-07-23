"use client";

import { useEffect, useMemo, useState } from "react";
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

  // Retomar después: guarda la configuración en este dispositivo y la restaura
  // al volver. Sólo cliente (localStorage no existe en SSR).
  useEffect(() => {
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
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-a opacity-50" />
      <div className="container relative">
        {!hideHeading && (
          <SectionHeading
            eyebrow={t.configurator.eyebrow}
            title={t.configurator.title}
            subtitle={t.configurator.subtitle}
          />
        )}

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* LEFT: configuration */}
          <div className="flex flex-col gap-8">
            {/* Plans */}
            <div>
              <p className="tech-label mb-3 text-muted-foreground">
                {t.configurator.step1}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {PLANS.map((p) => {
                  const active = p.id === planId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlanId(p.id)}
                      className={cn(
                        "elevate flex flex-col rounded-lg p-4 text-left",
                        active
                          ? "glass-tint corner-ticks"
                          : "glass hover:border-primary/40"
                      )}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {p.name}
                      </span>
                      <span className="mt-1 font-mono text-xl font-medium text-foreground">
                        {display(p.price)}
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modules */}
            <div>
              <p className="tech-label mb-3 text-muted-foreground">
                {t.configurator.step2}
              </p>
              <div className="flex flex-col gap-2">
                {MODULES.map((m) => (
                  <label
                    key={m.id}
                    className="glass elevate flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 hover:border-primary/40"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!mods[m.id]}
                        onChange={(e) =>
                          setMods((s) => ({ ...s, [m.id]: e.target.checked }))
                        }
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-foreground">{m.label}</span>
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      +{display(m.price)}
                    </span>
                  </label>
                ))}

                {/* Sections counter */}
                <div className="glass flex items-center justify-between rounded-lg px-4 py-3">
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
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground hover:border-primary"
                      aria-label={t.configurator.removeSection}
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-mono text-sm">
                      {sections}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSections((n) => n + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground hover:border-primary"
                      aria-label={t.configurator.addSection}
                    >
                      +
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Payment mode + currency + coupon */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="tech-label mb-2 text-muted-foreground">
                  {t.configurator.step3}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { v: "liquidacion", label: t.configurator.paymentFull },
                    { v: "anticipo", label: t.configurator.paymentAdvance },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                    >
                      <input
                        type="radio"
                        name="mode"
                        checked={mode === o.v}
                        onChange={() => setMode(o.v as "liquidacion" | "anticipo")}
                        className="h-4 w-4 accent-primary"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="tech-label mb-2 text-muted-foreground">
                  {t.configurator.currencyLabel}
                </p>
                <div
                  role="group"
                  aria-label={t.configurator.currencyLabel}
                  className="inline-flex overflow-hidden rounded-md border border-border"
                >
                  {(["MXN", "USD"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={currency === c}
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "px-4 py-2 font-mono text-xs font-medium tracking-[0.12em] transition-colors",
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
                <p className="tech-label mb-2 text-muted-foreground">{t.configurator.couponLabel}</p>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t.configurator.couponPlaceholder}
                    className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="button" variant="outline" onClick={applyCoupon}>
                    {t.configurator.apply}
                  </Button>
                </div>
                {couponMsg && (
                  <p className="mt-2 text-xs text-muted-foreground">{couponMsg}</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: summary + pay */}
          <div className="lg:sticky lg:top-24">
            <div className="glass-tint corner-ticks flex flex-col gap-4 rounded-lg p-6">
              <p className="tech-label text-muted-foreground">{t.configurator.summary}</p>
              <div className="flex flex-col gap-2">
                {items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{it.source}</span>
                    <span className="font-mono text-foreground">
                      {display(it.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t.configurator.totalProject}</span>
                  <span className="font-mono">{formatMoney(projectTotal, currency)}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t.configurator.payNow}
                  </span>
                  <span className="font-mono text-3xl font-medium text-primary">
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
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => pay("/api/stripe-checkout", "Stripe")}
                  disabled={!!loading || projectTotal <= 0}
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
                <p className="text-xs text-muted-foreground" role="status">
                  {status}
                </p>
              )}

              {/* Transfer details */}
              {transfer && (
                <div className="glass mt-1 flex flex-col gap-2 rounded-lg p-4">
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
                        <span className="font-mono text-foreground">
                          {b.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => copy(b.value, b.label)}
                          className="text-muted-foreground hover:text-primary"
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
                    <Button asChild size="sm" className="w-full">
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
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <a href="mailto:bryanf@bryanfdesign.com.mx?subject=Comprobante%20de%20transferencia%20-%20BryanF%20Design">
                        {t.configurator.sendEmail}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <p className="pt-1 text-center text-[11px] text-muted-foreground">
                {t.configurator.securePaymentPrefix}{" "}
                <a href="/terminos" className="underline hover:text-primary">
                  {t.configurator.terms}
                </a>{" "}
                {t.configurator.and}{" "}
                <a href="/privacidad" className="underline hover:text-primary">
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

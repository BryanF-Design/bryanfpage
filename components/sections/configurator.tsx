"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Building2,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SiStripe, SiMercadopago } from "react-icons/si";

const STRIPE_BRAND = "#635BFF";
const MERCADOPAGO_BRAND = "#00B1EA";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const WA_PHONE = "525663012505";

const PLAN_META = [
  { id: "full", price: 3500, featured: true },
  { id: "update", price: 1800, featured: false },
  { id: "maintenance", price: 1000, featured: false },
] as const;

const MODULE_META = [
  { id: "ecommerce", price: 3500 },
  { id: "payments", price: 1500 },
  { id: "maintenance", price: 1000 },
] as const;

const SECTION_PRICE = 350;

const BANK_VALUES = {
  banco: "BBVA Bancomer",
  titular: "Bryan Fernando López López",
  cuenta: "1534366643",
  clabe: "012180015343666431",
  swift: "BCMRMXMMPYM",
};

function getPlans(t: Dictionary) {
  return PLAN_META.map((m) => ({ ...m, ...t.configurator.plans[m.id] }));
}

function getModules(t: Dictionary) {
  return MODULE_META.map((m) => ({ ...m, label: t.configurator.modules[m.id] }));
}

function getBank(t: Dictionary) {
  return (Object.keys(BANK_VALUES) as (keyof typeof BANK_VALUES)[]).map((key) => ({
    label: t.configurator.bank[key],
    value: BANK_VALUES[key],
  }));
}

function formatMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function Configurator() {
  const { t } = useLanguage();
  const PLANS = getPlans(t);
  const MODULES = getModules(t);
  const BANK = getBank(t);

  const [planId, setPlanId] = useState<string>("full");
  const [mods, setMods] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState(0);
  const [mode, setMode] = useState<"liquidacion" | "anticipo">("liquidacion");
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [transfer, setTransfer] = useState(false);
  const [copied, setCopied] = useState("");

  const plan = PLANS.find((p) => p.id === planId)!;

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

  const projectTotal = useMemo(
    () => Math.max(0, Math.round(items.reduce((a, b) => a + b.price, 0))),
    [items]
  );
  const payableNow =
    mode === "anticipo" ? Math.round(projectTotal * 0.5) : projectTotal;

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
          modalidad: mode,
          descripcion: `Configura tu Proyecto Web - ${plan.name}`,
          metadata: {
            flow: "fast-track",
            modules: moduleList,
            coupon: coupon.trim() || "none",
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

  const transferMsg = encodeURIComponent(
    t.configurator.whatsappTransferMsg({
      plan: plan.name,
      modules: moduleList,
      mode: mode === "anticipo" ? t.configurator.modeAdvanceLabel : t.configurator.modeFullLabel,
      total: formatMXN(projectTotal),
      payNow: formatMXN(payableNow),
    })
  );

  return (
    <section
      id="precios"
      aria-label={t.configurator.title}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-a opacity-50" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.configurator.eyebrow}
          title={t.configurator.title}
          subtitle={t.configurator.subtitle}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* LEFT: configuration */}
          <div className="flex flex-col gap-8">
            {/* Plans */}
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">
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
                        "elevate flex flex-col rounded-xl p-4 text-left",
                        active
                          ? "glass-tint ring-1 ring-primary"
                          : "glass hover:border-primary/40"
                      )}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {p.name}
                      </span>
                      <span className="mt-1 font-display text-2xl font-semibold text-foreground">
                        {formatMXN(p.price)}
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
              <p className="mb-3 text-sm font-medium text-foreground">
                {t.configurator.step2}
              </p>
              <div className="flex flex-col gap-2">
                {MODULES.map((m) => (
                  <label
                    key={m.id}
                    className="glass elevate flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 hover:border-primary/40"
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
                    <span className="text-sm text-muted-foreground">
                      +{formatMXN(m.price)}
                    </span>
                  </label>
                ))}

                {/* Sections counter */}
                <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
                  <span className="text-sm text-foreground">
                    {t.configurator.extraSections}
                    <span className="ml-1 text-muted-foreground">
                      (+{formatMXN(SECTION_PRICE)} {t.configurator.perUnit})
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

            {/* Payment mode + coupon */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
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
                <p className="mb-2 text-sm font-medium text-foreground">{t.configurator.couponLabel}</p>
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
            <div className="glass-tint flex flex-col gap-4 rounded-2xl p-6 shadow-xl shadow-primary/5">
              <p className="text-sm font-medium text-foreground">{t.configurator.summary}</p>
              <div className="flex flex-col gap-2">
                {items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{it.source}</span>
                    <span className="text-foreground">
                      {formatMXN(it.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t.configurator.totalProject}</span>
                  <span>{formatMXN(projectTotal)}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t.configurator.payNow}
                  </span>
                  <span className="font-display text-3xl font-semibold text-primary">
                    {formatMXN(payableNow)}
                  </span>
                </div>
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
              </div>

              {status && (
                <p className="text-xs text-muted-foreground" role="status">
                  {status}
                </p>
              )}

              {/* Transfer details */}
              {transfer && (
                <div className="glass mt-1 flex flex-col gap-2 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">
                    {t.configurator.transferInstructions(formatMXN(payableNow))}
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

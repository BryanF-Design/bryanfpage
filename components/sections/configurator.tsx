"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  CreditCard,
  Wallet,
  Building2,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";

const WA_PHONE = "525663012505";

const PLANS = [
  {
    id: "full",
    name: "Desarrollo Web",
    price: 3500,
    desc: "Tu sitio profesional a la medida, rápido y orientado a vender.",
    featured: true,
  },
  {
    id: "update",
    name: "Actualización",
    price: 1800,
    desc: "Renueva tu web actual con diseño y performance reales.",
    featured: false,
  },
  {
    id: "maintenance",
    name: "Mantenimiento",
    price: 1000,
    desc: "Tu sitio siempre al día, seguro y respaldado. Por mes.",
    featured: false,
  },
] as const;

const MODULES = [
  { id: "ecommerce", label: "E-commerce / tienda en línea", price: 3500 },
  { id: "payments", label: "Pasarela de pagos", price: 1500 },
  { id: "maintenance", label: "Mantenimiento especializado", price: 1000 },
] as const;

const SECTION_PRICE = 350;

const BANK = [
  { label: "Banco", value: "BBVA Bancomer" },
  { label: "Titular", value: "Bryan Fernando López López" },
  { label: "Cuenta", value: "1534366643" },
  { label: "CLABE", value: "012180015343666431" },
  { label: "SWIFT", value: "BCMRMXMMPYM" },
];

function formatMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function Configurator() {
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
        source: `Secciones adicionales x${sections}`,
        price: sections * SECTION_PRICE,
      });
    return list;
  }, [plan, mods, sections]);

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
      .join(", ") || "ninguno";

  function applyCoupon() {
    // No hay cupones activos por defecto (igual que el sitio actual).
    if (!coupon.trim()) {
      setCouponMsg("");
      return;
    }
    setCouponMsg(
      "No hay cupones activos por el momento. Revisa nuestras redes o pregunta a Lumina."
    );
  }

  async function pay(endpoint: string, label: string) {
    setLoading(label);
    setStatus(`Abriendo ${label}…`);
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
        setStatus(
          `No se pudo abrir el pago (${data.error || res.status}). Intenta con transferencia o escríbenos por WhatsApp.`
        );
        return;
      }
      const url = data.checkoutUrl || data.initPoint;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        setStatus(`${label} abierto en otra pestaña. Completa tu pago para continuar.`);
      } else {
        setStatus("No se recibió la liga de pago. Intenta de nuevo.");
      }
    } catch {
      setStatus("Error de conexión. Intenta de nuevo o usa WhatsApp.");
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
    `Hola, quiero pagar mi proyecto por transferencia.\n\nPlan: ${plan.name}\nMódulos: ${moduleList}\nModalidad: ${
      mode === "anticipo" ? "50% anticipo" : "Pago completo"
    }\nTotal proyecto: ${formatMXN(projectTotal)}\nPago ahora: ${formatMXN(payableNow)}`
  );

  return (
    <section
      id="precios"
      aria-label="Configura y paga tu proyecto"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Configurador"
          title="Arma tu web y paga en línea"
          subtitle="Elige tu paquete, suma los módulos que necesites y paga con tarjeta, Mercado Pago o transferencia. Sin sorpresas."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* LEFT: configuration */}
          <div className="flex flex-col gap-8">
            {/* Plans */}
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">
                1. Elige tu paquete
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
                        "flex flex-col rounded-xl border p-4 text-left transition-all",
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:border-primary/40"
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
                2. Módulos extra
              </p>
              <div className="flex flex-col gap-2">
                {MODULES.map((m) => (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
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
                <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                  <span className="text-sm text-foreground">
                    Secciones adicionales
                    <span className="ml-1 text-muted-foreground">
                      (+{formatMXN(SECTION_PRICE)} c/u)
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSections((n) => Math.max(0, n - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground hover:border-primary"
                      aria-label="Quitar sección"
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
                      aria-label="Agregar sección"
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
                  3. Modalidad de pago
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { v: "liquidacion", label: "Pago completo (100%)" },
                    { v: "anticipo", label: "Anticipo (50%)" },
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
                <p className="mb-2 text-sm font-medium text-foreground">Cupón</p>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Ej. BRYANF10"
                    className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="button" variant="outline" onClick={applyCoupon}>
                    Aplicar
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
            <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-card p-6 shadow-xl shadow-primary/5">
              <p className="text-sm font-medium text-foreground">Tu resumen</p>
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
                  <span>Total proyecto</span>
                  <span>{formatMXN(projectTotal)}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    A pagar ahora
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
                    <CreditCard className="mr-1 h-4 w-4" />
                  )}
                  Pagar con tarjeta (Stripe)
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
                    <Wallet className="mr-1 h-4 w-4" />
                  )}
                  Pagar con Mercado Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTransfer((t) => !t)}
                  className="w-full"
                >
                  <Building2 className="mr-1 h-4 w-4" />
                  Pagar por transferencia
                </Button>
              </div>

              {status && (
                <p className="text-xs text-muted-foreground" role="status">
                  {status}
                </p>
              )}

              {/* Transfer details */}
              {transfer && (
                <div className="mt-1 flex flex-col gap-2 rounded-xl border border-border bg-secondary/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    Transfiere {formatMXN(payableNow)} y envía tu comprobante.
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
                          aria-label={`Copiar ${b.label}`}
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
                        Enviar comprobante por WhatsApp
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <a href="mailto:bryanf@bryanfdesign.com.mx?subject=Comprobante%20de%20transferencia%20-%20BryanF%20Design">
                        Enviar comprobante por correo
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <p className="pt-1 text-center text-[11px] text-muted-foreground">
                Pago seguro. Al continuar aceptas nuestros{" "}
                <a href="/terminos" className="underline hover:text-primary">
                  Términos
                </a>{" "}
                y{" "}
                <a href="/privacidad" className="underline hover:text-primary">
                  Aviso de Privacidad
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

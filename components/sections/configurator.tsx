"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDown,
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
  X,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { SiStripe, SiMercadopago } from "react-icons/si";

const STRIPE_BRAND = "#635BFF";
const MERCADOPAGO_BRAND = "#00B1EA";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { trackEvent } from "@/lib/analytics";
import { LUMINA_QUOTE_EVENT, type LuminaQuote } from "@/lib/lumina-actions";
import { isReducedMotionRequested } from "@/lib/motion-preference";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
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

/**
 * Tope de secciones adicionales: el mismo que aplica el servidor al recomponer
 * el precio (lib/quote.ts → normalizeSelection), para que el total mostrado
 * nunca difiera de lo que cobran Stripe o Mercado Pago.
 */
const MAX_SECTIONS = 50;

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
    <div data-fx="up" className="relative">
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


/**
 * Logos oficiales de cada forma de pago: el logotipo de Stripe (morado sobre
 * blanco), el de Mercado Pago (versión blanca sobre su azul) y el de BBVA
 * (azul sobre blanco). Cada uno va en una ficha del MISMO tamaño para que las
 * tres opciones se lean al mismo nivel sobre el panel oscuro, sin alterar el
 * archivo de la marca.
 */
type PayProvider = "stripe" | "mercadopago" | "transfer";

const PAY_LOGOS: Record<
  PayProvider,
  { src: string; alt: string; width: number; height: number; img: string; chip: string; chipStyle?: CSSProperties }
> = {
  stripe: {
    src: "/img/pagos/stripe.svg",
    alt: "Stripe",
    width: 512,
    height: 214,
    img: "h-[22px]",
    chip: "bg-white",
  },
  mercadopago: {
    src: "/img/pagos/mercadopago-blanco.png",
    alt: "Mercado Pago",
    width: 789,
    height: 200,
    img: "h-[19px]",
    chip: "",
    chipStyle: { backgroundColor: MERCADOPAGO_BRAND },
  },
  transfer: {
    src: "/img/BBVA_logo_2025.svg.png",
    alt: "BBVA",
    width: 960,
    height: 288,
    img: "h-[13px]",
    chip: "bg-white",
  },
};

function PayLogoChip({ provider, size = "md" }: { provider: PayProvider; size?: "sm" | "md" }) {
  const logo = PAY_LOGOS[provider];
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        size === "md" ? "h-10 w-[6.5rem]" : "h-7 w-[4.75rem] [&>img]:scale-[0.72]",
        logo.chip
      )}
      style={logo.chipStyle}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        unoptimized
        className={cn("block w-auto", logo.img)}
      />
    </span>
  );
}

interface PayOptionButtonProps {
  provider: PayProvider;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Texto solo para lector de pantalla (p. ej. "transferencia" junto a BBVA). */
  srHint?: string;
  size?: "sm" | "md";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

/** Las tres formas de pago comparten este botón: mismo tamaño, mismo estilo. */
function PayOptionButton({
  provider,
  label,
  onClick,
  disabled,
  loading,
  srHint,
  size = "md",
  ...aria
}: PayOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...aria}
      // El nombre se lee en orden: "Pagar con Stripe (con tarjeta…)".
      aria-label={`${label} ${PAY_LOGOS[provider].alt}${srHint ? ` (${srHint})` : ""}`}
      data-pay-option={provider}
      className={cn(
        "group/pay flex w-full items-center justify-between gap-3 rounded-full bg-white/[0.07] text-left font-semibold text-white ring-1 ring-inset ring-white/15 transition-[background-color,box-shadow,transform] duration-200 hover:bg-white/[0.12] hover:ring-lime/70 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 aria-expanded:bg-white/[0.12] aria-expanded:ring-lime motion-reduce:transition-none motion-reduce:active:scale-100",
        size === "md" ? "min-h-14 py-2 pl-5 pr-2 text-[0.9375rem]" : "min-h-11 py-1.5 pl-4 pr-1.5 text-sm"
      )}
    >
      <span className="flex items-center gap-2">
        {loading && <Loader2 aria-hidden className="h-4 w-4 animate-spin text-lime" />}
        {label}
      </span>
      <PayLogoChip provider={provider} size={size} />
    </button>
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

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

type Provider = "stripe" | "mercadopago";
const PROVIDERS: Record<Provider, { endpoint: string; label: string }> = {
  stripe: { endpoint: "/api/stripe-checkout", label: "Stripe" },
  mercadopago: { endpoint: "/api/mercadopago", label: "Mercado Pago" },
};

/** Pago abierto en otra pestaña y lo que sabemos de él. */
interface Checkout {
  provider: Provider;
  label: string;
  url: string;
  /** Sesión de Stripe o referencia externa de Mercado Pago (para verificar). */
  ref: string;
  amount: number;
  currency: Currency;
  phase: "open" | "closed" | "blocked" | "checking" | "paid" | "pending" | "not_found" | "failed" | "error";
}

export function Configurator({
  hideHeading = false,
  chapter = 7,
}: { hideHeading?: boolean; chapter?: number } = {}) {
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
  const [loading, setLoading] = useState<string | null>(null);
  // Pago abierto en otra pestaña: su estado y la referencia para verificarlo.
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const paymentWindowRef = useRef<Window | null>(null);
  // "Enviar cotización por correo": formulario en línea.
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "invalid" | "failed">("idle");
  const [emailSentTo, setEmailSentTo] = useState("");
  const [status, setStatus] = useState("");
  const [transfer, setTransfer] = useState(false);
  const [copied, setCopied] = useState("");

  const plan = PLANS.find((p) => p.id === planId)!;

  // Teléfono: mientras se arma la cotización y el resumen aún no está a la
  // vista, una píldora flotante muestra el total en vivo y lleva al resumen.
  const summaryRef = useRef<HTMLDivElement>(null);
  const summaryTitleRef = useRef<HTMLParagraphElement>(null);
  const configuratorInView = useConfiguratorInView();
  const [summaryInView, setSummaryInView] = useState(false);
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSummaryInView(entry.isIntersecting),
      { rootMargin: "0px 0px -18% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const showTotalDock = configuratorInView && !summaryInView;

  // Avisa a los flotantes (Lumina) que la barra del total ocupa la fila de
  // abajo en teléfono: Lumina se acomoda a su lado en vez de apartarse.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("cfg-total-dock", showTotalDock);
    return () => root.classList.remove("cfg-total-dock");
  }, [showTotalDock]);

  function goToSummary() {
    summaryRef.current?.scrollIntoView({
      behavior: isReducedMotionRequested() ? "auto" : "smooth",
      block: "start",
    });
    summaryTitleRef.current?.focus({ preventScroll: true });
  }

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
        if (Number.isFinite(sec)) setSections(Math.max(0, Math.min(MAX_SECTIONS, Math.floor(sec))));
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
          if (Number.isFinite(sec)) setSections(Math.max(0, Math.min(MAX_SECTIONS, Math.floor(sec))));
          if (s.mode === "anticipo" || s.mode === "liquidacion") setMode(s.mode);
          if (s.currency === "MXN" || s.currency === "USD") setCurrency(s.currency);
        }
      }
    } catch {
      /* storage bloqueado o corrupto */
    }
    setRestored(true);
  }, []);

  // Lumina arma el cotizador en vivo: cuando recomienda un paquete desde el
  // chat, dispara `lumina:quote` y aquí se aplica (ya validado por ella).
  useEffect(() => {
    function onLuminaQuote(event: Event) {
      const quote = (event as CustomEvent<LuminaQuote>).detail;
      if (!quote || !PLAN_META.some((p) => p.id === quote.plan)) return;
      setPlanId(quote.plan);
      setMods(
        Object.fromEntries(
          MODULE_META.filter((m) => quote.modules.includes(m.id)).map((m) => [m.id, true])
        )
      );
      setSections(Math.max(0, Math.min(MAX_SECTIONS, Math.floor(quote.sections || 0))));
      trackEvent("lumina_quote", { plan: quote.plan, modules: quote.modules.join(",") });
    }
    window.addEventListener(LUMINA_QUOTE_EVENT, onLuminaQuote);
    return () => window.removeEventListener(LUMINA_QUOTE_EVENT, onLuminaQuote);
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

  async function pay(provider: Provider) {
    const { endpoint, label } = PROVIDERS[provider];
    setLoading(label);
    setCheckout(null);
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
            coupon: "none",
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
        // Se conserva la referencia a la pestaña (sin `noopener`, que la
        // devolvía nula) para saber cuándo se cierra; `opener` se corta a mano.
        const win = window.open(url, "_blank");
        if (win) {
          try {
            win.opener = null;
          } catch {
            /* ventana ya en otro origen */
          }
        }
        paymentWindowRef.current = win;
        setStatus("");
        setCheckout({
          provider,
          label,
          url,
          ref: String(data.sessionId || data.externalReference || ""),
          amount: Number(data.amount) || payableNow,
          currency: (data.currency as Currency) || currency,
          phase: win ? "open" : "blocked",
        });
      } else {
        setStatus(t.configurator.noPaymentLink);
      }
    } catch {
      setStatus(t.configurator.connectionError);
    } finally {
      setLoading(null);
    }
  }

  // Cuando la pestaña de pago se cierra, el aviso "abierto en otra pestaña"
  // cambia a "¿Ya terminaste tu pago?" con Verificar / Volver a intentarlo.
  useEffect(() => {
    if (checkout?.phase !== "open") return;
    const id = window.setInterval(() => {
      if (paymentWindowRef.current?.closed) {
        setCheckout((c) => (c && c.phase === "open" ? { ...c, phase: "closed" } : c));
      }
    }, 800);
    return () => window.clearInterval(id);
  }, [checkout?.phase]);

  async function verifyPayment() {
    if (!checkout) return;
    const current = checkout;
    if (!current.ref) {
      setCheckout({ ...current, phase: "error" });
      return;
    }
    setCheckout({ ...current, phase: "checking" });
    try {
      const res = await fetch("/api/payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: current.provider, ref: current.ref }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        state?: "paid" | "pending" | "failed" | "not_found";
        amount?: number;
        currency?: string;
        paymentId?: string;
      };
      if (!res.ok || !data.state) {
        setCheckout({ ...current, phase: "error" });
        return;
      }
      setCheckout({ ...current, phase: data.state });
      if (data.state === "paid") {
        // El mismo destino que usa la pasarela al terminar: /gracias registra
        // la compra y abre el brief.
        const params = new URLSearchParams({
          status: "success",
          provider: current.provider,
          value: String(data.amount ?? current.amount),
          currency: (data.currency || current.currency).toUpperCase(),
        });
        if (current.provider === "stripe") params.set("session_id", current.ref);
        else {
          params.set("external_reference", current.ref);
          if (data.paymentId) params.set("payment_id", data.paymentId);
        }
        window.setTimeout(() => window.location.assign(`/gracias?${params.toString()}`), 1200);
      }
    } catch {
      setCheckout({ ...current, phase: "error" });
    }
  }

  async function sendQuoteEmail() {
    const email = emailValue.trim();
    if (!EMAIL_RE.test(email)) {
      setEmailState("invalid");
      return;
    }
    setEmailState("sending");
    try {
      const res = await fetch("/api/quote-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currency,
          modalidad: mode,
          selection: {
            planId,
            moduleIds: MODULES.filter((m) => mods[m.id]).map((m) => m.id),
            sections,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setEmailSentTo(email);
        setEmailState("sent");
        trackEvent("generate_lead", { method: "quote_email", location: "precios" });
      } else {
        setEmailState(data.error === "invalid_email" ? "invalid" : "failed");
      }
    } catch {
      setEmailState("failed");
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

  // Respaldo si el correo no sale: la misma cotización por WhatsApp.
  const quoteWhatsapp = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
    [
      t.configurator.whatsappQuoteIntro,
      "",
      ...items.map((it) => `• ${it.source}: ${display(it.price)}`),
      "",
      `${t.configurator.totalProject}: ${formatMoney(projectTotal, currency)}`,
      `${t.configurator.payNow}: ${formatMoney(payableNow, currency)}`,
    ].join("\n")
  )}`;
  const remaining = Math.max(0, projectTotal - payableNow);

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
      // En /crear-web el titular de la portada ya se llama igual: sin
      // encabezado propio, la sección toma el nombre corto ("Configurador").
      aria-label={hideHeading ? t.configurator.eyebrow : t.configurator.title}
      className="relative grid gap-gutter xl:grid-cols-12"
    >
      {/* IZQUIERDA: la configuración, como una pantalla de cobro. Hasta xl
          ocupa todo el ancho y el resumen baja debajo como tarjeta ancha. */}
      <div data-fx="up" className="min-w-0 xl:col-span-8">
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
                chapter={{ index: chapter }}
                className="relative px-1 sm:px-0 [&_p]:text-[0.975rem] md:[&_p]:text-base"
              />
            </>
          )}

          {/* Paso 1: paquetes. */}
          <Step>
            <p className="px-1 sm:px-0">
              <StepHeader n={1} id="configurator-plan-label" label={t.configurator.step1} />
            </p>
            {/* Elección única: radios nativos (flechas del teclado incluidas).
                Filas horizontales hasta lg; desde lg, tres fichas. */}
            <div
              role="radiogroup"
              aria-labelledby="configurator-plan-label"
              className="mt-4 grid gap-2.5 sm:mt-5 sm:pl-14 lg:grid-cols-3 lg:gap-3"
            >
              {PLANS.map((p) => {
                const active = p.id === planId;
                const Icon = PLAN_ICONS[p.id] ?? Rocket;
                return (
                  <label
                    key={p.id}
                    className={cn(
                      "group relative grid min-h-11 cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 rounded-card p-3.5 text-left text-ink transition-[background-color,box-shadow,transform] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-0.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 sm:gap-x-4 sm:p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:content-start lg:items-start lg:gap-x-3 lg:gap-y-0 lg:p-5",
                      active
                        ? "bg-lime shadow-[0_18px_36px_-20px_hsl(var(--lime-deep)/0.95)]"
                        : "bg-mint ring-1 ring-inset ring-ink/10 hover:ring-ink/30"
                    )}
                  >
                    <input
                      type="radio"
                      name="configurator-plan"
                      value={p.id}
                      checked={active}
                      onChange={() => setPlanId(p.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-11 place-items-center rounded-full transition-colors duration-300 lg:col-start-1 lg:row-start-1",
                        active ? "bg-ink text-lime" : "bg-white text-ink ring-1 ring-ink/10"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 sm:flex sm:items-baseline sm:justify-between sm:gap-4 lg:col-span-2 lg:row-start-2 lg:mt-5 lg:block">
                      <span className="flex items-center gap-1.5 text-[0.9375rem] font-semibold leading-tight">
                        {p.name}
                        {p.featured && (
                          <Sparkle aria-hidden className="h-3.5 w-3.5 shrink-0 fill-ink text-ink" />
                        )}
                      </span>
                      <span className="display-title mt-1 block text-[1.6rem] tabular-nums sm:mt-0 sm:text-[1.75rem] lg:mt-1.5 lg:text-[2rem]">
                        {display(p.price)}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-7 place-items-center rounded-full transition-all duration-300 [transition-timing-function:var(--ease-pop)] lg:col-start-2 lg:row-start-1 lg:justify-self-end",
                        active
                          ? "scale-100 bg-ink text-lime"
                          : "scale-90 text-transparent ring-[1.5px] ring-inset ring-ink/25"
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span
                      className={cn(
                        "col-span-3 text-pretty text-[0.9375rem] leading-snug sm:col-span-1 sm:col-start-2 lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:mt-2 lg:text-sm",
                        active ? "text-ink/75" : "text-muted-foreground"
                      )}
                    >
                      {p.desc}
                    </span>
                  </label>
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
                {/* Con base de 9rem: si no cabe junto al contador, el contador
                    baja a su propia fila (flex-wrap) en vez de pisar el texto. */}
                <span className="min-w-0 grow basis-[9rem]">
                  <span className="block text-[0.9375rem] font-semibold leading-snug text-ink">
                    {t.configurator.extraSections}
                  </span>
                  <span className="block text-sm tabular-nums text-muted-foreground">
                    +{display(SECTION_PRICE)} · {t.configurator.perUnit}
                  </span>
                </span>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-mint p-1 ring-1 ring-inset ring-ink/[0.06]">
                  <button
                    type="button"
                    onClick={() => setSections((n) => Math.max(0, n - 1))}
                    disabled={sections <= 0}
                    className="grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_1px_2px_hsl(var(--ink)/0.12)] transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
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
                    onClick={() => setSections((n) => Math.min(MAX_SECTIONS, n + 1))}
                    disabled={sections >= MAX_SECTIONS}
                    className="grid size-11 place-items-center rounded-full bg-ink text-lime transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
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

            <div className="mt-5 grid gap-5 sm:ml-14 sm:gap-4">
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
              {currency === "USD" && (
                <p className="flex items-start gap-2 px-1 text-[0.9375rem] leading-snug text-muted-foreground sm:text-sm">
                  <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-lime-deep" />
                  {t.configurator.currencyNote(String(USD_MXN_RATE))}
                </p>
              )}
            </div>
          </Step>
        </div>
      </div>

      {/* DERECHA: el resumen como tarjeta negra, con el total en lima. Desde
          xl es la columna fija; antes, una tarjeta ancha en dos columnas
          (partidas y total | botones de pago). */}
      <div
        data-fx="up"
        className="min-w-0 xl:col-span-4"
        style={{ "--fx-delay": "120ms" } as CSSProperties}
      >
        <div
          ref={summaryRef}
          id="cotizador-resumen"
          className="scroll-mt-[calc(var(--header-h)+var(--gutter))] xl:sticky xl:top-[calc(var(--header-h)+var(--gutter))]"
        >
          <div className="panel panel-ink relative grid gap-5 overflow-hidden p-4 pt-5 sm:p-7 md:grid-cols-2 md:gap-x-7 lg:gap-x-10 lg:p-9 xl:grid-cols-1 xl:p-7">
            <div aria-hidden className="mesh-glow-a opacity-60" />

            <div className="relative flex min-w-0 flex-col gap-5">
              <div className="relative flex items-center justify-between gap-3 px-1 sm:px-0">
                <p
                  ref={summaryTitleRef}
                  tabIndex={-1}
                  className="display-title text-[1.75rem] leading-none text-white outline-none"
                >
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
                {/* Qué pasa con el resto: cuándo se paga y qué lo dispara. */}
                <p className="relative mt-3 text-pretty text-sm leading-snug text-white/80">
                  {mode === "anticipo"
                    ? t.configurator.todayAdvance(formatMoney(payableNow, currency), formatMoney(remaining, currency))
                    : t.configurator.todayFull(formatMoney(payableNow, currency))}
                </p>
              </div>
            </div>

            <div className="relative flex min-w-0 flex-col gap-5">
              {/* Las tres formas de pago, al mismo nivel: tres botones iguales
                  ("Pagar con" + logo oficial), sin jerarquía entre ellas. El monto
                  de hoy ya se lee arriba, en la tarjeta del total. */}
              <div className="relative flex flex-col gap-2.5" role="group" aria-label={t.configurator.payNow}>
                <PayOptionButton
                  provider="stripe"
                  label={t.configurator.payWith}
                  onClick={() => pay("stripe")}
                  disabled={!!loading || projectTotal <= 0}
                  loading={loading === "Stripe"}
                  srHint={t.configurator.payPrimaryNote}
                />
                <PayOptionButton
                  provider="mercadopago"
                  label={t.configurator.payWith}
                  onClick={() => pay("mercadopago")}
                  disabled={!!loading || projectTotal <= 0}
                  loading={loading === "Mercado Pago"}
                />
                <PayOptionButton
                  provider="transfer"
                  label={t.configurator.payWith}
                  onClick={() => setTransfer((prev) => !prev)}
                  srHint={t.configurator.payAltTransfer}
                  aria-expanded={transfer}
                  aria-controls="bank-transfer-details"
                />
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

              {/* El pago abierto en otra pestaña: se puede verificar, reintentar
                  o descartar, y cambia solo cuando esa pestaña se cierra. */}
              {checkout && (
                <div
                  role="status"
                  aria-live="polite"
                  className="relative flex flex-col gap-3 rounded-inner bg-white/[0.07] p-4 pr-12 text-sm leading-snug text-white/85 ring-1 ring-inset ring-white/10"
                >
                  <button
                    type="button"
                    onClick={() => setCheckout(null)}
                    aria-label={t.configurator.dismissNotice}
                    className="absolute right-1 top-1 grid size-11 place-items-center rounded-full text-white/60 transition-colors hover:text-white"
                  >
                    <X aria-hidden className="h-4 w-4" />
                  </button>
                  <p className="flex items-start gap-2.5">
                    {checkout.phase === "checking" ? (
                      <Loader2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-lime" />
                    ) : (
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-lime" />
                    )}
                    <span>
                      {checkout.phase === "open" && (
                        <>
                          {t.configurator.checkoutOpen(checkout.label)} {t.configurator.checkoutDone}
                        </>
                      )}
                      {checkout.phase === "closed" && t.configurator.checkoutDone}
                      {checkout.phase === "blocked" && t.configurator.popupBlocked}
                      {checkout.phase === "checking" && t.configurator.checkingPayment}
                      {checkout.phase === "paid" && t.configurator.paymentConfirmed}
                      {checkout.phase === "pending" && t.configurator.paymentPending}
                      {checkout.phase === "not_found" && t.configurator.paymentNotFound}
                      {checkout.phase === "failed" && t.configurator.paymentFailed}
                      {checkout.phase === "error" && t.configurator.verifyError}
                    </span>
                  </p>
                  {checkout.phase === "blocked" ? (
                    <Button asChild size="sm" className="self-start">
                      <a href={checkout.url} target="_blank" rel="noopener noreferrer">
                        {t.configurator.openPayment}
                      </a>
                    </Button>
                  ) : checkout.phase !== "paid" && checkout.phase !== "checking" ? (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={verifyPayment} className="bg-lime text-ink">
                        {t.configurator.verifyPayment}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pay(checkout.provider)}
                        disabled={!!loading}
                        className="border-white/25 text-white hover:border-white/60"
                      >
                        {t.configurator.retryPayment}
                      </Button>
                      {checkout.phase === "error" && (
                        <Button asChild size="sm" variant="ghost" className="text-white/85 hover:text-white">
                          <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp aria-hidden className="h-4 w-4" />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Datos para transferencia. */}
              {transfer && (
                <div
                  id="bank-transfer-details"
                  className="relative flex flex-col rounded-card bg-white/[0.05] p-4 ring-1 ring-inset ring-white/10 sm:p-5"
                >
                  <p className="mb-2 text-[0.9375rem] leading-snug text-white/75 sm:text-sm">
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
                      <a href="mailto:bryanf@bryanfdesign.com?subject=Comprobante%20de%20transferencia%20-%20BryanF%20Design">
                        {t.configurator.sendEmail}
                      </a>
                    </Button>
                  </div>
                  {/* Quien ve una CLABE puede preferir arrancar hoy con tarjeta. */}
                  <div className="mt-4 flex flex-col gap-2.5 border-t border-dashed border-white/15 pt-4">
                    <p className="text-pretty text-sm leading-snug text-white/80">{t.configurator.transferAlt}</p>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      <PayOptionButton
                        provider="stripe"
                        size="sm"
                        label={t.configurator.payWith}
                        onClick={() => pay("stripe")}
                        disabled={!!loading}
                        loading={loading === "Stripe"}
                        srHint={t.configurator.payPrimaryNote}
                      />
                      <PayOptionButton
                        provider="mercadopago"
                        size="sm"
                        label={t.configurator.payWith}
                        onClick={() => pay("mercadopago")}
                        disabled={!!loading}
                        loading={loading === "Mercado Pago"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Enviar la cotización por correo: pide el correo y confirma. */}
              <div className="relative flex flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEmailOpen((v) => !v);
                    if (emailState !== "sent") setEmailState("idle");
                  }}
                  aria-expanded={emailOpen}
                  aria-controls="quote-email-form"
                  disabled={projectTotal <= 0}
                  className="w-full text-white/80 hover:bg-white/[0.06] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  {t.configurator.emailQuote}
                </Button>
                {emailOpen && (
                  <form
                    id="quote-email-form"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendQuoteEmail();
                    }}
                    className="flex flex-col gap-2 rounded-inner bg-white/[0.06] p-3 ring-1 ring-inset ring-white/10"
                  >
                    {emailState === "sent" ? (
                      <p role="status" className="flex items-start gap-2.5 px-1 py-1 text-sm leading-snug text-white">
                        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                        {t.configurator.emailSent(emailSentTo)}
                      </p>
                    ) : (
                      <>
                        <label htmlFor="quote-email" className="px-1 text-xs font-semibold text-white/65">
                          {t.configurator.emailLabel}
                        </label>
                        <div className="flex items-center gap-1 rounded-full bg-white p-1 pl-4">
                          <input
                            id="quote-email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={emailValue}
                            onChange={(e) => {
                              setEmailValue(e.target.value);
                              if (emailState === "invalid") setEmailState("idle");
                            }}
                            placeholder={t.configurator.emailPlaceholder}
                            aria-invalid={emailState === "invalid"}
                            aria-describedby={emailState === "invalid" || emailState === "failed" ? "quote-email-status" : undefined}
                            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/50 sm:text-[0.9375rem]"
                          />
                          <Button type="submit" size="sm" variant="ink" disabled={emailState === "sending"} className="h-11 shrink-0 px-4">
                            {emailState === "sending" ? (
                              <>
                                <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                                {t.configurator.emailSending}
                              </>
                            ) : (
                              t.configurator.emailSend
                            )}
                          </Button>
                        </div>
                        {emailState === "invalid" && (
                          <p id="quote-email-status" role="alert" className="px-1 text-sm text-white/85">
                            {t.configurator.emailInvalid}
                          </p>
                        )}
                        {emailState === "failed" && (
                          <div id="quote-email-status" role="alert" className="flex flex-col gap-2 px-1 text-sm text-white/85">
                            <p>{t.configurator.emailFailed}</p>
                            <Button asChild size="sm" className="self-start bg-lime text-ink">
                              <a href={quoteWhatsapp} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp aria-hidden className="h-4 w-4" />
                                {t.configurator.emailWhatsapp}
                              </a>
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </form>
                )}
              </div>

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
      </div>

      {/* Teléfono: el total en vivo, flotando en la fila de los botones
          flotantes: entre la pestaña de accesibilidad (izquierda) y el botón
          de Lumina (derecha), que se queda para resolver dudas de compra.
          WhatsApp se aparta dentro del cotizador. Se va cuando el resumen
          ya se ve. */}
      <div
        className={cn(
          "fixed bottom-[var(--fab-edge)] left-[calc(1.75rem+var(--fab-gap))] right-[calc(0.75rem+var(--fab-size)+var(--fab-gap))] z-[118] transition-[transform,opacity,visibility] duration-300 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none sm:hidden [html.menu-open_&]:invisible [html.menu-open_&]:opacity-0",
          showTotalDock
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-4 opacity-0"
        )}
      >
        <button
          type="button"
          onClick={goToSummary}
          className="flex h-[var(--fab-size)] w-full items-center gap-3 rounded-full bg-ink pl-5 pr-1.5 text-left text-white shadow-float ring-1 ring-white/10 transition-transform active:scale-[0.98]"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold leading-tight text-white/65">
              {mode === "anticipo" ? t.configurator.modeAdvanceLabel : t.configurator.modeFullLabel}
            </span>
            <span
              key={`${payableNow}-${currency}`}
              className="block text-lg font-bold leading-tight tabular-nums text-lime duration-300 animate-in fade-in-0 zoom-in-90 motion-reduce:animate-none"
            >
              {formatMoney(payableNow, currency)}
              <span className="text-xs font-semibold text-white/55"> {currency}</span>
            </span>
          </span>
          <span className="sr-only">{t.configurator.viewSummary}</span>
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink"
          >
            <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </section>
  );
}

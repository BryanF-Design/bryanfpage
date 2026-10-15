"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Clock,
  Loader2,
  MessageCircle,
  RefreshCw,
  Rocket,
  Video,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { trackAdsConversion, trackEvent } from "@/lib/analytics";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

const WA_PHONE = "525663012505";
/** Transacciones ya contadas en este dispositivo: recargar /gracias no duplica la venta. */
const COUNTED_KEY = "bryanf_purchases_counted_v1";

type Provider = "stripe" | "mercadopago";
type View = "checking" | "paid" | "pending" | "failed" | "cancelled" | "unverified" | "brief";

interface Order {
  state: "paid" | "pending" | "failed" | "unknown";
  provider: Provider;
  transactionId?: string;
  value?: number;
  currency?: string;
  email?: string;
  name?: string;
  phone?: string;
}

/** Cuenta la compra una sola vez por transacción (GA4 + Google Ads). */
function countPurchase(order: Order) {
  if (!order.transactionId) return;
  try {
    const counted = JSON.parse(window.localStorage.getItem(COUNTED_KEY) || "[]") as string[];
    if (counted.includes(order.transactionId)) return;
    window.localStorage.setItem(
      COUNTED_KEY,
      JSON.stringify([...counted, order.transactionId].slice(-20))
    );
  } catch {
    /* sin storage: se cuenta igual (transaction_id deduplica en Ads y GA4) */
  }
  trackEvent("purchase", {
    transaction_id: order.transactionId,
    value: order.value,
    currency: order.currency,
    payment_type: order.provider,
    items: [{ item_id: "proyecto-web", item_name: "Proyecto web", price: order.value, quantity: 1 }],
  });
  trackAdsConversion("purchase", {
    value: order.value,
    currency: order.currency,
    transactionId: order.transactionId,
    userData: { email: order.email, phone: order.phone },
  });
}

const STEPS = ["Pago", "Briefing", "Revisión", "Entrega"];

function Steps({ current }: { current: number }) {
  return (
    <ol aria-label="Progreso del proyecto" className="grid grid-cols-4 gap-1.5">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-col gap-2">
            <span
              aria-hidden
              className={cn(
                "h-1.5 rounded-full",
                done ? "bg-ink" : active ? "bg-lime-deep" : "bg-ink/10"
              )}
            />
            <span
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold",
                done || active ? "text-ink" : "text-ink/45"
              )}
            >
              {done && <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />}
              {label}
              {active && <span className="sr-only">(paso actual)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const HEROES: Record<View, { badge: ReactNode; tone: string; title: string; body: string }> = {
  checking: {
    badge: <Loader2 className="h-7 w-7 animate-spin" />,
    tone: "bg-white text-ink",
    title: "Confirmando tu pago…",
    body: "Estamos verificando el pago con la plataforma. Tarda un par de segundos.",
  },
  paid: {
    badge: <Check className="h-7 w-7" strokeWidth={3} />,
    tone: "bg-ink text-lime",
    title: "¡Pago recibido! Gracias por tu confianza.",
    body: "Te llegará el comprobante por correo. Ahora cuéntanos de tu proyecto para arrancar de inmediato: toma menos de 3 minutos.",
  },
  pending: {
    badge: <Clock className="h-7 w-7" />,
    tone: "bg-white text-ink",
    title: "Tu pago está en proceso",
    body: "La plataforma aún no lo acredita (pasa con OXXO, SPEI o revisiones del banco). Te avisamos por correo en cuanto se confirme; mientras, puedes adelantar tu briefing.",
  },
  failed: {
    badge: <AlertTriangle className="h-7 w-7" />,
    tone: "bg-signal/15 text-ink",
    title: "El pago no se completó",
    body: "No se hizo ningún cargo. Puedes intentarlo de nuevo con otro método o escribirnos y lo resolvemos contigo.",
  },
  cancelled: {
    badge: <RefreshCw className="h-7 w-7" />,
    tone: "bg-white text-ink",
    title: "Tu cotización sigue guardada",
    body: "Saliste del pago antes de terminar, así que no se hizo ningún cargo. Retómala cuando quieras o dinos qué duda tienes.",
  },
  unverified: {
    badge: <Clock className="h-7 w-7" />,
    tone: "bg-white text-ink",
    title: "Recibimos tu regreso del pago",
    body: "No pudimos confirmarlo automáticamente; lo revisamos y te escribimos. Si ya pagaste, adelanta tu briefing aquí abajo.",
  },
  brief: {
    badge: <Rocket className="h-7 w-7" />,
    tone: "bg-ink text-lime",
    title: "Cuéntanos de tu proyecto",
    body: "Con esta información personalizamos tu sitio y te mandamos la ruta de trabajo. Toma menos de 3 minutos.",
  },
};

const fieldClass =
  "h-12 w-full rounded-inner bg-white px-4 text-[0.9375rem] font-medium text-ink outline-none ring-1 ring-inset ring-ink/10 transition-shadow placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink";
const labelClass = "mb-1.5 block px-1 text-xs font-semibold text-ink/70";

function Field({
  id,
  label,
  full,
  children,
}: {
  id: string;
  label: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({ id, name, options }: { id: string; name: string; options: string[] }) {
  return (
    <select id={id} name={name} defaultValue="" className={cn(fieldClass, "cursor-pointer")}>
      <option value="">Selecciona…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/**
 * /gracias — a donde regresan Stripe y Mercado Pago.
 *
 * No se cree el `status=success` de la URL: verifica el pago con
 * /api/order-status y sólo entonces dice "pago recibido" y cuenta la venta
 * (purchase) en GA4 y Google Ads, con el monto real. Si se canceló o falló, lo
 * dice y ofrece reintentar. El briefing se envía de verdad a /api/onboarding-submit
 * y, si falla, queda escrito en un WhatsApp.
 */
export function GraciasExperience() {
  const [view, setView] = useState<View>("checking");
  const [order, setOrder] = useState<Order | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [briefText, setBriefText] = useState("");
  const paymentRef = useRef("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const status = params.get("status");
    const sessionId = params.get("session_id");
    const paymentId = params.get("payment_id") || params.get("collection_id");
    paymentRef.current = sessionId || paymentId || "";

    if (status === "cancel") {
      trackEvent("checkout_cancelled", { payment_provider: provider || "unknown" });
      setView("cancelled");
      return;
    }

    let query = "";
    if (provider === "stripe" && sessionId) {
      query = `provider=stripe&session_id=${encodeURIComponent(sessionId)}`;
    } else if (provider === "mercadopago" && paymentId && paymentId !== "null") {
      query = `provider=mercadopago&payment_id=${encodeURIComponent(paymentId)}`;
    } else if (status === "failure") {
      setView("failed");
      return;
    } else {
      // Sin datos de pago (enlace del correo, transferencia): sólo el briefing.
      setView(status === "success" || status === "pending" ? "unverified" : "brief");
      return;
    }

    let alive = true;
    fetch(`/api/order-status?${query}`)
      .then((res) => res.json() as Promise<Order>)
      .then((data) => {
        if (!alive) return;
        setOrder(data);
        if (data.state === "paid") {
          countPurchase(data);
          setView("paid");
        } else if (data.state === "pending") {
          setView("pending");
        } else if (data.state === "failed") {
          setView("failed");
        } else {
          setView("unverified");
        }
      })
      .catch(() => alive && setView("unverified"));
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const text = [
      "*Nuevo briefing — BryanF Design*",
      `*Nombre:* ${data.fullName || "—"}`,
      `*Negocio:* ${data.businessName || "—"}`,
      `*WhatsApp:* ${data.contactPhone || "—"}`,
      data.contactEmail && `*Correo:* ${data.contactEmail}`,
      data.projectType && `*Tipo de proyecto:* ${data.projectType}`,
      data.deadline && `*Plazo:* ${data.deadline}`,
      data.materials && `*Materiales:* ${data.materials}`,
      data.style && `*Estilo:* ${data.style}`,
      data.projectBrief && `\n${data.projectBrief}`,
      data.sections && `*Secciones:* ${data.sections}`,
      data.references && `*Referencias:* ${data.references}`,
      data.notes && `*Notas:* ${data.notes}`,
      paymentRef.current && `*Ref. pago:* ${paymentRef.current}`,
    ]
      .filter(Boolean)
      .join("\n");
    setBriefText(text);

    if (!data.fullName?.trim() || !data.businessName?.trim() || !data.contactPhone?.trim()) {
      setError("Completa nombre, negocio y WhatsApp para continuar.");
      setSendState("error");
      return;
    }

    setSendState("sending");
    setError("");
    try {
      const res = await fetch("/api/onboarding-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `gracias-briefing (${view})`,
          form: data,
          payment: {
            method: order?.provider || "pendiente",
            reference: paymentRef.current,
          },
          totals: order?.value
            ? { payableNow: order.value, currency: order.currency }
            : undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || String(res.status));
      trackEvent("briefing_submit", { state: view });
      setSendState("sent");
    } catch {
      setError("No se pudo enviar el briefing. Mándalo por WhatsApp: ya va escrito.");
      setSendState("error");
    }
  }

  const hero = HEROES[view];
  const showBrief = view === "paid" || view === "pending" || view === "unverified" || view === "brief";
  const waHref = (text: string) => `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
  const helpText =
    view === "failed" || view === "cancelled"
      ? "Hola, intenté pagar mi proyecto web en el sitio y no se completó. ¿Me ayudas?"
      : "Hola, acabo de pagar mi proyecto web. ¿Podemos hablar?";
  const stepIndex = view === "paid" || view === "pending" ? 1 : 0;

  return (
    <>
      <SpanishPageLanguage />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* Alto mínimo: con el pie a la vista el encabezado se retira, y en
            los estados cortos (cancelado, fallido) se quedaba sin él. */}
        <section aria-labelledby="gracias-title" className="panel flex min-h-[72vh] flex-col justify-center p-4 pt-5 shadow-soft sm:p-8 lg:p-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <span className={cn("grid size-16 place-items-center rounded-full ring-1 ring-ink/10", hero.tone)}>
              {hero.badge}
            </span>
            <div className="flex flex-col gap-4" aria-live="polite">
              <h1
                id="gracias-title"
                className="display-title text-balance text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] text-ink"
              >
                {hero.title}
              </h1>
              <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">
                {hero.body}
              </p>
              {view === "paid" && order?.value ? (
                <p className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-bold tabular-nums text-ink">
                  <Check aria-hidden className="h-4 w-4" strokeWidth={3} />
                  {formatMoney(order.value, order.currency === "USD" ? "USD" : "MXN")}{" "}
                  {order.currency}
                </p>
              ) : null}
            </div>

            {(view === "paid" || view === "pending" || view === "brief" || view === "unverified") && (
              <Steps current={stepIndex} />
            )}

            {(view === "failed" || view === "cancelled") && (
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
                  <Link href="/crear-web#precios">
                    Retomar mi cotización
                    <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={waHref(helpText)} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                    Resolverlo por WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>

        {showBrief && (
          <section aria-labelledby="brief-title" className="grid gap-gutter lg:grid-cols-12">
            <div className="panel p-4 pt-5 shadow-soft sm:p-7 lg:col-span-8 lg:p-9">
              <h2 id="brief-title" className="display-title px-1 text-[1.75rem] leading-tight text-ink sm:px-0">
                Tu briefing
              </h2>
              {sendState === "sent" ? (
                <div role="status" className="mt-5 flex flex-col gap-4 rounded-card bg-lime p-6">
                  <p className="display-title text-[1.6rem] leading-tight text-ink">
                    ¡Briefing recibido!
                  </p>
                  <p className="text-[0.975rem] leading-relaxed text-ink/80">
                    Lo revisamos en menos de 24 horas hábiles y te escribimos para agendar el arranque.
                  </p>
                  <Button asChild size="lg" variant="ink" className="w-full sm:w-fit">
                    <a href={waHref(briefText)} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                      Avisar por WhatsApp
                    </a>
                  </Button>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={onSubmit}
                  className="mt-5 grid gap-4 rounded-card bg-mint p-3.5 ring-1 ring-inset ring-ink/[0.06] sm:grid-cols-2 sm:p-5"
                >
                  <Field id="gb-name" label="Nombre completo *">
                    <input id="gb-name" name="fullName" required autoComplete="name" defaultValue={order?.name} className={fieldClass} />
                  </Field>
                  <Field id="gb-business" label="Nombre del negocio *">
                    <input id="gb-business" name="businessName" required autoComplete="organization" className={fieldClass} />
                  </Field>
                  <Field id="gb-phone" label="WhatsApp *">
                    <input id="gb-phone" name="contactPhone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="55 1234 5678" defaultValue={order?.phone} className={fieldClass} />
                  </Field>
                  <Field id="gb-email" label="Correo">
                    <input id="gb-email" name="contactEmail" type="email" inputMode="email" autoComplete="email" placeholder="tu@correo.com" defaultValue={order?.email} className={fieldClass} />
                  </Field>
                  <Field id="gb-type" label="Tipo de proyecto">
                    <Select id="gb-type" name="projectType" options={["Landing page", "Sitio web corporativo", "Tienda en línea", "Portafolio / marca personal", "Blog o CMS", "Plataforma a medida"]} />
                  </Field>
                  <Field id="gb-deadline" label="¿Para cuándo lo necesitas?">
                    <Select id="gb-deadline" name="deadline" options={["Lo antes posible", "En 2 semanas", "En 1 mes", "Soy flexible"]} />
                  </Field>
                  <Field id="gb-brief" label="¿Qué hace tu negocio y qué quieres lograr con el sitio?" full>
                    <textarea id="gb-brief" name="projectBrief" rows={4} maxLength={4000} placeholder="A quién le vendes, qué quieres que haga la gente al entrar (comprar, escribirte, agendar)…" className={cn(fieldClass, "h-auto min-h-[7rem] resize-y py-3")} />
                  </Field>
                  <Field id="gb-sections" label="Secciones que quieres" full>
                    <input id="gb-sections" name="sections" placeholder="Inicio, Servicios, Portafolio, Contacto…" className={fieldClass} />
                  </Field>
                  <Field id="gb-style" label="Estilo visual">
                    <Select id="gb-style" name="style" options={["Oscuro / premium", "Limpio y minimalista", "Atrevido y colorido", "Corporativo / formal", "Moderno y divertido"]} />
                  </Field>
                  <Field id="gb-materials" label="¿Tienes materiales listos?">
                    <Select id="gb-materials" name="materials" options={["Sí: logo, textos e imágenes", "Algunos, necesito ayuda", "Aún no, necesito orientación"]} />
                  </Field>
                  <Field id="gb-refs" label="Sitios de referencia (opcional)" full>
                    <input id="gb-refs" name="references" placeholder="Pega links de sitios que te gusten" className={fieldClass} />
                  </Field>
                  <Field id="gb-notes" label="Notas adicionales (opcional)" full>
                    <textarea id="gb-notes" name="notes" rows={2} maxLength={4000} className={cn(fieldClass, "h-auto min-h-[4.5rem] resize-y py-3")} />
                  </Field>

                  {sendState === "error" && error && (
                    <div role="alert" className="flex flex-col gap-2 rounded-inner bg-white px-4 py-3 text-sm text-ink ring-1 ring-inset ring-signal/40 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <span>{error}</span>
                      {briefText && (
                        <a href={waHref(briefText)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-forest underline-offset-4 hover:underline">
                          <FaWhatsapp aria-hidden className="h-4 w-4" />
                          Enviar por WhatsApp
                        </a>
                      )}
                    </div>
                  )}

                  <Button type="submit" size="lg" variant="ink" disabled={sendState === "sending"} className="w-full justify-between pl-6 pr-2.5 sm:col-span-2">
                    {sendState === "sending" ? "Enviando…" : "Enviar briefing y arrancar"}
                    {sendState === "sending" ? (
                      <Loader2 aria-hidden className="mr-2.5 h-5 w-5 animate-spin" />
                    ) : (
                      <ButtonArrow tone="lime" className="-mr-0.5" />
                    )}
                  </Button>
                </form>
              )}
            </div>

            <aside className="panel panel-ink flex flex-col gap-5 p-5 sm:p-7 lg:col-span-4">
              <p className="display-title text-[1.5rem] leading-tight text-white">¿Qué sigue?</p>
              <ul className="flex flex-col gap-4">
                {[
                  { Icon: MessageCircle, title: "Revisamos tu briefing", body: "En menos de 24 horas hábiles te mandamos la ruta del proyecto." },
                  { Icon: Video, title: "Arranque por videollamada", body: "Alineamos objetivos, tiempos y materiales en 20 minutos." },
                  { Icon: Rocket, title: "Construimos", body: "Te enseñamos avances y ajustamos contigo hasta publicar." },
                ].map(({ Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold text-white">{title}</span>
                      <span className="block text-sm leading-snug text-white/65">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-auto w-full border-white/25 text-white">
                <a href={waHref(helpText)} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden className="h-4 w-4 text-lime" />
                  Hablar con Bryan
                </a>
              </Button>
            </aside>
          </section>
        )}
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}

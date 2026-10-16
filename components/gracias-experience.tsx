"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Clock,
  Landmark,
  Loader2,
  Mail,
  RefreshCw,
  Rocket,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { BriefForm } from "@/components/brief/brief-form";
import { BriefLumina } from "@/components/brief/brief-lumina";
import { StudioInfo } from "@/components/brief/studio-info";
import {
  EMPTY_BRIEF,
  briefToText,
  makeBriefLink,
  sanitizeBriefState,
  type BriefLuminaReply,
  type BriefState,
} from "@/lib/brief";
import { trackAdsConversion, trackEvent } from "@/lib/analytics";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

const WA_PHONE = "525663012505";
/** Transacciones ya contadas en este dispositivo: recargar /gracias no duplica la venta. */
const COUNTED_KEY = "bryanf_purchases_counted_v1";

type Provider = "stripe" | "mercadopago";
type View = "checking" | "paid" | "pending" | "failed" | "cancelled" | "unverified" | "brief" | "transfer";

interface Order {
  state: "paid" | "pending" | "failed" | "unknown";
  provider: Provider;
  transactionId?: string;
  value?: number;
  currency?: string;
  email?: string;
  name?: string;
  phone?: string;
  subscription?: boolean;
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
    items: [
      order.subscription
        ? { item_id: "suscripcion", item_name: "Suscripción Todo Digital", price: order.value, quantity: 1 }
        : { item_id: "proyecto-web", item_name: "Proyecto web", price: order.value, quantity: 1 },
    ],
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
    body: "Te llegará el comprobante por correo. Ahora cuéntanos de tu proyecto para arrancar de inmediato. Si quieres, Lumina lo llena contigo.",
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
  transfer: {
    badge: <Landmark className="h-7 w-7" />,
    tone: "bg-lime text-ink",
    title: "Gracias por elegir transferencia",
    body: "Cuando la hagas, mándanos el comprobante por WhatsApp o correo y te confirmamos el pago. Mientras, llena tu briefing aquí abajo para arrancar en cuanto se acredite.",
  },
  brief: {
    badge: <Rocket className="h-7 w-7" />,
    tone: "bg-ink text-lime",
    title: "Cuéntanos de tu proyecto",
    body: "Con esta información personalizamos tu sitio y te mandamos la ruta de trabajo. Si quieres, Lumina lo llena contigo.",
  },
};

/** Borrador del briefing en este dispositivo (sin archivos). */
const DRAFT_KEY = "bryanf_brief_draft_v1";

function readDraft(): BriefState | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? sanitizeBriefState(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * /gracias — a donde regresan Stripe y Mercado Pago (y a donde llega quien
 * eligió transferencia, con `?via=transferencia`).
 *
 * No se cree el `status=success` de la URL: verifica el pago con
 * /api/order-status y sólo entonces dice "pago recibido" y cuenta la venta
 * (purchase) en GA4 y Google Ads, con el monto real. Si se canceló o falló, lo
 * dice y ofrece reintentar.
 *
 * El briefing (lib/brief.ts) se guarda solo mientras se llena, reconoce los
 * enlaces que pega el cliente y Lumina puede llenarlo platicando. Se envía a
 * /api/onboarding-submit y, si falla, queda escrito en un WhatsApp.
 */
export function GraciasExperience() {
  const [view, setView] = useState<View>("checking");
  const [isSubscription, setIsSubscription] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<BriefState>(EMPTY_BRIEF);
  const [files, setFiles] = useState<File[]>([]);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const paymentRef = useRef("");
  const draftLoaded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const status = params.get("status");
    const sessionId = params.get("session_id");
    const paymentId = params.get("payment_id") || params.get("collection_id");
    const preapprovalId = params.get("preapproval_id");
    paymentRef.current = sessionId || paymentId || preapprovalId || "";
    if (params.get("plan") === "suscripcion") setIsSubscription(true);

    if (status === "cancel") {
      trackEvent("checkout_cancelled", { payment_provider: provider || "unknown" });
      setView("cancelled");
      return;
    }
    if (params.get("via") === "transferencia") {
      setView("transfer");
      return;
    }

    let query = "";
    if (provider === "stripe" && sessionId) {
      query = `provider=stripe&session_id=${encodeURIComponent(sessionId)}`;
    } else if (provider === "mercadopago" && preapprovalId) {
      query = `provider=mercadopago&preapproval_id=${encodeURIComponent(preapprovalId)}`;
    } else if (provider === "mercadopago" && paymentId && paymentId !== "null") {
      query = `provider=mercadopago&payment_id=${encodeURIComponent(paymentId)}`;
    } else if (status === "failure") {
      setView("failed");
      return;
    } else {
      // Sin datos de pago (enlace del correo): sólo el briefing.
      setView(status === "success" || status === "pending" ? "unverified" : "brief");
      return;
    }

    let alive = true;
    fetch(`/api/order-status?${query}`)
      .then((res) => res.json() as Promise<Order>)
      .then((data) => {
        if (!alive) return;
        setOrder(data);
        if (data.subscription) setIsSubscription(true);
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

  // Recupera el borrador guardado en este dispositivo.
  useEffect(() => {
    const draft = readDraft();
    if (draft) setBrief(draft);
    draftLoaded.current = true;
  }, []);

  // Lo que ya sabemos por el pago (nombre, correo, teléfono) y el tipo de
  // proyecto de la suscripción: solo llena lo que está vacío.
  useEffect(() => {
    const known: Record<string, string | undefined> = {
      fullName: order?.name,
      contactEmail: order?.email,
      contactPhone: order?.phone,
      projectType: isSubscription ? "Suscripción Todo Digital" : undefined,
    };
    setBrief((prev) => {
      const values = { ...prev.values };
      let changed = false;
      for (const [key, value] of Object.entries(known)) {
        if (value && !values[key]?.trim()) {
          values[key] = value;
          changed = true;
        }
      }
      return changed ? { ...prev, values } : prev;
    });
  }, [order, isSubscription]);

  // Autoguardado (sin archivos).
  useEffect(() => {
    if (!draftLoaded.current || sendState === "sent") return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(brief));
      } catch {
        /* sin storage: se llena igual */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [brief, sendState]);

  /** Aplica lo que Lumina llenó; devuelve las claves que cambiaron. */
  function applyLumina(reply: BriefLuminaReply): string[] {
    const changed: string[] = [];
    const current = brief;
    const values = { ...current.values };
    for (const [key, value] of Object.entries(reply.fill)) {
      if (values[key] !== value) {
        values[key] = value;
        changed.push(key);
      }
    }
    const newFeatures = reply.features.filter((f) => !current.features.includes(f));
    if (newFeatures.length) changed.push("features");
    const newLinks = reply.links
      .filter((url) => !current.links.some((l) => l.url === url))
      .map((url) => makeBriefLink(url));
    if (newLinks.length) changed.push("links");
    if (!changed.length) return [];
    setBrief((prev) => ({
      values: { ...prev.values, ...Object.fromEntries(changed.filter((k) => k in values).map((k) => [k, values[k]])) },
      features: [...prev.features, ...newFeatures.filter((f) => !prev.features.includes(f))],
      links: [...prev.links, ...newLinks.filter((l) => !prev.links.some((p) => p.url === l.url))].slice(0, 20),
    }));
    setFlash(new Set(changed));
    window.setTimeout(() => setFlash(new Set()), 2600);
    trackEvent("brief_lumina_fill", { fields: changed.length });
    return changed.map((k) => (k === "features" ? "funciones" : k === "links" ? "enlaces" : k));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const v = brief.values;
    const missing = [
      !v.fullName?.trim() && "gb-fullName",
      !v.businessName?.trim() && "gb-businessName",
      !v.contactPhone?.trim() && "gb-contactPhone",
    ].filter(Boolean) as string[];
    if (missing.length) {
      setError("Completa nombre, negocio y WhatsApp para continuar.");
      setSendState("error");
      document.getElementById(missing[0])?.focus();
      return;
    }
    if (v.contactEmail?.trim() && !EMAIL_RE.test(v.contactEmail.trim())) {
      setError("Revisa tu correo: parece que le falta algo.");
      setSendState("error");
      document.getElementById("gb-contactEmail")?.focus();
      return;
    }

    setSendState("sending");
    setError("");
    try {
      const attachments = await Promise.all(
        files.map(async (file) => ({ name: file.name, type: file.type, base64: await fileToBase64(file) }))
      );
      const res = await fetch("/api/onboarding-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `gracias-briefing (${view}${isSubscription ? ", suscripción" : ""})`,
          form: { ...brief.values, features: brief.features.join(", ") },
          links: brief.links.map((l) => ({ url: l.url, label: l.label, purpose: l.purpose })),
          payment: {
            method: view === "transfer" ? "transferencia" : order?.provider || "pendiente",
            reference: paymentRef.current,
          },
          totals: order?.value ? { payableNow: order.value, currency: order.currency } : undefined,
          attachments,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || String(res.status));
      trackEvent("briefing_submit", { state: view, links: brief.links.length, files: files.length });
      setSendState("sent");
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* nada */
      }
    } catch {
      setError("No se pudo enviar el briefing. Mándalo por WhatsApp: ya va escrito.");
      setSendState("error");
    }
  }

  const hero =
    isSubscription && view === "paid"
      ? {
          ...HEROES.paid,
          title: "¡Bienvenido a tu suscripción Todo Digital!",
          body: "Ya está activa. Cuéntanos de tu negocio aquí abajo (Lumina te ayuda) y mándanos tu primera solicitud por WhatsApp: cada una se entrega en 1 a 2 días hábiles según su complejidad.",
        }
      : HEROES[view];
  const showBrief = view !== "checking" && view !== "failed" && view !== "cancelled";
  const waHref = (text: string) => `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
  const briefText = briefToText(brief, paymentRef.current);
  const helpText =
    view === "failed" || view === "cancelled"
      ? "Hola, intenté pagar mi proyecto web en el sitio y no se completó. ¿Me ayudas?"
      : view === "transfer"
        ? "Hola Bryan, te mando el comprobante de mi transferencia. Mi negocio es: "
        : "Hola, acabo de pagar mi proyecto web. ¿Podemos hablar?";
  // Transferencia: el pago aún no se confirma, así que "Pago" sigue en curso.
  const stepIndex = view === "paid" || view === "pending" ? 1 : 0;

  return (
    <>
      <SpanishPageLanguage />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* Alto mínimo: con el pie a la vista el encabezado se retira, y en
            los estados cortos (cancelado, fallido) se quedaba sin él. */}
        <section aria-labelledby="gracias-title" className="panel flex min-h-[60vh] flex-col justify-center p-4 pt-5 shadow-soft sm:p-8 lg:p-10">
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
                  {isSubscription ? " / mes" : ""}
                </p>
              ) : null}
            </div>

            {isSubscription && view === "paid" && (
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" variant="ink" className="justify-between whitespace-normal pl-6 pr-2.5 text-left leading-tight">
                  <a
                    href={waHref("Hola Bryan, ya me suscribí al plan Todo Digital. Mi primera solicitud es: ")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem] text-lime" />
                    Mandar mi primera solicitud
                    <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/suscripcion/preguntas-frecuentes">Preguntas de la suscripción</Link>
                </Button>
              </div>
            )}

            {view === "transfer" && (
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" variant="ink" className="justify-between whitespace-normal pl-6 pr-2.5 text-left leading-tight">
                  <a href={waHref(helpText)} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem] text-lime" />
                    Enviar comprobante
                    <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="mailto:bryanf@bryanfdesign.com.mx?subject=Comprobante%20de%20transferencia%20-%20BryanF%20Design">
                    <Mail aria-hidden className="h-4 w-4" />
                    Mandarlo por correo
                  </a>
                </Button>
              </div>
            )}

            {!isSubscription && showBrief && <Steps current={stepIndex} />}

            {(view === "failed" || view === "cancelled") && (
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" variant="ink" className="justify-between whitespace-normal pl-6 pr-2.5 text-left leading-tight">
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
          <section aria-labelledby="brief-title" className="grid items-start gap-gutter lg:grid-cols-12">
            <div className="panel p-4 pt-5 shadow-soft sm:p-7 lg:col-span-8 lg:p-9">
              <h2 id="brief-title" className="display-title px-1 text-[1.75rem] leading-tight text-ink sm:px-0">
                {isSubscription ? "Cuéntanos de tu negocio" : "Tu briefing"}
              </h2>
              <p className="mt-2 px-1 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground sm:px-0">
                Mientras más nos cuentes, más rápido arrancamos y menos vueltas damos. Solo nombre, negocio y WhatsApp son
                obligatorios; lo demás, lo que tengas a la mano. ¿Prefieres platicarlo? Lumina lo llena contigo.
              </p>
              {sendState === "sent" ? (
                <div role="status" className="mt-5 flex flex-col gap-4 rounded-card bg-lime p-6">
                  <p className="display-title text-[1.6rem] leading-tight text-ink">¡Briefing recibido!</p>
                  <p className="text-[0.975rem] leading-relaxed text-ink/80">
                    Lo revisamos en menos de 24 horas hábiles y te escribimos para agendar el arranque.
                    {brief.values.contactEmail ? " Te mandamos una copia a tu correo." : ""}
                  </p>
                  <Button asChild size="lg" variant="ink" className="w-full sm:w-fit">
                    <a href={waHref(briefText)} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                      Avisar por WhatsApp
                    </a>
                  </Button>
                </div>
              ) : (
                <BriefForm
                  state={brief}
                  onChange={setBrief}
                  flash={flash}
                  files={files}
                  onFiles={setFiles}
                  sendState={sendState}
                  error={error}
                  whatsappHref={waHref(briefText)}
                  onSubmit={onSubmit}
                />
              )}
            </div>

            {/* Lumina: en teléfono va primero (antes del formulario); en
                escritorio acompaña al formulario pegada arriba. */}
            <aside className="order-first flex flex-col gap-gutter lg:sticky lg:top-[calc(var(--header-h,4.5rem)+var(--gutter))] lg:order-none lg:col-span-4">
              {sendState !== "sent" && (
                <BriefLumina state={brief} subscription={isSubscription} view={view} onApply={applyLumina} />
              )}
              <div className="panel flex flex-col gap-3 p-5 shadow-soft">
                <p className="text-sm font-bold text-ink">¿Dudas? Te contestamos directo</p>
                <Button asChild variant="ink" className="w-full">
                  <a href={waHref(helpText)} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp aria-hidden className="h-4 w-4 text-lime" />
                    Hablar con Bryan
                  </a>
                </Button>
                <a
                  href="mailto:bryanf@bryanfdesign.com.mx"
                  className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
                >
                  <Mail aria-hidden className="h-4 w-4" />
                  bryanf@bryanfdesign.com.mx
                </a>
              </div>
            </aside>
          </section>
        )}

        {showBrief && <StudioInfo subscription={isSubscription} />}
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}

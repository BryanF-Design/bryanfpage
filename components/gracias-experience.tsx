"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Clock,
  ClipboardList,
  Landmark,
  Loader2,
  Mail,
  Receipt,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { StudioInfo } from "@/components/brief/studio-info";
import { trackAdsConversion, trackEvent } from "@/lib/analytics";
import { formatMoney } from "@/lib/currency";
import { usePaymentVerification, type PaymentView, type VerifiedOrder } from "@/lib/use-payment-verification";
import { cn } from "@/lib/utils";

const WA_PHONE = "525663012505";
/** Transacciones ya contadas en este dispositivo: recargar /gracias no duplica la venta. */
const COUNTED_KEY = "bryanf_purchases_counted_v1";

/** Cuenta la compra una sola vez por transacción (GA4 + Google Ads). */
function countPurchase(order: VerifiedOrder) {
  if (!order.transactionId || order.provider === "transfer") return;
  try {
    const counted = JSON.parse(window.localStorage.getItem(COUNTED_KEY) || "[]") as string[];
    if (counted.includes(order.transactionId)) return;
    window.localStorage.setItem(COUNTED_KEY, JSON.stringify([...counted, order.transactionId].slice(-20)));
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

const STEPS = ["Pago", "Armar mi brief", "Revisión", "Entrega"];

function Steps({ current }: { current: number }) {
  return (
    <ol aria-label="Progreso del proyecto" className="grid grid-cols-4 gap-1.5">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-col gap-2">
            <span aria-hidden className={cn("h-1.5 rounded-full", done ? "bg-ink" : active ? "bg-lime-deep" : "bg-ink/10")} />
            <span className={cn("flex items-center gap-1.5 text-xs font-semibold", done || active ? "text-ink" : "text-ink/45")}>
              {done && <Check aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />}
              {label}
              {active && <span className="sr-only">(paso actual)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const HEROES: Record<Exclude<PaymentView, "paid">, { badge: ReactNode; tone: string; title: string; body: string }> = {
  checking: {
    badge: <Loader2 className="h-7 w-7 animate-spin" />,
    tone: "bg-white text-ink",
    title: "Confirmando tu pago…",
    body: "Estamos verificando el pago con la plataforma. Tarda un par de segundos.",
  },
  pending: {
    badge: <Clock className="h-7 w-7" />,
    tone: "bg-white text-ink",
    title: "Tu pago está en proceso",
    body: "La plataforma aún no lo acredita (pasa con OXXO, SPEI o revisiones del banco). En cuanto se confirme te llega por correo tu comprobante con el enlace para armar tu brief.",
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
    title: "Aún no podemos confirmar tu pago",
    body: "No logramos verificarlo automáticamente. Si ya pagaste, en cuanto se confirme te llega el comprobante por correo con el enlace para armar tu brief. Si tienes prisa, escríbenos.",
  },
  none: {
    badge: <Receipt className="h-7 w-7" />,
    tone: "bg-white text-ink",
    title: "Busca tu comprobante en tu correo",
    body: "Cuando confirmamos tu pago te mandamos un correo con el botón \"Armar mi brief\". Si no lo encuentras (revisa spam o promociones), escríbenos y te lo reenviamos.",
  },
  transfer: {
    badge: <Landmark className="h-7 w-7" />,
    tone: "bg-lime text-ink",
    title: "Gracias por elegir transferencia",
    body: "Cuando la hagas, mándanos el comprobante por WhatsApp o correo. Al confirmarla te llega por correo tu comprobante con el enlace para armar tu brief.",
  },
};

/**
 * /gracias — la página de compra exitosa.
 *
 * Stripe y Mercado Pago regresan aquí. La página verifica el pago con
 * /api/order-status y SÓLO con el pago confirmado dice "compra exitosa", cuenta
 * la venta (purchase) en GA4 y Google Ads y abre el paso siguiente: "Armar mi
 * brief" (/armar-mi-brief), que vuelve a verificar el pago por su cuenta.
 * Pendiente, fallido o sin confirmar: lo dice y ofrece ayuda, sin brief.
 */
export function GraciasExperience() {
  const { view, order, subscription, accessQuery } = usePaymentVerification();
  const counted = useRef(false);

  useEffect(() => {
    if (view === "paid" && order && !counted.current) {
      counted.current = true;
      countPurchase(order);
    }
    if (view === "cancelled") trackEvent("checkout_cancelled", { payment_provider: order?.provider || "unknown" });
  }, [view, order]);

  const waHref = (text: string) => `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
  const briefHref = `/armar-mi-brief${accessQuery ? `?${accessQuery}` : ""}`;
  const firstName = order?.name?.trim().split(/\s+/)[0];

  if (view === "paid") {
    const amount = order?.value ? `${formatMoney(order.value, order.currency === "USD" ? "USD" : "MXN")} ${order.currency}` : null;
    const method =
      order?.provider === "stripe" ? "Tarjeta (Stripe)" : order?.provider === "mercadopago" ? "Mercado Pago" : "Transferencia";
    return (
      <>
        <SpanishPageLanguage />
        <SiteHeader spanishOnly />
        <main id="main-content" tabIndex={-1} className="sheet-main">
          <section aria-labelledby="gracias-title" className="grid gap-gutter lg:grid-cols-12">
            <div className="panel relative flex flex-col gap-6 overflow-hidden bg-ink p-5 pt-6 text-white shadow-soft sm:p-9 lg:col-span-8 lg:p-11">
              <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-lime/20 blur-3xl" />
              <span className="grid size-16 place-items-center rounded-full bg-lime text-ink">
                <Check className="h-8 w-8" strokeWidth={3} />
              </span>
              <div className="flex flex-col gap-4" aria-live="polite">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-lime">
                  {subscription ? "Suscripción activa" : "Compra exitosa"}
                </p>
                <h1 id="gracias-title" className="display-title text-balance text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.96]">
                  {subscription
                    ? `¡Bienvenido a Todo Digital${firstName ? `, ${firstName}` : ""}!`
                    : `¡Gracias${firstName ? `, ${firstName}` : ""}! Tu pago está confirmado`}
                </h1>
                <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-white/75 md:text-lg">
                  {subscription
                    ? "Tu suscripción ya está activa. Arma tu brief una sola vez para que conozcamos tu negocio y mándanos tu primera solicitud: cada una se entrega en 1 a 2 días hábiles."
                    : "Tu proyecto ya tiene lugar en la agenda y el comprobante va en camino a tu correo. El siguiente paso es armar tu brief: unos minutos y arrancamos."}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" variant="default" className="justify-between pl-6 pr-2.5">
                  <Link href={briefHref} onClick={() => trackEvent("brief_open", { from: "gracias" })}>
                    <ClipboardList aria-hidden className="h-5 w-5" />
                    Armar mi brief
                    <ButtonArrow tone="ink" className="ml-3 -mr-0.5" />
                  </Link>
                </Button>
                {subscription ? (
                  <Button asChild size="lg" variant="white">
                    <a
                      href={waHref("Hola Bryan, ya me suscribí al plan Todo Digital. Mi primera solicitud es: ")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                      Mandar mi primera solicitud
                    </a>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="white">
                    <a href={waHref("Hola Bryan, acabo de pagar mi proyecto web. ¿Podemos hablar?")} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                      Hablar con Bryan
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Comprobante */}
            <aside aria-label="Comprobante" className="panel flex flex-col gap-5 p-5 pt-6 shadow-soft sm:p-8 lg:col-span-4">
              <span className="eyebrow w-fit pl-3">
                <span aria-hidden className="size-2 rounded-full bg-lime" />
                Tu comprobante
              </span>
              {amount && (
                <p className="display-title text-[2.6rem] leading-none tabular-nums text-ink">
                  {amount}
                  {subscription && <span className="text-lg text-ink/55"> / mes</span>}
                </p>
              )}
              <dl className="flex flex-col divide-y divide-ink/[0.08] rounded-card bg-mint px-4 ring-1 ring-inset ring-ink/[0.06]">
                {[
                  ["Estado", "Pagado"],
                  ["Método", method],
                  ["Concepto", subscription ? "Suscripción Todo Digital" : "Proyecto web"],
                  order?.email ? ["Comprobante a", order.email] : null,
                ]
                  .filter((row): row is string[] => Boolean(row))
                  .map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <dt className="text-ink/60">{k}</dt>
                      <dd className="min-w-0 truncate text-right font-semibold text-ink">
                        {k === "Estado" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-1 text-xs font-bold">
                            <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                            {v}
                          </span>
                        ) : (
                          v
                        )}
                      </dd>
                    </div>
                  ))}
              </dl>
              {!subscription && <Steps current={1} />}
              <p className="flex items-start gap-2 text-xs leading-snug text-ink/60">
                <Mail aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Te mandamos el comprobante y el enlace a tu brief por correo, por si quieres llenarlo después.
              </p>
            </aside>
          </section>

          <section aria-labelledby="brief-cta" className="panel flex flex-col items-start gap-5 bg-lime p-5 pt-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-lime">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 id="brief-cta" className="display-title text-[1.6rem] leading-tight text-ink">
                  Arma tu brief en 6 pasos cortos
                </h2>
                <p className="mt-1 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-ink/75">
                  Tu negocio, el proyecto, tu estilo y tus materiales. Se guarda solo y Lumina te ayuda a llenarlo platicando.
                </p>
              </div>
            </div>
            <Button asChild size="lg" variant="ink" className="w-full justify-between pl-6 pr-2.5 sm:w-auto">
              <Link href={briefHref}>
                Empezar
                <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
              </Link>
            </Button>
          </section>

          <StudioInfo subscription={subscription} />
        </main>
        <SiteFooter spanishOnly />
      </>
    );
  }

  const hero = HEROES[view];
  const helpText =
    view === "failed" || view === "cancelled"
      ? "Hola, intenté pagar mi proyecto web en el sitio y no se completó. ¿Me ayudas?"
      : view === "transfer"
        ? "Hola Bryan, te mando el comprobante de mi transferencia. Mi negocio es: "
        : "Hola Bryan, ya pagué mi proyecto web y no encuentro el enlace para armar mi brief. ¿Me ayudas?";

  return (
    <>
      <SpanishPageLanguage />
      <SiteHeader spanishOnly />
      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* Alto mínimo: con el pie a la vista el encabezado se retira, y en
            los estados cortos (cancelado, fallido) se quedaba sin él. */}
        <section aria-labelledby="gracias-title" className="panel flex min-h-[60vh] flex-col justify-center p-4 pt-5 shadow-soft sm:p-8 lg:p-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <span className={cn("grid size-16 place-items-center rounded-full ring-1 ring-ink/10", hero.tone)}>{hero.badge}</span>
            <div className="flex flex-col gap-4" aria-live="polite">
              <h1 id="gracias-title" className="display-title text-balance text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] text-ink">
                {hero.title}
              </h1>
              <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">{hero.body}</p>
            </div>

            {view === "pending" && <Steps current={0} />}

            {view !== "checking" && (
              <div className="flex flex-col gap-2.5 sm:flex-row">
                {view === "failed" || view === "cancelled" ? (
                  <Button asChild size="lg" variant="ink" className="justify-between whitespace-normal pl-6 pr-2.5 text-left leading-tight">
                    <Link href={subscription ? "/suscripcion" : "/crear-web#precios"}>
                      {subscription ? "Volver a la suscripción" : "Retomar mi cotización"}
                      <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="ink" className="justify-between whitespace-normal pl-6 pr-2.5 text-left leading-tight">
                    <a href={waHref(helpText)} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem] text-lime" />
                      {view === "transfer" ? "Enviar comprobante" : "Escribir por WhatsApp"}
                      <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
                    </a>
                  </Button>
                )}
                {view === "failed" || view === "cancelled" ? (
                  <Button asChild size="lg" variant="outline">
                    <a href={waHref(helpText)} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                      Resolverlo por WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="outline">
                    <a
                      href={`mailto:bryanf@bryanfdesign.com?subject=${encodeURIComponent(
                        view === "transfer" ? "Comprobante de transferencia - BryanF Design" : "Mi pago - BryanF Design"
                      )}`}
                    >
                      <Mail aria-hidden className="h-4 w-4" />
                      {view === "transfer" ? "Mandarlo por correo" : "Escribir por correo"}
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter spanishOnly />
    </>
  );
}

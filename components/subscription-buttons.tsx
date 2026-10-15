"use client";

import { useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { SiMercadopago, SiStripe } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { SUBSCRIPTION_PRICE_LABEL } from "@/lib/subscription";

const WA_PHONE = "525663012505";

/**
 * Botones para suscribirse: tarjeta (Stripe, cobro recurrente), Mercado Pago
 * (plan de suscripciones) o transferencia mensual por WhatsApp. Igual que el
 * cotizador: la redirección va en la misma pestaña (Safari bloquea
 * window.open después de un `await`).
 */
export function SubscriptionButtons() {
  const [loading, setLoading] = useState<"stripe" | "mercadopago" | null>(null);
  const [status, setStatus] = useState("");

  // Volvió del checkout sin terminar (?status=cancel) o con "atrás" (bfcache).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("status") === "cancel") {
      setStatus("Saliste del pago antes de terminar: no se hizo ningún cargo. Puedes intentarlo de nuevo cuando quieras.");
    }
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) setLoading(null);
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function subscribe(provider: "stripe" | "mercadopago") {
    setLoading(provider);
    setStatus("");
    try {
      const res = await fetch(
        provider === "stripe" ? "/api/subscription-checkout" : "/api/subscription-mercadopago",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attribution: getAttribution() }),
        }
      );
      const data = (await res.json().catch(() => ({}))) as {
        checkoutUrl?: string;
        initPoint?: string;
        error?: string;
      };
      const url = data.checkoutUrl || data.initPoint;
      if (!res.ok || !url) throw new Error(data.error || String(res.status));
      trackEvent("begin_checkout", {
        payment_provider: provider,
        value: SUBSCRIPTION_PLAN.price,
        currency: "MXN",
        items: [{ item_id: SUBSCRIPTION_PLAN.id, item_name: "Suscripción Todo Digital", price: SUBSCRIPTION_PLAN.price, quantity: 1 }],
      });
      window.location.assign(url);
    } catch {
      setStatus("No pudimos abrir el pago. Intenta de nuevo o escríbenos por WhatsApp y te ayudamos.");
      setLoading(null);
    }
  }

  const transferText = encodeURIComponent(
    `Hola Bryan, quiero la suscripción Todo Digital (${SUBSCRIPTION_PRICE_LABEL} al mes) y prefiero pagar por transferencia mensual.`
  );

  return (
    <div className="flex flex-col gap-2.5">
      <Button
        size="lg"
        onClick={() => subscribe("stripe")}
        disabled={!!loading}
        className="w-full justify-between whitespace-normal bg-lime pl-2 pr-2.5 text-left leading-tight text-ink"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white">
            {loading === "stripe" ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink" />
            ) : (
              <SiStripe aria-hidden className="h-4 w-4 text-[#635BFF]" />
            )}
          </span>
          Suscribirme con tarjeta
        </span>
        <ButtonArrow tone="ink" className="ml-2 mr-0" />
      </Button>
      <Button
        size="lg"
        variant="white"
        onClick={() => subscribe("mercadopago")}
        disabled={!!loading}
        className="w-full justify-between whitespace-normal pl-2 pr-2.5 text-left leading-tight"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00B1EA]/10">
            {loading === "mercadopago" ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink" />
            ) : (
              <SiMercadopago aria-hidden className="h-5 w-5 text-[#00B1EA]" />
            )}
          </span>
          Suscribirme con Mercado Pago
        </span>
        <ButtonArrow tone="ink" className="ml-2 mr-0" />
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="w-full justify-start gap-3 whitespace-normal border-white/20 pl-2 text-left leading-tight text-white hover:border-white/50 hover:bg-white/[0.06]"
      >
        <a
          href={`https://wa.me/${WA_PHONE}?text=${transferText}`}
          target="_blank"
          rel="noopener noreferrer"
          data-track-service="suscripcion"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-lime">
            <Building2 className="h-4 w-4" />
          </span>
          Transferencia mensual
          <FaWhatsapp aria-hidden className="ml-auto mr-2 h-4 w-4 text-lime" />
        </a>
      </Button>
      {status && (
        <p role="status" className="rounded-inner bg-white/[0.08] px-4 py-3 text-sm leading-snug text-white/85">
          {status}
        </p>
      )}
    </div>
  );
}

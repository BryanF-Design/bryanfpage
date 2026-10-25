"use client";

import { useEffect, useState } from "react";

/**
 * Verificación del pago en el navegador (para /gracias y /armar-mi-brief).
 *
 * Lee de la URL la referencia que dejan Stripe / Mercado Pago (o el enlace
 * firmado `?acceso=` de un pago confirmado a mano) y pregunta su estado real a
 * /api/order-status. Nunca se cree el `status=success` de la URL.
 */

export type PaymentProviderId = "stripe" | "mercadopago" | "transfer";

export interface VerifiedOrder {
  state: "paid" | "pending" | "failed" | "unknown";
  provider: PaymentProviderId;
  transactionId?: string;
  value?: number;
  currency?: string;
  email?: string;
  name?: string;
  phone?: string;
  subscription?: boolean;
}

export type PaymentView =
  | "checking"
  | "paid"
  | "pending"
  | "failed"
  | "cancelled"
  | "unverified"
  | "transfer"
  /** Sin datos de pago en la URL. */
  | "none";

export interface PaymentVerification {
  view: PaymentView;
  order: VerifiedOrder | null;
  /** La suscripción mensual (por la URL o por el pago). */
  subscription: boolean;
  /** Referencia del proveedor (para el brief y WhatsApp). */
  reference: string;
  provider: string | null;
  /** Query que reabre la misma verificación en otra página. */
  accessQuery: string;
}

export function usePaymentVerification(): PaymentVerification {
  const [result, setResult] = useState<PaymentVerification>({
    view: "checking",
    order: null,
    subscription: false,
    reference: "",
    provider: null,
    accessQuery: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const status = params.get("status");
    const sessionId = params.get("session_id");
    const paymentId = params.get("payment_id") || params.get("collection_id");
    const preapprovalId = params.get("preapproval_id");
    const token = params.get("acceso");
    const reference = sessionId || paymentId || preapprovalId || "";
    const subscription = params.get("plan") === "suscripcion";
    const base = { order: null, subscription, reference, provider };

    let query = "";
    if (token) {
      query = `provider=link&token=${encodeURIComponent(token)}`;
    } else if (provider === "stripe" && sessionId) {
      query = `provider=stripe&session_id=${encodeURIComponent(sessionId)}`;
    } else if (provider === "mercadopago" && preapprovalId) {
      query = `provider=mercadopago&preapproval_id=${encodeURIComponent(preapprovalId)}`;
    } else if (provider === "mercadopago" && paymentId && paymentId !== "null") {
      query = `provider=mercadopago&payment_id=${encodeURIComponent(paymentId)}`;
    }

    if (!query) {
      const view: PaymentView =
        status === "cancel"
          ? "cancelled"
          : params.get("via") === "transferencia"
            ? "transfer"
            : status === "failure"
              ? "failed"
              : status === "success" || status === "pending"
                ? "unverified"
                : "none";
      setResult({ ...base, view, accessQuery: "" });
      return;
    }

    // En /armar-mi-brief el parámetro del token se llama `acceso`.
    const accessQuery = token
      ? `acceso=${encodeURIComponent(token)}`
      : `${query}${subscription ? "&plan=suscripcion" : ""}`;

    let alive = true;
    fetch(`/api/order-status?${query}`)
      .then((res) => res.json() as Promise<VerifiedOrder>)
      .then((order) => {
        if (!alive) return;
        const view: PaymentView =
          order.state === "paid"
            ? "paid"
            : order.state === "pending"
              ? "pending"
              : order.state === "failed"
                ? "failed"
                : "unverified";
        setResult({
          ...base,
          order,
          view,
          subscription: subscription || Boolean(order.subscription),
          reference: reference || order.transactionId || "",
          accessQuery,
        });
      })
      .catch(() => alive && setResult({ ...base, view: "unverified", accessQuery }));
    return () => {
      alive = false;
    };
  }, []);

  return result;
}

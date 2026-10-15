/**
 * NOTIFICACIONES DE PEDIDO (correo transaccional vía Resend).
 *
 * Se usa desde los webhooks de pago cuando una transacción se confirma del lado
 * del servidor: avisa al equipo (venta nueva) y, si tenemos el correo del
 * cliente, le manda su comprobante con folio y próximos pasos.
 *
 * El folio se deriva de la referencia del pago (id de sesión/pago), así que es
 * estable: si el webhook se reintrega, el mismo pago produce el mismo folio.
 */

import { describeAttribution, sanitizeAttribution, type Attribution } from "./attribution";
import { getSiteUrl } from "./site-url";

export const INTERNAL_TO = "bryanf@bryanfdesign.com.mx";

export interface OrderConfirmation {
  provider: "stripe" | "mercadopago";
  /** Monto cobrado ahora, en la moneda de `currency`. */
  amount: number;
  currency: string;
  /** Referencia del proveedor (checkout session id / payment id). */
  reference: string;
  description?: string;
  customerEmail?: string | null;
  customerName?: string | null;
  modalidad?: string | null;
  /** Campaña de origen (gclid/utm) guardada en la metadata del pago. */
  attribution?: Attribution;
  /** Alta de la suscripción mensual (cambia el correo del cliente). */
  subscription?: boolean;
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-MX", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function escapeHtml(text: unknown) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Folio estable a partir de la referencia del proveedor. */
export function makeFolio(reference: string): string {
  const tail = reference.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `BF-${tail || Date.now().toString(36).toUpperCase()}`;
}

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY missing" };
  const from =
    process.env.MAIL_FROM || "BryanF Design <no-reply@bryanfdesign.com.mx>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data as { error?: unknown }).error) {
      return { ok: false, error: JSON.stringify((data as { error?: unknown }).error || res.status) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

const PROVIDER_LABEL: Record<OrderConfirmation["provider"], string> = {
  stripe: "Tarjeta (Stripe)",
  mercadopago: "Mercado Pago",
};

/**
 * Envía el aviso interno (siempre) y, si hay correo del cliente, su comprobante.
 * No lanza: devuelve el estado para que el webhook responda 200 igualmente.
 */
export async function sendOrderConfirmation(
  order: OrderConfirmation
): Promise<{ folio: string; internal: boolean; customer: boolean }> {
  const folio = makeFolio(order.reference);
  const amount = formatMoney(order.amount, order.currency);
  const method = PROVIDER_LABEL[order.provider];
  const brief = `${getSiteUrl()}/gracias`;
  const attribution = sanitizeAttribution(order.attribution);

  const internalHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
      <h2 style="margin:0 0 8px;">${order.subscription ? "Nueva suscripción ✅" : "Pago confirmado ✅"}</h2>
      <p style="margin:0 0 16px;">${
        order.subscription
          ? "Un cliente se suscribió al plan mensual Todo Digital. Escríbele para recibir su primera solicitud."
          : "Se confirmó un pago desde el cotizador."
      }</p>
      <ul style="margin:0 0 14px;padding-left:18px;">
        <li><strong>Folio:</strong> ${folio}</li>
        <li><strong>Monto cobrado:</strong> ${amount}</li>
        <li><strong>Método:</strong> ${escapeHtml(method)}</li>
        <li><strong>Modalidad:</strong> ${escapeHtml(order.modalidad || "—")}</li>
        <li><strong>Concepto:</strong> ${escapeHtml(order.description || "Proyecto web")}</li>
        <li><strong>Cliente:</strong> ${escapeHtml(order.customerName || "—")} ${
    order.customerEmail ? `(${escapeHtml(order.customerEmail)})` : ""
  }</li>
        <li><strong>Referencia:</strong> ${escapeHtml(order.reference)}</li>
        <li><strong>Origen:</strong> ${escapeHtml(describeAttribution(attribution))}</li>${
    attribution.gclid
      ? `\n        <li><strong>GCLID:</strong> ${escapeHtml(attribution.gclid)}</li>`
      : ""
  }
      </ul>
    </div>`;

  const internalRes = await sendEmail(
    INTERNAL_TO,
    `${order.subscription ? "Nueva suscripción" : "Pago confirmado"} ${folio} — ${amount}`,
    internalHtml
  );

  let customerOk = false;
  if (order.customerEmail) {
    const customerHtml = order.subscription
      ? `
      <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
        <h2 style="margin:0 0 8px;">¡Bienvenido a tu suscripción Todo Digital!</h2>
        <p style="margin:0 0 16px;">Tu suscripción ya está activa. Este es tu comprobante.</p>
        <ul style="margin:0 0 14px;padding-left:18px;">
          <li><strong>Folio:</strong> ${folio}</li>
          <li><strong>Cobro mensual:</strong> ${amount}</li>
        </ul>
        <p style="margin:0 0 10px;"><strong>¿Cómo pido algo?</strong> Escríbenos por WhatsApp al
          <a href="https://wa.me/525663012505" style="color:#5b8a00;">+52 56 6301 2505</a> o responde este correo
          con lo que necesitas. Cada solicitud se entrega en 1 a 2 días hábiles según su complejidad.</p>
        <p style="margin:0 0 16px;">Política y preguntas frecuentes:
          <a href="${getSiteUrl()}/suscripcion#politica" style="color:#5b8a00;">${getSiteUrl()}/suscripcion</a></p>
        <p style="margin:0;color:#666;">Puedes cancelar cuando quieras; no hay plazo forzoso.</p>
      </div>`
      : `
      <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
        <h2 style="margin:0 0 8px;">¡Gracias por tu compra!</h2>
        <p style="margin:0 0 16px;">Recibimos tu pago. Este es tu comprobante.</p>
        <ul style="margin:0 0 14px;padding-left:18px;">
          <li><strong>Folio:</strong> ${folio}</li>
          <li><strong>Monto pagado:</strong> ${amount}</li>
          <li><strong>Concepto:</strong> ${escapeHtml(order.description || "Proyecto web")}</li>
        </ul>
        <p style="margin:0 0 16px;">Siguiente paso: completa tu briefing para arrancar tu
          proyecto en <a href="${brief}" style="color:#5b8a00;">${brief}</a>.</p>
        <p style="margin:0;color:#666;">¿Dudas? Escríbenos por WhatsApp al +52 56 6301 2505.</p>
      </div>`;
    const customerRes = await sendEmail(
      order.customerEmail,
      order.subscription
        ? `Tu suscripción está activa ${folio} — BryanF Design`
        : `Tu comprobante ${folio} — BryanF Design`,
      customerHtml
    );
    customerOk = customerRes.ok;
  }

  return { folio, internal: internalRes.ok, customer: customerOk };
}

/**
 * Aviso interno de un evento de la suscripción (renovación, cobro fallido,
 * cancelación). No lanza.
 */
export async function sendSubscriptionNotice(notice: {
  event: "renewal" | "payment_failed" | "cancelled";
  provider: "stripe" | "mercadopago";
  reference: string;
  amount?: number;
  currency?: string;
  customerEmail?: string | null;
  customerName?: string | null;
}) {
  const titles = {
    renewal: "Renovación cobrada 🔁",
    payment_failed: "Cobro de suscripción fallido ⚠️",
    cancelled: "Suscripción cancelada",
  } as const;
  const notes = {
    renewal: "Se cobró un mes más de la suscripción Todo Digital.",
    payment_failed:
      "No pasó el cobro mensual. La plataforma lo reintentará; si sigue pendiente 7 días, la política dice pausar solicitudes.",
    cancelled: "El cliente canceló o la suscripción terminó. Entrégale archivos y accesos si los pide.",
  } as const;
  const amount =
    notice.amount != null ? formatMoney(notice.amount, notice.currency || "MXN") : "—";
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
      <h2 style="margin:0 0 8px;">${titles[notice.event]}</h2>
      <p style="margin:0 0 16px;">${notes[notice.event]}</p>
      <ul style="margin:0 0 14px;padding-left:18px;">
        <li><strong>Cliente:</strong> ${escapeHtml(notice.customerName || "—")} ${
    notice.customerEmail ? `(${escapeHtml(notice.customerEmail)})` : ""
  }</li>
        <li><strong>Monto:</strong> ${amount}</li>
        <li><strong>Método:</strong> ${escapeHtml(PROVIDER_LABEL[notice.provider])}</li>
        <li><strong>Referencia:</strong> ${escapeHtml(notice.reference)}</li>
      </ul>
    </div>`;
  return sendEmail(INTERNAL_TO, `${titles[notice.event]} — ${notice.customerEmail || notice.reference}`, html);
}

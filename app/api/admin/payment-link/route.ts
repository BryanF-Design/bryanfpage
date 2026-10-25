import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { MercadoPagoConfig, Preference } from "mercadopago";

import { requireAdmin } from "@/lib/admin-auth";
import { paymentRequest } from "@/lib/email-templates";
import { notificationEmail, sendMail } from "@/lib/mailer";
import { makeFolio } from "@/lib/notify";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Cobro con enlace + recordatorio de pago por correo.
 *
 * POST /api/admin/payment-link   (Authorization: Bearer ADMIN_API_KEY)
 * {
 *   "email": "cliente@correo.com", "name": "Ana López",
 *   "amount": 1750, "currency": "MXN",
 *   "concept": "Saldo del proyecto web (50 %)",
 *   "modalidad": "saldo",            // anticipo | saldo | cobro (por defecto)
 *   "dueDate": "2026-10-30",         // opcional
 *   "note": "Texto extra",           // opcional
 *   "provider": "both",              // mercadopago | stripe | both (por defecto)
 *   "send": true                     // false = sólo crea los enlaces
 * }
 *
 * Mercado Pago acepta tarjeta, OXXO y SPEI; Stripe, tarjeta. Al pagar, el
 * cliente vuelve a /gracias y el webhook manda su comprobante.
 * Para volver a recordar un cobro ya creado, llama de nuevo (crea enlaces nuevos).
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim().slice(0, 120);
  const amount = Math.round(Number(body.amount) * 100) / 100;
  const currency = String(body.currency || "MXN").toUpperCase() === "USD" ? "USD" : "MXN";
  const concept = String(body.concept || "Proyecto web — BryanF Design").trim().slice(0, 200);
  const modalidad = ["anticipo", "saldo"].includes(String(body.modalidad)) ? String(body.modalidad) : "cobro";
  const provider = ["mercadopago", "stripe"].includes(String(body.provider)) ? String(body.provider) : "both";
  const dueDate = body.dueDate ? String(body.dueDate) : null;
  const note = body.note ? String(body.note).slice(0, 1000) : null;
  const send = body.send !== false;

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0 || amount > 2_000_000) {
    return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
  }

  const siteUrl = getSiteUrl();
  const reference = `cobro-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const folio = makeFolio(reference);
  const links: { mercadopago?: string; stripe?: string } = {};
  const errors: string[] = [];

  if (provider !== "stripe" && process.env.MP_ACCESS_TOKEN) {
    try {
      const pref = await new Preference(new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })).create({
        body: {
          items: [{ id: "bryanf-cobro", title: concept, quantity: 1, unit_price: amount, currency_id: currency }],
          payer: { email, ...(name ? { name } : {}) },
          back_urls: {
            success: `${siteUrl}/gracias?status=success&provider=mercadopago`,
            failure: `${siteUrl}/gracias?status=failure&provider=mercadopago`,
            pending: `${siteUrl}/gracias?status=pending&provider=mercadopago`,
          },
          auto_return: "approved",
          notification_url: `${siteUrl}/api/mercadopago-webhook`,
          external_reference: reference,
          metadata: { modalidad, folio },
        },
      });
      links.mercadopago = pref.init_point || pref.sandbox_init_point || undefined;
    } catch (error) {
      console.error("payment-link MP error:", error);
      errors.push("mercadopago");
    }
  }

  if (provider !== "mercadopago" && process.env.STRIPE_SECRET) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET);
      const price = await stripe.prices.create({
        currency: currency.toLowerCase(),
        unit_amount: Math.round(amount * 100),
        product_data: { name: concept },
      });
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: { modalidad, folio, email },
        payment_intent_data: { metadata: { modalidad, folio } },
        phone_number_collection: { enabled: true },
        after_completion: {
          type: "redirect",
          redirect: { url: `${siteUrl}/gracias?status=success&provider=stripe&session_id={CHECKOUT_SESSION_ID}` },
        },
      });
      links.stripe = link.url;
    } catch (error) {
      console.error("payment-link Stripe error:", error);
      errors.push("stripe");
    }
  }

  const primary = links.mercadopago || links.stripe;
  if (!primary) {
    return NextResponse.json({ error: "No se pudo crear ningún enlace de pago", errors }, { status: 502 });
  }

  let mail = null;
  if (send) {
    const content = paymentRequest({
      name,
      amount,
      currency,
      concept,
      folio,
      dueDate,
      note,
      payUrl: primary,
      altPayUrl: links.mercadopago && links.stripe ? links.stripe : null,
      altPayLabel: "Pagar con tarjeta (Stripe)",
    });
    mail = await sendMail({ to: email, ...content, replyTo: notificationEmail() });
  }

  return NextResponse.json({ ok: true, folio, links, errors, mail });
}

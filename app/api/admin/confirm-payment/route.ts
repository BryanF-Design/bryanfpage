import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { briefUrl, createBriefToken } from "@/lib/brief-access";
import { sendOrderConfirmation } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Confirmar a mano un pago (transferencia, depósito, efectivo).
 *
 * POST /api/admin/confirm-payment   (Authorization: Bearer ADMIN_API_KEY)
 * {
 *   "email": "cliente@correo.com", "name": "Ana López",
 *   "amount": 1750, "currency": "MXN",
 *   "concept": "Anticipo del proyecto web",
 *   "modalidad": "anticipo",          // anticipo | liquidacion | saldo
 *   "reference": "SPEI 123456"        // opcional
 * }
 *
 * Manda al cliente su comprobante con un enlace firmado a "Armar mi brief"
 * (válido 90 días) y te deja el aviso interno. Devuelve el enlace.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim().slice(0, 120);
  const amount = Number(body.amount);
  const currency = String(body.currency || "MXN").toUpperCase() === "USD" ? "USD" : "MXN";
  const concept = String(body.concept || "Proyecto web").slice(0, 200);
  const modalidad = ["anticipo", "liquidacion", "saldo"].includes(String(body.modalidad))
    ? String(body.modalidad)
    : "liquidacion";
  const reference = String(body.reference || `transfer-${Date.now().toString(36)}`).slice(0, 80);
  const subscription = body.subscription === true;

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "Monto inválido" }, { status: 400 });

  const token = createBriefToken({ reference, email, name, amount, currency, subscription });
  const link = briefUrl({ provider: "link", token });
  const result = await sendOrderConfirmation({
    provider: "transfer",
    amount,
    currency,
    reference,
    description: concept,
    customerEmail: email,
    customerName: name || null,
    modalidad,
    subscription,
    briefUrl: link,
  });

  return NextResponse.json({ ok: result.customer, ...result, briefUrl: link });
}

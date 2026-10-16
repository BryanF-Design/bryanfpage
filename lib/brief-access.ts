/**
 * ACCESO A "ARMAR MI BRIEF" (/armar-mi-brief).
 *
 * El brief se abre sólo con un pago confirmado. Hay dos formas de probarlo:
 *
 * 1. La referencia del proveedor (Stripe `session_id`, Mercado Pago
 *    `payment_id` / `preapproval_id`): la página la vuelve a consultar con el
 *    proveedor en /api/order-status.
 * 2. Un enlace firmado (`?acceso=<token>`) para pagos que confirmas a mano
 *    (transferencia) desde /api/admin/confirm-payment. El token lleva el
 *    nombre, correo y monto, firmado con HMAC-SHA256 (BRIEF_LINK_SECRET).
 */

import crypto from "crypto";

import { getSiteUrl } from "./site-url";

export interface BriefAccess {
  reference: string;
  email?: string;
  name?: string;
  amount?: number;
  currency?: string;
  subscription?: boolean;
  /** Vence (epoch ms). */
  exp: number;
}

const TOKEN_DAYS = 90;

function secret(): string {
  const explicit = process.env.BRIEF_LINK_SECRET;
  if (explicit) return explicit;
  // Sin secreto propio se deriva uno de las llaves privadas del servidor
  // (nunca salen al navegador). Configura BRIEF_LINK_SECRET para fijarlo.
  const base = process.env.STRIPE_SECRET || process.env.MP_ACCESS_TOKEN || process.env.GOOGLE_CLIENT_SECRET || "";
  if (!base) throw new Error("BRIEF_LINK_SECRET missing");
  return crypto.createHash("sha256").update(`brief-access:${base}`).digest("hex");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createBriefToken(access: Omit<BriefAccess, "exp"> & { exp?: number }): string {
  const body: BriefAccess = { ...access, exp: access.exp ?? Date.now() + TOKEN_DAYS * 86_400_000 };
  const payload = Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyBriefToken(token: string): BriefAccess | null {
  const [payload, sig] = String(token || "").split(".");
  if (!payload || !sig || payload.length > 2000) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as BriefAccess;
    if (!data.reference || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

/** Enlace a "Armar mi brief" según cómo se pagó. */
export function briefUrl(
  ref:
    | { provider: "stripe"; sessionId: string }
    | { provider: "mercadopago"; paymentId: string }
    | { provider: "mercadopago"; preapprovalId: string }
    | { provider: "link"; token: string }
): string {
  const base = `${getSiteUrl()}/armar-mi-brief`;
  if (ref.provider === "stripe") return `${base}?provider=stripe&session_id=${encodeURIComponent(ref.sessionId)}`;
  if (ref.provider === "link") return `${base}?acceso=${encodeURIComponent(ref.token)}`;
  if ("preapprovalId" in ref) return `${base}?provider=mercadopago&preapproval_id=${encodeURIComponent(ref.preapprovalId)}`;
  return `${base}?provider=mercadopago&payment_id=${encodeURIComponent(ref.paymentId)}`;
}

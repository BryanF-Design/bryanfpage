import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { hasAdminSession } from "@/lib/access-session";
import { INVITE_DAYS, clientSessionConfigured, createInviteToken } from "@/lib/client-session";
import {
  dbConfigured,
  deleteAccount,
  deletePurchase,
  getAccount,
  rpc,
  saveAccount,
  savePurchase,
  type AccountInput,
} from "@/lib/db";
import { clientLoginLink } from "@/lib/email-templates";
import { mailConfigured, notificationEmail, sendMail } from "@/lib/mailer";
import { sendOrderConfirmation } from "@/lib/notify";
import { MIN_PASSWORD, generatePassword, hashPassword } from "@/lib/password";
import { normalizeSettings } from "@/lib/seasons";
import { SETTINGS_TAG } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const KINDS = ["suscripcion", "compra", "transferencia", "manual"] as const;
const STATES = ["activa", "pausada", "cancelada"] as const;

type Body = Record<string, unknown>;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 * API del Panel BryanF (/admin). Solo con la sesión del panel (cookie) y
 * desde el mismo sitio. Un solo endpoint con `action`:
 *  settings.save · account.save · account.delete · account.password ·
 *  account.invite · purchase.add · purchase.delete
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  if (!hasAdminSession(req)) return fail("Tu sesión del panel terminó. Vuelve a entrar.", 401);
  if (!rateLimit(`admin-panel:${getClientIp(req)}`, { limit: 120, windowMs: 10 * 60 * 1000 }).ok) return tooManyRequests();
  if (!dbConfigured()) return fail("La base de datos no está configurada (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SITIO_DB_KEY).", 503);

  const body = (await req.json().catch(() => ({}))) as Body;
  try {
    switch (body.action) {
      case "settings.save":
        return await saveSettings(body);
      case "account.save":
        return await saveAccountAction(body);
      case "account.delete": {
        const email = text(body.email, 160)?.toLowerCase() || "";
        if (!EMAIL.test(email)) return fail("Correo inválido.");
        await deleteAccount(email);
        return NextResponse.json({ ok: true });
      }
      case "account.password":
        return await setPassword(body);
      case "account.invite":
        return await invite(body);
      case "purchase.add":
        return await addPurchase(body);
      case "purchase.delete": {
        const id = text(body.id, 200);
        if (!id) return fail("Falta el pago.");
        await deletePurchase(id);
        return NextResponse.json({ ok: true });
      }
      default:
        return fail("Acción desconocida.");
    }
  } catch (error) {
    console.error("Panel BryanF:", error);
    return fail(error instanceof Error ? error.message : "No se pudo guardar.", 500);
  }
}

async function saveSettings(body: Body) {
  const settings = normalizeSettings(body.settings);
  await rpc("ajuste_guardar", { clave: "sitio", valor: settings });
  // Temporada, descuentos y avisos se ven al instante en todo el sitio.
  revalidateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, settings });
}

async function saveAccountAction(body: Body) {
  const raw = (body.account || {}) as Body;
  const email = text(raw.email, 160)?.toLowerCase() || "";
  if (!EMAIL.test(email)) return fail("Escribe un correo válido.");
  const tipo = KINDS.find((k) => k === raw.tipo);
  const estado = STATES.find((k) => k === raw.estado);
  const monto = Number(raw.monto);
  const next = text(raw.proximo_cobro, 40);
  const input: AccountInput = {
    email,
    nombre: text(raw.nombre, 120),
    telefono: text(raw.telefono, 40),
    empresa: text(raw.empresa, 120),
    servicio: text(raw.servicio, 160),
    notas: text(raw.notas, 2000),
    moneda: raw.moneda === "USD" ? "USD" : raw.moneda === "MXN" ? "MXN" : undefined,
    ...(tipo ? { tipo } : {}),
    ...(estado ? { estado } : {}),
    ...(Number.isFinite(monto) && monto >= 0 ? { monto } : {}),
    // "" borra la fecha; una fecha AAAA-MM-DD es el próximo cobro (mediodía CDMX).
    ...(next !== undefined
      ? { proximo_cobro: next ? new Date(next.length === 10 ? `${next}T12:00:00-06:00` : next).toISOString() : null }
      : {}),
  };
  const account = await saveAccount(input);
  return NextResponse.json({ ok: true, account });
}

async function setPassword(body: Body) {
  const email = text(body.email, 160)?.toLowerCase() || "";
  if (!EMAIL.test(email)) return fail("Correo inválido.");
  const given = typeof body.password === "string" ? body.password : "";
  if (given && given.length < MIN_PASSWORD) return fail(`La contraseña necesita al menos ${MIN_PASSWORD} caracteres.`);
  const password = given || generatePassword();
  const existing = await getAccount(email);
  await saveAccount({ email, ...(existing ? {} : { tipo: "manual" as const }), password_hash: hashPassword(password) });
  // Se devuelve una sola vez para que Bryan se la pase al cliente.
  return NextResponse.json({ ok: true, password });
}

async function invite(body: Body) {
  const email = text(body.email, 160)?.toLowerCase() || "";
  if (!EMAIL.test(email)) return fail("Correo inválido.");
  if (!clientSessionConfigured()) return fail("Falta CLIENT_SESSION_SECRET (o ADMIN_SESSION_SECRET) para firmar el acceso.", 503);
  if (!mailConfigured()) return fail("El correo no está configurado (Gmail API o Resend).", 503);
  const account = await getAccount(email);
  const password = typeof body.password === "string" && body.password ? body.password : null;
  const url = `${getSiteUrl()}/api/mi-panel/verify?t=${encodeURIComponent(createInviteToken(email))}`;
  const content = clientLoginLink({
    url,
    validFor: `${INVITE_DAYS} días`,
    welcome: { name: account?.nombre, password },
  });
  const sent = await sendMail({ to: email, ...content, replyTo: notificationEmail() });
  if (!sent.ok) return fail(`No se pudo enviar: ${sent.error || "error del correo"}`, 502);
  return NextResponse.json({ ok: true });
}

async function addPurchase(body: Body) {
  const email = text(body.email, 160)?.toLowerCase() || "";
  if (!EMAIL.test(email)) return fail("Escribe un correo válido.");
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return fail("Escribe un monto mayor a cero.");
  const currency = body.currency === "USD" ? "USD" : "MXN";
  const description = text(body.description, 200) || "Proyecto web";
  const name = text(body.name, 120) || "";
  const reference = text(body.reference, 80) || `panel-${Date.now().toString(36)}`;
  const at = text(body.date, 40);

  if (body.sendReceipt === true) {
    // Comprobante + aviso + cuenta (sendOrderConfirmation registra la compra).
    const result = await sendOrderConfirmation({
      provider: "transfer",
      amount,
      currency,
      reference,
      description,
      customerEmail: email,
      customerName: name || null,
      modalidad: text(body.modalidad, 20) || "liquidacion",
    });
    return NextResponse.json({ ok: true, ...result });
  }

  await savePurchase({
    id: `transfer:${reference}`,
    email,
    nombre: name,
    proveedor: "transferencia",
    descripcion: description,
    monto: amount,
    moneda: currency,
    ...(at ? { creada: new Date(at.length === 10 ? `${at}T12:00:00-06:00` : at).toISOString() } : {}),
  });
  const existing = await getAccount(email);
  if (!existing) await saveAccount({ email, nombre: name, tipo: "transferencia", servicio: description });
  return NextResponse.json({ ok: true });
}

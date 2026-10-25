import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { CLIENT_COOKIE, readClientSession } from "@/lib/client-session";
import { dbConfigured, getAccount, saveAccount } from "@/lib/db";
import { MIN_PASSWORD, hashPassword } from "@/lib/password";

export const runtime = "nodejs";

/** Desde Mi panel (con sesión): crear o cambiar la contraseña. */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  if (!rateLimit(`mi-panel-setpass:${getClientIp(req)}`, { limit: 6, windowMs: 15 * 60 * 1000 }).ok) return tooManyRequests();
  const email = readClientSession(req.cookies.get(CLIENT_COOKIE)?.value);
  if (!email) return NextResponse.json({ error: "Tu sesión terminó. Vuelve a entrar." }, { status: 401 });
  if (!dbConfigured()) return NextResponse.json({ error: "No disponible por ahora." }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < MIN_PASSWORD || password.length > 200) {
    return NextResponse.json({ error: `Usa al menos ${MIN_PASSWORD} caracteres.` }, { status: 400 });
  }
  const existing = await getAccount(email).catch(() => null);
  await saveAccount({
    email,
    // Un suscriptor de Stripe / Mercado Pago aún no tenía cuenta en la base.
    ...(existing ? {} : { tipo: "suscripcion" as const }),
    password_hash: hashPassword(password),
  });
  return NextResponse.json({ ok: true });
}

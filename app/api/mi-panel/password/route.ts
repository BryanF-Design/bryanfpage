import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { CLIENT_COOKIE, CLIENT_MAX_AGE, clientSessionConfigured, createClientSession } from "@/lib/client-session";
import { dbConfigured, getAccount, saveAccount } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Entrar a Mi panel con correo y contraseña (la pone el cliente o Bryan). */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  if (!rateLimit(`mi-panel-pass:${getClientIp(req)}`, { limit: 8, windowMs: 15 * 60 * 1000 }).ok) return tooManyRequests();
  if (!clientSessionConfigured() || !dbConfigured()) {
    return NextResponse.json({ error: "El acceso con contraseña aún no está disponible. Usa el enlace por correo." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
  const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  if (!EMAIL.test(email) || !password) {
    return NextResponse.json({ error: "Escribe tu correo y tu contraseña." }, { status: 400 });
  }
  if (!rateLimit(`mi-panel-pass:${email}`, { limit: 6, windowMs: 15 * 60 * 1000 }).ok) return tooManyRequests();

  const account = await getAccount(email).catch(() => null);
  if (!account || !verifyPassword(password, account.password_hash)) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }
  await saveAccount({ email, ultimo_acceso: new Date().toISOString() }).catch(() => null);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CLIENT_COOKIE, createClientSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CLIENT_MAX_AGE,
  });
  return res;
}

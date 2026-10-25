import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  accessConfigured,
  checkCredentials,
  createSessionToken,
} from "@/lib/access-session";

export const runtime = "nodejs";

/** Inicio de sesión de Panel BryanF (/admin). */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  // Pocos intentos por IP: frena a quien quiera adivinar la contraseña.
  const { ok } = rateLimit(`access-login:${getClientIp(req)}`, { limit: 6, windowMs: 15 * 60 * 1000 });
  if (!ok) return tooManyRequests();

  if (!accessConfigured()) {
    return NextResponse.json(
      { error: "El panel está apagado: falta ADMIN_PASSWORD (mínimo 12 caracteres) en Vercel." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const user = typeof body.user === "string" ? body.user.slice(0, 80) : "";
  const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  if (!checkCredentials(user, password)) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  return res;
}

import { NextRequest, NextResponse } from "next/server";

import { CLIENT_COOKIE, CLIENT_MAX_AGE, createClientSession, readLoginToken } from "@/lib/client-session";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

/** El enlace del correo: abre la sesión y lleva a Mi panel. */
export async function GET(req: NextRequest) {
  const email = readLoginToken(req.nextUrl.searchParams.get("t"));
  const site = getSiteUrl();
  if (!email) return NextResponse.redirect(`${site}/mi-panel?e=enlace`, 303);

  const res = NextResponse.redirect(`${site}/mi-panel`, 303);
  res.cookies.set(CLIENT_COOKIE, createClientSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CLIENT_MAX_AGE,
  });
  return res;
}

import { NextRequest, NextResponse } from "next/server";

import { forbidden, isSameOrigin } from "@/lib/api-guard";
import { CLIENT_COOKIE } from "@/lib/client-session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CLIENT_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}

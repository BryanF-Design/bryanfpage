import { NextRequest, NextResponse } from "next/server";

import { forbidden, isSameOrigin } from "@/lib/api-guard";
import { ACCESS_COOKIE } from "@/lib/access-session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}

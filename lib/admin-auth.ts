import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoints de administración (/api/admin/*): sólo con
 * `Authorization: Bearer <ADMIN_API_KEY>`. Sin la variable, están apagados.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const key = process.env.ADMIN_API_KEY || "";
  if (key.length < 24) {
    return NextResponse.json({ error: "ADMIN_API_KEY no configurada (mínimo 24 caracteres)" }, { status: 503 });
  }
  const given = Buffer.from(req.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${key}`);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

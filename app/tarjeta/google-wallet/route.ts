import { NextResponse, type NextRequest } from "next/server";

import { getClientIp, rateLimit } from "@/lib/api-guard";
import { createSaveUrl } from "@/lib/google-wallet";

// Cada visita crea un pase nuevo: no se puede cachear.
export const dynamic = "force-dynamic";

/** "Agregar a Google Wallet": crea el pase y manda a la pantalla de Google. */
export async function GET(req: NextRequest) {
  const { ok } = rateLimit(`wallet:${getClientIp(req)}`, { limit: 10, windowMs: 60_000 });
  if (!ok) return new NextResponse("Demasiadas solicitudes", { status: 429 });

  try {
    const saveUrl = await createSaveUrl();
    if (saveUrl) return NextResponse.redirect(saveUrl, 302);
  } catch (error) {
    console.error("[google-wallet]", error);
  }
  // Sin configurar o con error: de vuelta a la tarjeta, donde está el QR.
  return NextResponse.redirect(new URL("/tarjeta?wallet=error", req.url), 302);
}

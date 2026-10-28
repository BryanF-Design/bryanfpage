import QRCode from "qrcode";

import { QR_OPTIONS, buildQrVCard } from "@/lib/contact-card";

// PNG del QR de contacto para guardarlo en Google Wallet (Agregar a Wallet →
// Foto) o mandarlo por chat. Se genera una vez en el build.
export const dynamic = "force-static";

export async function GET() {
  const png = await QRCode.toBuffer(buildQrVCard(), {
    ...QR_OPTIONS,
    type: "png",
    width: 1024,
    margin: 4,
    color: { dark: "#101e19", light: "#ffffff" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'inline; filename="QR-contacto-Bryan-F.png"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}

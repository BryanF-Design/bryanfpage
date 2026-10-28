import { readFile } from "node:fs/promises";
import path from "node:path";

import { CARD, buildVCard } from "@/lib/contact-card";

// Se genera una sola vez en el build: la foto se lee de /public mientras el
// sistema de archivos del proyecto existe y el .vcf queda como archivo estático.
export const dynamic = "force-static";

export async function GET() {
  let photo: string | undefined;
  try {
    const file = await readFile(path.join(process.cwd(), "public", CARD.photo.src));
    photo = file.toString("base64");
  } catch {
    // Sin foto el contacto se guarda igual.
  }

  return new Response(buildVCard(photo), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Bryan-F-BryanF-Design.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { LuminaPage } from "@/components/pages/lumina-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/lumina",
  title: "Lumina, la asesora IA de BryanF Design",
  description:
    "Pregúntale a Lumina por precios, tiempos o lo que necesita tu web. Te contesta al momento, te enseña proyectos reales y te deja la cotización lista."
});

export default function Page() {
  return <LuminaPage />;
}

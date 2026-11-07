import { CasosPage } from "@/components/pages/casos-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/casos",
  title: "Casos de estudio | BryanF Design",
  description:
    "Casos de estudio de BryanF Design: el problema, la decisión de diseño y el resultado de proyectos reales como Koi Arquitectura y NKMOH Café.",
});

export default function Page() {
  return <CasosPage />;
}

import { CasosPage } from "@/components/pages/casos-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/casos",
  title: "Casos de estudio de diseño web | BryanF Design",
  description:
    "Cómo resolví proyectos reales de diseño y desarrollo web, como Koi Arquitectura y NKMOH Café: el problema, la decisión de diseño y el resultado."
});

export default function Page() {
  return <CasosPage />;
}

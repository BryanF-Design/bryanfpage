import { ConocemePage } from "@/components/pages/conoceme-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/conoceme",
  title: "Conoce a Bryan, fundador de BryanF Design",
  description:
    "Soy Bryan, diseñador y desarrollador web en la CDMX. Te cuento cómo trabajo, qué me mueve y con qué tecnologías hago cada sitio."
});

export default function Page() {
  return <ConocemePage />;
}

import { ConocemePage } from "@/components/pages/conoceme-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/conoceme",
  title: "Conoce a Bryan, fundador de BryanF Design",
  description:
    "Bryan F. diseña la experiencia y también escribe el código. Su historia, su forma de trabajar y las tecnologías con las que construye cada web.",
});

export default function Page() {
  return <ConocemePage />;
}

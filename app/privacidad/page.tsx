import { PrivacidadPage } from "@/components/pages/privacidad-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/privacidad",
  title: "Aviso de Privacidad | BryanF Design",
  description: "Qué datos personales uso en BryanF Design, para qué, con quién los comparto y cómo ejercer tus derechos ARCO.",
});

export default function Page() {
  return <PrivacidadPage />;
}

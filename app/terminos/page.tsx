import { TerminosPage } from "@/components/pages/terminos-page";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  path: "/terminos",
  title: "Términos y Condiciones | BryanF Design",
  description: "Qué servicios ofrezco, cómo se paga (Stripe, Mercado Pago o SPEI), reembolsos y responsabilidades al trabajar con BryanF Design.",
});

export default function Page() {
  return <TerminosPage />;
}

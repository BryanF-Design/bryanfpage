import type { Metadata } from "next";

import { SubscriptionPage } from "@/components/subscription-page";

export const metadata: Metadata = {
  title: "Suscripción de diseño web: $7,000 MXN al mes | BryanF Design",
  description:
    "Todo lo digital de tu negocio por $7,000 MXN al mes: páginas web, cambios ilimitados, tarjetas digitales, firmas, gráficos y SEO. Entregas en 1 a 2 días hábiles. Sin plazo forzoso.",
  alternates: { canonical: "/suscripcion" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://www.bryanfdesign.com/suscripcion",
    siteName: "BryanF Design",
    title: "Suscripción Todo Digital: $7,000 MXN al mes | BryanF Design",
    description: "Páginas web, cambios ilimitados, tarjetas digitales y más, por una cuota mensual.",
    images: [{ url: "/img/og-bryanf-apex.png", width: 1200, height: 630, alt: "BryanF Design" }],
  },
};

export default function SuscripcionPage() {
  return <SubscriptionPage />;
}

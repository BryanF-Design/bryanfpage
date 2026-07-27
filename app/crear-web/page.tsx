import type { Metadata } from "next";

import { CrearWebExperience } from "@/components/crear-web-experience";

export const metadata: Metadata = {
  title: "Cotiza y paga tu web en línea | BryanF Design",
  description:
    "Arma tu página web, suma los módulos que necesites y paga en línea con tarjeta, Mercado Pago o transferencia. Precios transparentes, sin sorpresas. Desde $3,500 MXN.",
  alternates: { canonical: "/crear-web" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://www.bryanfdesign.com.mx/crear-web",
    siteName: "BryanF Design",
    title: "Cotiza y paga tu web en línea | BryanF Design",
    description:
      "Arma tu página web, elige módulos y paga en línea. Precios transparentes, sin sorpresas.",
    images: [
      {
        url: "/img/og-bryanf-apex.png",
        width: 1200,
        height: 630,
        alt: "BryanF Design — Haz que pase. Precisión, ritmo y conexión.",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function CrearWebPage() {
  return <CrearWebExperience />;
}

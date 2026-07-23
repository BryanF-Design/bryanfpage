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
        url: "/img/logotipo-blanco.png",
        width: 2904,
        height: 1016,
        alt: "BryanF Design",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function CrearWebPage() {
  return <CrearWebExperience />;
}

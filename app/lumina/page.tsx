import type { Metadata } from "next";

import { LuminaExperience } from "@/components/lumina-experience";

export const metadata: Metadata = {
  title: "Lumina, asesora IA de BryanF Design | Cotiza tu web en minutos",
  description:
    "Lumina es la asesora IA del sitio: te cotiza tu página web, arma tu paquete en el cotizador, te enseña proyectos como el tuyo y te lleva a donde necesitas.",
  alternates: { canonical: "/lumina" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://www.bryanfdesign.com/lumina",
    siteName: "BryanF Design",
    title: "Lumina, asesora IA | BryanF Design",
    description: "Te cotiza, arma tu paquete y te guía por el sitio.",
    images: [{ url: "/img/og-bryanf-apex.png", width: 1200, height: 630, alt: "BryanF Design" }],
  },
};

export default function LuminaPage() {
  return <LuminaExperience />;
}

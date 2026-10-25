import type { Metadata } from "next";

import { AboutExperience } from "@/components/about-experience";

export const metadata: Metadata = {
  title: "Conoce a Bryan F. | Diseñador y desarrollador web | BryanF Design",
  description:
    "Soy Bryan: diseño y programo cada sitio de BryanF Design. Conoce mi historia, mi proceso de trabajo, las herramientas que uso, casos de estudio y clientes.",
  alternates: { canonical: "/conoce-a-bryan" },
  openGraph: {
    type: "profile",
    locale: "es_MX",
    url: "https://www.bryanfdesign.com/conoce-a-bryan",
    siteName: "BryanF Design",
    title: "Conoce a Bryan F. | BryanF Design",
    description: "Diseño con autoría: la persona que escucha tu idea diseña la experiencia y escribe el código.",
    images: [{ url: "/img/og-bryanf-apex.png", width: 1200, height: 630, alt: "BryanF Design" }],
  },
};

export default function ConoceABryanPage() {
  return <AboutExperience />;
}

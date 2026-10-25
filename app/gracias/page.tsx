import type { Metadata } from "next";

import { GraciasExperience } from "@/components/gracias-experience";

export const metadata: Metadata = {
  title: "Gracias por tu compra | BryanF Design",
  description: "Confirma tu pago y completa tu briefing para arrancar tu proyecto web.",
  alternates: { canonical: "/gracias" },
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return <GraciasExperience />;
}

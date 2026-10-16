import type { Metadata } from "next";

import { ArmarBriefExperience } from "@/components/armar-brief-experience";

export const metadata: Metadata = {
  title: "Armar mi brief | BryanF Design",
  description: "Cuéntanos de tu negocio y tu proyecto para arrancar. Se abre al confirmar tu pago.",
  alternates: { canonical: "/armar-mi-brief" },
  robots: { index: false, follow: false },
};

export default function ArmarMiBriefPage() {
  return <ArmarBriefExperience />;
}

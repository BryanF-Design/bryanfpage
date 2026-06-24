"use client";

import { ClipboardList, PenTool, Code2, Sparkles, Rocket } from "lucide-react";

import RadialOrbitalTimeline, {
  type TimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { SectionHeading } from "@/components/sections/section-heading";

const proceso: TimelineItem[] = [
  {
    id: 1,
    title: "Brief",
    date: "Día 1",
    content:
      "Entendemos tu negocio, tus objetivos y a quién le hablas. Definimos el alcance y la estrategia de conversión.",
    category: "Estrategia",
    icon: ClipboardList,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Diseño",
    date: "Día 2–4",
    content:
      "UX/UI a medida: jerarquía, identidad y prototipo. Diseñamos para que se vea increíble y guíe a la acción.",
    category: "Diseño",
    icon: PenTool,
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Desarrollo",
    date: "Día 4–8",
    content:
      "Código rápido y limpio, responsive y optimizado para Core Web Vitals. Integraciones y pagos cuando los necesitas.",
    category: "Desarrollo",
    icon: Code2,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 65,
  },
  {
    id: 4,
    title: "Animación",
    date: "Día 8–10",
    content:
      "Motion con GSAP y micro-interacciones que dan vida al sitio sin sacrificar el rendimiento en ningún dispositivo.",
    category: "Motion",
    icon: Sparkles,
    relatedIds: [3, 5],
    status: "pending",
    energy: 35,
  },
  {
    id: 5,
    title: "Lanzamiento",
    date: "Día 10+",
    content:
      "SEO técnico, despliegue y medición. Te entregamos un sitio listo para vender y para crecer contigo.",
    category: "Lanzamiento",
    icon: Rocket,
    relatedIds: [4],
    status: "pending",
    energy: 15,
  },
];

export function ProcessOrbital() {
  return (
    <section
      id="proceso"
      aria-label="Nuestro proceso"
      className="relative border-t border-border py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Un proceso claro, de la idea al lanzamiento"
          subtitle="Toca cada paso para ver qué pasa en cada etapa. Sin humo: entregas que inician desde 3 días hábiles."
        />
      </div>
      <RadialOrbitalTimeline timelineData={proceso} />
    </section>
  );
}

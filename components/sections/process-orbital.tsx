import { FileSpreadsheet, ClipboardList, Code2, Rocket, LifeBuoy } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";

interface Step {
  title: string;
  content: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    title: "Cotización",
    content: "Te compartimos una propuesta clara: alcance, tiempos y precio. Sin letras chiquitas.",
    icon: FileSpreadsheet,
  },
  {
    title: "Brief",
    content: "Entendemos tu negocio, tus objetivos y a quién le hablas. Definimos estrategia y contenido.",
    icon: ClipboardList,
  },
  {
    title: "Desarrollo",
    content: "Diseño UX/UI y código rápido y limpio: responsive, animado y optimizado para Core Web Vitals.",
    icon: Code2,
  },
  {
    title: "Lanzamiento",
    content: "SEO técnico, despliegue y medición. Tu sitio queda listo para vender desde el día uno.",
    icon: Rocket,
  },
  {
    title: "Seguimiento",
    content:
      "1 mes de seguimiento post-entrega y acceso a Access BryanF, tu panel técnico, para asegurar el correcto funcionamiento del sitio.",
    icon: LifeBuoy,
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
          subtitle="Sin humo: entregas que inician desde 3 días hábiles, con acompañamiento después de lanzar."
        />

        <ol className="relative mx-auto mt-16 grid max-w-5xl gap-10 md:mt-24 md:grid-cols-5 md:gap-6">
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-px bg-border md:bottom-auto md:left-[10%] md:right-[10%] md:top-6 md:h-px md:w-auto"
          />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative flex gap-5 md:flex-col md:items-center md:gap-4 md:text-center"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/50 bg-card text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="pb-2 md:px-2">
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

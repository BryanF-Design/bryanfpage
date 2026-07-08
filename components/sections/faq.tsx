"use client";

import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";

const WHATSAPP = "https://wa.me/525663012505";

const items = [
  {
    id: "1",
    title: "¿Cuáles son los tiempos de entrega?",
    content:
      "Los tiempos de entrega empiezan desde 3 días una vez que nos hayas proporcionado la información completa de tu empresa.",
  },
  {
    id: "2",
    title: "¿Cuántos cambios puedo pedir?",
    content:
      "En BryanF Design no manejamos un límite de cambios. La satisfacción total del cliente es lo más importante para entregar un producto de calidad.",
  },
  {
    id: "3",
    title: "¿Cuál es su horario de atención?",
    content:
      "Nuestro horario es de Lunes a Viernes de 9:00 AM a 7:00 PM, hora de Ciudad de México (CDMX).",
  },
  {
    id: "4",
    title: "¿Cuáles son los costos?",
    content:
      "Los costos empiezan a partir de los $3,500 MXN y pueden variar dependiendo de las necesidades específicas de tu proyecto.",
  },
  {
    id: "5",
    title: "¿Qué se necesita para empezar?",
    content:
      "La información general de tu empresa, una breve llamada para recopilar requerimientos clave y un 50% de anticipo. El otro 50% se liquida al entregar y aprobar el proyecto.",
  },
  {
    id: "6",
    title: "¿Qué se me entrega al final?",
    content:
      "Los accesos totales a la página web y a los correos (en caso de haberse creado), además de una capacitación breve, de no más de 30 minutos, para el manejo básico de tu sitio.",
  },
  {
    id: "7",
    title: "¿Qué incluye trabajar juntos?",
    content:
      "Dominio y host gratuito por un año, correos ilimitados (1 GB cada uno), un diseño completamente personalizado y la satisfacción de un producto final garantizado.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-a opacity-40" />
      <div className="container relative">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Lo que necesitas saber"
          subtitle="Toca una pregunta para ver la respuesta."
        />

        <div className="glass mx-auto mt-14 w-full max-w-3xl rounded-3xl px-4 md:px-8">
          <Accordion type="single" defaultValue="1" collapsible className="w-full">
            {items.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="last:border-b"
              >
                <AccordionTrigger className="-space-y-6 overflow-hidden pl-2 text-left text-foreground/20 duration-200 hover:no-underline data-[state=open]:space-y-0 data-[state=open]:text-primary md:pl-6 [&>svg]:hidden">
                  <div className="flex flex-1 items-start gap-4">
                    <span className="pt-1 font-mono text-xs">{item.id}</span>
                    <h3 className="font-display text-2xl uppercase tracking-tight md:text-4xl">
                      {item.title}
                    </h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="max-w-xl pb-6 pl-8 text-base text-muted-foreground md:pl-12">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No encontraste tu respuesta? Escríbenos y lo platicamos.
          </p>
          <Button asChild size="lg">
            <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Mandar WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

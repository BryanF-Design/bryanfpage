"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { useLanguage } from "@/lib/i18n/context";

/**
 * Puerta de entrada de la escalera de valor: productos de bajo costo y
 * entrega rápida (tarjetas, firma, kit, landing) para quien todavía no
 * necesita el sitio completo del Configurador. Cada tarjeta abre el chat de
 * Lumina con la pregunta ya escrita — mismo patrón que las preguntas rápidas
 * de la sección de Lumina, sin duplicar el flujo de pago del Configurador.
 */
export function EntryServices() {
  const { t } = useLanguage();

  return (
    <section
      id="servicios-entrada"
      aria-label={t.entryServices.title}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-40" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.entryServices.eyebrow}
          title={t.entryServices.title}
          subtitle={t.entryServices.subtitle}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.entryServices.items.map((item) => (
            <div
              key={item.id}
              className="glass elevate flex flex-col gap-4 rounded-lg p-6"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 font-mono text-xl font-medium text-primary">
                  {item.price}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <ul className="flex flex-1 flex-col gap-2">
                {item.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openLuminaChat(item.question)}
                className="mt-2 w-full"
              >
                {t.entryServices.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          {t.entryServices.note}
        </p>
      </div>
    </section>
  );
}

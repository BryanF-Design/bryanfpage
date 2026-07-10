"use client";

import { FileSpreadsheet, ClipboardList, Code2, Rocket, LifeBuoy } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";

const ICONS = [FileSpreadsheet, ClipboardList, Code2, Rocket, LifeBuoy];

export function ProcessOrbital() {
  const { t } = useLanguage();
  const steps = t.process.steps.map((step, i) => ({ ...step, icon: ICONS[i] }));

  return (
    <section
      id="proceso"
      aria-label="Nuestro proceso"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-70" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          subtitle={t.process.subtitle}
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
                <div className="glass elevate corner-ticks relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="pb-2 md:px-2">
                  <span className="font-mono text-xs tracking-[0.18em] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">
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

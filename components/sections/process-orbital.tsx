"use client";

import type { CSSProperties } from "react";
import { ArrowRight, ClipboardList, Code2, FileSpreadsheet, LifeBuoy, Rocket } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const ICONS = [FileSpreadsheet, ClipboardList, Code2, Rocket, LifeBuoy];

/**
 * 工程 — el proceso.
 *
 * Los cinco pasos son una secuencia de verdad, así que entran como un tren:
 * uno detrás de otro desde fuera del lienzo, en el orden en que ocurren. Entre
 * ficha y ficha, un nodo washi cruza la costura y marca el paso siguiente.
 */
export function ProcessOrbital() {
  const { t } = useLanguage();
  const steps = t.process.steps.map((step, index) => ({
    ...step,
    icon: ICONS[index],
  }));

  return (
    <section
      id="proceso"
      aria-label={t.process.title}
      className="relative flex flex-col gap-gutter"
    >
      <div data-fx="panel">
        <div className="panel relative grid gap-10 overflow-hidden p-6 pb-20 md:p-10 md:pb-20 lg:grid-cols-12 lg:items-end lg:p-12">
          <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-30 [mask-image:linear-gradient(90deg,transparent,black)]" />
          <SectionHeading
            eyebrow={t.process.eyebrow}
            title={t.process.title}
            subtitle={t.process.subtitle}
            chapter={{ kanji: "工程", romaji: "kōtei", index: 4 }}
            size="xl"
            className="relative lg:col-span-9"
          />
          <span
            aria-hidden
            lang="ja"
            className="drift-y pointer-events-none relative hidden select-none justify-self-end font-jp text-[9rem] leading-none text-primary/15 lg:col-span-3 lg:block"
          >
            工程
          </span>
          <div className="notch notch-br">
            <span className="tag-pill pl-4">
              01
              <ArrowRight aria-hidden className="h-3.5 w-3.5 text-primary" />
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <ol className="relative grid gap-gutter sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.title}
              data-fx="right"
              style={{ "--fx-delay": `${index * 95}ms` } as CSSProperties}
              className={cn("relative min-w-0", isLast && "sm:col-span-2 lg:col-span-1")}
            >
              <div
                className={cn(
                  "panel group relative flex h-full min-h-[19rem] flex-col overflow-hidden p-6 transition-transform duration-500 [transition-timing-function:var(--ease-material)] hover:-translate-y-1.5 md:min-h-[23rem] md:p-7",
                  isLast ? "panel-lime" : index % 2 === 1 ? "panel-moss" : ""
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "display-xl text-[5.5rem] leading-[0.78] transition-colors duration-300 md:text-[6.5rem]",
                      isLast ? "text-foreground" : "text-foreground/15 group-hover:text-primary"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:rotate-12 group-hover:scale-110",
                      isLast
                        ? "bg-[hsl(150_42%_6%)] text-[hsl(76_76%_58%)]"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>

                <h3 className="display-xl mt-auto pt-10 text-[2.3rem] text-foreground md:text-[2.6rem]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.content}
                </p>
              </div>

              {/* Nodo de paso: cruza la costura hacia la ficha siguiente. */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute -right-[calc(var(--gutter)/2)] top-1/2 z-20 hidden size-9 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-sheet p-1 lg:grid"
                >
                  <span className="grid size-full place-items-center rounded-full bg-background text-primary">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

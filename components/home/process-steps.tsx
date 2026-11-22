"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, MessageCircle, PenTool, Rocket } from "lucide-react";

import { GestureIcon, type Gesture } from "@/components/ui/gesture-icon";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const STEPS: { icon: typeof Code2; gesture: Gesture }[] = [
  { icon: MessageCircle, gesture: "heart" },
  { icon: PenTool, gesture: "design" },
  { icon: Code2, gesture: "code" },
  { icon: Rocket, gesture: "rocket" },
];

/**
 * Prompt 6 · Proceso en 4 pasos, una línea cada uno, sin infografía.
 * Desde lg (patrón 3 del informe de inmersión, "secciones fijas"): a la
 * izquierda una tarjeta fija (CSS sticky, sin costo en el hilo principal)
 * muestra el paso que se está leyendo; a la derecha los pasos avanzan con el
 * scroll y el activo se enciende (IntersectionObserver). En teléfono, la
 * lista simple con número gigante en lima. El detalle vive en /conoceme.
 */
export function ProcessSteps() {
  const { t } = useLanguage();
  const p = t.v2.process;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = p.steps[active] ?? p.steps[0];
  const CurrentIcon = (STEPS[active] ?? STEPS[0]).icon;

  return (
    <section id="proceso" aria-labelledby="proceso-title" className="panel px-5 py-10 shadow-soft sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 id="proceso-title" className="display-xl max-w-[16ch] text-balance text-[clamp(2.25rem,4.6vw,4rem)] leading-[0.98] text-ink">
          {p.title}
        </h2>
        <Link href="/conoceme#proceso" className="nav-underline relative inline-flex min-h-11 shrink-0 items-center gap-2 px-4 font-semibold text-ink">
          {p.more}
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Tarjeta fija (solo lg): el paso que se está leyendo. */}
        <div aria-hidden className="hidden lg:col-span-5 lg:block">
          <div className="panel-ink sticky top-28 overflow-hidden rounded-card p-8">
            <div className="flex items-start justify-between gap-4">
              <span key={`n${active}`} className="process-swap display-xl text-[8rem] leading-[0.8] text-lime">
                {active + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-full bg-lime text-ink">
                <CurrentIcon className="h-6 w-6" />
              </span>
            </div>
            <p key={`t${active}`} className="process-swap mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-white">
              {current.title}
            </p>
            <p key={`l${active}`} className="process-swap mt-2 text-lg text-white/75">
              {current.line}
            </p>
            <div className="mt-8 flex gap-2">
              {p.steps.map((s, i) => (
                <span key={s.title} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i <= active ? "bg-lime" : "bg-white/15")} />
              ))}
            </div>
          </div>
        </div>

        <ol className="offcanvas-clip grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1 lg:gap-y-6">
          {p.steps.map((step, i) => {
            const { icon: Icon, gesture } = STEPS[i] ?? STEPS[0];
            return (
              <li
                key={step.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-step={i}
                data-gesture-host
                className={cn(
                  "reveal reveal-left group relative flex flex-col gap-3 border-t border-ink/10 pt-5 transition-opacity duration-300 lg:min-h-[13rem] lg:rounded-card lg:border-0 lg:p-7 lg:ring-1 lg:ring-inset",
                  i === active ? "lg:bg-mint lg:opacity-100 lg:ring-ink/10" : "lg:opacity-60 lg:ring-transparent"
                )}
                style={{ "--stagger": i, "--rx": "-48px" } as CSSProperties}
              >
                <div className="flex items-end justify-between gap-3">
                  <span aria-hidden className="display-xl text-[clamp(4.5rem,8vw,7rem)] leading-[0.8] text-lime [-webkit-text-stroke:0.012em_hsl(var(--ink))] [paint-order:stroke_fill] lg:text-[4rem]">
                    {i + 1}
                  </span>
                  <span className="grid size-11 place-items-center rounded-full bg-ink text-lime">
                    <GestureIcon gesture={gesture}>
                      <Icon aria-hidden className="h-5 w-5" />
                    </GestureIcon>
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                  <span className="sr-only">{i + 1}. </span>
                  {step.title}
                </h3>
                <p className="text-[0.975rem] leading-relaxed text-ink/70">{step.line}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

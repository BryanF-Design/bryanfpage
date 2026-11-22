"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, MessageCircle, PenTool, Rocket } from "lucide-react";

import { GestureIcon, type Gesture } from "@/components/ui/gesture-icon";
import { useLanguage } from "@/lib/i18n/context";

const STEPS: { icon: typeof Code2; gesture: Gesture }[] = [
  { icon: MessageCircle, gesture: "heart" },
  { icon: PenTool, gesture: "design" },
  { icon: Code2, gesture: "code" },
  { icon: Rocket, gesture: "rocket" },
];

/**
 * Prompt 6 · Proceso en 4 pasos, una línea cada uno. Sin infografía: número
 * de paso en Fraunces gigante en lima, tipografía grande y aire. Los pasos
 * entran escalonados de izquierda a derecha, una sola vez; al pasar el
 * cursor, el icono de cada paso hace su gesto. El detalle vive en /conoceme.
 */
export function ProcessSteps() {
  const { t } = useLanguage();
  const p = t.v2.process;

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
      <ol className="offcanvas-clip mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {p.steps.map((step, i) => {
          const { icon: Icon, gesture } = STEPS[i] ?? STEPS[0];
          return (
            <li
              key={step.title}
              data-gesture-host
              className="reveal reveal-left group relative flex flex-col gap-3 border-t border-ink/10 pt-5"
              style={{ "--stagger": i, "--rx": "-48px" } as CSSProperties}
            >
              <div className="flex items-end justify-between gap-3">
                <span aria-hidden className="display-xl text-[clamp(4.5rem,8vw,7rem)] leading-[0.8] text-lime [-webkit-text-stroke:0.012em_hsl(var(--ink))] [paint-order:stroke_fill]">
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
    </section>
  );
}

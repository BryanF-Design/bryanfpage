"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

// Cada paso apunta a la sección donde de verdad se resuelve: la banda no es
// un adorno numerado, es el índice del recorrido.
const STEP_HREFS = [
  "#precios",
  "#lumina",
  "#projects",
  "#precios",
  "#faq",
] as const;

/**
 * 工程 — la banda de proceso.
 *
 * Antes esto era `ProcessOrbital`: cinco columnas de 20rem de alto, con icono,
 * marca de nodo, número fantasma al fondo y una barra que se llenaba con el
 * scroll. En teléfono medía más de 1 600 px para decir cinco frases.
 *
 * La referencia brutalista resuelve exactamente este bloque con una banda
 * negra de borde a borde: etiqueta vertical, número, título, una línea y una
 * flecha. Eso es lo que hay aquí. El contenido no se recortó —son los mismos
 * cinco pasos del diccionario—, se le quitó el andamio.
 */
export function CapabilityBand() {
  const { t } = useLanguage();
  const steps = t.process.steps;

  return (
    <section
      id="proceso"
      aria-label={t.process.title}
      className="relative isolate overflow-hidden border-b border-border bg-[#050d0a]"
    >
      <div aria-hidden className="japan-halftone absolute inset-0 opacity-10" />

      <div className="container relative">
        {/* Cabecera de la banda: qué es esto y a dónde lleva. */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-border py-6 md:py-8">
          <div className="min-w-0">
            <span className="tech-label inline-flex items-center gap-3 text-primary">
              <span aria-hidden className="chapter-seal !size-6 !text-[11px]">
                <span lang="ja">工程</span>
              </span>
              {t.process.eyebrow}
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-foreground">
              {t.process.title}
            </h2>
          </div>
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            {t.process.subtitle}
          </p>
        </div>

        <div className="relative flex">
          {/* Etiqueta vertical al canto, como el «WHAT WE DO» de la
              referencia. Es ornamento: el mismo texto ya está arriba. */}
          <span
            aria-hidden
            className="hidden shrink-0 items-center border-r border-border pr-4 md:flex"
          >
            <span className="vertical-jp font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/30">
              kōtei · 01—05
            </span>
          </span>

          <ol className="grid min-w-0 flex-1 md:grid-cols-5">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={cn(
                  "group relative border-b border-border last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0",
                  "px-0 py-6 md:px-5 md:py-8 md:first:pl-6 lg:px-7"
                )}
              >
                <Link
                  href={STEP_HREFS[i] ?? "#precios"}
                  className="flex h-full flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#050d0a]"
                >
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold tracking-[0.18em]",
                      i === steps.length - 1 ? "text-signal" : "text-primary"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-bold uppercase leading-[1.05] tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-[13px]">
                    {step.content}
                  </p>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-auto size-4 shrink-0 text-foreground/40 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

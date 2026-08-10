"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { LazyMount } from "@/components/three/lazy-mount";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import type { LuminaMood } from "@/components/three/lumina-hologram";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const LuminaHologram = dynamic(
  () => import("@/components/three/lumina-hologram").then((m) => m.LuminaHologram),
  { ssr: false }
);

const MOOD_CYCLE: LuminaMood[] = ["Normal", "Sorprendida", "Enfocada", "Duda"];

// Enlaces preconfigurados del cotizador, en el mismo orden que
// `luminaSection.quotePresets` (sitio a medida · tienda · mantenimiento).
const QUOTE_PRESET_HREFS = [
  "/crear-web?plan=full",
  "/crear-web?plan=full&modules=ecommerce,payments",
  "/crear-web?plan=maintenance",
] as const;

/** Abre el chat de Lumina desde cualquier parte (lo escucha LuminaChat). */
export function openLuminaChat(message?: string) {
  window.dispatchEvent(new CustomEvent("lumina:open", { detail: { message } }));
}

/**
 * 灯 — Lumina.
 *
 * Eran dos secciones seguidas: la presentación (holograma, frases, preguntas,
 * atajos de cotización, tres capacidades y nota de privacidad) y, justo
 * debajo, el recorrido de cinco pasos con su riel animado y cinco avatares.
 * Dos cabeceras, dos veces el mismo argumento.
 *
 * Aquí es un capítulo: quién es y cómo se le habla arriba; el recorrido
 * completo, los atajos del cotizador y la letra de privacidad plegados.
 */
export function LuminaChapter() {
  const { t } = useLanguage();
  const [mood, setMood] = useState<LuminaMood>("Normal");

  const moodLabels = t.luminaSection.moods;
  const moodLabel: Record<LuminaMood, string> = {
    Normal: moodLabels.normal,
    Enfocada: moodLabels.enfocada,
    Duda: moodLabels.duda,
    Sorprendida: moodLabels.sorprendida,
  };

  function poke() {
    setMood((m) => MOOD_CYCLE[(MOOD_CYCLE.indexOf(m) + 1) % MOOD_CYCLE.length]);
  }

  return (
    <section
      id="lumina"
      aria-label={t.luminaSection.eyebrow}
      className="relative isolate overflow-hidden border-b border-border py-16 md:py-24"
    >
      <div aria-hidden className="mesh-glow-a absolute inset-0 opacity-50" />
      <div aria-hidden className="route-grid absolute inset-0 opacity-20" />

      <div className="container relative">
        <ChapterMark
          kanji="灯"
          romaji="akari"
          label={t.luminaSection.eyebrow}
          index={3}
          total={CHAPTER_TOTAL}
          className="mb-9 md:mb-12"
        />

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* ——— El argumento ——————————————————————————————— */}
          <div className="order-2 flex flex-col items-start gap-5 lg:order-1">
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold uppercase leading-[0.9] tracking-[-0.045em]">
              {t.luminaSection.titlePrefix}{" "}
              <span className="text-primary drop-shadow-[0_0_24px_hsl(76_76%_54%/0.35)]">
                Lumina.
              </span>
            </h2>

            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {t.luminaSection.subtitle}
            </p>

            <TypedPhrases phrases={t.luminaSection.phrases} />

            <div className="flex flex-wrap gap-2">
              {t.lumina.quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => openLuminaChat(q)}
                  className="min-h-11 border border-border border-l-primary/40 bg-background/45 px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary hover:text-primary active:scale-[0.98] md:text-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => openLuminaChat()}>
                <MessageCircle aria-hidden className="mr-2 size-4" />
                {t.luminaSection.cta}
              </Button>
              <span className="tech-label inline-flex items-center gap-2 text-muted-foreground">
                <span
                  aria-hidden
                  className="inline-flex size-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                />
                {t.luminaSection.status}
              </span>
            </div>

            <ul className="grid w-full gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
              {t.luminaSection.badges.map((b) => (
                <li
                  key={b.title}
                  className="flex flex-col justify-end gap-1 bg-background/95 p-4"
                >
                  <span className="text-sm font-semibold text-foreground">{b.title}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {b.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ——— El holograma ——————————————————————————————— */}
          <div className="order-1 lg:order-2">
            <LazyMount
              className="corner-ticks relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px]"
              fallback={
                <div className="absolute inset-10 rounded-full border border-border bg-secondary/30" />
              }
            >
              <LuminaHologram mood={mood} onPoke={poke} className="absolute inset-0" />

              <div className="pointer-events-none absolute right-1 top-1 md:right-3 md:top-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={mood}
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="glass inline-flex items-center gap-2 rounded-none border-l-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"
                  >
                    <Sparkles aria-hidden className="size-3" />
                    {moodLabel[mood]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </LazyMount>
            <p className="tech-label mt-3 text-center text-muted-foreground">
              {t.luminaSection.hint}
            </p>
          </div>
        </div>

        {/* ——— El recorrido, plegado ——————————————————————————— */}
        <Disclosure
          label={t.ui.howLuminaWorks}
          labelOpen={t.ui.collapse}
          className="mt-10 md:mt-14"
          triggerClassName="w-full justify-between border-t border-border pt-5"
        >
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t.luminaJourney.subtitle}
          </p>

          <ol className="mt-6 grid border-y border-border sm:grid-cols-2 lg:grid-cols-5 lg:border-b-0">
            {t.luminaJourney.steps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-2 border-b border-border px-0 py-5 last:border-b-0 sm:px-4 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>

          {/* Atajos: cada uno abre el cotizador ya preconfigurado. */}
          <div className="mt-6 flex flex-wrap gap-2">
            {t.luminaSection.quotePresets.map((label, i) => (
              <a
                key={label}
                href={QUOTE_PRESET_HREFS[i]}
                className="inline-flex min-h-11 items-center gap-1.5 border border-primary/30 bg-primary/[0.06] px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-primary transition-all duration-200 hover:bg-primary/15 active:scale-[0.98] md:text-xs"
              >
                <Sparkles aria-hidden className="size-3.5" />
                {label}
              </a>
            ))}
          </div>

          <p className="mt-5 inline-flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
            {t.luminaSection.privacy}
          </p>
        </Disclosure>
      </div>
    </section>
  );
}

/** Terminal chiquita: Lumina escribe una frase una vez y después queda quieta. */
function TypedPhrases({ phrases }: { phrases: string[] }) {
  const reduced = useReducedMotionPreference();
  const [text, setText] = useState("");

  useEffect(() => {
    const phrase = phrases[0] ?? "";
    if (reduced || phrase.length === 0) {
      setText(phrase);
      return;
    }

    setText("");
    let char = 0;
    const timer = window.setInterval(() => {
      char++;
      setText(phrase.slice(0, char));
      if (char >= phrase.length) window.clearInterval(timer);
    }, 42);
    return () => window.clearInterval(timer);
  }, [phrases, reduced]);

  return (
    <div className="editorial-panel flex w-full max-w-md items-center gap-3 border-l-primary px-4 py-3">
      <span className="flex gap-1.5" aria-hidden>
        <span className="size-2 rounded-full bg-primary/60" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
      </span>
      <p className="min-h-[1.25rem] flex-1 truncate font-mono text-xs text-foreground/90 md:text-sm">
        {text}
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-primary"
        />
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LazyMount } from "@/components/three/lazy-mount";
import type { LuminaMood } from "@/components/three/lumina-hologram";
import { cn } from "@/lib/utils";
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
 * 案内 — Lumina, en bento.
 *
 * Panel musgo con el relato y los atajos; panel de tinta con el holograma,
 * que se sale por arriba de su tarjeta como los personajes de las
 * referencias; y tres fichas con lo que sabe hacer. Las preguntas rápidas
 * abren el chat y se envían solas, igual que antes.
 */
export function LuminaFeature() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);
  const [mood, setMood] = useState<LuminaMood>("Normal");

  // El nombre de fondo se desliza más lento que el scroll (capa profunda).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgX = useTransform(scrollYProgress, [0, 1], ["4%", "-10%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0, 1, 1, 0]);

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
      ref={sectionRef}
      id="lumina"
      aria-label={t.luminaSection.eyebrow}
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      {/* A · Relato y atajos */}
      <div data-fx="left" className="order-2 min-w-0 lg:order-1 lg:col-span-7">
        <div className="panel panel-moss relative h-full overflow-hidden p-6 md:p-10 lg:p-12">
          <motion.div
            aria-hidden
            style={reduced ? undefined : { x: bgX, opacity: bgOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-[-0.12em] select-none whitespace-nowrap"
          >
            <span className="ghost-word text-[30vw] lg:text-[17vw]">Lumina</span>
          </motion.div>

          <div className="relative flex flex-col items-start gap-6">
            <span className="tag-pill">
              <span aria-hidden lang="ja" className="seal">
                案
              </span>
              {t.luminaSection.eyebrow}
            </span>

            <div data-fx="up">
              <h2 className="display-xl text-[clamp(3.25rem,8vw,7.5rem)] text-foreground">
                {t.luminaSection.titlePrefix}{" "}
                <span className="text-primary drop-shadow-[0_0_30px_hsl(76_76%_54%/0.35)]">
                  Lumina.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
              {t.luminaSection.subtitle}
            </p>

            {/* Frases que Lumina "escribe" */}
            <TypedPhrases phrases={t.luminaSection.phrases} />

            {/* Preguntas rápidas: tocar una abre el chat y la envía */}
            <div className="flex flex-wrap gap-2">
              {t.lumina.quick.map((q) => (
                <button
                  key={q}
                  onClick={() => openLuminaChat(q)}
                  className="min-h-11 rounded-full bg-background/60 px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/80 ring-1 ring-foreground/10 transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground active:scale-[0.97] md:text-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Casos de uso: cada uno abre el cotizador YA preconfigurado. */}
            <div className="flex flex-wrap gap-2">
              {t.luminaSection.quotePresets.map((label, i) => (
                <a
                  key={label}
                  href={QUOTE_PRESET_HREFS[i]}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary/50 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/15 active:scale-[0.97] md:text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => openLuminaChat()}>
                <MessageCircle className="h-4 w-4" />
                {t.luminaSection.cta}
              </Button>
              <span className="tech-label inline-flex items-center gap-2 text-foreground/70">
                <span className="relative inline-flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                {t.luminaSection.status}
              </span>
            </div>

            {/* Privacidad / límites: claridad, no letras chiquitas. */}
            <p className="inline-flex items-start gap-2 text-xs text-foreground/65">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {t.luminaSection.privacy}
            </p>
          </div>
        </div>
      </div>

      {/* B · Holograma. Se sale del panel por arriba: el personaje rompe su
          marco, como en las referencias. */}
      <div
        data-fx="right"
        className="order-1 min-w-0 lg:order-2 lg:col-span-5"
        style={{ "--fx-delay": "90ms" } as CSSProperties}
      >
        <div className="panel relative flex h-full min-h-[24rem] flex-col items-center justify-end overflow-visible px-5 pb-6 pt-4 md:min-h-[30rem]">
          <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="mesh-glow-c opacity-80" />
            <div className="hinomaru-dots left-1/2 top-[44%] aspect-square w-[82%] -translate-x-1/2 -translate-y-1/2 opacity-25" />
            <span
              lang="ja"
              className="tategaki-display absolute bottom-6 left-5 text-5xl text-foreground/[0.07] md:text-6xl"
            >
              案内
            </span>
          </div>

          <div
            data-fx="pop"
            className="relative -mt-[14%] w-full lg:-mt-[22%]"
            style={{ "--fx-delay": "260ms" } as CSSProperties}
          >
            <LazyMount
              className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px]"
              fallback={<div className="absolute inset-12 rounded-full border border-border bg-secondary/40" />}
            >
              <LuminaHologram mood={mood} onPoke={poke} className="absolute inset-0" />
            </LazyMount>
          </div>

          {/* Chip de mood en el recorte del panel */}
          <div className="notch notch-tr pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={mood}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="tag-pill pl-3.5 text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {moodLabel[mood]}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="tech-label relative mt-2 rounded-full bg-secondary/80 px-4 py-2 text-center text-muted-foreground">
            {t.luminaSection.hint}
          </p>
        </div>
      </div>

      {/* C · Qué es capaz de hacer — tres capacidades reales, sin relleno. */}
      <ul className="order-3 grid gap-gutter sm:grid-cols-3 lg:col-span-12">
        {t.luminaSection.badges.map((b, i) => (
          <li
            key={b.title}
            data-fx="up"
            style={{ "--fx-delay": `${i * 90}ms` } as CSSProperties}
            className="min-w-0"
          >
            <div
              className={cn(
                "panel flex h-full min-h-36 flex-col justify-end gap-2 p-6 md:p-7",
                i === 1 && "panel-lime"
              )}
            >
              <span aria-hidden className="display-xl mb-auto text-3xl text-foreground/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="display-xl text-[1.9rem] text-foreground">{b.title}</span>
              <span className="text-sm text-muted-foreground">{b.desc}</span>
            </div>
          </li>
        ))}
      </ul>
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
    <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-background/70 px-4 py-3 ring-1 ring-foreground/10">
      <span className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="h-2 w-2 rounded-full bg-foreground/25" />
      </span>
      <p className="min-h-[1.25rem] flex-1 truncate font-mono text-xs text-foreground/90 md:text-sm">
        {text}
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-primary" aria-hidden />
      </p>
    </div>
  );
}

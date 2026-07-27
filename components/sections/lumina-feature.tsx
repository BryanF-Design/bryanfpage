"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LazyMount } from "@/components/three/lazy-mount";
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
 * Presentación de Lumina con protagonismo propio: deja de ser solo la
 * burbuja de la esquina y recibe una sección completa — su nombre gigante
 * cruzando el fondo con parallax, el holograma 3D girable en primer plano y
 * preguntas que, al tocarlas, abren el chat y se envían solas.
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
      className="relative overflow-hidden border-t border-border py-24 md:py-32"
    >
      <div aria-hidden className="mesh-glow-a opacity-60" />
      <div aria-hidden className="route-grid absolute inset-0 opacity-25" />
      <div aria-hidden className="japan-halftone absolute inset-y-0 right-0 w-3/5 opacity-15" />

      {/* Nombre gigante en capa profunda */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { x: bgX, opacity: bgOpacity }}
        className="pointer-events-none absolute left-0 top-8 w-full select-none whitespace-nowrap md:top-10"
      >
        <span className="text-stroke-bone font-display text-[26vw] font-bold uppercase leading-none opacity-[0.16] md:text-[17vw]">
          Lumina — Lumina
        </span>
      </motion.div>

      <div className="container relative z-10 mt-14 grid items-center gap-12 md:mt-20 lg:grid-cols-[1fr_0.95fr] lg:gap-6">
        {/* Copy */}
        <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="tech-label inline-flex items-center gap-3 text-primary"
          >
            <span className="h-1.5 w-1.5 bg-primary" />
            {t.luminaSection.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.2, 0, 0, 1] }}
            className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl"
          >
            {t.luminaSection.titlePrefix}{" "}
            <span className="text-primary drop-shadow-[0_0_24px_hsl(76_76%_54%/0.35)]">
              Lumina.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
          >
            {t.luminaSection.subtitle}
          </motion.p>

          {/* Frases que Lumina "escribe" */}
          <TypedPhrases phrases={t.luminaSection.phrases} />

          {/* Preguntas rápidas: tocar una abre el chat y la envía */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.2, 0, 0, 1] }}
            className="flex flex-wrap gap-2"
          >
            {t.lumina.quick.map((q) => (
              <button
                key={q}
                onClick={() => openLuminaChat(q)}
                className="min-h-11 border border-border border-l-primary/40 bg-background/45 px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary hover:text-primary active:scale-[0.98] md:text-xs"
              >
                {q}
              </button>
            ))}
          </motion.div>

          {/* Casos de uso: cada uno abre el cotizador YA preconfigurado. */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.21, ease: [0.2, 0, 0, 1] }}
            className="flex flex-wrap gap-2"
          >
            {t.luminaSection.quotePresets.map((label, i) => (
              <a
                key={label}
                href={QUOTE_PRESET_HREFS[i]}
                className="inline-flex min-h-11 items-center gap-1.5 border border-primary/30 bg-primary/[0.06] px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-primary transition-all duration-200 hover:bg-primary/15 active:scale-[0.98] md:text-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.2, 0, 0, 1] }}
            className="mt-1 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" onClick={() => openLuminaChat()}>
              <MessageCircle className="mr-2 h-4 w-4" />
              {t.luminaSection.cta}
            </Button>
            <span className="tech-label inline-flex items-center gap-2 text-muted-foreground">
              <span className="inline-flex size-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
              {t.luminaSection.status}
            </span>
          </motion.div>

          {/* Qué es capaz de hacer — tres capacidades reales, sin relleno. */}
          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            className="grid w-full gap-px overflow-hidden border border-border bg-border sm:grid-cols-3"
          >
            {t.luminaSection.badges.map((b) => (
              <li key={b.title} className="flex min-h-28 flex-col justify-end gap-1 bg-background/95 p-4">
                <span className="text-sm font-semibold text-foreground">{b.title}</span>
                <span className="text-xs text-muted-foreground">{b.desc}</span>
              </li>
            ))}
          </motion.ul>

          {/* Privacidad / límites: claridad, no letras chiquitas. */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="inline-flex items-start gap-2 text-xs text-muted-foreground"
          >
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            {t.luminaSection.privacy}
          </motion.p>
        </div>

        {/* Holograma */}
        <div className="order-1 lg:order-2">
          <LazyMount
            className="corner-ticks relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[540px]"
            fallback={<div className="absolute inset-10 rounded-full border border-border bg-secondary/30" />}
          >
            <LuminaHologram mood={mood} onPoke={poke} className="absolute inset-0" />

            {/* Chip de mood */}
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
                  <Sparkles className="h-3 w-3" />
                  {moodLabel[mood]}
                </motion.span>
              </AnimatePresence>
            </div>
          </LazyMount>
          <p className="tech-label mt-4 text-center text-muted-foreground">
            {t.luminaSection.hint}
          </p>
        </div>
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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0, 0, 1] }}
      className="editorial-panel flex w-full max-w-md items-center gap-3 border-l-primary px-4 py-3"
    >
      <span className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-primary/60" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
      </span>
      <p className="min-h-[1.25rem] flex-1 truncate font-mono text-xs text-foreground/90 md:text-sm">
        {text}
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-primary" aria-hidden />
      </p>
    </motion.div>
  );
}

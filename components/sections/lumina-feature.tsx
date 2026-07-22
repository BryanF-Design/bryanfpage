"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Monitor, MonitorSmartphone, MessageCircle, Smartphone, Sparkles, Tablet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tilt } from "@/components/ui/tilt";
import { LazyMount } from "@/components/three/lazy-mount";
import type { LuminaMood } from "@/components/three/lumina-hologram";
import { useLanguage } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const LuminaHologram = dynamic(
  () => import("@/components/three/lumina-hologram").then((m) => m.LuminaHologram),
  { ssr: false }
);

const MOOD_CYCLE: LuminaMood[] = ["Normal", "Sorprendida", "Enfocada", "Duda"];

/** Abre el chat de Lumina desde cualquier parte (lo escucha LuminaChat). */
export function openLuminaChat(message?: string) {
  window.dispatchEvent(new CustomEvent("lumina:open", { detail: { message } }));
}

/**
 * Presentación de Lumina con protagonismo propio: deja de ser solo la
 * burbuja de la esquina y recibe una sección completa — su nombre gigante
 * cruzando el fondo con parallax, un HUD que declara su "denominación" del
 * día en vivo, el holograma 3D girable en primer plano, preguntas que al
 * tocarlas abren el chat y se envían solas, y una vitrina de dispositivos
 * que demuestra que cada web que construimos (y ella misma) se adapta a
 * cualquier pantalla.
 */
export function LuminaFeature() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [mood, setMood] = useState<LuminaMood>("Normal");

  // El nombre de fondo se desliza más lento que el scroll (capa profunda).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgX = useTransform(scrollYProgress, [0, 1], ["4%", "-10%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0, 1, 1, 0]);
  const holoY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

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
          <DesignationHud copy={t.luminaSection.designation} />

          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.04, ease: [0.2, 0, 0, 1] }}
            className="tech-label inline-flex items-center gap-3 text-primary"
          >
            <span className="h-1.5 w-1.5 bg-primary" />
            {t.luminaSection.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0, 0, 1] }}
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
            transition={{ duration: 0.7, delay: 0.16, ease: [0.2, 0, 0, 1] }}
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
            transition={{ duration: 0.6, delay: 0.22, ease: [0.2, 0, 0, 1] }}
            className="flex flex-wrap gap-2"
          >
            {t.lumina.quick.map((q) => (
              <button
                key={q}
                onClick={() => openLuminaChat(q)}
                className="elevate rounded-full border border-border px-4 py-2 text-left text-xs text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary active:scale-95 md:text-sm"
              >
                {q}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.2, 0, 0, 1] }}
            className="mt-1 flex flex-wrap items-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => openLuminaChat()}
              className="shadow-[0_0_0_0_hsl(76_76%_54%/0.5)] transition-shadow duration-300 hover:shadow-[0_0_32px_2px_hsl(76_76%_54%/0.35)]"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t.luminaSection.cta}
            </Button>
            <span className="tech-label inline-flex items-center gap-2 text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t.luminaSection.status}
            </span>
          </motion.div>
        </div>

        {/* Holograma */}
        <motion.div style={reduced ? undefined : { y: holoY }} className="order-1 lg:order-2">
          <LazyMount
            className="corner-ticks relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[540px]"
            fallback={<div className="absolute inset-10 animate-pulse rounded-full bg-secondary/40" />}
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
                  className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"
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
        </motion.div>
      </div>

      <div className="container relative z-10">
        <AdaptiveDevices copy={t.luminaSection.devices} />
      </div>
    </section>
  );
}

/** Terminal chiquita donde Lumina teclea frases en loop, con caret vivo. */
function TypedPhrases({ phrases }: { phrases: string[] }) {
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced || phrases.length === 0) {
      setText(phrases[0] ?? "");
      return;
    }
    let char = 0;
    let deleting = false;
    const phrase = phrases[idx % phrases.length];
    const timer = window.setInterval(() => {
      if (!deleting) {
        char++;
        setText(phrase.slice(0, char));
        if (char >= phrase.length) {
          deleting = true;
          char = phrase.length + 14; // pausa leyendo
        }
      } else {
        char--;
        if (char <= phrase.length) setText(phrase.slice(0, Math.max(0, char)));
        if (char <= 0) {
          window.clearInterval(timer);
          setIdx((i) => i + 1);
        }
      }
    }, 42);
    return () => window.clearInterval(timer);
  }, [idx, phrases, reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0, 0, 1] }}
      className="glass flex w-full max-w-md items-center gap-3 rounded-md px-4 py-3"
    >
      <span className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-primary/60" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
      </span>
      <p className="min-h-[1.25rem] flex-1 truncate font-mono text-xs text-foreground/90 md:text-sm">
        {text}
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-primary" aria-hidden />
      </p>
    </motion.div>
  );
}

/**
 * HUD de "denominación": Lumina recibe un apodo/modo distinto cada día de
 * la semana (calculado en el navegador con Date.getDay()) y un reloj que
 * corre en vivo — nada de esto viene del servidor, así que arranca en un
 * estado neutro (guiones) hasta montar, para no pelear con la hidratación.
 */
function DesignationHud({ copy }: { copy: Dictionary["luminaSection"]["designation"] }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const dayIndex = now ? now.getDay() : 0;
  const designation = copy.days[dayIndex] ?? copy.days[0];
  const hh = now ? String(now.getHours()).padStart(2, "0") : "--";
  const mm = now ? String(now.getMinutes()).padStart(2, "0") : "--";
  const ss = now ? String(now.getSeconds()).padStart(2, "0") : "--";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      aria-label={`${copy.live}. ${copy.eyebrow}: ${designation}`}
      className="glass corner-ticks inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full px-4 py-2"
    >
      <span className="inline-flex items-center gap-1.5 tech-label text-primary" aria-hidden>
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        {copy.live}
      </span>
      <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
      <span className="tech-label text-foreground/70" aria-hidden>
        {copy.eyebrow} · <span className="text-primary">{designation}</span>
      </span>
      <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
      <span className="font-mono text-xs tabular-nums text-muted-foreground" aria-hidden>
        {hh}
        <span className="clock-colon">:</span>
        {mm}
        <span className="clock-colon">:</span>
        {ss}
      </span>
    </motion.div>
  );
}

const DEVICE_META = {
  mobile: { Icon: Smartphone, float: 3.2, tilt: -4 },
  tablet: { Icon: Tablet, float: 3.8, tilt: 0 },
  desktop: { Icon: Monitor, float: 4.4, tilt: 4 },
} as const;

/**
 * Vitrina "100% adaptativo": tres pantallas en miniatura (móvil, tablet,
 * escritorio) con una réplica mínima de cualquier web que construimos —
 * Lumina incluida en cada una. Flotan solas, se inclinan con el puntero
 * (Tilt) y tocarlas dispara un pulso — la prueba visual de que el mismo
 * sitio se adapta a cualquier pantalla, no solo un enunciado.
 */
function AdaptiveDevices({ copy }: { copy: Dictionary["luminaSection"]["devices"] }) {
  const reduced = useReducedMotion();
  const [pinged, setPinged] = useState<keyof typeof DEVICE_META | null>(null);

  function ping(id: keyof typeof DEVICE_META) {
    setPinged(id);
    window.setTimeout(() => setPinged((p) => (p === id ? null : p)), 700);
  }

  const devices: { id: keyof typeof DEVICE_META; label: string }[] = [
    { id: "mobile", label: copy.mobile },
    { id: "tablet", label: copy.tablet },
    { id: "desktop", label: copy.desktop },
  ];

  return (
    <div className="relative mt-8 border-t border-border pt-16 md:pt-20">
      <div aria-hidden className="mesh-glow-c absolute inset-x-0 top-0 opacity-40" />
      <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="tech-label inline-flex items-center gap-3 text-primary"
          >
            <span className="h-1.5 w-1.5 bg-primary" />
            {copy.eyebrow}
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.2, 0, 0, 1] }}
            className="mt-4 max-w-sm font-display text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl"
          >
            {copy.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            className="mt-4 max-w-md text-sm text-muted-foreground md:text-base"
          >
            {copy.subtitle}
          </motion.p>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.2, 0, 0, 1] }}
            className="glass-tint tech-label mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-primary"
          >
            <MonitorSmartphone className="h-3.5 w-3.5" />
            {copy.badge}
          </motion.span>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-center gap-8 sm:justify-around">
            {devices.map(({ id, label }, i) => {
              const { Icon, float, tilt } = DEVICE_META[id];
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 44, rotate: tilt }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0, 0, 1] }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={reduced ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: float, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  >
                    <Tilt max={10}>
                      <button
                        type="button"
                        onClick={() => ping(id)}
                        aria-label={`${copy.hint}: ${label}`}
                        className="block cursor-pointer transition-transform active:scale-95"
                      >
                        <DeviceFrame kind={id} pinged={pinged === id} />
                      </button>
                    </Tilt>
                  </motion.div>
                  <p className="tech-label mt-3 inline-flex items-center gap-1.5 text-muted-foreground">
                    <Icon className="h-3 w-3" />
                    {label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Señal de sincronía entre pantallas */}
          <div className="mt-8 hidden items-center justify-center gap-3 sm:flex" aria-hidden>
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-primary/40" />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary"
                style={reduced ? undefined : { animation: `signal-pulse 1.8s ease-in-out ${i * 0.3}s infinite` }}
              />
            ))}
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <p className="tech-label mt-4 text-center text-muted-foreground sm:hidden">{copy.hint}</p>
        </div>
      </div>
    </div>
  );
}

const DEVICE_SIZE: Record<keyof typeof DEVICE_META, string> = {
  mobile: "h-44 w-24 rounded-[1.4rem] border-[3px]",
  tablet: "h-48 w-36 rounded-2xl border-[5px]",
  desktop: "h-32 w-56 rounded-lg border-[5px]",
};

/** Marco de dispositivo dibujado en CSS puro (sin imágenes): bisel, muesca
 *  o base según el tipo, con la mini pantalla del sitio adentro. */
function DeviceFrame({ kind, pinged }: { kind: keyof typeof DEVICE_META; pinged: boolean }) {
  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden border-foreground/15 bg-[#0a130d] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7)]",
          DEVICE_SIZE[kind]
        )}
      >
        <MiniScreen />
        {kind === "mobile" && (
          <span
            aria-hidden
            className="absolute left-1/2 top-1.5 h-1 w-6 -translate-x-1/2 rounded-full bg-foreground/25"
          />
        )}
        <AnimatePresence>
          {pinged && (
            <motion.span
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-primary"
              aria-hidden
            />
          )}
        </AnimatePresence>
      </div>
      {kind === "desktop" && (
        <div className="mx-auto mt-1.5 flex flex-col items-center" aria-hidden>
          <span className="h-3 w-2.5 bg-foreground/15" />
          <span className="h-1.5 w-14 rounded-full bg-foreground/15" />
        </div>
      )}
    </div>
  );
}

/** Réplica mínima del sitio: nav de puntos, dos líneas de texto, un botón
 *  lima y el avatar de Lumina en la esquina — la misma experiencia, chica. */
function MiniScreen() {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[hsl(158_18%_9%)] to-[hsl(160_30%_4%)] p-2.5">
      <div className="flex items-center justify-between" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <div className="flex gap-1">
          <span className="h-[3px] w-3 rounded-full bg-foreground/20" />
          <span className="h-[3px] w-3 rounded-full bg-foreground/20" />
          <span className="h-[3px] w-3 rounded-full bg-foreground/20" />
        </div>
      </div>
      <div className="space-y-1.5" aria-hidden>
        <span className="block h-1.5 w-4/5 rounded-full bg-foreground/30" />
        <span className="block h-1.5 w-3/5 rounded-full bg-foreground/15" />
        <span className="mt-1.5 inline-block rounded-full bg-primary px-2.5 py-1 text-[6px] font-bold uppercase tracking-wide text-primary-foreground">
          Go
        </span>
      </div>
      <div className="flex justify-end" aria-hidden>
        <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-full ring-1 ring-primary/60">
          <Image src="/img/lumina/Normal.png" alt="" fill sizes="16px" className="object-cover" />
          <span className="absolute -bottom-px -right-px h-1.5 w-1.5 rounded-full border border-background bg-primary" />
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  Compass,
  Images,
  LayoutTemplate,
  MessageCircle,
  MousePointerClick,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkle,
  WandSparkles,
  Wrench,
} from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { mobileShot } from "@/lib/projects";

type MoodKey = "normal" | "enfocada" | "duda" | "sorprendida";

/** Recortes de Lumina, en el orden en que cambian al tocarla (medidas reales). */
const MOODS: { key: MoodKey; src: string; width: number; height: number }[] = [
  { key: "normal", src: "/img/brand/lumina-normal.webp", width: 864, height: 1121 },
  { key: "enfocada", src: "/img/brand/lumina-enfocada.webp", width: 852, height: 1162 },
  { key: "duda", src: "/img/brand/lumina-duda.webp", width: 807, height: 1139 },
  { key: "sorprendida", src: "/img/brand/lumina-sorprendida.webp", width: 876, height: 1124 },
];

// Enlaces preconfigurados del cotizador, en el mismo orden que
// `luminaSection.quotePresets` (sitio a medida · tienda · mantenimiento).
const QUOTE_PRESET_HREFS = [
  "/crear-web?plan=full",
  "/crear-web?plan=full&modules=ecommerce,payments",
  "/crear-web?plan=maintenance",
] as const;
const PRESET_ICONS = [LayoutTemplate, ShoppingBag, Wrench];
const BADGE_ICONS = [Compass, Images, WandSparkles];
/** Capturas reales para la capacidad "te enseña proyectos como el tuyo". */
const BADGE_SHOTS = ["mixteca-web-vercel-app", "gecomex-web-vercel-app", "sermaqro-com"];

/** Abre el chat de Lumina desde cualquier parte (lo escucha LuminaChat). */
export function openLuminaChat(message?: string) {
  window.dispatchEvent(new CustomEvent("lumina:open", { detail: { message } }));
}

function fxDelay(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

/**
 * Lumina — el personaje que rompe el marco.
 *
 * Panel bosque con Lumina saliéndose por el borde superior y el titular a su
 * lado; al tocarla cambia de ánimo (cambia el recorte). A la derecha, una
 * vista previa del chat con las preguntas rápidas; abajo, sus tres
 * capacidades y los atajos al cotizador ya preconfigurado.
 */
export function LuminaFeature() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();
  // `wanted` es el ánimo pedido; `shown`, el que ya descargó y se ve. Así un
  // toque nunca deja el escenario en blanco mientras llega el recorte.
  const [wanted, setWanted] = useState(0);
  const [shown, setShown] = useState(0);
  const wantedRef = useRef(0);
  const loaded = useRef(new Set<number>([0]));
  // De entrada solo se monta el ánimo visible; el siguiente se pide al pasar
  // el puntero o enfocar (o con el primer toque), no en la carga.
  const [primed, setPrimed] = useState<number[]>([0]);

  const mood = MOODS[shown].key;
  const moodLabel = t.luminaSection.moods[mood];

  function prime(...indexes: number[]) {
    setPrimed((list) => {
      const missing = indexes.filter((i) => !list.includes(i));
      return missing.length ? [...list, ...missing] : list;
    });
  }

  function primeNext() {
    prime((wanted + 1) % MOODS.length);
  }

  function poke() {
    const next = (wanted + 1) % MOODS.length;
    wantedRef.current = next;
    setWanted(next);
    prime(next, (next + 1) % MOODS.length);
    if (loaded.current.has(next)) setShown(next);
  }

  function onMoodLoad(index: number) {
    loaded.current.add(index);
    if (wantedRef.current === index) setShown(index);
  }

  // Con teclado, la pregunta enfocada se desliza completa a la vista: el
  // navegador no mueve la fila si la ficha asoma a medias. Solo actúa cuando
  // la fila de verdad se desliza (teléfono).
  function revealQuick(el: HTMLElement) {
    const row = el.parentElement;
    if (!row || row.scrollWidth <= row.clientWidth || !el.matches(":focus-visible")) return;
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section
      id="lumina"
      aria-labelledby="lumina-title"
      className="relative isolate grid gap-gutter md:grid-cols-12"
    >
      {/* A · Escenario bosque: Lumina rompe el borde superior del panel. El
          relleno superior reserva exactamente lo que sube su cabeza, así nunca
          invade la sección anterior. */}
      <div data-fx="panel" className="min-w-0 pt-12 sm:pt-20 md:col-span-12 lg:pt-[5.5rem] min-[1400px]:col-span-8 min-[1400px]:row-start-1 min-[1400px]:pt-[3.5rem]">
        <div className="panel panel-forest relative flex h-full flex-col lg:min-h-[32rem] lg:flex-row min-[1400px]:min-h-[33rem]">
          {/* Fondo: brillo, disco lima detrás de su cabeza y puntos. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_28%_30%,hsl(var(--lime)/0.18),transparent_65%)]" />
            <div className="absolute left-[19%] top-1 aspect-square w-[62%] rounded-full bg-lime sm:left-[22%] sm:top-2 sm:w-[56%] md:left-[27%] md:w-[46%] lg:left-[7%] lg:top-[-3.5rem] lg:w-[43%]" />
            <div className="absolute -bottom-24 -right-24 size-80 rounded-full border border-white/10" />
            <div className="absolute -bottom-10 -right-10 size-48 rounded-full border border-white/10" />
            <div className="dot-cluster absolute right-9 top-[5.5rem] hidden h-[4.125rem] w-[6.875rem] opacity-60 min-[1400px]:block" />
          </div>

          {/* Recorte cóncavo con la etiqueta de la sección (escritorio). */}
          <div className="notch notch-tr hidden lg:flex">
            <span className="eyebrow bg-white pl-1.5 text-ink shadow-soft">
              <b aria-hidden>
                <Sparkle className="h-3 w-3 fill-current" />
              </b>
              {t.luminaSection.eyebrow}
            </span>
          </div>

          {/* Escenario: en teléfono y tableta encabeza el panel; desde lg ocupa
              la mitad izquierda y Lumina se asienta en el canto inferior. El
              recorte solo corta la base (con la esquina redondeada del panel):
              arriba y a la derecha el pelo sale libre, sin cantos rectos. Lumina
              siempre cabe completa a lo ancho dentro del panel: nunca se corta
              de lado (el pelo llega al borde del recorte).
              Cuánto sube = relleno superior del contenedor: alto extra − lo que
              baja (3 · 5 · 5.75 · 3.75rem por breakpoint). La base del recorte
              (redonda) siempre queda bajo el canto del panel. */}
          <div className="relative h-[18rem] shrink-0 [clip-path:inset(-6rem_0_0_0)] sm:h-[27rem] lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[54%] lg:[clip-path:inset(-100%_-100%_0_0_round_0_0_0_var(--r-panel))]">
            <button
              type="button"
              onClick={poke}
              onPointerEnter={primeNext}
              onFocus={primeNext}
              aria-label={`${t.luminaSection.hint} · ${moodLabel}`}
              className="group absolute left-1/2 top-[-3rem] z-10 block w-[min(18.5rem,82%)] -translate-x-1/2 cursor-pointer rounded-[2rem] focus-visible:outline-offset-[-8px] sm:top-[-5rem] sm:w-[27rem] lg:bottom-[-2.75rem] lg:left-4 lg:top-auto lg:h-[calc(100%+8.5rem)] lg:w-auto lg:translate-x-0 min-[1400px]:h-[calc(100%+6.5rem)]"
            >
              <motion.span
                className="relative block aspect-[864/1121] origin-bottom lg:h-full"
                whileHover={reduced ? undefined : { y: -6 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
              >
                {MOODS.map((m, i) =>
                  primed.includes(i) ? (
                    <Image
                      key={m.key}
                      src={m.src}
                      alt={i === shown ? `${t.lumina.name} · ${moodLabel}` : ""}
                      aria-hidden={i === shown ? undefined : true}
                      width={m.width}
                      height={m.height}
                      sizes="(min-width: 1024px) 34rem, (min-width: 640px) 27rem, 19rem"
                      onLoad={() => onMoodLoad(i)}
                      className={cn(
                        // Alineadas arriba: la cabeza no salta entre ánimos; lo
                        // que sobra abajo queda bajo el canto del panel.
                        "absolute left-0 top-0 h-auto w-full origin-bottom drop-shadow-[0_24px_30px_hsl(160_40%_6%/0.45)] transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-pop)]",
                        i === shown ? "scale-100 opacity-100" : "translate-y-3 scale-[0.96] opacity-0"
                      )}
                    />
                  ) : null
                )}
              </motion.span>
            </button>
          </div>

          {/* Ánimo actual + pista para tocarla: una ficha tipo app. En
              teléfono cabalga la unión entre Lumina y la hoja, a la altura del
              hombro (nunca sobre su cara); en escritorio flota junto a su
              cabeza, fuera del panel, como un globo. */}
          <div className="absolute right-3 top-[13.5rem] z-30 sm:right-6 sm:top-[22rem] lg:left-[52%] lg:right-auto lg:top-[-4.25rem]">
            <span aria-hidden className="absolute -bottom-1 left-7 hidden size-3.5 rotate-45 rounded-[3px] bg-white lg:block" />
            <div className="relative flex items-center gap-2.5 rounded-[1.35rem] bg-white py-2 pl-2 pr-4 text-ink shadow-pop">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-lime">
                <Sparkle className="h-4 w-4 fill-current" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="flex items-center gap-2.5">
                  <span id="lumina-mood" aria-live="polite" className="block text-sm font-bold">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={mood}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="block whitespace-nowrap"
                      >
                        {moodLabel}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span aria-hidden className="ml-auto flex gap-1">
                    {MOODS.map((m, i) => (
                      <span
                        key={m.key}
                        className={cn(
                          "h-1.5 rounded-full transition-[width,background-color] duration-300",
                          i === shown ? "w-4 bg-forest" : "w-1.5 bg-ink/15"
                        )}
                      />
                    ))}
                  </span>
                </span>
                <span aria-hidden className="mt-1 flex max-w-[12rem] items-center gap-1 text-xs font-medium text-ink/60">
                  <MousePointerClick className="h-3.5 w-3.5 shrink-0 text-forest" />
                  {t.luminaSection.hint}
                </span>
              </span>
            </div>
          </div>

          {/* Relato. En teléfono es una hoja blanca que tapa la base del
              recorte (como una app); en escritorio vive sobre el bosque. */}
          <div className="relative z-20 -mt-12 mx-2 mb-2 flex flex-col items-start gap-4 rounded-[calc(var(--r-panel)-0.375rem)] bg-white p-5 pt-11 text-ink sm:mx-3 sm:mb-3 sm:gap-5 sm:p-7 sm:pt-12 lg:z-10 lg:m-0 lg:ml-auto lg:w-[46%] lg:justify-end lg:rounded-none lg:bg-transparent lg:p-10 lg:pl-2 lg:pt-24 lg:text-white">
            <span className="eyebrow bg-ink/[0.06] pl-1.5 text-ink lg:hidden">
              <b aria-hidden className="!bg-ink !text-lime">
                <Sparkle className="h-3 w-3 fill-current" />
              </b>
              {t.luminaSection.eyebrow}
            </span>

            <div data-fx="up" className="max-w-full">
              <h2 id="lumina-title">
                <span className="display-italic block text-[clamp(1.75rem,3vw,3rem)] leading-none">
                  {t.luminaSection.titlePrefix}
                </span>
                <span className="display-xl mt-1 block text-[clamp(4.75rem,7.4vw,7rem)] text-forest lg:text-lime">
                  Lumina.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-pretty text-[0.975rem] leading-relaxed text-ink/70 md:text-base lg:text-white/80">
              {t.luminaSection.subtitle}
            </p>

            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="lg" onClick={() => openLuminaChat()} className="pl-5 pr-2.5">
                <MessageCircle aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                {t.luminaSection.cta}
                <ButtonArrow tone="ink" className="ml-auto -mr-0.5 sm:ml-1" />
              </Button>
              {/* En teléfono el estado ya lo dice la cabecera del chat, justo abajo. */}
              <span className="hidden h-11 items-center justify-center gap-2 rounded-full bg-mint px-4 text-sm font-semibold text-ink sm:inline-flex lg:bg-white/10 lg:text-white">
                <span aria-hidden className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-forest/50 motion-reduce:animate-none lg:bg-lime/60" />
                  <span className="relative size-2.5 rounded-full bg-forest lg:bg-lime" />
                </span>
                {t.luminaSection.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* B · Vista previa del chat: tarjeta tipo app. */}
      <div
        data-fx="up"
        className="min-w-0 md:col-span-7 md:row-span-2 min-[1400px]:col-span-4 min-[1400px]:col-start-9 min-[1400px]:row-span-1 min-[1400px]:row-start-1"
        style={fxDelay(90)}
      >
        <div className="panel flex h-full flex-col gap-3 p-3 shadow-soft sm:gap-4 sm:p-4 lg:p-5">
          <div className="flex items-center gap-3 px-1 pt-1">
            <span className="relative size-12 shrink-0">
              <span className="absolute inset-0 overflow-hidden rounded-full bg-ink ring-[3px] ring-lime">
                <Image src="/img/lumina/Normal.png" alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span aria-hidden className="absolute bottom-0 right-0 size-3.5 rounded-full border-[3px] border-white bg-forest" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="display-title text-xl text-ink">{t.lumina.name}</p>
              <p className="mt-1 truncate text-sm font-medium text-muted-foreground">
                {t.luminaSection.status}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openLuminaChat()}
              aria-label={t.lumina.open}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 hover:rotate-45 active:scale-95"
            >
              <ArrowUpRight aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-[calc(var(--r-panel)-0.75rem)] bg-mint p-3 sm:p-4">
            {/* El saludo es copia propia del diccionario (HTML de confianza). */}
            <div
              className="max-w-[90%] self-start rounded-[1.35rem] rounded-bl-md bg-white px-4 py-3 text-[0.9375rem] leading-relaxed text-ink shadow-[0_10px_24px_-18px_hsl(var(--ink)/0.5)]"
              dangerouslySetInnerHTML={{ __html: t.lumina.greeting }}
            />
            <TypedPhrases phrases={t.luminaSection.phrases} />

            {/* Preguntas rápidas: tocar una abre el chat y la envía. En
                teléfono son una sola fila que se desliza (asoma la siguiente),
                a sangre hasta el borde de la caja menta; desde md, columna. */}
            <div
              role="group"
              aria-label={t.luminaSection.quickLabel}
              className="-mx-3 mt-auto flex snap-x snap-mandatory scroll-px-3 gap-2 overflow-x-auto px-3 py-1.5 [scrollbar-width:none] sm:-mx-4 sm:scroll-px-4 sm:px-4 md:mx-0 md:snap-none md:flex-col md:items-end md:overflow-visible md:px-0 md:pb-0 md:pt-3 [&::-webkit-scrollbar]:hidden"
            >
              {t.lumina.quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => openLuminaChat(q)}
                  onFocus={(e) => revealQuick(e.currentTarget)}
                  className="group inline-flex min-h-11 max-w-none shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full bg-white py-2 pl-4 pr-2 text-left text-sm font-semibold text-ink ring-1 ring-ink/10 transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white active:scale-[0.97] md:max-w-full md:shrink md:snap-align-none md:whitespace-normal"
                >
                  {q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lime text-ink">
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Caja de texto de mentira: abre el chat de verdad. */}
          <button
            type="button"
            onClick={() => openLuminaChat()}
            aria-label={t.luminaSection.cta}
            className="group flex h-14 w-full items-center gap-3 rounded-full bg-white pl-5 pr-1.5 text-left ring-1 ring-ink/[0.12] transition-shadow hover:ring-ink/30"
          >
            <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-muted-foreground">
              {t.lumina.placeholder}
            </span>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:-rotate-12">
              <Send aria-hidden className="h-[1.05rem] w-[1.05rem]" />
            </span>
          </button>

          {/* Privacidad / límites: claridad, no letras chiquitas. */}
          <p className="flex items-start gap-2 px-2 pb-1 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
            {t.luminaSection.privacy}
          </p>
        </div>
      </div>

      {/* C · Atajos al cotizador: cada uno lo abre ya preconfigurado. */}
      <div
        data-fx="up"
        className="min-w-0 md:col-span-5 min-[1400px]:col-span-4 min-[1400px]:col-start-9 min-[1400px]:row-start-2"
        style={fxDelay(120)}
      >
        <div className="panel panel-lime flex h-full flex-col gap-4 p-5 sm:gap-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="display-title text-[1.65rem] text-ink">{t.luminaSection.presetsTitle}</h3>
            <Sparkle aria-hidden className="h-7 w-7 shrink-0 fill-ink text-ink" />
          </div>
          <ul className="mt-auto flex flex-col gap-2">
            {t.luminaSection.quotePresets.map((label, i) => {
              const Icon = PRESET_ICONS[i] ?? LayoutTemplate;
              return (
                <li key={label}>
                  <a
                    href={QUOTE_PRESET_HREFS[i]}
                    className="group flex min-h-14 items-center gap-3 rounded-full bg-white/55 py-1.5 pl-1.5 pr-2 text-ink transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
                      <Icon aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] font-semibold leading-tight">{label}</span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 transition-colors group-hover:bg-ink group-hover:text-lime group-hover:ring-ink">
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* D · Lo que sabe hacer: tres capacidades reales, sin relleno. En
          teléfono se omiten: el subtítulo del escenario ya dice las tres
          (al instante · todo el catálogo · tu web armada) y el recorrido de
          Lumina las desarrolla justo después. */}
      <ul className="hidden min-w-0 gap-gutter sm:grid md:col-span-5 min-[1400px]:col-span-8 min-[1400px]:col-start-1 min-[1400px]:row-start-2 min-[1400px]:grid-cols-3">
        {t.luminaSection.badges.map((b, i) => {
          const Icon = BADGE_ICONS[i] ?? Sparkle;
          return (
            <li key={b.title} data-fx="up" style={fxDelay(i * 90)} className="min-w-0">
              <div className="panel flex h-full items-center gap-4 p-5 shadow-soft min-[1400px]:flex-col min-[1400px]:items-start min-[1400px]:justify-between min-[1400px]:gap-10 min-[1400px]:p-7">
                <div className="flex shrink-0 items-center justify-between min-[1400px]:w-full">
                  <span className="grid size-12 place-items-center rounded-full bg-ink text-lime">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <BadgeVisual index={i} />
                </div>
                <div className="min-w-0">
                  <h3 className="display-title text-[1.3rem] text-ink min-[1400px]:text-[1.75rem]">{b.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-snug text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Detalle tipo app de cada capacidad (decorativo). */
function BadgeVisual({ index }: { index: number }) {
  if (index === 0) {
    // Te lleva a la sección: la píldora del botón que deja en el chat.
    return (
      <span aria-hidden className="hidden h-9 items-center gap-1.5 rounded-full bg-mint pl-1 pr-3 text-xs font-bold text-ink min-[1400px]:flex">
        <span className="grid size-7 place-items-center rounded-full bg-lime">
          <ArrowDown className="h-3.5 w-3.5" />
        </span>
        #precios
      </span>
    );
  }
  if (index === 1) {
    // Proyectos reales: tres capturas que sobresalen de la tarjeta.
    return (
      <span aria-hidden className="relative hidden h-9 w-[6.5rem] min-[1400px]:block">
        {BADGE_SHOTS.map((slug, i) => (
          <span
            key={slug}
            style={{ left: `${i * 2}rem`, rotate: `${(i - 1) * 7}deg` }}
            className="absolute -top-7 h-16 w-10 overflow-hidden rounded-[0.55rem] bg-ink shadow-[0_12px_20px_-10px_hsl(var(--ink)/0.6)] ring-2 ring-white"
          >
            <Image src={mobileShot(slug)} alt="" fill sizes="40px" className="object-cover object-top" />
          </span>
        ))}
      </span>
    );
  }
  // Cotización armada: pasos completos y palomita.
  return (
    <span aria-hidden className="hidden items-center gap-1 min-[1400px]:flex">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={cn("h-2 w-4 rounded-full", i < 3 ? "bg-lime" : "bg-ink/10")} />
      ))}
      <span className="ml-1 grid size-8 place-items-center rounded-full bg-ink text-lime">
        <Check className="h-4 w-4" />
      </span>
    </span>
  );
}

/** Burbuja de Lumina: escribe una frase una vez y después queda quieta. */
function TypedPhrases({ phrases }: { phrases: string[] }) {
  const reduced = useReducedMotionPreference();
  const [text, setText] = useState("");
  // Escribe cuando alguien la ve, no durante la carga lejos del viewport.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    const phrase = phrases[0] ?? "";
    if (reduced || phrase.length === 0) {
      setText(phrase);
      return;
    }
    if (!inView) return;

    setText("");
    let char = 0;
    const timer = window.setInterval(() => {
      char++;
      setText(phrase.slice(0, char));
      if (char >= phrase.length) window.clearInterval(timer);
    }, 42);
    return () => window.clearInterval(timer);
  }, [phrases, reduced, inView]);

  return (
    <div ref={ref} className="flex max-w-[90%] items-end gap-2 self-start">
      <p className="min-h-[2.9rem] rounded-[1.35rem] rounded-bl-md bg-white px-4 py-3 text-[0.9375rem] font-semibold leading-relaxed text-ink shadow-[0_10px_24px_-18px_hsl(var(--ink)/0.5)]">
        {text}
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-pulse bg-forest motion-reduce:animate-none"
        />
      </p>
    </div>
  );
}

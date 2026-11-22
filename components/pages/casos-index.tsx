"use client";

import { memo, startTransition, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { FaWhatsapp } from "@/components/ui/wa-icon";

import { SHOWREEL_SLUGS, ShowreelToggle, ShowreelVideo } from "@/components/pages/showreel";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { LIVE_CASE } from "@/lib/barber-os";
import { cardLoader, heroLoader } from "@/lib/image-loaders";
import { SPRING } from "@/lib/motion-fx";
import { desktopShot, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const TIPOS = ["web", "branding", "motion", "sistemas"] as const;
type Tipo = (typeof TIPOS)[number];
type Filter = "all" | Tipo;

/** Casos con problema, decisión y resultado escritos (lib/i18n). */
const CASE_SLUGS = ["koi-arquitectura-vercel-app", "efficientplasticolors-com", "element-experiences-com", "nkmohcafe-com"] as const;
type CaseSlug = (typeof CASE_SLUGS)[number];
const isCase = (slug: string): slug is CaseSlug => (CASE_SLUGS as readonly string[]).includes(slug);

/** Categoría de cada proyecto según lo que el propio proyecto dice ser:
 *  todos son sitios web; Repissa es "Marca y sitio web"; HomeFlow es una
 *  plataforma y CortMart usa Barber OS (sistemas). Motion aún no tiene
 *  proyectos publicados: la píldora lo dice en vez de prometer. */
const EXTRA_TIPOS: Record<string, Tipo[]> = {
  "repissa-vercel-app": ["branding"],
  "homeflowoficial-com": ["sistemas"],
};

interface Item {
  id: string;
  name: string;
  desc: string;
  url?: string;
  href?: string;
  image: string;
  tipos: Tipo[];
  caseSlug?: CaseSlug;
  cortmart?: boolean;
}

const WA = "https://wa.me/525663012505";

/**
 * /casos · índice con filtros en píldoras (Web / Branding / Motion /
 * Sistemas). La píldora activa va en verde oscuro y la URL cambia
 * (`?tipo=web`) para compartir el enlace. Al tocar un proyecto se abre un
 * modal con blur (proyecto grande + descripción) sin salir de la página.
 * Todo sale de lo que ya hay en el repo: capturas reales y textos de cada
 * caso. Lo que falta (MC Spine, Golden Muuse, Mixteca) no se inventa.
 */
export function CasosIndex() {
  const { t } = useLanguage();
  const c = t.v2.casesIndex;
  const [filter, setFilter] = useState<Filter>("all");
  // La píldora cambia al instante; la retícula se filtra en segundo plano
  // (useDeferredValue): el toque pinta enseguida y el INP queda bajo.
  const listFilter = useDeferredValue(filter);
  const [open, setOpen] = useState<Item | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => {
    const cort: Item = {
      id: "cortmart",
      name: LIVE_CASE.name,
      desc: t.v2.cases.cortmart.done,
      href: "/sistema-para-barberias",
      image: "/img/cv/shots/cortmart.webp",
      tipos: ["sistemas"],
      cortmart: true,
    };
    const cases = CASE_SLUGS.map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);
    const rest = projects.filter((p) => !isCase(p.slug) && p.shots !== false);
    return [
      cort,
      ...[...cases, ...rest].map((p) => ({
        id: p.slug,
        name: p.name,
        desc: t.projects.descs?.[p.slug as keyof typeof t.projects.descs] ?? p.desc,
        url: p.url,
        image: desktopShot(p.slug),
        tipos: ["web" as Tipo, ...(EXTRA_TIPOS[p.slug] ?? [])],
        caseSlug: isCase(p.slug) ? p.slug : undefined,
      })),
    ];
  }, [t]);

  // ?tipo=… al entrar (enlace compartido) y al ir atrás/adelante.
  useEffect(() => {
    const read = () => {
      const tipo = new URLSearchParams(window.location.search).get("tipo");
      setFilter(tipo && (TIPOS as readonly string[]).includes(tipo) ? (tipo as Tipo) : "all");
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("tipo");
    else url.searchParams.set("tipo", f);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  // La píldora activa siempre a la vista (en teléfono la fila se desliza).
  const pillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = pillsRef.current;
    const btn = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && btn) row.scrollTo({ left: btn.offsetLeft - row.offsetLeft - 8, behavior: "auto" });
  }, [filter]);

  const shown = useMemo(
    () => (listFilter === "all" ? items : items.filter((i) => i.tipos.includes(listFilter))),
    [items, listFilter]
  );
  const count = (f: Filter) => (f === "all" ? items.length : items.filter((i) => i.tipos.includes(f)).length);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const openItem = useCallback((item: Item, el: HTMLElement) => {
    lastTrigger.current = el;
    startTransition(() => setOpen(item));
  }, []);

  return (
    <section id="indice" aria-label={c.label} className="flex flex-col gap-gutter">
      <div className="panel flex flex-col gap-4 px-4 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div ref={pillsRef} role="group" aria-label={c.label} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["all", ...TIPOS] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97]",
                  active ? "bg-forest text-white" : "bg-mint text-ink ring-1 ring-inset ring-ink/10 hover:-translate-y-0.5 hover:ring-ink/30"
                )}
              >
                {c[f]}
                <span className={cn("rounded-full px-2 py-0.5 text-xs tabular-nums", active ? "bg-lime text-ink" : "bg-white text-ink/60")}>{count(f)}</span>
              </button>
            );
          })}
        </div>
        <p className="shrink-0 text-sm font-semibold text-ink/60" aria-live="polite">
          {shown.length} {c.count}
        </p>
      </div>

      {shown.length === 0 ? (
        <div className="panel flex flex-col items-start gap-4 p-6 shadow-soft sm:p-8">
          <p className="max-w-xl text-pretty text-lg text-ink/80">{c.empty}</p>
          <Button asChild size="lg" className="gap-2">
            <a href={`${WA}?text=${encodeURIComponent(`Hola, ¿tienes ejemplos de ${c[filter as Tipo]}?`)}`} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp aria-hidden className="h-4 w-4" />
              {c.emptyCta}
            </a>
          </Button>
        </div>
      ) : (
        <CasosGrid items={shown} onOpen={openItem} />
      )}

      <CasoModal item={open} onClose={close} />
    </section>
  );
}

/** La retícula, memorizada: abrir o cerrar el modal no la vuelve a pintar.
 *  Cada tarjeta entra con un fundido y escala corta en CSS (sin medir layout). */
const CasosGrid = memo(function CasosGrid({ items, onOpen }: { items: Item[]; onOpen: (item: Item, el: HTMLElement) => void }) {
  const { t } = useLanguage();
  const c = t.v2.casesIndex;
  return (
    <ul className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.id} className="casos-in min-w-0" style={{ "--i": Math.min(i, 8) } as CSSProperties}>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(e) => onOpen(item, e.currentTarget)}
            className="case-card lift-2 panel flex h-full w-full flex-col overflow-hidden p-2.5 text-left shadow-soft"
          >
            <span className="relative block aspect-[16/10] overflow-hidden rounded-inner bg-mint">
              <Image
                src={item.image}
                alt=""
                fill
                loader={cardLoader}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="case-card__img object-cover object-top"
              />
              <span aria-hidden className="case-card__shade absolute inset-0 bg-ink/45" />
              <span aria-hidden className="case-card__cta absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink">
                {c.open}
                <ArrowRight className="h-4 w-4" />
              </span>
              {(item.caseSlug || item.cortmart) && (
                <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">{c.caseBadge}</span>
              )}
            </span>
            <span className="flex flex-1 flex-col gap-1 px-2 pb-2 pt-4">
              <span className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">{item.name}</span>
              <span className="text-[0.9375rem] text-ink/65">{item.desc}</span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {item.tipos.map((tp) => (
                  <span key={tp} className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-ink/70">{c[tp]}</span>
                ))}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
});

function CasoModal({ item, onClose }: { item: Item | null; onClose: () => void }) {
  const { t } = useLanguage();
  const c = t.v2.casesIndex;
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  const story = item?.caseSlug ? t.projects.cases[item.caseSlug] : null;
  const labels = t.projects.caseLabels;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="caso-modal"
          className="case-modal__backdrop fixed inset-0 z-[125] grid place-items-center bg-ink/45 p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="caso-modal-title"
            className="panel relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-y-auto p-3 shadow-pop sm:p-4"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18 } }}
            transition={SPRING}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.lumina.close}
              className="absolute right-5 top-5 z-[2] grid size-11 place-items-center rounded-full bg-ink text-white shadow-pop transition-transform active:scale-[0.97]"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-inner bg-mint">
              <Image src={item.image} alt={`Captura del sitio de ${item.name}`} fill loader={heroLoader} sizes="(min-width: 1024px) 56rem, 96vw" className="object-cover object-top" />
            </div>
            <div className="grid gap-5 px-2 pb-2 pt-5 sm:px-4 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 flex-col gap-4">
              <h2 id="caso-modal-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                {item.name}
              </h2>
              <p className="text-[0.975rem] text-ink/70">{item.desc}</p>
              {story && (
                <dl className="grid gap-4 sm:grid-cols-3">
                  {(["problem", "decision", "result"] as const).map((k) => (
                    <div key={k} className="rounded-card bg-mint p-4">
                      <dt className="text-sm font-bold text-ink">{labels[k]}</dt>
                      <dd className="mt-1 text-[0.9375rem] text-ink/75">{story[k]}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {item.cortmart && (
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {LIVE_CASE.stats.map((s, i) => (
                    <div key={s.label} className="rounded-card bg-ink p-4">
                      <dd className="display-xl text-4xl leading-none text-lime">
                        {s.value}
                        {s.suffix}
                      </dd>
                      <dt className="mt-1 text-sm text-white/70">{t.v2.cases.cortmart.stats[i]}</dt>
                    </div>
                  ))}
                </dl>
              )}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                {item.caseSlug && (
                  <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
                    <a
                      href={`#${item.caseSlug}`}
                      onClick={() => {
                        onClose();
                        window.setTimeout(() => document.getElementById("casos-de-estudio")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
                      }}
                    >
                      {c.fullCase}
                      <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
                    </a>
                  </Button>
                )}
                {item.href && (
                  <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
                    <Link href={item.href}>
                      {c.fullCase}
                      <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
                    </Link>
                  </Button>
                )}
                {item.url && (
                  <Button asChild size="lg" variant="white" className="ring-1 ring-inset ring-ink/10">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {c.visit}
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            {/* El recorrido en video de la página real (showreel), con la
                misma pausa global de toda la página. */}
            {SHOWREEL_SLUGS.has(item.id) && (
              <div className="flex flex-col items-center gap-3 max-md:hidden">
                <div className="w-[11rem] rounded-[1.9rem] bg-ink p-[0.4rem] shadow-float">
                  <div className="relative aspect-[270/585] overflow-hidden rounded-[1.55rem] bg-white">
                    <ShowreelVideo slug={item.id} eager />
                  </div>
                </div>
                <ShowreelToggle />
              </div>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

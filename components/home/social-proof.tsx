"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { PhoneMockup } from "@/components/home/phone-mockup";
import { StatCounter } from "@/components/ui/stat-counter";
import { SPRING, useTilt } from "@/lib/motion-fx";
import { useLanguage } from "@/lib/i18n/context";
import { LIVE_CASE } from "@/lib/barber-os";
import { mobileShot, projects } from "@/lib/projects";

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

type CaseItem = {
  project: (typeof projects)[number];
  problem: string;
  done: string;
  number: string;
  label: string;
};

/** Tarjeta con tilt 3D sutil (máx. 4°) que sigue al cursor en escritorio. */
function TiltArticle({ children, className, style }: { children: React.ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  useTilt(ref, 4);
  return (
    <article ref={ref} className={className} style={style}>
      {children}
    </article>
  );
}

/**
 * Modal del caso: fondo con blur y entrada con resorte (escala 0.96 → 1).
 * Se cierra con la X, tocando fuera o con Esc; el foco vuelve a la tarjeta.
 */
function CaseModal({ item, onClose }: { item: CaseItem | null; onClose: () => void }) {
  const { t } = useLanguage();
  const c = t.v2.cases;
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
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="case-modal"
          className="case-modal__backdrop fixed inset-0 z-[80] grid place-items-center bg-ink/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-modal-title"
            className="panel relative grid max-h-[90dvh] w-full max-w-3xl gap-6 overflow-y-auto p-5 shadow-pop sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:p-7"
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
              className="absolute right-3 top-3 z-[2] grid size-11 place-items-center rounded-full bg-ink text-white transition-transform active:scale-[0.97]"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            <div className="rounded-card bg-mint px-6 py-6">
              <PhoneMockup src={mobileShot(item.project.slug)} alt={`Sitio de ${item.project.name} en un teléfono`} />
            </div>
            <div className="flex min-w-0 flex-col">
              <h3 id="case-modal-title" className="pr-12 font-display text-3xl font-semibold tracking-[-0.02em]">
                {item.project.name}
              </h3>
              <p className="mt-4 text-[0.975rem] text-ink/75">
                <span className="font-semibold text-ink">{t.projects.caseLabels.problem}: </span>
                {item.problem}
              </p>
              <p className="mt-2 text-[0.975rem] text-ink/75">
                <span className="font-semibold text-ink">{t.projects.caseLabels.decision}: </span>
                {item.done}
              </p>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="display-xl text-[3.25rem] leading-none text-ink">{item.number}</span>
                <span className="text-sm text-ink/65">{item.label}</span>
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
                  <Link href={`/casos#${item.project.slug}`}>
                    {c.viewCase}
                    <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="white" className="ring-1 ring-inset ring-ink/10">
                  <a href={item.project.url} target="_blank" rel="noopener noreferrer">
                    {t.projects.visitSite}
                    <ArrowUpRight aria-hidden className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Prompt 2 · Prueba social: tres casos reales grandes (en lugar de la tira de
 * 7 miniaturas y la sección de cifras suelta: los números viven aquí).
 *  - CortMart / Barber OS: cifras reales del panel en Fraunces gigante.
 *  - Efficient Plasticolors y Koi Arquitectura: su sitio real dentro de un
 *    teléfono que gira al entrar ("hero turn"); al pasar el mouse la captura
 *    se oscurece y aparece "Ver caso →" (patrón ui.live).
 * Entrada escalonada de izquierda a derecha, una sola vez. Sin video.
 * MC Spine y Golden Muuse aún no tienen texto ni capturas en el repo: no se
 * inventan, entran cuando Bryan los pase.
 */
export function SocialProof() {
  const { t } = useLanguage();
  const c = t.v2.cases;
  const efficient = bySlug("efficientplasticolors-com");
  const koi = bySlug("koi-arquitectura-vercel-app");

  const [open, setOpen] = useState<CaseItem | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeModal = () => {
    setOpen(null);
    lastTrigger.current?.focus();
  };

  const phones: CaseItem[] = [
    {
      project: efficient,
      problem: t.projects.cases["efficientplasticolors-com"].problem,
      done: t.projects.cases["efficientplasticolors-com"].decision,
      number: c.efficient.number,
      label: c.efficient.label,
    },
    {
      project: koi,
      problem: t.projects.cases["koi-arquitectura-vercel-app"].problem,
      done: t.projects.cases["koi-arquitectura-vercel-app"].decision,
      number: c.koi.number,
      label: c.koi.label,
    },
  ];

  return (
    <section id="casos" aria-labelledby="casos-title" className="flex flex-col gap-gutter">
      <div className="panel px-5 pb-6 pt-7 shadow-soft sm:px-8 sm:pt-9 lg:px-10 lg:pt-12">
        <SectionHeading
          eyebrow={t.projects.casesEyebrow}
          title={<span id="casos-title">{c.title}</span>}
          subtitle={c.subtitle}
        />
      </div>

      <div className="grid gap-gutter lg:grid-cols-3">
        {/* CortMart: cifras reales del panel que cuentan al entrar (preset 07). */}
        <article className="reveal panel panel-ink relative flex flex-col overflow-hidden p-6 sm:p-8" style={{ ["--stagger" as string]: 0 }}>
          <div aria-hidden className="mesh-glow-a opacity-70" />
          <div className="relative flex items-center justify-between gap-3">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">{c.cortmart.sector}</span>
          </div>
          <h3 className="relative mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-white">{LIVE_CASE.name}</h3>
          <p className="relative mt-2 text-[0.975rem] text-white/75">{c.cortmart.done}</p>
          <dl className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
            {LIVE_CASE.stats.map((stat, i) => (
              <div key={stat.label} className="reveal reveal-up" style={{ ["--stagger" as string]: i }}>
                <dd className="display-xl text-[clamp(3rem,6vw,4.5rem)] leading-none tabular-nums text-lime">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-1 text-sm text-white/70">{c.cortmart.stats[i]}</dt>
              </div>
            ))}
          </dl>
          <p className="relative mt-6 text-xs text-white/55">{c.cortmart.note}</p>
          <Button asChild size="lg" variant="white" className="relative mt-6 w-full justify-between pl-6 pr-2.5">
            <Link href="/sistema-para-barberias">
              {c.viewCase}
              <ButtonArrow tone="ink" className="-mr-0.5" />
            </Link>
          </Button>
        </article>

        {phones.map((item, i) => (
          <div key={item.project.slug} className="reveal flex" style={{ ["--stagger" as string]: i + 1 }}>
          <TiltArticle className="tilt panel flex w-full flex-col overflow-hidden p-4 shadow-soft sm:p-5">
            {/* La captura real en un teléfono; al hover la imagen crece al
                104 %, se oscurece y "Ver caso →" sube desde abajo. Abre el
                caso en un modal (con enlace al caso completo). */}
            <a
              href={`/casos#${item.project.slug}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                lastTrigger.current = e.currentTarget;
                setOpen(item);
              }}
              className="case-card relative block overflow-hidden rounded-card bg-mint px-6 py-8"
              aria-label={`${c.viewCase}: ${item.project.name}`}
              aria-haspopup="dialog"
            >
              <span className="case-card__img block">
                <PhoneMockup src={mobileShot(item.project.slug)} alt={`Sitio de ${item.project.name} en un teléfono`} />
              </span>
              <span aria-hidden className="case-card__shade absolute inset-0 bg-ink/55" />
              <span
                aria-hidden
                className="case-card__cta absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink"
              >
                {c.viewCase}
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{item.project.name}</h3>
                <a
                  href={item.project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-ink/60 hover:text-ink"
                >
                  {t.projects.visitSite}
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="mt-3 text-[0.9375rem] text-ink/70">
                <span className="font-semibold text-ink">{t.projects.caseLabels.problem}: </span>
                {item.problem}
              </p>
              <p className="mt-2 text-[0.9375rem] text-ink/70">
                <span className="font-semibold text-ink">{t.projects.caseLabels.decision}: </span>
                {item.done}
              </p>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="display-xl text-[3.25rem] leading-none text-ink">{item.number}</span>
                <span className="text-sm text-ink/65">{item.label}</span>
              </p>
              <Button asChild size="lg" variant="ink" className="mt-6 w-full justify-between pl-6 pr-2.5">
                <Link href={`/casos#${item.project.slug}`}>
                  {c.viewCase}
                  <ButtonArrow tone="lime" className="-mr-0.5" />
                </Link>
              </Button>
            </div>
          </TiltArticle>
          </div>
        ))}
      </div>
      <CaseModal item={open} onClose={closeModal} />
    </section>
  );
}

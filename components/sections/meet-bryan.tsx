"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { StatCounter } from "@/components/ui/stat-counter";
import { LazyMount } from "@/components/three/lazy-mount";
import { useSectionProgress } from "@/lib/use-section-progress";
import { useLanguage } from "@/lib/i18n/context";

const ParallaxShards = dynamic(
  () => import("@/components/three/parallax-shards").then((m) => m.ParallaxShards),
  { ssr: false }
);

const WHATSAPP = "https://wa.me/525663012505";

/**
 * Portada editorial de Bryan: su foto de trabajo a página completa con el nombre
 * gigante cruzando detrás en su propia capa de parallax, la bio al lado y
 * escombros 3D flotando al fondo. La foto entra en blanco y negro y toma
 * color conforme la descubres.
 */
export function MeetBryan() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const shardsProgress = useSectionProgress(sectionRef);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Capas a velocidades distintas: nombre lento, foto despacio, chip rápido.
  const nameY = useTransform(scrollYProgress, [0, 1], ["14%", "-28%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const gray = useTransform(scrollYProgress, [0.08, 0.32], [1, 0]);
  const photoFilter = useMotionTemplate`grayscale(${gray})`;
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.08, 1]);

  return (
    <section
      ref={sectionRef}
      id="bryan"
      aria-label={t.about.eyebrow}
      className="relative overflow-hidden border-t border-border"
    >
      <div aria-hidden className="mesh-glow-b opacity-50" />
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />

      {/* Escombros 3D al fondo, con parallax de scroll propio */}
      <LazyMount className="pointer-events-none absolute inset-0" rootMargin="600px">
        <ParallaxShards
          progressRef={shardsProgress}
          count={9}
          opacity={0.3}
          className="absolute inset-0"
        />
      </LazyMount>

      {/* Nombre gigante en capa profunda */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: nameY }}
        className="pointer-events-none absolute left-0 top-16 w-full select-none whitespace-nowrap md:top-14"
      >
        <span className="text-stroke-bone block text-center font-display text-[30vw] font-bold uppercase leading-none opacity-[0.14] md:text-[19vw]">
          Bryan&nbsp;F.
        </span>
      </motion.div>

      <div className="container relative z-10 grid gap-10 pb-10 pt-24 md:pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:gap-14 lg:pb-0">
        {/* Única foto de Bryan: la toma final del escritorio */}
        <motion.div
          style={reduced ? undefined : { y: photoY }}
          className="relative order-1 lg:order-1"
        >
          <div className="corner-ticks relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:aspect-auto lg:h-[86svh]">
            <motion.div
              style={reduced ? undefined : { filter: photoFilter, scale: photoScale }}
              className="absolute inset-0"
            >
              <Image
                src="/img/me/about-photo.png"
                alt="Bryan trabajando de noche en su escritorio"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-[58%_center] sm:object-center"
              />
            </motion.div>
            {/* Degradado para fundir la foto con la tinta del sitio */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/30 to-transparent" />

            {/* Ficha técnica sobre la foto */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.2, 0, 0, 1] }}
              className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 md:bottom-6 md:left-6 md:right-6"
            >
              <span className="glass rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground md:text-[11px]">
                Bryan F. — {t.about.role}
              </span>
              <span className="glass hidden rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary sm:inline-block md:text-[11px]">
                CDMX · MX
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Bio */}
        <div className="relative order-2 flex flex-col items-start gap-6 pb-6 lg:order-2 lg:pb-24">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="tech-label inline-flex items-center gap-3 text-primary"
          >
            <span className="h-1.5 w-1.5 bg-primary" />
            {t.about.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl xl:text-[3.4rem] xl:leading-[1.05]"
          >
            {t.about.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
          >
            {t.about.subtitle}
          </motion.p>

          {/* Chips de identidad */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.2, 0, 0, 1] }}
            className="flex flex-wrap gap-2"
          >
            {t.about.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          {/* Números en vivo */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.2, 0, 0, 1] }}
            className="grid w-full max-w-md grid-cols-3 divide-x divide-border border-y border-border"
          >
            <div className="flex flex-col gap-1 py-4 pr-4">
              <span className="font-display text-2xl font-bold text-foreground md:text-3xl">
                <StatCounter value={5} prefix="+" />
              </span>
              <span className="tech-label text-muted-foreground">{t.trust.years}</span>
            </div>
            <div className="flex flex-col gap-1 px-4 py-4">
              <span className="font-display text-2xl font-bold text-foreground md:text-3xl">
                <StatCounter value={100} prefix="+" />
              </span>
              <span className="tech-label text-muted-foreground">{t.trust.projects}</span>
            </div>
            <div className="flex flex-col gap-1 py-4 pl-4">
              <span className="font-display text-2xl font-bold text-foreground md:text-3xl">
                <StatCounter value={3} />
              </span>
              <span className="tech-label text-muted-foreground">{t.trust.days}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.2, 0, 0, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {t.about.ctaPrimary}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#proceso">{t.about.ctaSecondary}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const WHATSAPP = "https://wa.me/525663012505";

/**
 * Puente de autor.
 *
 * Primero presenta a Bryan y el trato directo; después traduce sus influencias
 * en tres criterios concretos de trabajo. La cultura personal vive en el
 * razonamiento —precisión, ritmo y conexión—, no en utilería temática.
 */
export function MeetBryan() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], ["10%", "-22%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const gray = useTransform(scrollYProgress, [0.08, 0.32], [1, 0]);
  const photoFilter = useMotionTemplate`grayscale(${gray})`;
  const photoScale = useTransform(scrollYProgress, [0, 0.4], [1.06, 1]);

  return (
    <section
      ref={sectionRef}
      id="bryan"
      aria-labelledby="bryan-title"
      className="relative overflow-hidden border-t border-border"
    >
      <div aria-hidden className="mesh-glow-b opacity-50" />
      <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />

      <motion.div
        aria-hidden
        style={reducedMotion ? undefined : { y: nameY }}
        className="pointer-events-none absolute left-0 top-16 w-full select-none whitespace-nowrap md:top-12"
      >
        <span className="text-stroke-bone block text-center font-display text-[30vw] font-bold uppercase leading-none opacity-[0.12] md:text-[18vw]">
          Bryan&nbsp;F.
        </span>
      </motion.div>

      <div className="container relative z-10 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-end lg:gap-16">
          <motion.div
            style={reducedMotion ? undefined : { y: photoY }}
            className="relative"
          >
            <div className="corner-ticks relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:h-[70svh] lg:aspect-auto">
              <motion.div
                style={
                  reducedMotion
                    ? undefined
                    : { filter: photoFilter, scale: photoScale }
                }
                className="absolute inset-0"
              >
                <Image
                  src="/img/me/about-photo.png"
                  alt={t.about.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-[58%_center] sm:object-center"
                />
              </motion.div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/30 to-transparent" />

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={
                  reducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.5,
                  ease: [0.2, 0, 0, 1],
                }}
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

          <div className="relative flex flex-col items-start gap-6 pb-2 lg:pb-10">
            <span className="tech-label inline-flex items-center gap-3 text-primary">
              <span className="h-1.5 w-1.5 bg-primary" />
              {t.about.eyebrow}
            </span>

            <h2
              id="bryan-title"
              className="max-w-xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl xl:text-[3.4rem] xl:leading-[1.05]"
            >
              {t.about.title}
            </h2>

            <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
              {t.about.subtitle}
            </p>

            <div className="max-w-xl border-l border-primary/60 pl-5">
              <p className="tech-label mb-3 text-primary">
                {t.about.inspirationLabel}
              </p>
              <p className="text-pretty text-base leading-relaxed text-foreground/85 md:text-lg">
                {t.about.inspiration}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {t.about.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  {t.about.ctaPrimary}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#proceso">{t.about.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative mt-14 border-y border-border md:mt-20">
          <p className="tech-label border-b border-border py-4 text-muted-foreground">
            {t.about.principlesLabel}
          </p>

          <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {t.about.principles.map((principle, index) => (
              <motion.article
                key={principle.title}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={
                  reducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: reducedMotion ? 0 : 0.5,
                  delay: reducedMotion ? 0 : index * 0.08,
                  ease: [0.2, 0, 0, 1],
                }}
                className="group relative flex flex-col gap-4 px-0 py-7 md:min-h-60 md:px-7 md:py-8 md:first:pl-0 md:last:pr-0"
              >
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full border border-primary bg-background shadow-[0_0_18px_hsl(var(--primary)/0.45)] transition-colors duration-200 group-hover:bg-primary"
                />
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {principle.title}
                </h3>
                <p className="flex-1 text-pretty leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
                <p className="tech-label text-primary/75">{principle.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

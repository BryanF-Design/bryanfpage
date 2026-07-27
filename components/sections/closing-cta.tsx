"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const WHATSAPP = "https://wa.me/525663012505";

export function ClosingCta() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();

  return (
    <section
      aria-label={t.closingCta.title}
      className="relative overflow-hidden border-t border-border py-24 md:py-32"
    >
      <div
        aria-hidden
        className="route-grid pointer-events-none absolute inset-0 opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,hsl(var(--primary)/0.12),transparent_36%)]"
      />

      <div className="container relative">
        <div className="editorial-panel chapter-rule overflow-hidden px-6 pb-7 pt-12 sm:px-8 md:px-12 md:pb-10 md:pt-16 lg:px-16">
          <div
            aria-hidden
            className="japan-halftone pointer-events-none absolute inset-0 opacity-25"
          />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <motion.h2
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: reducedMotion ? 0 : 0.62,
                ease: [0.2, 0, 0, 1],
              }}
              className="max-w-4xl text-balance font-display text-4xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:col-span-8 lg:text-7xl"
            >
              {t.closingCta.title}
            </motion.h2>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: reducedMotion ? 0 : 0.56,
                delay: reducedMotion ? 0 : 0.12,
                ease: [0.2, 0, 0, 1],
              }}
              className="lg:col-span-4"
            >
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                {t.closingCta.subtitle}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="#precios">{t.closingCta.ctaPrimary}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    {t.closingCta.ctaSecondary}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <div
            aria-hidden
            className="relative mt-12 flex items-center md:mt-16"
          >
            <span className="h-2.5 w-2.5 shrink-0 bg-[#E8342A] shadow-[0_0_18px_rgba(232,52,42,0.4)]" />
            <motion.span
              className="h-px flex-1 origin-left bg-gradient-to-r from-[#E8342A] via-primary to-primary/20"
              initial={reducedMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                delay: reducedMotion ? 0 : 0.24,
                ease: [0.2, 0, 0, 1],
              }}
            />
            <span className="h-2.5 w-2.5 shrink-0 bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

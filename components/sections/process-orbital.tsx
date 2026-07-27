"use client";

import { motion } from "framer-motion";
import { ClipboardList, Code2, FileSpreadsheet, LifeBuoy, Rocket } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const ICONS = [FileSpreadsheet, ClipboardList, Code2, Rocket, LifeBuoy];

export function ProcessOrbital() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const steps = t.process.steps.map((step, index) => ({
    ...step,
    icon: ICONS[index],
  }));

  return (
    <section
      id="proceso"
      aria-label={t.process.title}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div
        aria-hidden
        className="route-grid pointer-events-none absolute inset-0 opacity-35"
      />
      <div
        aria-hidden
        className="japan-halftone pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-20"
      />

      <div className="container relative">
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          subtitle={t.process.subtitle}
          chapter={{ kanji: "工程", romaji: "kōtei", index: 4 }}
        />

        <div className="editorial-panel relative mt-14 overflow-hidden md:mt-20">
          <div
            aria-hidden
            className="absolute left-0 top-0 hidden h-px w-full bg-gradient-to-r from-primary via-primary/70 to-[#E8342A] md:block"
          />

          <ol className="relative grid md:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <motion.li
                  key={step.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.5,
                    delay: reducedMotion ? 0 : index * 0.07,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="group relative min-h-0 border-l border-border px-6 pb-9 pt-8 md:min-h-[20rem] md:border-l-0 md:border-r md:px-5 md:pb-8 md:pt-10 md:last:border-r-0 lg:px-7"
                >
                  <span
                    aria-hidden
                    className={[
                      "absolute -left-[5px] top-10 h-[9px] w-[9px] border border-background md:-top-[5px] md:left-6",
                      isLast ? "bg-[#E8342A]" : "bg-primary",
                    ].join(" ")}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.2em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center border border-border bg-background/45 text-foreground/70 transition-colors duration-200 group-hover:border-primary/55 group-hover:text-primary">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>

                  <h3 className="mt-10 max-w-[13rem] font-display text-xl font-bold text-foreground md:mt-12 md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {step.content}
                  </p>

                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 right-4 font-display text-6xl font-bold leading-none text-foreground/[0.025] md:text-7xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.li>
              );
            })}
          </ol>

          <motion.div
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-primary/90 via-primary/35 to-[#E8342A]"
            initial={reducedMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: reducedMotion ? 0 : 1,
              delay: reducedMotion ? 0 : 0.18,
              ease: [0.2, 0, 0, 1],
            }}
          />
        </div>
      </div>
    </section>
  );
}

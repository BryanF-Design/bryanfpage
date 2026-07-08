"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

export function AboutPhoto() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      ref={ref}
      aria-label="Sobre Bryan"
      className="relative flex h-screen w-full items-end overflow-hidden"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src="/img/me/about-photo.png"
          alt="Bryan trabajando de noche en su escritorio, rodeado de plantas y luz cálida"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container relative z-10 flex flex-col gap-4 pb-20 md:pb-28"
      >
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
          <span className="h-px w-6 bg-primary" />
          {t.about.eyebrow}
        </span>
        <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {t.about.title}
        </h2>
        <p className="max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          {t.about.subtitle}
        </p>
      </motion.div>
    </section>
  );
}

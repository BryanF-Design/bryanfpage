"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Floating3d } from "@/components/three/floating-3d";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

export function ClosingCta() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-t border-border py-24 md:py-32">
      {/* Nudo toroidal 3D de fondo — puro ambiente, no intercepta clics. */}
      <Floating3d
        variant="torusKnot"
        opacity={0.22}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 -z-20 flex items-center justify-center">
        <motion.div
          className="h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container flex flex-col items-center gap-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl"
        >
          {t.closingCta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-xl text-muted-foreground"
        >
          {t.closingCta.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-2 flex flex-col gap-3 sm:flex-row"
        >
          <span className="relative inline-flex">
            <span className="absolute inset-0 -z-10 animate-ping rounded-md bg-primary/40 [animation-duration:2.5s]" />
            <Button asChild size="lg">
              <Link href="#precios">{t.closingCta.ctaPrimary}</Link>
            </Button>
          </span>
          <Button asChild size="lg" variant="outline">
            <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              {t.closingCta.ctaSecondary}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

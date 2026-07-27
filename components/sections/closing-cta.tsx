"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

export function ClosingCta() {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t.closingCta.title}
      className="relative overflow-hidden border-t border-border py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.12),transparent_52%)]"
      />

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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Sparkle } from "lucide-react";

import { SubscriberPanelView, type PanelData } from "@/components/subscriber-panel/panel-view";
import { SUBSCRIPTION_PLAN } from "@/lib/catalog";

const DAY = 86_400_000;

/**
 * Ejemplo del panel del suscriptor (/mi-panel) con datos de muestra, dentro
 * de una ventana de navegador. Es el mismo componente que usa el panel real.
 */
export function PanelDemo() {
  // Las fechas se calculan al montar: así el servidor y el navegador no
  // pintan días distintos.
  const [data, setData] = useState<PanelData | null>(null);
  useEffect(() => {
    const now = Date.now();
    setData({
      name: "Ana Torres",
      email: "ana@tunegocio.com",
      status: "active",
      provider: "stripe",
      amount: SUBSCRIPTION_PLAN.price,
      currency: "MXN",
      startedAt: now - 140 * DAY,
      periodStart: now - 18 * DAY,
      nextChargeAt: now + 12 * DAY,
      cancelAtPeriodEnd: false,
      charges: 5,
      now,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-8"
    >
      <div aria-hidden className="absolute -inset-x-6 -top-10 bottom-10 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_30%,hsl(var(--lime)/0.35),transparent_70%)] blur-2xl" />
      <div className="overflow-hidden rounded-[1.6rem] bg-canvas shadow-[0_50px_100px_-40px_hsl(var(--shade)/0.55)] ring-1 ring-ink/10">
        {/* Barra del navegador */}
        <div className="flex items-center gap-3 border-b border-ink/[0.08] bg-white/80 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto inline-flex min-w-0 max-w-full items-center gap-1.5 truncate rounded-full bg-ink/[0.05] px-4 py-1.5 text-xs font-medium text-ink/65">
            <Lock aria-hidden className="h-3 w-3 shrink-0" />
            bryanfdesign.com/mi-panel
          </span>
          <span className="hidden w-12 sm:block" />
        </div>
        <div className="relative p-3 sm:p-6">
          <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-[0.6875rem] font-bold text-lime sm:right-6 sm:top-6">
            <Sparkle aria-hidden className="h-3 w-3 fill-lime" />
            Datos de ejemplo
          </span>
          {data ? (
            <div aria-hidden className="pointer-events-none select-none">
              <SubscriberPanelView data={data} demo />
            </div>
          ) : (
            <div className="h-[40rem]" />
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        ¿Ya eres suscriptor?{" "}
        <Link href="/mi-panel" className="font-semibold text-ink underline underline-offset-4">
          Entra a tu panel
        </Link>
      </p>
    </motion.div>
  );
}

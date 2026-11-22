"use client";

import { Fragment, useState } from "react";

import { MarqueeToggle } from "@/components/sections/marquee-band";
import { useLanguage } from "@/lib/i18n/context";

/**
 * Preset 05 del demo · Marquee de clientes: nombres reales en Fraunces 560,
 * separados por "·" lima, bucle de 26 s (dos tramos idénticos a -50 %),
 * bordes que se desvanecen y pausa al pasar el cursor. El botón de pausa
 * cumple WCAG 2.2.2. Con movimiento reducido queda quieto.
 */
export function ClientMarquee({ names }: { names: string[] }) {
  const { t } = useLanguage();
  const [paused, setPaused] = useState(false);
  const run = (copy: number) => (
    <ul aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
      {names.map((name) => (
        <Fragment key={`${copy}-${name}`}>
          <li className="whitespace-nowrap px-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-[560] tracking-[-0.01em] text-ink">
            {name}
          </li>
          <li aria-hidden className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-lime-deep">
            ·
          </li>
        </Fragment>
      ))}
    </ul>
  );
  return (
    <section aria-label={t.clients.eyebrow} className="reveal diag-cut panel flex items-center gap-2 py-6 pl-2 pr-3 shadow-soft sm:py-7">
      <div className="client-marquee min-w-0 flex-1 overflow-hidden" data-paused={paused}>
        <div className="client-marquee__track">
          {run(0)}
          {run(1)}
        </div>
      </div>
      <MarqueeToggle paused={paused} onToggle={() => setPaused((v) => !v)} className="bg-ink text-white" />
    </section>
  );
}

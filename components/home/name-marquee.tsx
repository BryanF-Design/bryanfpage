"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";
import { projects } from "@/lib/projects";

/**
 * Tira lenta con nombres reales de clientes cuyo sitio está en línea, en
 * Fraunces. Solo transform; se detiene al pasar el mouse, con su botón de
 * pausa (WCAG 2.2.2) y queda quieta con movimiento reducido.
 */
export function NameMarquee() {
  const { t } = useLanguage();
  const [paused, setPaused] = useState(false);
  const names = projects.map((p) => p.name);

  return (
    <section aria-label={t.homeV2.cases.marqueeLabel} className="name-marquee full-bleed relative border-y border-ink/10 py-6">
      <div className="name-marquee__track" data-paused={paused}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="name-marquee__run">
            {names.map((name) => (
              <li key={name} className="font-display text-2xl italic text-ink/70 md:text-3xl">
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? t.marquee.play : t.marquee.pause}
        className="name-marquee__toggle absolute right-[var(--gutter)] top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-[hsl(var(--canvas))] text-ink/60 ring-1 ring-ink/10 hover:text-ink"
      >
        {paused ? <Play aria-hidden className="h-3.5 w-3.5" /> : <Pause aria-hidden className="h-3.5 w-3.5" />}
      </button>
    </section>
  );
}

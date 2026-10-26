"use client";

import { useEffect, useState } from "react";

import { posterKicker, seasonDef, seasonEndsAt, timeLeft } from "@/lib/seasons";

import { SeasonPoster } from "./season-poster";
import { useSiteSettings } from "./site-settings-provider";

/**
 * Cartel de temporada en la home, justo después del hero: la temporada no es
 * solo un adorno arriba, tiene su propio espacio con su arte, la promoción
 * vigente y lo que falta para que termine. Sale con "Decoración" encendida.
 */
export function SeasonFeature() {
  const { settings, season, discountsOn } = useSiteSettings();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!season || !settings.season.ranges[season].decorations) return null;

  const def = seasonDef(season);
  const discount = discountsOn && settings.discounts.global > 0 ? settings.discounts.global : 0;
  const endsAt = now !== null ? seasonEndsAt(settings, season, now) : null;

  return (
    <section aria-labelledby="season-feature-title" data-fx="up" className="season-feature">
      <SeasonPoster
        season={season}
        copy={{
          titleId: "season-feature-title",
          kicker: posterKicker(settings, season),
          title: def.poster.title,
          lead: def.poster.lead,
          text: def.poster.text,
          cta: discount ? `${def.poster.cta} con -${discount}%` : def.poster.cta,
          href: "/#precios",
          discount,
          discountLabel: settings.discounts.label || def.name,
          endsIn: endsAt && now !== null && endsAt > now ? timeLeft(endsAt - now) : null,
        }}
      />
    </section>
  );
}

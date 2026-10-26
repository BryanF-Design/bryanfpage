"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { announcementActive, seasonDef, seasonEndsAt, timeLeft } from "@/lib/seasons";

import { Marigold, MiniSkull } from "./art/muertos";
import { Tile, TILE_SEQUENCE } from "./art/navidad";
import { BlackTag, BuenFinMini } from "./art/ventas";
import { useSiteSettings } from "./site-settings-provider";

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * Aviso que cuelga debajo del header: el aviso propio del panel, o el de la
 * temporada con el descuento vigente y lo que falta para que termine. Se
 * cierra con la ×, y se esconde al bajar (lo decide el header con `hidden`).
 */
export function SeasonStrip({ hidden }: { hidden: boolean }) {
  const { settings, season, discountsOn } = useSiteSettings();
  const [now, setNow] = useState<number | null>(null);
  const [closed, setClosed] = useState(true);

  const custom = now !== null && announcementActive(settings, now);
  const seasonal = !!season && settings.season.ranges[season].banner;
  const text = custom
    ? settings.announcement.text
    : season
      ? settings.season.ranges[season].bannerText || seasonDef(season).banner
      : "";
  // Cerrar un aviso no esconde el siguiente: la llave cambia con el texto.
  const id = `bfd-strip-${custom ? `aviso-${hash(text)}` : season}`;

  useEffect(() => {
    setNow(Date.now());
    try {
      setClosed(window.sessionStorage.getItem(id) === "1");
    } catch {
      setClosed(false);
    }
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [id]);

  if (now === null || closed || !text || (!custom && !seasonal)) return null;

  const endsAt = custom
    ? settings.announcement.endsAt
      ? Date.parse(settings.announcement.endsAt)
      : null
    : season
      ? seasonEndsAt(settings, season, now)
      : null;
  const discount = discountsOn && settings.discounts.global > 0 ? settings.discounts.global : 0;
  const href = custom ? settings.announcement.href || "/#precios" : "/#precios";
  const cta = custom ? settings.announcement.cta || "Ver más" : discount ? "Aprovechar" : "Arma tu web";

  function close() {
    setClosed(true);
    try {
      window.sessionStorage.setItem(id, "1");
    } catch {
      /* sin storage */
    }
  }

  return (
    <div
      className={cn(
        "season-strip pointer-events-auto mx-auto mt-2 flex w-fit max-w-[min(42rem,100%)] items-center gap-2 rounded-full py-1.5 pl-2 pr-1.5 text-[0.8125rem] font-semibold shadow-[0_14px_30px_-20px_hsl(var(--shade)/0.6)] transition-[opacity,transform] duration-300 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none",
        hidden && "pointer-events-none -translate-y-2 opacity-0"
      )}
      data-season-strip={season ?? "aviso"}
      aria-hidden={hidden}
    >
      <span aria-hidden className="grid size-7 shrink-0 place-items-center">
        {season === "muertos" ? (
          <MiniSkull className="h-7 w-7" />
        ) : season === "navidad" ? (
          <Tile spec={TILE_SEQUENCE[1]} className="h-7 w-7 rounded-full" />
        ) : season === "buen-fin" ? (
          <BuenFinMini className="h-7 w-7" />
        ) : season ? (
          <BlackTag className="h-5 w-9" />
        ) : (
          <Marigold className="h-5 w-5" />
        )}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="line-clamp-2 sm:line-clamp-1">
          {discount > 0 && (
            <strong className="season-strip-pct mr-1 rounded-full px-1.5 py-0.5 text-[0.75rem]">-{discount}%</strong>
          )}
          {text}
        </span>
        {endsAt && endsAt > now && (
          <span className="block text-[0.6875rem] font-medium opacity-75 sm:inline sm:pl-1.5">Termina en {timeLeft(endsAt - now)}</span>
        )}
      </span>
      <Link
        href={href}
        tabIndex={hidden ? -1 : 0}
        className="season-strip-cta ml-1 inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-bold transition-transform hover:scale-[1.03] active:scale-95"
      >
        {cta}
        <ArrowRight aria-hidden className="h-3.5 w-3.5" />
      </Link>
      <button
        type="button"
        onClick={close}
        tabIndex={hidden ? -1 : 0}
        aria-label="Cerrar aviso"
        className="grid size-8 shrink-0 place-items-center rounded-full opacity-70 transition-opacity hover:opacity-100"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}

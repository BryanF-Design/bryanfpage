"use client";

import { CalendarHeart, Eye, EyeOff } from "lucide-react";

import { Calaverita, Cempasuchil, Copo, EtiquetaPrecio, GorroNavidad } from "@/components/season/season-art";
import {
  SEASONS,
  activeSeason,
  inRange,
  mexicoMonthDay,
  type SeasonId,
  type SeasonRange,
  type SiteSettings,
} from "@/lib/seasons";
import { cn } from "@/lib/utils";

import { Card, Field, Input, Pill, Toggle } from "./admin-ui";

const ART: Record<SeasonId, React.ReactNode> = {
  muertos: (
    <>
      <Calaverita className="h-12 w-12 -rotate-6" />
      <Cempasuchil className="h-8 w-8" />
    </>
  ),
  "buen-fin": <EtiquetaPrecio className="h-10 w-14" fill="#e5484d" text="%" />,
  "black-friday": <EtiquetaPrecio className="h-10 w-14" fill="#101a16" text="BF" />,
  navidad: (
    <>
      <GorroNavidad className="h-10 w-12" />
      <Copo className="h-7 w-7 text-sky-400" />
    </>
  ),
};

const SWATCH: Record<SeasonId, string> = {
  muertos: "linear-gradient(120deg,#fbb423,#f39012 50%,#e2307a)",
  "buen-fin": "linear-gradient(120deg,#ffd1d8,#ff6f87)",
  "black-friday": "linear-gradient(120deg,#101a16,#2c3a33)",
  navidad: "linear-gradient(120deg,#f6d36b,#2fa86b)",
};

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const human = (md: string) => `${Number(md.slice(3))} ${MONTHS[Number(md.slice(0, 2)) - 1]}`;

/** Días hasta que empiece (o null si ya pasó / está activa). */
function daysUntil(start: string, now: number) {
  const year = new Date(now).getFullYear();
  let target = Date.parse(`${year}-${start}T00:00:00-06:00`);
  if (target < now) target = Date.parse(`${year + 1}-${start}T00:00:00-06:00`);
  return Math.ceil((target - now) / 86_400_000);
}

/**
 * Temporadas: cada una con sus fechas (se activa y se apaga sola), su paleta,
 * decoración y aviso. Se puede forzar una o apagarlas todas. "Vista previa"
 * abre el sitio con esa temporada solo en tu pestaña.
 */
export function SeasonsTab({
  draft,
  setDraft,
  now,
}: {
  draft: SiteSettings;
  setDraft: React.Dispatch<React.SetStateAction<SiteSettings>>;
  now: number;
}) {
  const current = activeSeason(draft, now);
  const md = mexicoMonthDay(now);
  const year = new Date(now).getFullYear();

  const setRange = (id: SeasonId, patch: Partial<SeasonRange>) =>
    setDraft((d) => ({
      ...d,
      season: { ...d.season, ranges: { ...d.season.ranges, [id]: { ...d.season.ranges[id], ...patch } } },
    }));

  return (
    <>
      <Card id="seasons-title" title="Temporadas" icon={CalendarHeart}>
        <p className="text-sm text-ink/65">
          {current ? (
            <>
              Ahora mismo se ve: <strong className="text-ink">{SEASONS.find((s) => s.id === current)?.name}</strong>.
            </>
          ) : (
            "Ahora mismo no hay temporada activa: el sitio se ve normal."
          )}
        </p>
        <div role="radiogroup" aria-label="Cómo se eligen las temporadas" className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["auto", "Automático", "Según las fechas de cada una"],
              ["manual", "Forzar una", "La que elijas, sin importar la fecha"],
              ["off", "Apagado", "El sitio siempre normal"],
            ] as const
          ).map(([id, label, hint]) => (
            <label
              key={id}
              className={cn(
                "flex cursor-pointer flex-col gap-0.5 rounded-[1.1rem] p-3.5 ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest",
                draft.season.mode === id ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-ink/[0.1] hover:ring-ink/30"
              )}
            >
              <input
                type="radio"
                name="season-mode"
                className="sr-only"
                checked={draft.season.mode === id}
                onChange={() => setDraft((d) => ({ ...d, season: { ...d.season, mode: id } }))}
              />
              <span className="text-sm font-bold">{label}</span>
              <span className={cn("text-xs", draft.season.mode === id ? "text-white/65" : "text-ink/55")}>{hint}</span>
            </label>
          ))}
        </div>
        {draft.season.mode === "manual" && (
          <Field label="Temporada forzada" className="sm:max-w-xs">
            <select
              value={draft.season.manual}
              onChange={(e) => setDraft((d) => ({ ...d, season: { ...d.season, manual: e.target.value as SeasonId } }))}
              className="h-11 rounded-[0.9rem] border border-ink/[0.12] bg-white px-3.5 text-sm text-ink"
            >
              {SEASONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </Card>

      <div className="grid gap-gutter xl:grid-cols-2">
        {SEASONS.map((s) => {
          const r = draft.season.ranges[s.id];
          const live = current === s.id;
          const running = r.enabled && inRange(md, r.start, r.end);
          const until = daysUntil(r.start, now);
          return (
            <section key={s.id} aria-labelledby={`season-${s.id}`} className="panel flex flex-col overflow-hidden shadow-soft">
              <div className="flex items-end justify-between gap-3 p-5 text-ink" style={{ background: SWATCH[s.id] }}>
                <div className={cn("flex min-w-0 flex-col items-start gap-2", s.id === "black-friday" && "text-white")}>
                  {live ? (
                    <Pill tone="ink">● En el sitio ahora</Pill>
                  ) : !r.enabled ? (
                    <Pill>Desactivada</Pill>
                  ) : running ? (
                    <Pill tone="ink">En fechas</Pill>
                  ) : (
                    <Pill tone="mint">Empieza en {until} días</Pill>
                  )}
                  <h3 id={`season-${s.id}`} className="display-title text-2xl leading-none">
                    {s.name}
                  </h3>
                  <p className="text-sm font-semibold opacity-80">
                    {human(r.start)} – {human(r.end)}
                  </p>
                </div>
                <span aria-hidden className="flex shrink-0 items-end gap-1">
                  {ART[s.id]}
                </span>
              </div>
              <div className="flex flex-col gap-4 p-5">
                <Toggle
                  checked={r.enabled}
                  onChange={(v) => setRange(s.id, { enabled: v })}
                  label="Activar en sus fechas"
                  description="En automático se prende y se apaga sola."
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Empieza">
                    <Input type="date" value={`${year}-${r.start}`} onChange={(e) => e.target.value && setRange(s.id, { start: e.target.value.slice(5) })} />
                  </Field>
                  <Field label="Termina (incluido)">
                    <Input type="date" value={`${r.start > r.end ? year + 1 : year}-${r.end}`} onChange={(e) => e.target.value && setRange(s.id, { end: e.target.value.slice(5) })} />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Toggle checked={r.palette} onChange={(v) => setRange(s.id, { palette: v })} label="Colores" description="Cambia el lima por el de la temporada" />
                  <Toggle checked={r.decorations} onChange={(v) => setRange(s.id, { decorations: v })} label="Decoración" description={s.id === "muertos" ? "Papel picado, pétalos y calaverita" : s.id === "navidad" ? "Luces, nieve y gorro" : "Banderines y etiquetas"} />
                  <Toggle checked={r.banner} onChange={(v) => setRange(s.id, { banner: v })} label="Aviso arriba" description="Píldora bajo el menú" />
                </div>
                <Field label="Texto del aviso" hint="Vacío: se usa el sugerido.">
                  <Input value={r.bannerText} maxLength={180} onChange={(e) => setRange(s.id, { bannerText: e.target.value })} placeholder={s.banner} />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/?temporada=${s.id}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-forest"
                  >
                    <Eye aria-hidden className="h-4 w-4 text-lime" />
                    Vista previa
                  </a>
                  <a
                    href="/?temporada=fin"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    <EyeOff aria-hidden className="h-4 w-4" />
                    Quitar vista previa
                  </a>
                </div>
                <p className="text-xs text-ink/50">La vista previa usa lo ya guardado y solo se ve en tu navegador.</p>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

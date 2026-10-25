"use client";

import { BadgePercent, RotateCcw } from "lucide-react";

import {
  CONFIGURATOR_MODULES,
  CONFIGURATOR_PLANS,
  ENTRY_SERVICE_PRICES,
  SECTION_PRICE,
  SUBSCRIPTION_PLAN,
} from "@/lib/catalog";
import { DISCOUNTABLE, applyPct, discountsActive, seasonDef, activeSeason, type SiteSettings } from "@/lib/seasons";
import { cn } from "@/lib/utils";

import { Card, Field, Input, Notice, Toggle, money } from "./admin-ui";

/** Precio de lista (MXN) de cada partida con descuento. */
const BASE: Record<string, number> = {
  ...Object.fromEntries(CONFIGURATOR_PLANS.map((p) => [`plan:${p.id}`, p.price])),
  ...Object.fromEntries(CONFIGURATOR_MODULES.map((m) => [`module:${m.id}`, m.price])),
  sections: SECTION_PRICE,
  ...Object.fromEntries(ENTRY_SERVICE_PRICES.map((e) => [`entry:${e.id}`, e.price])),
};

const PRESETS = [10, 15, 20, 25, 30, 40];

/** ISO ↔ valor de <input type="datetime-local"> (hora local del navegador). */
function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : "");

/**
 * Descuentos: un % para todo y, si quieres, uno distinto por servicio. Se ve
 * tachado en el cotizador y en los servicios de entrada, y Stripe / Mercado
 * Pago cobran ya con el descuento (lo aplica el servidor).
 */
export function DiscountsTab({
  draft,
  setDraft,
  now,
}: {
  draft: SiteSettings;
  setDraft: React.Dispatch<React.SetStateAction<SiteSettings>>;
  now: number;
}) {
  const d = draft.discounts;
  const set = (patch: Partial<SiteSettings["discounts"]>) => setDraft((s) => ({ ...s, discounts: { ...s.discounts, ...patch } }));
  const setService = (key: string, value: number | null) =>
    setDraft((s) => {
      const services = { ...s.discounts.services };
      if (value === null) delete services[key];
      else services[key] = value;
      return { ...s, discounts: { ...s.discounts, services } };
    });
  const live = discountsActive(draft, now);
  const season = activeSeason(draft, now);
  const groups = Array.from(new Set(DISCOUNTABLE.map((x) => x.group)));

  return (
    <>
      <Card id="discounts-title" title="Descuentos" icon={BadgePercent}>
        {d.enabled && !live && <Notice tone="info">La promoción ya venció: quita la fecha de fin o pon otra.</Notice>}
        <Toggle
          checked={d.enabled}
          onChange={(v) => set({ enabled: v })}
          label="Activar descuentos en el sitio"
          description="Se muestran tachados y se cobran con descuento en tarjeta y Mercado Pago."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre de la promoción" hint="Sale en el aviso y en el pop-up.">
            <Input
              value={d.label}
              maxLength={60}
              onChange={(e) => set({ label: e.target.value })}
              placeholder={season ? seasonDef(season).name : "Promoción de temporada"}
            />
          </Field>
          <Field label="Termina" hint="Vacío: sin fecha de fin. Se apaga sola a esa hora.">
            <Input type="datetime-local" value={toLocalInput(d.endsAt)} onChange={(e) => set({ endsAt: fromLocalInput(e.target.value) })} />
          </Field>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink/70">Descuento para todos los servicios</span>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="range"
              min={0}
              max={90}
              step={1}
              value={d.global}
              onChange={(e) => set({ global: Number(e.target.value) })}
              aria-label="Porcentaje de descuento global"
              className="h-2 w-full max-w-sm cursor-pointer accent-[hsl(var(--ink))]"
            />
            <span className="display-title min-w-[4.5rem] text-3xl tabular-nums text-ink">{d.global}%</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set({ global: p })}
                aria-pressed={d.global === p}
                className={cn(
                  "min-h-9 rounded-full px-3.5 text-sm font-bold transition-colors",
                  d.global === p ? "bg-lime text-ink" : "bg-ink/[0.05] text-ink hover:bg-ink/10"
                )}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      </Card>

      {groups.map((group) => (
        <Card key={group} id={`disc-${group}`} title={group}>
          <div className="overflow-x-auto rounded-[1.25rem] ring-1 ring-ink/[0.08]">
            <table className="w-full min-w-[34rem] bg-white text-left text-sm">
              <caption className="sr-only">Descuento por servicio: {group}</caption>
              <thead className="bg-ink/[0.03] text-xs text-ink/60">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Servicio</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Precio</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Descuento</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Queda en</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.06]">
                {DISCOUNTABLE.filter((x) => x.group === group).map(({ key, label }) => {
                  const own = d.services[key];
                  const pct = own === null || own === undefined ? d.global : own;
                  const base = BASE[key] ?? 0;
                  return (
                    <tr key={key}>
                      <th scope="row" className="px-4 py-3 font-semibold text-ink">
                        {label}
                        {key === "sections" && <span className="block text-xs font-normal text-ink/50">por sección</span>}
                      </th>
                      <td className="px-4 py-3 tabular-nums text-ink/70">{money(base)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <label className="sr-only" htmlFor={`pct-${key}`}>
                            Descuento de {label}
                          </label>
                          <input
                            id={`pct-${key}`}
                            inputMode="numeric"
                            value={own === null || own === undefined ? "" : String(own)}
                            placeholder={`${d.global}`}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "");
                              setService(key, v === "" ? null : Math.min(90, Number(v)));
                            }}
                            className="h-10 w-20 rounded-[0.8rem] border border-ink/[0.12] bg-white px-3 text-right text-sm tabular-nums outline-none focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)]"
                          />
                          <span className="text-ink/55">%</span>
                          {own !== null && own !== undefined && (
                            <button
                              type="button"
                              onClick={() => setService(key, null)}
                              aria-label={`Usar el descuento general en ${label}`}
                              title="Usar el general"
                              className="grid size-8 place-items-center rounded-full text-ink/50 hover:bg-ink/[0.06] hover:text-ink"
                            >
                              <RotateCcw aria-hidden className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {d.enabled && pct > 0 ? (
                          <>
                            <span className="mr-2 text-xs text-ink/45 line-through">{money(base)}</span>
                            <strong className="tabular-nums text-ink">{money(applyPct(base, pct))}</strong>
                          </>
                        ) : (
                          <span className="tabular-nums text-ink/70">{money(base)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink/55">Vacío = usa el {d.global}% general. Escribe 0 para dejar un servicio sin descuento.</p>
        </Card>
      ))}

      <p className="px-1 text-xs text-ink/55">
        La suscripción Todo Digital ({money(SUBSCRIPTION_PLAN.price)} al mes) no lleva descuento automático: es un cobro recurrente y su
        precio se cambia en Stripe y Mercado Pago.
      </p>
    </>
  );
}

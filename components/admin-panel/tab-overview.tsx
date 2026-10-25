"use client";

import { useMemo } from "react";
import { AlertTriangle, ArrowRight, BadgePercent, CalendarClock, CalendarHeart, Repeat, TrendingUp, Users, Wallet } from "lucide-react";

import { SEASONS, activeSeason, discountsActive, type SiteSettings } from "@/lib/seasons";

import type { AdminData, TabId } from "./admin-app";
import { Card, DAY, Pill, Stat, TZ, money, shortDate } from "./admin-ui";
import { buildClients } from "./clients";
import { isActive, needsAttention } from "./tab-subscriptions";

const monthKey = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" }).format(ms);
const monthLabel = (ms: number) => new Intl.DateTimeFormat("es-MX", { timeZone: TZ, month: "short" }).format(ms);

/** Resumen: cifras del negocio, temporada y descuento vigentes y lo reciente. */
export function OverviewTab({ data, draft, go }: { data: AdminData; draft: SiteSettings; go: (tab: TabId) => void }) {
  const now = data.fetchedAt;

  const stats = useMemo(() => {
    const subs = data.subscribers.subscribers;
    const active = subs.filter(isActive);
    const mrr = active.filter((s) => !s.cancelAtPeriodEnd && s.currency === "MXN").reduce((sum, s) => sum + s.amount, 0);
    // Mensualidades por transferencia que lleva Bryan a mano.
    const manual = data.accounts.filter(
      (a) => (a.tipo === "transferencia" || a.tipo === "suscripcion") && a.estado === "activa" && a.proximo_cobro && Number(a.monto) > 0
    );
    const manualMrr = manual.reduce((sum, a) => sum + (a.moneda === "MXN" ? Number(a.monto) : 0), 0);
    const thisMonth = monthKey(now);
    const monthSales = data.payments
      .filter((p) => p.moneda === "MXN" && monthKey(Date.parse(p.creada)) === thisMonth)
      .reduce((sum, p) => sum + Number(p.monto), 0);
    const upcoming = [
      ...active.filter((s) => s.nextChargeAt).map((s) => ({ name: s.name || s.email, at: s.nextChargeAt as number, amount: s.amount, via: s.provider === "stripe" ? "Stripe" : "Mercado Pago" })),
      ...manual.map((a) => ({ name: a.nombre || a.email, at: Date.parse(a.proximo_cobro as string), amount: Number(a.monto), via: "Transferencia" })),
    ]
      .filter((u) => u.at >= now - DAY)
      .sort((a, b) => a.at - b.at);

    // Ventas de los últimos 6 meses (pagos únicos en MXN).
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setDate(15);
      d.setMonth(d.getMonth() - (5 - i));
      return { key: monthKey(d.getTime()), label: monthLabel(d.getTime()), total: 0 };
    });
    for (const p of data.payments) {
      if (p.moneda !== "MXN") continue;
      const m = months.find((x) => x.key === monthKey(Date.parse(p.creada)));
      if (m) m.total += Number(p.monto);
    }

    return {
      active: active.length + manual.length,
      mrr: mrr + manualMrr,
      monthSales,
      clients: buildClients(data).length,
      attention: subs.filter(needsAttention).length,
      week: upcoming.filter((u) => u.at - now <= 7 * DAY),
      upcoming: upcoming.slice(0, 5),
      months,
    };
  }, [data, now]);

  const season = activeSeason(draft, now);
  const discountOn = discountsActive(draft, now);
  const max = Math.max(1, ...stats.months.map((m) => m.total));

  return (
    <>
      <section aria-label="Cifras" className="grid grid-cols-2 gap-gutter xl:grid-cols-4">
        <Stat icon={Wallet} label="Ingreso mensual recurrente" value={money(stats.mrr)} note="suscripciones activas" dark />
        <Stat icon={TrendingUp} label="Ventas este mes" value={money(stats.monthSales)} note="pagos únicos" />
        <Stat icon={Repeat} label="Planes activos" value={String(stats.active)} note={`${stats.week.length} cobros en 7 días`} />
        <Stat icon={Users} label="Clientes" value={String(stats.clients)} note={stats.attention ? `${stats.attention} requieren atención` : "todo en orden"} />
      </section>

      <div className="grid gap-gutter xl:grid-cols-5">
        <Card id="sales-title" title="Ventas por mes" icon={TrendingUp} className="xl:col-span-3">
          <figure>
            <div className="flex h-44 items-end gap-2 sm:gap-3" role="img" aria-label={stats.months.map((m) => `${m.label}: ${money(m.total)}`).join(", ")}>
              {stats.months.map((m, i) => (
                <div key={m.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="text-[0.6875rem] font-bold tabular-nums text-ink/70">{m.total ? money(m.total) : ""}</span>
                  <span
                    className={i === stats.months.length - 1 ? "w-full rounded-t-[0.6rem] bg-lime" : "w-full rounded-t-[0.6rem] bg-ink/80"}
                    style={{ height: `${Math.max(3, (m.total / max) * 100)}%` }}
                  />
                  <span className="text-xs font-semibold capitalize text-ink/60">{m.label}</span>
                </div>
              ))}
            </div>
            <figcaption className="mt-3 text-xs text-ink/55">Pagos únicos en MXN (Stripe, Mercado Pago y transferencias).</figcaption>
          </figure>
        </Card>

        <div className="flex flex-col gap-gutter xl:col-span-2">
          <Card id="season-now" title="Temporada" icon={CalendarHeart} action={<GoButton onClick={() => go("temporadas")} />}>
            <p className="text-sm text-ink/70">
              {season ? (
                <>
                  En el sitio: <strong className="text-ink">{SEASONS.find((s) => s.id === season)?.name}</strong>
                  {draft.season.mode === "manual" ? " (forzada)" : " (por fechas)"}
                </>
              ) : draft.season.mode === "off" ? (
                "Temporadas apagadas."
              ) : (
                "Sin temporada activa hoy."
              )}
            </p>
          </Card>
          <Card id="discount-now" title="Descuento" icon={BadgePercent} action={<GoButton onClick={() => go("descuentos")} />}>
            <p className="text-sm text-ink/70">
              {discountOn ? (
                <>
                  <Pill tone="lime">Activo</Pill> {draft.discounts.global}% general
                  {draft.discounts.label ? ` · ${draft.discounts.label}` : ""}
                  {draft.discounts.endsAt ? ` · hasta ${shortDate(Date.parse(draft.discounts.endsAt))}` : ""}
                </>
              ) : (
                "Sin descuento activo."
              )}
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-gutter xl:grid-cols-2">
        <Card id="upcoming-title" title="Próximos cobros" icon={CalendarClock} action={<GoButton onClick={() => go("suscripciones")} />}>
          {stats.upcoming.length ? (
            <ul className="flex flex-col divide-y divide-ink/[0.07]">
              {stats.upcoming.map((u, i) => {
                const days = Math.ceil((u.at - now) / DAY);
                return (
                  <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{u.name}</span>
                      <span className="block text-xs text-ink/55">
                        {shortDate(u.at)} · {u.via}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-bold tabular-nums">{money(u.amount)}</span>
                      <span className="block text-xs text-ink/55">{days <= 0 ? "hoy" : days === 1 ? "mañana" : `en ${days} días`}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-ink/55">Sin cobros próximos.</p>
          )}
        </Card>
        <Card id="recent-title" title="Pagos recientes" icon={Wallet} action={<GoButton onClick={() => go("pagos")} />}>
          {data.payments.length ? (
            <ul className="flex flex-col divide-y divide-ink/[0.07]">
              {data.payments.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{p.nombre || p.email}</span>
                    <span className="block truncate text-xs text-ink/55">
                      {shortDate(Date.parse(p.creada))} · {p.descripcion}
                    </span>
                  </span>
                  <span className="shrink-0 font-bold tabular-nums">{money(Number(p.monto), p.moneda)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink/55">Aún no hay pagos.</p>
          )}
        </Card>
      </div>

      {stats.attention > 0 && (
        <button
          type="button"
          onClick={() => go("suscripciones")}
          className="flex items-center gap-3 rounded-[1.25rem] bg-destructive/10 px-4 py-3 text-left text-sm font-semibold text-destructive"
        >
          <AlertTriangle aria-hidden className="h-4 w-4 shrink-0" />
          {stats.attention} {stats.attention === 1 ? "suscripción requiere" : "suscripciones requieren"} atención (cobro fallido, pausa o
          cancelación).
          <ArrowRight aria-hidden className="ml-auto h-4 w-4" />
        </button>
      )}
    </>
  );
}

function GoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-9 items-center gap-1 rounded-full bg-ink/[0.05] px-3 text-xs font-bold text-ink transition-colors hover:bg-ink hover:text-white"
    >
      Ver <ArrowRight aria-hidden className="h-3.5 w-3.5" />
    </button>
  );
}

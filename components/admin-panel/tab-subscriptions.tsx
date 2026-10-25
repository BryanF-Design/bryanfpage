"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Download, Eye, Mail, Phone, Search, XCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { cn } from "@/lib/utils";
import type { Subscriber, SubscriberStatus, SubscribersResult } from "@/lib/subscribers";

const DAY = 86_400_000;
const TZ = "America/Mexico_City";

export const STATUS: Record<SubscriberStatus, { label: string; tone: string }> = {
  active: { label: "Activa", tone: "bg-lime text-ink" },
  trialing: { label: "Prueba", tone: "bg-mint text-ink" },
  past_due: { label: "Cobro fallido", tone: "bg-destructive text-white" },
  paused: { label: "Pausada", tone: "bg-ink/10 text-ink" },
  pending: { label: "Pendiente", tone: "bg-ink/10 text-ink" },
  canceled: { label: "Cancelada", tone: "bg-ink text-white/80" },
  other: { label: "Otro", tone: "bg-ink/10 text-ink" },
};

export const PROVIDER = { stripe: "Stripe · tarjeta", mercadopago: "Mercado Pago" } as const;

type Filter = "all" | "active" | "attention" | "canceled";
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "attention", label: "Requieren atención" },
  { id: "canceled", label: "Cancelados" },
];

export const isActive = (s: Subscriber) => s.status === "active" || s.status === "trialing";
export const needsAttention = (s: Subscriber) =>
  s.status === "past_due" || s.status === "paused" || s.status === "pending" || s.cancelAtPeriodEnd;

function money(value: number, currency: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function date(ms: number | null) {
  if (!ms) return "—";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: TZ }).format(ms);
}

function daysLeftLabel(days: number) {
  if (days <= 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `Faltan ${days} días`;
}

/** Pestaña Suscripciones: en vivo de Stripe y Mercado Pago. */
export function SubscriptionsTab({ data, previewHref }: { data: SubscribersResult; previewHref: (email: string) => string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  // "Ahora" es el momento de la consulta: servidor y navegador cuentan igual.
  const now = data.fetchedAt;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.subscribers
      .filter((s) =>
        filter === "active"
          ? isActive(s)
          : filter === "attention"
            ? needsAttention(s)
            : filter === "canceled"
              ? s.status === "canceled"
              : true
      )
      .filter((s) => !q || `${s.name} ${s.email} ${s.phone} ${s.id}`.toLowerCase().includes(q))
      .sort((a, b) => {
        // Primero lo que se cobra antes; los cancelados al final, del más reciente.
        if (a.nextChargeAt && b.nextChargeAt) return a.nextChargeAt - b.nextChargeAt;
        if (a.nextChargeAt) return -1;
        if (b.nextChargeAt) return 1;
        return (b.canceledAt || b.startedAt || 0) - (a.canceledAt || a.startedAt || 0);
      });
  }, [data.subscribers, filter, query]);

  /** Descarga la lista filtrada en CSV (abre en Excel o Google Sheets). */
  function exportCsv() {
    const head = ["Nombre", "Correo", "Teléfono", "Estado", "Proveedor", "Monto", "Moneda", "Suscrito desde", "Próximo cobro", "Días restantes", "ID"];
    const iso = (ms: number | null) => (ms ? new Date(ms).toISOString().slice(0, 10) : "");
    const lines = rows.map((s) => [
      s.name,
      s.email,
      s.phone,
      STATUS[s.status].label,
      PROVIDER[s.provider],
      String(s.amount),
      s.currency,
      iso(s.startedAt),
      iso(s.nextChargeAt),
      s.nextChargeAt ? String(Math.ceil((s.nextChargeAt - now) / DAY)) : "",
      s.id,
    ]);
    downloadCsv(`suscriptores-${new Date(now).toISOString().slice(0, 10)}.csv`, [head, ...lines]);
  }

  return (
    <section aria-labelledby="subs-title" className="panel flex flex-col gap-4 p-4 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="subs-title" className="display-title text-xl text-ink">
          Suscriptores <span className="text-ink/45">({rows.length})</span>
        </h2>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <label className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <span className="sr-only">Buscar</span>
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre, correo o teléfono"
              className="h-11 w-full rounded-full border border-ink/[0.12] bg-white pl-10 pr-4 text-sm text-ink outline-none focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)]"
            />
          </label>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!rows.length}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-40"
          >
            <Download aria-hidden className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>
      <div role="group" aria-label="Filtrar" className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors",
              filter === f.id ? "bg-ink text-white" : "bg-ink/[0.05] text-ink hover:bg-ink/10"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-[1.25rem] bg-mint px-5 py-10 text-center text-sm font-medium text-ink/70">
          {data.subscribers.length ? "Nadie coincide con este filtro." : "Aún no hay suscriptores registrados en Stripe ni en Mercado Pago."}
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-2.5">
          {rows.map((s) => (
            <SubscriberRow key={`${s.provider}-${s.id}`} s={s} now={now} previewHref={previewHref} />
          ))}
        </ul>
      )}
      <p className="text-xs text-ink/55">
        Datos en vivo de Stripe y Mercado Pago. Las mensualidades por transferencia se llevan en Clientes.
      </p>
    </section>
  );
}

/** CSV con BOM (Excel lo abre con acentos). */
export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function SubscriberRow({ s, now, previewHref }: { s: Subscriber; now: number; previewHref: (email: string) => string }) {
  const status = STATUS[s.status];
  const days = s.nextChargeAt ? Math.ceil((s.nextChargeAt - now) / DAY) : null;
  const span = s.nextChargeAt && s.periodStart ? s.nextChargeAt - s.periodStart : 0;
  const progress = span > 0 ? Math.min(100, Math.max(0, ((now - (s.periodStart as number)) / span) * 100)) : 0;

  return (
    <li className="grid gap-4 rounded-[1.4rem] bg-white p-4 ring-1 ring-ink/[0.08] md:grid-cols-12 md:items-center">
      {/* Cliente */}
      <div className="min-w-0 md:col-span-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-[0.9375rem] font-bold text-ink">{s.name || s.email || "Sin nombre"}</p>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold", status.tone)}>{status.label}</span>
          {s.cancelAtPeriodEnd && (
            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[0.6875rem] font-bold text-destructive">
              Se cancela al terminar el mes
            </span>
          )}
        </div>
        <div className="mt-1.5 flex flex-col gap-0.5 text-[0.8125rem] text-ink/65">
          {s.email && (
            <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 truncate hover:text-ink">
              <Mail aria-hidden className="h-3.5 w-3.5 shrink-0" />
              {s.email}
            </a>
          )}
          {s.phone && (
            <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink">
              <Phone aria-hidden className="h-3.5 w-3.5 shrink-0" />
              {s.phone}
            </a>
          )}
        </div>
      </div>

      {/* Plan y monto */}
      <div className="text-[0.8125rem] md:col-span-2">
        <p className="font-bold tabular-nums text-ink">
          {money(s.amount, s.currency)} <span className="font-medium text-ink/55">/ mes</span>
        </p>
        <p className="mt-0.5 text-ink/60">{PROVIDER[s.provider]}</p>
      </div>

      {/* Fechas */}
      <div className="text-[0.8125rem] md:col-span-2">
        <p className="text-ink/60">Suscrito desde</p>
        <p className="font-semibold text-ink">{date(s.startedAt)}</p>
        {s.charges !== null && <p className="mt-0.5 text-ink/60">{s.charges} cobros</p>}
      </div>

      {/* Próximo cobro */}
      <div className="md:col-span-3">
        {s.nextChargeAt && days !== null ? (
          <>
            <div className="flex items-baseline justify-between gap-2 text-[0.8125rem]">
              <span className="font-bold text-ink">{daysLeftLabel(days)}</span>
              <span className="text-ink/60">{date(s.nextChargeAt)}</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-ink/[0.08]"
              role="progressbar"
              aria-label="Avance del mes pagado"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={cn("h-full rounded-full", days <= 3 ? "bg-forest" : "bg-lime")} style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <p className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink/60">
            <XCircle aria-hidden className="h-4 w-4" />
            {s.status === "canceled"
              ? `Cancelada ${date(s.canceledAt)}`
              : s.cancelAtPeriodEnd
                ? `Termina ${date(s.canceledAt)}`
                : "Sin próximo cobro"}
          </p>
        )}
      </div>

      <div className="flex gap-1.5 md:col-span-1 md:justify-end">
        {s.email && (
          <a
            href={previewHref(s.email)}
            target="_blank"
            rel="noopener"
            aria-label={`Ver el panel de ${s.name || s.email} como cliente`}
            title="Ver como cliente"
            className="inline-grid size-10 place-items-center rounded-full bg-ink/[0.05] text-ink transition-colors hover:bg-ink hover:text-lime"
          >
            <Eye aria-hidden className="h-4 w-4" />
          </a>
        )}
        {s.phone && (
          <a
            href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp a ${s.name || s.phone}`}
            className="inline-grid size-10 place-items-center rounded-full bg-lime text-ink transition-colors hover:bg-ink hover:text-lime"
          >
            <FaWhatsapp aria-hidden className="h-4 w-4" />
          </a>
        )}
        <a
          href={s.dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir en ${PROVIDER[s.provider]}`}
          className="inline-grid size-10 place-items-center rounded-full bg-ink/[0.05] text-ink transition-colors hover:bg-ink hover:text-lime"
        >
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </a>
      </div>
    </li>
  );
}

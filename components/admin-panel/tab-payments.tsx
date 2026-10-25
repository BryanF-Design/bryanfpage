"use client";

import { useMemo, useState } from "react";
import { CreditCard, Download, Search, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { AdminData } from "./admin-app";
import { Card, Notice, Pill, money, shortDate, useAdminAction } from "./admin-ui";
import { downloadCsv } from "./tab-subscriptions";

const PROVIDERS = [
  { id: "todos", label: "Todos" },
  { id: "stripe", label: "Stripe" },
  { id: "mercadopago", label: "Mercado Pago" },
  { id: "transferencia", label: "Transferencia" },
] as const;

type ProviderFilter = (typeof PROVIDERS)[number]["id"];

const LABEL: Record<string, string> = {
  stripe: "Stripe",
  mercadopago: "Mercado Pago",
  transferencia: "Transferencia",
  manual: "Manual",
};

/** Pagos únicos: Stripe, Mercado Pago y transferencias registradas. */
export function PaymentsTab({ data }: { data: AdminData }) {
  const [provider, setProvider] = useState<ProviderFilter>("todos");
  const [query, setQuery] = useState("");
  const { run, busy, message } = useAdminAction();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.payments
      .filter((p) => provider === "todos" || p.proveedor === provider)
      .filter((p) => !q || `${p.email} ${p.nombre} ${p.descripcion} ${p.id}`.toLowerCase().includes(q));
  }, [data.payments, provider, query]);

  const totalMxn = rows.filter((p) => p.moneda === "MXN").reduce((s, p) => s + Number(p.monto), 0);

  function exportCsv() {
    downloadCsv(`pagos-${new Date(data.fetchedAt).toISOString().slice(0, 10)}.csv`, [
      ["Fecha", "Nombre", "Correo", "Concepto", "Proveedor", "Monto", "Moneda", "ID"],
      ...rows.map((p) => [
        p.creada.slice(0, 10),
        p.nombre,
        p.email,
        p.descripcion,
        LABEL[p.proveedor] || p.proveedor,
        String(p.monto),
        p.moneda,
        p.id,
      ]),
    ]);
  }

  return (
    <Card
      id="payments-title"
      title={
        <>
          Pagos <span className="text-ink/45">({rows.length})</span>
        </>
      }
      icon={CreditCard}
      action={
        <button
          type="button"
          onClick={exportCsv}
          disabled={!rows.length}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-40"
        >
          <Download aria-hidden className="h-4 w-4" />
          Exportar
        </button>
      }
    >
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Buscar pago</span>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Correo, nombre o concepto"
            className="h-11 w-full rounded-full border border-ink/[0.12] bg-white pl-10 pr-4 text-sm text-ink outline-none focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)]"
          />
        </label>
        <div role="group" aria-label="Filtrar por proveedor" className="flex flex-wrap gap-1.5">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={provider === p.id}
              onClick={() => setProvider(p.id)}
              className={cn(
                "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                provider === p.id ? "bg-ink text-white" : "bg-ink/[0.05] text-ink hover:bg-ink/10"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="ml-auto text-sm text-ink/65">
          Total: <strong className="tabular-nums text-ink">{money(totalMxn)}</strong>
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-[1.25rem] bg-mint px-5 py-10 text-center text-sm font-medium text-ink/70">
          Sin pagos con este filtro. Registra transferencias desde la ficha de cada cliente.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[1.25rem] ring-1 ring-ink/[0.08]">
          <table className="w-full min-w-[40rem] bg-white text-left text-sm">
            <caption className="sr-only">Pagos únicos</caption>
            <thead className="bg-ink/[0.03] text-xs text-ink/60">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Fecha</th>
                <th scope="col" className="px-4 py-3 font-semibold">Cliente</th>
                <th scope="col" className="px-4 py-3 font-semibold">Concepto</th>
                <th scope="col" className="px-4 py-3 font-semibold">Proveedor</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Monto</th>
                <th scope="col" className="px-2 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {rows.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-ink/70">{shortDate(Date.parse(p.creada))}</td>
                  <td className="max-w-[14rem] px-4 py-3">
                    <span className="block truncate font-semibold text-ink">{p.nombre || p.email || "—"}</span>
                    {p.nombre && <span className="block truncate text-xs text-ink/55">{p.email}</span>}
                  </td>
                  <td className="max-w-[16rem] truncate px-4 py-3 text-ink/75">{p.descripcion}</td>
                  <td className="px-4 py-3">
                    <Pill tone={p.proveedor === "transferencia" ? "mint" : "muted"}>{LABEL[p.proveedor] || p.proveedor}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold tabular-nums text-ink">{money(Number(p.monto), p.moneda)}</td>
                  <td className="px-2 py-3 text-right">
                    {(p.proveedor === "transferencia" || p.proveedor === "manual") && data.db && (
                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => {
                          if (window.confirm("¿Borrar este pago del historial?")) run("purchase.delete", { id: p.id }, { ok: "Pago borrado." });
                        }}
                        aria-label={`Borrar pago de ${p.nombre || p.email}`}
                        className="inline-grid size-9 place-items-center rounded-full text-ink/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 aria-hidden className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-ink/55">
        Stripe y Mercado Pago: los últimos 100 cobros de cada uno. Las mensualidades de suscripción están en Suscripciones.
      </p>
    </Card>
  );
}

/**
 * CÁLCULO DE COTIZACIÓN — compartido entre cliente y servidor.
 *
 * El Configurador (cliente) y los endpoints de pago (servidor) usan las MISMAS
 * funciones para armar las partidas y el total. Así el precio nunca se calcula
 * "sólo en el frontend": el servidor recompone el total desde el catálogo a
 * partir de la selección y cobra ESE número, no el que mande el navegador.
 */

import {
  CONFIGURATOR_MODULES,
  CONFIGURATOR_PLANS,
  SECTION_PRICE,
} from "./catalog";
import { mxnToUsd, type Currency } from "./currency";

export interface QuoteSelection {
  planId: string;
  moduleIds: string[];
  sections: number;
}

export interface QuoteLineMxn {
  /** Identificador estable de la partida (p. ej. "plan:full", "module:payments"). */
  id: string;
  /** Precio en MXN (moneda fuente). */
  price: number;
}

/** Normaliza una selección arbitraria (posiblemente del cliente) a algo seguro. */
export function normalizeSelection(raw: unknown): QuoteSelection {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const planId =
    typeof obj.planId === "string" &&
    CONFIGURATOR_PLANS.some((p) => p.id === obj.planId)
      ? obj.planId
      : CONFIGURATOR_PLANS[0].id;
  const moduleIds = Array.isArray(obj.moduleIds)
    ? obj.moduleIds.filter(
        (id): id is string =>
          typeof id === "string" && CONFIGURATOR_MODULES.some((m) => m.id === id)
      )
    : [];
  const sectionsNum = Number(obj.sections);
  const sections = Number.isFinite(sectionsNum)
    ? Math.min(50, Math.max(0, Math.floor(sectionsNum)))
    : 0;
  return { planId, moduleIds, sections };
}

/** Partidas en MXN a partir de una selección ya normalizada. */
export function buildQuoteLinesMxn(sel: QuoteSelection): QuoteLineMxn[] {
  const lines: QuoteLineMxn[] = [];
  const plan =
    CONFIGURATOR_PLANS.find((p) => p.id === sel.planId) ?? CONFIGURATOR_PLANS[0];
  lines.push({ id: `plan:${plan.id}`, price: plan.price });

  for (const m of CONFIGURATOR_MODULES) {
    if (sel.moduleIds.includes(m.id)) {
      lines.push({ id: `module:${m.id}`, price: m.price });
    }
  }

  if (sel.sections > 0) {
    lines.push({ id: `sections:${sel.sections}`, price: sel.sections * SECTION_PRICE });
  }
  return lines;
}

/**
 * Total del proyecto en la moneda elegida. En USD se convierte por partida
 * (redondeo hacia arriba, nunca cobra de menos) y luego se suma, exactamente
 * como lo ve el usuario en el resumen del Configurador.
 */
export function quoteProjectTotal(
  sel: QuoteSelection,
  currency: Currency,
  usdMxnRate: number
): number {
  const lines = buildQuoteLinesMxn(sel);
  const toCurrency = (mxn: number) =>
    currency === "MXN" ? mxn : mxnToUsd(mxn, usdMxnRate);
  return Math.max(0, Math.round(lines.reduce((a, b) => a + toCurrency(b.price), 0)));
}

/** Monto a cobrar ahora según modalidad (100% o 50% de anticipo). */
export function quotePayableNow(
  projectTotal: number,
  modalidad: "anticipo" | "liquidacion"
): number {
  return Math.max(1, Math.ceil(projectTotal * (modalidad === "anticipo" ? 0.5 : 1)));
}

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
import { applyPct } from "./seasons";

/**
 * Llave de localStorage donde el Configurador guarda la cotización en curso
 * (para retomarla y para adjuntarla al formulario de contacto).
 */
export const QUOTE_STORAGE_KEY = "bryanf_quote_v1";

/** Ancla del formulario de cotización (components/sections/lead-form.tsx). */
export const LEAD_FORM_ID = "cotizacion";

export interface QuoteSelection {
  planId: string;
  moduleIds: string[];
  sections: number;
}

export interface QuoteLineMxn {
  /** Identificador estable de la partida (p. ej. "plan:full", "module:payments"). */
  id: string;
  /** Precio en MXN (moneda fuente), ya con descuento si lo hay. */
  price: number;
  /** Precio de lista, antes del descuento. */
  original: number;
  /** % de descuento aplicado (0 si ninguno). */
  discount: number;
}

/**
 * % de descuento por partida (llaves de lib/seasons `DISCOUNTABLE`:
 * "plan:full", "module:payments", "sections"). Sin función, no hay descuento.
 */
export type DiscountLookup = (key: string) => number;

const noDiscount: DiscountLookup = () => 0;

function line(id: string, key: string, price: number, pctFor: DiscountLookup): QuoteLineMxn {
  const discount = Math.min(90, Math.max(0, pctFor(key) || 0));
  return { id, price: applyPct(price, discount), original: price, discount };
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
export function buildQuoteLinesMxn(sel: QuoteSelection, pctFor: DiscountLookup = noDiscount): QuoteLineMxn[] {
  const lines: QuoteLineMxn[] = [];
  const plan =
    CONFIGURATOR_PLANS.find((p) => p.id === sel.planId) ?? CONFIGURATOR_PLANS[0];
  lines.push(line(`plan:${plan.id}`, `plan:${plan.id}`, plan.price, pctFor));

  for (const m of CONFIGURATOR_MODULES) {
    if (sel.moduleIds.includes(m.id)) {
      lines.push(line(`module:${m.id}`, `module:${m.id}`, m.price, pctFor));
    }
  }

  if (sel.sections > 0) {
    lines.push(line(`sections:${sel.sections}`, "sections", sel.sections * SECTION_PRICE, pctFor));
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
  usdMxnRate: number,
  pctFor: DiscountLookup = noDiscount
): number {
  const lines = buildQuoteLinesMxn(sel, pctFor);
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

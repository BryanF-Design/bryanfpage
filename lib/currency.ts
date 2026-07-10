export type Currency = "MXN" | "USD";

/**
 * Tipo de cambio para la conversión visible al cliente. Es una referencia
 * comercial redondeada, no un feed de mercado: se fija con la variable
 * NEXT_PUBLIC_USD_MXN_RATE (y USD_MXN_RATE en el servidor) y tiene un
 * default conservador para que el flujo nunca se rompa sin configuración.
 */
export const DEFAULT_USD_MXN_RATE = 18;

export function getUsdMxnRate(raw?: string | number | null): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_USD_MXN_RATE;
}

/** Conversión redondeada hacia arriba a dólares enteros (nunca cobra de menos). */
export function mxnToUsd(mxn: number, rate: number): number {
  return Math.max(1, Math.ceil(mxn / rate));
}

export function usdToMxn(usd: number, rate: number): number {
  return Math.max(1, Math.round(usd * rate));
}

export function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "MXN" ? "es-MX" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function isCurrency(value: unknown): value is Currency {
  return value === "MXN" || value === "USD";
}

/**
 * CATÁLOGO — FUENTE ÚNICA DE VERDAD DE PRECIOS Y SERVICIOS
 * ========================================================
 *
 * Todo precio del sitio vive aquí, en MXN (moneda fuente). Los componentes
 * (Configurador, Servicios de entrada, y más adelante Lumina) leen de aquí en
 * lugar de repetir números sueltos. La conversión a USD y el formato de moneda
 * se derivan en tiempo de render con `lib/currency`.
 *
 * REGLA: la copia traducible (nombres, descripciones) sigue viviendo en los
 * diccionarios de i18n. Aquí sólo vive el DATO comercial (id + precio + estado),
 * para no mezclar contenido con presentación y para poder editar precios sin
 * tocar componentes.
 *
 * NO SE INVENTAN PRECIOS. Los `live` son los precios reales en producción. Los
 * `proposed` provienen de la planeación (infografía) y están marcados aparte:
 * NO se exponen en la UI ni en el cobro hasta que Bryan confirme el número.
 */

/** Precio base en pesos mexicanos — moneda fuente de todo el catálogo. */
export type Mxn = number;

/**
 * Estado comercial de una partida:
 * - `live`: precio real, en producción, seguro de cobrar.
 * - `proposed`: tier sugerido en la planeación, pendiente de confirmación de
 *   precio antes de exponerlo. Los componentes NO deben cobrar `proposed`.
 */
export type CatalogStatus = "live" | "proposed";

export interface ConfiguratorPlan {
  id: string;
  price: Mxn;
  featured: boolean;
}

export interface ConfiguratorModule {
  id: string;
  price: Mxn;
}

// ---------------------------------------------------------------------------
// CONFIGURADOR (cotizador con pago directo) — precios reales, en producción.
// Estos valores movieron desde components/sections/configurator.tsx para que
// exista un solo lugar donde editarlos.
// ---------------------------------------------------------------------------

export const CONFIGURATOR_PLANS: readonly ConfiguratorPlan[] = [
  { id: "full", price: 3500, featured: true },
  { id: "update", price: 1800, featured: false },
  { id: "maintenance", price: 1000, featured: false },
] as const;

export const CONFIGURATOR_MODULES: readonly ConfiguratorModule[] = [
  { id: "ecommerce", price: 3500 },
  { id: "payments", price: 1500 },
  { id: "maintenance", price: 1000 },
] as const;

/** Precio por sección adicional en el configurador. */
export const SECTION_PRICE: Mxn = 350;

// ---------------------------------------------------------------------------
// SERVICIOS DE ENTRADA — precios reales, en producción.
// La copia (nombre, features) vive en i18n `entryServices.items`. Aquí queda el
// precio numérico en MXN por id, para que el display y (a futuro) el cobro se
// deriven de un solo número en vez de un string suelto por idioma.
// ---------------------------------------------------------------------------

export interface EntryServicePrice {
  id: string;
  price: Mxn;
  /** Cuando true, el precio es "desde X" (punto de partida, no fijo). */
  from?: boolean;
}

export const ENTRY_SERVICE_PRICES: readonly EntryServicePrice[] = [
  { id: "tarjetaDigital", price: 900 },
  { id: "tarjetaImprimible", price: 650 },
  { id: "firmaCorreo", price: 350 },
  { id: "kitPresencia", price: 1500 },
  { id: "landingEsencial", price: 2400, from: true },
] as const;

// ---------------------------------------------------------------------------
// TIERS PROPUESTOS EN LA PLANEACIÓN (infografía) — NO EXPONER SIN CONFIRMAR.
// El sitio hoy vende "Desarrollo Web" a $3,500 como tier principal. La
// infografía propone desdoblarlo en una escalera (Básico / Profesional /
// Tienda) y paquetes. Los números de la imagen bajan el ticket 2-3x, así que
// se dejan aquí como PLACEHOLDER a confirmar (ver PLAN.md §Precios pendientes).
// Ningún componente debe leer estos precios todavía.
// ---------------------------------------------------------------------------

export interface ProposedService {
  id: string;
  /** Precio sugerido en la infografía (MXN). PENDIENTE DE CONFIRMAR. */
  infographicPrice: Mxn;
  from: boolean;
  status: Extract<CatalogStatus, "proposed">;
}

export const PROPOSED_SERVICES: readonly ProposedService[] = [
  { id: "sitioBasico", infographicPrice: 2499, from: true, status: "proposed" },
  { id: "sitioProfesional", infographicPrice: 4999, from: true, status: "proposed" },
  { id: "tiendaLinea", infographicPrice: 6999, from: true, status: "proposed" },
  { id: "mantenimientoMensual", infographicPrice: 499, from: true, status: "proposed" },
  { id: "paqueteEmprendedor", infographicPrice: 999, from: true, status: "proposed" },
  { id: "paqueteEmpresa", infographicPrice: 2499, from: true, status: "proposed" },
] as const;

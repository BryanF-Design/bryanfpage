/**
 * TEMPORADAS, DESCUENTOS Y AVISOS — el modelo que edita el Panel BryanF.
 *
 * Código puro (sin servidor ni navegador): lo usan el layout para pintar la
 * temporada, el cotizador para mostrar precios con descuento y los endpoints
 * de pago para cobrar ESE precio. Los ajustes viven en Supabase
 * (`sitio.ajustes`, clave "sitio"); sin base, `DEFAULT_SETTINGS` aplica.
 *
 * Las fechas de temporada son "MM-DD" y se leen en hora de Ciudad de México.
 * Un rango que cruza el año (Navidad: 12-01 → 01-06) funciona igual.
 */

export type SeasonId = "muertos" | "buen-fin" | "black-friday" | "navidad";

export interface SeasonDef {
  id: SeasonId;
  name: string;
  /** Rango por defecto, "MM-DD" inclusive. */
  start: string;
  end: string;
  /** Aviso sugerido para la barra de arriba. */
  banner: string;
  /** Lo que dice Lumina al saludar en esa temporada. */
  greeting: string;
  /** Cartel de la home y pop-up de temporada. */
  poster: {
    kicker: string;
    title: string;
    /** Frase grande bajo el título (si el pop-up no trae título propio). */
    lead: string;
    text: string;
    cta: string;
  };
}

export const SEASONS: readonly SeasonDef[] = [
  {
    id: "muertos",
    name: "Día de Muertos",
    start: "10-20",
    end: "11-09",
    banner: "Temporada de Día de Muertos: que tu negocio siga más vivo que nunca.",
    greeting: "¡Llegó el Día de Muertos! 🌼 Hoy la página se vistió de papel picado y flores. ¿Te ayudo con algo?",
    poster: {
      kicker: "1 y 2 de noviembre",
      title: "Día de Muertos",
      lead: "Que tu negocio siga más vivo que nunca",
      text: "Honramos a los que se fueron y celebramos lo que sigue vivo: que tu negocio brille con una web hecha con el mismo cariño que un altar.",
      cta: "Arma tu web",
    },
  },
  {
    id: "buen-fin",
    name: "El Buen Fin",
    start: "11-13",
    end: "11-16",
    banner: "El Buen Fin llegó a BryanF Design: el mejor momento para estrenar web.",
    greeting: "¡Es El Buen Fin! 🛍️ Si tenías pendiente tu página, este es el momento. ¿Te armo un paquete?",
    poster: {
      kicker: "Ya llegó",
      title: "El Buen Fin",
      lead: "Tu página web a precio de Buen Fin",
      text: "El fin de semana más barato del año también es para tu página web. Aparta tu proyecto con precio de Buen Fin.",
      cta: "Ver precios",
    },
  },
  {
    id: "black-friday",
    name: "Black Friday",
    start: "11-27",
    end: "11-30",
    banner: "Black Friday · Cyber Monday: precios que no vuelven hasta el próximo año.",
    greeting: "¡Black Friday! 🖤 Hay precios especiales solo estos días. ¿Te digo cuánto quedaría lo tuyo?",
    poster: {
      kicker: "Solo 4 días",
      title: "Black Friday",
      lead: "Precios que no vuelven hasta el próximo año",
      text: "Black Friday y Cyber Monday en BryanF Design: diseño y código a precio que no vuelve hasta el próximo año.",
      cta: "Aprovechar",
    },
  },
  {
    id: "navidad",
    name: "Navidad",
    start: "12-01",
    end: "01-06",
    banner: "Felices fiestas: regálale a tu negocio la web que se merece.",
    greeting: "¡Felices fiestas! 🎄 ¿Le regalamos a tu negocio una web nueva para arrancar el año?",
    poster: {
      kicker: "Temporada navideña",
      title: "Felices fiestas",
      lead: "Regálale a tu negocio la web que se merece",
      text: "Que el año nuevo arranque con tu página lista para vender: diseño, código y SEO hechos con cariño, como un buen regalo.",
      cta: "Arma tu web",
    },
  },
] as const;

export const SEASON_IDS = SEASONS.map((s) => s.id);

export function isSeasonId(value: unknown): value is SeasonId {
  return typeof value === "string" && (SEASON_IDS as string[]).includes(value);
}

export function seasonDef(id: SeasonId): SeasonDef {
  return SEASONS.find((s) => s.id === id)!;
}

// ——— Servicios con descuento ———————————————————————————————————————————

/**
 * Partidas a las que se les puede poner descuento. `key` es la llave en
 * `discounts.services`; las del cotizador se cobran en línea, las de entrada
 * se muestran con el precio rebajado. La suscripción no entra: es un cobro
 * recurrente y su precio se cambia en Stripe / Mercado Pago.
 */
export const DISCOUNTABLE: ReadonlyArray<{ key: string; label: string; group: "Cotizador" | "Servicios de entrada" }> = [
  { key: "plan:full", label: "Desarrollo web a medida", group: "Cotizador" },
  { key: "plan:update", label: "Actualización de sitio", group: "Cotizador" },
  { key: "plan:maintenance", label: "Mantenimiento (plan)", group: "Cotizador" },
  { key: "module:ecommerce", label: "Módulo tienda en línea", group: "Cotizador" },
  { key: "module:payments", label: "Módulo pagos", group: "Cotizador" },
  { key: "module:maintenance", label: "Módulo mantenimiento", group: "Cotizador" },
  { key: "sections", label: "Secciones adicionales", group: "Cotizador" },
  { key: "entry:tarjetaDigital", label: "Tarjeta digital", group: "Servicios de entrada" },
  { key: "entry:tarjetaImprimible", label: "Tarjeta imprimible", group: "Servicios de entrada" },
  { key: "entry:firmaCorreo", label: "Firma de correo", group: "Servicios de entrada" },
  { key: "entry:kitPresencia", label: "Kit de presencia digital", group: "Servicios de entrada" },
  { key: "entry:landingEsencial", label: "Landing esencial", group: "Servicios de entrada" },
];

// ——— Ajustes ————————————————————————————————————————————————————————————

export interface SeasonRange {
  enabled: boolean;
  start: string;
  end: string;
  /** Cambia el color de marca (lima) por el de la temporada. */
  palette: boolean;
  /** Papel picado, cartel en la home, detalle en el logo… */
  decorations: boolean;
  /** Pop-up de temporada (una vez por visitante) si no hay uno propio. */
  popup: boolean;
  /** Aviso de temporada en la barra de arriba. */
  banner: boolean;
  /** Texto propio del aviso (vacío: el sugerido). */
  bannerText: string;
}

export interface SiteSettings {
  season: {
    /** auto: por fechas · manual: la elegida · off: ninguna. */
    mode: "auto" | "manual" | "off";
    manual: SeasonId;
    ranges: Record<SeasonId, SeasonRange>;
  };
  discounts: {
    enabled: boolean;
    /** % para todo (0–90). */
    global: number;
    /** % por partida; null o ausente = usa el global. */
    services: Record<string, number | null>;
    /** Nombre de la promoción ("Buen Fin", "Promo de aniversario"…). */
    label: string;
    /** ISO; vacío = sin fecha de fin. */
    endsAt: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    cta: string;
    href: string;
    endsAt: string;
  };
  popup: {
    enabled: boolean;
    title: string;
    text: string;
    cta: string;
    href: string;
    /** Segundos antes de aparecer. */
    delay: number;
    endsAt: string;
  };
}

const range = (s: SeasonDef): SeasonRange => ({
  enabled: true,
  start: s.start,
  end: s.end,
  palette: true,
  decorations: true,
  popup: true,
  banner: true,
  bannerText: "",
});

export const DEFAULT_SETTINGS: SiteSettings = {
  season: {
    mode: "auto",
    manual: "muertos",
    ranges: Object.fromEntries(SEASONS.map((s) => [s.id, range(s)])) as Record<SeasonId, SeasonRange>,
  },
  discounts: { enabled: false, global: 0, services: {}, label: "", endsAt: "" },
  announcement: { enabled: false, text: "", cta: "", href: "", endsAt: "" },
  popup: { enabled: false, title: "", text: "", cta: "", href: "", delay: 8, endsAt: "" },
};

const MMDD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const str = (v: unknown, max: number, fallback = "") => (typeof v === "string" ? v.slice(0, max) : fallback);
const bool = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback);
const pct = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(90, Math.max(0, Math.round(n))) : 0;
};
const iso = (v: unknown) => (typeof v === "string" && v && !Number.isNaN(Date.parse(v)) ? v : "");
const href = (v: unknown) => {
  const s = str(v, 300).trim();
  return /^(\/(?!\/)|https:\/\/)/.test(s) ? s : "";
};

/** Limpia cualquier objeto (de la base o del panel) a ajustes válidos. */
export function normalizeSettings(raw: unknown): SiteSettings {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, Record<string, unknown>>;
  const d = DEFAULT_SETTINGS;
  const season = o.season || {};
  const rawRanges = (season.ranges || {}) as Record<string, Record<string, unknown>>;
  const ranges = Object.fromEntries(
    SEASONS.map((s) => {
      const r = rawRanges[s.id] || {};
      const def = d.season.ranges[s.id];
      return [
        s.id,
        {
          enabled: bool(r.enabled, def.enabled),
          start: typeof r.start === "string" && MMDD.test(r.start) ? r.start : def.start,
          end: typeof r.end === "string" && MMDD.test(r.end) ? r.end : def.end,
          palette: bool(r.palette, def.palette),
          decorations: bool(r.decorations, def.decorations),
          popup: bool(r.popup, def.popup),
          banner: bool(r.banner, def.banner),
          bannerText: str(r.bannerText, 180),
        },
      ];
    })
  ) as Record<SeasonId, SeasonRange>;

  const disc = o.discounts || {};
  const rawServices = (disc.services || {}) as Record<string, unknown>;
  const services: Record<string, number | null> = {};
  for (const { key } of DISCOUNTABLE) {
    const v = rawServices[key];
    if (v !== null && v !== undefined && v !== "") services[key] = pct(v);
  }

  const ann = o.announcement || {};
  const pop = o.popup || {};
  const delay = Number(pop.delay);
  return {
    season: {
      mode: season.mode === "manual" || season.mode === "off" ? season.mode : "auto",
      manual: isSeasonId(season.manual) ? season.manual : d.season.manual,
      ranges,
    },
    discounts: {
      enabled: bool(disc.enabled, false),
      global: pct(disc.global),
      services,
      label: str(disc.label, 60),
      endsAt: iso(disc.endsAt),
    },
    announcement: {
      enabled: bool(ann.enabled, false),
      text: str(ann.text, 180),
      cta: str(ann.cta, 40),
      href: href(ann.href),
      endsAt: iso(ann.endsAt),
    },
    popup: {
      enabled: bool(pop.enabled, false),
      title: str(pop.title, 80),
      text: str(pop.text, 280),
      cta: str(pop.cta, 40),
      href: href(pop.href),
      delay: Number.isFinite(delay) ? Math.min(120, Math.max(0, Math.round(delay))) : d.popup.delay,
      endsAt: iso(pop.endsAt),
    },
  };
}

// ——— Resolución por fecha ———————————————————————————————————————————————

/** "MM-DD" de hoy en Ciudad de México. */
export function mexicoMonthDay(now: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(now));
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${m}-${d}`;
}

export function inRange(md: string, start: string, end: string) {
  return start <= end ? md >= start && md <= end : md >= start || md <= end;
}

export function activeSeason(settings: SiteSettings, now: number): SeasonId | null {
  const { mode, manual, ranges } = settings.season;
  if (mode === "off") return null;
  if (mode === "manual") return manual;
  const md = mexicoMonthDay(now);
  return SEASONS.find((s) => ranges[s.id].enabled && inRange(md, ranges[s.id].start, ranges[s.id].end))?.id ?? null;
}

const notExpired = (endsAt: string, now: number) => !endsAt || Date.parse(endsAt) > now;

export function discountsActive(settings: SiteSettings, now: number) {
  return settings.discounts.enabled && notExpired(settings.discounts.endsAt, now);
}

/** % de descuento de una partida ahora mismo (0 si no aplica). */
export function discountFor(settings: SiteSettings, key: string, now: number): number {
  if (!discountsActive(settings, now)) return 0;
  const own = settings.discounts.services[key];
  return own === null || own === undefined ? settings.discounts.global : own;
}

/** Aplica un % a un precio MXN, redondeando a pesos cerrados. */
export function applyPct(price: number, percent: number) {
  return percent > 0 ? Math.round(price * (1 - percent / 100)) : price;
}

export function announcementActive(settings: SiteSettings, now: number) {
  const a = settings.announcement;
  return a.enabled && !!a.text && notExpired(a.endsAt, now);
}

export function popupActive(settings: SiteSettings, now: number) {
  const p = settings.popup;
  return p.enabled && !!(p.title || p.text) && notExpired(p.endsAt, now);
}

/** "15 días" / "5 h" / "20 min" — lo que falta para `endsAt`. */
export function timeLeft(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const d = Math.floor(h / 24);
  if (d >= 2) return `${d} días`;
  if (h >= 1) return `${h} h`;
  return `${Math.max(1, Math.ceil(ms / 60_000))} min`;
}

/** "13 al 16 de noviembre" / "1 de diciembre al 6 de enero". */
export function humanRange(start: string, end: string) {
  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const [sm, sd] = start.split("-").map(Number);
  const [em, ed] = end.split("-").map(Number);
  return sm === em ? `${sd} al ${ed} de ${MONTHS[em - 1]}` : `${sd} de ${MONTHS[sm - 1]} al ${ed} de ${MONTHS[em - 1]}`;
}

/** Lo que va sobre el título del cartel: la fecha fija o el rango del panel. */
export function posterKicker(settings: SiteSettings, id: SeasonId) {
  if (id === "muertos" || id === "navidad") return seasonDef(id).poster.kicker;
  const r = settings.season.ranges[id];
  return `Del ${humanRange(r.start, r.end)}`;
}

/** Fin de la temporada activa (ms), para la cuenta regresiva del aviso. */
export function seasonEndsAt(settings: SiteSettings, id: SeasonId, now: number): number | null {
  if (settings.season.mode !== "auto") return null;
  const r = settings.season.ranges[id];
  const year = Number(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric" }).format(new Date(now)));
  const md = mexicoMonthDay(now);
  // Rango que cruza el año y hoy es antes del fin: termina este año; si no, el siguiente.
  const endYear = r.start > r.end && md >= r.start ? year + 1 : year;
  // Fin del día en CDMX (UTC-6, sin horario de verano desde 2022).
  return Date.parse(`${endYear}-${r.end}T23:59:59-06:00`);
}

/**
 * ATRIBUCIÓN DE CAMPAÑAS (Google Ads y UTM).
 *
 * Cuando alguien llega desde un anuncio, la URL trae `gclid` (o `gbraid` /
 * `wbraid` en iOS) y, si la campaña está etiquetada, los `utm_*`. Esa URL se
 * pierde en cuanto la persona navega o se va a pagar a Stripe/Mercado Pago, así
 * que aquí se guarda en el dispositivo y se adjunta a cada cobro y a cada
 * solicitud de cotización. Con eso:
 *  - el correo de "pago confirmado" / "nuevo prospecto" dice de qué campaña vino;
 *  - el gclid queda en Stripe/correo para subir conversiones offline a Google Ads
 *    (ventas que se cierran por WhatsApp días después).
 *
 * Gana el último clic con datos de campaña; una visita directa no borra lo
 * guardado. Caduca a los 90 días (la ventana máxima de conversión de Ads).
 */

export const ATTRIBUTION_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];

export type Attribution = Partial<Record<AttributionKey, string>> & {
  /** Página donde aterrizó con el clic (sin query). */
  landing?: string;
  /** Sitio de origen, si vino de otro dominio. */
  referrer?: string;
  /** Momento del clic (ISO). */
  ts?: string;
};

const STORAGE_KEY = "bryanf_attribution_v1";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_LEN = 200;

function clean(value: string | null | undefined) {
  return String(value ?? "").trim().slice(0, MAX_LEN);
}

/** Lee la URL actual y, si trae datos de campaña, los guarda. Sólo cliente. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Attribution = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = clean(params.get(key));
      if (value) fromUrl[key] = value;
    }
    if (!Object.keys(fromUrl).length) return;

    let referrer = "";
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.host !== window.location.host) referrer = clean(ref.host);
    } catch {
      /* referrer ilegible */
    }

    const record: Attribution = {
      ...fromUrl,
      landing: clean(window.location.pathname),
      ...(referrer ? { referrer } : {}),
      ts: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* storage bloqueado: el sitio sigue funcionando sin atribución */
  }
}

/** La atribución vigente (o un objeto vacío). Sólo cliente. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Attribution;
    if (!data || typeof data !== "object") return {};
    const ts = data.ts ? Date.parse(data.ts) : NaN;
    if (Number.isFinite(ts) && Date.now() - ts > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return data;
  } catch {
    return {};
  }
}

/**
 * Normaliza la atribución que manda el navegador antes de guardarla en Stripe,
 * Mercado Pago o un correo: sólo llaves conocidas, sólo texto y con tope.
 */
export function sanitizeAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of [...ATTRIBUTION_KEYS, "landing", "referrer", "ts"] as const) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, MAX_LEN);
    }
  }
  return out;
}

/** Resumen legible para correos: "Google Ads · campaña X · gclid …". */
export function describeAttribution(a: Attribution): string {
  if (!Object.keys(a).length) return "Directo / orgánico (sin datos de campaña)";
  const parts: string[] = [];
  if (a.gclid || a.gbraid || a.wbraid) parts.push("Google Ads");
  if (a.utm_source) parts.push(`fuente: ${a.utm_source}`);
  if (a.utm_medium) parts.push(`medio: ${a.utm_medium}`);
  if (a.utm_campaign) parts.push(`campaña: ${a.utm_campaign}`);
  if (a.utm_term) parts.push(`palabra clave: ${a.utm_term}`);
  if (a.utm_content) parts.push(`anuncio: ${a.utm_content}`);
  if (a.landing) parts.push(`aterrizó en: ${a.landing}`);
  return parts.join(" · ") || "Sin datos de campaña";
}

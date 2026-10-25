type AnalyticsParams = Record<string, unknown>;

/** Propiedad GA4 del sitio (flujo web de www.bryanfdesign.com). */
export const GA_MEASUREMENT_ID = "G-4GLGP6X573";
/** Proyecto de Microsoft Clarity (mapas de calor y grabaciones). */
export const CLARITY_PROJECT_ID = "yub7b5691z";

const LABEL_RE = /^[\w-]+$/;

/** El valor si tiene el formato esperado; si no, vacío (va dentro de un <script>). */
function onlyIf(pattern: RegExp, raw: string | undefined) {
  const value = (raw || "").trim();
  return pattern.test(value) ? value : "";
}

/**
 * Google Ads (opcional). Con sólo el ID (`AW-…`) ya se carga el remarketing y
 * la atribución; cada etiqueta de conversión se crea en Google Ads →
 * Objetivos → Conversiones y se pega aquí por variable de entorno. Si falta una
 * etiqueta, esa conversión simplemente no se manda a Ads (GA4 la sigue
 * midiendo y se puede importar desde ahí). Ver GOOGLE_ADS_SETUP.md.
 *
 * Deben leerse literalmente (`process.env.NEXT_PUBLIC_…`): Next las incrusta
 * en el bundle al compilar.
 */
export const GOOGLE_ADS_ID = onlyIf(/^AW-\d+$/, process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);

const GOOGLE_ADS_LABELS = {
  /** Formulario de cotización enviado (prospecto calificado). */
  lead: onlyIf(LABEL_RE, process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
  /** Pago confirmado en /gracias (verificado contra Stripe/Mercado Pago). */
  purchase: onlyIf(LABEL_RE, process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL),
  /** Clic a WhatsApp (conversión secundaria: intención, no venta). */
  whatsapp: onlyIf(LABEL_RE, process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL),
};

export type AdsConversion = keyof typeof GOOGLE_ADS_LABELS;

type AnalyticsWindow = Window & {
  gtag?: (command: string, ...args: unknown[]) => void;
  clarity?: (command: "event" | "set", ...args: string[]) => void;
};

/**
 * Envía un evento a GA4 y lo marca también en Clarity, para poder filtrar
 * grabaciones por conversión. Nunca rompe si un bloqueador quitó los scripts.
 */
export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;

  const w = window as AnalyticsWindow;
  try {
    if (typeof w.gtag === "function") w.gtag("event", eventName, params);
    if (typeof w.clarity === "function") w.clarity("event", eventName);
  } catch {
    /* analítica bloqueada: el sitio sigue funcionando */
  }
}

/** Teléfono en formato E.164 (lo exige la conversión mejorada). México por defecto. */
export function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  const bare = digits.replace(/^0+/, "");
  if (bare.length === 10) return `+52${bare}`;
  if (bare.length === 12 && bare.startsWith("52")) return `+${bare}`;
  return `+${bare}`;
}

export interface ConversionOptions {
  value?: number;
  currency?: string;
  transactionId?: string;
  /**
   * Datos del cliente para la conversión mejorada de Google Ads. gtag los
   * normaliza y los cifra (SHA-256) en el navegador antes de enviarlos.
   */
  userData?: { email?: string; phone?: string };
}

/**
 * Conversión de Google Ads. No hace nada si el sitio no tiene `AW-…` o esa
 * conversión no tiene etiqueta configurada. El evento GA4 equivalente lo manda
 * quien la llama con `trackEvent`, para no duplicar la lógica.
 */
export function trackAdsConversion(kind: AdsConversion, options: ConversionOptions = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  if (typeof w.gtag !== "function") return;

  try {
    const email = options.userData?.email?.trim().toLowerCase();
    const phone = options.userData?.phone ? toE164(options.userData.phone) : "";
    if (email || phone) {
      w.gtag("set", "user_data", {
        ...(email ? { email } : {}),
        ...(phone ? { phone_number: phone } : {}),
      });
    }

    const label = GOOGLE_ADS_LABELS[kind];
    if (!GOOGLE_ADS_ID || !label) return;
    w.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${label}`,
      ...(options.value != null ? { value: options.value } : {}),
      ...(options.currency ? { currency: options.currency } : {}),
      ...(options.transactionId ? { transaction_id: options.transactionId } : {}),
    });
  } catch {
    /* analítica bloqueada */
  }
}

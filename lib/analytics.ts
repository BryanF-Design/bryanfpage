type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/** Propiedad GA4 del sitio (flujo web de www.bryanfdesign.com). */
export const GA_MEASUREMENT_ID = "G-4GLGP6X573";
/** Proyecto de Microsoft Clarity (mapas de calor y grabaciones). */
export const CLARITY_PROJECT_ID = "yub7b5691z";

type AnalyticsWindow = Window & {
  gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
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

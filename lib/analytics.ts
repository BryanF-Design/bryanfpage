type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/** Propiedad GA4 del sitio (flujo web de www.bryanfdesign.com). */
export const GA_MEASUREMENT_ID = "G-4GLGP6X573";
/** Proyecto de Microsoft Clarity (mapas de calor y grabaciones). */
export const CLARITY_PROJECT_ID = "yub7b5691z";

/** Únicos dominios cuyo tráfico se mide (el apex redirige a www). */
export const PRODUCTION_HOSTS = ["www.bryanfdesign.com", "bryanfdesign.com"];

/**
 * Se ejecuta antes de gtag y de Clarity. Deja `window.__bfdNoTrack` en true
 * (y apaga GA4 con su bandera oficial `ga-disable-<ID>`) cuando:
 *  - la página no está en el dominio de producción (previews de Vercel,
 *    localhost): antes esas visitas se mezclaban con las reales, como las
 *    vistas de /admin de una preview;
 *  - el navegador está marcado como interno: abrir cualquier página con
 *    `?interno=1` lo marca (se guarda en localStorage) y `?interno=0` lo
 *    desmarca. Sirve para que Bryan y su equipo no se cuenten.
 * Se copia tal cual en public/gracias.html (página estática).
 */
export const TRACKING_GUARD = `(function(){try{var h=location.hostname;var prod=${JSON.stringify(
  PRODUCTION_HOSTS
)}.indexOf(h)>-1;var off=false;try{var q=new URLSearchParams(location.search).get("interno");if(q==="1")localStorage.setItem("bfd-interno","1");if(q==="0")localStorage.removeItem("bfd-interno");off=localStorage.getItem("bfd-interno")==="1";}catch(e){}window.__bfdNoTrack=!prod||off;if(window.__bfdNoTrack){window["ga-disable-${GA_MEASUREMENT_ID}"]=true;}}catch(e){}})();`;

type AnalyticsWindow = Window & {
  gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
  clarity?: (command: "event" | "set", ...args: string[]) => void;
  __bfdNoTrack?: boolean;
};

/**
 * Envía un evento a GA4 y lo marca también en Clarity, para poder filtrar
 * grabaciones por conversión. Nunca rompe si un bloqueador quitó los scripts.
 */
export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;

  const w = window as AnalyticsWindow;
  try {
    // Con __bfdNoTrack, gtag sigue encolando (no envía nada: GA4 está
    // apagado) y Clarity ni siquiera se cargó.
    if (typeof w.gtag === "function") w.gtag("event", eventName, params);
    if (!w.__bfdNoTrack && typeof w.clarity === "function") w.clarity("event", eventName);
  } catch {
    /* analítica bloqueada: el sitio sigue funcionando */
  }
}

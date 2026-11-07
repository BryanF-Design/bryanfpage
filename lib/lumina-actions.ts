import {
  CONFIGURATOR_MODULES,
  CONFIGURATOR_PLANS,
  ENTRY_SERVICE_PRICES,
  SECTION_PRICE,
} from "@/lib/catalog";
import { projects } from "@/lib/projects";

/**
 * Acciones de Lumina: además del texto, sus respuestas pueden traer marcas
 * cortas (`[[ver:precios]]`, `[[pagina:conoceme]]`, `[[proyecto:slug]]`,
 * `[[cotizar:full|ecommerce|0|anticipo]]`, `[[whatsapp]]`) que el chat
 * convierte en botones que actúan sobre el sitio: llevar a una sección o a
 * otra página, enseñar proyectos reales, armar el cotizador en vivo o pasarle
 * el resumen a Bryan. Todo se valida contra listas cerradas: una
 * marca desconocida o mal formada simplemente se descarta.
 */

/** Secciones a las que Lumina puede llevar (marca → id en la página). */
export const LUMINA_SECTIONS = {
  proyectos: "projects",
  casos: "casos-de-estudio",
  proceso: "proceso",
  servicios: "servicios-entrada",
  precios: "precios",
  faq: "faq",
} as const;
export type LuminaSection = keyof typeof LUMINA_SECTIONS;

/** Páginas del sitio a las que Lumina puede llevar (marca → ruta). */
export const LUMINA_PAGES = {
  conoceme: "/conoceme",
  casos: "/casos",
  contacto: "/contacto",
  barberias: "/sistema-para-barberias",
  cotizador: "/crear-web",
} as const;
export type LuminaPage = keyof typeof LUMINA_PAGES;

export type QuoteMode = "anticipo" | "liquidacion";

export interface LuminaQuote {
  plan: string;
  modules: string[];
  sections: number;
  /** Modalidad de pago: 50 % de anticipo o el total de una vez. */
  mode?: QuoteMode;
}

export type LuminaAction =
  | { kind: "go"; section: LuminaSection }
  | { kind: "page"; page: LuminaPage }
  | { kind: "project"; slug: string }
  | { kind: "quote"; quote: LuminaQuote }
  | { kind: "whatsapp" };

const PLAN_IDS = new Set(CONFIGURATOR_PLANS.map((p) => p.id));
const MODULE_IDS = new Set(CONFIGURATOR_MODULES.map((m) => m.id));
/** Solo los proyectos con captura: la ficha del chat la muestra. */
const SHOWCASE = projects.filter((p) => p.shots !== false);
const SHOWCASE_SLUGS = new Set(SHOWCASE.map((p) => p.slug));

const MARK = /\[\[\s*(ver|pagina|página|proyecto|cotizar|whatsapp)\s*(?::\s*([^\]]*?))?\s*\]\]/gi;

function parseQuote(raw = ""): LuminaQuote | null {
  const [plan = "", modules = "", sections = "0", mode = ""] = raw.split("|").map((s) => s.trim());
  if (!PLAN_IDS.has(plan)) return null;
  const n = Number(sections);
  const m = mode.toLowerCase();
  return {
    ...(m === "anticipo" || m === "liquidacion" ? { mode: m as QuoteMode } : {}),
    plan,
    modules: modules
      .split(",")
      .map((m) => m.trim())
      .filter((m, i, all) => MODULE_IDS.has(m) && all.indexOf(m) === i),
    sections: Number.isFinite(n) ? Math.max(0, Math.min(10, Math.floor(n))) : 0,
  };
}

/** Separa el texto de las marcas. Máximo 3 proyectos y 5 acciones. */
export function extractActions(reply: string): { text: string; actions: LuminaAction[] } {
  const actions: LuminaAction[] = [];
  const seen = new Set<string>();
  const add = (key: string, action: LuminaAction) => {
    if (seen.has(key) || actions.length >= 5) return;
    seen.add(key);
    actions.push(action);
  };

  const text = reply.replace(MARK, (_, rawKind: string, rawArg?: string) => {
    const kind = rawKind.toLowerCase();
    const arg = (rawArg ?? "").trim();
    if (kind === "ver" && arg in LUMINA_SECTIONS) {
      add(`go:${arg}`, { kind: "go", section: arg as LuminaSection });
    } else if ((kind === "pagina" || kind === "página") && arg in LUMINA_PAGES) {
      add(`page:${arg}`, { kind: "page", page: arg as LuminaPage });
    } else if (kind === "proyecto" && SHOWCASE_SLUGS.has(arg)) {
      if (actions.filter((a) => a.kind === "project").length < 3) {
        add(`project:${arg}`, { kind: "project", slug: arg });
      }
    } else if (kind === "cotizar") {
      const quote = parseQuote(arg);
      if (quote) add("quote", { kind: "quote", quote });
    } else if (kind === "whatsapp") {
      add("whatsapp", { kind: "whatsapp" });
    }
    return "";
  });

  // Quita los <br> y espacios que quedaron colgando donde estaban las marcas.
  const clean = text.replace(/(\s*<br\s*\/?>\s*)+$/i, "").trim();
  return { text: clean, actions };
}

/** Valida acciones guardadas en sessionStorage (pueden venir alteradas). */
export function isLuminaAction(value: unknown): value is LuminaAction {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  if (a.kind === "whatsapp") return true;
  if (a.kind === "go") return typeof a.section === "string" && a.section in LUMINA_SECTIONS;
  if (a.kind === "page") return typeof a.page === "string" && a.page in LUMINA_PAGES;
  if (a.kind === "project") return typeof a.slug === "string" && SHOWCASE_SLUGS.has(a.slug);
  if (a.kind === "quote") {
    const q = a.quote as Record<string, unknown> | undefined;
    return (
      !!q &&
      typeof q.plan === "string" &&
      PLAN_IDS.has(q.plan) &&
      Array.isArray(q.modules) &&
      q.modules.every((m) => typeof m === "string" && MODULE_IDS.has(m)) &&
      typeof q.sections === "number" &&
      (q.mode === undefined || q.mode === "anticipo" || q.mode === "liquidacion")
    );
  }
  return false;
}

export function quoteHref(quote: LuminaQuote) {
  const params = new URLSearchParams({ plan: quote.plan });
  if (quote.modules.length) params.set("modules", quote.modules.join(","));
  if (quote.sections) params.set("sections", String(quote.sections));
  if (quote.mode) params.set("mode", quote.mode);
  // #precios: se llega directo al cotizador ya armado, no a la portada.
  return `/crear-web?${params.toString()}#precios`;
}

/** Evento que escucha el cotizador de la página para armarse en vivo. */
export const LUMINA_QUOTE_EVENT = "lumina:quote";

/**
 * La sección que el visitante tiene en pantalla (la que cruza la mitad del
 * viewport), para que Lumina responda con contexto.
 */
export function currentSectionLabel(): string {
  if (typeof document === "undefined") return "inicio";
  const y = window.innerHeight / 2;
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id], footer#site-footer"));
  const hit = sections.find((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= y && r.bottom >= y;
  });
  return hit?.id || "inicio";
}

const mxn = (n: number) => `$${n.toLocaleString("en-US")} MXN`;
const planPrice = (id: string) => CONFIGURATOR_PLANS.find((p) => p.id === id)?.price ?? 0;
const modulePrice = (id: string) => CONFIGURATOR_MODULES.find((m) => m.id === id)?.price ?? 0;
const entryPrice = (id: string) => ENTRY_SERVICE_PRICES.find((e) => e.id === id);

/**
 * Lo que Lumina puede vender, con los precios leídos del catálogo (la fuente
 * única): si un precio cambia en lib/catalog.ts, el prompt cambia con él y
 * Lumina nunca repite un número viejo ni inventa uno.
 */
export function catalogPrompt() {
  const landing = entryPrice("landingEsencial");
  const site = planPrice("full");
  return `PRECIOS REALES (los únicos que existen; nunca inventes otros, ni descuentos, ni promociones, ni meses sin intereses):
Servicios de entrada (sección "servicios" del inicio):
- Tarjeta de presentación digital: ${mxn(entryPrice("tarjetaDigital")?.price ?? 0)}
- Tarjeta de presentación imprimible: ${mxn(entryPrice("tarjetaImprimible")?.price ?? 0)}
- Firma de correo profesional: ${mxn(entryPrice("firmaCorreo")?.price ?? 0)}
- Kit de presencia digital: ${mxn(entryPrice("kitPresencia")?.price ?? 0)}
- Landing page esencial: ${landing?.from ? "desde " : ""}${mxn(landing?.price ?? 0)}
Cotizador (sección "precios", se arma con [[cotizar:...]]):
- Sitio web a medida (plan full): ${mxn(site)}
- Actualización de un sitio que ya tienes (plan update): ${mxn(planPrice("update"))}
- Mantenimiento mensual (plan maintenance): ${mxn(planPrice("maintenance"))} al mes
- Módulos extra: tienda en línea (ecommerce) ${mxn(modulePrice("ecommerce"))}, pagos en línea (payments) ${mxn(modulePrice("payments"))}, mantenimiento (maintenance) ${mxn(modulePrice("maintenance"))}; sección adicional ${mxn(SECTION_PRICE)} cada una.
Formas de pago: el total de una vez, o 50 % de anticipo para arrancar y 50 % contra entrega, cuando el proyecto está listo y aprobado (en el cotizador: modo "anticipo"). Ejemplo real: el sitio de ${mxn(site)} arranca con ${mxn(Math.ceil(site * 0.5))} hoy. Se paga con tarjeta (Stripe), Mercado Pago o transferencia BBVA.

PRESUPUESTO Y NEGOCIACIÓN (eres vendedora: ayudas a cerrar, pero con honestidad):
- Si te dan un presupuesto (por ejemplo ${mxn(1000)} o ${mxn(1500)}), dile con claridad qué SÍ cabe usando solo la lista de arriba, recomienda la mejor opción para su caso y llévalo a verla: [[ver:servicios]] para los servicios de entrada o [[cotizar:...]] para el cotizador.
- Si dice que está caro, que se le hace justo o que no le alcanza, primero pregúntale con calma cuánto tiene pensado invertir y para qué quiere la web. Con su número, arma el alcance que cabe: menos secciones, empezar con el kit o la landing y crecer después, o usar el 50 % de anticipo para arrancar hoy y pagar el resto a la entrega.
- Negociar es ajustar el ALCANCE a su presupuesto, nunca bajar el precio. Si nada cabe, dilo con cariño y ofrece la opción más cercana o hablar con Bryan.
- Para cerrar, ofrece el siguiente paso concreto: dejarle el paquete armado en el cotizador para pagar ahí el anticipo o el total (al pagar llena un brief corto y Bryan arranca), o pasarle su resumen a Bryan por WhatsApp con [[whatsapp]].`;
}

/** Bloque del prompt con las acciones y el portafolio disponible. */
export function actionsPrompt(section: string) {
  const list = SHOWCASE.map((p) => `${p.slug} — ${p.name} — ${p.desc || "sitio web"}`).join("\n");
  return `ACCIONES EN EL SITIO: al final de tu respuesta puedes añadir marcas; el sitio las convierte en botones (no las expliques ni las pongas a mitad del texto):
- [[ver:SECCION]] lleva al usuario a una sección. SECCION: proyectos, casos, proceso, servicios (servicios de entrada con sus precios), precios (el cotizador) o faq.
- [[pagina:PAGINA]] lleva a otra página del sitio. PAGINA: conoceme (quién es Bryan, el fundador y dueño), casos (casos de estudio completos), contacto (canales y todas las preguntas frecuentes), barberias (sistema para barberías) o cotizador (/crear-web).
- [[proyecto:SLUG]] muestra la ficha de un proyecto real con su captura (máx. 3, solo slugs de la lista).
- [[cotizar:PLAN|MODULOS|SECCIONES|MODO]] arma el cotizador en vivo frente al usuario. PLAN: full (sitio a medida), update (actualización) o maintenance (mantenimiento). MODULOS: ecommerce, payments, maintenance separados por coma, o vacío. SECCIONES extra: 0 a 10. MODO (opcional): anticipo (paga 50 % hoy) o liquidacion (paga todo). Ej.: [[cotizar:full|ecommerce,payments|0]] o [[cotizar:full||0|anticipo]].
- [[whatsapp]] botón para mandarle a Bryan por WhatsApp el resumen de esta conversación.
Cuándo usarlas: si pregunta quién es Bryan, quién es el dueño o quién está detrás, contesta en una línea y usa [[pagina:conoceme]]; si dice su giro o pide ejemplos, 1 a 3 [[proyecto:...]] parecidos (si no sabes su giro, pregúntalo); si da un presupuesto, quiere precio o armar su web, [[cotizar:...]] o [[ver:servicios]] con lo que cabe; si quiere hablar con alguien o ya está decidido, [[whatsapp]]; si busca algo del sitio, [[ver:...]] o [[pagina:...]].
Portafolio (slug — nombre — giro):
${list}
El usuario está viendo ahora la sección: ${section}.`;
}

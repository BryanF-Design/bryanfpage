import { CONFIGURATOR_MODULES, CONFIGURATOR_PLANS } from "@/lib/catalog";
import { projects } from "@/lib/projects";

/**
 * Acciones de Lumina: además del texto, sus respuestas pueden traer marcas
 * cortas (`[[ver:precios]]`, `[[proyecto:slug]]`, `[[cotizar:full|ecommerce|0]]`,
 * `[[whatsapp]]`) que el chat convierte en botones que actúan sobre el sitio:
 * llevar a una sección, enseñar proyectos reales, armar el cotizador en vivo
 * o pasarle el resumen a Bryan. Todo se valida contra listas cerradas: una
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

export interface LuminaQuote {
  plan: string;
  modules: string[];
  sections: number;
}

export type LuminaAction =
  | { kind: "go"; section: LuminaSection }
  | { kind: "project"; slug: string }
  | { kind: "quote"; quote: LuminaQuote }
  | { kind: "whatsapp" };

const PLAN_IDS = new Set(CONFIGURATOR_PLANS.map((p) => p.id));
const MODULE_IDS = new Set(CONFIGURATOR_MODULES.map((m) => m.id));
/** Solo los proyectos con captura: la ficha del chat la muestra. */
const SHOWCASE = projects.filter((p) => p.shots !== false);
const SHOWCASE_SLUGS = new Set(SHOWCASE.map((p) => p.slug));

const MARK = /\[\[\s*(ver|proyecto|cotizar|whatsapp)\s*(?::\s*([^\]]*?))?\s*\]\]/gi;

function parseQuote(raw = ""): LuminaQuote | null {
  const [plan = "", modules = "", sections = "0"] = raw.split("|").map((s) => s.trim());
  if (!PLAN_IDS.has(plan)) return null;
  const n = Number(sections);
  return {
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
  if (a.kind === "project") return typeof a.slug === "string" && SHOWCASE_SLUGS.has(a.slug);
  if (a.kind === "quote") {
    const q = a.quote as Record<string, unknown> | undefined;
    return (
      !!q &&
      typeof q.plan === "string" &&
      PLAN_IDS.has(q.plan) &&
      Array.isArray(q.modules) &&
      q.modules.every((m) => typeof m === "string" && MODULE_IDS.has(m)) &&
      typeof q.sections === "number"
    );
  }
  return false;
}

export function quoteHref(quote: LuminaQuote) {
  const params = new URLSearchParams({ plan: quote.plan });
  if (quote.modules.length) params.set("modules", quote.modules.join(","));
  if (quote.sections) params.set("sections", String(quote.sections));
  return `/crear-web?${params.toString()}`;
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

/** Bloque del prompt con las acciones y el portafolio disponible. */
export function actionsPrompt(section: string) {
  const list = SHOWCASE.map((p) => `${p.slug} — ${p.name} — ${p.desc || "sitio web"}`).join("\n");
  return `ACCIONES EN EL SITIO: al final de tu respuesta puedes añadir marcas; el sitio las convierte en botones (no las expliques ni las pongas a mitad del texto):
- [[ver:SECCION]] lleva al usuario a una sección. SECCION: proyectos, casos, proceso, servicios, precios o faq.
- [[proyecto:SLUG]] muestra la ficha de un proyecto real con su captura (máx. 3, solo slugs de la lista).
- [[cotizar:PLAN|MODULOS|SECCIONES]] arma el cotizador en vivo frente al usuario. PLAN: full (sitio a medida), update (actualización) o maintenance (mantenimiento). MODULOS: ecommerce, payments, maintenance separados por coma, o vacío. SECCIONES extra: 0 a 10. Ej.: [[cotizar:full|ecommerce,payments|0]].
- [[whatsapp]] botón para mandarle a Bryan por WhatsApp el resumen de esta conversación.
Cuándo usarlas: si dice su giro o pide ejemplos, 1 a 3 [[proyecto:...]] parecidos (si no sabes su giro, pregúntalo); si quiere precio o armar su web, [[cotizar:...]] con lo que mejor le quede; si quiere hablar con alguien o ya está decidido, [[whatsapp]]; si busca algo del sitio, [[ver:...]].
Portafolio (slug — nombre — giro):
${list}
El usuario está viendo ahora la sección: ${section}.`;
}

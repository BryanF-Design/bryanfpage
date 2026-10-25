import { CONFIGURATOR_MODULES, CONFIGURATOR_PLANS } from "@/lib/catalog";
import { projects } from "@/lib/projects";
import { isLocale, type Locale } from "@/lib/i18n/locales";

/**
 * Acciones de Lumina: además del texto, sus respuestas pueden traer marcas
 * cortas (`[[ver:precios]]`, `[[marcar:pagar|Aquí pagas]]`,
 * `[[proyecto:slug]]`, `[[cotizar:full|ecommerce|0]]`,
 * `[[llenar:pago=anticipo;moneda=USD]]`, `[[idioma:en]]`, `[[whatsapp]]`)
 * que el chat ejecuta y convierte en botones que actúan sobre el sitio:
 * llevar a una sección, señalar un elemento con un foco, enseñar proyectos
 * reales, armar y llenar el cotizador en vivo, cambiar el idioma o pasarle
 * el resumen a Bryan. Todo se valida contra listas cerradas: una marca
 * desconocida o mal formada simplemente se descarta.
 */

/** Secciones a las que Lumina puede llevar (marca → id en la página). */
export const LUMINA_SECTIONS = {
  inicio: "home",
  proyectos: "projects",
  casos: "casos-de-estudio",
  proceso: "proceso",
  servicios: "servicios-entrada",
  precios: "precios",
  faq: "faq",
  bryan: "bryan",
  lumina: "lumina",
  stack: "stack",
  presencia: "presencia",
  contacto: "site-footer",
} as const;
export type LuminaSection = keyof typeof LUMINA_SECTIONS;

/**
 * Elementos que Lumina puede señalar con el foco (marca → `data-lumina` en
 * el DOM). Las secciones también se pueden señalar por su nombre.
 */
export const LUMINA_TARGETS = [
  "arma-tu-web",
  "idioma",
  "whatsapp",
  "accesibilidad",
  "destacado",
  "planes",
  "modulos",
  "modalidad",
  "moneda",
  "cupon",
  "resumen",
  "pagar",
] as const;
export type LuminaTarget = (typeof LUMINA_TARGETS)[number] | LuminaSection;
const TARGET_SET = new Set<string>(LUMINA_TARGETS);
const isTarget = (v: string): v is LuminaTarget => TARGET_SET.has(v) || v in LUMINA_SECTIONS;

/** Elemento del DOM para una marca de foco (o null si no está en esta página). */
export function findLuminaTarget(target: LuminaTarget): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (target in LUMINA_SECTIONS) {
    return document.getElementById(LUMINA_SECTIONS[target as LuminaSection]);
  }
  const all = Array.from(document.querySelectorAll<HTMLElement>(`[data-lumina="${target}"]`));
  // El primero que de verdad se ve (los hay duplicados para teléfono/escritorio).
  const box = (el: HTMLElement) => {
    const inner = getComputedStyle(el).display === "contents" ? (el.firstElementChild as HTMLElement | null) : el;
    return inner;
  };
  for (const el of all) {
    const inner = box(el);
    if (inner && inner.getClientRects().length && getComputedStyle(inner).visibility !== "hidden") return inner;
  }
  return all[0] ? box(all[0]) : null;
}

/** Lo que Lumina puede llenar en el cotizador además del paquete. */
export interface LuminaFill {
  mode?: "liquidacion" | "anticipo";
  currency?: "MXN" | "USD";
  coupon?: string;
}

export interface LuminaQuote {
  plan: string;
  modules: string[];
  sections: number;
}

export type LuminaAction =
  | { kind: "go"; section: LuminaSection }
  | { kind: "mark"; target: LuminaTarget; note?: string }
  | { kind: "fill"; fill: LuminaFill }
  | { kind: "lang"; locale: Locale }
  | { kind: "project"; slug: string }
  | { kind: "quote"; quote: LuminaQuote }
  | { kind: "whatsapp" };

const PLAN_IDS = new Set(CONFIGURATOR_PLANS.map((p) => p.id));
const MODULE_IDS = new Set(CONFIGURATOR_MODULES.map((m) => m.id));
/** Solo los proyectos con captura: la ficha del chat la muestra. */
const SHOWCASE = projects.filter((p) => p.shots !== false);
const SHOWCASE_SLUGS = new Set(SHOWCASE.map((p) => p.slug));

const MARK = /\[\[\s*(ver|marcar|llenar|idioma|proyecto|cotizar|whatsapp)\s*(?::\s*([^\]]*?))?\s*\]\]/gi;

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

function parseFill(raw = ""): LuminaFill | null {
  const fill: LuminaFill = {};
  for (const pair of raw.split(/[;,|]/)) {
    const [k = "", v = ""] = pair.split("=").map((x) => x.trim());
    const key = k.toLowerCase();
    const value = v.toLowerCase();
    if ((key === "pago" || key === "modalidad") && (value === "anticipo" || value === "liquidacion")) {
      fill.mode = value;
    } else if (key === "moneda" && (value === "mxn" || value === "usd")) {
      fill.currency = value.toUpperCase() as "MXN" | "USD";
    } else if (key === "cupon" && /^[\w-]{2,24}$/.test(v)) {
      fill.coupon = v.toUpperCase();
    }
  }
  return Object.keys(fill).length ? fill : null;
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
    } else if (kind === "marcar") {
      const [rawTarget = "", ...rest] = arg.split("|");
      const target = rawTarget.trim().toLowerCase();
      const note = rest.join("|").replace(/<[^>]*>/g, "").trim().slice(0, 90);
      if (isTarget(target)) add(`mark:${target}`, { kind: "mark", target, note: note || undefined });
    } else if (kind === "llenar") {
      const fill = parseFill(arg);
      if (fill) add("fill", { kind: "fill", fill });
    } else if (kind === "idioma") {
      const locale = arg.toLowerCase();
      if (isLocale(locale)) add("lang", { kind: "lang", locale });
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
  if (a.kind === "mark") {
    return typeof a.target === "string" && isTarget(a.target) && (a.note === undefined || typeof a.note === "string");
  }
  if (a.kind === "lang") return typeof a.locale === "string" && isLocale(a.locale);
  if (a.kind === "fill") {
    const f = a.fill as Record<string, unknown> | undefined;
    return (
      !!f &&
      (f.mode === undefined || f.mode === "anticipo" || f.mode === "liquidacion") &&
      (f.currency === undefined || f.currency === "MXN" || f.currency === "USD") &&
      (f.coupon === undefined || (typeof f.coupon === "string" && /^[\w-]{2,24}$/.test(f.coupon)))
    );
  }
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
/** Evento con el que Lumina llena modalidad, moneda y cupón del cotizador. */
export const LUMINA_FILL_EVENT = "lumina:fill";

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
Las acciones se ejecutan solas en cuanto respondes (tú controlas el sitio: llevas, señalas y llenas por el usuario) y además quedan como botones.
- [[ver:SECCION]] lleva al usuario a una sección y la ilumina. SECCION: inicio, proyectos, casos, bryan, proceso, stack, lumina, servicios, precios, presencia, faq o contacto.
- [[marcar:ELEMENTO|nota corta]] lleva al elemento y lo señala con un foco y tu nota (máx. 8 palabras). ELEMENTO: arma-tu-web (botón principal), idioma (selector de idioma), whatsapp (botón flotante), accesibilidad (panel de accesibilidad), destacado (proyecto destacado), planes, modulos, modalidad (pago completo o anticipo), moneda, cupon, resumen (total del cotizador), pagar (botones de pago), o cualquier SECCION. Úsalo cuando pregunten "¿dónde está…?" o "¿cómo hago…?".
- [[llenar:pago=anticipo|liquidacion;moneda=MXN|USD;cupon=CODIGO]] llena por el usuario esos campos del cotizador (pon solo los que pidió). Ej.: [[llenar:pago=anticipo;moneda=USD]].
- [[idioma:CODIGO]] cambia el idioma del sitio. CODIGO: es, en, pt, de, fr, ja, zh. Úsalo solo si lo piden.
- [[proyecto:SLUG]] muestra la ficha de un proyecto real con su captura (máx. 3, solo slugs de la lista).
- [[cotizar:PLAN|MODULOS|SECCIONES]] arma el cotizador en vivo frente al usuario. PLAN: full (sitio a medida), update (actualización) o maintenance (mantenimiento). MODULOS: ecommerce, payments, maintenance separados por coma, o vacío. SECCIONES extra: 0 a 10. Ej.: [[cotizar:full|ecommerce,payments|0]].
- [[whatsapp]] botón para mandarle a Bryan por WhatsApp el resumen de esta conversación.
Cuándo usarlas: si dice su giro o pide ejemplos, 1 a 3 [[proyecto:...]] parecidos (si no sabes su giro, pregúntalo); si quiere precio o armar su web, [[cotizar:...]] con lo que mejor le quede; si quiere hablar con alguien o ya está decidido, [[whatsapp]]; si busca algo del sitio, [[ver:...]] o [[marcar:...]]; si pide que le llenes o le armes algo, hazlo con [[cotizar:...]] y/o [[llenar:...]] y dile qué llenaste. Usa como máximo una acción de movimiento ([[ver]] o [[marcar]]) por respuesta.
Portafolio (slug — nombre — giro):
${list}
El usuario está viendo ahora la sección: ${section}.`;
}

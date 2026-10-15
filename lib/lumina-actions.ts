import { CONFIGURATOR_MODULES, CONFIGURATOR_PLANS, ENTRY_SERVICE_PRICES } from "@/lib/catalog";
import { projects } from "@/lib/projects";

/**
 * EL CEREBRO DE ACCIONES DE LUMINA.
 *
 * Lumina responde en JSON (ver `actionsPrompt`): una frase corta, bloques con
 * forma (viñetas, pasos, cifra destacada, consejo) y acciones sobre el sitio:
 * moverse a una sección o a otra página, armar un paquete en el cotizador,
 * enseñar proyectos reales o servicios de entrada, y pasar la plática a
 * WhatsApp o al formulario de cotización. Aquí se valida TODO contra listas
 * cerradas: lo desconocido o mal formado se descarta en silencio, así el
 * modelo nunca puede inventar un precio, un enlace o una sección.
 *
 * Si el modelo no devuelve JSON, se cae al formato anterior de marcas
 * (`[[ver:precios]]`, `[[cotizar:full|ecommerce|0]]`…), que sigue funcionando.
 */

/** Secciones de la home a las que Lumina puede llevar (clave → id en la página). */
export const LUMINA_SECTIONS = {
  inicio: "home",
  proyectos: "projects",
  casos: "casos-de-estudio",
  bryan: "bryan",
  proceso: "proceso",
  stack: "stack",
  lumina: "lumina",
  servicios: "servicios-entrada",
  precios: "precios",
  cotizacion: "cotizacion",
  presencia: "presencia",
  faq: "faq",
} as const;
export type LuminaSection = keyof typeof LUMINA_SECTIONS;

/** Páginas del sitio a las que Lumina puede llevar (clave → ruta). */
export const LUMINA_PAGES = {
  "crear-web": "/crear-web",
  "desarrollo-web-mexico": "/desarrollo-web-mexico",
  "diseno-web-mexico": "/diseno-web-mexico",
  "diseno-ux-ui-mexico": "/diseno-ux-ui-mexico",
  "paginas-web-para-negocios": "/paginas-web-para-negocios",
  "software-a-medida-mexico": "/software-a-medida-mexico",
  "mantenimiento-web-mexico": "/mantenimiento-web-mexico",
} as const;
export type LuminaPage = keyof typeof LUMINA_PAGES;

export type QuoteMode = "anticipo" | "liquidacion";

export interface LuminaQuote {
  plan: string;
  modules: string[];
  sections: number;
  /** Modalidad sugerida: 50 % de anticipo o pago completo. */
  mode?: QuoteMode;
}

export type LuminaAction =
  | { kind: "go"; section: LuminaSection }
  | { kind: "page"; page: LuminaPage }
  | { kind: "project"; slug: string }
  | { kind: "quote"; quote: LuminaQuote; why?: string }
  | { kind: "service"; id: string }
  | { kind: "lead" }
  | { kind: "whatsapp" };

/** Bloques con forma que el chat dibuja con estilo (nunca HTML del modelo). */
export type LuminaBlock =
  | { kind: "bullets"; title?: string; items: string[] }
  | { kind: "steps"; title?: string; items: string[] }
  | { kind: "highlight"; label: string; value: string; note?: string }
  | { kind: "tip"; text: string };

export type LuminaMood = "Normal" | "Enfocada" | "Duda" | "Sorprendida";

/** A dónde se mueve Lumina sola al responder. */
export type LuminaDestination =
  | { kind: "section"; section: LuminaSection }
  | { kind: "page"; page: LuminaPage };

export interface LuminaReply {
  /** Frase principal, con HTML mínimo (se sanea al pintarla). */
  text: string;
  blocks: LuminaBlock[];
  actions: LuminaAction[];
  mood?: LuminaMood;
  navigate?: LuminaDestination;
}

const PLAN_IDS = new Set(CONFIGURATOR_PLANS.map((p) => p.id));
const MODULE_IDS = new Set(CONFIGURATOR_MODULES.map((m) => m.id));
const SERVICE_IDS = new Set(ENTRY_SERVICE_PRICES.map((s) => s.id));
/** Solo los proyectos con captura: la ficha del chat la muestra. */
const SHOWCASE = projects.filter((p) => p.shots !== false);
const SHOWCASE_SLUGS = new Set(SHOWCASE.map((p) => p.slug));

const MOODS: Record<string, LuminaMood> = {
  normal: "Normal",
  enfocada: "Enfocada",
  duda: "Duda",
  sorprendida: "Sorprendida",
};

function str(value: unknown, max = 280): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function strList(value: unknown, maxItems = 5, maxLen = 160): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => str(v, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function isSection(value: unknown): value is LuminaSection {
  return typeof value === "string" && value in LUMINA_SECTIONS;
}

function isPage(value: unknown): value is LuminaPage {
  return typeof value === "string" && value in LUMINA_PAGES;
}

function toQuote(raw: unknown): LuminaQuote | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;
  if (typeof q.plan !== "string" || !PLAN_IDS.has(q.plan)) return null;
  const modules = Array.isArray(q.modules)
    ? q.modules.filter(
        (m, i, all): m is string =>
          typeof m === "string" && MODULE_IDS.has(m) && all.indexOf(m) === i
      )
    : [];
  const n = Number(q.sections);
  const sections = Number.isFinite(n) ? Math.max(0, Math.min(10, Math.floor(n))) : 0;
  const mode = q.mode === "anticipo" || q.mode === "liquidacion" ? q.mode : undefined;
  return { plan: q.plan, modules, sections, ...(mode ? { mode } : {}) };
}

function toBlock(raw: unknown): LuminaBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const title = str(b.title, 80) || undefined;
  switch (b.kind) {
    case "bullets":
    case "steps": {
      const items = strList(b.items, 5);
      return items.length ? { kind: b.kind, title, items } : null;
    }
    case "highlight": {
      const label = str(b.label, 60);
      const value = str(b.value, 40);
      return label && value ? { kind: "highlight", label, value, note: str(b.note, 140) || undefined } : null;
    }
    case "tip": {
      const text = str(b.text, 240);
      return text ? { kind: "tip", text } : null;
    }
    default:
      return null;
  }
}

/** Valida una acción (de la respuesta o de sessionStorage, que puede venir alterado). */
export function isLuminaAction(value: unknown): value is LuminaAction {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  switch (a.kind) {
    case "whatsapp":
    case "lead":
      return true;
    case "go":
      return isSection(a.section);
    case "page":
      return isPage(a.page);
    case "project":
      return typeof a.slug === "string" && SHOWCASE_SLUGS.has(a.slug);
    case "service":
      return typeof a.id === "string" && SERVICE_IDS.has(a.id);
    case "quote":
      return !!toQuote(a.quote) && (a.why === undefined || typeof a.why === "string");
    default:
      return false;
  }
}

export function isLuminaBlock(value: unknown): value is LuminaBlock {
  return toBlock(value) !== null;
}

/** Interpreta la respuesta JSON de Lumina. `null` si no es JSON válido. */
export function parseLuminaJson(raw: string): LuminaReply | null {
  let data: Record<string, unknown>;
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    data = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;

  const text = str(data.say, 600);
  const blocks = (Array.isArray(data.blocks) ? data.blocks : [])
    .map(toBlock)
    .filter((b): b is LuminaBlock => b !== null)
    .slice(0, 2);

  const actions: LuminaAction[] = [];
  const quote = toQuote(data.package);
  if (quote) {
    const why = str((data.package as Record<string, unknown>).why, 200) || undefined;
    actions.push({ kind: "quote", quote, why });
  }
  for (const id of strList(data.services, 2, 40)) {
    if (SERVICE_IDS.has(id)) actions.push({ kind: "service", id });
  }
  for (const slug of strList(data.projects, 3, 80)) {
    if (SHOWCASE_SLUGS.has(slug)) actions.push({ kind: "project", slug });
  }

  let navigate: LuminaDestination | undefined;
  const target = str(data.navigate, 60);
  if (isSection(target)) navigate = { kind: "section", section: target };
  else if (isPage(target)) navigate = { kind: "page", page: target };
  if (navigate?.kind === "section") actions.push({ kind: "go", section: navigate.section });
  if (navigate?.kind === "page") actions.push({ kind: "page", page: navigate.page });

  for (const cta of strList(data.cta, 2, 20)) {
    if (cta === "whatsapp" || cta === "cotizacion") {
      const kind = cta === "whatsapp" ? "whatsapp" : "lead";
      if (!actions.some((a) => a.kind === kind)) actions.push({ kind });
    }
  }

  if (!text && !blocks.length && !actions.length) return null;
  return {
    text,
    blocks,
    actions,
    mood: MOODS[str(data.mood, 20).toLowerCase()],
    navigate,
  };
}

// ——— Formato anterior (marcas en el texto), como respaldo ———

const MARK = /\[\[\s*(ver|proyecto|cotizar|whatsapp)\s*(?::\s*([^\]]*?))?\s*\]\]/gi;

function parseMarkQuote(raw = ""): LuminaQuote | null {
  const [plan = "", modules = "", sections = "0"] = raw.split("|").map((s) => s.trim());
  return toQuote({ plan, modules: modules.split(",").map((m) => m.trim()), sections });
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
    if (kind === "ver" && isSection(arg)) {
      add(`go:${arg}`, { kind: "go", section: arg });
    } else if (kind === "proyecto" && SHOWCASE_SLUGS.has(arg)) {
      if (actions.filter((a) => a.kind === "project").length < 3) {
        add(`project:${arg}`, { kind: "project", slug: arg });
      }
    } else if (kind === "cotizar") {
      const quote = parseMarkQuote(arg);
      if (quote) add("quote", { kind: "quote", quote });
    } else if (kind === "whatsapp") {
      add("whatsapp", { kind: "whatsapp" });
    }
    return "";
  });

  const clean = text.replace(/(\s*<br\s*\/?>\s*)+$/i, "").trim();
  return { text: clean, actions };
}

/** Respuesta del modelo → texto, bloques y acciones (JSON primero, marcas después). */
export function parseLuminaReply(raw: string): LuminaReply {
  const parsed = parseLuminaJson(raw);
  if (parsed) return parsed;
  const { text, actions } = extractActions(raw);
  return { text, blocks: [], actions };
}

export function quoteHref(quote: LuminaQuote) {
  const params = new URLSearchParams({ plan: quote.plan });
  if (quote.modules.length) params.set("modules", quote.modules.join(","));
  if (quote.sections) params.set("sections", String(quote.sections));
  if (quote.mode) params.set("mode", quote.mode);
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
  return `${window.location.pathname} · ${hit?.id || "inicio"}`;
}

/** Bloque del prompt: formato de respuesta, acciones y catálogo disponible. */
export function actionsPrompt(section: string) {
  const portfolio = SHOWCASE.map((p) => `${p.slug} — ${p.name} — ${p.desc || "sitio web"}`).join("\n");
  const plans = CONFIGURATOR_PLANS.map((p) => `${p.id} ($${p.price} MXN)`).join(", ");
  const modules = CONFIGURATOR_MODULES.map((m) => `${m.id} (+$${m.price} MXN)`).join(", ");
  const services = ENTRY_SERVICE_PRICES.map((s) => `${s.id} (${s.from ? "desde " : ""}$${s.price} MXN)`).join(", ");

  return `FORMATO: responde SIEMPRE con un objeto JSON válido, sin texto fuera de él:
{
  "mood": "normal" | "enfocada" | "duda" | "sorprendida",
  "say": "1 a 3 frases cortas y cálidas. Puedes usar <strong>. Sin listas aquí.",
  "blocks": [ hasta 2 bloques, opcionales:
    {"kind":"bullets","title":"opcional","items":["máx 5 frases cortas"]}
    {"kind":"steps","title":"opcional","items":["paso 1","paso 2"]}
    {"kind":"highlight","label":"Desde","value":"$3,500 MXN","note":"opcional"}
    {"kind":"tip","text":"un consejo breve"} ],
  "package": null o {"plan":"PLAN","modules":["MODULO"],"sections":0,"mode":"liquidacion"|"anticipo","why":"por qué le queda, 1 frase"},
  "services": [ids de servicios de entrada, máx 2],
  "projects": [slugs del portafolio, máx 3],
  "navigate": null o una SECCIÓN o PÁGINA a la que TÚ lo llevas en ese momento,
  "cta": ["whatsapp" y/o "cotizacion"]
}

QUÉ PUEDES HACER EN EL SITIO:
- "package": armas tú el paquete en el cotizador frente al usuario, con precios reales. Planes: ${plans}. Módulos: ${modules}. Secciones extra: 0 a 10 ($350 MXN c/u). Úsalo cuando pida precio, presupuesto o "armar" su web; si falta info, arma lo más probable y explica en "why".
- "services": servicios de entrada más económicos: ${services}.
- "projects": proyectos reales parecidos a su giro (si no sabes su giro, pregúntalo).
- "navigate": te mueves por el sitio y llevas al usuario. SECCIONES de la home: ${Object.keys(LUMINA_SECTIONS).join(", ")}. PÁGINAS: ${Object.keys(LUMINA_PAGES).join(", ")}. Úsalo cuando pida ver algo ("muéstrame", "llévame", "dónde") o cuando armes un paquete y quiera pagar ("precios"). No navegues en cada respuesta.
- "cta": "cotizacion" lo lleva al formulario para que lo contacten (quien no quiere pagar todavía); "whatsapp" le pasa a Bryan el resumen de la plática.
Usa bloques para que la respuesta se vea ordenada: precios → "highlight"; cómo funciona → "steps"; qué incluye → "bullets".
Portafolio (slug — nombre — giro):
${portfolio}
El usuario está en: ${section}.`;
}

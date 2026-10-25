import { CONFIGURATOR_MODULES, CONFIGURATOR_PLANS, ENTRY_SERVICE_PRICES } from "@/lib/catalog";
import { sectionInView, topicOf } from "@/lib/lumina-nudges";
import { projects } from "@/lib/projects";
import { SUBSCRIPTION_PROMPT } from "@/lib/subscription";

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

/**
 * Página donde vive cada sección desde que el sitio se dividió: si no está en
 * la página actual, Lumina lleva a `ruta#id`.
 */
export const SECTION_PAGE: Record<LuminaSection, string> = {
  inicio: "/",
  proyectos: "/",
  casos: "/conoce-a-bryan",
  bryan: "/conoce-a-bryan",
  proceso: "/conoce-a-bryan",
  stack: "/conoce-a-bryan",
  lumina: "/lumina",
  servicios: "/",
  precios: "/",
  cotizacion: "/",
  presencia: "/conoce-a-bryan",
  faq: "/",
};

/** Páginas del sitio a las que Lumina puede llevar (clave → ruta). */
export const LUMINA_PAGES = {
  suscripcion: "/suscripcion",
  "suscripcion-preguntas": "/suscripcion/preguntas-frecuentes",
  "mi-panel": "/mi-panel",
  lumina: "/lumina",
  "conoce-a-bryan": "/conoce-a-bryan",
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
  | { kind: "subscription" }
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

/** Los bloques se pintan como texto: sin Markdown ni URLs sueltas. */
function stripMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function strList(value: unknown, maxItems = 5, maxLen = 160): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => stripMd(str(v, maxLen)))
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
  const title = stripMd(str(b.title, 80)) || undefined;
  switch (b.kind) {
    case "bullets":
    case "steps": {
      const items = strList(b.items, 5);
      return items.length ? { kind: b.kind, title, items } : null;
    }
    case "highlight": {
      const label = str(b.label, 60);
      const value = str(b.value, 40);
      return label && value
        ? { kind: "highlight", label: stripMd(label), value: stripMd(value), note: stripMd(str(b.note, 140)) || undefined }
        : null;
    }
    case "tip": {
      const text = stripMd(str(b.text, 240));
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
    case "subscription":
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
  if (data.subscription === true) actions.push({ kind: "subscription" });
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
  const hit = sectionInView();
  const footer = document.getElementById("site-footer");
  const atFooter = footer && footer.getBoundingClientRect().top < window.innerHeight / 2;
  return `${window.location.pathname} · ${atFooter ? "site-footer" : (hit && topicOf(hit)) || "inicio"}`;
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
  "subscription": true o false — muestra la tarjeta de la suscripción mensual,
  "services": [ids de servicios de entrada, máx 2],
  "projects": [slugs del portafolio, máx 3],
  "navigate": null o una SECCIÓN o PÁGINA a la que TÚ lo llevas en ese momento,
  "cta": ["whatsapp" y/o "cotizacion"]
}

QUÉ PUEDES HACER EN EL SITIO:
- "package": armas tú el paquete en el cotizador frente al usuario, con precios reales. Planes: ${plans}. Módulos: ${modules}. Secciones extra: 0 a 10 ($350 MXN c/u). Úsalo cuando pida precio, presupuesto o "armar" su web; si falta info, arma lo más probable y explica en "why".
- "subscription": ${SUBSCRIPTION_PROMPT} Recomiéndala (con "subscription": true) cuando el cliente necesita varias cosas, cambios frecuentes, mantenimiento continuo, o pregunta por un plan mensual o "todo incluido". Aclara siempre que cada solicitud tarda 1 a 2 días hábiles según complejidad.
- "services": servicios de entrada más económicos: ${services}.
- "projects": proyectos reales parecidos a su giro (si no sabes su giro, pregúntalo).
- "navigate": te mueves por el sitio y llevas al usuario. SECCIONES de la home: ${Object.keys(LUMINA_SECTIONS).join(", ")}. PÁGINAS: ${Object.keys(LUMINA_PAGES).join(", ")}. Úsalo cuando pida ver algo ("muéstrame", "llévame", "dónde") o cuando armes un paquete y quiera pagar ("precios"). No navegues en cada respuesta.
- "cta": "cotizacion" lo lleva al formulario para que lo contacten (quien no quiere pagar todavía); "whatsapp" le pasa a Bryan el resumen de la plática.
ENLACES: no escribas URLs ni enlaces en "say" ni en los bloques (ni Markdown). Para llevar al usuario a algún lado usa "navigate"; para contacto, "cta".
Usa bloques para que la respuesta se vea ordenada: precios → "highlight"; cómo funciona → "steps"; qué incluye → "bullets".
Portafolio (slug — nombre — giro):
${portfolio}
El usuario está en: ${section}.`;
}

// ——— Enlaces dentro de las respuestas ———

const SITE_HOSTS = /^(www\.)?bryanfdesign\.com(\.mx)?$/i;
const WA_NUMBER = "525663012505";

/** Rutas reales del sitio (lo demás no se enlaza). */
const SITE_PATHS = new Set<string>([
  "/",
  ...Object.values(LUMINA_PAGES),
  "/privacidad",
  "/terminos",
]);

/** Rutas que el modelo suele inventar → la ruta real. */
const PATH_ALIASES: Record<string, string> = {
  "/precios": "/#precios",
  "/cotizador": "/crear-web",
  "/cotizacion": "/crear-web",
  "/cotizar": "/crear-web",
  "/configurador": "/crear-web",
  "/contacto": "/#cotizacion",
  "/proyectos": "/#projects",
  "/portafolio": "/#projects",
  "/portfolio": "/#projects",
  "/faq": "/#faq",
  "/preguntas-frecuentes": "/#faq",
  "/servicios": "/#servicios-entrada",
  "/suscripción": "/suscripcion",
  "/subscription": "/suscripcion",
  "/plan-mensual": "/suscripcion",
  "/suscripcion/preguntas": "/suscripcion/preguntas-frecuentes",
  "/suscripcion/faq": "/suscripcion/preguntas-frecuentes",
  "/nosotros": "/conoce-a-bryan",
  "/sobre-mi": "/conoce-a-bryan",
  "/about": "/conoce-a-bryan",
  "/bryan": "/conoce-a-bryan",
  "/inicio": "/",
  "/home": "/",
  "/aviso-de-privacidad": "/privacidad",
  "/terminos-y-condiciones": "/terminos",
};

/** Ids de sección conocidos (para validar `#ancla`). */
const SECTION_IDS = new Set<string>([
  ...Object.values(LUMINA_SECTIONS),
  "plan",
  "politica",
  "preguntas",
]);

/** Hosts de los proyectos del portafolio (sí se pueden enlazar). */
const PORTFOLIO_HOSTS = new Set(
  projects
    .map((p) => {
      try {
        return new URL(p.url).host.toLowerCase();
      } catch {
        return "";
      }
    })
    .filter(Boolean)
);

export interface SafeLink {
  href: string;
  /** Enlace a una página del propio sitio (se abre con la guía de Lumina). */
  internal: boolean;
}

/**
 * Corrige y valida un enlace escrito por el modelo. Devuelve `null` si no es
 * un destino real: dominio viejo (.com.mx) o sin "www" → ruta del sitio;
 * rutas inventadas comunes → la real; WhatsApp siempre al número del
 * estudio; externos sólo si son sitios del portafolio.
 */
export function normalizeLuminaHref(raw: string): SafeLink | null {
  let href = raw.trim().replace(/[).,;:!?»"']+$/, "");
  if (!href || /^\s*(javascript|data|vbscript):/i.test(href)) return null;

  if (/^mailto:/i.test(href)) {
    return /^mailto:bryanf@bryanfdesign\.com\.mx/i.test(href) ? { href, internal: false } : null;
  }
  if (/^tel:/i.test(href)) return { href: `tel:+${WA_NUMBER}`, internal: false };

  if (/^www\./i.test(href) || /^bryanfdesign\.com/i.test(href) || /^wa\.me\//i.test(href)) {
    href = `https://${href}`;
  }

  let path = "";
  let hash = "";
  if (/^https?:\/\//i.test(href)) {
    let url: URL;
    try {
      url = new URL(href);
    } catch {
      return null;
    }
    const host = url.host.toLowerCase();
    if (host === "wa.me" || host.endsWith("whatsapp.com")) {
      const text = url.searchParams.get("text");
      return {
        href: `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
        internal: false,
      };
    }
    if (!SITE_HOSTS.test(host)) {
      return PORTFOLIO_HOSTS.has(host) ? { href: url.toString(), internal: false } : null;
    }
    path = url.pathname;
    hash = url.hash;
    const query = url.search;
    href = `${path}${query}${hash}`;
  } else if (href.startsWith("#")) {
    return SECTION_IDS.has(href.slice(1)) ? { href: `/${href}`, internal: true } : null;
  } else if (href.startsWith("/")) {
    const [beforeHash, h = ""] = href.split("#");
    path = beforeHash.split("?")[0];
    hash = h ? `#${h}` : "";
  } else {
    return null;
  }

  path = decodeURIComponent(path).replace(/\/+$/, "") || "/";
  const lower = path.toLowerCase();
  if (PATH_ALIASES[lower]) return { href: PATH_ALIASES[lower], internal: true };
  if (!SITE_PATHS.has(lower)) return null;
  const query = href.includes("?") && lower === "/crear-web" ? href.slice(href.indexOf("?")).split("#")[0] : "";
  const anchor = hash && SECTION_IDS.has(hash.slice(1)) ? hash : "";
  return { href: `${lower}${query}${anchor}`, internal: true };
}

/**
 * Markdown que el modelo a veces mezcla (negritas, `[texto](url)`, URLs
 * sueltas) → HTML mínimo. El saneado final lo hace el chat.
 */
export function markdownToHtml(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, url: string) => `<a href="${url.replace(/"/g, "")}">${label}</a>`)
    .replace(
      /(^|[\s(])((?:https?:\/\/|www\.)[^\s<]+|(?:www\.)?bryanfdesign\.com(?:\.mx)?\/[^\s<]*)/gi,
      (_, lead: string, raw: string) => {
        // El punto final de la oración no es parte del enlace.
        const tail = raw.match(/[).,;:!?]+$/)?.[0] ?? "";
        const url = raw.slice(0, raw.length - tail.length).replace(/"/g, "");
        return `${lead}<a href="${url}">${url.replace(/^https?:\/\//, "")}</a>${tail}`;
      }
    )
    .replace(/\n/g, "<br>");
}

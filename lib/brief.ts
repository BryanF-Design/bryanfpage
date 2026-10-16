/**
 * EL BRIEFING DE ARRANQUE (/armar-mi-brief).
 *
 * Fuente única de los campos del briefing que llena el cliente después de
 * pagar (o al elegir transferencia): el formulario, el asistente de Lumina,
 * el correo que nos llega y el mensaje de WhatsApp leen de aquí.
 *
 * Incluye el detector de enlaces: el cliente pega cualquier link y el sistema
 * reconoce qué es (Instagram, Google Drive, Figma, Maps, su sitio…) y le
 * sugiere para qué nos lo manda (su red actual, materiales, referencia…).
 */

export type BriefFieldKind = "text" | "email" | "tel" | "textarea" | "select";

export interface BriefField {
  key: string;
  label: string;
  kind: BriefFieldKind;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  /** Ocupa las dos columnas del formulario. */
  full?: boolean;
  /** Ayuda corta bajo el campo. */
  hint?: string;
  autoComplete?: string;
}

export interface BriefSection {
  id: string;
  title: string;
  intro: string;
  fields: BriefField[];
}

export const PROJECT_TYPES = [
  "Landing page",
  "Sitio web corporativo",
  "Tienda en línea",
  "Portafolio / marca personal",
  "Blog o CMS",
  "Plataforma o software a medida",
  "Rediseño de mi sitio actual",
  "Suscripción Todo Digital",
  "Servicio de entrada (tarjeta, firma, kit)",
] as const;

export const MAIN_GOALS = [
  "Vender en línea",
  "Recibir mensajes por WhatsApp",
  "Agendar citas o reservaciones",
  "Conseguir prospectos (cotizaciones)",
  "Mostrar mi trabajo o portafolio",
  "Dar confianza y verme profesional",
  "Informar (menú, horarios, ubicación)",
] as const;

/** Funciones que el cliente puede marcar (chips). */
export const BRIEF_FEATURES = [
  "Botón de WhatsApp",
  "Formulario de contacto",
  "Pagos en línea",
  "Catálogo de productos",
  "Agenda o reservaciones",
  "Blog o noticias",
  "Galería de fotos o videos",
  "Mapa y ubicación",
  "Reseñas o testimonios",
  "Varios idiomas",
  "Área de clientes / login",
  "Integración con redes sociales",
] as const;

export const BRIEF_SECTIONS: BriefSection[] = [
  {
    id: "contacto",
    title: "Tus datos de contacto",
    intro: "Para saber con quién hablamos y por dónde te escribimos.",
    fields: [
      { key: "fullName", label: "Nombre completo", kind: "text", required: true, autoComplete: "name" },
      { key: "businessName", label: "Nombre del negocio o marca", kind: "text", required: true, autoComplete: "organization" },
      { key: "contactPhone", label: "WhatsApp", kind: "tel", required: true, placeholder: "55 1234 5678", autoComplete: "tel" },
      { key: "contactEmail", label: "Correo", kind: "email", placeholder: "tu@correo.com", autoComplete: "email" },
      {
        key: "preferredContact",
        label: "¿Por dónde prefieres que te contactemos?",
        kind: "select",
        options: ["WhatsApp", "Llamada", "Correo", "Videollamada"],
      },
      {
        key: "bestTime",
        label: "Mejor horario",
        kind: "select",
        options: ["Mañana (9 a 12)", "Mediodía (12 a 15)", "Tarde (15 a 19)", "Cualquier hora"],
      },
    ],
  },
  {
    id: "negocio",
    title: "Tu negocio",
    intro: "Lo que nos ayuda a escribir y diseñar como si lo conociéramos de años.",
    fields: [
      { key: "industry", label: "Giro o industria", kind: "text", placeholder: "Cafetería, despacho contable, clínica dental…" },
      { key: "location", label: "Ciudad y país", kind: "text", placeholder: "Guadalajara, México", autoComplete: "address-level2" },
      {
        key: "projectBrief",
        label: "¿Qué hace tu negocio?",
        kind: "textarea",
        full: true,
        placeholder: "Cuéntalo como se lo contarías a un cliente nuevo: qué ofreces, desde cuándo, qué te hace diferente.",
      },
      {
        key: "services",
        label: "Productos o servicios principales",
        kind: "textarea",
        full: true,
        placeholder: "Los 3 a 6 más importantes, con precio si quieres mostrarlo.",
      },
      {
        key: "audience",
        label: "¿Quiénes son tus clientes?",
        kind: "textarea",
        full: true,
        placeholder: "Edad, zona, tipo de empresa, qué buscan cuando te encuentran…",
      },
      { key: "competitors", label: "Competencia (opcional)", kind: "text", full: true, placeholder: "Nombres o sitios de negocios parecidos al tuyo" },
    ],
  },
  {
    id: "proyecto",
    title: "Tu proyecto",
    intro: "Qué vamos a construir y qué tiene que lograr.",
    fields: [
      { key: "projectType", label: "Tipo de proyecto", kind: "select", options: [...PROJECT_TYPES] },
      { key: "mainGoal", label: "Objetivo principal del sitio", kind: "select", options: [...MAIN_GOALS] },
      {
        key: "mainAction",
        label: "¿Qué quieres que haga la gente al entrar?",
        kind: "text",
        full: true,
        placeholder: "Escribirme por WhatsApp, comprar, agendar, pedir cotización…",
      },
      { key: "sections", label: "Secciones que quieres", kind: "text", full: true, placeholder: "Inicio, Nosotros, Servicios, Galería, Contacto…" },
      {
        key: "deadline",
        label: "¿Para cuándo lo necesitas?",
        kind: "select",
        options: ["Lo antes posible", "En 1 a 2 semanas", "En 1 mes", "Tengo una fecha específica", "Soy flexible"],
      },
      { key: "deadlineDate", label: "Fecha o evento (opcional)", kind: "text", placeholder: "Inauguración el 20 de noviembre…" },
    ],
  },
  {
    id: "marca",
    title: "Tu marca y tu estilo",
    intro: "Cómo se tiene que ver y sentir.",
    fields: [
      {
        key: "materials",
        label: "¿Tienes materiales listos?",
        kind: "select",
        options: ["Sí: logo, textos e imágenes", "Tengo logo, faltan textos o fotos", "Algunos, necesito ayuda", "Aún no tengo nada"],
      },
      {
        key: "style",
        label: "Estilo visual",
        kind: "select",
        options: ["Oscuro / premium", "Limpio y minimalista", "Atrevido y colorido", "Corporativo / formal", "Moderno y divertido", "Natural / artesanal", "Que ustedes propongan"],
      },
      { key: "colors", label: "Colores de tu marca", kind: "text", placeholder: "Verde olivo y dorado, o códigos #1F3A2B…" },
      {
        key: "domainStatus",
        label: "Dominio (tunegocio.com)",
        kind: "select",
        options: ["Ya tengo dominio", "Necesito comprar uno", "No sé qué es"],
      },
      { key: "domain", label: "¿Cuál es tu dominio? (si ya tienes)", kind: "text", placeholder: "tunegocio.com.mx" },
      {
        key: "accessNotes",
        label: "Accesos que ya tienes (sin contraseñas)",
        kind: "text",
        placeholder: "Hosting en GoDaddy, Google Business, Mercado Pago…",
        hint: "Nunca mandes contraseñas aquí: te las pedimos por un canal seguro cuando haga falta.",
      },
    ],
  },
];

/** Campos de texto libre que el cliente puede escribir largo. */
export const LONG_BRIEF_FIELDS = new Set(["projectBrief", "services", "audience", "notes", "references"]);

export const ALL_BRIEF_FIELDS: BriefField[] = [
  ...BRIEF_SECTIONS.flatMap((s) => s.fields),
  { key: "notes", label: "Notas adicionales", kind: "textarea", full: true },
];

export const BRIEF_FIELD_BY_KEY = new Map(ALL_BRIEF_FIELDS.map((f) => [f.key, f]));

/** Lo que más pesa para arrancar: mide el avance del briefing. */
export const BRIEF_PROGRESS_KEYS = [
  "fullName",
  "businessName",
  "contactPhone",
  "contactEmail",
  "industry",
  "location",
  "projectBrief",
  "services",
  "audience",
  "projectType",
  "mainGoal",
  "sections",
  "deadline",
  "materials",
  "style",
] as const;

// ——— Enlaces ———

export type LinkCategory = "social" | "files" | "design" | "maps" | "store" | "web" | "contact" | "media";

export interface LinkType {
  id: string;
  label: string;
  category: LinkCategory;
}

export const LINK_PURPOSES = [
  { id: "actual", label: "Mi sitio o red actual" },
  { id: "materiales", label: "Materiales (logo, fotos, textos)" },
  { id: "referencia", label: "Referencia que me gusta" },
  { id: "competencia", label: "Competencia" },
  { id: "otro", label: "Otro" },
] as const;
export type LinkPurpose = (typeof LINK_PURPOSES)[number]["id"];

export interface BriefLink {
  url: string;
  type: string;
  label: string;
  category: LinkCategory;
  purpose: LinkPurpose;
}

/** Reglas por dominio (y ruta cuando hace falta). El orden importa: lo específico primero. */
const LINK_RULES: { test: (host: string, path: string) => boolean; type: LinkType }[] = [
  { test: (h, p) => h === "docs.google.com" && p.startsWith("/document"), type: { id: "gdocs", label: "Google Docs", category: "files" } },
  { test: (h, p) => h === "docs.google.com" && p.startsWith("/spreadsheets"), type: { id: "gsheets", label: "Google Sheets", category: "files" } },
  { test: (h, p) => h === "docs.google.com" && p.startsWith("/presentation"), type: { id: "gslides", label: "Google Slides", category: "files" } },
  { test: (h, p) => (h === "docs.google.com" && p.startsWith("/forms")) || h === "forms.gle", type: { id: "gforms", label: "Google Forms", category: "files" } },
  { test: (h) => h === "drive.google.com" || h === "docs.google.com", type: { id: "gdrive", label: "Google Drive", category: "files" } },
  { test: (h) => h === "photos.google.com" || h === "photos.app.goo.gl", type: { id: "gphotos", label: "Google Fotos", category: "files" } },
  {
    test: (h, p) =>
      h === "maps.app.goo.gl" || h === "maps.google.com" || (h.startsWith("google.") && p.startsWith("/maps")) || (h === "goo.gl" && p.startsWith("/maps")),
    type: { id: "gmaps", label: "Google Maps", category: "maps" },
  },
  { test: (h) => h === "g.page" || h === "business.google.com" || h === "g.co", type: { id: "gbusiness", label: "Perfil de Google", category: "maps" } },
  { test: (h) => h === "play.google.com", type: { id: "googleplay", label: "Google Play", category: "store" } },
  { test: (h) => h === "apps.apple.com", type: { id: "appstore", label: "App Store", category: "store" } },
  { test: (h) => h === "instagram.com" || h === "instagr.am", type: { id: "instagram", label: "Instagram", category: "social" } },
  { test: (h) => h === "facebook.com" || h === "fb.com" || h === "fb.me" || h === "m.facebook.com", type: { id: "facebook", label: "Facebook", category: "social" } },
  { test: (h) => h === "tiktok.com" || h === "vm.tiktok.com", type: { id: "tiktok", label: "TikTok", category: "social" } },
  { test: (h) => h === "linkedin.com" || h === "lnkd.in", type: { id: "linkedin", label: "LinkedIn", category: "social" } },
  { test: (h) => h === "youtube.com" || h === "youtu.be" || h === "m.youtube.com", type: { id: "youtube", label: "YouTube", category: "media" } },
  { test: (h) => h === "x.com" || h === "twitter.com", type: { id: "x", label: "X (Twitter)", category: "social" } },
  { test: (h) => h === "threads.net" || h === "threads.com", type: { id: "threads", label: "Threads", category: "social" } },
  { test: (h) => h === "pin.it" || /^pinterest\./.test(h) || /\.pinterest\./.test(h), type: { id: "pinterest", label: "Pinterest", category: "design" } },
  { test: (h) => h === "behance.net", type: { id: "behance", label: "Behance", category: "design" } },
  { test: (h) => h === "dribbble.com", type: { id: "dribbble", label: "Dribbble", category: "design" } },
  { test: (h) => h === "figma.com", type: { id: "figma", label: "Figma", category: "design" } },
  { test: (h) => h === "canva.com" || h === "canva.link", type: { id: "canva", label: "Canva", category: "design" } },
  { test: (h) => h === "dropbox.com" || h === "db.tt", type: { id: "dropbox", label: "Dropbox", category: "files" } },
  { test: (h) => h === "wetransfer.com" || h === "we.tl", type: { id: "wetransfer", label: "WeTransfer", category: "files" } },
  { test: (h) => h === "1drv.ms" || h === "onedrive.live.com" || h.endsWith("sharepoint.com"), type: { id: "onedrive", label: "OneDrive", category: "files" } },
  { test: (h) => h === "icloud.com", type: { id: "icloud", label: "iCloud", category: "files" } },
  { test: (h) => h === "mega.nz" || h === "mega.io", type: { id: "mega", label: "MEGA", category: "files" } },
  { test: (h) => h === "box.com" || h === "app.box.com", type: { id: "box", label: "Box", category: "files" } },
  { test: (h) => h === "notion.so" || h.endsWith("notion.site"), type: { id: "notion", label: "Notion", category: "files" } },
  { test: (h) => h === "linktr.ee", type: { id: "linktree", label: "Linktree", category: "social" } },
  { test: (h) => h === "wa.me" || h === "api.whatsapp.com" || h === "whatsapp.com" || h === "wa.link", type: { id: "whatsapp", label: "WhatsApp", category: "contact" } },
  { test: (h) => h === "t.me", type: { id: "telegram", label: "Telegram", category: "contact" } },
  { test: (h) => h === "calendly.com", type: { id: "calendly", label: "Calendly", category: "contact" } },
  { test: (h) => h === "vimeo.com", type: { id: "vimeo", label: "Vimeo", category: "media" } },
  { test: (h) => h === "open.spotify.com" || h === "spotify.com", type: { id: "spotify", label: "Spotify", category: "media" } },
  { test: (h) => h === "soundcloud.com", type: { id: "soundcloud", label: "SoundCloud", category: "media" } },
  { test: (h) => h === "twitch.tv", type: { id: "twitch", label: "Twitch", category: "media" } },
  { test: (h) => h === "github.com", type: { id: "github", label: "GitHub", category: "web" } },
  { test: (h) => /^mercadolibre\./.test(h) || /\.mercadolibre\./.test(h) || h === "meli.la", type: { id: "mercadolibre", label: "Mercado Libre", category: "store" } },
  { test: (h) => /^amazon\./.test(h) || h === "amzn.to", type: { id: "amazon", label: "Amazon", category: "store" } },
  { test: (h) => h === "etsy.com", type: { id: "etsy", label: "Etsy", category: "store" } },
  { test: (h) => h.endsWith("myshopify.com"), type: { id: "shopify", label: "Tienda Shopify", category: "store" } },
  { test: (h) => h.endsWith("wixsite.com") || h === "wix.com", type: { id: "wix", label: "Sitio en Wix", category: "web" } },
  { test: (h) => h.endsWith("wordpress.com"), type: { id: "wordpress", label: "Sitio en WordPress", category: "web" } },
  { test: (h) => h.endsWith("squarespace.com"), type: { id: "squarespace", label: "Sitio en Squarespace", category: "web" } },
  { test: (h) => h === "airbnb.com" || /^airbnb\./.test(h), type: { id: "airbnb", label: "Airbnb", category: "store" } },
  { test: (h) => /^tripadvisor\./.test(h), type: { id: "tripadvisor", label: "Tripadvisor", category: "maps" } },
  { test: (h) => h === "yelp.com" || /^yelp\./.test(h), type: { id: "yelp", label: "Yelp", category: "maps" } },
  { test: (h) => h === "ubereats.com", type: { id: "ubereats", label: "Uber Eats", category: "store" } },
  { test: (h) => /^rappi\./.test(h), type: { id: "rappi", label: "Rappi", category: "store" } },
];

const FILE_EXT: Record<string, string> = {
  pdf: "Archivo PDF",
  png: "Imagen",
  jpg: "Imagen",
  jpeg: "Imagen",
  webp: "Imagen",
  gif: "Imagen",
  svg: "Logo / vector (SVG)",
  ai: "Archivo de Illustrator",
  psd: "Archivo de Photoshop",
  zip: "Archivo comprimido",
  mp4: "Video",
  mov: "Video",
  docx: "Documento de Word",
  xlsx: "Hoja de Excel",
  pptx: "Presentación",
};

const DEFAULT_PURPOSE: Record<LinkCategory, LinkPurpose> = {
  social: "actual",
  maps: "actual",
  store: "actual",
  contact: "actual",
  media: "actual",
  files: "materiales",
  design: "referencia",
  web: "referencia",
};

/**
 * Convierte lo que pegó el cliente en una URL válida. Acepta "tunegocio.com",
 * "www.…" y URLs completas; rechaza texto suelto, @usuarios y esquemas raros.
 */
export function normalizeUrl(raw: string): { url: string } | { error: string } {
  let text = raw.trim().replace(/^<|>$/g, "").replace(/[),.;]+$/, "");
  if (!text) return { error: "Pega un enlace." };
  if (/^@[\w.]+$/.test(text)) {
    return { error: `Pega el enlace completo de tu perfil (por ejemplo instagram.com/${text.slice(1)}).` };
  }
  if (/\s/.test(text)) return { error: "Eso no parece un enlace: pégalo sin espacios." };
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) {
    if (/^(javascript|data|vbscript|file):/i.test(text)) return { error: "Ese enlace no es válido." };
    text = `https://${text}`;
  }
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return { error: "Ese enlace no es válido. Revisa que esté completo." };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return { error: "Usa un enlace que empiece con https://" };
  if (!url.hostname.includes(".") || url.hostname.endsWith(".")) return { error: "Le falta el dominio (.com, .mx…)." };
  return { url: url.toString() };
}

/** Qué tipo de enlace es (Instagram, Drive, Figma…) y su categoría. */
export function detectLinkType(url: string): LinkType {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { id: "web", label: "Sitio web", category: "web" };
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = parsed.pathname.toLowerCase();
  for (const rule of LINK_RULES) {
    if (rule.test(host, path)) return rule.type;
  }
  const ext = path.match(/\.([a-z0-9]{2,4})$/)?.[1];
  if (ext && FILE_EXT[ext]) return { id: "file", label: FILE_EXT[ext], category: "files" };
  return { id: "web", label: "Sitio web", category: "web" };
}

/** Un enlace listo para el briefing, con su tipo y un propósito sugerido. */
export function makeBriefLink(url: string, purpose?: LinkPurpose): BriefLink {
  const type = detectLinkType(url);
  return { url, type: type.id, label: type.label, category: type.category, purpose: purpose ?? DEFAULT_PURPOSE[type.category] };
}

/** Saca todas las URLs de un texto pegado (varias por línea, comas, espacios). */
export function extractUrls(text: string): string[] {
  const found = text.match(/(?:https?:\/\/|www\.)[^\s<>"',]+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|mx|net|org|io|co|app|site|store|shop|es|fr|me|ly|gl|ee|tv|link)(?:\.[a-z]{2})?(?:\/[^\s<>"',]*)?/gi);
  if (!found) return [];
  const urls: string[] = [];
  for (const raw of found) {
    const result = normalizeUrl(raw);
    if ("url" in result && !urls.includes(result.url)) urls.push(result.url);
  }
  return urls;
}

export function purposeLabel(id: string): string {
  return LINK_PURPOSES.find((p) => p.id === id)?.label ?? "Otro";
}

// ——— Estado del briefing ———

export interface BriefState {
  values: Record<string, string>;
  features: string[];
  links: BriefLink[];
}

export const EMPTY_BRIEF: BriefState = { values: {}, features: [], links: [] };

export function briefProgress(state: BriefState): number {
  const filled = BRIEF_PROGRESS_KEYS.filter((k) => state.values[k]?.trim()).length;
  const extras = (state.links.length ? 1 : 0) + (state.features.length ? 1 : 0);
  return Math.round(((filled + extras) / (BRIEF_PROGRESS_KEYS.length + 2)) * 100);
}

/** Valida un estado guardado (localStorage puede venir alterado). */
export function sanitizeBriefState(raw: unknown): BriefState {
  if (!raw || typeof raw !== "object") return EMPTY_BRIEF;
  const r = raw as Record<string, unknown>;
  const values: Record<string, string> = {};
  if (r.values && typeof r.values === "object") {
    for (const [k, v] of Object.entries(r.values as Record<string, unknown>)) {
      if (BRIEF_FIELD_BY_KEY.has(k) && typeof v === "string") values[k] = v.slice(0, 4000);
    }
  }
  const features = Array.isArray(r.features)
    ? r.features.filter((f): f is string => typeof f === "string" && (BRIEF_FEATURES as readonly string[]).includes(f))
    : [];
  const links = Array.isArray(r.links)
    ? r.links
        .map((l) => {
          if (!l || typeof l !== "object") return null;
          const { url, purpose } = l as Record<string, unknown>;
          if (typeof url !== "string") return null;
          const norm = normalizeUrl(url);
          if (!("url" in norm)) return null;
          const p = LINK_PURPOSES.some((x) => x.id === purpose) ? (purpose as LinkPurpose) : undefined;
          return makeBriefLink(norm.url, p);
        })
        .filter((l): l is BriefLink => l !== null)
        .slice(0, 20)
    : [];
  return { values, features, links };
}

/** El briefing como texto para WhatsApp (respaldo si el correo falla). */
export function briefToText(state: BriefState, paymentRef?: string): string {
  const v = state.values;
  const lines: (string | false | undefined)[] = ["*Nuevo briefing — BryanF Design*"];
  for (const section of BRIEF_SECTIONS) {
    const rows = section.fields.filter((f) => v[f.key]?.trim()).map((f) => `*${f.label}:* ${v[f.key].trim()}`);
    if (section.id === "proyecto" && state.features.length) rows.push(`*Funciones:* ${state.features.join(", ")}`);
    if (rows.length) lines.push("", `_${section.title}_`, ...rows);
  }
  if (state.links.length) {
    lines.push("", "_Enlaces_", ...state.links.map((l) => `• ${l.label} (${purposeLabel(l.purpose)}): ${l.url}`));
  }
  if (v.notes?.trim()) lines.push("", `*Notas:* ${v.notes.trim()}`);
  if (paymentRef) lines.push("", `*Ref. pago:* ${paymentRef}`);
  return lines.filter((l) => l !== false && l !== undefined).join("\n");
}

// ——— Lumina, asistente del briefing ———

export const STUDIO_FACTS = {
  whatsapp: "+52 56 6301 2505",
  whatsappHref: "https://wa.me/525663012505",
  email: "bryanf@bryanfdesign.com",
  phoneHref: "tel:+525663012505",
  instagram: "https://www.instagram.com/bryanf_design/",
  facebook: "https://www.facebook.com/share/1R1rS2ToKf/",
  linkedin: "https://www.linkedin.com/in/bryanfdesigner",
  hours: "Lunes a viernes de 9:00 a 19:00 (hora de Ciudad de México)",
};

export function briefLuminaPrompt(state: BriefState, context: { subscription: boolean; view: string }) {
  const fieldList = ALL_BRIEF_FIELDS.map((f) =>
    f.options ? `${f.key} (${f.label}) — SOLO uno de: ${f.options.join(" | ")}` : `${f.key} (${f.label})`
  ).join("\n");
  const filled = Object.fromEntries(Object.entries(state.values).filter(([, v]) => v.trim()));
  const missing = BRIEF_PROGRESS_KEYS.filter((k) => !state.values[k]?.trim());

  return `Eres LUMINA, la asistente de BryanF Design. El cliente ${
    context.subscription ? "acaba de contratar la Suscripción Todo Digital" : "acaba de pagar (o va a pagar por transferencia) su proyecto"
  } y está llenando su BRIEFING de arranque en la página de gracias. Tu trabajo: ayudarle a llenarlo rápido y bien, resolver sus dudas del negocio y de cómo seguimos.

SOBRE BRYANF DESIGN:
- Estudio de diseño y desarrollo web en Ciudad de México, fundado en 2020 por Bryan F. Más de 150 proyectos en México, España y Francia.
- Hacemos: páginas web, landing pages, tiendas en línea, sitios corporativos, software a medida, diseño UX/UI, WordPress, SEO técnico, mantenimiento, tarjetas digitales, firmas de correo y kits de presencia digital.
- Tecnología: Next.js, React, TypeScript, Tailwind, Node.js, PHP, WordPress, Stripe, Mercado Pago, Figma, Vercel.
- Qué sigue después del briefing: lo revisamos en menos de 24 horas hábiles y le mandamos la ruta del proyecto; una videollamada de arranque de 20 minutos; construimos y le enseñamos avances hasta publicar. Entregas desde 3 días hábiles con la información completa.
- Suscripción: entregas de 1 a 2 días hábiles por solicitud, una solicitud activa a la vez, cambios ilimitados.
- Contacto: WhatsApp ${STUDIO_FACTS.whatsapp}, correo ${STUDIO_FACTS.email}, Instagram @bryanf_design. Horario: ${STUDIO_FACTS.hours}.
- Pagos por transferencia: el cliente manda su comprobante por WhatsApp o correo y lo confirmamos.

CAMPOS DEL BRIEFING (clave — etiqueta):
${fieldList}
features — lista, SOLO de: ${BRIEF_FEATURES.join(" | ")}
links — URLs que el cliente te dé (su sitio, redes, Drive, referencias).

YA LLENÓ: ${JSON.stringify(filled).slice(0, 3000)}
FUNCIONES MARCADAS: ${state.features.join(", ") || "ninguna"}
ENLACES: ${state.links.map((l) => `${l.label}: ${l.url}`).join(" ; ") || "ninguno"}
LE FALTA: ${missing.join(", ") || "nada importante"}

RESPONDE SIEMPRE con JSON válido, sin texto fuera:
{
  "say": "1 a 3 frases cortas y cálidas, en español. Puedes usar <strong>.",
  "fill": { "clave": "valor" } — lo que el cliente te dijo, redactado claro y en su voz (primera persona del negocio). Solo claves de la lista. Para campos con opciones usa EXACTAMENTE una opción. No inventes datos que no te dio; puedes ordenar y pulir su redacción.,
  "features": [funciones de la lista que pidió],
  "links": [URLs completas que te pasó],
  "ask": "la siguiente pregunta, UNA sola, sobre lo que más falta (o vacío si ya está completo)",
  "chips": [hasta 3 respuestas rápidas cortas que el cliente podría tocar]
}
Reglas: pregunta de una en una, empezando por lo que falta. Si pregunta algo del negocio, contacto o pagos, respóndelo con los datos de arriba (nunca inventes precios, plazos ni datos). Nunca pidas contraseñas ni datos de tarjeta. Si ya está completo, dile que puede revisar y tocar "Enviar briefing".`;
}

export interface BriefLuminaReply {
  say: string;
  ask: string;
  chips: string[];
  fill: Record<string, string>;
  features: string[];
  links: string[];
}

/** Interpreta y valida la respuesta de Lumina: nada fuera de la lista entra al formulario. */
export function parseBriefLuminaReply(raw: string): BriefLuminaReply | null {
  let data: Record<string, unknown>;
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    data = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  const fill: Record<string, string> = {};
  if (data.fill && typeof data.fill === "object") {
    for (const [key, value] of Object.entries(data.fill as Record<string, unknown>)) {
      const field = BRIEF_FIELD_BY_KEY.get(key);
      const text = str(value, LONG_BRIEF_FIELDS.has(key) ? 2000 : 300);
      if (!field || !text) continue;
      if (field.options) {
        const match = field.options.find((o) => o.toLowerCase() === text.toLowerCase());
        if (match) fill[key] = match;
      } else {
        fill[key] = text.replace(/<[^>]+>/g, "");
      }
    }
  }
  const features = Array.isArray(data.features)
    ? data.features.filter((f): f is string => typeof f === "string" && (BRIEF_FEATURES as readonly string[]).includes(f))
    : [];
  const links = Array.isArray(data.links)
    ? data.links.flatMap((l) => (typeof l === "string" ? extractUrls(l) : [])).slice(0, 10)
    : [];
  const chips = Array.isArray(data.chips)
    ? data.chips.map((c) => str(c, 60).replace(/<[^>]+>/g, "")).filter(Boolean).slice(0, 3)
    : [];
  const say = str(data.say, 600);
  const ask = str(data.ask, 300).replace(/<[^>]+>/g, "");
  if (!say && !ask && !Object.keys(fill).length) return null;
  return { say, ask, chips, fill, features, links };
}

import type { Locale } from "@/lib/i18n/locales";

/**
 * COMENTARIOS DE LUMINA SEGÚN LO QUE ESTÁS VIENDO.
 *
 * Lumina mira en qué sección está el visitante. Si se queda ahí un rato
 * (`dwell`), a veces le deja una burbuja corta con una pregunta que viene al
 * caso; tocarla abre el chat y le manda `ask`. "A veces" a propósito: cada
 * comentario sale una sola vez por sesión, solo con probabilidad `CHANCE`,
 * con al menos `GAP_MS` entre burbujas y un máximo de `MAX_PER_SESSION`.
 *
 * La sección se reconoce por `data-lumina-topic`, su `id` o su
 * `aria-labelledby` sin el sufijo `-title` (ver `topicOf`).
 */

export const NUDGE_MAX_PER_SESSION = 3;
export const NUDGE_GAP_MS = 80_000;
export const NUDGE_CHANCE = 0.7;

interface NudgeCopy {
  /** Lo que dice la burbuja (escritorio). */
  say: string;
  /** Versión de una línea para teléfono. */
  short: string;
  /** Mensaje que se envía si la tocan. */
  ask: string;
}

export interface LuminaNudge {
  id: string;
  /** Ruta exacta, o prefijo si termina en `*`. */
  path: string;
  /** Tema/sección; sin él vale cualquier parte de la página. */
  topic?: string;
  /** Tiempo (ms) que debe quedarse en esa sección antes de comentar. */
  dwell: number;
  es: NudgeCopy;
  en: NudgeCopy;
}

const SERVICE_PAGES = [
  "/desarrollo-web-mexico",
  "/diseno-web-mexico",
  "/diseno-ux-ui-mexico",
  "/paginas-web-para-negocios",
  "/software-a-medida-mexico",
  "/mantenimiento-web-mexico",
];

const LIKE_THE_WORK = {
  es: {
    say: "¿Te gusta el trabajo? ¿Te gustaría que tu página se viera así? Te digo qué necesitarías ✨",
    short: "¿Te gustaría una web así? ✨",
    ask: "Me gusta este trabajo, ¿qué necesitaría para que mi página se vea así?",
  },
  en: {
    say: "Like the work? Want your site to look like this? I can tell you what it would take ✨",
    short: "Want a site like this? ✨",
    ask: "I like this work. What would I need for my site to look like this?",
  },
};

export const LUMINA_NUDGES: LuminaNudge[] = [
  // ——— Home ———
  { id: "home-projects", path: "/", topic: "projects", dwell: 16_000, ...LIKE_THE_WORK },
  {
    id: "home-services",
    path: "/",
    topic: "servicios-entrada",
    dwell: 18_000,
    es: {
      say: "¿Algo de esto te sirve para empezar? Te digo cuál le queda mejor a tu negocio.",
      short: "¿Te ayudo a elegir? ✨",
      ask: "¿Cuál de los servicios de entrada me conviene para empezar?",
    },
    en: {
      say: "Anything here to get started? I can tell you which one fits your business best.",
      short: "Want help choosing? ✨",
      ask: "Which entry service should I start with?",
    },
  },
  {
    id: "home-subscription",
    path: "/",
    topic: "suscripcion",
    dwell: 14_000,
    es: {
      say: "¿Quieres que te cuente más sobre la suscripción mensual? Te explico qué incluye.",
      short: "¿Te cuento de la suscripción?",
      ask: "Cuéntame más sobre la suscripción mensual Todo Digital.",
    },
    en: {
      say: "Want me to tell you more about the monthly subscription? I'll walk you through it.",
      short: "About the subscription?",
      ask: "Tell me more about the monthly All-Digital subscription.",
    },
  },
  {
    id: "home-faq",
    path: "/",
    topic: "faq",
    dwell: 20_000,
    es: {
      say: "¿No encontraste tu duda? Pregúntame lo que quieras, te respondo al momento.",
      short: "¿Otra duda? Pregúntame",
      ask: "Tengo una duda que no está en las preguntas frecuentes.",
    },
    en: {
      say: "Didn't find your question? Ask me anything, I'll answer right away.",
      short: "Other question? Ask me",
      ask: "I have a question that isn't in the FAQ.",
    },
  },

  // ——— Páginas de servicio ———
  ...SERVICE_PAGES.flatMap<LuminaNudge>((path) => [
    { id: `${path}-casos`, path, topic: "casos", dwell: 14_000, ...LIKE_THE_WORK },
    {
      id: `${path}-preguntas`,
      path,
      topic: "preguntas",
      dwell: 20_000,
      es: {
        say: "¿Te quedó alguna duda sobre esto? Pregúntame y te respondo con precios reales.",
        short: "¿Alguna duda? ✨",
        ask: "Tengo una duda sobre este servicio.",
      },
      en: {
        say: "Any questions about this? Ask me and I'll answer with real prices.",
        short: "Any questions? ✨",
        ask: "I have a question about this service.",
      },
    },
  ]),

  // ——— Acerca de Lumina ———
  {
    id: "lumina-page",
    path: "/lumina",
    dwell: 20_000,
    es: {
      say: "¿Tienes alguna pregunta? Pruébame: pídeme precios o que te arme tu web.",
      short: "¿Alguna pregunta? Pruébame",
      ask: "Hola Lumina, ¿qué puedes hacer por mí?",
    },
    en: {
      say: "Got any questions? Try me: ask for prices or let me build your package.",
      short: "Questions? Try me",
      ask: "Hi Lumina, what can you do for me?",
    },
  },

  // ——— Suscripción ———
  {
    id: "sub-plan",
    path: "/suscripcion",
    topic: "plan",
    dwell: 15_000,
    es: {
      say: "¿Quieres que te cuente más sobre esto? Te explico cómo funciona mes a mes.",
      short: "¿Te cuento más? ✨",
      ask: "Cuéntame más sobre la suscripción: ¿cómo funciona mes a mes?",
    },
    en: {
      say: "Want me to tell you more? I'll explain how it works month to month.",
      short: "Want to know more? ✨",
      ask: "Tell me more about the subscription: how does it work each month?",
    },
  },
  {
    id: "sub-panel",
    path: "/suscripcion",
    topic: "tu-panel",
    dwell: 14_000,
    es: {
      say: "¿Te gustaría tener tu propio panel así? Te cuento cómo pides cosas desde ahí.",
      short: "¿Un panel así para ti?",
      ask: "¿Cómo funciona el panel del suscriptor y cómo pido cosas desde ahí?",
    },
    en: {
      say: "Want your own dashboard like this? I'll show you how requests work from there.",
      short: "A dashboard like this?",
      ask: "How does the subscriber dashboard work and how do I make requests?",
    },
  },
  {
    id: "sub-work",
    path: "/suscripcion",
    topic: "trabajos",
    dwell: 12_000,
    es: {
      say: "¿Te gusta el trabajo? ¿Te gustaría que tu negocio se viera así cada mes?",
      short: "¿Te gustaría algo así? ✨",
      ask: "Me gusta este trabajo, ¿cómo sería con la suscripción para mi negocio?",
    },
    en: {
      say: "Like the work? Want your business to look like this every month?",
      short: "Want something like this? ✨",
      ask: "I like this work. How would the subscription work for my business?",
    },
  },
  {
    id: "sub-compare",
    path: "/suscripcion",
    topic: "compara",
    dwell: 15_000,
    es: {
      say: "¿Dudas entre la suscripción y un proyecto único? Te digo cuál te conviene.",
      short: "¿Cuál te conviene?",
      ask: "¿Me conviene más la suscripción o pagar un proyecto único?",
    },
    en: {
      say: "Torn between the subscription and a one-off project? I'll tell you which fits.",
      short: "Which one fits you?",
      ask: "Is the subscription or a one-off project better for me?",
    },
  },
  {
    id: "sub-policy",
    path: "/suscripcion",
    topic: "politica",
    dwell: 22_000,
    es: {
      say: "¿Algo de la política no te queda claro? Pregúntame, te lo explico sin letra chiquita.",
      short: "¿Te explico la política?",
      ask: "Explícame la política de la suscripción en pocas palabras.",
    },
    en: {
      say: "Anything in the policy unclear? Ask me, I'll explain it plainly.",
      short: "Explain the policy?",
      ask: "Explain the subscription policy in a few words.",
    },
  },
  {
    id: "sub-faq",
    path: "/suscripcion/preguntas-frecuentes",
    dwell: 25_000,
    es: {
      say: "¿No encuentras tu duda? Pregúntamela directo y te respondo.",
      short: "¿No la encuentras? Pregúntame",
      ask: "Tengo una duda sobre la suscripción.",
    },
    en: {
      say: "Can't find your question? Ask me directly.",
      short: "Can't find it? Ask me",
      ask: "I have a question about the subscription.",
    },
  },

  // ——— Conoce a Bryan ———
  { id: "about-cases", path: "/conoce-a-bryan", topic: "casos-de-estudio", dwell: 16_000, ...LIKE_THE_WORK },
  {
    id: "about-process",
    path: "/conoce-a-bryan",
    topic: "proceso",
    dwell: 18_000,
    es: {
      say: "¿Quieres saber cómo sería este proceso con tu proyecto? Te lo cuento en corto.",
      short: "¿Y con tu proyecto?",
      ask: "¿Cómo sería el proceso con mi proyecto y cuánto tardaría?",
    },
    en: {
      say: "Want to know how this process would go for your project? I'll keep it short.",
      short: "And for your project?",
      ask: "How would the process go for my project, and how long would it take?",
    },
  },

  // ——— Crear web ———
  {
    id: "crear-web",
    path: "/crear-web",
    dwell: 22_000,
    es: {
      say: "¿Te ayudo a armar tu paquete? Dime de qué es tu negocio y lo dejo listo.",
      short: "¿Te armo el paquete?",
      ask: "Ayúdame a armar el paquete para mi web.",
    },
    en: {
      say: "Want help building your package? Tell me about your business and I'll set it up.",
      short: "Build my package?",
      ask: "Help me build the package for my website.",
    },
  },

  // ——— Gracias ———
  {
    id: "gracias",
    path: "/gracias",
    dwell: 30_000,
    es: {
      say: "¿Tienes dudas sobre los siguientes pasos? Aquí estoy.",
      short: "¿Dudas? Aquí estoy",
      ask: "¿Qué sigue después de mi pago?",
    },
    en: {
      say: "Questions about next steps? I'm here.",
      short: "Questions? I'm here",
      ask: "What happens after my payment?",
    },
  },
];

/** Comentario para la 404 (no tiene ruta fija). */
export const NOT_FOUND_NUDGE: LuminaNudge = {
  id: "not-found",
  path: "*",
  dwell: 6_000,
  es: {
    say: "¿Te perdiste? Dime qué buscas y te llevo.",
    short: "¿Te perdiste? Te llevo",
    ask: "Me perdí, ¿me ayudas a encontrar lo que busco?",
  },
  en: {
    say: "Lost? Tell me what you're looking for and I'll take you there.",
    short: "Lost? I'll guide you",
    ask: "I'm lost, can you help me find what I'm looking for?",
  },
};

/** Tema de una sección: `data-lumina-topic`, su id o su título sin `-title`. */
export function topicOf(el: Element): string {
  return (
    el.getAttribute("data-lumina-topic") ||
    el.id ||
    (el.getAttribute("aria-labelledby") || "").replace(/-title$/, "")
  );
}

/** Sección en el centro de la pantalla (la que el visitante está leyendo). */
export function sectionInView(): Element | null {
  if (typeof document === "undefined") return null;
  const y = window.innerHeight / 2;
  const sections = Array.from(document.querySelectorAll("main section, main [data-lumina-topic]"));
  // La más interna gana: un bloque con tema dentro de otra sección.
  let best: Element | null = null;
  for (const el of sections) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom >= y && topicOf(el)) best = el;
  }
  return best;
}

function pathMatches(rule: string, path: string) {
  if (rule.endsWith("*")) return path.startsWith(rule.slice(0, -1));
  return rule === path;
}

/** Comentario que corresponde a esta ruta y sección (el más específico). */
export function findNudge(path: string, topic: string, isNotFound: boolean): LuminaNudge | null {
  if (isNotFound) return NOT_FOUND_NUDGE;
  const clean = path.replace(/\/+$/, "") || "/";
  const candidates = LUMINA_NUDGES.filter((n) => pathMatches(n.path, clean));
  return candidates.find((n) => n.topic && n.topic === topic) || candidates.find((n) => !n.topic) || null;
}

export function nudgeCopy(nudge: LuminaNudge, locale: Locale): NudgeCopy {
  return locale === "es" ? nudge.es : nudge.en;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight, Calculator, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { useFooterInView } from "@/lib/use-footer-in-view";
import { useLanguage } from "@/lib/i18n/context";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { trackEvent } from "@/lib/analytics";
import { mobileShot, projects } from "@/lib/projects";
import {
  LUMINA_QUOTE_EVENT,
  LUMINA_SECTIONS,
  actionsPrompt,
  currentSectionLabel,
  extractActions,
  isLuminaAction,
  quoteHref,
  type LuminaAction,
  type LuminaQuote,
  type LuminaSection,
} from "@/lib/lumina-actions";

type Mood = "Normal" | "Enfocada" | "Duda" | "Sorprendida" | "Offline";

const MOOD_IMG: Record<Mood, string> = {
  Normal: "/img/lumina/Normal.png",
  Enfocada: "/img/lumina/Enfocada.png",
  Duda: "/img/lumina/Duda.png",
  Sorprendida: "/img/lumina/Sorprendida.png",
  Offline: "/img/lumina/Offline.png",
};

const WHATSAPP_NUMBER = "525663012505";
const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

function buildSystemPrompt(languageName: string, section: string) {
  return `Eres LUMINA, asistente comercial de BryanF Design.
Tu meta es orientar, resolver dudas y guiar al usuario a armar su web o contactar al equipo.

Lo que hace BryanF Design: branding, diseño UX/UI, desarrollo web, WordPress, SEO técnico, performance, mantenimiento, e-commerce, landing pages y automatización.
Cómo funciona: paquete base desde $3,500 MXN + módulos (e-commerce, pagos, secciones extra) + modalidad de pago.
También ofrecemos servicios de entrada, más económicos: tarjeta de presentación digital ($900 MXN), tarjeta de presentación imprimible ($650 MXN), firma de correo profesional ($350 MXN), kit de presencia digital ($1,500 MXN) y landing page esencial (desde $2,400 MXN).
Tiempos de entrega: desde 3 días hábiles cuando la información está completa.
Pagos: Stripe (tarjeta), Mercado Pago o transferencia bancaria BBVA.
Para armar y pagar: el cotizador del sitio (tú lo puedes dejar armado con [[cotizar:...]]).

${actionsPrompt(section)}

Reglas:
- Responde siempre en ${languageName}, sin importar en qué idioma esté escrito este prompt.
- Si preguntan precios, responde que depende del alcance, desde $3,500 MXN, recomienda la mejor opción en 1 línea y déjala armada con [[cotizar:...]].
- Responde en tono premium, claro y breve (máx 3-4 líneas).
- Usa HTML básico: <strong>, <br>, <ul>, <li>, <a>.`;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  /** Botones que Lumina dejó con su respuesta (ver lib/lumina-actions). */
  actions?: LuminaAction[];
}

// sessionStorage, not localStorage: the conversation should survive a reload
// or a navigation within the site (tab close = fresh start), no backend involved.
const SESSION_KEY = "bryanf_lumina_chat_v1";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function readStoredMessages(): Msg[] | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (message) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string"
      )
    ) {
      return (parsed as Msg[]).map((message) => ({
        ...message,
        actions: Array.isArray(message.actions) ? message.actions.filter(isLuminaAction) : undefined,
      }));
    }
  } catch {
    /* storage bloqueado o corrupto */
  }
  return null;
}

// Allowlist-based sanitizer for assistant HTML (defense-in-depth vs XSS).
// Runs client-side only (uses DOM); assistant messages are only added after a
// client fetch, so this is always called in the browser.
const ALLOWED = new Set([
  "STRONG",
  "B",
  "EM",
  "I",
  "BR",
  "UL",
  "OL",
  "LI",
  "P",
  "A",
  "SPAN",
]);
function sanitizeHtml(html: string): string {
  if (typeof document === "undefined") return "";
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  tpl.content.querySelectorAll("*").forEach((el) => {
    if (!ALLOWED.has(el.tagName)) {
      el.replaceWith(...Array.from(el.childNodes));
      return;
    }
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const isSafeHref =
        el.tagName === "A" &&
        name === "href" &&
        !/^\s*javascript:/i.test(attr.value);
      if (!isSafeHref) el.removeAttribute(attr.name);
    });
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });
  return tpl.innerHTML;
}

/** Teléfono = la hoja de chat ocupa toda la pantalla (por debajo de `sm`). */
function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isPhone;
}

/** true cuando el héroe (#home) ya quedó arriba; sin héroe, siempre true. */
function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) {
      setPast(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return past;
}

export function LuminaChat() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const configuratorInView = useConfiguratorInView();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("Normal");
  const [teaser, setTeaser] = useState(false);
  const [teaserDue, setTeaserDue] = useState(false);
  const isPhone = useIsPhone();
  const pastHero = usePastHero();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: t.lumina.greeting },
  ]);
  const [messagesRestored, setMessagesRestored] = useState(false);
  const [retryText, setRetryText] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const hasTeasedRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;
  const footerInView = useFooterInView();
  const footerInViewRef = useRef(footerInView);
  footerInViewRef.current = footerInView;

  const restoreChatFocus = useCallback(() => {
    window.setTimeout(() => {
      const target = footerInViewRef.current
        ? document.querySelector<HTMLElement>('footer a[href], footer button:not([disabled])')
        : fabRef.current;
      target?.focus();
    });
  }, []);

  function markTeased() {
    hasTeasedRef.current = true;
    try {
      window.sessionStorage.setItem("bryanf_lumina_teased", "1");
    } catch {
      /* sessionStorage bloqueado */
    }
  }

  // Broadcast open/closed so other fixed UI (the language notice banner) can
  // get out of the way instead of covering the full-screen mobile chat.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lumina:visibility", { detail: { open } }));
  }, [open]);

  // El dock flotante (WhatsApp) se apila encima de este botón mientras exista.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--lumina-fab", "calc(var(--fab-size) + var(--fab-gap))");
    return () => {
      root.style.removeProperty("--lumina-fab");
    };
  }, []);

  // Restore only after hydration so the server and first client render match.
  useEffect(() => {
    const stored = readStoredMessages();
    if (stored?.length) setMessages(stored);
    setMessagesRestored(true);
  }, []);

  // Persist so a reload or in-site navigation doesn't drop the conversation.
  useEffect(() => {
    if (!messagesRestored) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {
      /* storage bloqueado */
    }
  }, [messages, messagesRestored]);

  // Body scroll lock only on mobile: there the chat is a full-screen sheet, so
  // the page underneath shouldn't scroll behind it. Desktop stays a corner
  // panel that never covers navigation, so its scroll is left untouched.
  useEffect(() => {
    if (!open || !isPhone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isPhone]);

  // If the visitor changes language before sending their first message,
  // swap the greeting too — but never touch an in-progress conversation.
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "assistant"
        ? [{ role: "assistant", content: t.lumina.greeting }]
        : prev
    );
  }, [t.lumina.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, loading]);

  useEffect(() => {
    if (footerInView) {
      setTeaser(false);
    }
  }, [footerInView]);

  // El configurador concentra las acciones de compra. Si ocupa el viewport,
  // cierra el panel grande, descarta el teaser y deja solo el acceso compacto.
  useEffect(() => {
    if (configuratorInView) {
      if (openRef.current) restoreChatFocus();
      setOpen(false);
      setTeaser(false);
    }
  }, [configuratorInView, restoreChatFocus]);

  // En teléfono la hoja tapa toda la pantalla: es modal (fondo inert y foco
  // atrapado). Desde `sm` es una tarjeta de esquina NO modal: la página sigue
  // usable y el FAB (que muestra la ×) la cierra.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const parent = panel?.parentElement;
    const background =
      isPhone && parent
        ? Array.from(parent.children)
            .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== panel)
            .map((element) => ({ element, inert: element.inert }))
        : [];
    background.forEach(({ element }) => {
      element.inert = true;
    });

    // Con mouse se enfoca la caja de texto. En pantallas táctiles se enfoca el
    // diálogo: abrir el teclado de golpe tapaba las preguntas rápidas.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const focusTimer = window.setTimeout(() => {
      if (finePointer) inputRef.current?.focus();
      else panel?.focus({ preventScroll: true });
    }, 120);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Sin modal, Escape solo cierra si el foco está en el chat o su botón.
        const active = document.activeElement;
        const inChat =
          !active || active === document.body || active === fabRef.current || !!panel?.contains(active);
        if (!isPhone && !inChat) return;
        setOpen(false);
        restoreChatFocus();
        return;
      }
      if (!isPhone || event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.getAttribute("aria-hidden") !== "true"
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      background.forEach(({ element, inert }) => {
        element.inert = inert;
      });
    };
  }, [open, isPhone, restoreChatFocus]);

  // Burbuja proactiva: saluda una sola vez si aún no abrieron el chat. Llega
  // a los 12.5 s (el aviso de idioma se va a los 11.2 s) y, en teléfono, solo
  // cuando el héroe ya quedó atrás para no tapar su contenido.
  useEffect(() => {
    try {
      hasTeasedRef.current =
        hasTeasedRef.current ||
        window.sessionStorage.getItem("bryanf_lumina_teased") === "1";
    } catch {
      /* sessionStorage bloqueado */
    }
    if (hasTeasedRef.current) return;
    const dueAt = window.setTimeout(() => setTeaserDue(true), 12_500);
    return () => window.clearTimeout(dueAt);
  }, []);

  useEffect(() => {
    if (!teaserDue || hasTeasedRef.current || open || configuratorInView) return;
    // Nunca encima del hero (ahí taparía la tarjeta destacada o los CTA).
    if (!pastHero) return;
    markTeased();
    setTeaser(true);
  }, [teaserDue, open, configuratorInView, isPhone, pastHero]);

  // El botón se aparta con el footer, dentro del cotizador y, en teléfono,
  // mientras el hero ocupa la pantalla (taparía el CTA principal).
  const hideFab =
    !open && (footerInView || configuratorInView || (isPhone && !pastHero));

  // Se retira sola a los 7 s.
  useEffect(() => {
    if (!teaser) return;
    const hideAt = window.setTimeout(() => setTeaser(false), 7_000);
    return () => window.clearTimeout(hideAt);
  }, [teaser]);

  function openChat() {
    markTeased();
    setOpen((o) => !o);
    setTeaser(false);
    setMood("Sorprendida");
    window.setTimeout(() => setMood("Normal"), 1400);
  }

  // Cualquier parte del sitio puede abrir el chat (la sección de Lumina lo
  // usa): `lumina:open` con un mensaje opcional que se envía al instante.
  // send() vive en un ref para que el listener nunca vea estado viejo.
  const sendRef = useRef<(text: string) => void>(() => {});
  useEffect(() => {
    function onOpenEvent(e: Event) {
      markTeased();
      setOpen(true);
      setTeaser(false);
      setMood("Sorprendida");
      window.setTimeout(() => setMood("Normal"), 1400);
      const message = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (message) window.setTimeout(() => sendRef.current(message), 350);
    }
    window.addEventListener("lumina:open", onOpenEvent);
    return () => window.removeEventListener("lumina:open", onOpenEvent);
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setMood("Enfocada");
    setRetryText(null);
    try {
      const res = await fetch("/api/openai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(t.lumina.languageInstruction, currentSectionLabel()),
            },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.4,
        }),
      });
      const data = await res.json();
      const uncertain = !data?.choices?.[0]?.message?.content && !data?.error;
      const reply =
        data?.choices?.[0]?.message?.content ||
        (data?.error ? t.lumina.errorFallback : t.lumina.misunderstood);
      const { text, actions } = extractActions(reply);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: sanitizeHtml(text),
          actions: actions.length ? actions : undefined,
        },
      ]);
      setMood(uncertain ? "Duda" : "Normal");
      if (uncertain) window.setTimeout(() => setMood("Normal"), 4000);
      if (data?.error) setRetryText(content);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: t.lumina.connectionError,
        },
      ]);
      setMood("Offline");
      setRetryText(content);
    } finally {
      setLoading(false);
    }
  }
  sendRef.current = send;

  function retry() {
    if (!retryText || loading) return;
    const text = retryText;
    setRetryText(null);
    send(text);
  }

  // ——— Acciones de Lumina sobre el sitio ———
  // En teléfono el chat tapa la pantalla: se cierra para que se vea a dónde
  // llevó. En escritorio sigue abierto en su esquina.
  function revealSection(id: string) {
    const target = document.getElementById(id);
    if (!target) {
      window.location.href = `/#${id}`;
      return;
    }
    if (isPhone) setOpen(false);
    window.setTimeout(
      () => {
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        target.classList.remove("lumina-spot");
        void target.offsetWidth;
        target.classList.add("lumina-spot");
        window.setTimeout(() => target.classList.remove("lumina-spot"), 2600);
      },
      isPhone ? 260 : 0
    );
  }

  function goTo(section: LuminaSection) {
    trackEvent("lumina_action", { action: "go", section });
    revealSection(LUMINA_SECTIONS[section]);
  }

  function applyQuote(quote: LuminaQuote) {
    trackEvent("lumina_action", { action: "quote", plan: quote.plan });
    // Con el cotizador en la página, se arma en vivo; si no, se abre ya armado.
    if (!document.getElementById("precios")) {
      window.location.href = quoteHref(quote);
      return;
    }
    window.dispatchEvent(new CustomEvent(LUMINA_QUOTE_EVENT, { detail: quote }));
    revealSection("precios");
  }

  function whatsappHref() {
    const asks = messages
      .filter((m) => m.role === "user")
      .slice(-4)
      .map((m) => `• ${m.content.slice(0, 220)}`);
    const text = [t.lumina.actions.whatsappIntro, ...asks].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function sectionLabel(section: LuminaSection) {
    const labels: Record<LuminaSection, string> = {
      proyectos: t.nav.proyectos,
      casos: t.lumina.actions.cases,
      proceso: t.nav.proceso,
      servicios: t.nav.serviciosEntrada,
      precios: t.nav.precios,
      faq: t.nav.faq,
    };
    return labels[section];
  }

  function renderActions(actions: LuminaAction[]) {
    const cards = actions.filter((a): a is Extract<LuminaAction, { kind: "project" }> => a.kind === "project");
    const buttons = actions.filter((a) => a.kind !== "project");
    const pill =
      "group inline-flex min-h-11 max-w-full items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-left text-sm font-semibold transition-colors";
    return (
      <div className="flex w-full flex-col gap-2 self-start">
        {cards.length > 0 && (
          <ul role="list" className="-mx-1 -my-1 flex snap-x gap-2 overflow-x-auto px-1 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cards.map(({ slug }) => {
              const project = projectBySlug.get(slug);
              if (!project) return null;
              const desc = t.projects.descs[slug] || project.desc;
              return (
                <li key={slug} className="w-[11.5rem] shrink-0 snap-start">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("lumina_action", { action: "project", slug })}
                    className="group flex h-full items-center gap-2.5 rounded-[1.1rem] bg-white p-1.5 pr-2.5 ring-1 ring-ink/[0.08] transition-shadow hover:shadow-soft"
                  >
                    {/* La miniatura sobresale de la ficha, como las capturas del portafolio. */}
                    <span className="relative -my-3 h-[4.5rem] w-11 shrink-0 overflow-hidden rounded-[0.6rem] bg-ink shadow-[0_10px_18px_-10px_hsl(var(--ink)/0.6)] ring-2 ring-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-3">
                      <Image src={mobileShot(slug)} alt="" fill sizes="44px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[0.875rem] font-bold text-ink">{project.name}</span>
                      <span className="mt-0.5 line-clamp-2 text-xs text-ink/60">{desc}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-forest transition-transform group-hover:rotate-45" />
                    <span className="sr-only"> — {t.lumina.actions.visit}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        {buttons.map((action) => {
          if (action.kind === "go") {
            return (
              <button
                key={`go-${action.section}`}
                type="button"
                onClick={() => goTo(action.section)}
                className={cn(pill, "self-start bg-white text-ink ring-1 ring-ink/10 hover:bg-ink hover:text-white")}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lime text-ink">
                  <ArrowDown aria-hidden className="h-4 w-4" />
                </span>
                {t.lumina.actions.go.replace("{section}", sectionLabel(action.section))}
              </button>
            );
          }
          if (action.kind === "quote") {
            return (
              <button
                key="quote"
                type="button"
                onClick={() => applyQuote(action.quote)}
                className={cn(pill, "self-start bg-ink text-white hover:bg-forest")}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lime text-ink">
                  <Calculator aria-hidden className="h-4 w-4" />
                </span>
                {t.lumina.actions.quote}
              </button>
            );
          }
          return (
            <a
              key="whatsapp"
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("lumina_action", { action: "whatsapp" })}
              className={cn(pill, "self-start bg-lime text-ink hover:bg-white hover:ring-1 hover:ring-ink/10")}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-lime">
                <FaWhatsapp aria-hidden className="h-4 w-4" />
              </span>
              {t.lumina.actions.whatsapp}
            </a>
          );
        })}
      </div>
    );
  }

  const statusText =
    mood === "Offline" ? t.lumina.offline : loading ? t.lumina.thinking : t.lumina.online;

  return (
    <>
      {/* Hoja de pantalla completa en móvil; hoja flotante redondeada desde sm. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="lumina-chat-panel"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[130] flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-ink outline-none sm:inset-auto sm:bottom-[calc(var(--fab-edge)+var(--fab-size)+var(--fab-gap))] sm:right-6 sm:h-auto sm:max-h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] sm:w-[min(92vw,24.5rem)] sm:origin-bottom-right sm:rounded-[2rem] sm:shadow-[0_40px_80px_-30px_hsl(var(--ink)/0.55)] sm:ring-1 sm:ring-ink/[0.06]"
            role="dialog"
            aria-modal={isPhone ? true : undefined}
            aria-labelledby="lumina-chat-title"
            tabIndex={-1}
          >
            {/* Cabecera: avatar redondo con el ánimo de Lumina + estado. */}
            <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-[max(0.875rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4">
              <span className="relative size-12 shrink-0">
                <span className="absolute inset-0 overflow-hidden rounded-full bg-ink ring-[3px] ring-lime">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={mood}
                      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.85 }}
                      transition={{ duration: 0.22 }}
                      className="absolute inset-0"
                    >
                      <Image src={MOOD_IMG[mood]} alt="" fill sizes="48px" className="object-cover" />
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-0 right-0 size-3.5 rounded-full border-[3px] border-white",
                    mood === "Offline" ? "bg-ink/30" : "bg-forest"
                  )}
                />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p id="lumina-chat-title" className="display-title text-xl text-ink">
                  {t.lumina.name}
                </p>
                <p className="mt-1 flex items-center gap-1.5 truncate text-[0.8125rem] font-medium text-ink/60">
                  {loading && (
                    <span aria-hidden className="size-1.5 shrink-0 animate-pulse rounded-full bg-forest motion-reduce:animate-none" />
                  )}
                  {statusText}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  restoreChatFocus();
                }}
                aria-label={t.lumina.close}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/[0.05] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversación: lienzo menta con burbujas redondeadas. */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-busy={loading}
              className="mx-2.5 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain rounded-[1.6rem] bg-mint p-3 [scrollbar-width:thin] sm:mx-3 sm:max-h-[50vh] sm:min-h-[16rem] sm:flex-none sm:p-3.5"
            >
              {messages.map((m, i) => {
                const className = cn(
                  "max-w-[86%] px-4 py-2.5 text-[0.9375rem] leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
                  m.role === "user"
                    ? "self-end rounded-[1.35rem] rounded-br-md bg-ink text-white [&_a]:text-lime"
                    : "self-start rounded-[1.35rem] rounded-bl-md bg-white text-ink shadow-[0_10px_24px_-18px_hsl(var(--ink)/0.5)] [&_a]:text-forest"
                );
                // User input is never trusted as HTML — only sanitized assistant
                // replies (see sanitizeHtml) go through dangerouslySetInnerHTML.
                if (m.role === "user") {
                  return (
                    <div key={i} className={className}>
                      {m.content}
                    </div>
                  );
                }
                return (
                  <div key={i} className="flex flex-col gap-2">
                    {m.content && (
                      <div className={className} dangerouslySetInnerHTML={{ __html: m.content }} />
                    )}
                    {m.actions?.length ? renderActions(m.actions) : null}
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-center gap-2.5 self-start rounded-[1.35rem] rounded-bl-md bg-white px-4 py-3 text-sm font-medium text-ink/60">
                  <span aria-hidden className="flex gap-1">
                    {[0, 160, 320].map((ms) => (
                      <span
                        key={ms}
                        style={{ animationDelay: `${ms}ms` }}
                        className="size-1.5 animate-bounce rounded-full bg-forest motion-reduce:animate-none"
                      />
                    ))}
                  </span>
                  {t.lumina.typing}
                </div>
              )}
              {retryText && !loading && (
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink ring-1 ring-ink/10 transition-colors hover:bg-ink hover:text-white"
                >
                  <RotateCcw aria-hidden className="h-4 w-4" />
                  {t.lumina.retry}
                </button>
              )}
              {messages.length <= 1 && (
                <div className="mt-auto flex flex-col items-end gap-2 pt-2">
                  {t.lumina.quick.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="group inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-left text-sm font-semibold text-ink ring-1 ring-ink/10 transition-colors hover:bg-ink hover:text-white"
                    >
                      {q}
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lime text-ink">
                        <ArrowUpRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Caja de texto en píldora + botón redondo lima. */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex shrink-0 items-center gap-2 px-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-3 sm:pb-3"
            >
              <label htmlFor="lumina-message" className="sr-only">
                {t.lumina.placeholder}
              </label>
              <input
                ref={inputRef}
                id="lumina-message"
                name="message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.lumina.placeholder}
                enterKeyHint="send"
                className="h-12 min-w-0 flex-1 rounded-full border border-ink/[0.12] bg-white px-5 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/60 focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)] sm:text-[0.9375rem]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t.lumina.send}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-lime text-ink shadow-[0_10px_20px_-12px_hsl(var(--ink)/0.5)] transition-[transform,opacity] duration-200 hover:-rotate-12 active:scale-95 disabled:opacity-45 disabled:hover:rotate-0"
              >
                <Send aria-hidden className="h-[1.1rem] w-[1.1rem]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burbuja proactiva: saluda una vez; tocarla abre el chat. */}
      <AnimatePresence>
        {teaser && !open && !footerInView && !configuratorInView && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "100% 100%" }}
            className="fixed bottom-[calc(var(--fab-edge)+(var(--fab-size)+var(--fab-gap))*2)] right-3 z-[120] max-w-[15rem] sm:right-6 sm:w-[min(17.5rem,calc(100vw-1.5rem))] sm:max-w-none"
          >
            {/* En teléfono es una píldora compacta de una frase; desde sm, la tarjeta completa. */}
            <div className="relative flex items-center gap-2.5 rounded-[1.4rem] rounded-br-md bg-white py-2 pl-2 pr-11 text-ink shadow-float ring-1 ring-ink/[0.06] sm:items-start sm:gap-3 sm:rounded-[1.5rem] sm:rounded-br-md sm:p-3 sm:pr-11">
              <span aria-hidden className="relative size-9 shrink-0 overflow-hidden rounded-full bg-ink ring-2 ring-lime sm:size-10">
                <Image src={MOOD_IMG.Normal} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <button
                type="button"
                onClick={openChat}
                className="min-w-0 flex-1 rounded-lg text-left text-sm font-semibold leading-snug sm:pt-0.5 sm:font-medium"
              >
                <span className="block text-xs font-bold text-ink/70 max-sm:sr-only">{t.lumina.name}</span>
                <span className="line-clamp-2 sm:hidden">{t.lumina.teaserShort}</span>
                <span className="hidden sm:inline">{t.lumina.teaser}</span>
              </button>
              <button
                type="button"
                onClick={() => setTeaser(false)}
                aria-label={t.lumina.close}
                className="absolute right-0.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-ink/60 transition-colors hover:text-ink sm:top-0.5 sm:translate-y-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB: píldora blanca con el avatar de Lumina. Se aparta con el
          footer y dentro del cotizador (ahí mandan los botones de pago), salvo
          que el chat esté abierto. La etiqueta solo aparece desde escritorio. */}
      <div
        className="fab-slot fixed bottom-[var(--fab-edge)] right-3 z-[120] sm:right-6"
        data-hidden={hideFab}
      >
        <button
          ref={fabRef}
          type="button"
          onClick={openChat}
          aria-label={open ? t.lumina.close : t.lumina.open}
          aria-controls="lumina-chat-panel"
          aria-expanded={open}
          aria-hidden={hideFab}
          tabIndex={hideFab ? -1 : 0}
          className={cn("fab justify-start px-1.5 text-left", open && "fab-ink")}
        >
          <span className="relative size-10 shrink-0 sm:size-11">
            <span className="absolute inset-0 overflow-hidden rounded-full bg-ink ring-2 ring-lime">
              <Image src={MOOD_IMG.Normal} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-[2.5px]",
                open ? "border-ink" : "border-white",
                mood === "Offline" ? "bg-ink/30" : "bg-lime"
              )}
            />
          </span>
          <span
            className={cn(
              "hidden min-w-0 pr-2.5 leading-tight lg:block",
              configuratorInView && "lg:hidden"
            )}
          >
            <span className="fab-label flex items-center gap-1.5">
              {t.lumina.name}
              {open ? (
                <X aria-hidden className="h-3.5 w-3.5" />
              ) : (
                <MessageCircle aria-hidden className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="mt-1 block whitespace-nowrap text-[11px] font-medium opacity-60">
              {statusText}
            </span>
          </span>
        </button>
      </div>
    </>
  );
}

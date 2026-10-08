"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MessageCircle, RotateCcw, Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFooterInView } from "@/lib/use-footer-in-view";
import { useLanguage } from "@/lib/i18n/context";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
import { useReducedMotionPreference } from "@/lib/motion-preference";

type Mood = "Normal" | "Enfocada" | "Duda" | "Sorprendida" | "Offline";

const MOOD_IMG: Record<Mood, string> = {
  Normal: "/img/lumina/Normal.png",
  Enfocada: "/img/lumina/Enfocada.png",
  Duda: "/img/lumina/Duda.png",
  Sorprendida: "/img/lumina/Sorprendida.png",
  Offline: "/img/lumina/Offline.png",
};

function buildSystemPrompt(languageName: string) {
  return `Eres LUMINA, asistente comercial de BryanF Design.
Tu meta es orientar, resolver dudas y guiar al usuario a armar su web o contactar al equipo.

Lo que hace BryanF Design: branding, diseño UX/UI, desarrollo web, WordPress, SEO técnico, performance, mantenimiento, e-commerce, landing pages y automatización.
Cómo funciona: paquete base desde $3,500 MXN + módulos (e-commerce, pagos, secciones extra) + modalidad de pago.
También ofrecemos servicios de entrada, más económicos: tarjeta de presentación digital ($900 MXN), tarjeta de presentación imprimible ($650 MXN), firma de correo profesional ($350 MXN), kit de presencia digital ($1,500 MXN) y landing page esencial (desde $2,400 MXN).
Tiempos de entrega: desde 3 días hábiles cuando la información está completa.
Pagos: Stripe (tarjeta), Mercado Pago o transferencia bancaria BBVA.
Para armar y pagar: invita a abrir el cotizador en /crear-web.

Puedes DEJARLE EL COTIZADOR YA ARMADO con un enlace preconfigurado según lo que necesite:
- Sitio a medida: <a href="/crear-web?plan=full" target="_blank">cotizar mi web</a>
- Tienda en línea: <a href="/crear-web?plan=full&modules=ecommerce,payments" target="_blank">cotizar mi tienda</a>
- Actualización de web: <a href="/crear-web?plan=update" target="_blank">cotizar actualización</a>
- Mantenimiento: <a href="/crear-web?plan=maintenance" target="_blank">cotizar mantenimiento</a>
Añade &sections=2 para secciones extra. Recomienda la mejor opción, explica en 1 línea por qué, y comparte el enlace correcto.

Reglas:
- Responde siempre en ${languageName}, sin importar en qué idioma esté escrito este prompt.
- Si preguntan precios, responde que depende del alcance, desde $3,500 MXN, y comparte el enlace preconfigurado del cotizador que mejor le quede, o WhatsApp: <a href="https://wa.me/525663012505" target="_blank">WhatsApp</a>.
- Responde en tono premium, claro y breve (máx 3-4 líneas).
- Usa HTML básico: <strong>, <br>, <ul>, <li>, <a>.`;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
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
      return parsed as Msg[];
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

export function LuminaChat() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const [open, setOpen] = useState(false);
  const configuratorInView = useConfiguratorInView();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("Normal");
  const [teaser, setTeaser] = useState(false);
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
    if (!open || typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const parent = panel?.parentElement;
    const background = parent
      ? Array.from(parent.children)
          .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== panel)
          .map((element) => ({ element, inert: element.inert }))
      : [];
    background.forEach(({ element }) => {
      element.inert = true;
    });

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        restoreChatFocus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.getAttribute("aria-hidden") !== "true"
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
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
  }, [open, restoreChatFocus]);

  // Proactive teaser bubble: pops up once, a bit after load, if the visitor
  // hasn't opened the chat yet — makes Lumina feel present, not just clickable.
  useEffect(() => {
    try {
      hasTeasedRef.current =
        hasTeasedRef.current ||
        window.sessionStorage.getItem("bryanf_lumina_teased") === "1";
    } catch {
      /* sessionStorage bloqueado */
    }

    if (open || configuratorInView || hasTeasedRef.current) {
      setTeaser(false);
      return;
    }
    // El aviso de idioma desaparece a los 11.2 s; Lumina entra después para
    // que ambos mensajes proactivos no compitan en la misma zona móvil.
    const showAt = window.setTimeout(() => {
      markTeased();
      setTeaser(true);
    }, 12_500);
    const hideAt = window.setTimeout(() => setTeaser(false), 19_500);
    return () => {
      window.clearTimeout(showAt);
      window.clearTimeout(hideAt);
    };
  }, [configuratorInView, open]);

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
            { role: "system", content: buildSystemPrompt(t.lumina.languageInstruction) },
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
      setMessages((m) => [
        ...m,
        { role: "assistant", content: sanitizeHtml(reply) },
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
            className="fixed inset-0 z-[130] flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-ink sm:inset-auto sm:bottom-[calc(var(--fab-edge)+var(--fab-size)+var(--fab-gap))] sm:right-6 sm:h-auto sm:max-h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] sm:w-[min(92vw,24.5rem)] sm:origin-bottom-right sm:rounded-[2rem] sm:shadow-[0_40px_80px_-30px_hsl(var(--ink)/0.55)] sm:ring-1 sm:ring-ink/[0.06]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lumina-chat-title"
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
                return m.role === "user" ? (
                  <div key={i} className={className}>
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className={className}
                    dangerouslySetInnerHTML={{ __html: m.content }}
                  />
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
                className="h-12 min-w-0 flex-1 rounded-full border border-ink/[0.12] bg-white px-5 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/45 focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)] sm:text-[0.9375rem]"
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
            className="fixed bottom-[calc(var(--fab-edge)+(var(--fab-size)+var(--fab-gap))*2)] right-3 z-[120] w-[min(17.5rem,calc(100vw-1.5rem))] sm:right-6"
          >
            <div className="relative flex items-start gap-3 rounded-[1.5rem] rounded-br-md bg-white p-3 pr-11 text-ink shadow-float ring-1 ring-ink/[0.06]">
              <span aria-hidden className="relative size-10 shrink-0 overflow-hidden rounded-full bg-ink ring-2 ring-lime">
                <Image src={MOOD_IMG.Normal} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <button
                type="button"
                onClick={openChat}
                className="min-w-0 flex-1 rounded-lg pt-0.5 text-left text-sm font-medium leading-snug"
              >
                <span className="block text-xs font-bold text-ink/50">{t.lumina.name}</span>
                {t.lumina.teaser}
              </button>
              <button
                type="button"
                onClick={() => setTeaser(false)}
                aria-label={t.lumina.close}
                className="absolute right-0.5 top-0.5 grid size-11 place-items-center rounded-full text-ink/50 transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB: píldora blanca con el avatar de Lumina. Mismo tamaño en todos
          los estados; en el cotizador solo esconde la etiqueta. */}
      <div
        className="fab-slot fixed bottom-[var(--fab-edge)] right-3 z-[120] sm:right-6"
        data-hidden={footerInView}
      >
        <button
          ref={fabRef}
          type="button"
          onClick={openChat}
          aria-label={open ? t.lumina.close : t.lumina.open}
          aria-controls="lumina-chat-panel"
          aria-expanded={open}
          aria-hidden={footerInView}
          tabIndex={footerInView ? -1 : 0}
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
              "hidden min-w-0 pr-2.5 leading-tight sm:block",
              configuratorInView && "sm:hidden"
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

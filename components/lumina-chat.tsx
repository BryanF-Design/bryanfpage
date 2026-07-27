"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFooterInView } from "@/lib/use-footer-in-view";
import { useLanguage } from "@/lib/i18n/context";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";

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
Tiempos de entrega: desde 3 días hábiles cuando la información está completa.
Pagos: Stripe (tarjeta), Mercado Pago o transferencia bancaria BBVA.
Para armar y pagar: invita a abrir el configurador en /crear-web.

Reglas:
- Responde siempre en ${languageName}, sin importar en qué idioma esté escrito este prompt.
- Si preguntan precios, responde que depende del alcance, desde $3,500 MXN, e invita a /crear-web o a WhatsApp: <a href="https://wa.me/525663012505" target="_blank">WhatsApp</a>.
- Responde en tono premium, claro y breve (máx 3-4 líneas).
- Usa HTML básico: <strong>, <br>, <ul>, <li>, <a>.`;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
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
  const [open, setOpen] = useState(false);
  const configuratorInView = useConfiguratorInView();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("Normal");
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: t.lumina.greeting },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const hasTeasedRef = useRef(false);
  const footerInView = useFooterInView();

  function markTeased() {
    hasTeasedRef.current = true;
    try {
      window.sessionStorage.setItem("bryanf_lumina_teased", "1");
    } catch {
      /* sessionStorage bloqueado */
    }
  }

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
      setOpen(false);
      setTeaser(false);
    }
  }, [footerInView]);

  // El configurador concentra las acciones de compra. Si ocupa el viewport,
  // cierra el panel grande, descarta el teaser y deja solo el acceso compacto.
  useEffect(() => {
    if (configuratorInView) {
      setOpen(false);
      setTeaser(false);
    }
  }, [configuratorInView]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => fabRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
    const hideAt = window.setTimeout(() => setTeaser(false), 21_500);
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
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: t.lumina.connectionError,
        },
      ]);
      setMood("Offline");
    } finally {
      setLoading(false);
    }
  }
  sendRef.current = send;

  return (
    <>
      {/* Panel */}
      <AnimatePresence>
        {open && !footerInView && (
          <motion.div
            id="lumina-chat-panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="glass fixed bottom-[calc(5.5rem_+_env(safe-area-inset-bottom))] right-3 z-[120] flex max-h-[calc(100dvh_-_7rem_-_env(safe-area-inset-bottom))] w-[min(calc(100vw_-_1.5rem),22rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl shadow-2xl sm:right-6"
            role="dialog"
            aria-labelledby="lumina-chat-title"
          >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-primary/40">
              <AnimatePresence mode="wait">
                <motion.span
                  key={mood}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={MOOD_IMG[mood]}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </motion.span>
              </AnimatePresence>
              {mood !== "Offline" && (
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-card bg-primary" />
              )}
            </span>
            <div className="leading-tight">
              <p id="lumina-chat-title" className="text-sm font-semibold text-foreground">
                {t.lumina.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {mood === "Offline"
                  ? t.lumina.offline
                  : loading
                    ? t.lumina.thinking
                    : t.lumina.online}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              window.setTimeout(() => fabRef.current?.focus());
            }}
            aria-label={t.lumina.close}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-busy={loading}
          className="flex min-h-[12rem] flex-1 flex-col gap-3 overflow-y-auto p-4 sm:min-h-[16rem]"
        >
          {messages.map((m, i) => {
            const className = cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline",
              m.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-secondary text-foreground"
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
            <div className="self-start rounded-2xl bg-secondary px-3.5 py-2 text-sm text-muted-foreground">
              {t.lumina.typing}
            </div>
          )}
          {messages.length <= 1 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {t.lumina.quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="min-h-11 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
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
            className="min-h-11 min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label={t.lumina.send}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proactive teaser bubble */}
      <AnimatePresence>
        {teaser && !open && !footerInView && !configuratorInView && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass fixed bottom-[calc(5.5rem_+_env(safe-area-inset-bottom))] right-3 z-[120] max-w-[min(16rem,calc(100vw_-_1.5rem))] rounded-2xl rounded-br-sm px-4 py-3 pr-9 text-sm text-foreground shadow-xl sm:right-6"
          >
            <button
              type="button"
              onClick={() => setTeaser(false)}
              aria-label={t.lumina.close}
              className="absolute -right-2 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X className="h-4 w-4" />
            </button>
            {t.lumina.teaser}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        ref={fabRef}
        type="button"
        onClick={openChat}
        aria-label={open ? t.lumina.close : t.lumina.open}
        aria-controls="lumina-chat-panel"
        aria-expanded={open}
        aria-hidden={footerInView}
        tabIndex={footerInView ? -1 : 0}
        animate={{
          opacity: footerInView ? 0 : 1,
          scale: footerInView ? 0.85 : 1,
        }}
        transition={{
          opacity: { duration: 0.3, ease: "easeInOut" },
          scale: { duration: 0.3, ease: "easeInOut" },
        }}
        className={cn(
          "glass-nav fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-3 z-[120] flex min-h-11 min-w-11 items-center rounded-xl border border-primary/35 p-1 text-left text-foreground shadow-[0_12px_40px_-14px_hsl(var(--primary)/0.45)] transition-[border-color,background-color,color] hover:border-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] sm:right-6 sm:gap-3 sm:rounded-2xl sm:p-2 sm:pr-4",
          configuratorInView && "rounded-full p-1 pr-1 sm:p-1 sm:pr-1",
          footerInView && "pointer-events-none"
        )}
      >
        <span
          className={cn(
            "relative flex h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-primary/10 ring-1 ring-primary/45 sm:h-12 sm:w-12",
            configuratorInView && "rounded-full sm:h-11 sm:w-11"
          )}
        >
          <Image src={MOOD_IMG.Normal} alt="" fill sizes="48px" className="object-cover" />
          <span
            className={cn(
              "absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-background",
              mood === "Offline" ? "bg-muted-foreground" : "bg-primary"
            )}
          />
        </span>
        <span
          className={cn(
            "hidden min-w-0 leading-tight sm:block",
            configuratorInView && "sm:hidden"
          )}
        >
          <span className="flex items-center gap-1.5 font-semibold">
            {t.lumina.name}
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
          </span>
          <span className="mt-0.5 hidden whitespace-nowrap text-[11px] font-medium text-muted-foreground sm:block">
            {mood === "Offline"
              ? t.lumina.offline
              : loading
                ? t.lumina.thinking
                : t.lumina.online}
          </span>
        </span>
      </motion.button>
    </>
  );
}

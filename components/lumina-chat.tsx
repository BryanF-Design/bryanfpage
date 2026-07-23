"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, RotateCcw, Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFooterInView } from "@/lib/use-footer-in-view";
import { useLanguage } from "@/lib/i18n/context";

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

// sessionStorage, not localStorage: the conversation should survive a reload
// or a navigation within the site (tab close = fresh start), no backend involved.
const SESSION_KEY = "bryanf_lumina_chat_v1";

function readStoredMessages(): Msg[] | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((m) => m && typeof m.content === "string")) {
      return parsed;
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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("Normal");
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(
    () => readStoredMessages() ?? [{ role: "assistant", content: t.lumina.greeting }]
  );
  const [retryText, setRetryText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const footerInView = useFooterInView();

  // Broadcast open/closed so other fixed UI (the language notice banner) can
  // get out of the way instead of covering the full-screen mobile chat.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lumina:visibility", { detail: { open } }));
  }, [open]);

  // Persist so a reload or in-site navigation doesn't drop the conversation.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {
      /* storage bloqueado */
    }
  }, [messages]);

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
      setOpen(false);
      setTeaser(false);
    }
  }, [footerInView]);

  // Proactive teaser bubble: pops up once, a bit after load, if the visitor
  // hasn't opened the chat yet — makes Lumina feel present, not just clickable.
  useEffect(() => {
    if (open) {
      setTeaser(false);
      return;
    }
    const showAt = window.setTimeout(() => setTeaser(true), 9000);
    const hideAt = window.setTimeout(() => setTeaser(false), 18000);
    return () => {
      window.clearTimeout(showAt);
      window.clearTimeout(hideAt);
    };
  }, [open]);

  function openChat() {
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

  return (
    <>
      {/* Panel — hoja de pantalla completa en móvil (interfaz dedicada, no el
          panel de escritorio encogido); en sm+ vuelve a ser el panel flotante
          de esquina. h-[100dvh] sigue el viewport dinámico del navegador, así
          que cuando el teclado virtual abre, el panel se encoge con él en vez
          de quedar tapado. */}
      <div
        className={cn(
          "glass fixed inset-0 z-[130] flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-[hsl(var(--card))] transition-all duration-300",
          "sm:inset-auto sm:bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:right-4 sm:h-auto sm:w-[min(92vw,22rem)] sm:origin-bottom-right sm:rounded-2xl sm:bg-[hsl(var(--card)/0.82)] sm:shadow-2xl md:right-6",
          open
            ? "pointer-events-auto translate-y-0 opacity-100 sm:scale-100"
            : "pointer-events-none translate-y-full opacity-0 sm:translate-y-3 sm:scale-95 sm:opacity-0"
        )}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label={t.lumina.open}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
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
              <p className="text-sm font-semibold text-foreground">{t.lumina.name}</p>
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
            onClick={() => setOpen(false)}
            aria-label={t.lumina.close}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:max-h-[50vh] sm:min-h-[16rem] sm:flex-none"
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
          {retryText && !loading && (
            <button
              onClick={retry}
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" />
              {t.lumina.retry}
            </button>
          )}
          {messages.length <= 1 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {t.lumina.quick.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
          className="flex shrink-0 items-center gap-2 border-t border-border px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.lumina.placeholder}
            enterKeyHint="send"
            className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label={t.lumina.send}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50 sm:h-9 sm:w-9"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Proactive teaser bubble */}
      <AnimatePresence>
        {teaser && !open && !footerInView && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-[120] max-w-[16rem] rounded-2xl rounded-br-sm px-4 py-3 text-sm text-foreground shadow-xl sm:right-6"
          >
            <button
              onClick={() => setTeaser(false)}
              aria-label={t.lumina.close}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
            {t.lumina.teaser}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={openChat}
        aria-label={t.lumina.open}
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
          "glass-nav fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-[120] flex items-center gap-2.5 rounded-2xl border border-primary/35 p-2 pr-3 text-left text-foreground shadow-[0_12px_40px_-14px_hsl(var(--primary)/0.45)] transition-colors hover:border-primary/70 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:right-6 sm:gap-3 sm:pr-4",
          footerInView && "pointer-events-none"
        )}
      >
        <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-primary/10 ring-1 ring-primary/45 sm:h-12 sm:w-12">
          <Image src={MOOD_IMG.Normal} alt="" fill sizes="48px" className="object-cover" />
          <span
            className={cn(
              "absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-background",
              mood === "Offline" ? "bg-muted-foreground" : "bg-primary"
            )}
          />
        </span>
        <span className="min-w-0 leading-tight">
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

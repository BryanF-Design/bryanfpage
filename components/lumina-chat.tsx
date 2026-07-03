"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFooterInView } from "@/lib/use-footer-in-view";

type Mood = "Normal" | "Enfocada" | "Duda" | "Sorprendida" | "Offline";

const MOOD_IMG: Record<Mood, string> = {
  Normal: "/img/lumina/Normal.png",
  Enfocada: "/img/lumina/Enfocada.png",
  Duda: "/img/lumina/Duda.png",
  Sorprendida: "/img/lumina/Sorprendida.png",
  Offline: "/img/lumina/Offline.png",
};

const SYSTEM_PROMPT = `Eres LUMINA, asistente comercial de BryanF Design.
Tu meta es orientar, resolver dudas y guiar al usuario a armar su web o contactar al equipo.

Lo que hace BryanF Design: branding, diseño UX/UI, desarrollo web, WordPress, SEO técnico, performance, mantenimiento, e-commerce, landing pages y automatización.
Cómo funciona: paquete base desde $3,500 MXN + módulos (e-commerce, pagos, secciones extra) + modalidad de pago.
Tiempos de entrega: desde 3 días hábiles cuando la información está completa.
Pagos: Stripe (tarjeta), Mercado Pago o transferencia bancaria BBVA.
Para armar y pagar: invita a abrir el configurador en /crear-web.

Reglas:
- Si preguntan precios, responde que depende del alcance, desde $3,500 MXN, e invita a /crear-web o a WhatsApp: <a href="https://wa.me/525663012505" target="_blank">WhatsApp</a>.
- Responde en tono premium, claro y breve (máx 3-4 líneas). Buena ortografía, acentos y ñ.
- Usa HTML básico: <strong>, <br>, <ul>, <li>, <a>.`;

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

const QUICK = [
  "¿Cuánto cuesta una web?",
  "¿En cuánto tiempo la entregan?",
  "Quiero armar mi web",
];

const GREETING =
  "¡Hola! Soy <strong>Lumina</strong>, tu asesora en BryanF Design.<br>¿Te ayudo con precios, tiempos o a armar tu web?";

export function LuminaChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("Normal");
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const footerInView = useFooterInView();

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
            { role: "system", content: SYSTEM_PROMPT },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.4,
        }),
      });
      const data = await res.json();
      const uncertain = !data?.choices?.[0]?.message?.content && !data?.error;
      const reply =
        data?.choices?.[0]?.message?.content ||
        (data?.error
          ? "Ahorita no puedo responder, pero escríbenos por <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a> y te atendemos al instante."
          : "Perdona, no te entendí. ¿Lo intentamos de nuevo?");
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
          content:
            "Tuvimos un problema de conexión. Escríbenos por <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
        },
      ]);
      setMood("Offline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-[120] flex w-[min(92vw,22rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:right-6",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        )}
        role="dialog"
        aria-label="Chat con Lumina"
      >
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
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
              <p className="text-sm font-semibold text-foreground">Lumina</p>
              <p className="text-[11px] text-muted-foreground">
                {mood === "Offline"
                  ? "Sin conexión"
                  : loading
                    ? "Pensando…"
                    : "Asesora IA · en línea"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex max-h-[50vh] min-h-[16rem] flex-col gap-3 overflow-y-auto p-4">
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
              Escribiendo…
            </div>
          )}
          {messages.length <= 1 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {QUICK.map((q) => (
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
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje…"
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Enviar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
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
            className="fixed bottom-24 right-4 z-[120] max-w-[16rem] rounded-2xl rounded-br-sm border border-border bg-card px-4 py-3 text-sm text-foreground shadow-xl sm:right-6"
          >
            <button
              onClick={() => setTeaser(false)}
              aria-label="Cerrar mensaje"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
            ¿Buscas crear tu web? Pregúntame precios, tiempos o cómo empezamos ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={openChat}
        aria-label="Abrir chat con Lumina"
        aria-hidden={footerInView}
        tabIndex={footerInView ? -1 : 0}
        animate={{
          y: open || footerInView ? 0 : [0, -6, 0],
          opacity: footerInView ? 0 : 1,
          scale: footerInView ? 0.85 : 1,
        }}
        transition={{ duration: 3.5, repeat: open || footerInView ? 0 : Infinity, ease: "easeInOut" }}
        className={cn(
          "fixed bottom-5 right-4 z-[120] flex items-center gap-2 rounded-full bg-primary py-2 pl-2 pr-4 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 sm:right-6",
          footerInView && "pointer-events-none"
        )}
      >
        <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-foreground/30">
          <Image src={MOOD_IMG.Normal} alt="" fill sizes="36px" className="object-cover" />
        </span>
        <span className="hidden sm:inline">Lumina</span>
      </motion.button>
    </>
  );
}

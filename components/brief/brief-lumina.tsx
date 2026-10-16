"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Check, Loader2, SendHorizontal, Sparkle } from "lucide-react";

import {
  BRIEF_FIELD_BY_KEY,
  briefLuminaPrompt,
  parseBriefLuminaReply,
  type BriefLuminaReply,
  type BriefState,
} from "@/lib/brief";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Mood = "normal" | "enfocada" | "duda" | "sorprendida";

interface Msg {
  role: "user" | "assistant";
  text: string;
  ask?: string;
  /** Etiquetas de los campos que Lumina llenó con esta respuesta. */
  filled?: string[];
}

const STARTERS = [
  "Ayúdame a llenar mi briefing",
  "¿Qué sigue después de mandarlo?",
  "¿Cómo los contacto?",
  "¿Qué links les mando?",
];

/** Etiqueta corta de cada campo para el aviso "Llené: …". */
function fieldLabel(key: string) {
  return (BRIEF_FIELD_BY_KEY.get(key)?.label ?? key).replace(/\s*\(.*\)$/, "").replace(/^¿|\?$/g, "");
}

/** Escapa todo y solo devuelve <strong>: lo único que se pinta como HTML. */
function safeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&lt;(\/?)strong&gt;/g, "<$1strong>");
}

/**
 * Lumina dentro del briefing: platica con el cliente, resuelve dudas del
 * negocio (qué sigue, contacto, pagos) y LLENA el formulario con lo que le
 * cuentan. Todo lo que propone se valida contra los campos de lib/brief.ts
 * antes de tocar el formulario.
 */
export function BriefLumina({
  state,
  subscription,
  view,
  onApply,
}: {
  state: BriefState;
  subscription: boolean;
  view: string;
  /** Aplica lo que Lumina llenó y devuelve qué campos cambiaron. */
  onApply: (reply: BriefLuminaReply) => string[];
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<string[]>(STARTERS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("normal");
  const listRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", text: content }];
    setMessages(next);
    setInput("");
    setChips([]);
    setLoading(true);
    setMood("enfocada");
    if (messages.length === 0) trackEvent("brief_lumina_start", { starter: content.slice(0, 40) });

    try {
      const res = await fetch("/api/openai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: briefLuminaPrompt(stateRef.current, { subscription, view }) },
            ...next.slice(-10).map((m) => ({
              role: m.role,
              content: m.role === "assistant" ? [m.text, m.ask].filter(Boolean).join(" ") : m.text,
            })),
          ],
          temperature: 0.3,
          max_tokens: 700,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json().catch(() => ({}));
      const raw: string = data?.choices?.[0]?.message?.content || "";
      const reply = raw ? parseBriefLuminaReply(raw) : null;
      if (!reply) throw new Error(data?.error || "sin respuesta");

      const changed = onApply(reply);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: safeHtml(reply.say),
          ask: reply.ask || undefined,
          filled: changed.length ? changed.map(fieldLabel) : undefined,
        },
      ]);
      setChips(reply.chips);
      setMood(changed.length ? "sorprendida" : "normal");
      window.setTimeout(() => setMood("normal"), 2500);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "No pude conectarme en este momento. Puedes llenar el briefing a mano o escribirnos por WhatsApp al +52 56 6301 2505 y te ayudamos.",
        },
      ]);
      setMood("duda");
      setChips([content]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className="panel panel-ink relative flex flex-col gap-4 overflow-hidden p-4 sm:p-6">
      <div aria-hidden className="mesh-glow-a opacity-50" />
      <div className="relative flex items-start gap-3">
        <span className="relative h-20 w-16 shrink-0">
          <Image
            src={`/img/brand/lumina-${mood}.webp`}
            alt=""
            fill
            sizes="64px"
            className="object-contain object-bottom"
          />
        </span>
        <span className="min-w-0">
          <span className="eyebrow w-fit bg-white/10 pl-3 text-white">
            <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime" />
            Lumina te ayuda
          </span>
          <span className="mt-2 block text-pretty text-[0.9375rem] font-semibold leading-snug text-white">
            ¿Lo llenamos juntos? Platícame de tu negocio y yo lleno el briefing por ti.
          </span>
        </span>
      </div>

      {messages.length > 0 && (
        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-label="Conversación con Lumina"
          className="relative flex max-h-[22rem] flex-col gap-2.5 overflow-y-auto pr-1 [scrollbar-width:thin]"
        >
          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="ml-8 self-end rounded-2xl rounded-br-md bg-lime px-3.5 py-2 text-sm font-medium text-ink">
                {m.text}
              </p>
            ) : (
              <div key={i} className="mr-6 flex flex-col gap-2 rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2.5 text-sm leading-relaxed text-white/90">
                {/* Texto escapado: solo <strong> se pinta como HTML (safeHtml). */}
                {m.text && <p dangerouslySetInnerHTML={{ __html: m.text }} />}
                {m.filled && (
                  <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-lime">
                    <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                    Llené: {m.filled.join(", ")}
                  </p>
                )}
                {m.ask && <p className="font-semibold text-white">{m.ask}</p>}
              </div>
            )
          )}
          {loading && (
            <p className="flex items-center gap-2 text-sm text-white/70">
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
              Lumina está escribiendo…
            </p>
          )}
        </div>
      )}

      {chips.length > 0 && !loading && (
        <div className="relative flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => send(chip)}
              className="min-h-10 rounded-full bg-white/10 px-3.5 py-2 text-left text-xs font-semibold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-lime hover:text-ink"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="relative flex items-center gap-2">
        <label htmlFor="brief-lumina-input" className="sr-only">
          Escríbele a Lumina
        </label>
        <input
          id="brief-lumina-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1200}
          placeholder="Ej. Tengo una pastelería en Puebla…"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-full bg-white/10 px-4 text-[0.9375rem] text-white outline-none ring-1 ring-inset ring-white/15 placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-lime"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar a Lumina"
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-full bg-lime text-ink transition-opacity",
            (loading || !input.trim()) && "opacity-50"
          )}
        >
          <SendHorizontal aria-hidden className="h-5 w-5" />
        </button>
      </form>
      <p className="relative text-[0.7rem] leading-snug text-white/50">
        Revisa lo que Lumina llena antes de enviar. Nunca te pediremos contraseñas ni datos de tarjeta por aquí.
      </p>
    </div>
  );
}

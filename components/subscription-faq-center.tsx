"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Plus, Search, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { SUBSCRIPTION_FAQ_CATEGORIES } from "@/lib/subscription";
import { cn } from "@/lib/utils";

/** Minúsculas y sin acentos: "suscripción" encuentra "suscripcion". */
function fold(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const TOTAL = SUBSCRIPTION_FAQ_CATEGORIES.reduce((n, c) => n + c.items.length, 0);

/**
 * Centro de preguntas de la suscripción: buscador, filtro por categoría y
 * preguntas desplegables. Todo el texto viene de lib/subscription.ts.
 */
export function SubscriptionFaqCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");

  const groups = useMemo(() => {
    const words = fold(query).split(/\s+/).filter(Boolean);
    return SUBSCRIPTION_FAQ_CATEGORIES.filter((c) => category === "todas" || c.id === category)
      .map((c) => ({
        ...c,
        items: c.items.filter((item) => {
          if (!words.length) return true;
          const haystack = fold(`${item.question} ${item.answer}`);
          return words.every((w) => haystack.includes(w));
        }),
      }))
      .filter((c) => c.items.length);
  }, [query, category]);

  const shown = groups.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label htmlFor="faq-search" className="sr-only">
          Buscar una pregunta
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/50" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca: factura, cancelar, dominio, tienda, tiempos…"
            autoComplete="off"
            className="h-14 w-full rounded-full bg-white pl-12 pr-12 text-base font-medium text-ink outline-none ring-1 ring-inset ring-ink/10 placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Borrar búsqueda"
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink/60 hover:bg-ink/5"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          )}
        </div>
        <div
          role="group"
          aria-label="Filtrar por tema"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {[{ id: "todas", title: "Todas", count: TOTAL }, ...SUBSCRIPTION_FAQ_CATEGORIES.map((c) => ({ id: c.id, title: c.title, count: c.items.length }))].map(
            (c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 rounded-full pl-4 pr-1.5 text-sm font-semibold transition-colors",
                    active ? "bg-ink text-white" : "border border-ink/15 text-ink hover:border-ink/40"
                  )}
                >
                  {c.title}
                  <span
                    className={cn(
                      "grid h-8 min-w-8 place-items-center rounded-full px-2 text-xs font-bold",
                      active ? "bg-lime text-ink" : "bg-ink/[0.06] text-ink/70"
                    )}
                  >
                    {c.count}
                  </span>
                </button>
              );
            }
          )}
        </div>
        <p aria-live="polite" className="px-1 text-sm text-muted-foreground">
          {query || category !== "todas" ? `${shown} de ${TOTAL} preguntas` : `${TOTAL} preguntas en ${SUBSCRIPTION_FAQ_CATEGORIES.length} temas`}
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.id} id={`tema-${group.id}`} aria-labelledby={`tema-${group.id}-title`} className="scroll-mt-[calc(var(--header-h)+var(--gutter))]">
          <h2 id={`tema-${group.id}-title`} className="display-title mb-3 px-1 text-[1.5rem] leading-tight text-ink">
            {group.title}
          </h2>
          {/* <details> nativo: las respuestas viven en el HTML del servidor
              (buscadores) y abren sin JavaScript. */}
          <div className="flex w-full flex-col gap-2">
            {group.items.map((item) => (
              <details
                key={item.question}
                className="group/faq rounded-card bg-mint px-4 ring-1 ring-ink/[0.05] transition-colors open:bg-lime open:ring-0 sm:px-5"
              >
                <summary className="flex min-h-[3.75rem] cursor-pointer list-none items-center justify-between gap-3 py-3 text-left text-[1.0625rem] font-bold leading-snug text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink ring-1 ring-ink/[0.07] transition-colors group-open/faq:bg-ink group-open/faq:text-lime"
                  >
                    <Plus className="h-[1.15rem] w-[1.15rem] transition-transform duration-300 group-open/faq:rotate-[135deg]" />
                  </span>
                </summary>
                <p className="pb-5 pr-2 text-[0.9375rem] leading-relaxed text-ink/80">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      {!shown && (
        <p className="rounded-card bg-mint p-5 text-[0.9375rem] text-ink/80 ring-1 ring-inset ring-ink/[0.06]">
          No encontramos esa pregunta. Pregúntale a Lumina o escríbenos: te contestamos directo.
        </p>
      )}

      <div className="flex flex-col gap-4 rounded-card bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-pretty text-[1.0625rem] font-semibold leading-snug">¿No está tu pregunta? Te respondemos en minutos.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={() => openLuminaChat(query ? `Sobre la suscripción: ${query}` : undefined)} className="bg-lime text-ink">
            <MessageCircle aria-hidden className="h-4 w-4" />
            Preguntarle a Lumina
          </Button>
          <Button asChild variant="outline" className="border-white/25 text-white">
            <a
              href={`https://wa.me/525663012505?text=${encodeURIComponent("Hola Bryan, tengo una pregunta sobre la suscripción Todo Digital: ")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden className="h-4 w-4 text-lime" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma propio (la lista nativa salía blanca sobre blanco en
 * Windows y sin banderas: Windows no dibuja emojis de bandera). Usa códigos
 * de idioma en vez de banderas. Patrón de listbox: flechas, Inicio/Fin,
 * Enter para elegir y Escape para cerrar.
 */
export function CvLanguageSelect({
  lang,
  onChange,
  label,
  tone = "dark",
}: {
  lang: Locale;
  onChange: (l: Locale) => void;
  label: string;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(LOCALES.indexOf(lang));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    setActive(LOCALES.indexOf(lang));
    listRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, lang]);

  function choose(l: Locale) {
    onChange(l);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onListKey(e: KeyboardEvent<HTMLUListElement>) {
    if (e.key === "ArrowDown") setActive((i) => (i + 1) % LOCALES.length);
    else if (e.key === "ArrowUp") setActive((i) => (i - 1 + LOCALES.length) % LOCALES.length);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(LOCALES.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(LOCALES[active]);
    else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") buttonRef.current?.focus();
      return;
    } else return;
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${LOCALE_META[lang].name}`}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-full pl-3 pr-2.5 text-sm font-semibold transition-colors",
          tone === "dark"
            ? "bg-white/[0.07] text-white ring-1 ring-inset ring-white/10 hover:bg-white/[0.12]"
            : "bg-[#0c1512] text-white hover:bg-[#15241f]"
        )}
      >
        <Globe aria-hidden className="h-4 w-4 text-[var(--cv-lime)]" />
        <span aria-hidden className="rounded bg-[var(--cv-lime)] px-1 text-[0.62rem] font-extrabold uppercase leading-[1.35] text-[#0c1512]">
          {lang}
        </span>
        <span aria-hidden className="hidden sm:inline">{LOCALE_META[lang].name}</span>
        <ChevronDown aria-hidden className={cn("h-4 w-4 opacity-60 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${LOCALES[active]}`}
          onKeyDown={onListKey}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[200] w-52 overflow-hidden rounded-2xl bg-[#0c1512] p-1.5 text-white shadow-[0_24px_50px_-16px_rgb(0_0_0/0.8)] outline-none ring-1 ring-[#b4e332]/40"
        >
          {LOCALES.map((l, i) => {
            const selected = l === lang;
            return (
              <li
                key={l}
                id={`${listId}-${l}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(l)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors",
                  i === active && "bg-white/[0.08]",
                  selected && "text-[var(--cv-lime)]"
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-8 place-items-center rounded-md text-[0.62rem] font-extrabold uppercase",
                    selected ? "bg-[var(--cv-lime)] text-[#0c1512]" : "bg-white/10 text-white/80"
                  )}
                >
                  {l}
                </span>
                <span className="flex-1">{LOCALE_META[l].name}</span>
                {selected ? <Check aria-hidden className="h-4 w-4" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

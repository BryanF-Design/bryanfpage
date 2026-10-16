"use client";

import { useRef, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Check, FileUp, Loader2, Paperclip, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { BriefLinks } from "@/components/brief/brief-links";
import {
  BRIEF_FEATURES,
  BRIEF_SECTIONS,
  briefProgress,
  type BriefField,
  type BriefState,
} from "@/lib/brief";
import { cn } from "@/lib/utils";

/** Adjuntos: lo que cabe en un envío (el resto, mejor por link de Drive o WeTransfer). */
export const MAX_FILES = 5;
export const MAX_FILES_BYTES = 3 * 1024 * 1024;

const fieldClass =
  "h-12 w-full rounded-inner bg-white px-4 text-[0.9375rem] font-medium text-ink outline-none ring-1 ring-inset ring-ink/10 transition-shadow placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink";
const labelClass = "mb-1.5 block px-1 text-xs font-semibold text-ink/70";

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function Fieldset({ index, title, intro, children }: { index: number; title: string; intro: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-card bg-mint p-3.5 ring-1 ring-inset ring-ink/[0.06] sm:p-5">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden className="flex items-start gap-3 px-1">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold tabular-nums text-lime">
          {String(index).padStart(2, "0")}
        </span>
        <span>
          <span className="block text-[1.0625rem] font-bold leading-snug text-ink">{title}</span>
          <span className="block text-sm leading-snug text-ink/65">{intro}</span>
        </span>
      </div>
      {children}
    </fieldset>
  );
}

export function BriefForm({
  state,
  onChange,
  flash,
  files,
  onFiles,
  sendState,
  error,
  whatsappHref,
  onSubmit,
}: {
  state: BriefState;
  onChange: (updater: (prev: BriefState) => BriefState) => void;
  /** Campos que Lumina acaba de llenar (destellan). */
  flash: Set<string>;
  files: File[];
  onFiles: (files: File[]) => void;
  sendState: "idle" | "sending" | "sent" | "error";
  error: string;
  whatsappHref: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const progress = briefProgress(state);

  const setValue = (key: string, value: string) =>
    onChange((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }));

  const toggleFeature = (feature: string) =>
    onChange((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));

  function onPickFiles(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    const next = [...files];
    for (const file of picked) {
      if (next.length >= MAX_FILES) break;
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }
    onFiles(next);
  }

  const totalBytes = files.reduce((n, f) => n + f.size, 0);
  const tooHeavy = totalBytes > MAX_FILES_BYTES;

  function renderField(field: BriefField) {
    const id = `gb-${field.key}`;
    const value = state.values[field.key] ?? "";
    const common = {
      id,
      name: field.key,
      value,
      required: field.required,
      "aria-required": field.required || undefined,
      "aria-describedby": field.hint ? `${id}-hint` : undefined,
    };
    let control: ReactNode;
    if (field.kind === "select") {
      control = (
        <select {...common} onChange={(e) => setValue(field.key, e.target.value)} className={cn(fieldClass, "cursor-pointer")}>
          <option value="">Selecciona…</option>
          {field.options!.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    } else if (field.kind === "textarea") {
      control = (
        <textarea
          {...common}
          rows={3}
          maxLength={4000}
          placeholder={field.placeholder}
          onChange={(e) => setValue(field.key, e.target.value)}
          className={cn(fieldClass, "h-auto min-h-[6rem] resize-y py-3")}
        />
      );
    } else {
      control = (
        <input
          {...common}
          type={field.kind}
          inputMode={field.kind === "tel" ? "tel" : field.kind === "email" ? "email" : undefined}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          maxLength={500}
          onChange={(e) => setValue(field.key, e.target.value)}
          className={fieldClass}
        />
      );
    }
    return (
      <div key={field.key} className={cn(field.full && "sm:col-span-2")}>
        <label htmlFor={id} className={labelClass}>
          {field.label}
          {field.required && " *"}
        </label>
        <div className={cn("rounded-inner", flash.has(field.key) && "brief-flash")}>{control}</div>
        {field.hint && (
          <p id={`${id}-hint`} className="mt-1.5 px-1 text-xs leading-snug text-ink/55">
            {field.hint}
          </p>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
      {/* Avance: lo que más pesa para arrancar. */}
      <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 ring-1 ring-inset ring-ink/[0.08]">
        <span className="text-xs font-bold text-ink/70">Tu briefing</span>
        <span
          role="progressbar"
          aria-label="Avance del briefing"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10"
        >
          <span className="block h-full rounded-full bg-lime-deep transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </span>
        <span className="w-10 text-right text-xs font-bold tabular-nums text-ink">{progress}%</span>
      </div>

      {BRIEF_SECTIONS.map((section, i) => (
        <Fieldset key={section.id} index={i + 1} title={section.title} intro={section.intro}>
          <div className="grid gap-4 sm:grid-cols-2">{section.fields.map(renderField)}</div>
          {section.id === "proyecto" && (
            <div className={cn("flex flex-col gap-2 rounded-inner", flash.has("features") && "brief-flash")}>
              <p id="gb-features-label" className={labelClass}>
                Funciones que necesitas (toca las que apliquen)
              </p>
              <div role="group" aria-labelledby="gb-features-label" className="flex flex-wrap gap-2">
                {BRIEF_FEATURES.map((feature) => {
                  const on = state.features.includes(feature);
                  return (
                    <button
                      key={feature}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold ring-1 ring-inset transition-colors",
                        on ? "bg-ink text-lime ring-ink" : "bg-white text-ink ring-ink/10 hover:ring-ink/30"
                      )}
                    >
                      {on && <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />}
                      {feature}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Fieldset>
      ))}

      <Fieldset
        index={BRIEF_SECTIONS.length + 1}
        title="Enlaces y archivos"
        intro="Tu sitio, tus redes, carpetas con fotos o logo y sitios que te gusten. Reconocemos cada link solo."
      >
        <BriefLinks
          links={state.links}
          highlight={flash.has("links")}
          onChange={(links) => onChange((prev) => ({ ...prev, links }))}
        />
        <div className="flex flex-col gap-2">
          <p className={labelClass}>Archivos (opcional): logo, fotos, textos</p>
          <input
            ref={fileInput}
            id="gb-files"
            type="file"
            multiple
            accept="image/*,application/pdf,.svg,.ai,.eps,.psd,.zip,.doc,.docx"
            onChange={onPickFiles}
            className="sr-only"
          />
          <label
            htmlFor="gb-files"
            className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-inner border-2 border-dashed border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
          >
            <FileUp aria-hidden className="h-4 w-4" />
            Subir archivos ({files.length}/{MAX_FILES})
          </label>
          <p className="px-1 text-xs text-ink/55">
            Hasta {MAX_FILES} archivos y 3 MB en total. ¿Pesan más? Súbelos a Drive o WeTransfer y pega el link arriba.
          </p>
          {files.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded-inner bg-white px-3 py-2 text-sm ring-1 ring-inset ring-ink/[0.08]">
                  <Paperclip aria-hidden className="h-4 w-4 shrink-0 text-ink/60" />
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">{file.name}</span>
                  <span className="text-xs tabular-nums text-ink/55">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => onFiles(files.filter((f) => f !== file))}
                    aria-label={`Quitar ${file.name}`}
                    className="grid size-9 place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink"
                  >
                    <X aria-hidden className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {tooHeavy && (
            <p role="alert" className="px-1 text-xs font-semibold text-ink">
              ⚠ Tus archivos suman {formatBytes(totalBytes)}: quita alguno o compártelos por link.
            </p>
          )}
        </div>
      </Fieldset>

      <Fieldset index={BRIEF_SECTIONS.length + 2} title="Algo más" intro="Dudas, ideas sueltas o cualquier cosa que debamos saber.">
        <div className={cn("rounded-inner", flash.has("notes") && "brief-flash")}>
          <label htmlFor="gb-notes" className="sr-only">
            Notas adicionales
          </label>
          <textarea
            id="gb-notes"
            name="notes"
            rows={3}
            maxLength={4000}
            value={state.values.notes ?? ""}
            onChange={(e) => setValue("notes", e.target.value)}
            placeholder="Opcional"
            className={cn(fieldClass, "h-auto min-h-[5rem] resize-y py-3")}
          />
        </div>
      </Fieldset>

      {sendState === "error" && error && (
        <div role="alert" className="flex flex-col gap-2 rounded-inner bg-white px-4 py-3 text-sm text-ink ring-1 ring-inset ring-signal/40 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-forest underline-offset-4 hover:underline">
            <FaWhatsapp aria-hidden className="h-4 w-4" />
            Enviar por WhatsApp
          </a>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="ink"
        disabled={sendState === "sending" || tooHeavy}
        className="w-full justify-between pl-6 pr-2.5"
      >
        {sendState === "sending" ? "Enviando…" : "Enviar briefing y arrancar"}
        {sendState === "sending" ? (
          <Loader2 aria-hidden className="mr-2.5 h-5 w-5 animate-spin" />
        ) : (
          <ButtonArrow tone="lime" className="-mr-0.5" />
        )}
      </Button>
      <p className="px-1 text-center text-xs text-ink/55">
        Se guarda solo en este dispositivo mientras lo llenas. Campos con * son obligatorios.
      </p>
    </form>
  );
}

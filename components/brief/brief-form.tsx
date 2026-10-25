"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, FileUp, Loader2, Paperclip, PencilLine, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { BriefLinks } from "@/components/brief/brief-links";
import {
  BRIEF_FEATURES,
  BRIEF_SECTIONS,
  briefProgress,
  purposeLabel,
  type BriefField,
  type BriefState,
} from "@/lib/brief";
import { cn } from "@/lib/utils";

/** Adjuntos: lo que cabe en un envío (el resto, mejor por link de Drive o WeTransfer). */
export const MAX_FILES = 5;
export const MAX_FILES_BYTES = 3 * 1024 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "h-12 w-full rounded-inner bg-white px-4 text-[0.9375rem] font-medium text-ink outline-none ring-1 ring-inset ring-ink/10 transition-shadow placeholder:text-ink/40 hover:ring-ink/25 focus-visible:ring-2 focus-visible:ring-ink";
const labelClass = "mb-1.5 block px-1 text-[0.8125rem] font-semibold text-ink/75";

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface Step {
  id: string;
  short: string;
  title: string;
  intro: string;
  /** Campos que cuentan para el avance del paso. */
  keys: string[];
}

const STEPS: Step[] = [
  ...BRIEF_SECTIONS.map((s) => ({
    id: s.id,
    short: { contacto: "Contacto", negocio: "Negocio", proyecto: "Proyecto", marca: "Marca" }[s.id] || s.title,
    title: s.title,
    intro: s.intro,
    keys: s.fields.map((f) => f.key),
  })),
  {
    id: "materiales",
    short: "Materiales",
    title: "Enlaces, archivos y notas",
    intro: "Tu sitio, tus redes, carpetas con fotos o logo y sitios que te gusten. Reconocemos cada link solo.",
    keys: ["notes"],
  },
  { id: "revisar", short: "Revisar", title: "Revisa y envía", intro: "Un vistazo rápido antes de mandarlo. Puedes editar cualquier parte.", keys: [] },
];

const REQUIRED = BRIEF_SECTIONS.flatMap((s) => s.fields.filter((f) => f.required).map((f) => ({ key: f.key, section: s.id })));

function stepFilled(step: Step, state: BriefState) {
  if (step.id === "materiales") return Number(state.links.length > 0) + Number(Boolean(state.values.notes?.trim()));
  return step.keys.filter((k) => state.values[k]?.trim()).length + (step.id === "proyecto" && state.features.length ? 1 : 0);
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
  /** Se llama sólo cuando el brief es válido. */
  onSubmit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [localError, setLocalError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const progress = briefProgress(state);
  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  // Pasos donde Lumina acaba de llenar algo.
  const flashedSteps = new Set(
    STEPS.filter(
      (s) =>
        s.keys.some((k) => flash.has(k)) ||
        (s.id === "proyecto" && flash.has("features")) ||
        (s.id === "materiales" && (flash.has("links") || flash.has("notes")))
    ).map((s) => s.id)
  );

  function go(next: number, focus = true) {
    setStep(next);
    setLocalError("");
    if (focus) {
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        topRef.current?.focus({ preventScroll: true });
      });
    }
  }

  const setValue = (key: string, value: string) => onChange((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }));

  const toggleFeature = (feature: string) =>
    onChange((prev) => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter((f) => f !== feature) : [...prev.features, feature],
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

  /** Valida lo obligatorio; si falta algo, lleva a ese paso y enfoca el campo. */
  function validate(onlyStep?: string): boolean {
    const missing = REQUIRED.find((r) => (!onlyStep || r.section === onlyStep) && !state.values[r.key]?.trim());
    const badEmail = state.values.contactEmail?.trim() && !EMAIL_RE.test(state.values.contactEmail.trim());
    if (!missing && !(badEmail && (!onlyStep || onlyStep === "contacto"))) return true;
    const key = missing ? missing.key : "contactEmail";
    const section = missing ? missing.section : "contacto";
    setLocalError(missing ? "Completa nombre, negocio y WhatsApp para continuar." : "Revisa tu correo: parece que le falta algo.");
    const index = STEPS.findIndex((s) => s.id === section);
    if (index !== step) setStep(index);
    requestAnimationFrame(() => document.getElementById(`gb-${key}`)?.focus());
    return false;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!last) {
      // Enter en un campo = siguiente paso (validando el de contacto).
      if (validate(current.id)) go(step + 1);
      return;
    }
    if (validate()) onSubmit();
  }

  // Si el envío falló, el error se muestra en la revisión.
  useEffect(() => {
    if (sendState === "error" && error) setLocalError("");
  }, [sendState, error]);

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
      // Opciones como chips: se ven y se tocan mejor que un desplegable.
      control = (
        <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2">
          {field.options!.map((o) => {
            const on = value === o;
            return (
              <button
                key={o}
                id={on ? id : undefined}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setValue(field.key, on ? "" : o)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-left text-[0.8125rem] font-semibold ring-1 ring-inset transition-colors",
                  on ? "bg-ink text-lime ring-ink" : "bg-white text-ink ring-ink/10 hover:ring-ink/30"
                )}
              >
                {on && <Check aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />}
                {o}
              </button>
            );
          })}
        </div>
      );
    } else if (field.kind === "textarea") {
      control = (
        <textarea
          {...common}
          rows={3}
          maxLength={4000}
          placeholder={field.placeholder}
          onChange={(e) => setValue(field.key, e.target.value)}
          className={cn(fieldClass, "h-auto min-h-[6.5rem] resize-y py-3 leading-relaxed")}
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
    const isSelect = field.kind === "select";
    return (
      <div key={field.key} className={cn((field.full || isSelect) && "sm:col-span-2")}>
        {isSelect ? (
          <p id={`${id}-label`} className={labelClass}>
            {field.label}
          </p>
        ) : (
          <label htmlFor={id} className={labelClass}>
            {field.label}
            {field.required && <span className="text-lime-deep"> *</span>}
          </label>
        )}
        <div className={cn("rounded-inner", flash.has(field.key) && "brief-flash")}>{control}</div>
        {field.hint && (
          <p id={`${id}-hint`} className="mt-1.5 px-1 text-xs leading-snug text-ink/55">
            {field.hint}
          </p>
        )}
      </div>
    );
  }

  function renderReview() {
    return (
      <div className="flex flex-col gap-3">
        {BRIEF_SECTIONS.map((section, i) => {
          const rows = section.fields.filter((f) => state.values[f.key]?.trim());
          const missing = section.fields.filter((f) => f.required && !state.values[f.key]?.trim());
          return (
            <div key={section.id} className="rounded-card bg-white p-4 ring-1 ring-inset ring-ink/[0.08] sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.9375rem] font-bold text-ink">{section.title}</p>
                <button
                  type="button"
                  onClick={() => go(i)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink ring-1 ring-inset ring-ink/10 hover:ring-ink/30"
                >
                  <PencilLine aria-hidden className="h-3.5 w-3.5" />
                  Editar
                </button>
              </div>
              {rows.length ? (
                <dl className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {rows.map((f) => (
                    <div key={f.key} className={cn(f.kind === "textarea" && "sm:col-span-2")}>
                      <dt className="text-xs font-semibold text-ink/55">{f.label}</dt>
                      <dd className="whitespace-pre-line text-sm text-ink">{state.values[f.key]}</dd>
                    </div>
                  ))}
                  {section.id === "proyecto" && state.features.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold text-ink/55">Funciones</dt>
                      <dd className="mt-1 flex flex-wrap gap-1.5">
                        {state.features.map((f) => (
                          <span key={f} className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-inset ring-ink/[0.06]">
                            {f}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="mt-2 text-sm text-ink/50">Sin llenar (opcional).</p>
              )}
              {missing.length > 0 && (
                <p className="mt-3 rounded-inner bg-signal/10 px-3 py-2 text-xs font-semibold text-ink">
                  Falta: {missing.map((f) => f.label).join(", ")}
                </p>
              )}
            </div>
          );
        })}
        <div className="rounded-card bg-white p-4 ring-1 ring-inset ring-ink/[0.08] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.9375rem] font-bold text-ink">Enlaces, archivos y notas</p>
            <button
              type="button"
              onClick={() => go(STEPS.length - 2)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink ring-1 ring-inset ring-ink/10 hover:ring-ink/30"
            >
              <PencilLine aria-hidden className="h-3.5 w-3.5" />
              Editar
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink">
            {state.links.map((l) => (
              <li key={l.url} className="truncate">
                <strong>{l.label}</strong> · {purposeLabel(l.purpose)} — <span className="text-ink/60">{l.url}</span>
              </li>
            ))}
            {files.map((f) => (
              <li key={`${f.name}-${f.size}`} className="flex items-center gap-1.5">
                <Paperclip aria-hidden className="h-3.5 w-3.5 text-ink/55" />
                {f.name}
              </li>
            ))}
            {state.values.notes?.trim() && <li className="whitespace-pre-line text-ink/80">“{state.values.notes.trim()}”</li>}
            {!state.links.length && !files.length && !state.values.notes?.trim() && (
              <li className="text-ink/50">Sin enlaces ni archivos (opcional).</li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  const shownError = localError || (sendState === "error" ? error : "");

  return (
    <form noValidate onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
      {/* Avance general */}
      <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 ring-1 ring-inset ring-ink/[0.08]">
        <span className="text-xs font-bold text-ink/70">
          Paso {step + 1} de {STEPS.length}
        </span>
        <span
          role="progressbar"
          aria-label="Avance del brief"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10"
        >
          <span className="block h-full rounded-full bg-lime-deep transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </span>
        <span className="w-10 text-right text-xs font-bold tabular-nums text-ink">{progress}%</span>
      </div>

      {/* Pasos */}
      <nav aria-label="Pasos del brief" className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        <ol className="flex min-w-max gap-1.5 sm:grid sm:min-w-0 sm:grid-cols-6">
          {STEPS.map((s, i) => {
            const filled = stepFilled(s, state);
            const done = s.id !== "revisar" && filled > 0 && (s.id !== "contacto" || REQUIRED.every((r) => state.values[r.key]?.trim()));
            const active = i === step;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(i, false)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "relative flex w-full min-w-[6.5rem] items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-left text-xs font-semibold ring-1 ring-inset transition-colors sm:min-w-0",
                    active ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-ink/10 hover:ring-ink/30"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold tabular-nums",
                      active ? "bg-lime text-ink" : done ? "bg-lime-soft text-ink" : "bg-ink/[0.06] text-ink/60"
                    )}
                  >
                    {done && !active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="truncate">{s.short}</span>
                  {flashedSteps.has(s.id) && (
                    <span aria-hidden className="absolute right-1.5 top-1.5 size-2 rounded-full bg-lime ring-2 ring-white" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Paso actual */}
      <div
        ref={topRef}
        tabIndex={-1}
        className="flex scroll-mt-[calc(var(--header-h)+1rem)] flex-col gap-5 rounded-card bg-mint p-4 outline-none ring-1 ring-inset ring-ink/[0.06] sm:p-6"
      >
        <div className="flex items-start gap-3.5">
          <span aria-hidden className="display-title grid size-12 shrink-0 place-items-center rounded-full bg-ink text-lg text-lime">
            {String(step + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="display-title text-[1.5rem] leading-tight text-ink sm:text-[1.75rem]">{current.title}</h3>
            <p className="mt-1 text-pretty text-sm leading-relaxed text-ink/65">{current.intro}</p>
          </div>
        </div>

        {BRIEF_SECTIONS[step] && (
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{BRIEF_SECTIONS[step].fields.map(renderField)}</div>
        )}

        {current.id === "proyecto" && (
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
                      "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-[0.8125rem] font-semibold ring-1 ring-inset transition-colors",
                      on ? "bg-lime text-ink ring-lime-deep/40" : "bg-white text-ink ring-ink/10 hover:ring-ink/30"
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

        {current.id === "materiales" && (
          <>
            <BriefLinks links={state.links} highlight={flash.has("links")} onChange={(links) => onChange((prev) => ({ ...prev, links }))} />
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
                className="flex min-h-[4.5rem] cursor-pointer flex-col items-center justify-center gap-1 rounded-inner border-2 border-dashed border-ink/15 bg-white px-4 py-4 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
              >
                <span className="inline-flex items-center gap-2">
                  <FileUp aria-hidden className="h-4 w-4" />
                  Subir archivos ({files.length}/{MAX_FILES})
                </span>
                <span className="text-xs font-medium text-ink/55">Hasta 3 MB en total. ¿Pesan más? Pega un link de Drive o WeTransfer arriba.</span>
              </label>
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
            <div className={cn("rounded-inner", flash.has("notes") && "brief-flash")}>
              <label htmlFor="gb-notes" className={labelClass}>
                Algo más (opcional)
              </label>
              <textarea
                id="gb-notes"
                name="notes"
                rows={3}
                maxLength={4000}
                value={state.values.notes ?? ""}
                onChange={(e) => setValue("notes", e.target.value)}
                placeholder="Dudas, ideas sueltas o cualquier cosa que debamos saber."
                className={cn(fieldClass, "h-auto min-h-[5.5rem] resize-y py-3")}
              />
            </div>
          </>
        )}

        {current.id === "revisar" && renderReview()}
      </div>

      {shownError && (
        <div role="alert" className="flex flex-col gap-2 rounded-inner bg-white px-4 py-3 text-sm text-ink ring-1 ring-inset ring-signal/40 sm:flex-row sm:items-center sm:justify-between">
          <span>{shownError}</span>
          {sendState === "error" && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-forest underline-offset-4 hover:underline">
              <FaWhatsapp aria-hidden className="h-4 w-4" />
              Enviar por WhatsApp
            </a>
          )}
        </div>
      )}

      {/* Navegación */}
      <div className="flex items-center gap-2.5">
        {step > 0 && (
          <Button type="button" size="lg" variant="outline" onClick={() => go(step - 1)} className="px-5">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Anterior</span>
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          variant="ink"
          disabled={last && (sendState === "sending" || tooHeavy)}
          className="flex-1 justify-between pl-6 pr-2.5"
        >
          {last ? (sendState === "sending" ? "Enviando…" : "Enviar mi brief") : step === STEPS.length - 2 ? "Revisar" : `Siguiente: ${STEPS[step + 1].short}`}
          {last && sendState === "sending" ? (
            <Loader2 aria-hidden className="mr-2.5 h-5 w-5 animate-spin" />
          ) : (
            <ButtonArrow tone="lime" className="-mr-0.5" />
          )}
        </Button>
      </div>
      <p className="px-1 text-center text-xs text-ink/55">
        Se guarda solo en este dispositivo mientras lo llenas. Sólo nombre, negocio y WhatsApp son obligatorios.
      </p>
    </form>
  );
}

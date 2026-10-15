"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, Clock, Loader2, MessageCircle, ShieldCheck, Sparkle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { trackAdsConversion, trackEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { CONFIGURATOR_MODULES, CONFIGURATOR_PLANS } from "@/lib/catalog";
import { formatMoney } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES, type Dictionary } from "@/lib/i18n/dictionaries";
import {
  LEAD_FORM_ID,
  QUOTE_STORAGE_KEY,
  buildQuoteLinesMxn,
  normalizeSelection,
} from "@/lib/quote";
import { cn } from "@/lib/utils";

const WA_PHONE = "525663012505";
const TRUST_ICONS = [Clock, ShieldCheck, Sparkle];

const fieldClass =
  "h-12 w-full rounded-inner bg-white px-4 text-[0.9375rem] font-medium text-ink outline-none ring-1 ring-inset ring-ink/10 transition-shadow placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink";
const labelClass = "mb-1.5 block px-1 text-xs font-semibold text-ink/70";

/**
 * La cotización que la persona armó en el Configurador (si cambió algo del
 * paquete por defecto), en texto, para adjuntarla a la solicitud.
 */
function readSavedQuote(t: Dictionary): string {
  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return "";
    const saved = JSON.parse(raw) as Record<string, unknown>;
    const selection = normalizeSelection({
      planId: saved.planId,
      moduleIds: Object.entries((saved.mods as Record<string, boolean>) || {})
        .filter(([, on]) => on === true)
        .map(([id]) => id),
      sections: saved.sections,
    });
    const featured = CONFIGURATOR_PLANS.find((p) => p.featured)?.id;
    const isDefault =
      selection.planId === featured && !selection.moduleIds.length && !selection.sections;
    if (isDefault) return "";

    const plans = t.configurator.plans as Record<string, { name: string }>;
    const modules = t.configurator.modules as Record<string, string>;
    const parts = [
      plans[selection.planId]?.name ?? selection.planId,
      ...CONFIGURATOR_MODULES.filter((m) => selection.moduleIds.includes(m.id)).map(
        (m) => modules[m.id] ?? m.id
      ),
      ...(selection.sections ? [t.configurator.additionalSectionsLabel(selection.sections)] : []),
    ];
    const total = buildQuoteLinesMxn(selection).reduce((sum, line) => sum + line.price, 0);
    return `${parts.join(" + ")} · ${formatMoney(total, "MXN")} MXN`;
  } catch {
    return "";
  }
}

interface LeadFormProps {
  /** Las landings SEO existen sólo en español: fija el idioma del formulario. */
  forceSpanish?: boolean;
  /** De dónde viene (slug de la landing, "home", "crear-web"…), para el correo. */
  source: string;
  className?: string;
}

/**
 * Formulario corto de cotización: la conversión principal de la campaña de
 * Google Ads para quien todavía no está listo para pagar en línea. Pide lo
 * mínimo (nombre + WhatsApp), adjunta la cotización armada y la campaña de
 * origen, y si el envío falla, ofrece WhatsApp con todo ya escrito.
 */
export function LeadForm({ forceSpanish = false, source, className }: LeadFormProps) {
  const context = useLanguage();
  const t = forceSpanish ? DICTIONARIES.es : context.t;
  const copy = t.leadForm;

  const [timeline, setTimeline] = useState("");
  const [quote, setQuote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [waText, setWaText] = useState(copy.waIntro);
  const started = useRef(false);

  function onFirstInteraction() {
    setQuote(readSavedQuote(t));
    if (started.current) return;
    started.current = true;
    trackEvent("lead_form_start", { location: source });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();

    const name = value("name");
    const phone = value("phone");
    const email = value("email");
    const service = value("service");
    const message = value("message");
    const savedQuote = readSavedQuote(t);

    const summary = [
      copy.waIntro,
      name && `${copy.nameLabel}: ${name}`,
      service && `${copy.serviceLabel} ${service}`,
      timeline && `${copy.timelineLabel} ${timeline}`,
      message,
      savedQuote && `${copy.quoteAttached} ${savedQuote}`,
    ]
      .filter(Boolean)
      .join("\n");
    setWaText(summary);

    const digits = phone.replace(/\D/g, "");
    if (!name || digits.length < 8 || digits.length > 15) {
      setError(copy.errorRequired);
      setState("error");
      return;
    }

    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          service,
          timeline,
          message,
          quote: savedQuote,
          website: value("website"),
          page: `${window.location.pathname} (${source})`,
          attribution: getAttribution(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || String(res.status));

      trackEvent("quote_request", { location: source, service, timeline });
      trackAdsConversion("lead", { userData: { email, phone } });
      setState("sent");
    } catch {
      setError(copy.errorGeneric);
      setState("error");
    }
  }

  const waHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`;

  return (
    <section
      id={LEAD_FORM_ID}
      aria-labelledby="lead-form-title"
      className={cn(
        "scroll-mt-[calc(var(--header-h)+var(--gutter))]",
        className
      )}
    >
      <div data-fx="up">
        <div className="panel grid gap-7 p-4 pt-5 shadow-soft sm:p-7 lg:grid-cols-12 lg:gap-10 lg:p-10">
          {/* Izquierda: la promesa y las garantías. */}
          <div className="flex flex-col gap-6 px-1 sm:px-0 lg:col-span-5">
            <div className="flex flex-col items-start gap-4">
              <span className="eyebrow pl-3">
                <span aria-hidden className="size-2 rounded-full bg-lime" />
                {copy.eyebrow}
              </span>
              <h2
                id="lead-form-title"
                className="display-title text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[0.98] text-ink"
              >
                {copy.title}
              </h2>
              <p className="text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-base">
                {copy.subtitle}
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {copy.trust.map((item, i) => {
                const Icon = TRUST_ICONS[i] ?? Check;
                return (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-full bg-mint py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink ring-1 ring-inset ring-ink/[0.06]"
                  >
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-lime">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>

            <a
              href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(copy.waIntro)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track-service={source}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem] text-[#1f9e4f]" />
              {copy.whatsappDirect}
            </a>
          </div>

          {/* Derecha: el formulario (o la confirmación). */}
          <div className="min-w-0 lg:col-span-7">
            {state === "sent" ? (
              <div
                role="status"
                className="panel-ink relative flex h-full flex-col justify-center gap-4 overflow-hidden rounded-card p-6 sm:p-8"
              >
                <span aria-hidden className="grid size-14 place-items-center rounded-full bg-lime text-ink">
                  <Check className="h-7 w-7" strokeWidth={3} />
                </span>
                <p className="display-title text-[1.9rem] leading-tight text-white">{copy.successTitle}</p>
                <p className="text-pretty text-[0.975rem] leading-relaxed text-white/75">{copy.successBody}</p>
                <Button asChild size="lg" className="mt-2 w-full bg-lime pr-2.5 text-ink sm:w-fit sm:pl-6">
                  <a href={waHref} target="_blank" rel="noopener noreferrer" data-track-service={source}>
                    <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                    {copy.whatsappNow}
                    <ButtonArrow tone="ink" className="ml-auto -mr-0.5 sm:ml-2" />
                  </a>
                </Button>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={onSubmit}
                onFocusCapture={onFirstInteraction}
                className="grid gap-4 rounded-card bg-mint p-3.5 ring-1 ring-inset ring-ink/[0.06] sm:grid-cols-2 sm:p-5"
              >
                <div>
                  <label htmlFor="lead-name" className={labelClass}>
                    {copy.nameLabel} *
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={copy.namePlaceholder}
                    maxLength={120}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="lead-phone" className={labelClass}>
                    {copy.phoneLabel} *
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder={copy.phonePlaceholder}
                    maxLength={40}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="lead-email" className={labelClass}>
                    {copy.emailLabel}
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={copy.emailPlaceholder}
                    maxLength={160}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="lead-service" className={labelClass}>
                    {copy.serviceLabel}
                  </label>
                  <select id="lead-service" name="service" defaultValue="" className={cn(fieldClass, "cursor-pointer")}>
                    <option value="">—</option>
                    {copy.services.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className={labelClass}>{copy.timelineLabel}</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {copy.timelines.map((option) => (
                      <label
                        key={option}
                        className="flex min-h-11 cursor-pointer items-center rounded-full bg-white px-4 text-sm font-semibold text-ink/75 ring-1 ring-inset ring-ink/10 transition-colors hover:text-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-mint"
                      >
                        <input
                          type="radio"
                          name="timeline"
                          value={option}
                          checked={timeline === option}
                          onChange={() => setTimeline(option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="sm:col-span-2">
                  <label htmlFor="lead-message" className={labelClass}>
                    {copy.messageLabel}
                  </label>
                  <textarea
                    id="lead-message"
                    name="message"
                    rows={3}
                    maxLength={2000}
                    placeholder={copy.messagePlaceholder}
                    className={cn(fieldClass, "h-auto min-h-[6rem] resize-y py-3")}
                  />
                </div>

                {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="lead-website">Website</label>
                  <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {quote && (
                  <p className="flex items-start gap-2 rounded-inner bg-white/70 px-4 py-3 text-sm leading-snug text-ink sm:col-span-2">
                    <MessageCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <span>
                      <span className="font-semibold">{copy.quoteAttached}</span> {quote}
                    </span>
                  </p>
                )}

                {state === "error" && error && (
                  <div role="alert" className="flex flex-col gap-3 rounded-inner bg-white px-4 py-3 text-sm leading-snug text-ink ring-1 ring-inset ring-signal/40 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-start gap-2">
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-signal" />
                      {error}
                    </span>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track-service={source}
                      className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-forest underline-offset-4 hover:underline"
                    >
                      <FaWhatsapp aria-hidden className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="ink"
                    disabled={state === "sending"}
                    className="w-full justify-between pl-6 pr-2.5"
                  >
                    {state === "sending" ? copy.sending : copy.submit}
                    {state === "sending" ? (
                      <Loader2 aria-hidden className="mr-2.5 h-5 w-5 animate-spin" />
                    ) : (
                      <ButtonArrow tone="lime" className="-mr-0.5" />
                    )}
                  </Button>
                  <p className="px-1 text-center text-xs leading-relaxed text-muted-foreground">
                    {copy.privacyPrefix}{" "}
                    <a href="/privacidad" className="underline underline-offset-2 hover:text-ink">
                      {copy.privacyLink}
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

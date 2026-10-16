"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ClipboardList, Loader2, Lock, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { BriefForm } from "@/components/brief/brief-form";
import { BriefLumina } from "@/components/brief/brief-lumina";
import { StudioInfo } from "@/components/brief/studio-info";
import {
  EMPTY_BRIEF,
  briefToText,
  makeBriefLink,
  sanitizeBriefState,
  type BriefLuminaReply,
  type BriefState,
} from "@/lib/brief";
import { trackEvent } from "@/lib/analytics";
import { formatMoney } from "@/lib/currency";
import { usePaymentVerification } from "@/lib/use-payment-verification";

const WA_PHONE = "525663012505";
/** Borrador del brief en este dispositivo (sin archivos). */
const DRAFT_KEY = "bryanf_brief_draft_v1";

function readDraft(): BriefState | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? sanitizeBriefState(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const waHref = (text: string) => `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;

/**
 * /armar-mi-brief — el brief de arranque, como apartado propio.
 *
 * Se abre sólo con un pago confirmado: vuelve a verificar la referencia del
 * pago de la URL (la misma que trae el botón de /gracias y el del correo de
 * comprobante) o el enlace firmado de un pago confirmado a mano. Sin pago
 * confirmado muestra cómo conseguir el enlace, nunca el formulario.
 *
 * El brief (lib/brief.ts) va por pasos, se guarda solo, reconoce los enlaces
 * y Lumina puede llenarlo platicando. Se envía a /api/onboarding-submit y, si
 * falla, queda escrito en un WhatsApp.
 */
export function ArmarBriefExperience() {
  const { view, order, subscription, reference } = usePaymentVerification();
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<BriefState>(EMPTY_BRIEF);
  const [files, setFiles] = useState<File[]>([]);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const draftLoaded = useRef(false);
  const unlocked = view === "paid";

  useEffect(() => {
    const draft = readDraft();
    if (draft) setBrief(draft);
    draftLoaded.current = true;
  }, []);

  useEffect(() => {
    if (unlocked) trackEvent("brief_unlocked", { provider: order?.provider || "unknown" });
  }, [unlocked, order?.provider]);

  // Lo que ya sabemos por el pago: sólo llena lo que está vacío.
  useEffect(() => {
    if (!unlocked) return;
    const known: Record<string, string | undefined> = {
      fullName: order?.name,
      contactEmail: order?.email,
      contactPhone: order?.phone,
      projectType: subscription ? "Suscripción Todo Digital" : undefined,
    };
    setBrief((prev) => {
      const values = { ...prev.values };
      let changed = false;
      for (const [key, value] of Object.entries(known)) {
        if (value && !values[key]?.trim()) {
          values[key] = value;
          changed = true;
        }
      }
      return changed ? { ...prev, values } : prev;
    });
  }, [unlocked, order, subscription]);

  // Autoguardado (sin archivos).
  useEffect(() => {
    if (!draftLoaded.current || sendState === "sent") return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(brief));
      } catch {
        /* sin storage: se llena igual */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [brief, sendState]);

  /** Aplica lo que Lumina llenó; devuelve las claves que cambiaron. */
  function applyLumina(reply: BriefLuminaReply): string[] {
    const changed: string[] = [];
    const current = brief;
    const values = { ...current.values };
    for (const [key, value] of Object.entries(reply.fill)) {
      if (values[key] !== value) {
        values[key] = value;
        changed.push(key);
      }
    }
    const newFeatures = reply.features.filter((f) => !current.features.includes(f));
    if (newFeatures.length) changed.push("features");
    const newLinks = reply.links.filter((url) => !current.links.some((l) => l.url === url)).map((url) => makeBriefLink(url));
    if (newLinks.length) changed.push("links");
    if (!changed.length) return [];
    setBrief((prev) => ({
      values: { ...prev.values, ...Object.fromEntries(changed.filter((k) => k in values).map((k) => [k, values[k]])) },
      features: [...prev.features, ...newFeatures.filter((f) => !prev.features.includes(f))],
      links: [...prev.links, ...newLinks.filter((l) => !prev.links.some((p) => p.url === l.url))].slice(0, 20),
    }));
    setFlash(new Set(changed));
    window.setTimeout(() => setFlash(new Set()), 2600);
    trackEvent("brief_lumina_fill", { fields: changed.length });
    return changed.map((k) => (k === "features" ? "funciones" : k === "links" ? "enlaces" : k));
  }

  async function submit() {
    setSendState("sending");
    setError("");
    try {
      const attachments = await Promise.all(
        files.map(async (file) => ({ name: file.name, type: file.type, base64: await fileToBase64(file) }))
      );
      const res = await fetch("/api/onboarding-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `armar-mi-brief${subscription ? " (suscripción)" : ""}`,
          form: { ...brief.values, features: brief.features.join(", ") },
          links: brief.links.map((l) => ({ url: l.url, label: l.label, purpose: l.purpose })),
          payment: { method: order?.provider || "pendiente", reference },
          totals: order?.value ? { payableNow: order.value, currency: order.currency } : undefined,
          attachments,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || String(res.status));
      trackEvent("briefing_submit", { state: view, links: brief.links.length, files: files.length });
      setSendState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* nada */
      }
    } catch {
      setError("No se pudo enviar el brief. Mándalo por WhatsApp: ya va escrito.");
      setSendState("error");
    }
  }

  const briefText = briefToText(brief, reference);

  // ——— Verificando o bloqueado ———
  if (!unlocked) {
    const checking = view === "checking";
    const pending = view === "pending";
    return (
      <>
        <SpanishPageLanguage />
        <SiteHeader spanishOnly />
        <main id="main-content" tabIndex={-1} className="sheet-main">
          <section aria-labelledby="brief-gate-title" className="panel flex min-h-[60vh] flex-col justify-center p-4 pt-5 shadow-soft sm:p-8 lg:p-10">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6" aria-live="polite">
              <span className="grid size-16 place-items-center rounded-full bg-white text-ink ring-1 ring-ink/10">
                {checking ? <Loader2 className="h-7 w-7 animate-spin" /> : <Lock className="h-7 w-7" />}
              </span>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-lime-deep">Armar mi brief</p>
              <h1 id="brief-gate-title" className="display-title text-balance text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] text-ink">
                {checking
                  ? "Abriendo tu brief…"
                  : pending
                    ? "Tu brief se abre en cuanto se acredite tu pago"
                    : "Tu brief se abre al confirmar tu pago"}
              </h1>
              {!checking && (
                <>
                  <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">
                    {pending
                      ? "La plataforma todavía lo está procesando (OXXO, SPEI o revisión del banco). Cuando se confirme te llega un correo con el botón \"Armar mi brief\"."
                      : "Entra desde el botón \"Armar mi brief\" de tu correo de comprobante o de la página de compra exitosa. ¿Ya pagaste y no lo encuentras? Revisa spam o escríbenos y te lo reenviamos."}
                  </p>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
                      <a href={waHref("Hola Bryan, ya pagué y necesito el enlace para armar mi brief.")} target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem] text-lime" />
                        Pedir mi enlace
                        <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/crear-web#precios">Aún no pago: ver precios</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
        <SiteFooter spanishOnly />
      </>
    );
  }

  const amount = order?.value ? `${formatMoney(order.value, order.currency === "USD" ? "USD" : "MXN")} ${order.currency}` : null;

  return (
    <>
      <SpanishPageLanguage />
      <SiteHeader spanishOnly />
      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* Encabezado */}
        <section aria-labelledby="brief-title" className="panel relative overflow-hidden bg-ink p-5 pt-6 text-white shadow-soft sm:p-9 lg:p-10">
          <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-lime/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-ink">
                <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                Pago confirmado{amount ? ` · ${amount}` : ""}
              </span>
              <h1 id="brief-title" className="display-title text-balance text-[clamp(2.25rem,5vw,4rem)] leading-[0.96]">
                {sendState === "sent" ? "¡Brief recibido!" : subscription ? "Arma el brief de tu negocio" : "Arma tu brief"}
              </h1>
              <p className="text-pretty text-[0.975rem] leading-relaxed text-white/75 md:text-lg">
                {sendState === "sent"
                  ? "Lo revisamos en menos de 24 horas hábiles y te escribimos para agendar el arranque."
                  : "Seis pasos cortos. Mientras más nos cuentes, más rápido arrancamos y menos vueltas damos. ¿Prefieres platicarlo? Lumina lo llena contigo."}
              </p>
            </div>
            <ul className="flex flex-wrap gap-2 text-xs font-semibold text-white/80 lg:max-w-xs lg:justify-end">
              {["Se guarda solo", "≈ 8 minutos", "Lumina te ayuda"].map((t) => (
                <li key={t} className="rounded-full px-3 py-1.5 ring-1 ring-inset ring-white/20">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="Formulario del brief" className="grid items-start gap-gutter lg:grid-cols-12">
          <div className="panel min-w-0 p-4 pt-5 shadow-soft sm:p-7 lg:col-span-8 lg:p-8">
            {sendState === "sent" ? (
              <div role="status" className="flex flex-col gap-4 rounded-card bg-lime p-6 sm:p-8">
                <span className="grid size-14 place-items-center rounded-full bg-ink text-lime">
                  <ClipboardList className="h-6 w-6" />
                </span>
                <p className="display-title text-[1.75rem] leading-tight text-ink">Tu brief ya está con nosotros</p>
                <ol className="flex flex-col gap-2 text-[0.975rem] leading-relaxed text-ink/80">
                  <li>1. Lo revisamos y te mandamos la ruta del proyecto (menos de 24 h hábiles).</li>
                  <li>2. Agendamos una videollamada de arranque de 20 minutos.</li>
                  <li>3. Construimos contigo hasta publicar.</li>
                </ol>
                {brief.values.contactEmail && (
                  <p className="flex items-center gap-2 text-sm text-ink/70">
                    <Mail aria-hidden className="h-4 w-4" />
                    Te mandamos una copia a {brief.values.contactEmail}.
                  </p>
                )}
                <Button asChild size="lg" variant="ink" className="w-full sm:w-fit">
                  <a href={waHref(briefText)} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                    Avisar por WhatsApp
                  </a>
                </Button>
              </div>
            ) : (
              <BriefForm
                state={brief}
                onChange={setBrief}
                flash={flash}
                files={files}
                onFiles={setFiles}
                sendState={sendState}
                error={error}
                whatsappHref={waHref(briefText)}
                onSubmit={submit}
              />
            )}
          </div>

          {/* Lumina: en teléfono va primero; en escritorio acompaña pegada arriba. */}
          <aside className="order-first flex min-w-0 flex-col gap-gutter lg:sticky lg:top-[calc(var(--header-h,4.5rem)+var(--gutter))] lg:order-none lg:col-span-4">
            {sendState !== "sent" && <BriefLumina state={brief} subscription={subscription} view="paid" onApply={applyLumina} />}
            <div className="panel flex flex-col gap-3 p-5 shadow-soft">
              <p className="text-sm font-bold text-ink">¿Dudas? Te contestamos directo</p>
              <Button asChild variant="ink" className="w-full">
                <a href={waHref("Hola Bryan, estoy armando mi brief y tengo una duda: ")} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden className="h-4 w-4 text-lime" />
                  Hablar con Bryan
                </a>
              </Button>
              <a
                href="mailto:bryanf@bryanfdesign.com"
                className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              >
                <Mail aria-hidden className="h-4 w-4" />
                bryanf@bryanfdesign.com
              </a>
            </div>
          </aside>
        </section>

        <StudioInfo subscription={subscription} />
      </main>
      <SiteFooter spanishOnly />
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, KeyRound, Loader2, MailCheck, Sparkle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { SubscriberPanelView } from "@/components/subscriber-panel/panel-view";
import { PasswordCard, ProjectPanelView, PurchasesList } from "@/components/subscriber-panel/project-panel";
import type { ClientPanel } from "@/components/subscriber-panel/panel-types";

type State =
  | { kind: "login"; linkError: boolean }
  | { kind: "empty"; email: string }
  | { kind: "panel"; panel: ClientPanel };

const WHATSAPP_HELP = `https://wa.me/525663012505?text=${encodeURIComponent(
  "Hola Bryan, soy cliente y necesito ayuda para entrar a mi panel."
)}`;

async function logout(router: ReturnType<typeof useRouter>) {
  await fetch("/api/mi-panel/logout", { method: "POST" }).catch(() => null);
  router.refresh();
}

/**
 * Página completa de /mi-panel: acceso (enlace o contraseña), sin cuenta o el
 * panel. `preview` es "ver como cliente" desde el Panel BryanF: se ve igual
 * que para el cliente, pero los botones no hacen nada.
 */
export function ClientPanelPage({ state, preview = false }: { state: State; preview?: boolean }) {
  return (
    <>
      <SpanishPageLanguage />
      <SiteHeader spanishOnly />
      <main id="main-content" tabIndex={-1} className="sheet-main">
        {preview && state.kind === "panel" && (
          <p
            role="status"
            className="flex flex-wrap items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            <Eye aria-hidden className="h-4 w-4 text-lime" />
            Vista previa: así ve su panel {state.panel.email}. Los botones están desactivados.
            <Link href="/admin?tab=clientes" className="ml-auto font-bold text-lime underline underline-offset-2">
              Volver al Panel BryanF
            </Link>
          </p>
        )}
        {state.kind === "login" && <LoginCard linkError={state.linkError} />}
        {state.kind === "empty" && <EmptyCard email={state.email} />}
        {state.kind === "panel" && <PanelCard panel={state.panel} preview={preview} />}
      </main>
      <SiteFooter spanishOnly />
    </>
  );
}

function PanelCard({ panel, preview }: { panel: ClientPanel; preview: boolean }) {
  const router = useRouter();
  const [managing, setManaging] = useState(false);
  const [error, setError] = useState("");

  async function manage() {
    if (managing) return;
    setManaging(true);
    setError("");
    try {
      const res = await fetch("/api/mi-panel/manage", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) window.location.href = json.url;
      else setError(json.error || "No se pudo abrir la administración.");
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setManaging(false);
    }
  }

  const onLogout = preview ? undefined : () => logout(router);
  return (
    <section aria-label="Mi panel" className="panel flex flex-col gap-4 p-4 shadow-soft sm:p-6 lg:p-8">
      {panel.subscription ? (
        <SubscriberPanelView
          data={{ ...panel.subscription, name: panel.name || panel.subscription.name, email: panel.email }}
          demo={preview}
          onManage={manage}
          managing={managing}
          onLogout={onLogout}
        />
      ) : (
        <ProjectPanelView panel={panel} demo={preview} onLogout={onLogout} />
      )}
      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PurchasesList purchases={panel.purchases} />
        </div>
        <div className="lg:col-span-5">
          <PasswordCard hasPassword={panel.hasPassword} demo={preview} />
        </div>
      </div>
    </section>
  );
}

function LoginCard({ linkError }: { linkError: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"link" | "password">("link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(linkError ? "El enlace ya venció o no es válido. Pide uno nuevo." : "");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(mode === "link" ? "/api/mi-panel/login" : "/api/mi-panel/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "link" ? { email } : { email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error || (mode === "link" ? "No se pudo enviar el enlace." : "No se pudo entrar."));
      else if (mode === "link") setSent(true);
      else router.refresh();
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="mi-panel-title" className="grid gap-gutter lg:grid-cols-12">
      <div className="panel flex flex-col gap-5 p-5 pt-6 shadow-soft sm:p-8 lg:col-span-7 lg:p-10">
        <span className="eyebrow w-fit pl-3">
          <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime-deep" />
          Clientes y suscriptores
        </span>
        <h1 id="mi-panel-title" className="display-title text-balance text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.96] text-ink">
          Entra a tu panel
        </h1>
        <p className="max-w-xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">
          Entra con el correo con el que pagaste tu proyecto o tu suscripción: te mandamos un enlace, o usa tu
          contraseña si ya tienes una.
        </p>

        <div role="tablist" aria-label="Forma de entrar" className="flex w-fit gap-1 rounded-full bg-mint p-1 ring-1 ring-inset ring-ink/[0.06]">
          {(
            [
              ["link", "Enlace por correo"],
              ["password", "Contraseña"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => {
                setMode(id);
                setError("");
                setSent(false);
              }}
              className={
                mode === id
                  ? "min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white"
                  : "min-h-10 rounded-full px-4 text-sm font-semibold text-ink/70 hover:text-ink"
              }
            >
              {label}
            </button>
          ))}
        </div>

        {sent ? (
          <div role="status" className="flex items-start gap-3 rounded-card bg-lime p-5 text-ink">
            <MailCheck aria-hidden className="mt-0.5 h-6 w-6 shrink-0" />
            <p className="text-sm font-medium leading-relaxed">
              Si <strong>{email}</strong> tiene cuenta con nosotros, ya te llegó un correo con tu enlace (vale 30
              minutos). Revisa también la carpeta de spam.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex max-w-xl flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <label htmlFor="mi-panel-email" className="sr-only">
              Correo
            </label>
            <input
              id="mi-panel-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="h-14 min-w-0 flex-1 rounded-full border border-ink/[0.12] bg-white px-5 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/45 focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)] sm:basis-[14rem]"
            />
            {mode === "password" && (
              <>
                <label htmlFor="mi-panel-password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="mi-panel-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="h-14 min-w-0 flex-1 rounded-full border border-ink/[0.12] bg-white px-5 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/45 focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)] sm:basis-[12rem]"
                />
              </>
            )}
            <Button type="submit" size="lg" variant="ink" disabled={loading} className="justify-between pl-6 pr-2.5">
              {loading ? (
                <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
              ) : mode === "link" ? (
                "Mandar enlace"
              ) : (
                <span className="inline-flex items-center gap-2">
                  <KeyRound aria-hidden className="h-4 w-4 text-lime" />
                  Entrar
                </span>
              )}
              <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
            </Button>
          </form>
        )}
        {error && (
          <p role="alert" className="text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
        <a
          href={WHATSAPP_HELP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline"
        >
          <FaWhatsapp aria-hidden className="h-4 w-4 text-forest" />
          ¿Problemas para entrar? Escríbenos
        </a>
      </div>

      <aside className="panel panel-ink relative flex flex-col justify-between gap-6 overflow-hidden p-5 sm:p-8 lg:col-span-5">
        <div aria-hidden className="mesh-glow-a opacity-60" />
        <div className="relative flex flex-col gap-3">
          <p className="display-title text-[1.6rem] leading-tight text-white">En tu panel</p>
          <ul className="flex flex-col gap-2.5 text-[0.9375rem] text-white/85">
            {[
              "Tu proyecto o tu plan, y tus pagos",
              "Cuántos días faltan para tu próximo cobro (suscripción)",
              "Pide cambios, páginas, gráficos o tarjetas con un toque",
              "Cambia tu tarjeta, descarga facturas o cancela",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full bg-lime" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/65">
          ¿Aún no te suscribes?{" "}
          <Link href="/suscripcion" className="font-semibold text-lime underline underline-offset-2">
            Conoce Todo Digital
          </Link>
        </p>
      </aside>
    </section>
  );
}

function EmptyCard({ email }: { email: string }) {
  const router = useRouter();
  return (
    <section aria-labelledby="mi-panel-empty" className="panel flex flex-col items-start gap-5 p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
      <h1 id="mi-panel-empty" className="display-title text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.98] text-ink">
        No encontramos una cuenta con {email}
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Si pagaste con otro correo, sal y entra con ese. Si acabas de pagar, puede tardar unos minutos en aparecer.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Button asChild size="lg" variant="ink" className="pl-6 pr-2.5">
          <Link href="/suscripcion">
            Conocer la suscripción
            <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" onClick={() => logout(router)}>
          Entrar con otro correo
        </Button>
      </div>
    </section>
  );
}

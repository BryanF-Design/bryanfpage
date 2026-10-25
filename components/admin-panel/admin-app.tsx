"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BadgePercent,
  CalendarHeart,
  Check,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  RefreshCw,
  Repeat,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import type { Account, Purchase } from "@/lib/db";
import type { SiteSettings } from "@/lib/seasons";
import type { SubscribersResult } from "@/lib/subscribers";
import { cn } from "@/lib/utils";

import { TZ, useAdminAction } from "./admin-ui";
import { ClientsTab } from "./tab-clients";
import { DiscountsTab } from "./tab-discounts";
import { NoticesTab } from "./tab-notices";
import { OverviewTab } from "./tab-overview";
import { PaymentsTab } from "./tab-payments";
import { SeasonsTab } from "./tab-seasons";
import { SubscriptionsTab } from "./tab-subscriptions";

export interface AdminData {
  subscribers: SubscribersResult;
  payments: Purchase[];
  accounts: Account[];
  settings: SiteSettings;
  /** ¿Hay base de datos? Sin ella no se guardan cuentas ni ajustes. */
  db: boolean;
  errors: string[];
  fetchedAt: number;
}

export type TabId = "resumen" | "clientes" | "suscripciones" | "pagos" | "temporadas" | "descuentos" | "avisos";

const TABS: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "suscripciones", label: "Suscripciones", icon: Repeat },
  { id: "pagos", label: "Pagos", icon: CreditCard },
  { id: "temporadas", label: "Temporadas", icon: CalendarHeart },
  { id: "descuentos", label: "Descuentos", icon: BadgePercent },
  { id: "avisos", label: "Avisos y pop-up", icon: Megaphone },
];

const SETTINGS_TABS: TabId[] = ["temporadas", "descuentos", "avisos"];

const isTab = (v: unknown): v is TabId => TABS.some((t) => t.id === v);

export const previewHref = (email: string) => `/admin/vista?email=${encodeURIComponent(email)}`;

/**
 * Panel BryanF: todo el sitio en un lugar. Las pestañas de ajustes
 * (temporadas, descuentos, avisos) comparten un borrador y una barra de
 * guardar; lo demás guarda acción por acción.
 */
export function AdminApp({ data, initialTab }: { data: AdminData; initialTab?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>(isTab(initialTab) ? initialTab : "resumen");
  const [refreshing, startRefresh] = useTransition();
  const [draft, setDraft] = useState<SiteSettings>(data.settings);
  const { run, busy, message, setMessage } = useAdminAction();

  // Si llegan ajustes nuevos del servidor (tras guardar), el borrador se alinea.
  useEffect(() => setDraft(data.settings), [data.settings]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(data.settings), [draft, data.settings]);

  // La pestaña vive en la URL (?tab=) para volver a ella y compartirla.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, [tab]);

  // Avisar antes de salir con ajustes sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function save() {
    await run("settings.save", { settings: draft }, { ok: "Listo: el sitio ya muestra los cambios." });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.refresh();
  }

  const updated = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(data.fetchedAt);
  const settingsTab = SETTINGS_TABS.includes(tab);

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-[100dvh] flex-col gap-gutter p-[var(--gutter)] pb-28">
      <header className="panel flex flex-wrap items-center justify-between gap-4 p-4 shadow-soft sm:p-5">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/brand/logo-dark.png" alt="BryanF Design" width={160} height={56} className="logo-invert h-9 w-auto" />
          <div className="leading-tight">
            <h1 className="display-title text-2xl text-ink sm:text-3xl">Panel BryanF</h1>
            <p className="text-xs font-medium text-ink/60">Todo tu sitio · actualizado {updated}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <ExternalLink aria-hidden className="h-4 w-4" />
            Ver sitio
          </a>
          <ThemeToggle className="size-11" />
          <button
            type="button"
            onClick={() => startRefresh(() => router.refresh())}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <RefreshCw aria-hidden className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Actualizar
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-forest"
          >
            <LogOut aria-hidden className="h-4 w-4 text-lime" />
            Salir
          </button>
        </div>
      </header>

      {!data.db && (
        <p role="status" className="flex items-start gap-2.5 rounded-[1.25rem] bg-lime/40 px-4 py-3 text-sm font-medium text-ink">
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          Sin base de datos: las cuentas, temporadas y descuentos no se pueden guardar. Faltan SUPABASE_URL,
          SUPABASE_PUBLISHABLE_KEY y SITIO_DB_KEY en Vercel.
        </p>
      )}
      {[
        ...data.subscribers.sources
          .filter((s) => !s.configured || s.error)
          .map((s) =>
            s.configured
              ? `No se pudo leer ${s.provider === "stripe" ? "Stripe" : "Mercado Pago"}: ${s.error}`
              : `${s.provider === "stripe" ? "Stripe" : "Mercado Pago"} no está configurado.`
          ),
        ...data.errors,
      ].map((text) => (
        <p key={text} role="status" className="flex items-start gap-2.5 rounded-[1.25rem] bg-ink/[0.05] px-4 py-3 text-sm font-medium text-ink">
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {text}
        </p>
      ))}

      <div className="grid gap-gutter lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Navegación: columna en escritorio, carrusel de píldoras en teléfono. */}
        <nav aria-label="Secciones del panel" className="lg:sticky lg:top-[var(--gutter)] lg:self-start">
          <ul className="-mx-[var(--gutter)] flex gap-1.5 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] lg:mx-0 lg:rounded-panel lg:bg-white lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2 lg:shadow-soft">
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTab(id);
                    setMessage(null);
                  }}
                  aria-current={tab === id ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-2.5 rounded-full px-4 text-sm font-semibold transition-colors lg:rounded-[1rem]",
                    tab === id ? "bg-ink text-white" : "bg-white text-ink/75 ring-1 ring-ink/[0.06] hover:text-ink lg:bg-transparent lg:ring-0 lg:hover:bg-ink/[0.05]"
                  )}
                >
                  <Icon aria-hidden className={cn("h-4 w-4", tab === id && "text-lime")} />
                  {label}
                  {SETTINGS_TABS.includes(id) && dirty && (
                    <span aria-label="sin guardar" className="ml-auto size-2 rounded-full bg-signal" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-gutter">
          {tab === "resumen" && <OverviewTab data={data} draft={draft} go={setTab} />}
          {tab === "clientes" && <ClientsTab data={data} />}
          {tab === "suscripciones" && <SubscriptionsTab data={data.subscribers} previewHref={previewHref} />}
          {tab === "pagos" && <PaymentsTab data={data} />}
          {tab === "temporadas" && <SeasonsTab draft={draft} setDraft={setDraft} now={data.fetchedAt} />}
          {tab === "descuentos" && <DiscountsTab draft={draft} setDraft={setDraft} now={data.fetchedAt} />}
          {tab === "avisos" && <NoticesTab draft={draft} setDraft={setDraft} />}
        </div>
      </div>

      {/* Barra de guardar de los ajustes del sitio. */}
      {(settingsTab || dirty || message) && (
        <div className="fixed inset-x-[var(--gutter)] bottom-[var(--gutter)] z-50 mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-[0_24px_60px_-24px_hsl(var(--shade)/0.8)]">
          <p className="min-w-0 text-sm font-medium" role="status" aria-live="polite">
            {message ? (
              <span className={message.tone === "error" ? "text-red-300" : "text-lime"}>{message.text}</span>
            ) : dirty ? (
              "Tienes cambios sin guardar."
            ) : (
              "Todo guardado."
            )}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button
                type="button"
                onClick={() => setDraft(data.settings)}
                className="min-h-10 rounded-full px-4 text-sm font-semibold text-white/75 hover:text-white"
              >
                Descartar
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || !!busy || !data.db}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-lime px-5 text-sm font-bold text-ink transition-transform active:scale-95 disabled:opacity-50"
            >
              {busy === "settings.save" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Check aria-hidden className="h-4 w-4" />}
              Guardar y publicar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

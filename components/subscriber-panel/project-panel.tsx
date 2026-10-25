"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ClipboardList,
  FileText,
  KeyRound,
  Loader2,
  LogOut,
  MessageSquareText,
  PenLine,
  Receipt,
  Rocket,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import type { ClientPanel, PanelPurchase } from "./panel-types";

const WHATSAPP = "525663012505";
const TZ = "America/Mexico_City";

const PROVIDER: Record<PanelPurchase["provider"], string> = {
  stripe: "Tarjeta",
  mercadopago: "Mercado Pago",
  transferencia: "Transferencia",
  manual: "Registrado por BryanF",
};

function money(value: number, currency: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function date(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(ms);
}

function firstName(name: string, email: string) {
  return name.trim().split(/\s+/)[0] || email.split("@")[0];
}

const ASKS: Array<{ Icon: LucideIcon; label: string; text: string }> = [
  { Icon: MessageSquareText, label: "¿Cómo va mi proyecto?", text: "Quiero saber cómo va mi proyecto." },
  { Icon: PenLine, label: "Quiero un cambio", text: "Quiero pedir un cambio:" },
  { Icon: FileText, label: "Necesito mi factura", text: "Necesito la factura de mi pago." },
  { Icon: Rocket, label: "Contratar algo más", text: "Me interesa contratar otro servicio:" },
];

/**
 * Mi panel de un cliente con compra única (desarrollo web, tarjeta, landing…)
 * o con un plan que se paga por transferencia sin fecha capturada: su
 * servicio, su último pago, el brief y pedir cosas por WhatsApp.
 */
export function ProjectPanelView({
  panel,
  demo = false,
  onLogout,
}: {
  panel: ClientPanel;
  demo?: boolean;
  onLogout?: () => void;
}) {
  const who = firstName(panel.name, panel.email);
  const last = panel.purchases[0];
  const total = panel.purchases.reduce((sum, p) => sum + (p.currency === "MXN" ? p.amount : 0), 0);
  const ask = (text: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Bryan, soy ${panel.name || panel.email}. ${text} `)}`;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-11 place-items-center rounded-full bg-ink text-lg font-bold uppercase text-lime">
            {who.charAt(0)}
          </span>
          <div className="leading-tight">
            <p className="display-title text-xl text-ink sm:text-2xl">Hola, {who}</p>
            <p className="text-xs text-ink/60 sm:text-sm">{panel.email}</p>
          </div>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <LogOut aria-hidden className="h-4 w-4" />
            Salir
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        <section data-fx="up" className="relative flex flex-col gap-5 overflow-hidden rounded-card bg-ink p-5 text-white sm:p-6 lg:col-span-7">
          <div aria-hidden className="mesh-glow-a opacity-50" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white/60">Tu servicio</p>
              <p className="display-title mt-1 text-[1.6rem] leading-tight">{panel.service || "Proyecto con BryanF Design"}</p>
            </div>
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
              {panel.kind === "transferencia" ? "Pago por transferencia" : "Pagado"}
            </span>
          </div>
          <dl className="relative grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-white/60">Último pago</dt>
              <dd className="text-lg font-bold tabular-nums">{last ? money(last.amount, last.currency) : "—"}</dd>
              {last && <dd className="text-white/60">{date(last.at)}</dd>}
            </div>
            <div>
              <dt className="text-white/60">Total pagado</dt>
              <dd className="text-lg font-bold tabular-nums">{money(total, "MXN")}</dd>
              <dd className="text-white/60">
                {panel.purchases.length} {panel.purchases.length === 1 ? "pago" : "pagos"}
              </dd>
            </div>
          </dl>
          <ol className="relative grid gap-2 text-sm sm:grid-cols-3">
            {[
              ["Pago recibido", true],
              ["Tu brief", false],
              ["Diseño y entrega", false],
            ].map(([label, done], i) => (
              <li key={String(label)} className="flex items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-3">
                <span
                  aria-hidden
                  className={
                    done
                      ? "grid size-7 place-items-center rounded-full bg-lime text-ink"
                      : "grid size-7 place-items-center rounded-full bg-white/10 text-xs font-bold text-white/70"
                  }
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
          <div className="relative mt-auto flex flex-wrap gap-2">
            <Link
              href={demo ? "#" : panel.briefUrl}
              aria-disabled={demo}
              tabIndex={demo ? -1 : undefined}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lime px-4 text-sm font-bold text-ink transition-transform hover:scale-[1.02]"
            >
              <ClipboardList aria-hidden className="h-4 w-4" />
              Armar mi brief
            </Link>
          </div>
        </section>

        <section data-fx="up" className="flex flex-col gap-4 rounded-card bg-lime p-5 text-ink sm:p-6 lg:col-span-5">
          <div>
            <p className="display-title text-[1.4rem] leading-tight">¿Qué necesitas?</p>
            <p className="mt-1 text-sm text-ink/75">Toca una opción y te contestamos por WhatsApp.</p>
          </div>
          <ul className="flex flex-col gap-1.5">
            {ASKS.map(({ Icon, label, text }) => {
              const cls =
                "group flex min-h-11 items-center gap-3 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors hover:bg-white";
              const inner = (
                <>
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-lime">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{label}</span>
                  <FaWhatsapp aria-hidden className="h-4 w-4 text-forest transition-transform group-hover:scale-110" />
                </>
              );
              return (
                <li key={label}>
                  {demo ? (
                    <span className={cls}>{inner}</span>
                  ) : (
                    <a href={ask(text)} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href={demo ? "#" : "/suscripcion"}
            tabIndex={demo ? -1 : undefined}
            className="mt-auto flex items-center gap-3 rounded-[1.1rem] bg-ink p-3 text-white"
          >
            <Sparkle aria-hidden className="h-5 w-5 shrink-0 fill-lime text-lime" />
            <span className="text-sm leading-snug">
              <strong className="block">¿Quieres todo lo digital sin límite?</strong>
              Suscripción Todo Digital: {money(SUBSCRIPTION_PLAN.price, "MXN")} al mes.
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}

/** Historial de pagos (compras únicas, anticipos, transferencias). */
export function PurchasesList({ purchases }: { purchases: PanelPurchase[] }) {
  return (
    <section aria-labelledby="mis-pagos" className="h-full rounded-card bg-white p-5 ring-1 ring-ink/[0.08] sm:p-6">
      <h2 id="mis-pagos" className="display-title flex items-center gap-2 text-[1.3rem] text-ink">
        <Receipt aria-hidden className="h-5 w-5 text-forest" />
        Mis pagos
      </h2>
      {purchases.length === 0 ? (
        <p className="mt-3 text-sm text-ink/60">Tus mensualidades están en el apartado de tu plan. Aquí aparecerán tus pagos de proyectos.</p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-ink/[0.07]">
          {purchases.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink">{p.description || "Pago"}</span>
                <span className="block text-ink/55">
                  {date(p.at)} · {PROVIDER[p.provider]}
                </span>
              </span>
              <span className="shrink-0 font-bold tabular-nums text-ink">{money(p.amount, p.currency)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Crear o cambiar la contraseña de Mi panel (además del enlace por correo). */
export function PasswordCard({ hasPassword, demo = false }: { hasPassword: boolean; demo?: boolean }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (demo || state === "saving") return;
    setState("saving");
    setError("");
    try {
      const res = await fetch("/api/mi-panel/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "No se pudo guardar.");
      setPassword("");
      setState("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setState("idle");
    }
  }

  return (
    <section aria-labelledby="mi-password" className="h-full rounded-card bg-white p-5 ring-1 ring-ink/[0.08] sm:p-6">
      <h2 id="mi-password" className="display-title flex items-center gap-2 text-[1.3rem] text-ink">
        <KeyRound aria-hidden className="h-5 w-5 text-forest" />
        {hasPassword ? "Cambiar contraseña" : "Crear contraseña"}
      </h2>
      <p className="mt-1 text-sm text-ink/60">Para entrar sin esperar el correo. El enlace sigue funcionando.</p>
      <form onSubmit={save} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="new-password" className="sr-only">
          Nueva contraseña
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          disabled={demo}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setState("idle");
          }}
          placeholder="Mínimo 8 caracteres"
          className="h-12 min-w-0 flex-1 rounded-full border border-ink/[0.12] bg-white px-5 text-sm text-ink outline-none focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={demo || state === "saving"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-forest disabled:opacity-60"
        >
          {state === "saving" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : state === "saved" ? <Check aria-hidden className="h-4 w-4 text-lime" /> : null}
          {state === "saved" ? "Guardada" : "Guardar"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}

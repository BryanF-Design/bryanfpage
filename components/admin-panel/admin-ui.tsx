"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const DAY = 86_400_000;
export const TZ = "America/Mexico_City";

export function money(value: number, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(value || 0);
}

export function shortDate(ms: number | null | undefined) {
  if (!ms || !Number.isFinite(ms)) return "—";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: TZ }).format(ms);
}

/** Llama a /api/admin/panel y refresca los datos del servidor al terminar. */
export function useAdminAction() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const run = useCallback(
    async <T extends Record<string, unknown>>(
      action: string,
      payload: Record<string, unknown>,
      opts: { ok?: string; refresh?: boolean } = {}
    ): Promise<T | null> => {
      setBusy(action);
      setMessage(null);
      try {
        const res = await fetch("/api/admin/panel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...payload }),
        });
        const json = (await res.json().catch(() => ({}))) as T & { error?: string };
        if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
        if (opts.ok) setMessage({ tone: "ok", text: opts.ok });
        if (opts.refresh !== false) router.refresh();
        return json;
      } catch (error) {
        setMessage({ tone: "error", text: error instanceof Error ? error.message : "No se pudo completar." });
        return null;
      } finally {
        setBusy(null);
      }
    },
    [router]
  );

  return { run, busy, message, setMessage };
}

export function Notice({ tone, children }: { tone: "ok" | "error" | "info"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[1rem] px-4 py-3 text-sm font-semibold",
        tone === "ok" && "bg-lime text-ink",
        tone === "error" && "bg-destructive/10 text-destructive",
        tone === "info" && "bg-mint text-ink"
      )}
    >
      {children}
    </p>
  );
}

export function Card({
  title,
  icon: Icon,
  action,
  children,
  className,
  id,
}: {
  title?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("panel flex flex-col gap-4 p-4 shadow-soft sm:p-6", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title && (
            <h2 id={id} className="display-title flex items-center gap-2.5 text-xl text-ink">
              {Icon && (
                <span aria-hidden className="grid size-8 place-items-center rounded-full bg-ink text-lime">
                  <Icon className="h-4 w-4" />
                </span>
              )}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({
  icon: Icon,
  label,
  value,
  note,
  dark,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("panel flex flex-col gap-3 p-4 shadow-soft sm:p-5", dark && "panel-ink bg-ink text-white")}>
      <span aria-hidden className={cn("grid size-9 place-items-center rounded-full", dark ? "bg-lime text-ink" : "bg-ink text-lime")}>
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className={cn("block text-xs font-semibold", dark ? "text-white/65" : "text-ink/60")}>{label}</span>
        <span className={cn("display-title mt-1 block break-words text-2xl tabular-nums sm:text-3xl", dark && "text-lime")}>{value}</span>
        {note && <span className={cn("mt-1 block text-xs", dark ? "text-white/60" : "text-ink/55")}>{note}</span>}
      </span>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-[0.9rem] border border-ink/[0.12] bg-white px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/40 focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)] disabled:opacity-60";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-bold text-ink/70">{label}</span>
      {children}
      {hint && <span className="text-[0.6875rem] leading-snug text-ink/50">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, "pr-8", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "h-auto min-h-[5.5rem] py-2.5 leading-relaxed", props.className)} />;
}

/** Interruptor accesible (role="switch"). */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span aria-hidden className="block h-7 w-12 rounded-full bg-ink/15 transition-colors duration-300 peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-forest peer-focus-visible:ring-offset-2" />
        <span
          aria-hidden
          className="absolute left-1 top-1 size-5 rounded-full bg-white shadow-[0_2px_6px_hsl(var(--shade)/0.3)] transition-transform duration-300 [transition-timing-function:var(--ease-pop)] peer-checked:translate-x-5 peer-checked:bg-lime"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="block text-xs leading-snug text-ink/55">{description}</span>}
      </span>
    </label>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "lime" | "ink" | "muted" | "danger" | "mint" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold",
        tone === "lime" && "bg-lime text-ink",
        tone === "ink" && "bg-ink text-white",
        tone === "muted" && "bg-ink/[0.07] text-ink/75",
        tone === "danger" && "bg-destructive/10 text-destructive",
        tone === "mint" && "bg-mint text-ink ring-1 ring-inset ring-ink/[0.08]"
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "ink",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "ink" | "soft" | "lime" | "danger" }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        variant === "ink" && "bg-ink text-white hover:bg-forest",
        variant === "soft" && "bg-ink/[0.06] text-ink hover:bg-ink hover:text-white",
        variant === "lime" && "bg-lime text-ink hover:bg-ink hover:text-lime",
        variant === "danger" && "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

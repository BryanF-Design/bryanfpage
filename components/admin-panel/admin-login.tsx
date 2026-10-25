"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

/** Acceso a Panel BryanF: usuario y contraseña del administrador. */
export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "No se pudo iniciar sesión.");
        return;
      }
      router.refresh();
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "h-12 w-full rounded-full border border-ink/[0.12] bg-white px-5 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/45 focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)]";

  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-[100dvh] place-items-center p-[var(--gutter)]">
      <div className="panel relative w-full max-w-md p-6 shadow-soft sm:p-8">
        <ThemeToggle className="absolute right-5 top-5" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/brand/logo-dark.png" alt="BryanF Design" width={180} height={63} className="logo-invert h-9 w-auto" />
        <h1 className="display-title mt-6 text-3xl text-ink">Panel BryanF</h1>
        <p className="mt-2 text-sm text-ink/65">Panel privado: suscriptores, cobros y próximas mensualidades.</p>

        {!configured && (
          <p className="mt-5 rounded-[1.1rem] bg-lime/40 px-4 py-3 text-sm font-medium text-ink">
            El panel está apagado. Agrega <code className="font-bold">ADMIN_USER</code> y{" "}
            <code className="font-bold">ADMIN_PASSWORD</code> (mínimo 12 caracteres) en las variables de entorno de
            Vercel y vuelve a desplegar.
          </p>
        )}

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Usuario
            <input
              className={field}
              name="username"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Contraseña
            <input
              className={field}
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p role="alert" className="text-sm font-semibold text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" variant="ink" disabled={loading || !configured} className="mt-2 justify-between pl-5 pr-2">
            <span className="inline-flex items-center gap-2">
              {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Lock aria-hidden className="h-4 w-4" />}
              Entrar
            </span>
            <ButtonArrow />
          </Button>
        </form>
      </div>
    </main>
  );
}

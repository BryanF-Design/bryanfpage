import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NotFoundContent } from "@/components/not-found-content";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/locales";

// El visitante ya eligió idioma antes de toparse con un 404 (cookie del
// switcher o del auto-detect de geo en el middleware) — la pestaña del
// navegador también debería reflejarlo, no quedarse en español fijo.
export function generateMetadata(): Metadata {
  const stored = cookies().get("bryanf_lang")?.value;
  const locale = isLocale(stored) ? stored : "es";
  const t = DICTIONARIES[locale].notFound;

  return {
    title: `${t.errorLabel} — ${t.title} ${t.titleHighlight}`,
    description: t.subtitle,
    robots: { index: false, follow: true },
  };
}

export default function NotFound() {
  return <NotFoundContent />;
}

"use client";

import { usePathname } from "next/navigation";

import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";

export function SkipLink() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const localizedPage = pathname === "/" || pathname === "/crear-web";
  const label = localizedPage ? t.nav.skipToContent : DICTIONARIES.es.nav.skipToContent;

  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[250] inline-flex min-h-11 -translate-y-24 items-center rounded-sm border border-primary bg-background px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary transition-transform focus:translate-y-0"
    >
      {label}
    </a>
  );
}

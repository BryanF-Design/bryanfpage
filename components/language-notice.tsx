"use client";

import { useEffect, useState } from "react";
import { Globe, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/lib/i18n/context";

const DISMISS_COOKIE = "bryanf_lang_notice_dismissed";
// El aviso es informativo, no un consentimiento: se cierra solo a los 10s
// para no estorbar (sobre todo en móvil, donde compite con los botones
// flotantes de accesibilidad y chat).
const AUTO_DISMISS_MS = 10_000;

function isDismissed() {
  return typeof document !== "undefined" && document.cookie.includes(`${DISMISS_COOKIE}=1`);
}

export function LanguageNotice() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [configuratorInView, setConfiguratorInView] = useState(false);

  useEffect(() => {
    if (document.querySelector('main[data-language="es-only"]')) {
      setVisible(false);
      return;
    }

    const showTimer = window.setTimeout(() => {
      if (!isDismissed()) setVisible(true);
    }, 1200);
    const hideTimer = window.setTimeout(() => {
      if (!isDismissed()) {
        setVisible(false);
        markDismissed();
      }
    }, 1200 + AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  useEffect(() => {
    const configurator = document.getElementById("precios");
    if (!configurator) return;

    const observer = new IntersectionObserver(
      ([entry]) => setConfiguratorInView(entry.isIntersecting),
      { rootMargin: "-12% 0px -12% 0px", threshold: 0.05 }
    );
    observer.observe(configurator);
    return () => observer.disconnect();
  }, []);

  function markDismissed() {
    document.cookie = `${DISMISS_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  function dismiss() {
    setVisible(false);
    markDismissed();
  }

  if (!visible || configuratorInView) return null;

  return (
    // Móvil: tarjeta sobre la fila de accesibilidad/Lumina. Desktop: tarjeta
    // a la derecha del botón de accesibilidad, sin encimarse con él.
    <div
      className="glass fixed inset-x-3 bottom-[calc(5.5rem_+_env(safe-area-inset-bottom))] z-[115] flex items-start gap-3 rounded-xl border border-border p-3 shadow-xl md:inset-x-auto md:bottom-5 md:left-24 md:max-w-md md:p-4"
    >
      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p
        role="status"
        className="flex-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs"
      >
        {t.languageNotice.text}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="min-h-11 shrink-0 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {t.languageNotice.dismiss}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.lumina.close}
        className="absolute -right-3 -top-3 hidden h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:flex"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

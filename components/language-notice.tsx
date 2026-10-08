"use client";

import { useEffect, useState } from "react";
import { Globe, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/lib/i18n/context";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";

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
  const configuratorInView = useConfiguratorInView();
  const [chatOpen, setChatOpen] = useState(false);

  // The mobile Lumina chat is a full-screen sheet at the same bottom edge —
  // step aside while it's open instead of covering its input on top of it.
  useEffect(() => {
    function onChatVisibility(e: Event) {
      setChatOpen(!!(e as CustomEvent<{ open?: boolean }>).detail?.open);
    }
    window.addEventListener("lumina:visibility", onChatVisibility);
    return () => window.removeEventListener("lumina:visibility", onChatVisibility);
  }, []);

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

  function markDismissed() {
    document.cookie = `${DISMISS_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  function dismiss() {
    setVisible(false);
    markDismissed();
  }

  if (!visible || configuratorInView || chatOpen) return null;

  return (
    // Móvil: tarjeta sobre la fila de accesibilidad/Lumina. Desktop: tarjeta
    // a la derecha del botón de accesibilidad, sin encimarse con él.
    <div
      className="px-window fixed bottom-[calc(var(--fab-edge)+var(--fab-size)+var(--fab-gap))] left-3 right-[calc(var(--fab-size)+1.5rem)] z-[115] flex items-center gap-3 p-2.5 pl-3 md:bottom-[var(--fab-edge)] md:left-[calc(var(--fab-size)+2.5rem)] md:right-auto md:max-w-md md:p-4"
    >
      <Globe className="hidden h-4 w-4 shrink-0 text-primary sm:block" aria-hidden />
      <p
        role="status"
        className="line-clamp-3 flex-1 text-[11px] leading-snug text-muted-foreground sm:line-clamp-none sm:text-xs sm:leading-relaxed"
      >
        {t.languageNotice.text}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="btn-px min-h-11 shrink-0 bg-primary px-3 pb-[3px] font-display text-[1.1rem] uppercase leading-none text-primary-foreground"
      >
        {t.languageNotice.dismiss}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.lumina.close}
        className="hidden h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

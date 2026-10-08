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
    <div className="fixed bottom-[calc(var(--fab-edge)+var(--fab-size)+var(--fab-gap))] left-3 right-[calc(var(--fab-size)+1.5rem)] z-[115] flex items-center gap-3 rounded-card bg-white p-2.5 pl-3 text-ink shadow-float ring-1 ring-ink/[0.06] sm:left-6 sm:right-[calc(var(--fab-size)+2.25rem)] md:bottom-[var(--fab-edge)] md:left-[calc(var(--fab-size)+2.5rem)] md:right-auto md:max-w-[36rem] md:gap-4 md:p-3 md:pl-3.5">
      <span
        aria-hidden
        className="hidden size-10 shrink-0 place-items-center rounded-full bg-ink text-lime sm:grid"
      >
        <Globe className="h-[1.1rem] w-[1.1rem]" />
      </span>
      <p
        role="status"
        className="line-clamp-3 flex-1 text-xs leading-snug text-ink/70 sm:line-clamp-none sm:text-[0.8125rem] sm:leading-relaxed"
      >
        {t.languageNotice.text}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-lime px-4 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
      >
        {t.languageNotice.dismiss}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.lumina.close}
        className="hidden size-11 shrink-0 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/[0.06] hover:text-ink md:flex"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Globe, X } from "lucide-react";

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
  const [visible, setVisible] = useState(false);
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
  }, []);

  function markDismissed() {
    document.cookie = `${DISMISS_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  function dismiss() {
    setVisible(false);
    markDismissed();
  }

  if (!visible || chatOpen) return null;

  return (
    // Móvil: hoja inferior de borde a borde (encima de los botones flotantes,
    // nunca flotando a media pantalla sobre el contenido). Desktop: tarjeta
    // a la derecha del botón de accesibilidad, sin encimarse con él.
    <div
      role="status"
      className="glass fixed inset-x-0 bottom-0 z-[125] flex items-start gap-3 rounded-t-xl border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:inset-x-auto sm:bottom-5 sm:left-24 sm:max-w-md sm:rounded-lg sm:border sm:pb-4"
    >
      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="flex-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
        {t.languageNotice.text}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
      >
        {t.languageNotice.dismiss}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.lumina.close}
        className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground sm:flex"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

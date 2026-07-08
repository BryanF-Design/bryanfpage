"use client";

import { useEffect, useState } from "react";
import { Globe, X } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";

const DISMISS_COOKIE = "bryanf_lang_notice_dismissed";

function isDismissed() {
  return typeof document !== "undefined" && document.cookie.includes(`${DISMISS_COOKIE}=1`);
}

export function LanguageNotice() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isDismissed()) setVisible(true);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    document.cookie = `${DISMISS_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      className="glass fixed inset-x-4 bottom-4 z-[110] mx-auto flex max-w-md items-start gap-3 rounded-2xl p-4 shadow-xl sm:left-4 sm:right-auto"
    >
      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{t.languageNotice.text}</p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
      >
        {t.languageNotice.dismiss}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.lumina.close}
        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

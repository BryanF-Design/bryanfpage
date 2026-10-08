"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

/** Sección donde ocurrió el clic: el id más cercano o el landmark. */
function locationOf(el: Element) {
  const section = el.closest("[id]");
  if (section?.id) return section.id;
  const landmark = el.closest("header, footer, nav, main");
  return landmark ? landmark.tagName.toLowerCase() : "page";
}

function labelOf(el: HTMLElement) {
  return (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
}

/**
 * Un solo listener delegado mide las conversiones de todo el sitio, sin
 * tocar cada botón: WhatsApp, correo y teléfono como `generate_lead`, y los
 * CTA que llevan al cotizador como `cta_click`. Los clics salientes ya los
 * mide la medición mejorada de GA4.
 */
export function ClickTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const location = locationOf(link);
      const service = link.dataset.trackService;

      if (/wa\.me|whatsapp\.com/i.test(href)) {
        trackEvent("generate_lead", { method: "whatsapp", location, service });
      } else if (href.startsWith("mailto:")) {
        trackEvent("generate_lead", { method: "email", location });
      } else if (href.startsWith("tel:")) {
        trackEvent("generate_lead", { method: "phone", location });
      } else if (/#precios|\/crear-web/.test(href)) {
        trackEvent("cta_click", { cta_text: labelOf(link), cta_href: href, location });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

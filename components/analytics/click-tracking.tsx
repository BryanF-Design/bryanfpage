"use client";

import { useEffect } from "react";

import { trackAdsConversion, trackEvent } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

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
 *
 * También guarda, al aterrizar, los datos de campaña de la URL (gclid, utm_*)
 * para adjuntarlos después al cobro y a la solicitud de cotización.
 */
export function ClickTracking() {
  useEffect(() => {
    captureAttribution();

    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const location = locationOf(link);
      const service = link.dataset.trackService;

      if (/wa\.me|whatsapp\.com/i.test(href)) {
        trackEvent("generate_lead", { method: "whatsapp", location, service });
        trackAdsConversion("whatsapp");
      } else if (href.startsWith("mailto:")) {
        trackEvent("generate_lead", { method: "email", location });
      } else if (href.startsWith("tel:")) {
        trackEvent("generate_lead", { method: "phone", location });
      } else if (/#precios|#cotizacion|\/crear-web/.test(href)) {
        trackEvent("cta_click", { cta_text: labelOf(link), cta_href: href, location });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

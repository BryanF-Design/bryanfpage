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

/** Enlaces internos que cuentan como CTA: cotizador, contacto y pago. */
const CTA_HREF = /#precios|\/crear-web|\/contacto(?:$|[#?])/;

/**
 * Un solo listener delegado mide las conversiones de todo el sitio, sin
 * tocar cada botón:
 *  - WhatsApp, correo y teléfono → `generate_lead` (con `method`).
 *  - Enlaces al cotizador, a /contacto o cualquier elemento con
 *    `data-track-cta` → `cta_click`.
 * El envío del brief (`brief_submit`) y la compra (`purchase`) se miden en
 * public/gracias.html. Los clics salientes ya los mide la medición mejorada
 * de GA4.
 */
export function ClickTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;

      // Botones (no enlaces) marcados como CTA.
      const marked = target?.closest<HTMLElement>("[data-track-cta]");
      if (marked && !marked.matches("a[href]")) {
        trackEvent("cta_click", {
          cta_text: marked.dataset.trackCta || labelOf(marked),
          location: locationOf(marked),
        });
        return;
      }

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
      } else if (CTA_HREF.test(href) || link.hasAttribute("data-track-cta")) {
        trackEvent("cta_click", { cta_text: labelOf(link), cta_href: href, location });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

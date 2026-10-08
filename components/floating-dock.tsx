"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { PixelIcon } from "@/components/ui/pixel-icon";
import { useLanguage } from "@/lib/i18n/context";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
import { useFooterInView } from "@/lib/use-footer-in-view";

const WHATSAPP_URL = "https://wa.me/525663012505";

/**
 * Mandos flotantes que acompañan a Lumina y a Accesibilidad:
 *  - WhatsApp, arriba del chat (o en su lugar donde no hay chat).
 *  - "Volver arriba", arriba del botón de accesibilidad, solo después de
 *    recorrer una pantalla y solo desde tableta: en el teléfono la esquina
 *    inferior ya tiene dos mandos por lado y basta con tocar la barra.
 * Se apartan cuando el footer (que repite los contactos) o el cotizador
 * (donde están los botones de pago) ocupan la pantalla, y mientras el chat
 * está abierto. Entran y salen solo con transform + opacity.
 */
export function FloatingDock() {
  const { t } = useLanguage();
  const footerInView = useFooterInView();
  const configuratorInView = useConfiguratorInView();
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    function onChatVisibility(e: Event) {
      setChatOpen(!!(e as CustomEvent<{ open?: boolean }>).detail?.open);
    }
    window.addEventListener("lumina:visibility", onChatVisibility);
    return () => window.removeEventListener("lumina:visibility", onChatVisibility);
  }, []);

  const hideWhatsapp = footerInView || configuratorInView || chatOpen;
  const hideTop = !scrolled || footerInView || chatOpen;

  return (
    <>
      <div
        className="fab-slot fab-shadow fixed bottom-[calc(var(--fab-edge)+var(--lumina-fab,0px))] right-3 z-[119] sm:right-6"
        data-hidden={hideWhatsapp}
      >
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          tabIndex={hideWhatsapp ? -1 : 0}
          className="fab fab-wa"
        >
          <FaWhatsapp aria-hidden className="h-6 w-6" />
          <span className="fab-label hidden pr-1.5 xl:inline">WhatsApp</span>
        </a>
      </div>

      <div
        className="fab-slot fab-shadow fixed bottom-[calc(var(--fab-edge)+var(--fab-size)+var(--fab-gap))] left-3 z-[119] hidden sm:left-6 sm:block"
        data-hidden={hideTop}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label={t.nav.backToTop}
          tabIndex={hideTop ? -1 : 0}
          className="fab"
        >
          <PixelIcon name="arrowUp" className="h-5 w-5 text-primary" />
        </button>
      </div>
    </>
  );
}

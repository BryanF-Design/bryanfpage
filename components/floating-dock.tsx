"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useLanguage } from "@/lib/i18n/context";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
import { useFooterInView } from "@/lib/use-footer-in-view";

const WHATSAPP_URL = "https://wa.me/525663012505";

/**
 * Dock de contacto: una sola píldora tinta, arriba del botón de Lumina, con
 * WhatsApp (icono lima) y, desde tableta, "volver arriba". No aparece hasta
 * dejar atrás el hero (ahí estorbaría a la tarjeta destacada) y se aparta
 * cuando el footer (que repite los contactos), el cotizador (botones de pago)
 * o el chat ocupan la pantalla. Entra y sale solo con transform + opacity.
 *
 * Además coordina a todos los botones flotantes (Lumina y Accesibilidad
 * incluidos) con dos clases en <html>, solo en teléfono:
 *  - `fab-tucked`: al bajar se esconden y vuelven al subir, para no tapar los
 *    CTA y controles pegados al borde derecho.
 *  - `fab-config`: dentro del cotizador se aparta Lumina (el dock ya se
 *    esconde ahí por su cuenta).
 */
export function FloatingDock() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const footerInView = useFooterInView();
  const configuratorInView = useConfiguratorInView();
  const [pastHero, setPastHero] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // ¿Ya quedó atrás el hero? En el home se observa #home; en las demás
  // páginas basta con haber bajado más de media pantalla.
  useEffect(() => {
    const hero = document.getElementById("home");
    if (hero) {
      const observer = new IntersectionObserver(([entry]) =>
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      setPastHero(window.scrollY > window.innerHeight * 0.6);
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
  }, [pathname]);

  // Teléfono: al bajar se guardan todos los botones flotantes; al subir (o
  // cerca del inicio) vuelven. No se guardan con un panel flotante abierto.
  useEffect(() => {
    const root = document.documentElement;
    // Teléfono, tableta y cualquier pantalla táctil: los flotantes se guardan
    // al bajar. En escritorio ancho con mouse se quedan fijos.
    const phone = window.matchMedia("(max-width: 1279px), (pointer: coarse)");
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 10) return;
      lastY = y;
      const tuck =
        phone.matches &&
        delta > 0 &&
        y > window.innerHeight * 0.5 &&
        !document.querySelector('.fab-slot [aria-expanded="true"]');
      root.classList.toggle("fab-tucked", tuck);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPhoneChange = () => {
      if (!phone.matches) root.classList.remove("fab-tucked");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    phone.addEventListener("change", onPhoneChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      phone.removeEventListener("change", onPhoneChange);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("fab-tucked");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("fab-config", configuratorInView);
    return () => root.classList.remove("fab-config");
  }, [configuratorInView]);

  useEffect(() => {
    function onChatVisibility(e: Event) {
      setChatOpen(!!(e as CustomEvent<{ open?: boolean }>).detail?.open);
    }
    window.addEventListener("lumina:visibility", onChatVisibility);
    return () => window.removeEventListener("lumina:visibility", onChatVisibility);
  }, []);

  const hidden = !pastHero || footerInView || configuratorInView || chatOpen;

  return (
    <div
      className="fab-slot fixed bottom-[calc(var(--fab-edge)+var(--lumina-fab,0px))] right-3 z-[119] sm:right-6"
      data-hidden={hidden}
    >
      <div className="fab-dock">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          tabIndex={hidden ? -1 : 0}
          className="fab-dock-btn fab-wa inline-flex"
        >
          <FaWhatsapp aria-hidden className="h-[1.375rem] w-[1.375rem]" />
          <span className="fab-label hidden pr-1.5 xl:inline">WhatsApp</span>
        </a>
        {/* En teléfono basta con tocar la barra de estado para subir. */}
        <span aria-hidden className="hidden h-6 w-px bg-white/15 sm:block" />
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label={t.nav.backToTop}
          tabIndex={hidden ? -1 : 0}
          className="fab-dock-btn hidden sm:inline-flex"
        >
          <ArrowUp aria-hidden className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

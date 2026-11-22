"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, SlidersHorizontal, Tag } from "lucide-react";

import { FaWhatsapp } from "@/components/ui/wa-icon";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = `https://wa.me/525663012505?text=${encodeURIComponent("Hola, quiero mi página desde $2,000.")}`;

/**
 * Auditoría P2-4 · Barra inferior tipo app, SOLO en teléfono (<768 px):
 * Inicio · Casos · Precios · Configurador (al centro, destacado) · WhatsApp.
 * 64 px + safe-area, blanco con blur y borde sutil; activo en lima con punto.
 * Lumina flota encima (bottom 88 px, vía --fab-edge) y el botón de
 * accesibilidad se oculta en teléfono. Se esconde con el teclado abierto y
 * no aparece en /cv ni /tarjeta (tienen su propia barra).
 */
export function MobileTabBar() {
  const { t } = useLanguage();
  const pathname = usePathname() ?? "/";
  const [hash, setHash] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const off = pathname.startsWith("/cv") || pathname.startsWith("/tarjeta");

  useEffect(() => {
    const root = document.documentElement;
    if (off) {
      root.classList.remove("has-tabbar");
      return;
    }
    root.classList.add("has-tabbar");
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    // Teclado abierto: el visual viewport se encoge mucho más que la ventana.
    const vv = window.visualViewport;
    const onVV = () => {
      if (!vv) return;
      const open = vv.height < window.innerHeight * 0.75;
      setKeyboard(open);
      root.classList.toggle("tabbar-hidden", open);
    };
    vv?.addEventListener("resize", onVV);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      vv?.removeEventListener("resize", onVV);
      root.classList.remove("has-tabbar", "tabbar-hidden");
    };
  }, [off]);

  if (off) return null;

  const isHome = pathname === "/";
  const items = [
    { href: "/", label: t.nav.inicio, Icon: Home, active: isHome && hash !== "#precios" },
    { href: "/casos", label: t.v2.nav.casos, Icon: LayoutGrid, active: pathname.startsWith("/casos") },
    { href: "/crear-web", label: t.nav.armaTuWeb, Icon: SlidersHorizontal, active: pathname.startsWith("/crear-web"), center: true },
    { href: "/#precios", label: t.nav.precios, Icon: Tag, active: isHome && hash === "#precios" },
  ];
  // Orden de la auditoría: Inicio, Casos, Precios, Configurador (centro), WhatsApp.
  const ordered = [items[0], items[1], items[3], items[2]];

  return (
    <nav
      aria-label={t.nav.inicio}
      data-hidden={keyboard}
      className="mobile-tabbar fixed inset-x-0 bottom-0 z-[117] border-t border-ink/[0.08] bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5 items-end px-1">
        {ordered.map(({ href, label, Icon, active, center }) => (
          <li key={href} className="flex justify-center">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              data-track-cta={`tabbar_${href.replace(/\W+/g, "") || "inicio"}`}
              className={cn(
                "group relative flex min-h-12 min-w-12 flex-col items-center justify-end gap-0.5 pb-2 text-[11px] font-semibold leading-none transition-transform active:scale-[0.97]",
                active ? "text-ink" : "text-ink/60"
              )}
            >
              {center ? (
                <span className="mb-0.5 grid size-14 -translate-y-3 place-items-center rounded-full bg-lime text-ink shadow-[0_10px_24px_-10px_hsl(var(--ink)/0.55)] ring-4 ring-white">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
              ) : (
                <span className={cn("grid size-8 place-items-center rounded-full transition-colors", active && "bg-lime")}>
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
              )}
              <span className={cn("max-w-[4.5rem] truncate", center && "-mt-3")}>{label}</span>
              {active && !center && <span aria-hidden className="absolute bottom-0.5 size-1 rounded-full bg-lime-deep" />}
            </Link>
          </li>
        ))}
        <li className="flex justify-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track-service="whatsapp_tabbar"
            className="flex min-h-12 min-w-12 flex-col items-center justify-end gap-0.5 pb-2 text-[11px] font-semibold leading-none text-ink/60 transition-transform active:scale-[0.97]"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[#25D366] text-white">
              <FaWhatsapp aria-hidden className="h-[1.1rem] w-[1.1rem]" />
            </span>
            WhatsApp
          </a>
        </li>
      </ul>
    </nav>
  );
}

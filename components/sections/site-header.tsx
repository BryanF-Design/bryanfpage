"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

/**
 * Barra técnica de borde a borde: hairline inferior, navegación en mono
 * mayúsculas — la primera línea del "plano de obra" en todas las páginas.
 */
export function SiteHeader() {
  const { t } = useLanguage();
  const links = [
    { label: t.nav.proceso, href: "/#proceso" },
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-[100] border-b border-border">
      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex shrink-0 items-center" aria-label="BryanF Design — inicio">
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            priority
            style={{ height: 36, width: "auto" }}
            className="object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
            <Link href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              {t.nav.cliente}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/#precios">{t.nav.armaTuWeb}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

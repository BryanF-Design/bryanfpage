"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

export function SiteHeader() {
  const { t } = useLanguage();
  const links = [
    { label: t.nav.proceso, href: "/#proceso" },
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4">
      <div className="glass-nav relative flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 px-5 py-3 shadow-lg shadow-black/30">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/[0.04]" />
        <Link href="/" className="flex items-center" aria-label="BryanF Design — inicio">
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            priority
            style={{ height: 42, width: "auto" }}
            className="object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <Button asChild size="sm" variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              {t.nav.cliente}
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/#precios">{t.nav.armaTuWeb}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

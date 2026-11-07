"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";

// Igual que en el inicio: el chat no tiene contenido para buscadores.
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

/**
 * Armazón de las páginas a las que se movieron secciones del inicio: el
 * mismo header, pie y chat de Lumina (sus botones lo abren desde aquí).
 */
export function SubPageShell({
  children,
  jsonLd,
}: {
  children: ReactNode;
  jsonLd?: Record<string, unknown>[];
}) {
  return (
    <>
      {jsonLd?.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="sheet-main">
        {children}
      </main>
      <LuminaChat />
      <SiteFooter />
    </>
  );
}

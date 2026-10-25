"use client";

import dynamic from "next/dynamic";

// Lumina en las páginas de servicio (componentes de servidor): solo cliente,
// sin contenido SEO. La conversación sigue donde se quedó (sessionStorage).
export const LuminaChatLazy = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

import type { MetadataRoute } from "next";

import { SITE_URL, servicePages } from "@/lib/seo/service-pages";

/**
 * Sitemap del sitio tal como está publicado. `lastModified` es honesto: cada
 * URL lleva la fecha de su último cambio real de contenido (una fecha nueva
 * en cada petición haría creer a Google que todo cambió siempre).
 *
 * - 2026-11-07: pasada de copy y SEO (inicio, landings de servicio,
 *   cotizador, Barber OS y las páginas que salieron del inicio).
 * - /gracias no va: es la página posterior al pago y lleva noindex.
 * - Las URLs .html heredadas y /fundador redirigen (next.config.mjs).
 */
const COPY_PASS = new Date("2026-11-07T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: COPY_PASS, changeFrequency: "weekly", priority: 1 },
    // Cotizador con URL propia: arma y paga tu web.
    {
      url: `${SITE_URL}/crear-web`,
      lastModified: COPY_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Landings de servicio (lib/seo/service-pages.ts).
    ...servicePages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: COPY_PASS,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    // Barber OS: sistema de reservas y lealtad para barberías.
    {
      url: `${SITE_URL}/sistema-para-barberias`,
      lastModified: COPY_PASS,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // Páginas que salieron del inicio: contacto (con todas las preguntas
    // frecuentes), casos completos, Bryan y Lumina.
    { url: `${SITE_URL}/contacto`, lastModified: COPY_PASS, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/casos`, lastModified: COPY_PASS, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/conoceme`, lastModified: COPY_PASS, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/lumina`, lastModified: COPY_PASS, changeFrequency: "monthly", priority: 0.7 },
    // Tarjeta digital: fuera de la navegación, se comparte por QR o enlace.
    {
      url: `${SITE_URL}/tarjeta`,
      lastModified: new Date("2026-10-28T00:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // CV interactivo: carta de presentación en 7 idiomas, guiada por Lumina.
    {
      url: `${SITE_URL}/cv`,
      lastModified: new Date("2026-11-05T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}

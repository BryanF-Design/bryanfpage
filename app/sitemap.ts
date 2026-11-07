import type { MetadataRoute } from "next";

import { SITE_URL, servicePages } from "@/lib/seo/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod truthful: only pages changed in this release receive the
  // release date. A fresh Date() on every request falsely marks every URL.
  // 2026-10-08: dominio www.bryanfdesign.com y rediseño 8-bit de todo el sitio.
  const releaseDate = new Date("2026-10-08T00:00:00.000Z");

  return [
    { url: SITE_URL, lastModified: releaseDate, changeFrequency: "weekly", priority: 1 },
    ...servicePages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: releaseDate,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    {
      url: `${SITE_URL}/crear-web`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Barber OS: sistema de reservas y lealtad para barberías (prueba de 14 días).
    {
      url: `${SITE_URL}/sistema-para-barberias`,
      lastModified: new Date("2026-11-07T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // Secciones que se mudaron del inicio a su propia página (2026-11-07).
    ...["/conoceme", "/lumina", "/contacto", "/casos"].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date("2026-11-07T00:00:00.000Z"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
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

import type { MetadataRoute } from "next";

import { SITE_URL, servicePages } from "@/lib/seo/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod truthful: only pages changed in this release receive the
  // release date. A fresh Date() on every request falsely marks every URL.
  // 2026-10-08: dominio www.bryanfdesign.com y rediseño 8-bit de todo el sitio.
  const releaseDate = new Date("2026-10-08T00:00:00.000Z");
  const restructureDate = new Date("2026-10-15T00:00:00.000Z");

  return [
    { url: SITE_URL, lastModified: restructureDate, changeFrequency: "weekly", priority: 1 },
    ...servicePages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: releaseDate,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    // 2026-10-15: el sitio se dividió en subpáginas y llegó la suscripción.
    {
      url: `${SITE_URL}/suscripcion`,
      lastModified: restructureDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/conoce-a-bryan`,
      lastModified: restructureDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/lumina`,
      lastModified: restructureDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/crear-web`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, lastModified: restructureDate, changeFrequency: "yearly", priority: 0.3 },
  ];
}

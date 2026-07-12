import type { MetadataRoute } from "next";

import { SITE_URL, servicePages } from "@/lib/seo/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod truthful: only pages changed in this release receive the
  // release date. A fresh Date() on every request falsely marks every URL.
  const releaseDate = new Date("2026-07-12T00:00:00.000Z");

  return [
    { url: SITE_URL, lastModified: releaseDate, changeFrequency: "weekly", priority: 1 },
    ...servicePages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: releaseDate,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    { url: `${SITE_URL}/crear-web`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}

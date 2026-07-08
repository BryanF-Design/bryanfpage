import type { MetadataRoute } from "next";

import { SITE_URL, servicePages } from "@/lib/seo/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...servicePages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    { url: `${SITE_URL}/crear-web`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacidad`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}

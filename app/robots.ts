import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/service-pages";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Endpoints de pago, chat y webhooks: no son páginas. /admin y
      // /mi-panel son paneles privados (además llevan noindex).
      disallow: ["/api/", "/admin", "/mi-panel"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

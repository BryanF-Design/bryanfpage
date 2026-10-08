import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/service-pages";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Endpoints de pago, chat y webhooks: no son páginas.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

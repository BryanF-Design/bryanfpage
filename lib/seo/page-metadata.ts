import type { Metadata } from "next";

import { BRAND_NAME } from "@/lib/seo/service-pages";

/** Metadatos de las páginas propias del sitio (mismo formato que las landings). */
export function createPageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName: BRAND_NAME,
      url: path,
      title,
      description,
      images: [
        {
          url: "/img/og-bryanf-apex.png",
          width: 1200,
          height: 630,
          alt: `${BRAND_NAME}: Haz que pase`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/img/og-bryanf-apex.png"],
    },
    robots: { index: true, follow: true },
  };
}

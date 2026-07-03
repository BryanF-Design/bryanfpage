import type { MetadataRoute } from "next";

const BASE = "https://www.bryanfdesign.com.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/crear-web`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terminos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}

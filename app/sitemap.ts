import type { MetadataRoute } from "next";

const BASE = "https://www.bryanfdesign.com.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/crear-web`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacidad`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terminos`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BryanF Design — Diseño y desarrollo web en México",
    short_name: "BryanF Design",
    description:
      "Páginas web rápidas, animadas y pensadas para vender. Arma tu web y paga en línea.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "es-MX",
    background_color: "#0a1210",
    theme_color: "#e6e9de",
    categories: ["business", "design", "productivity"],
    icons: [
      { src: "/img/favicon.png", sizes: "256x256", type: "image/png", purpose: "any" },
    ],
  };
}

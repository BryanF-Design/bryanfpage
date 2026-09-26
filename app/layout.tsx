import type { Metadata, Viewport } from "next";
import {
  Instrument_Sans,
  IBM_Plex_Mono,
  Sofia_Sans_Extra_Condensed,
} from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { LanguageProvider } from "@/lib/i18n/context";
import { MotionPreferenceProvider } from "@/components/motion-preference-provider";
import { SkipLink } from "@/components/skip-link";

// Client-only widget, no SEO content: skip SSR entirely to shave initial payload.
const AccessibilityPanel = dynamic(
  () => import("@/components/accessibility-panel").then((m) => m.AccessibilityPanel),
  { ssr: false }
);
const LanguageNotice = dynamic(
  () => import("@/components/language-notice").then((m) => m.LanguageNotice),
  { ssr: false }
);

// Cuerpo: Instrument Sans (variable, un solo archivo).
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display: grotesca extra condensada de peso variable. Los titulares se
// componen como rótulos de carrera — altos, apretados y en mayúsculas — para
// que la hoja bento se lea a distancia, igual que los pósters de referencia.
const sofiaCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "variable",
});

// Voz técnica: etiquetas, precios, coordenadas.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bryanfdesign.com.mx"),
  title: {
    default: "Crea tu Página Web en México | BryanF Design",
    // Service metadata already owns its complete title. A global suffix
    // duplicated the brand and pushed several titles past the useful SERP width.
    template: "%s",
  },
  description:
    "¿Buscas crear una página web para tu negocio? Diseño y desarrollo web a medida en México: sitios rápidos, animados y pensados para vender. Entrega desde 3 días. Haz que pase.",
  keywords: [
    "crear una página web",
    "crear pagina web",
    "diseño web",
    "diseño web México",
    "desarrollo web",
    "desarrollo web México",
    "página web para mi negocio",
    "landing page",
    "e-commerce",
    "SEO",
    "BryanF Design",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://www.bryanfdesign.com.mx",
    siteName: "BryanF Design",
    title: "Crea tu Página Web en México | BryanF Design",
    description:
      "Diseño y desarrollo web a medida: sitios rápidos, animados y orientados a conversión. Arma tu web y arrancamos.",
    images: [
      {
        url: "/img/og-bryanf-apex.png",
        width: 1200,
        height: 630,
        alt: "BryanF Design — Haz que pase. Precisión, ritmo y conexión.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crea tu Página Web en México | BryanF Design",
    description:
      "Diseño y desarrollo web a medida: sitios rápidos, animados y orientados a conversión.",
    images: ["/img/og-bryanf-apex.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  // El color de la hoja washi: la barra del navegador continúa el marco.
  themeColor: "#e6e9de",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.bryanfdesign.com.mx/#organization",
  name: "BryanF Design",
  description:
    "Estudio de diseño y desarrollo web en México. Creamos páginas web rápidas, animadas y orientadas a conversión para negocios que quieren vender más en línea.",
  url: "https://www.bryanfdesign.com.mx",
  email: "bryanf@bryanfdesign.com.mx",
  telephone: "+525663012505",
  image: "https://www.bryanfdesign.com.mx/img/logotipo-blanco.png",
  priceRange: "Desde $3,500 MXN",
  areaServed: ["MX", "ES", "FR"],
  knowsLanguage: ["es", "en"],
  sameAs: [
    "https://www.instagram.com/bryanf_design/",
    "https://www.facebook.com/share/1R1rS2ToKf/",
    "https://www.linkedin.com/in/bryanfdesigner",
    "https://github.com/BryanF-Design",
  ],
};

// El panel completo se hidrata de forma diferida, pero la preferencia de
// movimiento debe existir antes del primer frame para evitar animaciones
// iniciales en visitas posteriores.
const a11yBootstrap = `
  try {
    var saved = JSON.parse(localStorage.getItem("bfd-a11y") || "{}");
    if (saved.reduceMotion === true) {
      document.documentElement.classList.add("a11y-reduce-motion");
    }
  } catch (_) {}
`;

// Entradas de escena. Un solo IntersectionObserver para todo el sitio marca
// con `data-fx-in` cada elemento `[data-fx]` que entra en pantalla; el CSS hace
// el resto. Vive fuera de React a propósito: no depende de la hidratación, no
// re-renderiza nada y, si el script no corre, `fx-on` nunca se activa y todo
// el contenido queda visible desde el HTML inicial.
// El envoltorio observado nunca se desplaza (viajan sus hijos, ver
// globals.css); `data-fx-done` retira la transición de entrada al terminar.
const fxBootstrap = `
  (function () {
    try {
      var d = document.documentElement;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        d.classList.contains("a11y-reduce-motion");
      if (reduce || !("IntersectionObserver" in window)) return;
      d.classList.add("fx-on");
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (e.isIntersecting) {
            var el = e.target;
            el.setAttribute("data-fx-in", "");
            io.unobserve(el);
            var delay = parseFloat(getComputedStyle(el).getPropertyValue("--fx-delay")) || 0;
            setTimeout(function (node) { node.setAttribute("data-fx-done", ""); }, delay + 1300, el);
          }
        }
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
      var watch = function (root) {
        if (root.nodeType !== 1) return;
        if (root.hasAttribute("data-fx") && !root.hasAttribute("data-fx-in")) io.observe(root);
        var list = root.querySelectorAll("[data-fx]:not([data-fx-in])");
        for (var j = 0; j < list.length; j++) io.observe(list[j]);
      };
      var boot = function () {
        watch(document.body);
        new MutationObserver(function (records) {
          for (var r = 0; r < records.length; r++) {
            var added = records[r].addedNodes;
            for (var k = 0; k < added.length; k++) watch(added[k]);
          }
        }).observe(document.body, { childList: true, subtree: true });
      };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
      else boot();
    } catch (_) {
      document.documentElement.classList.remove("fx-on");
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${instrumentSans.variable} ${sofiaCondensed.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: a11yBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: fxBootstrap }} />
      </head>
      <body className="font-sans">
        <GoogleAnalytics />
        <MicrosoftClarity />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionPreferenceProvider>
          <LanguageProvider>
            <SkipLink />
            {children}
            <LanguageNotice />
          </LanguageProvider>
          <AccessibilityPanel />
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}

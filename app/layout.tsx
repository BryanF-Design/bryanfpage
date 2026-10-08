import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Jersey_15, DotGothic16 } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { ClickTracking } from "@/components/analytics/click-tracking";
import { LanguageProvider } from "@/lib/i18n/context";
import { MotionPreferenceProvider } from "@/components/motion-preference-provider";
import { SkipLink } from "@/components/skip-link";
import { SITE_URL } from "@/lib/seo/service-pages";

// Client-only widget, no SEO content: skip SSR entirely to shave initial payload.
const AccessibilityPanel = dynamic(
  () => import("@/components/accessibility-panel").then((m) => m.AccessibilityPanel),
  { ssr: false }
);
const LanguageNotice = dynamic(
  () => import("@/components/language-notice").then((m) => m.LanguageNotice),
  { ssr: false }
);
const FloatingDock = dynamic(
  () => import("@/components/floating-dock").then((m) => m.FloatingDock),
  { ssr: false }
);

// Cuerpo: Instrument Sans (variable, un solo archivo). El texto de lectura se
// queda nítido y moderno: el 8-bit vive en rótulos, botones y etiquetas.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display 8-bit: Jersey 15 es una pixel font condensada — se lee a distancia
// como un rótulo de videojuego y conserva acentos y eñes en mayúsculas.
const jersey = Jersey_15({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
  // Next no tiene métricas de respaldo para esta fuente; sin esto el build
  // avisa en cada compilación. El respaldo condensado lo da --font-display.
  adjustFontFallback: false,
});

// Voz técnica y japonés en píxel: DotGothic16 trae latín y kanji con la misma
// retícula, así que las etiquetas y los sellos hablan el mismo idioma visual.
const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

const SITE_DESCRIPTION =
  "¿Buscas crear una página web para tu negocio? Diseño y desarrollo web a medida en México: sitios rápidos, animados y pensados para vender. Entrega desde 3 días. Haz que pase.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Crea tu Página Web en México | BryanF Design",
    // Service metadata already owns its complete title. A global suffix
    // duplicated the brand and pushed several titles past the useful SERP width.
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: "BryanF Design",
  authors: [{ name: "Bryan F.", url: SITE_URL }],
  creator: "BryanF Design",
  publisher: "BryanF Design",
  category: "Diseño y desarrollo web",
  keywords: [
    "crear una página web",
    "crear pagina web",
    "diseño web",
    "diseño web México",
    "desarrollo web",
    "desarrollo web México",
    "página web para mi negocio",
    "páginas web para negocios",
    "diseño UX/UI",
    "landing page",
    "tienda en línea",
    "e-commerce",
    "SEO técnico",
    "mantenimiento web",
    "BryanF Design",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  // El color de la hoja washi: la barra del navegador continúa el marco.
  themeColor: "#e6e9de",
};

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Un solo grafo: el estudio (negocio local de servicios), el sitio y el
// catálogo con los precios reales de lib/catalog.ts.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": ORG_ID,
      name: "BryanF Design",
      alternateName: "BryanF Design Studio",
      description:
        "Estudio de diseño y desarrollo web en México. Creamos páginas web rápidas, animadas y orientadas a conversión para negocios que quieren vender más en línea.",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/logotipo-blanco.png`,
        width: 2904,
        height: 1016,
      },
      image: `${SITE_URL}/img/og-bryanf-apex.png`,
      email: "bryanf@bryanfdesign.com.mx",
      telephone: "+525663012505",
      priceRange: "Desde $3,500 MXN",
      currenciesAccepted: "MXN, USD",
      paymentAccepted: "Tarjeta de crédito, Tarjeta de débito, Mercado Pago, Transferencia bancaria",
      foundingDate: "2020",
      founder: { "@type": "Person", name: "Bryan F." },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ciudad de México",
        addressRegion: "CDMX",
        addressCountry: "MX",
      },
      geo: { "@type": "GeoCoordinates", latitude: 19.4326, longitude: -99.1332 },
      areaServed: [
        { "@type": "Country", name: "México" },
        { "@type": "Country", name: "España" },
        { "@type": "Country", name: "Francia" },
      ],
      knowsLanguage: ["es", "en"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+525663012505",
        email: "bryanf@bryanfdesign.com.mx",
        availableLanguage: ["Spanish", "English"],
        areaServed: "MX",
      },
      sameAs: [
        "https://www.instagram.com/bryanf_design/",
        "https://www.facebook.com/share/1R1rS2ToKf/",
        "https://www.linkedin.com/in/bryanfdesigner",
        "https://github.com/BryanF-Design",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de diseño y desarrollo web",
        itemListElement: [
          { name: "Desarrollo web a medida", price: 3500, url: `${SITE_URL}/desarrollo-web-mexico` },
          { name: "Actualización de sitio web", price: 1800, url: `${SITE_URL}/crear-web` },
          { name: "Mantenimiento web", price: 1000, url: `${SITE_URL}/mantenimiento-web-mexico` },
          { name: "Landing page esencial", price: 2400, url: `${SITE_URL}/paginas-web-para-negocios` },
          { name: "Kit de presencia digital", price: 1500, url: SITE_URL },
          { name: "Tarjeta de presentación digital", price: 900, url: SITE_URL },
          { name: "Tarjeta de presentación imprimible", price: 650, url: SITE_URL },
          { name: "Firma de correo profesional", price: 350, url: SITE_URL },
        ].map((service) => ({
          "@type": "Offer",
          url: service.url,
          priceCurrency: "MXN",
          price: service.price,
          itemOffered: { "@type": "Service", name: service.name, provider: { "@id": ORG_ID } },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "BryanF Design",
      description: SITE_DESCRIPTION,
      inLanguage: "es-MX",
      publisher: { "@id": ORG_ID },
    },
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
            setTimeout(function (node) { node.setAttribute("data-fx-done", ""); }, delay + 900, el);
          }
        }
      }, { rootMargin: "0px 0px -4% 0px", threshold: 0.01 });
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
      className={`dark ${instrumentSans.variable} ${jersey.variable} ${dotGothic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: a11yBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: fxBootstrap }} />
        {/* Google tag (gtag.js) */}
        <GoogleAnalytics />
        <MicrosoftClarity />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <ClickTracking />
        <MotionPreferenceProvider>
          <LanguageProvider>
            <SkipLink />
            {children}
            <LanguageNotice />
            <FloatingDock />
          </LanguageProvider>
          <AccessibilityPanel />
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}

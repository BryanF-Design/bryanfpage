import type { Metadata } from "next";
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { IntroSplash } from "@/components/intro-splash";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { LanguageProvider } from "@/lib/i18n/context";

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

// Display: Archivo variable con eje de anchura — los titulares se componen
// expandidos (font-stretch en globals.css), la voz visual del rediseño.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
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
        url: "/img/logotipo-blanco.png",
        width: 2904,
        height: 1016,
        alt: "BryanF Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crea tu Página Web en México | BryanF Design",
    description:
      "Diseño y desarrollo web a medida: sitios rápidos, animados y orientados a conversión.",
    images: ["/img/logotipo-blanco.png"],
  },
  robots: { index: true, follow: true },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${instrumentSans.variable} ${archivo.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <GoogleAnalytics />
        <MicrosoftClarity />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <IntroSplash />
        <LanguageProvider>
          {children}
          <LanguageNotice />
        </LanguageProvider>
        <AccessibilityPanel />
      </body>
    </html>
  );
}

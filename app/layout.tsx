import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { IntroSplash } from "@/components/intro-splash";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bryanfdesign.com.mx"),
  title: {
    default: "Crea tu Página Web en México | BryanF Design",
    template: "%s · BryanF Design",
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
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <GoogleAnalytics />
        <MicrosoftClarity />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <IntroSplash />
        {children}
        <AccessibilityPanel />
      </body>
    </html>
  );
}

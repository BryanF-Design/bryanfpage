import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://bryanfdesign.com.mx"),
  title: {
    default: "BryanF Design — Webs que venden, rendimiento real",
    template: "%s · BryanF Design",
  },
  description:
    "Estudio de diseño y desarrollo web en México. Webs rápidas, animadas y orientadas a conversión. Branding, UX/UI, e-commerce, SEO y automatización. Haz que pase.",
  keywords: [
    "diseño web",
    "desarrollo web México",
    "landing page",
    "e-commerce",
    "SEO",
    "BryanF Design",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://bryanfdesign.com.mx",
    siteName: "BryanF Design",
    title: "BryanF Design — Haz que pase.",
    description:
      "Webs rápidas, animadas y orientadas a conversión. Diseño y desarrollo a medida.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BryanF Design — Haz que pase.",
    description:
      "Webs rápidas, animadas y orientadas a conversión. Diseño y desarrollo a medida.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "BryanF Design",
  description:
    "Estudio de diseño y desarrollo web en México. Webs rápidas, animadas y orientadas a conversión.",
  url: "https://bryanfdesign.com.mx",
  email: "bryanf@bryanfdesign.com.mx",
  telephone: "+525663012505",
  image: "https://bryanfdesign.com.mx/img/logotipo-blanco.png",
  areaServed: ["MX", "ES", "FR"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

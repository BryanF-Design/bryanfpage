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
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "BryanF Design",
    title: "BryanF Design — Haz que pase.",
    description:
      "Webs rápidas, animadas y orientadas a conversión. Diseño y desarrollo a medida.",
  },
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
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Silkscreen } from "next/font/google";

import { CvGame } from "@/components/cv/cv-game";
import { CV_CONTACT, QUESTS } from "@/lib/cv/data";
import es from "@/lib/cv/i18n/es";
import { SITE_URL } from "@/lib/seo/service-pages";

// Fuente pixel solo para las etiquetas de HUD de esta página: no viaja al
// resto del sitio.
const pixel = Silkscreen({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});

const URL = `${SITE_URL}/cv`;

export const metadata: Metadata = {
  title: es.meta.title,
  description: es.meta.description,
  alternates: { canonical: "/cv" },
  openGraph: {
    type: "profile",
    locale: "es_MX",
    url: URL,
    siteName: "BryanF Design",
    title: es.meta.title,
    description: es.meta.description,
    images: [{ url: "/img/og-bryanf-apex.png", width: 1200, height: 630, alt: CV_CONTACT.fullName }],
  },
  twitter: {
    card: "summary_large_image",
    title: es.meta.title,
    description: es.meta.description,
    images: ["/img/og-bryanf-apex.png"],
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: URL,
  name: es.meta.title,
  mainEntity: {
    "@type": "Person",
    name: CV_CONTACT.fullName,
    alternateName: CV_CONTACT.shortName,
    jobTitle: "Líder de Desarrollo Web y Aplicaciones · Tech Architect · Operations Manager",
    description: es.profile.summary,
    image: `${SITE_URL}/img/cv/bryan-photo-full.webp`,
    email: `mailto:${CV_CONTACT.email}`,
    telephone: CV_CONTACT.phone,
    url: CV_CONTACT.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ecatepec de Morelos",
      addressRegion: "Estado de México",
      addressCountry: "MX",
    },
    worksFor: { "@id": `${SITE_URL}/#organization` },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Universidad Tecnológica de México (UNITEC)" },
      { "@type": "CollegeOrUniversity", name: "Tecnológico de Estudios Superiores de Ecatepec" },
    ],
    knowsLanguage: ["es", "en"],
    knowsAbout: [
      "Desarrollo web",
      "React",
      "Next.js",
      "JavaScript",
      "Tailwind CSS",
      "UX/UI",
      "DNS",
      "Hosting",
      "Vercel",
      "n8n",
      "Dirección de equipos",
      "Producción audiovisual",
      "Customer Service",
    ],
    hasOccupation: QUESTS.slice(0, 3).map((q) => ({
      "@type": "Occupation",
      name: es.quests.items[q.id as keyof typeof es.quests.items].role,
    })),
    sameAs: [CV_CONTACT.linkedin, CV_CONTACT.github, CV_CONTACT.instagram],
  },
};

export default function CvPage() {
  return (
    <div className={pixel.variable}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <CvGame />
    </div>
  );
}

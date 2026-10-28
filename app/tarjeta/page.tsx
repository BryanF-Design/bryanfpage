import type { Metadata } from "next";
import QRCode from "qrcode";

import { DigitalCard } from "@/components/digital-card";
import { CARD } from "@/lib/contact-card";

const TITLE = "Bryan F. · Tarjeta digital | BryanF Design";
const DESCRIPTION =
  "Tarjeta de presentación digital de Bryan F., diseñador y desarrollador web en Ciudad de México. Guarda el contacto, escríbele por WhatsApp o comparte la tarjeta con un QR.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tarjeta" },
  openGraph: {
    type: "profile",
    locale: "es_MX",
    url: CARD.cardUrl,
    siteName: "BryanF Design",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: CARD.photo.src, width: CARD.photo.width, height: CARD.photo.height, alt: CARD.fullName }],
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION, images: [CARD.photo.src] },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: CARD.fullName,
  jobTitle: CARD.role,
  image: `${CARD.website}${CARD.photo.src}`,
  url: CARD.cardUrl,
  email: `mailto:${CARD.email}`,
  telephone: CARD.phone,
  worksFor: { "@id": `${CARD.website}/#organization` },
  address: {
    "@type": "PostalAddress",
    addressLocality: CARD.city,
    addressRegion: CARD.region,
    addressCountry: "MX",
  },
  sameAs: Object.values(CARD.social),
};

export default async function TarjetaPage() {
  // El QR se dibuja en el servidor como SVG: nítido a cualquier tamaño y sin
  // JavaScript extra en el teléfono.
  const qrSvg = await QRCode.toString(CARD.cardUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    color: { dark: "#101e19", light: "#00000000" },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <DigitalCard qrSvg={qrSvg} />
    </>
  );
}

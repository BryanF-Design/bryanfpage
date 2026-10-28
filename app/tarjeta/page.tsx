import type { Metadata } from "next";
import QRCode from "qrcode";

import { DigitalCard } from "@/components/digital-card";
import { CARD, QR_OPTIONS, buildQrVCard } from "@/lib/contact-card";
import { isWalletConfigured } from "@/lib/google-wallet";

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
  // Los QR se dibujan en el servidor como SVG: nítidos a cualquier tamaño y
  // sin JavaScript extra en el teléfono. Uno lleva el contacto completo (para
  // la cámara y Google Wallet) y otro solo el enlace a esta página.
  const color = { dark: "#101e19", light: "#00000000" };
  const [qrContactSvg, qrLinkSvg] = await Promise.all([
    QRCode.toString(buildQrVCard(), { ...QR_OPTIONS, type: "svg", color }),
    QRCode.toString(CARD.cardUrl, { ...QR_OPTIONS, type: "svg", color }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <DigitalCard
        qrContactSvg={qrContactSvg}
        qrLinkSvg={qrLinkSvg}
        walletEnabled={isWalletConfigured()}
      />
    </>
  );
}

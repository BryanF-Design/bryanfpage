import { SITE_URL } from "@/lib/seo/service-pages";

/**
 * Datos de la tarjeta digital (/tarjeta). Una sola fuente para la página, el
 * QR y el .vcf que se descarga con "Guardar contacto".
 */
export const CARD = {
  firstName: "Bryan",
  lastName: "F.",
  fullName: "Bryan F.",
  role: "Diseñador & desarrollador web",
  company: "BryanF Design",
  tagline: "Haz que pase.",
  bio: "Diseño la experiencia y también escribo el código. Páginas web rápidas, animadas y pensadas para vender.",
  phone: "+525663012505",
  phoneLabel: "+52 56 6301 2505",
  email: "bryanf@bryanfdesign.com.mx",
  whatsapp: "https://wa.me/525663012505",
  website: SITE_URL,
  websiteLabel: "bryanfdesign.com",
  city: "Ciudad de México",
  region: "CDMX",
  country: "México",
  cardUrl: `${SITE_URL}/tarjeta`,
  // Foto de perfil (en /public). Se usa en la tarjeta, en la vista previa al
  // compartir y dentro del contacto que se guarda.
  photo: { src: "/img/me/ME-560.jpg", width: 560, height: 594 },
  reviewUrl: "https://maps.app.goo.gl/CWNcgPfAZt31K3ey6",
  social: {
    instagram: "https://www.instagram.com/bryanf_design/",
    facebook: "https://www.facebook.com/share/1R1rS2ToKf/",
    linkedin: "https://www.linkedin.com/in/bryanfdesigner",
    github: "https://github.com/BryanF-Design",
  },
} as const;

/** Escapa un valor de texto según RFC 6350 (vCard 3.0/4.0). */
function esc(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** Corta líneas a 75 octetos como pide el formato (las continuaciones empiezan con espacio). */
function fold(line: string) {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(" " + line.slice(i, i + 74));
  return parts.join("\r\n");
}

/** vCard 3.0: es la versión que mejor abren iPhone, Android y Outlook. */
export function buildVCard(photoBase64?: string) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(CARD.lastName)};${esc(CARD.firstName)};;;`,
    `FN:${esc(CARD.fullName)}`,
    `ORG:${esc(CARD.company)}`,
    `TITLE:${esc(CARD.role)}`,
    `TEL;TYPE=CELL,VOICE,pref:${CARD.phone}`,
    `EMAIL;TYPE=INTERNET,WORK,pref:${CARD.email}`,
    `URL;TYPE=WORK:${CARD.website}`,
    `ADR;TYPE=WORK:;;;${esc(CARD.city)};${esc(CARD.region)};;${esc(CARD.country)}`,
    `NOTE:${esc(`${CARD.bio} WhatsApp: ${CARD.whatsapp}`)}`,
    `X-SOCIALPROFILE;TYPE=instagram:${CARD.social.instagram}`,
    `X-SOCIALPROFILE;TYPE=facebook:${CARD.social.facebook}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${CARD.social.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${CARD.social.github}`,
    `item1.URL:${CARD.whatsapp}`,
    "item1.X-ABLabel:WhatsApp",
    `item2.URL:${CARD.cardUrl}`,
    "item2.X-ABLabel:Tarjeta digital",
  ];
  if (photoBase64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
  lines.push("END:VCARD");
  return lines.map(fold).join("\r\n") + "\r\n";
}

/**
 * vCard mínima para el QR: sin foto ni redes para que el código quede legible.
 * Al escanearla, la cámara del iPhone o Android ofrece "Agregar contacto" sin
 * abrir internet, y si el QR se guarda en Google Wallet (Agregar a Wallet →
 * Foto) la tarjeta queda ahí con todos los datos.
 */
export function buildQrVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(CARD.lastName)};${esc(CARD.firstName)};;;`,
    `FN:${esc(CARD.fullName)}`,
    `ORG:${esc(CARD.company)}`,
    `TITLE:${esc(CARD.role)}`,
    `TEL;TYPE=CELL:${CARD.phone}`,
    `EMAIL:${CARD.email}`,
    `URL:${CARD.cardUrl}`,
    `ADR;TYPE=WORK:;;;${esc(CARD.city)};${esc(CARD.region)};;${esc(CARD.country)}`,
    "END:VCARD",
  ].join("\r\n");
}

/** Opciones compartidas por los QR (página y PNG descargable). */
export const QR_OPTIONS = { errorCorrectionLevel: "Q", margin: 0 } as const;

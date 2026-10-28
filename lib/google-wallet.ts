import { createSign, randomUUID } from "node:crypto";

import { CARD, buildQrVCard } from "@/lib/contact-card";

/**
 * Pase de Google Wallet para la tarjeta digital (tipo "Generic").
 *
 * Cómo se reparte la información para poder actualizarla:
 * - La CLASE (una sola, compartida por todos) lleva lo que puede cambiar:
 *   teléfono, correo, sitio, ciudad y enlaces. Al editarla, Google la
 *   actualiza en el Wallet de todas las personas que guardaron el pase.
 * - Cada OBJETO (uno por persona que lo guarda) lleva lo fijo: nombre,
 *   puesto, colores, logo y el QR con el contacto.
 *
 * La clase se sube con los datos de lib/contact-card.ts la primera vez que
 * alguien toca "Agregar a Google Wallet" después de cada deploy, así que basta
 * cambiar los datos, publicar y abrir /tarjeta/google-wallet una vez.
 *
 * Variables de entorno (Vercel):
 * - GOOGLE_WALLET_ISSUER_ID: ID de emisor de Google Pay & Wallet Console.
 * - GOOGLE_WALLET_SERVICE_ACCOUNT: el JSON completo de la llave de la cuenta
 *   de servicio (se pega tal cual).
 */

const API = "https://walletobjects.googleapis.com/walletobjects/v1";
const SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const CLASS_SUFFIX = "tarjeta_bryanf";

type ServiceAccount = { client_email: string; private_key: string };

function readConfig() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID?.trim();
  const raw = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT?.trim();
  if (!issuerId || !raw) return null;
  try {
    const account = JSON.parse(raw) as ServiceAccount;
    if (!account.client_email || !account.private_key) return null;
    return { issuerId, account };
  } catch {
    return null;
  }
}

export function isWalletConfigured() {
  return readConfig() !== null;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function signJwt(payload: object, account: ServiceAccount) {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${body}`);
  return `${header}.${body}.${signer.sign(account.private_key).toString("base64url")}`;
}

function text(value: string, language = "es-MX") {
  return { defaultValue: { language, value } };
}

function image(url: string, description: string) {
  return { sourceUri: { uri: url }, contentDescription: text(description) };
}

function classId(issuerId: string) {
  return `${issuerId}.${CLASS_SUFFIX}`;
}

function buildClass(issuerId: string) {
  return {
    id: classId(issuerId),
    multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
    textModulesData: [
      { id: "telefono", header: "Teléfono / WhatsApp", body: CARD.phoneLabel },
      { id: "correo", header: "Correo", body: CARD.email },
      { id: "sitio", header: "Sitio web", body: CARD.websiteLabel },
      { id: "ubicacion", header: "Ubicación", body: `${CARD.city}, ${CARD.country}` },
      { id: "sobre", header: CARD.tagline, body: CARD.bio },
    ],
    linksModuleData: {
      uris: [
        { id: "llamar", uri: `tel:${CARD.phone}`, description: "Llamar" },
        { id: "whatsapp", uri: CARD.whatsapp, description: "WhatsApp" },
        { id: "correo", uri: `mailto:${CARD.email}`, description: "Mandar correo" },
        { id: "tarjeta", uri: CARD.cardUrl, description: "Tarjeta digital y guardar contacto" },
        { id: "sitio", uri: CARD.website, description: "Sitio web" },
        { id: "instagram", uri: CARD.social.instagram, description: "Instagram" },
        { id: "linkedin", uri: CARD.social.linkedin, description: "LinkedIn" },
      ],
    },
  };
}

function buildObject(issuerId: string) {
  return {
    id: `${issuerId}.tarjeta-${randomUUID()}`,
    classId: classId(issuerId),
    state: "ACTIVE",
    hexBackgroundColor: "#101e19",
    logo: image(`${CARD.website}/img/favicon.png`, CARD.company),
    cardTitle: text(CARD.company),
    header: text(CARD.fullName),
    subheader: text(CARD.role),
    heroImage: image(`${CARD.website}/img/og-bryanf-apex.png`, `${CARD.company} — ${CARD.tagline}`),
    barcode: {
      type: "QR_CODE",
      value: buildQrVCard(),
      alternateText: "Escanéame para guardar el contacto",
    },
  };
}

async function accessToken(account: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    {
      iss: account.client_email,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    },
    account
  );
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

async function walletFetch(token: string, path: string, method: string, body?: object) {
  return fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

let classSynced: Promise<void> | null = null;

/** Crea o actualiza la clase compartida. Una vez por instancia del servidor. */
function ensureWalletClass(token: string, issuerId: string) {
  classSynced ??= (async () => {
    const walletClass = buildClass(issuerId);
    const path = `/genericClass/${encodeURIComponent(walletClass.id)}`;
    const res = await walletFetch(token, path, "PUT", walletClass);
    if (res.status === 404) {
      const created = await walletFetch(token, "/genericClass", "POST", walletClass);
      if (!created.ok) throw new Error(`clase ${created.status}: ${await created.text()}`);
    } else if (!res.ok) {
      throw new Error(`clase ${res.status}: ${await res.text()}`);
    }
  })().catch((error) => {
    classSynced = null; // Reintenta en la siguiente visita.
    throw error;
  });
  return classSynced;
}

/**
 * Enlace "Guardar en Google Wallet" con un pase nuevo para quien lo pide.
 * El pase se crea antes por la API y el enlace solo lleva su ID: Google
 * limita el largo del enlace firmado y el QR con la vCard no cabría.
 */
export async function createSaveUrl() {
  const config = readConfig();
  if (!config) return null;
  const token = await accessToken(config.account);
  await ensureWalletClass(token, config.issuerId);

  const object = buildObject(config.issuerId);
  const res = await walletFetch(token, "/genericObject", "POST", object);
  if (!res.ok) throw new Error(`pase ${res.status}: ${await res.text()}`);

  const jwt = signJwt(
    {
      iss: config.account.client_email,
      aud: "google",
      typ: "savetowallet",
      origins: [CARD.website],
      payload: { genericObjects: [{ id: object.id }] },
    },
    config.account
  );
  return `https://pay.google.com/gp/v/save/${jwt}`;
}

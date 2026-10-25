import crypto from "crypto";

/**
 * MI PANEL — acceso de los suscriptores (/mi-panel) sin contraseña.
 *
 * El cliente escribe su correo; si tiene una suscripción, le llega un enlace
 * firmado que vale `LINK_MINUTES`. Al abrirlo se guarda una cookie httpOnly
 * firmada que dura `SESSION_DAYS`. La firma usa CLIENT_SESSION_SECRET (o, si
 * falta, ADMIN_SESSION_SECRET / BRIEF_LINK_SECRET).
 */

export const CLIENT_COOKIE = "bfd_cliente";
const LINK_MINUTES = 30;
const SESSION_DAYS = 30;
export const CLIENT_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

function secret() {
  return (
    process.env.CLIENT_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.BRIEF_LINK_SECRET ||
    ""
  );
}

export function clientSessionConfigured() {
  return secret().length >= 24;
}

function sign(kind: string, payload: string) {
  return crypto.createHmac("sha256", `bfd-cliente|${secret()}`).update(`${kind}|${payload}`).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const da = crypto.createHash("sha256").update(a).digest();
  const db = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(da, db);
}

function make(kind: string, email: string, ttlMs: number) {
  const payload = `${Buffer.from(email.toLowerCase()).toString("base64url")}.${Date.now() + ttlMs}`;
  return `${payload}.${sign(kind, payload)}`;
}

function read(kind: string, token: string | null | undefined): string | null {
  if (!token || !clientSessionConfigured()) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expires, signature] = parts;
  if (!(Number(expires) > Date.now())) return null;
  if (!safeEqual(signature, sign(kind, `${emailB64}.${expires}`))) return null;
  const email = Buffer.from(emailB64, "base64url").toString("utf8");
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Enlace de acceso que va por correo. */
export const createLoginToken = (email: string) => make("link", email, LINK_MINUTES * 60 * 1000);
export const readLoginToken = (token: string | null | undefined) => read("link", token);

/** Cookie de sesión. */
export const createClientSession = (email: string) => make("session", email, CLIENT_MAX_AGE * 1000);
export const readClientSession = (token: string | null | undefined) => read("session", token);

export const LOGIN_LINK_MINUTES = LINK_MINUTES;

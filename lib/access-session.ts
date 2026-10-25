import crypto from "crypto";

/**
 * PANEL BRYANF — sesión del panel de administración (/admin).
 *
 * Un solo usuario administrador definido por variables de entorno:
 *   ADMIN_USER      (por defecto "bryanf")
 *   ADMIN_PASSWORD  (obligatoria, mínimo 12 caracteres; sin ella el panel está apagado)
 *
 * Al entrar se guarda una cookie httpOnly firmada con HMAC que dura
 * `SESSION_DAYS`. La firma depende de la contraseña: cambiarla cierra todas
 * las sesiones abiertas.
 */

export const ACCESS_COOKIE = "bfd_access";
const SESSION_DAYS = 7;
export const ACCESS_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

function adminUser() {
  return (process.env.ADMIN_USER || "bryanf").trim().toLowerCase();
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function accessConfigured() {
  return adminPassword().length >= 12;
}

function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_API_KEY || "";
  return crypto.createHash("sha256").update(`bfd-access|${secret}|${adminUser()}|${adminPassword()}`).digest();
}

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

/** Compara en tiempo constante (se comparan hashes para igualar longitudes). */
function safeEqual(a: string, b: string) {
  return crypto.timingSafeEqual(digest(a), digest(b));
}

export function checkCredentials(user: string, password: string) {
  if (!accessConfigured()) return false;
  const userOk = safeEqual(user.trim().toLowerCase(), adminUser());
  const passOk = safeEqual(password, adminPassword());
  return userOk && passOk;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const expires = Date.now() + ACCESS_MAX_AGE * 1000;
  const payload = `${adminUser()}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !accessConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [user, expires, signature] = parts;
  if (Number(expires) < Date.now()) return false;
  if (!safeEqual(signature, sign(`${user}.${expires}`))) return false;
  return safeEqual(user, adminUser());
}

/** Para las APIs del panel: sesión de /admin válida (cookie). */
export function hasAdminSession(req: { cookies: { get(name: string): { value: string } | undefined } }) {
  return verifySessionToken(req.cookies.get(ACCESS_COOKIE)?.value);
}

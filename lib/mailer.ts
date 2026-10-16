/**
 * ENVÍO DE CORREO (Gmail API de Google, con Resend de respaldo).
 *
 * Con GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN los
 * correos salen desde la cuenta de Google Workspace / Gmail de
 * GOOGLE_SENDER_EMAIL (Gmail API, `users.messages.send`). Si faltan, se usa
 * Resend (RESEND_API_KEY) como antes. Ver CORREOS_SETUP.md.
 *
 * Sin dependencias: el token se renueva con fetch y el mensaje MIME se arma
 * aquí (texto + HTML y, si hay, adjuntos).
 */

export interface MailAttachment {
  filename: string;
  /** Contenido en base64 (sin el prefijo data:). */
  content: string;
  type?: string;
}

export interface MailMessage {
  to: string | string[];
  subject: string;
  html: string;
  /** Versión en texto plano; si falta se deriva del HTML. */
  text?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export interface MailResult {
  ok: boolean;
  provider?: "google" | "resend";
  id?: string;
  error?: string;
}

const DEFAULT_SENDER = "bryanf@bryanfdesign.com";
const SENDER_NAME = "BryanF Design";

/** Buzón del que salen los correos. */
export function senderEmail() {
  return (process.env.GOOGLE_SENDER_EMAIL || DEFAULT_SENDER).trim();
}

/** Buzón que recibe los avisos internos (ventas, cobros, briefings). */
export function notificationEmail() {
  return (process.env.GOOGLE_NOTIFICATION_EMAIL || process.env.GOOGLE_SENDER_EMAIL || DEFAULT_SENDER).trim();
}

export function googleMailConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN
  );
}

export function mailConfigured() {
  return googleMailConfigured() || Boolean(process.env.RESEND_API_KEY);
}

// ——— Google OAuth: token de acceso a partir del refresh token ———

let cachedToken: { value: string; expiresAt: number } | null = null;

async function googleAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || "",
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(`Google OAuth: ${data.error || res.status} ${data.error_description || ""}`.trim());
  }
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

// ——— MIME ———

/** Encabezado con acentos/emoji (RFC 2047). */
function encodeHeader(value: string) {
  return /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function wrap76(b64: string) {
  return b64.replace(/.{1,76}/g, "$&\r\n").trimEnd();
}

function b64(text: string) {
  return wrap76(Buffer.from(text, "utf8").toString("base64"));
}

/** Texto plano legible a partir del HTML (para clientes sin HTML y filtros de spam). */
export function htmlToText(html: string) {
  return html
    .replace(/<(style|script|head)[\s\S]*?<\/\1>/gi, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, label: string) => {
      const text = label.replace(/<[^>]+>/g, "").trim();
      return text && text !== href ? `${text} (${href})` : href;
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|table)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildMime(message: MailMessage, from: string): string {
  const to = Array.isArray(message.to) ? message.to : [message.to];
  const text = message.text || htmlToText(message.html);
  const boundary = () => `bf_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  const alt = boundary();

  const headers = [
    `From: ${encodeHeader(SENDER_NAME)} <${from}>`,
    `To: ${to.join(", ")}`,
    `Subject: ${encodeHeader(message.subject)}`,
    ...(message.replyTo ? [`Reply-To: ${message.replyTo}`] : []),
    "MIME-Version: 1.0",
  ];

  const alternative = [
    `--${alt}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(text),
    `--${alt}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(message.html),
    `--${alt}--`,
  ].join("\r\n");

  if (!message.attachments?.length) {
    return [...headers, `Content-Type: multipart/alternative; boundary="${alt}"`, "", alternative].join("\r\n");
  }

  const mixed = boundary();
  const parts = message.attachments.map((file) =>
    [
      `--${mixed}`,
      `Content-Type: ${file.type || "application/octet-stream"}; name="${encodeHeader(file.filename)}"`,
      `Content-Disposition: attachment; filename="${encodeHeader(file.filename)}"`,
      "Content-Transfer-Encoding: base64",
      "",
      wrap76(file.content.replace(/\s/g, "")),
    ].join("\r\n")
  );
  return [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    "",
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    "",
    alternative,
    ...parts,
    `--${mixed}--`,
  ].join("\r\n");
}

async function sendWithGoogle(message: MailMessage): Promise<MailResult> {
  const token = await googleAccessToken();
  const raw = Buffer.from(buildMime(message, senderEmail()), "utf8").toString("base64url");
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
  if (!res.ok) return { ok: false, provider: "google", error: data.error?.message || String(res.status) };
  return { ok: true, provider: "google", id: data.id };
}

async function sendWithResend(message: MailMessage): Promise<MailResult> {
  const from = process.env.MAIL_FROM || `${SENDER_NAME} <${senderEmail()}>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text || htmlToText(message.html),
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      ...(message.attachments?.length ? { attachments: message.attachments } : {}),
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { id?: string; error?: unknown };
  if (!res.ok || data.error) return { ok: false, provider: "resend", error: JSON.stringify(data.error || res.status) };
  return { ok: true, provider: "resend", id: data.id };
}

/** Envía un correo. Nunca lanza: devuelve `{ ok, error }`. */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  try {
    if (googleMailConfigured()) {
      const result = await sendWithGoogle(message);
      // Si Google falla y hay Resend, el correo sale igual.
      if (result.ok || !process.env.RESEND_API_KEY) return result;
      console.error("Gmail API falló, se intenta con Resend:", result.error);
    }
    if (process.env.RESEND_API_KEY) return await sendWithResend(message);
    return { ok: false, error: "Correo no configurado (GOOGLE_* o RESEND_API_KEY)" };
  } catch (error) {
    console.error("sendMail error:", error);
    return { ok: false, error: String(error) };
  }
}

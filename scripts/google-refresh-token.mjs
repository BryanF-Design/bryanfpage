#!/usr/bin/env node
/**
 * Obtiene GOOGLE_REFRESH_TOKEN para enviar correo con la Gmail API (gmail.send)
 * y lo guarda SOLO en .env.local (ignorado por git).
 *
 *   npm run google:token
 *
 * Debe correr en TU computadora (no en un servidor): Google regresa el
 * navegador a http://localhost:3001/oauth2callback y este script lo recibe.
 * Si `npm run dev` usa el puerto 3001, deténlo mientras corre esto.
 *
 * Requisitos en .env.local (o en el entorno):
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET   del cliente OAuth "Aplicación web"
 *   GOOGLE_SENDER_EMAIL                       opcional, por defecto bryanf@bryanfdesign.com
 *
 * Seguridad:
 *   - `state` aleatorio validado en tiempo constante (anti-CSRF) + PKCE (S256).
 *   - Servidor sólo en 127.0.0.1, un solo uso y con tiempo límite.
 *   - Verifica que la cuenta autorizada sea GOOGLE_SENDER_EMAIL.
 *   - Nunca imprime el client secret ni el token: sólo confirma que se guardó.
 */
import crypto from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_LOCAL = path.join(ROOT, ".env.local");
const PORT = 3001;
const HOST = "127.0.0.1";
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const TIMEOUT_MS = 5 * 60 * 1000;
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  // Sólo para comprobar con qué cuenta se autorizó (id_token); el sitio no los usa.
  "openid",
  "email",
];

// ——— Variables: .env.local y .env, sin pisar las del entorno ———
for (const file of [".env.local", ".env"]) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
const expectedEmail = (process.env.GOOGLE_SENDER_EMAIL || "bryanf@bryanfdesign.com").trim().toLowerCase();

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!clientId || !clientSecret) {
  fail("Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en .env.local (ver CORREOS_SETUP.md).");
}

// ——— .env.local debe estar ignorado por git antes de escribir un secreto ———
function assertEnvLocalIgnored() {
  try {
    execFileSync("git", ["check-ignore", "-q", ENV_LOCAL], { cwd: ROOT, stdio: "ignore" });
  } catch (error) {
    // status 1 = no ignorado; cualquier otro (sin git) = no se puede comprobar.
    if (error && error.status === 1) {
      fail(".env.local NO está en .gitignore. Agrégalo antes de guardar el token.");
    }
  }
  try {
    const tracked = execFileSync("git", ["ls-files", ".env.local"], { cwd: ROOT }).toString().trim();
    if (tracked) fail(".env.local está versionado en git. Sácalo del repo (git rm --cached .env.local).");
  } catch {
    /* sin git: se sigue */
  }
}

/** Escribe o reemplaza una variable en .env.local, con permisos 600. */
function upsertEnvLocal(key, value) {
  const lines = fs.existsSync(ENV_LOCAL) ? fs.readFileSync(ENV_LOCAL, "utf8").split(/\r?\n/) : [];
  const entry = `${key}=${value}`;
  const index = lines.findIndex((l) => new RegExp(`^\\s*${key}\\s*=`).test(l));
  if (index >= 0) lines[index] = entry;
  else {
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    lines.push(entry);
  }
  fs.writeFileSync(ENV_LOCAL, `${lines.join("\n")}\n`, { mode: 0o600 });
  fs.chmodSync(ENV_LOCAL, 0o600);
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function tryOpenBrowser(url) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).on("error", () => {}).unref();
  } catch {
    /* si no se puede abrir, la URL ya está impresa */
  }
}

function page(title, body) {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 1rem;color:#171717">
<h1 style="font-size:1.4rem">${title}</h1><p>${body}</p></body>`;
}

// ——— Flujo OAuth ———
assertEnvLocalIgnored();

const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
const state = crypto.randomBytes(32).toString("hex");
const { codeVerifier, codeChallenge } = await oauth2.generateCodeVerifierAsync();

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
  state,
  code_challenge: codeChallenge,
  code_challenge_method: "S256",
  login_hint: expectedEmail,
  // Sólo cuentas del dominio de Workspace del remitente.
  hd: expectedEmail.split("@")[1],
  include_granted_scopes: false,
});

let done = false;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", REDIRECT_URI);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404).end();
    return;
  }
  if (done) {
    res.writeHead(410, { "Content-Type": "text/html; charset=utf-8" }).end(page("Ya se usó", "Este enlace ya se procesó."));
    return;
  }

  const finish = (status, title, body, exitCode, log) => {
    done = true;
    res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" }).end(page(title, body));
    if (log) (exitCode ? console.error : console.log)(log);
    server.close();
    clearTimeout(timer);
    process.exitCode = exitCode;
  };

  const error = url.searchParams.get("error");
  if (error) {
    return finish(400, "Autorización cancelada", "Vuelve a la terminal.", 1, `\n✖ Google respondió: ${error}\n`);
  }
  if (!safeEqual(url.searchParams.get("state") || "", state)) {
    return finish(400, "Solicitud inválida", "El parámetro state no coincide.", 1, "\n✖ state inválido: posible CSRF o pestaña vieja. Vuelve a correr el script.\n");
  }
  const code = url.searchParams.get("code");
  if (!code) {
    return finish(400, "Sin código", "Vuelve a la terminal.", 1, "\n✖ Google no envió el código de autorización.\n");
  }

  try {
    const { tokens } = await oauth2.getToken({ code, codeVerifier });

    // ¿Se autorizó con la cuenta correcta?
    let email = "";
    if (tokens.id_token) {
      const ticket = await oauth2.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
      const payload = ticket.getPayload() || {};
      if (payload.email_verified) email = String(payload.email || "").toLowerCase();
    }
    if (email !== expectedEmail) {
      return finish(
        403,
        "Cuenta equivocada",
        `Entraste con otra cuenta. Vuelve a correr el script y elige ${expectedEmail}.`,
        1,
        `\n✖ Se autorizó con ${email || "una cuenta desconocida"}, no con ${expectedEmail}. No se guardó nada.\n`
      );
    }

    const granted = String(tokens.scope || "").split(" ");
    if (!granted.includes("https://www.googleapis.com/auth/gmail.send")) {
      return finish(403, "Falta permiso", "No se otorgó el permiso de enviar correo.", 1, "\n✖ No se otorgó gmail.send. Vuelve a correr y acepta el permiso.\n");
    }

    if (!tokens.refresh_token) {
      return finish(
        500,
        "Sin refresh token",
        "Google no devolvió refresh token. Revisa la terminal.",
        1,
        "\n✖ Google no devolvió refresh_token. Quita el acceso de la app en https://myaccount.google.com/permissions y vuelve a correr el script.\n"
      );
    }

    upsertEnvLocal("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);
    if (!process.env.GOOGLE_SENDER_EMAIL) upsertEnvLocal("GOOGLE_SENDER_EMAIL", expectedEmail);

    return finish(
      200,
      "¡Listo!",
      "El token quedó guardado en .env.local. Ya puedes cerrar esta pestaña y volver a la terminal.",
      0,
      `\n✔ Autorizado como ${email}.\n✔ GOOGLE_REFRESH_TOKEN guardado en .env.local (${tokens.refresh_token.length} caracteres; no se muestra).\n\nPrueba el envío:  node scripts/email-test.mjs --send ${email} --only paymentReceived\n`
    );
  } catch (err) {
    const reason = err?.response?.data?.error_description || err?.response?.data?.error || err?.message || "error desconocido";
    return finish(500, "Error", "No se pudo canjear el código. Revisa la terminal.", 1, `\n✖ No se pudo canjear el código: ${reason}\n`);
  }
});

const timer = setTimeout(() => {
  console.error("\n✖ Se agotó el tiempo (5 min) sin respuesta de Google. Vuelve a correr el script.\n");
  server.close();
  process.exit(1);
}, TIMEOUT_MS);

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    fail(`El puerto ${PORT} está ocupado (¿npm run dev?). Deténlo y vuelve a correr el script.`);
  }
  fail(err.message);
});

server.listen(PORT, HOST, () => {
  console.log(`\nEsperando a Google en ${REDIRECT_URI} (5 min)…`);
  console.log(`\n1) Se abrirá tu navegador. Si no, abre esta URL:\n\n${authUrl}\n`);
  console.log(`2) Entra con ${expectedEmail} y acepta "Enviar correo electrónico en tu nombre".\n`);
  tryOpenBrowser(authUrl);
});

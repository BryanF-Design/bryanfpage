#!/usr/bin/env node
/**
 * Obtiene GOOGLE_REFRESH_TOKEN con permiso para enviar correo (gmail.send).
 *
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-refresh-token.mjs
 *
 * 1. Abre la URL que imprime, entra con la cuenta que va a enviar
 *    (GOOGLE_SENDER_EMAIL) y acepta.
 * 2. Google te regresa a http://localhost:53682/... y este script imprime
 *    el refresh token. Cópialo a Vercel como GOOGLE_REFRESH_TOKEN.
 *
 * El cliente OAuth debe ser tipo "Aplicación web" con el URI de redirección
 * http://localhost:53682/oauth2callback (o tipo "App de escritorio").
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Falta GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET.");
  process.exit(1);
}

const PORT = 53682;
const redirectUri = `http://localhost:${PORT}/oauth2callback`;
const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send",
    access_type: "offline",
    prompt: "consent",
    login_hint: process.env.GOOGLE_SENDER_EMAIL || "",
  });

console.log("\nAbre esta URL e inicia sesión con la cuenta que enviará los correos:\n");
console.log(authUrl, "\n");

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, redirectUri);
    if (url.pathname !== "/oauth2callback") return res.end();
    const code = url.searchParams.get("code");
    if (!code) {
      res.end("Sin código: " + (url.searchParams.get("error") || ""));
      return;
    }
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const data = await tokenRes.json();
    if (!data.refresh_token) {
      res.end("No llegó refresh_token. Revisa la consola.");
      console.error(data);
      process.exit(1);
    }
    res.end("Listo. Ya puedes cerrar esta pestaña y volver a la terminal.");
    console.log("GOOGLE_REFRESH_TOKEN=" + data.refresh_token + "\n");
    process.exit(0);
  })
  .listen(PORT, () => console.log(`Esperando a Google en ${redirectUri} …`));

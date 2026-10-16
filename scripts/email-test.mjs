#!/usr/bin/env node
/**
 * Prueba de las plantillas de correo.
 *
 *   node scripts/email-test.mjs                         # vistas previas en email-previews/
 *   node scripts/email-test.mjs --send tu@correo.com    # además las envía por Gmail API
 *   node scripts/email-test.mjs --send tu@correo.com --only paymentReceived,renewalReminder
 *
 * Lee GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y
 * GOOGLE_SENDER_EMAIL de .env.local / .env (o del entorno).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// ——— .env ———
for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ——— Transpila los módulos de lib/ que hacen falta ———
const out = fs.mkdtempSync(path.join(os.tmpdir(), "bf-email-"));
for (const name of ["mailer", "email-templates", "email-samples"]) {
  const src = fs.readFileSync(path.join(root, "lib", `${name}.ts`), "utf8");
  const js = ts
    .transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
    .outputText.replace(/from "\.\/([\w-]+)"/g, 'from "./$1.mjs"');
  fs.writeFileSync(path.join(out, `${name}.mjs`), js);
}
const { EMAIL_SAMPLES } = await import(pathToFileURL(path.join(out, "email-samples.mjs")).href);
const mailer = await import(pathToFileURL(path.join(out, "mailer.mjs")).href);

// ——— Argumentos ———
const args = process.argv.slice(2);
const arg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const sendTo = arg("--send");
const only = arg("--only")?.split(",").map((s) => s.trim());
const names = Object.keys(EMAIL_SAMPLES).filter((n) => !only || only.includes(n));

// ——— Vistas previas ———
const previews = path.join(root, "email-previews");
fs.mkdirSync(previews, { recursive: true });
const index = [];
for (const name of names) {
  const { subject, html, text } = EMAIL_SAMPLES[name]();
  fs.writeFileSync(path.join(previews, `${name}.html`), html);
  fs.writeFileSync(path.join(previews, `${name}.txt`), `Asunto: ${subject}\n\n${text}\n`);
  index.push(`<li><a href="${name}.html">${name}</a> — ${subject.replace(/</g, "&lt;")}</li>`);
}
fs.writeFileSync(
  path.join(previews, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Correos BryanF Design</title><body style="font-family:sans-serif;padding:24px"><h1>Plantillas</h1><ul>${index.join("")}</ul></body>`
);
console.log(`✓ ${names.length} vistas previas en email-previews/ (abre email-previews/index.html)`);

// ——— Envío real ———
if (sendTo) {
  if (!mailer.mailConfigured()) {
    console.error("✗ Falta GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN (o RESEND_API_KEY).");
    process.exit(1);
  }
  console.log(`Enviando a ${sendTo} desde ${mailer.senderEmail()} vía ${mailer.googleMailConfigured() ? "Gmail API" : "Resend"}…`);
  let failed = 0;
  for (const name of names) {
    const content = EMAIL_SAMPLES[name]();
    const res = await mailer.sendMail({ to: sendTo, ...content, subject: `[Prueba] ${content.subject}` });
    console.log(`${res.ok ? "✓" : "✗"} ${name}${res.ok ? ` (${res.id})` : `: ${res.error}`}`);
    if (!res.ok) failed++;
  }
  process.exit(failed ? 1 : 0);
}

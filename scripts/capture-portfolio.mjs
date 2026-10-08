// Captura las webs del portafolio en el formato que usa el sitio:
//   public/img/portafolio/escritorio/<slug>.png  → 1440×1000, primera pantalla
//   public/img/portafolio/movil/<slug>.png       → 390 px de ancho, página completa
//
// Uso (necesita Playwright con Chromium):
//   node scripts/capture-portfolio.mjs                  # todas las de lib/projects.ts sin captura
//   node scripts/capture-portfolio.mjs urban-flip-com   # solo esos slugs
//   node scripts/capture-portfolio.mjs urban-flip-com=http://localhost:4000/
//     (slug=url captura otra URL, p. ej. una copia local del sitio)
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Falta Playwright: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

// Lee slugs y URLs de lib/projects.ts sin compilar TypeScript.
const source = readFileSync(join(root, "lib/projects.ts"), "utf8");
const projects = [...source.matchAll(/slug:\s*"([^"]+)"[^}]*?url:\s*"([^"]+)"/g)].map(
  ([, slug, url]) => ({ slug, url })
);

const desktopDir = join(root, "public/img/portafolio/escritorio");
const mobileDir = join(root, "public/img/portafolio/movil");
mkdirSync(desktopDir, { recursive: true });
mkdirSync(mobileDir, { recursive: true });

const args = process.argv.slice(2);
const targets = args.length
  ? args.map((arg) => {
      const [slug, override] = arg.split("=");
      const project = projects.find((p) => p.slug === slug);
      return { slug, url: override || project?.url };
    })
  : projects.filter((p) => !existsSync(join(desktopDir, `${p.slug}.png`)));

const browser = await chromium.launch();
for (const { slug, url } of targets) {
  if (!url) {
    console.warn(`· ${slug}: sin URL, se omite`);
    continue;
  }
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await desktop.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    await desktop.waitForTimeout(2500);
    await desktop.screenshot({ path: join(desktopDir, `${slug}.png`) });
    await desktop.close();

    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await mobile.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    // Recorre la página para disparar lazy-load y animaciones de entrada.
    await mobile.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await mobile.waitForTimeout(1500);
    await mobile.screenshot({ path: join(mobileDir, `${slug}.png`), fullPage: true });
    await mobile.close();
    console.log(`✓ ${slug}`);
  } catch (error) {
    console.warn(`✗ ${slug}: ${error.message}`);
  }
}
await browser.close();

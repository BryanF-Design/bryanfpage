# BryanF Design — www.bryanfdesign.com

Sitio del estudio en Next.js 14 (App Router), desplegado en Vercel.

## Comandos
- `npm run dev` — desarrollo
- `npm run build` / `npm start` — producción
- `npm run google:token` — refresh token de Gmail API (ver `CORREOS_SETUP.md`)

## Dónde vive cada cosa
- `app/` — páginas y endpoints (`app/api/*`)
- `components/` — secciones e interfaz; `components/lumina-chat.tsx` es Lumina,
  montada una sola vez en `app/layout.tsx` para todo el sitio
- `lib/catalog.ts` — precios; `lib/subscription.ts` — suscripción Todo Digital
- `lib/lumina-*.ts` — prompt, acciones y comentarios por sección de Lumina
- `public/` — imágenes y archivos estáticos

## BryanF Access (`/access`)
Panel privado con los suscriptores de Stripe y Mercado Pago: estado, próximo
cobro y días que faltan. Se activa con `ADMIN_USER` y `ADMIN_PASSWORD`
(mínimo 12 caracteres) en las variables de entorno de Vercel.

## Variables de entorno
Todas están documentadas en `.env.example`. Guías: `SUSCRIPCION_SETUP.md`,
`CORREOS_SETUP.md`, `GOOGLE_ADS_SETUP.md`, `SEARCH_CONSOLE_SITEMAP.md`.

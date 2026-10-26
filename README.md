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

## Panel BryanF (`/admin`) y Mi panel (`/mi-panel`)
`/admin` es el panel privado de Bryan (`ADMIN_USER` + `ADMIN_PASSWORD`, mínimo
12 caracteres). Pestañas:
- **Resumen**: ingreso recurrente, ventas del mes, próximos cobros, temporada y descuento vigentes.
- **Clientes**: todos los que pagaron (suscripción, compra o transferencia), unidos por correo.
  Crear cuenta, poner o generar contraseña, mandar el acceso por correo, registrar pagos
  por transferencia y **ver su panel como lo ve el cliente** (`/admin/vista?email=`).
- **Suscripciones** y **Pagos**: en vivo de Stripe y Mercado Pago, más lo registrado a mano.
- **Temporadas**: Día de Muertos, El Buen Fin, Black Friday y Navidad, cada una con fechas
  (se prende y se apaga sola), colores, decoración (guirnalda arriba, detalle en el logo y un
  cartel propio en la home), pop-up de temporada y aviso. Cada una tiene su arte en
  `components/season/art/` y su cartel en `components/season/season-poster.tsx`. Vista previa con
  `/?temporada=muertos` (`/?temporada=fin` la quita).
- **Descuentos**: % general y por servicio. Se muestran tachados y el servidor cobra con descuento.
- **Avisos y pop-up**: la píldora bajo el menú y el pop-up de promoción.

`/mi-panel` es el panel de cada cliente, de compra única o de suscripción: entra con su correo
(enlace) o con contraseña, ve su servicio o su plan, sus pagos y pide cosas por WhatsApp.

Los datos viven en Supabase (proyecto BryanF-Access, esquema `sitio`, ver `lib/db.ts`); sin
la base, el sitio funciona con la temporada por fecha y sin descuentos.

## Lumina
`components/lumina-chat.tsx` es el chat; `components/lumina-tips.tsx` son los avisos que
"saltan" junto a lo que estás viendo: ayuda si alguien titubea en los pagos, el modo
oscuro / claro y el saludo de temporada.

## Variables de entorno
Todas están documentadas en `.env.example`. Guías: `SUSCRIPCION_SETUP.md`,
`CORREOS_SETUP.md`, `GOOGLE_ADS_SETUP.md`, `SEARCH_CONSOLE_SITEMAP.md`.

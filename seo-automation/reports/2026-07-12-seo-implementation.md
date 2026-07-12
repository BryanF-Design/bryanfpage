# Reporte SEO — 2026-07-12

## Objetivo

Aplicar la primera fase del plan de crecimiento de BryanF Design con foco en señales de confianza, descubrimiento, canonicalización, medición y seguridad editorial.

## Cambios implementados

- `components/ui/stat-counter.tsx`: el valor verificado se entrega inicialmente en SSR; la animación posterior ya no expone ceros a crawlers.
- `components/seo/service-landing-page.tsx`: se eliminó texto editorial visible y se añadió `@id` de servicio/proveedor.
- `components/analytics/tracked-whatsapp-link.tsx` y `lib/analytics.ts`: tracking de leads de WhatsApp desde landings.
- `components/sections/configurator.tsx`: evento GA4 `begin_checkout` para Stripe, Mercado Pago y transferencia.
- `components/analytics/google-analytics.tsx`: `window.gtag` queda disponible para eventos posteriores.
- `app/layout.tsx`: titles sin sufijo global duplicado y entidad `ProfessionalService` con `@id` estable.
- `app/sitemap.ts`: `lastmod` verificable solo para home y landings modificadas.
- `middleware.ts`: host apex redirige con 308 permanente a `www`.
- `components/sections/site-footer.tsx`: teléfono visible y enlazable con `tel:`.

## Validaciones

- `npx tsc --noEmit`: correcto.
- `npm run build`: correcto; Next generó 18 rutas y completó la generación estática.
- `npm run seo:google-smoke`: correcto; GSC y GA4 respondieron HTTP 200, propiedad con `siteOwner` y OAuth local.
- Prueba local: home HTTP 200, sin counters de confianza en cero, sin “Keyword principal” ni nota editorial, titles de servicio únicos, schema con `@id` y redirect apex 308.
- Sitemap compilado: 10 URLs, con `lastmod` únicamente en páginas modificadas.

## Pendientes externos

1. Desplegar el commit en el proyecto conectado a producción.
2. Confirmar en producción que apex → `www` responde 308 en un salto aplicable al host HTTPS.
3. Enviar el sitemap en Search Console.
4. Solicitar indexación de las seis páginas comerciales.
5. Revisar eventos `generate_lead` y `begin_checkout` en GA4 DebugView después del despliegue.

## Límites

No se inventaron métricas, casos, rankings, credenciales ni resultados comerciales. No se modificó `.env.local`, no se expusieron secretos y no se publicaron cambios directamente desde la auditoría.

# Weekly SEO Report - 2026-07-07

Semana: 2026-07-07
Responsable: Codex
Datos usados: repo local, Google OAuth local, Search Console API, GA4 Data API, build local

## Resumen ejecutivo

- Quedo configurado el acceso local de solo lectura a GSC y GA4 para la automatizacion SEO.
- La tarea semanal de Codex quedo activa para correr los lunes a las 9:00 AM en `America/Mexico_City`.
- Se agrego un smoke test sin dependencias para validar Google antes de usar datos reales.

## Cambios de la semana

- Google Cloud project creado y documentado.
- Search Console API y Google Analytics Data API habilitadas.
- OAuth local autorizado con `bryanf@bryanfdesign.com.mx`.
- `.env.local` actualizado localmente con OAuth refresh token.
- Automatizacion Codex actualizada de worktree a local para leer `.env.local`.
- Docs SEO actualizados para reflejar OAuth como metodo activo.

## Validaciones

- `npm run seo:google-smoke`: correcto.
- Search Console API: `200`, propiedad encontrada, permiso `siteOwner`.
- Search Analytics API: `200`, consulta pequena con 5 filas disponibles.
- GA4 Data API: `200`, reporte pequeno con 2 filas disponibles.
- `npm run build`: correcto.
- `npm run lint`: pendiente; Next abre configuracion interactiva de ESLint.

## Oportunidades GSC

- No se priorizan queries en este reporte. Solo se valido acceso tecnico.

## Oportunidades GA4

- No se priorizan canales o landings en este reporte. Solo se valido acceso tecnico.

## Acciones implementadas

- `npm run seo:google-smoke` agregado.
- `seo-automation/google-cloud-setup.md` agregado.
- `SEO_SETUP_TODO.md`, `SEO_AUDIT.md`, `SEO_ROADMAP_90_DAYS.md`, `SEO_GROWTH_LOOP.md` y docs de `/seo-automation` actualizados.

## Acciones pendientes

- Agregar script de reporte markdown con datos GSC/GA4 agregados.
- Agregar validacion local de metadata, sitemap e internal links.
- Resolver configuracion ESLint si se quiere que `npm run lint` no sea interactivo.
- Confirmar dominio canonico final.

## KPIs

- No se reportan clicks, impresiones, CTR, posiciones, sesiones ni conversiones en este reporte.

## Riesgos

- `.env.local` no se sube al repo. Si la automatizacion vuelve a worktree aislado, debe recibir secretos por un entorno seguro.
- Service account JSON sigue bloqueada por politica de organizacion de Google Cloud.

## Proximo sprint

- Usar los datos reales de GSC/GA4 para elegir una mejora puntual: metadata, FAQ, interlinking o refresh de una landing comercial existente.

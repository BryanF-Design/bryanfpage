# GSC / GA4 Growth Loop

## Objetivo

Crear un ciclo semanal que use datos reales para decidir si conviene mejorar metadata, refrescar contenido, agregar enlaces internos, crear una landing o dejar una pagina intacta.

## Datos necesarios

- GSC: queries, pages, impressions, clicks, CTR, position, country y device.
- GA4: landing pages, sessions, engagementRate y keyEvents/conversions si existen.
- Crawl local: rutas, metadata, H1, canonical, links internos y schema.

## Acceso actual

- Modo activo: OAuth local.
- Validacion rapida: `npm run seo:google-smoke`.
- Search Console property: `sc-domain:bryanfdesign.com.mx`.
- GA4 property: `504755650`.
- Measurement ID: `G-4GLGP6X573`.

## Flujo semanal

1. Revisar `git status` y no revertir cambios ajenos.
2. Correr `npm run seo:google-smoke`.
3. Si las APIs responden, consultar datos de GSC y GA4 con scripts de solo lectura.
4. Validar metadata, sitemap, robots y rutas comerciales.
5. Detectar oportunidades:
   - Muchas impresiones y bajo CTR.
   - Posicion promedio 5-20.
   - Landing con trafico pero poca conversion.
   - Query comercial sin landing dedicada.
   - Canibalizacion entre URLs.
6. Crear backlog priorizado.
7. Separar acciones automaticas de revision humana.
8. Documentar cambios y proximos pasos en un reporte semanal.

## Decisiones automaticas permitidas

- Marcar oportunidades en backlog.
- Proponer titulos y meta descriptions.
- Sugerir enlaces internos.
- Validar que una pagina nueva tenga metadata y H1.
- Generar reportes markdown.
- Hacer cambios tecnicos acotados si pasan build.

## Decisiones con revision humana

- Publicar paginas nuevas con claims comerciales nuevos.
- Reescribir promesas comerciales.
- Mencionar resultados, metricas o casos.
- Cambiar precios, paquetes o promesas.
- Agregar credenciales, secretos o integraciones pagadas.

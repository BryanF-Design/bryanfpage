# SEO Setup TODO

## Estado de credenciales

- Completado: `SITE_URL=https://www.bryanfdesign.com.mx`.
- Completado: `NEXT_PUBLIC_SITE_URL=https://www.bryanfdesign.com.mx`.
- Completado: `NEXT_PUBLIC_GA_ID=G-4GLGP6X573`.
- Completado: `WHATSAPP_NUMBER=525663012505`.
- Completado: `SEO_REPORT_EMAIL=bryanf@bryanfdesign.com.mx`.
- Completado: `GSC_SITE_URL=sc-domain:bryanfdesign.com.mx`.
- Completado: `GA4_PROPERTY_ID=504755650`.
- Completado local: OAuth de Google para GSC/GA4 en `.env.local`.
- No usar por ahora: `GOOGLE_CLIENT_EMAIL` + `GOOGLE_PRIVATE_KEY`. La organizacion de Google Cloud bloqueo la creacion de llaves JSON con la politica `iam.disableServiceAccountKeyCreation`.
- Opcional pendiente: `ANTHROPIC_API_KEY`, solo si luego se decide usar una API externa para briefs.

Guia detallada: `seo-automation/ENV_LOCAL_SETUP.md`.

## Validacion Google del 2026-07-07

- Search Console API: acceso correcto a `sc-domain:bryanfdesign.com.mx`; permiso detectado: `siteOwner`.
- Search Analytics API: consulta pequena respondio `200` para el rango `2026-06-08` a `2026-07-05`.
- GA4 Data API: `properties/504755650:runReport` respondio `200` con dimensiones y metricas solicitadas.
- No se documentan valores de clicks, sesiones, posiciones ni conversiones aqui para evitar mezclar diagnostico tecnico con metricas de negocio.

## Decisiones pendientes

- Confirmar dominio canonico final: `www.bryanfdesign.com.mx` queda como default tecnico actual.
- Confirmar si las nuevas paginas comerciales se publican tal cual o pasan por revision editorial.
- Definir si la automatizacion semanal debe crear cambios directos en el repo local o solo reportes cuando el sitio ya este estable.
- Confirmar si se crean paginas verticales por industria en una siguiente iteracion.

## Tareas tecnicas siguientes

- Completado: agregar script real de validacion OAuth GSC/GA4 (`npm run seo:google-smoke`).
- Agregar script real para validar metadata de rutas comerciales.
- Agregar script de revision de links internos y sitemap.
- Agregar script de salida markdown segura usando datos GSC/GA4 validados.
- Crear templates editables para casos de estudio sin inventar metricas.
- Completado: ignorar `*.tsbuildinfo` para evitar artefactos locales de TypeScript.
- Revisar si conviene configurar variables equivalentes en Vercel o en el entorno seguro de Codex si se cambia la automatizacion a worktree aislado.

## Reglas editoriales

- No inventar metricas, clientes, rankings, resultados ni credenciales.
- No crear contenido masivo con copy repetido.
- Cada pagina nueva debe tener intencion unica, CTA, enlaces internos y evidencia o contexto real.
- Los casos deben indicar placeholders cuando falte informacion verificable.

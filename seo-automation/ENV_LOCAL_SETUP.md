# Env local para SEO automation

Este archivo explica que variables necesita la automatizacion SEO, para que sirven y de donde obtenerlas. Los valores reales van en `.env.local` o en un gestor seguro de secretos, nunca commiteados.

## Estado actual

El acceso real a Google quedo configurado con OAuth local porque Google Cloud bloqueo la creacion de llaves JSON de service account mediante la politica de organizacion `iam.disableServiceAccountKeyCreation`.

El archivo `.env.local` de esta maquina ya contiene los secretos OAuth necesarios y esta ignorado por Git. No pegues su contenido en prompts, issues, commits, screenshots ni reportes.

## Variables minimas para correr auditoria local

```env
SITE_URL=https://www.bryanfdesign.com.mx
NEXT_PUBLIC_SITE_URL=https://www.bryanfdesign.com.mx
NEXT_PUBLIC_GA_ID=G-4GLGP6X573
WHATSAPP_NUMBER=525663012505
GSC_SITE_URL=sc-domain:bryanfdesign.com.mx
GA4_PROPERTY_ID=504755650
SEO_REPORT_EMAIL=bryanf@bryanfdesign.com.mx

# Google auth local para Search Console y GA4
GOOGLE_AUTH_MODE=oauth
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=

# Service account: no usar mientras la org policy bloquee llaves JSON
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=

# Opcional: solo si luego se usa una API externa para briefs con IA
ANTHROPIC_API_KEY=
```

## De donde sale cada variable

| Variable | Obligatoria | De donde sale | Uso |
| --- | --- | --- | --- |
| `SITE_URL` | Si | Dominio canonico elegido para produccion. Ahora el repo usa `https://www.bryanfdesign.com.mx`. | Canonicals, sitemap, robots y reportes. |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | Mismo dominio canonico que `SITE_URL`. | Codigo frontend que necesite URL publica. |
| `NEXT_PUBLIC_GA_ID` | Recomendada | GA4 > Admin > Data streams > Web stream > Measurement ID. Para BryanF: `G-4GLGP6X573`. | Carga la etiqueta Google Analytics en el sitio. |
| `WHATSAPP_NUMBER` | Recomendada | Numero comercial en formato internacional sin `+`. Para BryanF: `525663012505`. | CTAs medibles y mensajes de contacto. |
| `GSC_SITE_URL` | Para datos GSC | Google Search Console > propiedad del dominio. Para BryanF: `sc-domain:bryanfdesign.com.mx`. | Consultar queries, paginas, clicks, impresiones, CTR y posicion. |
| `GA4_PROPERTY_ID` | Para datos GA4 | Google Analytics > Admin > Property details. Para BryanF: `504755650`. | Consultar landing pages, sesiones, engagement y conversiones/key events. |
| `SEO_REPORT_EMAIL` | Opcional | Correo destino de reportes. Para BryanF: `bryanf@bryanfdesign.com.mx`. | Envio de reportes si luego se conecta email. |
| `GOOGLE_AUTH_MODE` | Para datos Google | Valor local: `oauth`. | Indica que se usa OAuth local y no service account. |
| `GOOGLE_OAUTH_CLIENT_ID` | Para datos Google | Google Cloud > Google Auth Platform > Clients > Desktop client. | Identifica el cliente OAuth. No es la pieza secreta, pero se mantiene local. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Para datos Google | Google Cloud > Google Auth Platform > Clients > Desktop client. | Secreto del cliente OAuth. Debe quedarse local/seguro. |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | Para datos Google | Se obtiene al autorizar el cliente OAuth con `bryanf@bryanfdesign.com.mx`. | Permite renovar access tokens sin volver a iniciar sesion. Debe quedarse local/seguro. |
| `GOOGLE_CLIENT_EMAIL` | Alternativa bloqueada | Google Cloud > IAM/service account. | Autenticacion server-to-server si la org permite llaves. |
| `GOOGLE_PRIVATE_KEY` | Alternativa bloqueada | Google Cloud > key JSON de service account. | No disponible por politica de organizacion. Debe quedarse secreto si se habilita. |
| `ANTHROPIC_API_KEY` | Opcional | Consola Anthropic, si se decide usar un agente externo para briefs. | Generar briefs o analisis con IA fuera de Codex. |

## Google Cloud creado

- Proyecto: `bryanf-seo-automation`.
- Numero de proyecto: `474480853455`.
- Organizacion: `bryanfdesign.com.mx`.
- APIs habilitadas: Google Search Console API y Google Analytics Data API.
- Service account creada: `bryanf-seo-growth-agent@bryanf-seo-automation.iam.gserviceaccount.com`.
- OAuth app: `BryanF SEO Growth Agent`, audiencia interna.
- OAuth desktop client: `BryanF SEO Local Automation`.

## Validacion realizada

El 2026-07-07 se valido lo siguiente:

- OAuth refresh token guardado en `.env.local`.
- Search Console API respondio `200` y encontro la propiedad `sc-domain:bryanfdesign.com.mx` con permiso `siteOwner`.
- Search Analytics API respondio `200` en una consulta pequena.
- GA4 Data API respondio `200` para la propiedad `504755650`.

## Que puede correr sin credenciales

- Validacion de build.
- Validacion de sitemap/robots generado por Next.
- Revision de metadata local.
- Revision de enlaces internos.
- Actualizacion de documentacion.
- Reporte semanal sin metricas reales.

## Que requiere credenciales

- Oportunidades reales de GSC.
- Rendimiento por landing en GA4.
- Deteccion de CTR bajo con impresiones reales.
- Deteccion de caidas de clicks.
- Priorizacion basada en conversiones/key events.

## Seguridad

- `.env.local` es local y esta ignorado por Git.
- No subir `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` ni futuras llaves privadas.
- Si se cambia la tarea de Codex a un worktree aislado, hay que darle estas variables por un mecanismo seguro porque los archivos ignorados no necesariamente se copian.
- Si se pierde acceso, revoca el cliente OAuth en Google Account > Security > Third-party access y vuelve a generar el flujo.

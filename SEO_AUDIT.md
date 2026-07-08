# SEO Audit - BryanF Design

Fecha: 2026-07-07
Sitio: https://www.bryanfdesign.com.mx
Stack detectado: Next.js 14 App Router, React 18, Tailwind CSS, TypeScript.

## Estado actual

- El sitio usa `app/layout.tsx` con metadata global, Open Graph, Twitter card, canonical base y JSON-LD de `ProfessionalService`.
- Existen `app/sitemap.ts` y `app/robots.ts`.
- Existen paginas legales servidas desde `public` mediante rewrites: `/privacidad`, `/terminos`, `/crear-web` y `/gracias`.
- Existen componentes de analytics para GA4 y Microsoft Clarity; GA4 ya tiene measurement ID local: `G-4GLGP6X573`.
- El portafolio tiene evidencia visual real y lista de proyectos en `lib/projects.ts`.
- Existen docs y configuracion base bajo `/seo-automation`.
- Google Search Console y GA4 quedaron conectados por OAuth local de solo lectura.

## Problemas encontrados

- El sitemap inicial solo incluia home, `/crear-web`, `/privacidad` y `/terminos`; faltaban paginas comerciales indexables por servicio.
- No habia landings dedicadas para busquedas BOFU como "desarrollo web en Mexico", "diseno web en Mexico" o "mantenimiento web Mexico".
- El footer no enlazaba servicios principales, por lo que no existia interlinking comercial visible.
- No habia documentacion local para continuar el sistema SEO semanal.
- La creacion de llaves JSON para service account esta bloqueada por politica de organizacion de Google Cloud.

## Riesgos

- Publicar muchas paginas sin revision humana puede diluir calidad. Esta iteracion solo anade paginas madre con intencion comercial clara.
- Los casos de portafolio no deben mencionar metricas, rankings o resultados si no hay evidencia documentada.
- Las credenciales de Google, Stripe, Mercado Pago, OpenAI o Anthropic no deben guardarse en el repo.
- `tsconfig.tsbuildinfo` aparece sin trackear y conviene ignorarlo o limpiarlo fuera de esta tarea.

## Oportunidades

- Convertir los servicios principales en rutas indexables con H1, metadata, canonical, schema, CTAs y enlaces internos.
- Usar el portafolio real como soporte comercial sin inventar resultados.
- Usar GSC/GA4 para detectar oportunidades reales antes de crear nuevas paginas.
- Crear paginas verticales solo cuando haya diferenciacion real por industria y no contenido clonado.

## Quick Wins implementados

- Se anadieron seis paginas comerciales madre:
  - `/desarrollo-web-mexico`
  - `/diseno-web-mexico`
  - `/diseno-ux-ui-mexico`
  - `/paginas-web-para-negocios`
  - `/software-a-medida-mexico`
  - `/mantenimiento-web-mexico`
- Se centralizo la informacion SEO de esas paginas en `lib/seo/service-pages.ts`.
- Cada pagina incluye metadata, canonical, Open Graph, Twitter card, H1 unico, CTAs, FAQ, enlaces internos y JSON-LD de `Service`, `BreadcrumbList` y `FAQPage`.
- Se actualizo `app/sitemap.ts` para incluir las nuevas rutas.
- Se actualizo el header para que sus anchors funcionen tambien desde paginas internas.
- Se agrego un bloque de servicios en el footer para interlinking comercial.
- Se amplio `.env.example` con variables SEO/GSC/GA4 sin credenciales reales.
- Se creo la base documental de `/seo-automation`.
- Se creo `npm run seo:google-smoke` para validar acceso GSC/GA4 sin imprimir secretos.
- Se actualizo la automatizacion Codex semanal para correr localmente y poder leer `.env.local`.

## Cambios pendientes por decision humana

- Confirmar si `SITE_URL` debe quedarse como `https://www.bryanfdesign.com.mx` como dominio canonico final.
- Revisar copy comercial antes de publicar si se quiere ajustar tono, precios o promesas.
- Crear paginas verticales solo despues de validar prioridad con datos o estrategia comercial.
- Decidir si los reportes semanales con metricas deben quedarse locales o convertirse en issues/PRs.

## Validacion

- `npm run seo:google-smoke`: correcto. GSC respondio `200`, propiedad encontrada con permiso `siteOwner`, Search Analytics respondio `200`, GA4 Data API respondio `200`.
- `npm run build`: correcto. Next genero 18 rutas estaticas/dinamicas e incluyo las seis paginas comerciales nuevas.
- `npm run lint`: no valido porque Next abrio el prompt interactivo para configurar ESLint. No se creo configuracion nueva sin aprobacion.
- Revision de sitemap compilado anterior: `.next/server/app/sitemap.xml.body` contenia las nuevas URLs comerciales.

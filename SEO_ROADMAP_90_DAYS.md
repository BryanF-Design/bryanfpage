# SEO Roadmap 90 Days

## Dias 1-15: base tecnica

- Auditar metadata, sitemap, robots, canonical, schema y enlaces internos.
- Definir dominio canonico final.
- Publicar paginas madre de servicios principales.
- Revisar que sitemap incluya paginas comerciales y legales.
- Confirmar GA4/GSC y variables de entorno necesarias.
- Crear reportes y backlog inicial sin metricas inventadas.
- Completado: conectar GSC/GA4 con OAuth local de solo lectura.
- Completado: programar corrida semanal de Codex.

## Dias 16-45: autoridad comercial

- Revisar copy de las paginas madre con evidencia real del portafolio.
- Crear 2-3 paginas verticales prioritarias solo si tienen diferenciacion comercial:
  - Arquitectos
  - Inmobiliarias
  - Restaurantes o consultorios
- Crear plantillas de casos de estudio para proyectos con informacion suficiente.
- Mejorar interlinking desde home, footer, portafolio y paginas de servicio.

## Dias 46-75: refresh con datos

- Usar `npm run seo:google-smoke` como verificacion previa de credenciales.
- Consultar GSC y GA4 con scripts de solo lectura.
- Detectar queries con impresiones altas y CTR bajo.
- Detectar queries en posiciones 5-20.
- Detectar paginas con trafico y baja conversion.
- Proponer refresh de title/meta, FAQs, CTAs y enlaces internos.
- Evitar crear nuevas paginas si la intencion ya esta cubierta.

## Dias 76-90: automatizacion estable

- Generar reporte semanal en `/seo-automation/reports`.
- Convertir oportunidades validadas en issues, PRs o tareas locales.
- Revisar resultados a 7, 14 y 28 dias despues de cambios.
- Expandir solo las paginas que demuestren oportunidad comercial o demanda real.
- Si se cambia la automatizacion a worktree aislado, migrar secretos a un entorno seguro de Codex.

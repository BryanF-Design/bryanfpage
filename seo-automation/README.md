# BryanF SEO Automation

Sistema operativo para continuar SEO organico de bryanfdesign.com.mx sin inventar metricas ni crear contenido masivo.

## Que contiene

- `config.example.json`: configuracion esperada sin secretos.
- `keyword-map.json`: mapa inicial de keywords y paginas objetivo.
- `url-map.json`: rutas comerciales y legales importantes.
- `internal-link-map.json`: enlaces internos sugeridos.
- `AUTOMATION.md`: configuracion de la tarea programada de Codex.
- `ENV_LOCAL_SETUP.md`: variables locales requeridas y de donde obtenerlas.
- `google-cloud-setup.md`: resumen tecnico sin secretos de Google Cloud, GSC y GA4.
- `reports/WEEKLY_REPORT_TEMPLATE.md`: formato de reporte semanal.

## Como usarlo

1. Revisa `SEO_SETUP_TODO.md`.
2. Configura variables reales en `.env.local`, no en el repo.
3. Corre build/lint antes de publicar.
4. Valida Google con `npm run seo:google-smoke`.
5. Usa GSC/GA4 solo cuando las APIs respondan correctamente.
6. Genera un reporte semanal y convierte solo las oportunidades validadas en cambios.

## Estado Google

- Search Console: conectado por OAuth local.
- GA4: conectado por OAuth local.
- Service account: creada, pero las llaves JSON estan bloqueadas por politica de organizacion.
- Tarea Codex: activa y configurada para correr localmente los lunes a las 9:00 AM.

## Comandos

```bash
npm run seo:google-smoke
```

El comando lee `.env.local`, renueva el token OAuth y hace consultas pequenas de solo lectura a Search Console y GA4. La salida no imprime secretos.

## Reglas

- No inventar metricas, rankings, resultados ni credenciales.
- No publicar contenido sin revision humana si contiene claims comerciales nuevos.
- No crear paginas por keyword si la intencion ya esta cubierta.
- Priorizar paginas comerciales, metadata, schema, sitemap, interlinking y medicion.

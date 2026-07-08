# Automatizacion Codex

Automatizacion creada en Codex:

- ID: `bryanf-seo-growth-semanal`
- Nombre: BryanF SEO Growth semanal
- Tipo: cron
- Estado: activa
- Frecuencia: semanal, lunes a las 9:00 AM, hora America/Mexico_City
- Workspace: `E:\Github repositories\bryanfpage`
- Entorno de ejecucion: local
- Destino: local
- Modelo: `gpt-5.5`
- Reasoning effort: high

## Por que corre local

La tarea corre en el repo local para poder leer `.env.local`, que contiene el OAuth refresh token de Google necesario para consultar GSC/GA4. Ese archivo esta ignorado por Git y no se sube.

Si mas adelante se cambia a `worktree`, hay que configurar las mismas variables en un entorno seguro de Codex, porque los archivos ignorados no necesariamente se copian al worktree aislado.

## Que hace cada corrida

1. Revisa el estado del repo y preserva cambios existentes.
2. Lee la documentacion SEO local.
3. Revisa variables de entorno disponibles sin imprimir secretos.
4. Valida acceso GSC/GA4 con `npm run seo:google-smoke` si `GOOGLE_AUTH_MODE=oauth` y los OAuth vars existen.
5. Detecta la siguiente tarea SEO de mayor impacto.
6. Implementa una mejora acotada y verificable.
7. Valida `npm run build`.
8. Intenta `npm run lint` solo si no requiere configuracion interactiva.
9. Actualiza documentacion y reporte semanal.
10. Entrega resumen con archivos modificados, validaciones y pendientes humanos.

## Limites

- No inventa metricas, rankings, casos, resultados ni credenciales.
- No publica contenido fuera del repo.
- No expone secretos en prompts, reportes o commits.
- No usa datos de GSC/GA4 sin respuesta real de API o evidencia local.
- No crea contenido masivo sin valor.

## Env requerido

Ver `seo-automation/ENV_LOCAL_SETUP.md`.

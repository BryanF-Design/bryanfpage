# Rebranding 2026 — Apex / Taller de precisión

Fecha de aprobación: 26 de julio de 2026

Marca pública: **BryanF Design**

Tesis: **Precisión, ritmo y conexión. Diseño y código hechos para rendir.**

Este documento sustituye el borrador interno “Taller R”. La auditoría completa y los criterios de
aceptación viven en [`REBRAND_AUDIT_AND_PLAN.md`](./REBRAND_AUDIT_AND_PLAN.md).

## Decisiones vigentes

- Se conservan logotipo, verde-negro, hueso, lima, tipografías, Lumina y `Haz que pase.`.
- Autos, cultura visual japonesa y geometría de red se traducen a principios de diseño; no a una
  fan page, una réplica de auto ni recursos reconocibles de propiedad intelectual ajena.
- La firma propia es la **Línea de tracción**: trazada, nodo de ápex, tensión y reunión.
- La voz de Bryan aparece después de demostrar trabajo real y antes del proceso comercial.
- La Home une el antiguo `Garage` con `MeetBryan`; no añade una sección personal duplicada.
- El CTA final vuelve a cerrar la página y después solo aparece el footer.
- No se añade un color de marca, cursor personalizado, easter egg VTEC ni nuevo canvas WebGL.
- Movimiento decorativo: una entrada breve y reposo. Movimiento reducido siempre tiene una salida
  estática.

## Aplicación

| Superficie | Tratamiento |
|---|---|
| Hero | Promesa inmediata, laptop existente y Línea de tracción |
| Proyectos | Evidencia temprana, jerarquía sobria y foco visible |
| Bryan | Retrato + precisión, ritmo y conexión; gustos como inspiración |
| Proceso | Nodos conectados por una ruta visual |
| Lumina | Personaje propio y apoyo comercial, sin competir con el configurador |
| Precios/configurador | Lógica y oferta intactas; objetivos táctiles accesibles |
| Landings/legales/postcompra | Mismo shell oscuro, retícula y hairlines |
| Footer | Firma estática de autor y Línea de tracción |

## Fuente de verdad técnica

- Tokens: `app/globals.css`
- Firma: `components/ui/traction-line.tsx`
- Narrativa: `components/ui/hero.tsx` y `components/sections/meet-bryan.tsx`
- Orden de Home: `app/page.tsx`
- Texto localizado: `lib/i18n/dictionaries/*`

## Estado de implementación

El sistema quedó implementado en `feat/rebrand-taller-r` y validado con TypeScript, build, smoke
SEO, revisión responsive en seis anchos, teclado, movimiento reducido y Lighthouse comparativo.
La medición de laboratorio mejoró de 64 a un rango de 74–83 en Performance y mantuvo 100 en
accesibilidad, buenas prácticas y SEO. El LCP sigue siendo variable (3.3–4.9 s), por lo que la meta
de ≤ 2.5 s debe confirmarse y terminar de optimizarse con una vista previa de producción.

Siguen pendientes la revisión humana del detalle japonés y el smoke externo del flujo de pago.

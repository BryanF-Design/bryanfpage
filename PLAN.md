# Plan de rediseño — Lumina, orden del sitio y cotizador con pago directo

> Base de trabajo para la intervención descrita en el _Prompt Maestro_ (infografía
> "Rediseño total de la sección Lumina + nuevos planes y cotizador con pago
> directo"). Este documento es la fuente de verdad del **alcance, decisiones y
> orden de implementación**. Se actualiza al cerrar cada fase.

Última actualización: 2026-07-23 · Rama: `claude/presentation-planning-uokjtu`

---

## 1. Diagnóstico (auditoría)

**Stack.** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind + tokens
propios en `app/globals.css` · framer-motion · three.js · Lenis (smooth scroll).
Pagos ya integrados: **Stripe** (`app/api/stripe-checkout`) y **Mercado Pago**
(`app/api/mercadopago`) + transferencia por WhatsApp. Chat de Lumina sobre
`app/api/openai-chat`. i18n propio en 7 idiomas (`lib/i18n`), tipado contra `es`.
SEO técnico ya robusto: `sitemap.ts`, `robots.ts`, 6 landings de servicio,
`middleware.ts`, analítica (GA + Clarity), documentado en `SEO_*.md`.

**Lo que ya existe y funciona (conservar):**

- Sección de Lumina con holograma 3D girable + moods (`lumina-feature.tsx`) y
  chat flotante (`lumina-chat.tsx`).
- Configurador con pago real (Stripe / Mercado Pago / transferencia), moneda
  MXN/USD y modalidad anticipo/liquidación.
- Servicios de entrada (tarjetas, firma, kit, landing) en `entry-services.tsx`.
- Toda la capa SEO y las 7 traducciones.

**Problemas detectados:**

1. **Precios dispersos.** Los números vivían _hardcodeados_ dentro de
   `configurator.tsx` y como strings sueltos por idioma en el diccionario. No
   había una fuente única de verdad → riesgo de descuadres y difícil de editar.
2. **Orden no óptimo para conversión.** Lumina aparecía en 10.º lugar (después
   de proceso, stack, proyectos, presencia, clientes), pese a ser el hilo
   conductor. El viaje descubrimiento → cotización estaba disperso.
3. **Lumina sin protagonismo en la navegación.** No había enlace directo a la
   sección de Lumina ni a Servicios en el header.
4. **Catálogo incompleto** frente a la propuesta comercial de la infografía
   (faltan Sitio Básico/Profesional, Tienda, paquetes, mantenimiento mensual).

**Riesgos técnicos:** cambiar precios reales por los ilustrativos de la
infografía (bajan el ticket 2-3x); romper el tipado i18n al agregar llaves;
degradar Core Web Vitals si Lumina sube y carga 3D antes de tiempo.

---

## 2. Decisiones tomadas

- **Precios: se conservan los reales de producción.** La infografía propone
  precios más bajos (p. ej. tarjeta digital $299 vs. real $900); se tratan como
  _ilustrativos_ y **no se exponen** hasta que Bryan los confirme (ver §6).
- **Fuente única de verdad:** nuevo `lib/catalog.ts`. Todo precio en MXN vive
  ahí; la copia traducible permanece en i18n. Presentación ≠ dato.
- **Lumina como guía, no como sección aislada:** sube en el orden y entra a la
  navegación.
- **Sin demo separada:** todos los cambios son sobre el proyecto real.

---

## 3. Nuevo orden de secciones (implementado)

Embudo: **Descubrimiento → Guía IA → Confianza → Servicios → Cotización →
Prueba → Dudas → Contacto.**

| # | Sección | Ancla | Rol |
|---|---------|-------|-----|
| 1 | Hero + stats | `#home` | Descubrimiento / propuesta de valor |
| 2 | **Lumina** | `#lumina` | Guía IA (subió del 10.º lugar) |
| 3 | Proceso | `#proceso` | Cómo trabajamos |
| 4 | Stack | `#stack` | Con qué / capacidad |
| 5 | Servicios de entrada | `#servicios-entrada` | Qué ofrecemos |
| 6 | **Configurador** | `#precios` | Cotiza y paga (pegado a servicios) |
| 7 | Portafolio | `#projects` | Prueba de trabajo real |
| 8 | Presencia mundial | `#presencia` | Prueba social |
| 9 | Clientes | — | Prueba social |
| 10 | FAQ | `#faq` | Dudas |
| 11 | Cierre / Bryan / Footer | `#bryan` | Contacto |

Navegación del header actualizada a: **Lumina · Servicios · Precios · Proyectos ·
FAQ**. Todas las anclas existentes se conservan (sin romper enlaces internos ni SEO).

---

## 4. Cambios de esta sesión (Fases 1-3 + base de 7-8)

- `lib/catalog.ts` — **nuevo.** Fuente única de verdad: planes y módulos del
  configurador, precio por sección, precios numéricos de servicios de entrada, y
  tiers propuestos marcados como `proposed` (no expuestos).
- `components/sections/configurator.tsx` — consume el catálogo (se eliminó la
  duplicación de precios; sin cambio de comportamiento ni de números).
- `app/page.tsx` — nuevo orden de secciones por embudo de conversión.
- `components/sections/site-header.tsx` — Lumina y Servicios en la navegación.
- `lib/i18n/dictionaries/*.ts` — llaves `nav.lumina` y `nav.servicios` en los 7
  idiomas.

**Validación:** `npm run build` en verde (type-check + lint + 18 páginas
estáticas). SEO intacto: mismas rutas, anclas, metadatos y componentes SSR.

---

## 5. Roadmap por fases (para continuar)

| Fase | Entregable | Estado |
|------|------------|--------|
| 1 | Auditoría | ✅ (§1) |
| 2 | Protección SEO + respaldo | ✅ (sin tocar rutas/meta) |
| 3 | Arquitectura de información + nuevo orden | ✅ (§3) |
| 4 | Sistema visual / componentes base | ✅ Tokens existentes reutilizados |
| 5 | Nueva presentación de Lumina (capacidades + privacidad) | ✅ base (falta narrativa por pasos) |
| 6 | Chat escritorio + móvil dedicado (dvh/svh, safe areas) | ✅ ya existía; verificado |
| 7 | Servicios, planes y precios | ✅ base (precios reales centralizados) |
| 8 | Cotizador (página propia, guardar/retomar, enviar por correo) | ✅ (faltan tiers a confirmar) |
| 9 | Pagos: validación server-side de precios desde catálogo | ✅ (webhooks/idempotencia = futuro) |
| 10 | Flujo post-pago | ✅ redirige a /gracias (briefing existente) |
| 11 | Multidioma (nuevas cadenas en 7 idiomas) | ✅ |
| 12 | Responsive + accesibilidad + rendimiento | ✅ base (auditoría formal pendiente) |
| 13 | Validación final (`build` verde) | ✅ |

### Cambios de la sesión 2

- `lib/quote.ts` — cálculo de cotización compartido cliente/servidor.
- `app/api/stripe-checkout` y `app/api/mercadopago` — recomponen el total desde
  el catálogo y cobran ese número (no el del navegador); redirigen a `/gracias`.
- `app/crear-web` — página React del cotizador (retira el estático legado de esa
  URL; arregla el enlace del sitemap y de Lumina). Persistencia + envío por correo.
- `components/sections/lumina-feature` — tira de capacidades + privacidad.
- `next.config.mjs` — se retira el rewrite de `/crear-web` (ahora es ruta real).

**Pendientes reales (no bloquean producción):** webhooks + idempotencia de pago;
migrar `/gracias` y páginas legales de estático a React; narrativa de Lumina por
pasos; confirmar y activar los tiers propuestos (§6); auditoría formal Lighthouse/WCAG.

---

## 6. Precios pendientes de confirmar (bloquea Fases 7-8)

La infografía propone desdoblar "Desarrollo Web $3,500" en una escalera y sumar
paquetes. Están en `lib/catalog.ts` como `PROPOSED_SERVICES` y **no se muestran**
hasta tener el número real:

| Servicio propuesto | Precio infografía (a confirmar) |
|--------------------|--------------------------------|
| Sitio Web Básico | desde $2,499 |
| Sitio Web Profesional | desde $4,999 |
| Tienda en Línea | desde $6,999 |
| Mantenimiento Web mensual | desde $499 / mes |
| Paquete Emprendedor | desde $999 |
| Paquete Empresa | desde $2,499 |

**Decisión de Bryan requerida:** ¿estos precios son los definitivos, o se
mantiene $3,500 como base y se ajusta la escalera? En cuanto se confirmen, se
pasan a `live` y entran al configurador (Fase 8).

---

## 7. Variables y URLs pendientes

- `NEXT_PUBLIC_USD_MXN_RATE` — tipo de cambio comercial (default 18).
- Redes/portal ya centralizados en `site-header.tsx` y `social-rail.tsx`.
- No hay URLs inventadas: todo enlace externo apunta a cuentas reales existentes.

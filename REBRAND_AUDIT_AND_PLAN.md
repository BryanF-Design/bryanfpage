# BryanF Design — Auditoría y plan de rebranding 2026

Fecha: 26 de julio de 2026  
Estado: dirección propuesta; no autoriza todavía cambios productivos  
Concepto interno recomendado: **Apex / Taller de precisión**

---

## 1. Decisión ejecutiva

BryanF Design no necesita cambiar de logo, colores ni personalidad base. Ya tiene una identidad
reconocible: tinta verde-negra, hueso, lima, tipografía expandida, retículas técnicas, movimiento
y 3D.

El problema real es otro: el sitio explica bien **qué hace Bryan**, pero todavía no deja una
huella suficientemente clara de **quién es Bryan**.

La solución no es convertir la web en una fan page de autos, Japón o Spider-Man. La solución es
traducir esas influencias a principios de diseño:

- **Carreras:** precisión, ritmo, respuesta y trazada.
- **Cultura visual japonesa:** oficio, asimetría, espacio y cuidado material.
- **La red:** conexión, tensión, nodos y sistemas que trabajan juntos.

La tesis de marca será:

> **Precisión, ritmo y conexión. Diseño y código hechos para rendir.**

La marca pública continúa siendo **BryanF Design**. “Taller R” o “Apex” pueden servir como nombres
internos del proyecto, pero no como una submarca visible.

### Regla de densidad

- **80%** trabajo, prueba, oferta y conversión.
- **15%** precisión automotriz + composición japonesa.
- **5%** geometría de red y detalles descubribles.

La personalidad debe sentirse antes de explicarse.

---

## 2. No negociables del brief

Se conserva:

- El logotipo actual, sin redibujarlo.
- La paleta verde-negra, hueso y lima, sin añadir un color de marca.
- `Haz que pase.` como tesis principal.
- Lumina como personaje y herramienta comercial propia.
- El portafolio, precios, configurador, WhatsApp y trato directo.
- Las rutas, metadata, sitemap, JSON-LD y contenido SEO.
- Las opciones de pago y la lógica de `app/api/*`.
- El 3D que ya aporta valor, con mejores límites de rendimiento.

No se hará:

- Un tema de autos, anime, cómic o cyberpunk.
- Un personaje, emblema, máscara, ojos o patrón reconocible de Spider-Man.
- Logos, insignias o una réplica exacta de Honda/Type R como elemento de marca.
- Kanji aleatorio, torii, sol naciente, sakura o clichés japoneses.
- Un cursor temático que reemplace el puntero nativo.
- Otro color “secundario” sin aprobación explícita.
- Otro canvas WebGL sin retirar o consolidar uno existente.

---

## 3. Auditoría de negocio y oferta

`GOALS.md` define como prioridad inmediata conseguir clientes y estabilizar el flujo comercial.
El rebranding, por tanto, debe aumentar memorabilidad **sin ocultar la oferta ni alargar el camino
a contacto o pago**.

La oferta publicada en [bryanfdesign.com.mx](https://www.bryanfdesign.com.mx/) sigue mostrando:

- Desarrollo web: **$3,500 MXN**.
- Actualización: **$1,800 MXN**.
- Mantenimiento: **$1,000 MXN/mes**.
- Entregas desde 3 días hábiles.
- Un mes de seguimiento post-entrega.

También existen servicios de entrada entre $350 y $2,400 MXN. El rebranding debe conservar esa
escalera comercial y evitar que el prospecto perciba el sitio como un portafolio experimental
inaccesible.

### Criterio comercial

Cada intervención visual debe cumplir al menos uno:

1. Explicar mejor el valor.
2. Hacer más memorable a Bryan.
3. Guiar a proyectos, precios, Lumina o contacto.
4. Demostrar capacidad técnica sin ralentizar la experiencia.

Si no cumple ninguno, es decoración y se elimina.

---

## 4. Auditoría del sitio publicado

### Lo que ya funciona

- Hero directo, promesa clara y dos rutas de acción.
- Una paleta distintiva y consistente.
- Trabajo real, precios visibles y prueba social.
- Lumina diferencia a BryanF Design de un portafolio genérico.
- El sitio comunica velocidad, tecnología y ejecución a medida.
- La auditoría Lighthouse de laboratorio mantuvo 100 en accesibilidad, buenas prácticas y SEO.

### Hallazgos prioritarios

| Prioridad | Hallazgo | Impacto |
|---|---|---|
| P0 | Lighthouse móvil: Performance 64, LCP 4.7 s y TBT 460 ms | La promesa de rapidez debe sentirse también en la carga |
| P0 | El H1 es el LCP y acumula ~2.46 s de retraso de render | La entrada animada del mensaje principal está retrasando lo esencial |
| P0 | Aviso de idioma, accesibilidad y Lumina compiten por la franja inferior en móvil | Reduce claridad y tapa parte de los accesos flotantes |
| P0 | El aviso proactivo de Lumina puede cubrir tarjetas del configurador en móvil | Interfiere directamente con una tarea de compra |
| P1 | La voz alterna entre “Creamos” y “Soy Bryan” | La autoría personal se diluye |
| P1 | Proyectos comienzan cerca del 53% y Bryan cerca del 88% del recorrido móvil | Trabajo y autoría aparecen demasiado tarde |
| P1 | La Home ya es muy larga | Añadir una sección completa más debilita el cierre comercial |
| P1 | Auditoría manual: falta skip link; hay controles de 28–40 px e inputs sin etiqueta visible | Lighthouse 100 no sustituye una revisión de uso real |
| P1 | La FAQ presenta encabezados `h3` duplicados/anidados | La estructura semántica necesita corrección |
| P2 | La personalidad visual está concentrada en tecnología, no en autoría | El sitio es fuerte, pero podría pertenecer a otro estudio |

### Línea base medida

Una ejecución Lighthouse móvil del 26 de julio de 2026 obtuvo:

| Métrica | Resultado |
|---|---:|
| Performance | 64 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |
| LCP | 4.7 s |
| FCP | 2.5 s |
| TBT | 460 ms |
| CLS | 0 |
| Transferencia total | 678 KiB |

Es una medición de laboratorio, no datos de campo. Sirve como línea base comparativa.

La revisión a 390 px confirmó que no hay overflow horizontal. En una captura móvil emulada, la
Home publicada alcanzó aproximadamente 20,500 px de alto. El
borrador local de `Garage` mide por sí solo cerca de 2,000 px en móvil. La propuesta debe
**consolidar contenido**, no sumar otra parada al final.

---

## 5. Auditoría técnica

### Base sana

- Next.js 14 App Router, React 18, TypeScript y Tailwind.
- Framer Motion y Lenis.
- Three.js procedural, sin modelos GLTF pesados.
- Siete idiomas.
- Componentes inferiores divididos con `dynamic()`.
- `lib/three/stage.ts` pausa escenas fuera de viewport, limita DPR, respeta movimiento reducido
  y libera recursos al desmontar.
- Las seis landings comerciales comparten renderer y fuente de datos.

### Riesgos actuales

- La Home puede llegar a montar ocho contextos WebGL con el borrador local.
- `LazyMount` retrasa el montaje, pero no desmonta escenas ya visitadas.
- El borrador añade ciclos `requestAnimationFrame` permanentes para cursor/HUD.
- Hay alrededor de 20 usos de `transition-all`; deben sustituirse por propiedades concretas.
- La paleta de Three.js está repetida como valores hexadecimales en varias escenas.
- Las rutas heredadas `/crear-web`, `/privacidad`, `/terminos` y `/gracias` usan otro sistema
  visual y pueden quedar fuera del rebranding.
- `/crear-web` mantiene un loader de pantalla completa todavía visible aproximadamente 1.2 s
  después de `DOMContentLoaded`.
- Faltan `theme-color` y `color-scheme` coherentes con el tema oscuro.
- Existen assets duplicados y videos sin uso; no deben incorporarse por accidente al nuevo sistema.
- No hay suite automatizada de UI; las puertas reales son build, capturas, Lighthouse y smoke tests.

### Superficies que deben compartir marca

1. Home.
2. Renderer de landings SEO.
3. Configurador y pagos.
4. Lumina.
5. Legales.
6. Postcompra `/gracias`.
7. Open Graph, favicon y previews sociales.

---

## 6. Auditoría del WIP local “Taller R”

La rama `feat/rebrand-taller-r` todavía apunta al mismo commit que `main`, pero contiene un
rebranding grande sin confirmar: 15 archivos modificados y varios componentes nuevos. El
TypeScript del WIP pasa. Se considera material previo y no se debe sobrescribir a ciegas.

### Triage

| Elemento del WIP | Veredicto | Razón |
|---|---|---|
| Idea “precisión a alta velocidad, tejida punto por punto” | Conservar | Une las influencias con el oficio |
| Geometría de red SVG | Rehacer con contención | Funciona como firma, no en cada esquina |
| Etiqueta japonesa vertical | Conservar con revisión | Aporta autoría si el japonés es correcto y decorativo |
| `Garage` como sección adicional al final | Fusionar | Rompe el cierre y añade ~2,000 px en móvil |
| Coche Type R procedural exacto | Sustituir | Añade WebGL, riesgo marcario y detalles incorrectos |
| Bermellón `#E8442F` | Retirar | Contradice “no cambiar los colores” |
| Cursor `ApexCursor` global | Retirar | Oculta el puntero, añade rAF y reduce precisión |
| Easter egg `VTEC` | Dejar en espera | Es simpático, pero demasiado literal para la marca |
| Sello hanko interactivo | Convertir en firma estática | Un botón sin resultado es semánticamente engañoso |
| Posiciones `P01…` en proyectos | Conservar solo si informan | La numeración debe expresar orden o selección real |

### Error automotriz que obliga a frenar el WIP

El borrador etiqueta el auto como `FK2 · 2016`, pero modela una triple salida central, rasgo de la
generación FK8 posterior. Honda identifica al FK2 como el Type R de 2015 y al FK8 como el de 2017.
La referencia del usuario es coherente con un FK2 de ciclo 2015–2016, pero antes de dibujar un auto
literal deben confirmarse generación y detalles.

La dirección recomendada evita ese problema: el auto aparece una sola vez como dato biográfico y
su influencia se traduce a aerodinámica, respuesta y trazada.

---

## 7. Territorios de marca explorados

| Territorio | Idea | Personalidad | Conversión | Riesgo |
|---|---|---:|---:|---:|
| **Apex / Taller de precisión** | Trazada, oficio y red como sistema | Alta | Alta | Bajo si se contiene |
| Tokyo Night Run | Señalética, checkpoints y trazos nocturnos | Muy alta | Media | Puede verse gaming/cyberpunk |
| Oficio silencioso | Asimetría, espacio y materiales técnicos | Media-alta | Alta | Puede ocultar demasiado los gustos |

### Recomendación

Usar **Apex / Taller de precisión** con la respiración de **Oficio silencioso**.

El riesgo estético deliberado será uno solo: una firma gráfica propia, no un catálogo de guiños.

---

## 8. Sistema visual propuesto

### Paleta — sin colores nuevos

Los HSL existentes siguen siendo la fuente de verdad.

| Token | Hex aproximado | HSL | Uso |
|---|---|---|---|
| Tinta | `#070D0B` | `160 30% 4%` | Fondo principal |
| Panel | `#0F1512` | `158 18% 7%` | Superficies |
| Hueso | `#F2F3EC` | `70 22% 94%` | Texto |
| Lima | `#B4E332` | `76 76% 54%` | Marca, CTA y firma |
| Niebla | `#95A79E` | `150 9% 62%` | Texto secundario accesible |
| Hairline | `#1F2825` | `156 12% 14%` | Retícula y divisores |

La jerarquía se construirá con área, opacidad, grosor, escala y ritmo; no con un color nuevo.

### Tipografía

- **Archivo:** tesis, títulos y números editoriales.
- **Instrument Sans:** lectura comercial.
- **IBM Plex Mono:** datos reales, especificaciones y pequeñas señales técnicas.
- **Stack japonés del sistema:** ornamento revisado; nunca información esencial sin traducción.

No se añade otra familia descargable.

### Firma distintiva: la Línea de tracción

Un trazo lima original reúne las tres influencias:

1. Nace como una trazada de carrera.
2. Encuentra un nodo de ápex.
3. Se abre brevemente como hilos bajo tensión.
4. Vuelve a reunirse y conduce al contenido o CTA.

Usos máximos:

- Hero.
- Transición a proyectos.
- Ruta del proceso.
- Cierre junto al logo.

No se repite como telaraña en todas las tarjetas.

### Materiales y composición

- Asimetría controlada.
- Espacio negativo como parte del diseño.
- Hairlines, placas técnicas y costuras aerodinámicas.
- Imágenes de trabajo y retrato con tratamiento editorial, no filtros temáticos.
- Una ficha biográfica puede mencionar: “Mi coche favorito es el Honda Civic Type R de 2016”.

### Referencias que se evitan

- Rojo/azul, araña, ojos, máscara o patrón de traje.
- Insignia roja, logotipo H, `Type R` o `VTEC` como recursos de interfaz.
- Auto exacto como héroe de marca.
- Halftone de cómic como textura global.
- Neón japonés genérico y kanji sin revisión humana.

---

## 9. Motion y 3D

### Principio

Lumina y la laptop siguen siendo los dos protagonistas 3D. La nueva autoría entra principalmente
con SVG/CSS o dentro de escenas ya existentes.

### Sí

- Línea de tracción que se dibuja una vez y queda quieta.
- Microinteracciones de 180–240 ms.
- Tensión sutil de nodos al enfocar proyectos.
- Capas estáticas para móvil y movimiento reducido.
- Un perfil aerodinámico original, abstracto y no marcario si hace falta una pieza adicional.

### No

- Nuevo canvas WebGL para el auto.
- Cursor con retraso.
- Animaciones infinitas de UI.
- Scroll secuestrado.
- Sonidos.
- Interacciones exclusivas de hover.

### Presupuesto

- No aumentar el JavaScript inicial.
- No aumentar el número máximo de contextos WebGL.
- Detener todo rAF fuera de viewport.
- Poster estático para escenas no esenciales en móvil, ahorro de datos y movimiento reducido.

---

## 10. Arquitectura de la Home

El orden debe demostrar trabajo, presentar autoría y después facilitar la compra.

```text
┌─────────────────────────────────────────────────────────────┐
│ Header · logo actual · navegación · CTA                    │
├─────────────────────────────────────────────────────────────┤
│ Hero                                                       │
│ Haz que pase. · promesa · dos CTAs                          │
│ Laptop + Línea de tracción                                 │
├─────────────────────────────────────────────────────────────┤
│ Prueba rápida · años · proyectos · entrega                 │
├─────────────────────────────────────────────────────────────┤
│ Proyectos seleccionados · problema → decisión → resultado  │
├─────────────────────────────────────────────────────────────┤
│ Puente de autor                                             │
│ Bryan + precisión · ritmo · conexión                       │
├─────────────────────────────────────────────────────────────┤
│ Proceso + stack                                             │
├─────────────────────────────────────────────────────────────┤
│ Lumina                                                      │
├─────────────────────────────────────────────────────────────┤
│ Servicios · precios · configurador                         │
├─────────────────────────────────────────────────────────────┤
│ Clientes · FAQ                                              │
├─────────────────────────────────────────────────────────────┤
│ CTA final                                                   │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Cambio estructural principal

`MeetBryan` y `Garage` se convierten en una sola sección de autor. Se coloca después de proyectos,
cuando el visitante ya vio capacidad, y antes del tramo comercial final.

Después del CTA final solo queda el footer.

---

## 11. Voz y contenido

### Arquitectura de voz

- **BryanF Design:** claro, profesional y orientado a resultados.
- **Bryan:** primera persona, trato directo y criterio.
- **Lumina:** útil, concreta y transparente.

### Hero propuesto

> **Haz que pase.**  
> Diseño y construyo sitios rápidos, claros y hechos para convertir. Trabajas conmigo de la idea
> al lanzamiento.

### Puente personal

> Me inspiran los autos de alto desempeño, la cultura visual japonesa y la lógica de una red bien
> construida. No los pego como decoración: los traduzco en precisión, ritmo y conexión.

### Tres principios

- **Precisión:** cada elemento tiene una razón.
- **Ritmo:** una experiencia debe sentirse rápida antes de medirla.
- **Conexión:** diseño, código, SEO y negocio trabajan como un sistema.

La referencia al Civic puede aparecer una vez como dato personal, no como argumento de venta.

---

## 12. Plan de implementación

### Fase 0 — Congelar y decidir

Entregables:

- Inventario final del WIP actual.
- Confirmación de que la paleta queda estrictamente igual.
- Confirmación del auto: se asume FK2 de ciclo 2015–2016; no bloquea la dirección abstracta.
- Snapshot seguro del trabajo previo antes de editar.

Puerta de salida:

- Tabla `conservar / rehacer / retirar` aprobada.

### Fase 1 — Prototipo de identidad

Entregables:

- Línea de tracción SVG.
- Hero con una sola intervención nueva.
- Sección unificada Bryan + principios.
- Dos capturas comparativas: 390 px y 1440 px.

Puerta de salida:

- La oferta y CTAs dominan antes que los guiños.
- Cero colores nuevos.
- Cero IP literal.
- Cero nuevo WebGL.

### Fase 2 — Home completa

Entregables:

- Nueva jerarquía de secciones.
- Proyectos con lectura `problema → decisión → resultado`.
- Proceso conectado por la firma visual.
- Dock móvil resuelto para idioma, accesibilidad y Lumina.
- Avisos proactivos que nunca cubren controles ni tarjetas del configurador.
- CTA final como cierre real.

Puerta de salida:

- Navegación y contenido correctos en 320, 375, 390, 768, 1024 y 1440 px.
- Skip link, orden de encabezados, labels y objetivos táctiles de al menos 44 × 44 px.
- Teclado, foco visible y toque.
- Movimiento reducido antes y después de montar la página.

### Fase 3 — Sistema compartido

Entregables:

- Chrome visual aplicado al renderer compartido de landings.
- OG image nueva con logo existente y Línea de tracción.
- Legales y postcompra alineados visualmente.
- Configurador adaptado solo en shell visual; lógica intacta.

Puerta de salida:

- Slugs, H1, metadata, FAQs, JSON-LD, sitemap y enlaces conservados.
- Stripe, Mercado Pago, transferencia y correo sin regresiones.

### Fase 4 — Rendimiento y cierre

Entregables:

- Presupuesto de escenas y rAF.
- Limpieza de assets duplicados solo tras validar referencias.
- Build y smoke tests.
- Lighthouse antes/después.

Objetivos de salida:

- LCP de laboratorio móvil ≤ 2.5 s.
- TBT de laboratorio móvil ≤ 200 ms.
- CLS ≤ 0.1.
- Accesibilidad, buenas prácticas y SEO sin bajar de la línea base.
- Sin errores de consola ni pérdida de contexto WebGL.

---

## 13. Mapa de archivos

### Identidad y Home

- `app/globals.css`
- `tailwind.config.ts`
- `app/page.tsx`
- `components/ui/hero.tsx`
- `components/sections/meet-bryan.tsx`
- `components/sections/projects-showcase.tsx`
- `components/sections/process-orbital.tsx`
- `components/sections/closing-cta.tsx`
- `components/sections/site-footer.tsx`

### 3D y movimiento

- `lib/three/stage.ts`
- `components/three/lazy-mount.tsx`
- Escenas existentes del hero y Lumina

### Contenido

- `lib/i18n/dictionaries/es.ts`
- Diccionarios `en`, `pt`, `de`, `fr`, `ja`, `zh`

### SEO y rutas compartidas

- `components/seo/service-landing-page.tsx`
- `lib/seo/service-pages.ts`
- `app/sitemap.ts`
- `app/robots.ts`

### Superficie heredada

- `public/crear-web.html`
- `public/crear-web.css`
- `public/gracias.html`
- `public/privacidad.html`
- `public/terminos.html`

---

## 14. Checklist de aceptación final

- [ ] Logo sin cambios.
- [ ] Paleta sin colores nuevos.
- [ ] Lumina conserva personalidad y función.
- [ ] No hay personaje, emblema o patrón de IP ajena.
- [ ] El detalle japonés fue revisado por una persona competente.
- [ ] El Civic aparece, como máximo, como referencia biográfica.
- [ ] La Home no crece por añadir una sección personal duplicada.
- [ ] El CTA final vuelve a ser el cierre.
- [ ] No aumenta el número máximo de canvases WebGL.
- [ ] El puntero nativo funciona siempre.
- [ ] Hover tiene equivalentes de foco y toque.
- [ ] Skip link, encabezados, labels y objetivos táctiles pasan revisión manual.
- [ ] Ningún aviso flotante cubre el configurador o un CTA.
- [ ] `prefers-reduced-motion` y el panel interno detienen movimiento no esencial.
- [ ] Build, landings, sitemap y pagos pasan smoke.
- [ ] Lighthouse mejora frente a la línea base.

---

## 15. Próximo paso recomendado

No continuar acumulando cambios sobre el WIP actual.

El siguiente paso es ejecutar únicamente la **Fase 0** y después construir un prototipo acotado de
dos piezas:

1. Hero con Línea de tracción.
2. Sección unificada Bryan + precisión, ritmo y conexión.

Solo cuando ambas piezas se vean profesionales, personales y más rápidas que la base se propaga
el sistema al resto del sitio.

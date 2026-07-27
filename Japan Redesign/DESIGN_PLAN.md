# Japan Redesign: plan maestro

Fecha: 27 de julio de 2026

## 1. Tesis

BryanF Design se presenta como un estudio que convierte una idea en algo que
funciona, se mueve y puede vender. La cultura automotriz japonesa entra como
una influencia personal y una forma de ordenar la experiencia: atención al
detalle, lectura clara, ritmo controlado y mejora continua. El sitio no será
una fan page de autos ni un collage turístico de Japón.

Nombre interno de la dirección: **Ruta de arranque**.

La página tiene un solo trabajo: demostrar el nivel del estudio y llevar a una
persona desde el primer impacto hasta un proyecto cotizado, sin romper el
contacto directo, las rutas, los idiomas ni los pagos.

## 2. Lo que se conserva

- Marca pública: BryanF Design.
- H1 y cierre de marca: `Haz que pase.`
- Paleta verde-negro, hueso y lima.
- Oferta, precios, monedas, módulos y medios de pago.
- Las siete versiones de idioma.
- Lumina y su lógica.
- Portafolio y todos sus destinos.
- IDs, anclas, rutas públicas y portal de clientes.
- Metadata, canonicals, schemas, sitemap, robots, OG y automatización SEO.
- Google Analytics, Clarity y eventos de conversión.
- APIs, webhooks, validación de cotizaciones y almacenamiento local.

## 3. Lo que cambia

- Preloader real y accesible.
- Hero, narrativa visual y composición.
- La laptop 3D deja el hero y su lugar lo ocupa el Civic Type R proporcionado.
- Jerarquía, ritmo vertical, fondos, paneles, tarjetas y transiciones.
- Presentación de proyectos, proceso, historia personal, stack, Lumina,
  servicios, cotizador, presencia, FAQ, CTA y footer.
- Sistema de microcopy en español, conservando hechos, intención comercial y
  palabras clave existentes.
- Experiencia táctil y lectura móvil.

## 4. Sistema visual

### Color

| Token | Hex | Uso |
|---|---:|---|
| Sumi verde | `#07110D` | Fondo principal actual |
| Carbono | `#0F1813` | Superficies y profundidad |
| Hueso | `#F2F3EC` | Texto principal |
| Lima BryanF | `#B4E332` | CTA, foco, rutas y estados activos |
| Rojo señal | `#E8342A` | Arranque, sello y un punto de tensión |
| Hairline | `#273128` | Retícula, separadores y datos |

El rojo no reemplaza la lima ni crea una segunda paleta. Se limita a señales
de arranque, un sello editorial y pequeños reflejos del escenario 3D. La
justificación es doble: conecta con la señal roja de Type R y permite separar
un estado crítico de la acción principal de marca. Su presencia visual no
debe superar aproximadamente el 5%.

### Tipografía

- Display: Archivo Expanded, ya alojada localmente.
- Texto: Instrument Sans, ya alojada localmente.
- Datos y navegación: IBM Plex Mono, ya alojada localmente.
- Japonés: stack CJK del sistema existente. No se descarga una fuente pesada.

El latín lleva la información. El japonés identifica acciones o conceptos
reales y siempre aparece con una lectura o traducción cercana.

### Vocabulario japonés permitido

| Texto | Lectura | Uso |
|---|---|---|
| `準備` | junbi | Preparación durante el preloader |
| `始動` | shidō | Arranque al terminar el preloader |
| `設計` | sekkei | Diseño o planeación |
| `実装` | jissō | Implementación |
| `走り` | hashiri | Conducción o comportamiento dinámico |

No se usarán frases largas sin validación, símbolos religiosos como recurso
decorativo ni caracteres elegidos por su forma.

### Materiales

- Negro verdoso con grano fino.
- Tramas halftone inspiradas en impresión editorial y material automotriz.
- Líneas de carretera, coordenadas y marcas de registro.
- Reflejos lima y rojo con intensidad contenida.
- Bordes rectos y radios pequeños. Los paneles se sienten ensamblados, no
  flotando como tarjetas genéricas.

## 5. Firma

La firma de la experiencia es la **Ruta de arranque**:

1. El preloader pasa por preparación y arranque con una línea que recuerda un
   tacómetro sin copiar un tablero real.
2. La misma línea entra al hero y se convierte en una ruta.
3. El Civic 3D aparece sobre esa ruta y cambia de ángulo con el scroll.
4. La ruta reaparece en proceso, proyectos y presencia para conectar la
   página completa.

El auto no aparece como decoración. Explica una influencia personal y sirve
como demostración visible de interacción 3D, dirección de arte y rendimiento.

## 6. Arquitectura de la home

```text
┌──────────────────────────────────────────────────────────────┐
│ PRELOADER  準備 → 始動       línea / progreso / salida       │
├──────────────────────────────────────────────────────────────┤
│ HEADER           marca / navegación / idioma / cliente       │
├───────────────────────────────┬──────────────────────────────┤
│ HAZ QUE                       │ CIVIC TYPE R 3D              │
│ PASE.                         │ ruta / datos / drag          │
│ promesa + CTA                 │ scroll: frente → perfil      │
├───────────────────────────────┴──────────────────────────────┤
│ PRUEBA RÁPIDA      experiencia / proyectos / entrega         │
├──────────────────────────────────────────────────────────────┤
│ PROYECTOS          galería editorial, evidencia primero      │
├───────────────────────┬──────────────────────────────────────┤
│ RETRATO / AUTOR       │ historia personal, sin biografía     │
│                       │ inflada ni historia copiada de Honda  │
├───────────────────────┴──────────────────────────────────────┤
│ PROCESO        ruta continua: cotiza → lanza → seguimiento   │
├──────────────────────────────────────────────────────────────┤
│ STACK / LUMINA / RECORRIDO COMERCIAL                         │
├──────────────────────────────────────────────────────────────┤
│ SERVICIOS + CONFIGURADOR Y PAGOS INTACTOS                    │
├───────────────────────┬──────────────────────────────────────┤
│ PRESENCIA + JAPÓN     │ globo / México / España / Francia /  │
│                       │ Japón                                 │
├───────────────────────┴──────────────────────────────────────┤
│ CLIENTES / FAQ / CTA / FOOTER                                │
└──────────────────────────────────────────────────────────────┘
```

### Móvil

```text
┌──────────────────────┐
│ marca     idioma  ☰  │
├──────────────────────┤
│ HAZ QUE PASE.        │
│ CTA                  │
│                      │
│ CIVIC 3D / fallback  │
│ arrastra ↔           │
├──────────────────────┤
│ datos reales         │
├──────────────────────┤
│ una idea por bloque  │
│ proyectos verticales │
│ autor + retrato      │
│ proceso apilado      │
│ oferta y pago        │
└──────────────────────┘
```

En teléfono no se reduce la versión de escritorio a escala. Se cambia el
orden, se acortan las permanencias sticky, se limitan DPR y partículas, se
mantiene el gesto de arrastre horizontal y se reserva el scroll vertical.

## 7. Motion

- Preloader: 1.4 a 2.2 segundos como máximo. No espera indefinidamente el GLB.
- Hero: una escena sticky; el scroll gira el Civic y desplaza la ruta.
- Proyectos: entrada por máscara y profundidad corta, una vez por tarjeta.
- Secciones: una coreografía principal por bloque. Nada flota sin motivo.
- Hover: desplazamientos de 2 a 4 px, luz y subrayado de ruta.
- Touch: estado presionado visible y objetivos mínimos de 44 px.
- Reduced motion: contenido inmediato, modelo estático, sin loops ni sticky
  prolongado.
- Ahorro de datos o conexión lenta: fallback ligero y activación manual del
  modelo.

## 8. Tratamiento del modelo 3D

- El GLB original se convirtió a un paquete glTF 2.0 con geometría cuantizada
  y texturas WebP externas. El resultado baja de 11.91 MB a 6.82 MB sin exigir
  un decoder adicional en tiempo de ejecución.
- Carga diferida después del contenido crítico.
- Canvas limitado a DPR bajo en móvil y moderado en desktop.
- Pausa fuera de viewport y con pestaña oculta.
- Luces propias, suelo oscuro y halo de ruta. Sin HDR externo.
- Arrastre con mouse o dedo.
- Limpieza explícita de geometrías, materiales, texturas y contexto WebGL.
- Fallback SVG/CSS disponible antes de cargar, con movimiento reducido o si
  WebGL falla.
- El preloader informa carga de la experiencia, no finge representar el
  porcentaje del archivo 3D.

## 9. Copy

Reglas:

- Español directo, específico y con ritmo desigual.
- Mantener `Diseño y desarrollo web en México`, `Haz que pase.`, servicios,
  precios y condiciones.
- Evitar “experiencias inolvidables”, “soluciones innovadoras”, “no solo...
  sino”, grupos forzados de tres y conclusiones promocionales vacías.
- No afirmar datos, resultados o clientes que no estén en el repositorio.
- La historia del Civic se usa como contexto creativo, no como contenido.
- La mención del Type R 2016 queda en primera persona y no se convierte en una
  cronología de Honda.

## 10. Autocrítica de dirección

La primera lectura del brief podía terminar en el default negro + neón +
kanji. Eso habría servido para cualquier proyecto de gaming. Se descarta.

La revisión amarra cada gesto a una fuente concreta:

- Negro, lima y precisión pertenecen a BryanF.
- El Civic pertenece a la historia personal de Bryan.
- Las rutas, señales y coordenadas pertenecen al mundo de movilidad.
- El japonés nombra acciones reales del proceso.
- El rojo solo marca arranque y tensión Type R.

También se descartan como recursos principales: torii, geishas, samuráis,
sakura, sol naciente, glitch constante, HUD de videojuego genérico y
fotografías de referencia con derechos o texto dudoso.

## 11. Archivos congelados

No se modifican:

- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `lib/seo/service-pages.ts`
- `components/seo/service-landing-page.tsx`
- `components/analytics/*`
- `lib/analytics.ts`
- `middleware.ts`
- `next.config.mjs`
- `app/api/*`
- `lib/catalog.ts`
- `lib/quote.ts`
- `lib/currency.ts`
- `lib/notify.ts`
- Metadata y scripts de páginas legales/postpago.
- `seo-automation/*` y documentos `SEO_*`.

## 12. Verificación

- Build de producción y TypeScript.
- Smoke de acceso GSC/GA4.
- Comparación de archivos SEO/trackers protegidos contra `HEAD`.
- Rutas, anclas y enlaces.
- Flujo visual del configurador sin ejecutar un cargo.
- Consola sin errores.
- Desktop: 1024, 1280, 1440 y 1920.
- Móvil: 320, 375, 390 y 430.
- Teclado, foco, menú, skip link y panel de accesibilidad.
- Movimiento reducido y ahorro de datos.
- Rendimiento de carga con el GLB diferido.

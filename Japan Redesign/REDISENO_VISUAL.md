# Rediseño visual — plan estratégico

Fecha: 27 de julio de 2026
Alcance: **solo la capa visual.** No se toca información, estructura de
secciones, rutas, lógica, SEO ni pagos.

---

## 1. Diagnóstico del sitio actual

Lo revisé corriendo (capturas a 1440×900 y 390×844, recorrido completo de
18 100 px). Lo que falla no es la calidad de ejecución, es que **nada compone**.

| Problema | Evidencia |
|---|---|
| El contenido flota en un vacío negro sin límite | Entre secciones hay pantallas enteras de negro muerto (y≈9900: 60% del viewport vacío) |
| Las líneas del hero no describen nada | La curva verde cruza el auto por detrás y sale por la esquina. No enmarca, no separa, no dirige la mirada |
| El preloader imita un tacómetro | Aguja + marcas + arco. Es la metáfora más literal posible y no anticipa nada de lo que sigue |
| El 3D se lee como visor de assets | `GridHelper` verde + piso plano + tubo lima + esfera roja pulsando: el auto está sobre una grilla de videojuego, no sobre un piso |
| El auto viene con ficha explicativa | Panel «UNA OBSESIÓN PERSONAL, LLEVADA A 3D / CIVIC TYPE R · 2023» + chip «TYPE R». Explica lo que la imagen ya dice |
| El japonés es adorno de 11 px | `走り` al margen a 60% de opacidad. Decorativo, no estructural |
| El titular ocupa 17vw | `HAZ QUE PASE.` compite con el auto en vez de convivir |
| Las fotos no pertenecen al mismo mundo | Capturas de proyecto a color pleno junto a una UI de tinta y lima |

La paleta, la tipografía y el código están bien. **Lo que falta es sistema de
composición.**

---

## 2. Lo que dice la carpeta de referencia

Once imágenes. Descontando las que son fan-art de Japón, el sistema que
comparten es consistente y muy citable:

1. **Todas están enmarcadas.** Hairline a ~4% del borde. El contenido vive
   dentro de una hoja, nunca en un lienzo infinito.
2. **Disco sólido como ancla.** El hinomaru aparece en 5 de 11, siempre detrás
   del sujeto, a veces recortado por el marco.
3. **Tipografía vertical de tamaño arquitectónico.** `JAPAN` baja por el borde
   izquierdo a la altura completa de la hoja.
4. **Tira de datos sin explicación.**
   `35.3696°N 138.7274°E · Mt. Fuji · Yamanashi/Shizuoka · −3°C`
   Hechos. Ni una palabra de por qué están ahí.
5. **Sello rojo cuadrado** abajo a la izquierda.
6. **Trama impresa** sobre la foto: grano, halftone, papel.
7. **Banda de olas (青海波)** cerrando la composición abajo.
8. **Numeración de serie:** `Poster No. 001/182` + código de barras.

De las referencias externas rescato dos cosas más:

- **Toyota JMS 2025:** foto a sangre con dithering visible, display gigante
  encima y una palabra fantasma en tono oscuro debajo. La fecha va entre dos
  hairlines.
- **hirotos.com:** el preloader es negro absoluto con **una sola línea
  monoespaciada que se decodifica desde ruido**. Ni aguja, ni barra, ni logo.

---

## 3. Los ocho recursos del sistema

Cada uno reemplaza algo concreto. Ninguno es decoración suelta.

### 版面 · El marco de página
Hairline fijo a 14–22 px del borde, con ticks en las esquinas y etiquetas
corriendo por los bordes. **Reemplaza:** el vacío negro sin límite.
Es el recurso que más cambia la lectura completa del sitio.

### 日の丸 · El disco
Ancla circular detrás del sujeto. **Reemplaza:** las curvas verdes sueltas.
- En el hero: disco de tinta elevada con arco bermellón de 1 px. No es rojo
  pleno — el rojo sigue por debajo del 5%.
- En el preloader: **sí** bermellón sólido. Es el único momento donde el
  hinomaru real vale, y dura 1.6 s.

### 縦組み · Columna vertical
Tipografía vertical a escala de página en los márgenes.
**Reemplaza:** la etiqueta `走り` de 11 px al 60%.

### データ帯 · Tira de datos
Coordenadas, hora, lectura japonesa. Corre por el borde inferior del marco.
**Reemplaza:** el panel «UNA OBSESIÓN PERSONAL, LLEVADA A 3D» y el chip
«TYPE R». El auto no lleva ficha: lleva contexto.

### 落款 · El sello de capítulo
Sello bermellón con el kanji de cada sección.
**Reemplaza:** el cuadrito lima genérico de los eyebrows.

### 網点 · Halftone sobre imagen
Trama de impresión real sobre fotografía. **Reemplaza:** capturas a color
pleno que no pertenecen al mismo mundo que la UI.

### 青海波 · La banda de olas
Banda de olas como separador entre secciones.
**Reemplaza:** los huecos negros muertos.

### 章 · Numeración de capítulo
`章 01 / 08` en el margen, con el kanji de la sección.
**Reemplaza:** nada. Es lo que le da columna vertebral al scroll.

---

## 4. La idea que amarra todo

> **El preloader dibuja el marco dentro del cual vive el sitio.**

La secuencia es: campo de tinta → se traza el marco → el disco bermellón
crece desde el centro → `準備` se convierte en `始動` → una línea mono se
decodifica de ruido a `BRYANF DESIGN` → el campo se levanta **y el marco se
queda.**

Eso responde a «el preloader no representa nada»: ya no es una animación
antes de la página. Es la página construyéndose. El marco que ves nacer es
literalmente el mismo que te acompaña los 18 000 px siguientes.

---

## 5. El 3D, corregido

Los elementos 3D se conservan — cambia cómo se presentan.

**Se elimina de la escena:**
- `GridHelper` verde (la grilla de videojuego)
- El tubo lima `TubeGeometry` que cruza el piso
- La esfera roja que pulsa

**Se agrega:**
- Sombra de contacto real, para que el auto **apoye** en vez de flotar
- Luz clave más neutra: el rim lima bajó de intensidad 22 a 6, porque estaba
  tiñendo de verde toda la carrocería
- Rim bermellón contenido en el lado opuesto
- Cámara más baja y lente más largo: encuadre de póster, no de inspector

**El horizonte ya no vive en la escena.** Es una hairline del DOM alineada
con el centro del disco. Una línea, y carga peso.

---

## 6. Aplicación por sección

| Sección | Kanji | Qué cambia |
|---|---|---|
| Preloader | 準備 → 始動 | Reconstruido completo |
| Hero | 走り | Marco, disco, tategaki, tira de datos, sin ficha del auto |
| Cifras | 記録 | Tira de instrumento, sin caja |
| Proyectos | 作品 | Halftone en las capturas, numeración de serie |
| Bryan | 作者 | Retrato en halftone, sello de autor |
| Proceso | 工程 | Capítulos numerados sobre la banda de olas |
| Stack | 道具 | Rejilla más apretada, sin celdas vacías |
| Lumina | 案内 | Se respeta la lógica, cambia el encuadre |
| Servicios / Cotizador | 品書 | **Solo tipografía y marco. Cero cambios de lógica** |
| Presencia | 世界 | El globo dentro del disco |
| FAQ / CTA / Footer | 結 | Banda de olas + sello de cierre |

---

## 7. Límites duros

**No se toca:**
`app/layout.tsx` · `app/robots.ts` · `app/sitemap.ts` · `lib/seo/*` ·
`components/seo/*` · `components/analytics/*` · `lib/analytics.ts` ·
`middleware.ts` · `next.config.mjs` · `app/api/*` · `lib/catalog.ts` ·
`lib/quote.ts` · `lib/currency.ts` · `lib/notify.ts` · `seo-automation/*` ·
documentos `SEO_*`

**No cambia:** la paleta, los precios, los módulos, las monedas, los medios de
pago, las rutas, las anclas, los siete idiomas, ni un solo texto informativo.

**Sí cambia:** el copy explicativo que describe el propio diseño
(«Una obsesión personal, llevada a 3D»). Eso no es información del negocio,
es una nota al pie sobre una decisión de arte — y es exactamente lo que
sobra.

---

## 8. Reglas que el sistema no puede romper

- El bermellón nunca toca un CTA y se mantiene por debajo del 5%.
- El japonés siempre viaja con lectura o traducción al lado.
- Una coreografía principal por sección. Nada se mueve sin motivo.
- `prefers-reduced-motion`: el marco se dibuja instantáneo, el disco no crece,
  el 3D queda estático.
- Objetivos táctiles de 44 px como mínimo.
- El marco se retira por debajo de 480 px de ancho: en teléfono el borde de la
  pantalla ya es el marco.

---

## 9. Estado de implementación

Implementado y verificado. 16 archivos tocados, ninguno de la lista congelada.

### Piezas nuevas

| Archivo | Qué es |
|---|---|
| `components/japan/page-frame.tsx` | 版面 — el marco fijo de página |
| `components/japan/chapter-mark.tsx` | 章 — sello + numeración de serie |
| `components/japan/seigaiha-rule.tsx` | 青海波 — banda de olas entre secciones |
| `app/globals.css` | Ocho primitivas nuevas: marco, disco, tategaki, tira de datos, sello, halftone, olas, capítulo |

### Reescrito

- **`ignition-preloader.tsx`** — fuera el tacómetro. Ahora traza el marco de la
  página, el disco bermellón crece desde el centro, `準備 → 始動` en vertical
  sobre el disco y la firma se decodifica desde ruido.
- **`hero.tsx`** — fuera las dos curvas sueltas, el panel «Una obsesión
  personal, llevada a 3D» y el chip «TYPE R». Dentro el disco, el horizonte,
  el 縦組み a escala de página y la tira de datos. El titular bajó de 17vw a
  13vw y de 8rem a 6.15rem.
- **`civic-scene.tsx`** — fuera `GridHelper`, el piso plano, el tubo lima y la
  esfera roja pulsando. Dentro sombra de contacto en canvas, cámara más baja y
  el rim lima de intensidad 22 → 6, que era lo que teñía de verde el auto.

### Corregido de paso

- `.route-grid` pintaba una vertical dura al 50% del ancho **en once
  secciones**. Era la «línea porque sí» más repetida del sitio. Eliminada en el
  CSS, no en once sitios.
- `TractionLine` flotaba en Proyectos al 13% de opacidad desbordada un 18% por
  la derecha. Se queda solo donde una firma tiene sentido: el cierre del footer.
- La diagonal bermellón a 112° del preloader: eliminada.
- **Mismatch de hidratación** en el decodificador: el ruido inicial salía de
  `Math.random()`, así que servidor y cliente producían cadenas distintas y
  React tiraba toda la raíz a render de cliente. El primer render ahora es
  determinista.

### Verificación

- `npx tsc --noEmit` — limpio
- `npm run build` — 19 rutas generadas, APIs, sitemap y robots intactos
- Consola del navegador — sin errores en el recorrido completo
- Capturas a 1440×900 y 390×844, recorrido de 18 296 px
- `git diff` contra `HEAD` sobre la lista congelada — **sin cambios**, incluidos
  los siete diccionarios de idioma

### Pendientes menores

- `modelStudy` quedó sin uso en los siete diccionarios. Se deja intacto: tocar
  los diccionarios por una clave muerta no valía el riesgo.
- Aviso preexistente de framer-motion sobre un contenedor de scroll sin
  posición (`meet-bryan` / `lumina-*`). No lo introduce este trabajo.
- El marco solo está montado en la home. Extenderlo a las landings de servicio
  exige tocar `components/seo/service-landing-page.tsx`, que está congelado.
- Se añadió la configuración `next-redesign` (puerto 3210) a
  `.claude/launch.json` porque el 3000 estaba ocupado por un proceso colgado.

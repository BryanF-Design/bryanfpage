# Rebranding 2026 — 「TALLER R」

> Rama: `feat/rebrand-taller-r` · Base: `main` (3da7125)
> Objetivo: que el sitio siga vendiendo como estudio profesional, pero que **se sienta de Bryan** —
> carreras, cultura japonesa y la red de araña como geometría.

---

## 1. Auditoría del sistema actual

### 1.1 Stack

| Capa | Qué hay |
|---|---|
| Framework | Next.js 14.2 (App Router) + TypeScript + Tailwind |
| Animación | framer-motion 11, Lenis (smooth scroll) |
| 3D | **three.js puro** (sin react-three-fiber), orquestado por `lib/three/stage.ts` |
| i18n | 7 idiomas (es, en, pt, de, fr, **ja**, zh) tipados contra `dictionaries/es.ts` |
| Pagos | Stripe + Mercado Pago + transferencia — `components/sections/configurator.tsx` + `app/api/*` |

### 1.2 Sistema visual vigente

El sitio **ya tiene una tesis**, y es buena. `app/globals.css` la declara literalmente:

> *"taller de precisión: tinta verde-negra con atmósfera, hueso para texto, la lima de marca
> #B4E332 como único acento. Nada de negro neutro: el fondo siempre tira a verde."*

- **Color:** fondo `160 30% 4%` (tinta verde-negra), texto hueso `70 22% 94%`, lima `76 76% 54%`.
- **Tipografía:** Archivo (display, `font-stretch: 124%` — expandido), Instrument Sans (cuerpo),
  IBM Plex Mono (etiquetas técnicas, `.tech-label`, tracking `0.22em`).
- **Texturas:** `.bg-blueprint` (retícula de plano de obra), `.bg-grain`, `mesh-glow-a/b/c`.
- **Detalles:** `.corner-ticks` (esquinas tipo visor de cámara), `.text-stroke-*` (tipografía fantasma).
- **3D:** terreno de partículas en el hero, laptop que se abre con el scroll, escombros de alambre
  (`parallax-shards`), globo, orbital de proceso, holograma de Lumina.

### 1.3 Diagnóstico

**Lo que está bien y NO se toca:**

- La disciplina de performance en `lib/three/stage.ts` es de primera: el loop solo corre en
  pantalla + pestaña visible, DPR capado, dispose completo, `prefers-reduced-motion` dibuja
  fotogramas estáticos. Todo 3D nuevo pasa por ahí, sin excepción.
- El code-splitting del `app/page.tsx` (todo below-the-fold en `dynamic()` con SSR encendido).
- El configurador de pagos, las rutas `app/api/*`, Lumina, y toda la metadata SEO/canónica.
- El logo y el verde de marca.

**El hueco real (lo que pide el rebranding):**

El sitio es **excelente y anónimo**. Podría ser el estudio de cualquiera. Dice *qué* hace Bryan
(servicios, precios, portafolio) pero no dice *quién* es. `meet-bryan.tsx` es la única sección
personal y se queda en la foto + tres chips genéricos ("Diseño + código", "Trato directo").

Además:
- La paleta tiene **un solo acento**. Sin un segundo tono, no hay jerarquía posible entre
  "esto es un CTA" y "esto es un detalle de autor".
- No hay marca de autor en ningún lado: nada firma el trabajo.
- El vocabulario visual (blueprint, corner-ticks, telemetría implícita) **ya apunta a taller y
  precisión** — el rebranding no tiene que romper nada, tiene que **terminar la frase**.

---

## 2. Concepto: 「TALLER R」 — *pit lane, no vitrina*

### 2.1 La tesis

Las tres obsesiones no son tres temas pegados con cinta. Son **una sola idea**:

> **Precisión a alta velocidad, tejida punto por punto.**

- **Carreras / Type R** → precisión bajo presión. Nada sale si no rinde.
- **Japón / 職人 (shokunin)** → el oficio: la obsesión por el detalle que nadie va a notar,
  pero que se siente.
- **Araña** → la red *como geometría*. Nodos e hilos. Una web literalmente **es** una red.

El CSS del sitio ya se llama a sí mismo "taller de precisión". El rebranding solo lo lleva
hasta el final: el taller se vuelve **pit lane**, con oficio japonés y geometría de red.

### 2.2 Cómo se traduce cada obsesión (sin disfraz, sin caer en fan page)

| Obsesión | Traducción de diseño | Dónde vive |
|---|---|---|
| **Type R / carreras** | HUD de telemetría, tacómetro, zona roja, tiempos de vuelta, grid de salida | Barra de scroll = tacómetro · stats = telemetría · proyectos = pizarra de tiempos · proceso = pit stop |
| **Japón** | 職人, tipografía vertical, sello *hanko*, 間 *ma* (aire), bermellón 朱 | Etiquetas verticales de sección · sello firmando el footer · ritmo/respiración |
| **Araña** | La red como geometría: nodos + hilos, líneas que se anclan, *spider-sense* | Esquinas de sección · reveals de scroll · cursor · fondo 3D |

### 2.3 El movimiento clave: **un** color nuevo

**朱 bermellón — `#E8442F` (`hsl(6 78% 52%)`)**

Es, al mismo tiempo:
- el rojo de la insignia **H** de Honda / la zona roja del tacómetro,
- el rojo del **torii** y del sello *hanko* japonés,
- el rojo del traje.

**Un color, las tres obsesiones, cero ruido de marca.** Reglas de uso:

- Menos del **5% del área** de cualquier pantalla.
- **Nunca en un CTA.** El lima sigue siendo el único color de conversión — no se toca el embudo.
- Solo para: zona roja del tacómetro, sello *hanko*, faros del Type R, nodos de anclaje,
  y el acento de "modo VTEC".

> Bryan pidió no cambiar colores ni logo. Esto **no** cambia la paleta: la lima y el hueso siguen
> siendo el 95%+. El bermellón entra como tinta de detalle, del mismo modo que un sello rojo
> sobre un grabado japonés no cambia el grabado.

### 2.4 Tipografía japonesa — coste cero

Los kanji ornamentales usan **el stack de sistema**, no una fuente descargada:

```
--font-jp: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic",
           "Noto Sans JP", "Meiryo", sans-serif;
```

Windows, macOS, iOS y Android traen todos una gótica CJK. **0 KB de descarga** frente a los
1–4 MB de Noto Sans JP completo. A tamaño de ornamento, la diferencia de trazo entre OS es
irrelevante.

---

## 3. Plan de ejecución

### Fase 0 — Fundación (tokens y primitivas)

1. `--redline: 6 78% 52%` + `--font-jp` en `app/globals.css`; `redline` en `tailwind.config.ts`.
2. Utilidades nuevas: `.web-corner` (esquina de telaraña), `.vertical-jp` (`writing-mode: vertical-rl`),
   `.hud-frame`, `.halftone` (puntos Ben-Day sutiles), `.redline-zone`.
3. `components/ui/web-corner.tsx` — nodo + hilos SVG que reemplaza/complementa `.corner-ticks`.
4. `components/ui/vertical-label.tsx` — etiqueta vertical `kanji + romaji`.
5. `components/ui/apex-cursor.tsx` — retícula de ápex (HUD de carreras) que al pasar sobre un CTA
   abre tres arcos de *spider-sense*. Solo `pointer: fine`, respeta `prefers-reduced-motion`.

### Fase 1 — Hero "Línea de salida"

6. HUD de telemetría en las esquinas del hero: marcha, RPM ligados al scroll; las coordenadas
   CDMX existentes pasan a formar parte del HUD.
7. Columna vertical 「速さと精度」 (*velocidad y precisión*) en el borde.
8. `particle-field.tsx`: unas trazas horizontales que corren hacia el horizonte — el terreno
   se lee como asfalto/circuito.
9. Telaraña de alambre 3D en una esquina, dentro del canvas que ya existe.

### Fase 2 — Sección nueva 「ガレージ」 GARAGE *(el corazón del rebranding)*

10. `components/three/typer-scene.tsx`: **Civic Type R 2016 en wireframe lima**, modelado
    proceduralmente con three.js (silueta extruida + ruedas + alerón — no hay GLTF que cargar).
    Gira con el scroll, se ladea con el puntero, faros en bermellón.
11. `components/sections/garage.tsx`: tres tarjetas de telemetría que conectan cada obsesión con
    su forma de trabajar. No es "mis hobbies": es **por qué trabaja así**.
    - `Type R · FK2 2016` → *si no rinde, no sale.*
    - `職人 shokunin` → *el detalle que nadie nota, pero se siente.*
    - `Tejer la red` → *una web es una red; se teje punto por punto.*

### Fase 3 — Reencuadre de lo existente (visual; sin romper copy ni SEO)

12. `ScrollProgress` → tacómetro: entra en bermellón en el último 12%.
13. Franja de stats → marco de telemetría con `.web-corner`.
14. `MarqueeBand` → alterna términos en japonés.
15. `ProjectsShowcase` → posición `P01…Pxx` por tarjeta + hilos que se dibujan en hover.
16. `ProcessOrbital` → tiempos tipo pit stop.
17. `SiteFooter` → **sello hanko** bermellón 「ブライアン」: la firma del artesano.
18. `MeetBryan` → chips e intro que ya hablan de las tres obsesiones.

### Fase 4 — Easter eggs (dos, baratos)

19. Teclear `vtec` → el tacómetro sube a zona roja ~1.5 s.
20. Doble clic en el logo → el sello *hanko* se estampa.

### Fase 5 — Cierre

21. Todas las cadenas nuevas a los 7 diccionarios (`ja.ts` incluido, que aquí sí se luce).
22. `npm run build`, pase de `prefers-reduced-motion`, pase de móvil, y verificación de que
    configurador/Lumina/API siguen intactos.

---

## 4. Guardarraíles

**No se toca:** lógica de pagos y `app/api/*`, Lumina, metadata/canónicas/sitemap, logo,
verde de marca, ni el color de los CTAs.

**Propiedad intelectual:** cero IP de Marvel. Sin logo, sin personaje, sin el nombre, sin el
rojo-azul del traje. La referencia vive como **geometría abstracta de red** — que además es
la metáfora honesta de lo que se vende. Igual con Honda: silueta y espíritu, sin logotipos.

**Performance:** todo 3D nuevo pasa por `useThreeStage` + `LazyMount`, con DPR capado y
fotograma estático bajo `prefers-reduced-motion`. El HUD y el cursor son CSS/SVG, no canvas.

# Japan Redesign — investigación y dirección de experiencia

**Fecha de investigación:** 27 de julio de 2026

**Alcance de este documento:** investigación visual, cultural, lingüística y técnica para el rediseño.

**Estado:** propuesta de dirección; no se modificó código de producción, SEO, analítica, pagos ni configuración.

---

## 1. Conclusión ejecutiva

La dirección más fuerte no es “una web japonesa” entendida como una suma de neón, kanji, torii y automóviles. Eso produciría justo el resultado genérico que se quiere evitar. La oportunidad es construir una experiencia sobre una idea más precisa:

> **Precisión en movimiento:** la disciplina del diseño y la ingeniería, la cultura de personalización automotriz y la energía contemporánea de Japón, articuladas alrededor del Civic Type R como pieza escultórica.

El sitio debe sentirse como una máquina que se pone en marcha:

1. **Preparación:** interfaz contenida, datos, tensión y silencio.
2. **Arranque:** el preloader activa el sistema con `始動 / INICIANDO`.
3. **Movimiento:** el Honda Civic Type R 3D se revela por función, no como adorno.
4. **Control:** los servicios, proyectos y proceso usan la gramática de un cockpit y de una publicación editorial.
5. **Comunidad:** el relato se abre hacia la cultura de talleres, personalización, circuitos, diseño y colaboración.
6. **Llegada:** la llamada a la acción y el pago siguen siendo claros, rápidos y completamente operables.

La inspiración más útil de Hirotos es su disciplina: **un solo objeto 3D memorable, texto escaso y una composición que no compite con el objeto**. La lección principal de Toyota JMS es otra: **una experiencia larga debe organizarse en capítulos con ritmo editorial, imágenes humanas y progresión clara**. Forza Horizon 6 aporta la pauta cultural contemporánea: Japón funciona por **coexistencia y especificidad**, no por un collage de clichés.

### Decisión cromática recomendada

No conviene reemplazar la paleta actual. El color existente pertenece a BryanF y ayuda a que el rebranding siga siendo reconocible. Se recomienda:

- Conservar el verde actual como color de marca y de sistema.
- Mantener blanco, negro y grafito como campos principales.
- Introducir **rojo Type R sólo como señal funcional**: RPM, estado activo, foco, luz trasera, dato crítico o microacento.
- Limitar ese rojo aproximadamente al 5–8 % de la composición visible en cada escena.

La justificación no es “Japón usa rojo”: Honda utiliza Championship White, rojo y negro de manera consistente en Type R, y el rojo tiene una función automotriz legible. Convertir toda la marca a rojo diluiría la identidad actual y acercaría el resultado a un tema genérico.

---

## 2. Fuentes y criterio de investigación

Se priorizaron fuentes primarias:

- Los sitios de referencia entregados por el usuario: [Hirotos](https://www.hirotos.com/) y [Toyota Japan Mobility Show 2025](https://global.toyota/info/jms2025/jp/toyota/).
- Comunicaciones oficiales de [Honda](https://hondanews.com/en-US/releases/honda-civic-type-r-history) sobre la historia, filosofía y diseño del Civic Type R.
- Publicaciones oficiales de [Forza](https://forza.net/news/forza-horizon-6-now-available) y [Xbox Wire](https://news.xbox.com/en-us/2025/09/25/forza-horizon-6-japan-setting-2026/) sobre la dirección artística de Forza Horizon 6.
- El sitio oficial de [Tokyo Auto Salon](https://www.tokyoautosalon.jp/2025/about/index.php.html) para contextualizar la cultura japonesa de personalización.
- Material de la [Japan Foundation](https://www.irodori.jpf.go.jp/assets/data/TIPS_all.pdf) para el uso de escritura japonesa.
- Criterios oficiales de [W3C/WCAG](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) para movimiento y accesibilidad.
- Los once archivos visuales y el archivo GLB incluidos localmente en `Japan Redesign`.

Cuando una referencia local mezcla culturas, idiomas o símbolos, se trata sólo como referencia compositiva. No se toma su texto ni su iconografía como una fuente cultural válida.

---

## 3. Límites que deben quedar bloqueados antes de diseñar

El rediseño puede cambiar por completo la presentación, pero no debe cambiar el producto ni la infraestructura comercial.

### No tocar

- Metadatos, títulos SEO, descripciones, canonical, robots, sitemap, schema/JSON-LD y archivos de planeación SEO.
- Etiquetas o scripts de analítica, conversiones, pixels y consentimiento.
- URLs públicas, estructura de enlaces, destinos de botones o slugs sin una migración aprobada.
- Flujo, proveedor, eventos y confirmaciones de pago.
- Idioma principal: el contenido comercial continúa en español.
- Información, condiciones, precios y promesas existentes, salvo una edición de estilo que preserve exactamente su significado.

### Sí puede cambiar

- Composición, layout, tipografía, superficies, jerarquía y navegación visual.
- El sistema de motion, siempre con alternativa reducida.
- La presentación de textos existentes y su edición humana.
- La forma en que se introduce y recorre el modelo 3D.
- El preloader, transiciones, parallax y capítulos on-scroll.
- Tratamiento de imágenes, texturas, fondos, divisores y microinteracciones.

### Regla operativa

Antes de integrar el rediseño se necesita una “fotografía” de SEO, enlaces, trackers, eventos y pagos. Al final, esa fotografía debe compararse contra el resultado. “No tocar SEO” no se valida a ojo: se valida con un diff y pruebas.

---

## 4. Auditoría de `Japan Redesign`

### 4.1 Referencias visuales locales

| Archivo | Qué aporta | Riesgo / decisión |
|---|---|---|
| `0be2…jpg` | Editorial limpio, rojo/negro/crema, retrato grande, grilla asimétrica y texto vertical. | Es la referencia local más útil. Tomar ritmo, aire y contraste; no copiar el kanji como decoración. |
| `1984…jpg` | Cartel turístico con arquitectura, bloques tipográficos y capas. | Tratamiento genérico de “Japón”. No usar arquitectura religiosa como wallpaper. |
| `3960…jpg` | Fuji, auto, grano, verticalidad y tensión de cartel. | Buena energía automotriz. La frase japonesa no debe copiarse sin propósito ni revisión. |
| `3e99…jpg` | Niebla, profundidad, silencio y contraste oscuro. | Templo/pagoda como cliché y posible uso superficial de un espacio sagrado. Rescatar atmósfera, no motivo. |
| `46d9…jpg` | Layout largo, máscaras de tinta, alternancia editorial y escala irregular. | Es una pieza de cultura visual china, no japonesa. Usar sólo como estudio de composición. |
| `58e9…jpg` | UI turística, tarjetas, coordenadas y navegación modular. | Demasiado literal y genérica. No convertir el portafolio en una guía turística. |
| `5938…jpg` | Grilla, textura de tinta, capas de personajes y profundidad. | También es una interfaz china. No reutilizar texto, personajes ni iconografía. |
| `8988…jpg` | Póster de auto, Fuji, tipografía vertical y alto contraste. | Incluye ruso y japonés agresivo; evidencia de mezcla cultural. La frase con `お前` tiene un tono rudo y no corresponde a la marca. |
| `a570…jpg` | Collage, lámparas, montaña y composición por diagonales. | Acumula clichés; `日本` sólo significa “Japón” y no agrega una idea. |
| `descarga.png` | Póster de auto con grano, encuadre dinámico y fuerte eje diagonal. | El texto japonés está truncado. No debe aparecer en producción. |
| `fbc…jpg` | Colisión de ciudad, torii, montaña, manos y alto contraste. | Se percibe sintético y tokenizante; mezcla religión, turismo y neón sin contexto. Evitar su vocabulario visual. |

### Aprendizaje principal de la carpeta

Las referencias no son un sistema coherente todavía. Contienen tres líneas distintas:

1. **Editorial contemporáneo:** grilla, aire, escala tipográfica y asimetría.
2. **Automotriz:** máquina, movimiento, grano, dato técnico y contraste.
3. **“Japón” turístico/fantástico:** pagodas, torii, Fuji, tinta y kanji decorativo.

El rediseño debe conservar las dos primeras y reducir drásticamente la tercera. Fuji, un santuario o una textura de tinta sólo tendrían lugar si existe una razón narrativa específica y una fuente apropiada. La experiencia no necesita esos símbolos para leerse japonesa.

### Frases encontradas que no deben copiarse

- `走りは自由。走りに魂を。`: una frase de cartel sobre libertad y alma al conducir; es una construcción publicitaria ajena.
- `お前の道だ 一人で歩いてみろ`: tono áspero —aproximadamente “es tu camino; recórrelo solo”— y uso de `お前`, que puede sonar brusco o agresivo.
- `簡単は退屈だ`: “lo fácil es aburrido”; es genérica.
- `不滅`: “inmortal/indestructible”; no describe el servicio ni la historia de BryanF.
- Texto ruso o chino presente en varias piezas: confirma que no son referencia lingüística confiable.

---

## 5. Auditoría del Honda Civic Type R GLB

Archivo analizado:

`Japan Redesign/Modelo del Honda civic en glb/2023-honda-civic-type-r.zip`

El ZIP contiene `source/Honda Civic Type R '23.glb` y una carpeta de texturas. El GLB ya lleva sus imágenes embebidas; no debe cargarse además una copia externa de las mismas texturas.

### Inventario técnico

| Dato | Resultado |
|---|---:|
| Tamaño del GLB | 11,914,472 bytes |
| Versión | glTF 2.0 |
| Escenas | 1 |
| Nodos | 70 |
| Mallas | 69 |
| Primitivas | 77 |
| Materiales | 30 |
| Texturas | 36 |
| Imágenes embebidas | 35 |
| Animaciones | 0 |
| Cámaras | 0 |
| Esqueletos/skins | 0 |
| Triángulos aproximados | 223,317 |
| Extensiones | `KHR_materials_emissive_strength`, `KHR_materials_specular` |

Dimensiones aproximadas en los ejes propios del activo: **2.095 × 4.575 × 2.439**. La orientación final debe verificarse al importarlo; no se debe asumir que Y/Z coinciden con la escena existente.

Los nodos y materiales incluyen partes reconocibles: pintura, interior, cristales, luces, parrillas, emblemas, rines y neumáticos. Esto permite hacer dirección de luz y énfasis por componente sin romper la malla.

### Implicaciones

- Es un activo adecuado para una escena hero de escritorio.
- Es demasiado pesado para tratarlo como recurso crítico en todos los teléfonos.
- No incluye animación ni cámaras. La coreografía debe programarse mediante cámara, grupo raíz, luces y estados de materiales.
- La carga no puede bloquear el contenido, navegación o pago.
- Antes de publicar debe confirmarse la licencia y procedencia del modelo. Tener el ZIP no demuestra derechos de uso comercial.

### Estrategia de optimización

Producir tres salidas:

1. **Escritorio alto:** modelo completo optimizado, texturas comprimidas y carga diferida.
2. **Móvil:** malla reducida/LOD, texturas más pequeñas y una coreografía de tres estados como máximo.
3. **Fallback:** imagen WebP/AVIF del mismo encuadre, con contenido DOM completo.

Objetivos propuestos, sujetos a una prueba visual:

- Escritorio: bajar el activo a aproximadamente 4–6 MB transferidos.
- Móvil: 1.5–3 MB o usar el fallback cuando el dispositivo, red o preferencia de movimiento lo indiquen.
- Nunca descargar el GLB antes del contenido crítico sólo para mostrar un preloader.

### Coreografía recomendada

| Estado | Cámara / objeto | Luz / material | Función narrativa |
|---|---|---|---|
| 0. Espera | Silueta frontal a 3/4, casi inmóvil | Contorno frío, cabina oscura | Anticipación |
| 1. Arranque | Acercamiento controlado al frente | Barrido único de faro; pintura emerge | Inicio de la experiencia |
| 2. Precisión | Macro de rin, freno, toma de aire o perfil | Rojo como dato activo, no como baño | Relacionar forma con función |
| 3. Control | Vista de cabina/tablero o cristal | UI técnica y reflejo contenido | Presentar proceso/servicio |
| 4. Flujo | Perfil lateral y paso hacia el alerón | Línea de aire/trazo de datos | Conectar trabajo y resultados |
| 5. Salida | 3/4 trasero, reducción de escala | Luz trasera y fondo de marca | Entregar la escena al CTA |

En móvil se condensan en **silueta → perfil → salida**. No se intenta reproducir cada macro. La claridad de lectura y el rendimiento tienen prioridad.

---

## 6. Qué aprender de las webs de referencia

### 6.1 Hirotos

[Hirotos](https://www.hirotos.com/) ocupa prácticamente un viewport fijo. Su home combina:

- Mucho espacio blanco.
- Texto mínimo y muy jerarquizado.
- Un único objeto 3D de gran tamaño: una señal vial.
- Navegación fija, lateral y muy visible.
- Cursor y movimiento que responden al usuario.
- Preloader a pantalla completa con una señal gráfica simple y “Loading…”.

En escritorio, el objeto ocupa el centro-derecha mientras el nombre y los datos quedan a la izquierda. En 390 × 844 la misma idea se recompone: título arriba, navegación compacta, objeto en el centro y detalles abajo. No intenta meter más módulos; protege la idea principal.

La página de proyectos utiliza un carrusel horizontal continuo de imágenes, con repetición de pista y opacidad/escala como respuesta. Sigue sin convertir la interfaz en un tablero lleno de controles.

#### Adoptar

- Una pieza 3D protagonista.
- Composición asimétrica con grandes zonas de descanso.
- Información en capas, no todo visible al mismo volumen.
- Navegación persistente y legible.
- Un preloader que establece el tono sin contar toda la historia.

#### No copiar

- Bloquear toda la web a un viewport fijo.
- Depender de un cursor personalizado para entender qué es interactivo.
- Ocultar contenido sustantivo dentro de WebGL.
- Hacer que páginas de contenido o pago se comporten como una demo.
- Repetir el mismo efecto 3D en todas las secciones.

### 6.2 Toyota — Japan Mobility Show 2025

El sitio oficial de [Toyota JMS 2025](https://global.toyota/info/jms2025/jp/toyota/) es una experiencia de más de 33,000 px de altura con cientos de imágenes, capítulos de pantalla completa, tipografía de escala monumental y transiciones ligadas al scroll.

Elementos destacados:

- Hero negro con tipografía blanca de gran formato.
- Transición a imagen en movimiento mediante textura de puntos/halftone.
- Manifiesto que coloca a la persona antes que al producto.
- Capítulo `MOBILITY` con imágenes editoriales divididas y texto gigante.
- `MOBILITY GUIDE` como catálogo numerado, con una tarjeta principal y controles claros.
- Navegación bilingüe JP/EN compacta en móvil.
- En móvil, una tarjeta por vez y continuidad visible hacia el siguiente capítulo.

#### Adoptar

- Arquitectura por capítulos.
- Números de sección y progreso legible.
- Alternancia entre imagen, texto y máquina.
- Montaje editorial de personas y trabajo, no sólo objetos.
- Catálogo claro para proyectos/servicios.
- Tipografía grande usada como estructura espacial.

#### No copiar

- El volumen de 363 imágenes y su coste.
- Una duración excesiva sin opción de navegación directa.
- Escenas de scroll cuyo contenido sólo existe durante la animación.
- Un manifiesto abstracto que no explique qué se ofrece.

### Síntesis Hirotos + Toyota

Hirotos ofrece el **foco** y Toyota ofrece la **progresión**. La dirección para BryanF debe tener la contención del primero en el hero y la construcción por capítulos del segundo en el resto del sitio.

---

## 7. Honda Civic Type R: contexto correcto, no contenido para publicar

El usuario pidió entender la historia, no convertirla en una cronología dentro de la web.

### Nota importante sobre “Type R 2016”

La cronología oficial de [Honda News — Civic Type R History](https://hondanews.com/en-US/releases/honda-civic-type-r-history) ubica la generación FK2 dentro de 2012–2015 y presenta al Type R de décima generación como modelo 2017 en Estados Unidos. Por eso “Honda Civic Type R 2016” puede referirse al auto amado por su época, mercado, registro o memoria personal, pero no conviene publicar una afirmación histórica tajante sobre un “Type R 2016”.

La solución de diseño es respetar ambas capas:

- **La emoción:** tomar del FK2 su agresividad compacta, su enfoque funcional y la idea de “race car for the road”.
- **El objeto disponible:** usar el FL5/2023 del GLB como escultura contemporánea.
- **La narrativa pública:** no mencionar una cronología ni presentar el 2023 como si fuera el 2016.

### Lo que sí importa de Honda para el diseño

Honda describe Type R a partir de función, control y placer al conducir:

- El nombre Type R se vincula a “Racing”, reducción de peso, aerodinámica de pista y mejoras de rendimiento.
- El [FK2 presentado en 2015](https://global.honda/en/newsroom/news/2015/4150303eng.html) se comunicó como un “race car for the road”; su forma se entiende a través de lo que hace.
- En Japón, Honda comunicó 310 PS, 400 Nm, transmisión manual de seis velocidades, diferencial y aerodinámica funcional para el [Civic Type R 2015](https://global.honda/en/newsroom/news/2015/4151028eng-civic.html).
- La retrospectiva oficial del [30.º aniversario de Type R](https://global.honda/en/stories/048.html) insiste en “functional beauty” y en el salto del FK2 al turbo.
- El [Type R actual](https://global.honda/en/newsroom/news/2022/4220721eng.html) se describe bajo “Ultimate SPORT 2.0”: bajo y ancho, flujo de aire continuo, sensación adictiva pero segura, interior rojo/negro y una interfaz de conducción propia.

#### Traducción a interfaz

- Cada ornamento visual debe tener una función.
- El rojo indica energía o estado, no “ambientación japonesa”.
- Las líneas pueden representar aire, trayectoria, telemetría o estructura de layout.
- El modelo debe revelarse por componentes: forma, control, flujo y detalle.
- Los microsonidos, si existen, deben ser opcionales y sobrios; no imitar un motor de forma caricaturesca.

---

## 8. Cultura automotriz japonesa contemporánea

### 8.1 Tokyo Auto Salon

La historia oficial de [Tokyo Auto Salon](https://www.tokyoautosalon.jp/2025/about/index.php.html) explica que el evento comenzó en 1983 como Tokyo Exciting Car Show para difundir la cultura del automóvil personalizado. Con el tiempo integró:

- Tuning y dress-up.
- Partes y nuevas tecnologías.
- Fabricantes.
- Demostraciones de motorsport.
- Juegos, moda y una audiencia internacional.

El mensaje actual de la organización se puede resumir como la relación entre **partes, autos y personas**, y el deseo de construir el auto que uno quiere. Esa capa humana es esencial: la cultura no es sólo velocidad ni una carrocería iluminada.

### 8.2 Forza Horizon 6

Forza Horizon 6 **ya se lanzó el 19 de mayo de 2026**; no debe describirse como un juego futuro. Las fuentes oficiales de [Forza](https://forza.net/news/forza-horizon-6-now-available) y [Xbox](https://news.xbox.com/en-us/2025/09/25/forza-horizon-6-japan-setting-2026/) explican una dirección basada en:

- Contraste entre Tokio, pueblos, montañas y costa.
- Coexistencia de lo moderno y lo tradicional.
- Densidad y verticalidad urbana.
- Touge, time attack, drag y encuentros de autos.
- Customización y comunidad como cultura compartida.
- Interpretación respetuosa del lugar, no una copia 1:1 de cada espacio.
- Colaboración con artistas japoneses para arte específico de cada región.

La imagen más útil expresada por su equipo creativo es la coexistencia de un santuario, un taller pequeño y un arcade de neón dentro del mismo tejido urbano. El aprendizaje no es “poner los tres en un fondo”; es reconocer que Japón contemporáneo no se reduce a una sola estética.

Forza también documenta colaboraciones con [nueve artistas japoneses](https://forza.net/news/forza-horizon-6-art-of-driving) y presenta la [cultura automotriz](https://forza.net/news/forza-horizon-6-car-culture) como comunidad, personalización y experiencia compartida.

### Dirección cultural recomendada

La web debe combinar, con jerarquía:

1. **Ingeniería/fábrica:** precisión, materiales, sistemas y forma funcional.
2. **Taller/personalización:** proceso, elección, intervención y oficio.
3. **Circuito/time attack:** medición, ritmo, vueltas y mejora.
4. **Comunidad:** personas, colaboración y proyectos.
5. **Ciudad contemporánea:** señalética, densidad, luz y capas.
6. **Naturaleza:** silencio y respiración, no postal turística.

No se debe romantizar conducción ilegal ni usar santuarios como obstáculos, sets de carreras o fondos decorativos. La cultura de carretera puede aparecer como atmósfera; la acción competitiva debe leerse como circuito, timing, taller o experiencia controlada.

---

## 9. Gobernanza del japonés en la interfaz

La [Japan Foundation](https://www.irodori.jpf.go.jp/assets/data/TIPS_all.pdf) explica que la escritura japonesa combina kanji, hiragana, katakana y romaji, con funciones distintas. Un kanji aislado no es automáticamente un título apropiado. El significado depende del uso y el contexto.

### Vocabulario evaluado

| Japonés | Lectura | Significado/contexto | Decisión |
|---|---|---|---|
| `準備` | junbi | Preparación. Japan Foundation lo glosa como “preparation”; el manual oficial del Civic Type R usa `運転の準備`, preparación para conducir. | Válido para una fase previa. No equivale exactamente a “cargando”. |
| `始動` | shidō | Comenzar a moverse o poner en marcha una máquina/motor. Honda usa `エンジンの始動`. | **Recomendado para el preloader:** `始動 / INICIANDO`. |
| `設計` | sekkei | Diseño/planificación estructural, industrial o de ingeniería. Honda lo usa en contexto de diseño técnico. | Válido para método, sistemas o arquitectura. No usar como traducción automática de diseño gráfico. |
| `実装` | jissō | Montaje o incorporación de una función; en software, implementación. La documentación de IPA lo usa para la fase técnica. | Correcto pero especializado. Si aparece, debe acompañarse por `DESARROLLO` o `IMPLEMENTACIÓN`. |
| `走り` | hashiri | La conducción, el comportamiento al rodar o “el manejo”. Honda usa `走りの楽しさ`, el placer de conducir. | Recomendado para el capítulo 3D/movimiento, acompañado por una frase clara en español. |

### Otros labels visuales evaluados

| Label | Evaluación |
|---|---|
| `精度` | Precisión/exactitud. Correcto, pero técnico y frío; funciona en ingeniería o detalle, no como promesa humana general. |
| `リズム` | “Ritmo”. Natural y contemporáneo. |
| `接続` | Conexión técnica: red, API o dispositivo. Para comunidad o relaciones, `つながり` resulta más humano; `接点` sirve para “puntos de contacto”. |
| `制作` | Creación/producción creativa. Es la opción natural para trabajo web y de diseño. |
| `実績` | Trayectoria/resultados. Para un portafolio, `制作実績` es más explícito y natural. |
| `相談` | Consulta. Como CTA suenan mejor `相談する` (“consultar”) o la forma cortés `ご相談`. |
| `起動中…` | “Iniciando/arrancando el sistema”. Natural para una app o sistema; `始動 / INICIANDO` conserva mejor la metáfora automotriz. |
| `回転` | Rotación/revolución. Como instrucción es ambiguo; usar `ドラッグして回転` o `ドラッグで回転`, “arrastra para rotar”. |
| `精度の軌跡` | Es gramaticalmente interpretable, pero no resulta idiomático como traducción de “trayectoria de precisión”: hace que la precisión misma parezca dejar un rastro y suena abstracto. No publicarlo. Para el label visual, usar sólo `精度 / SEIDO / PRECISIÓN`; si se necesita una frase, someterla a revisión nativa. |

### Sistema recomendado

- Español siempre como contenido principal.
- Japonés como etiqueta secundaria con función semántica.
- Marcarlo en HTML con `lang="ja"`.
- Incluir lectura o transliteración cuando ayude: `始動 — SHIDŌ`.
- Incluir significado visible, no depender de tooltip.
- Restringir el vocabulario a un pequeño glosario aprobado.
- Someter cualquier oración completa a revisión de una persona japonesa o traductora nativa antes de publicar.

### Ejemplo de progresión

```text
00  準備     PREPARACIÓN
01  始動     INICIO
02  設計     DISEÑO DE SISTEMA
03  実装     DESARROLLO
04  走り     EXPERIENCIA EN MOVIMIENTO
```

Esto funciona como sistema de capítulos porque cada término tiene contexto. No debe repetirse como estampado, ruido de fondo o textura.

### Evitar

- Kanji aleatorio por “estética”.
- Frases de anime, samuráis, honor, alma o destino sin relación con el contenido.
- Usar `お前` en copy de marca.
- Combinar texto chino, japonés y coreano como si fueran intercambiables.
- Títulos verticales que rompan la lectura móvil.
- Pseudo-caligrafía generada para simular escritura tradicional.

---

## 10. Dirección creativa propuesta

### Nombre de trabajo

**始動 / SHIDŌ — Precisión en movimiento**

No tiene que convertirse en el nombre público del sitio. Sirve como regla interna para evaluar cada decisión: ¿la pieza ayuda a poner la experiencia en marcha o sólo decora?

### Gramática visual

- Grilla editorial asimétrica.
- Tipografía sans/condensada de alta legibilidad para datos y navegación.
- Serif o display sólo en momentos editoriales concretos, si ya encaja con la identidad.
- Números monoespaciados para progreso, coordenadas y telemetría.
- Verticalidad japonesa limitada a etiquetas cortas en escritorio; disposición horizontal en móvil.
- Bordes finos, ticks, marcas de medición y líneas de flujo.
- Grano físico muy sutil para impedir un acabado plástico.
- Superficies profundas negro/grafito y pausas blancas amplias.
- Neón como luz emitida por elementos reales de la escena, no como glow alrededor de todo.

### Motivos permitidos

- Luz de taller.
- Señalética urbana abstracta.
- Líneas de aire y trayectoria.
- Telemetría, cronómetro, coordenadas y vueltas.
- Detalles de material: metal, pintura, vidrio, goma, papel.
- Imágenes humanas de proceso.
- Carteles tipográficos originales producidos para BryanF.

### Motivos que requieren una razón específica

- Monte Fuji.
- Torii, santuarios, templos o gestos de oración.
- Caligrafía tradicional.
- Sol rojo.
- Pez koi, geisha, samurái, katana, ondas o cerezos.

No están “prohibidos” por ser japoneses; se descartan porque en este proyecto no aportan una función y elevarían el riesgo de cliché.

---

## 11. Arquitectura de experiencia recomendada

El contenido real y las rutas existentes deben mapearse antes de implementar. Esta secuencia describe comportamiento, no autoriza eliminar ninguna sección.

### 00 — Preloader: `始動 / INICIANDO`

**Idea:** un ciclo de ignición, no una puerta de templo.

- Fondo casi negro.
- Marca BryanF y `始動` con traducción visible.
- Ticks de tacómetro o secuencia `00 → 100`.
- Una línea de diagnóstico verifica fuentes, escena y contenido.
- Un único barrido de luz revela el contorno del Civic.
- Al completar, el sistema abre el hero con una transición de obturador o máscara lineal.

**Límites:**

- No esperar artificialmente a que el modelo termine si el contenido ya está listo.
- Objetivo de salida: inmediata o aproximadamente 2–2.5 s como máximo en una carga normal.
- Botón de continuar/saltar si la carga se extiende.
- Fallback al hero estático cuando falle WebGL.
- En `prefers-reduced-motion`, usar logo + fundido corto, sin tacómetro ni barrido.
- El preloader no debe cubrir un error, consentimiento, pago o navegación indefinidamente.

### 01 — Hero: máquina + promesa

- El Civic aparece en 3/4, con una cámara contenida.
- El titular comercial existente sigue siendo el centro semántico.
- Japonés como etiqueta secundaria, no como titular principal.
- Una sola interacción primaria y una secundaria.
- El modelo responde levemente al puntero o inclinación, con límites; en touch, no exigir arrastre.
- El hero debe entenderse con la imagen fallback y sin JavaScript.

### 02 — Servicios: `設計`

- Presentar servicios como sistemas resueltos, no como tarjetas idénticas.
- Cada módulo debe tener un verbo concreto, alcance y resultado.
- Usar capas técnicas: número, disciplina, entregable y CTA.
- El 3D puede acercarse a un componente funcional, pero no debe tapar el texto.

### 03 — Proyectos: time attack editorial

- Proyectos numerados como vueltas o registros, sin convertirlos en videojuego.
- Imagen amplia, resultado claro y acceso evidente al caso.
- Movimiento horizontal sólo cuando el usuario lo controla; alternativa vertical en móvil.
- Mostrar personas, proceso o contexto cuando existan, no sólo mockups flotantes.
- Los enlaces continúan siendo `<a>` reales y accesibles.

### 04 — Proceso: `準備 → 設計 → 実装 → 走り`

- Usar los términos evaluados como marcadores secundarios.
- Español explica cada fase.
- Una línea continua puede unir las fases como telemetría.
- La animación revela progreso, pero todo el contenido ya existe en el DOM.

### 05 — Presencia / globo

El usuario pidió añadir Japón al globo. La formulación debe ser precisa:

- **Recomendado si se trata de influencia/investigación:** `Japón — investigación cultural y dirección visual`.
- **Si existe trabajo verificable con clientes, equipos o proyectos japoneses:** usar la descripción real y enlazar el caso.
- No afirmar “clientes en Japón” o “trabajo en Japón” sólo porque esta dirección se inspira allí.

Visualmente, Japón puede ser un punto activo que abre una cápsula con coordenadas, investigación e influencias. No necesita bandera flotante ni un paisaje turístico.

### 06 — Sobre BryanF

- Conectar gusto personal por Type R con disciplina de diseño en una línea humana, no con una biografía de Honda.
- Incluir trabajo y experiencia reales.
- Evitar convertir el sitio comercial en un fan page de automóvil.
- Un retrato o imagen de proceso debe equilibrar la presencia de la máquina.

### 07 — Conversión y pago

- La escena 3D se retira y deja espacio limpio.
- CTA, condiciones, precio y pago vuelven a un campo estable, de alto contraste.
- Ninguna capa WebGL debe interceptar clics.
- Sin parallax detrás de formularios, datos financieros o confirmaciones.
- Estados de error, carga y éxito continúan siendo visibles y anunciables.

---

## 12. Sistema de movimiento

### Jerarquía

1. **Movimiento principal:** cámara/objeto 3D durante el recorrido.
2. **Movimiento de sección:** máscaras, entrada tipográfica y cambio de superficie.
3. **Microinteracción:** foco, hover, cursor, tick o número.

No deben activarse los tres al máximo al mismo tiempo.

### Reglas

- Parallax lento y con poca amplitud.
- Una animación debe comunicar cambio de capítulo, jerarquía, relación o estado.
- Evitar la inercia exagerada y el scroll secuestrado.
- No usar cursor personalizado como único indicador.
- Los loops ambientales deben poder pausarse.
- La navegación directa debe saltar al contenido correcto sin obligar a reproducir toda la secuencia.
- En móvil, transformar parallax en cambios de escala/fundidos discretos.

### Neón

- El glow se origina en una fuente: faro, luz trasera, panel, borde activo o señal.
- No aplicar box-shadow de color a todos los contenedores.
- Evitar parpadeo rojo.
- Usar bloom selectivo sólo en escritorio capaz; en móvil, emularlo con gradientes estáticos o una textura precompuesta.

---

## 13. Copy: cómo evitar “IA slop”

Humanizer debe utilizarse como una etapa editorial, no como una máquina que reescribe todo sin control.

### Principios

- Conservar cada dato, promesa, condición y precio.
- Escribir desde la experiencia real de BryanF.
- Una idea concreta por bloque.
- Preferir verbo + objeto + resultado.
- Usar palabras que un cliente utilizaría.
- Quitar intensificadores vacíos: “único”, “increíble”, “revolucionario”, “transformador”, “de otro nivel”.
- No afirmar que una web “cuenta una historia” si el bloque no cuenta ninguna.
- Variar longitud y ritmo; no repetir la estructura de tres beneficios.
- No abusar de rayas, frases nominales ni preguntas retóricas.
- Leer el texto en voz alta antes de aprobarlo.

### Ejemplos de dirección, no copy final

| Evitar | Dirección humana |
|---|---|
| “Creamos experiencias digitales únicas que conectan con tu audiencia.” | “Diseño y desarrollo un sitio que se entiende rápido, carga bien y te ayuda a vender.” |
| “Llevamos tu presencia digital al siguiente nivel.” | “Si tu sitio ya no representa cómo trabajas, lo rediseñamos sin romper lo que ya funciona.” |
| “Fusionamos creatividad y tecnología.” | “La idea visual y el código se resuelven juntos. Así el diseño no se cae al llegar al navegador.” |
| “Cada pixel cuenta una historia.” | “Cada decisión tiene trabajo que hacer: orientar, explicar o convertir.” |

### Uso de la historia personal

Una mención breve puede conectar el Type R con el método:

> “Me atrae el Type R por una razón simple: nada está ahí sólo para verse rápido. La forma responde a cómo se mueve. Esa misma exigencia guía mi trabajo.”

Debe ajustarse a la voz real del usuario. No conviene publicar especificaciones, generaciones o una cronología de Honda; esa investigación debe permanecer detrás del concepto.

---

## 14. Móvil, rendimiento y resiliencia

La experiencia móvil no puede ser una versión encogida del escritorio.

### Composición

- Diseñar primero estados específicos para 390 × 844 y validar también 320 px de ancho.
- Evitar texto vertical largo.
- Una interacción principal por viewport.
- Dejar visible el inicio del siguiente capítulo para orientar.
- Touch targets recomendados de 44–48 px; nunca por debajo del mínimo de [24 × 24 CSS px o su separación equivalente](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
- Mantener CTA y navegación fuera de zonas ocupadas por el modelo.

### Carga

- Renderizar titular, navegación y CTA antes de WebGL.
- Lazy-load del GLB al aproximarse al hero o después de contenido crítico, según la arquitectura final.
- Imágenes responsivas y formatos modernos.
- Pausar render loop cuando el canvas no sea visible.
- Limitar pixel ratio y postprocesado en móvil.
- Reaccionar a baja memoria, ahorro de datos o fallo de contexto con el poster.
- No volver a descargar texturas que ya están embebidas.

### Fallback

La página completa debe seguir funcionando con:

- JavaScript desactivado.
- WebGL no disponible.
- Modelo fallido.
- Red lenta.
- `prefers-reduced-motion`.
- Navegación por teclado.

El canvas es una mejora, no la fuente de verdad.

---

## 15. Accesibilidad de movimiento

El criterio W3C sobre [animación provocada por interacción](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) advierte que el movimiento no esencial, incluido el parallax, puede generar reacciones vestibulares. La técnica oficial [C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) recomienda `prefers-reduced-motion`.

### Ruta reducida obligatoria

- Sustituir barridos de cámara por tres posters o encuadres estáticos.
- Desactivar parallax.
- Cambiar transformaciones grandes por fundidos breves.
- No reproducir tacómetro, partículas ni loops.
- Mantener progreso y capítulos mediante texto y estado.

### Otros criterios

- Movimiento automático de más de cinco segundos junto a contenido debe tener pausa/stop/hide, de acuerdo con [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- Evitar más de tres destellos por segundo y especialmente destello rojo, según [WCAG 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold).
- Controles, estados e información gráfica significativa requieren contraste suficiente; como referencia, [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast) usa 3:1.
- Foco de teclado no debe quedar oculto por header, overlays o canvas; véase [WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).
- Si el canvas es decorativo, debe estar oculto al árbol de accesibilidad y tener alternativa DOM. Si es interactivo, necesita nombre, instrucciones y control equivalentes.

---

## 16. Producción de imágenes nuevas

Sólo generar imágenes cuando cubran una función que no resuelve el GLB o la fotografía real.

### Paquete visual con sentido

1. **Poster fallback del Civic:** mismo encuadre y luces de la escena 3D.
2. **Tres macros de material:** pintura, rin/freno y cristal/interior.
3. **Cartel tipográfico original:** español principal + un término japonés aprobado.
4. **Texturas:** papel técnico, grano de impresión y halftone de baja intensidad.
5. **Imagen humana:** BryanF trabajando o un detalle real de proceso; preferir fotografía propia.
6. **Mapa/globo:** marcador de Japón con una ficha editorial, no un collage.

### Evitar en generación

- “Cyberpunk Tokyo” genérico.
- Autos con logos o carrocerías deformadas por IA.
- Torii en medio de carreteras.
- Texto japonés generado dentro de una imagen.
- Personas o rituales como ambientación.
- Imágenes que parezcan una campaña oficial de Honda o Forza.

El texto siempre debe componerse en HTML/CSS o en una herramienta de diseño con revisión, nunca confiarse a un generador de imagen.

---

## 17. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El auto domina y oculta la oferta | Cada capítulo debe mantener una promesa comercial y CTA legibles; retirar el 3D en conversión/pago. |
| Japón se vuelve decoración | Glosario aprobado, fuentes primarias y revisión nativa para frases completas. |
| Rendimiento móvil pobre | LOD/poster, carga diferida, pixel ratio limitado, pausa fuera de viewport y pruebas en equipo real. |
| Preloader eterno | Timeout, skip, fallback y contenido crítico independiente del GLB. |
| Rotura de SEO o trackers | Baseline y diff explícitos; pruebas automatizadas y revisión de cambios sólo visuales. |
| Rotura de pagos | Prueba end-to-end de inicio, redirección, cancelación, error y éxito; canvas sin captura de eventos. |
| Falta de derechos del modelo | Verificar licencia/procedencia antes de publicar o sustituirlo. |
| Confusión FK2/2016/FL5 | No publicar cronología; documentar internamente que el GLB es 2023 y la referencia emocional es FK2. |
| Fatiga de movimiento | Jerarquía de motion, reduced-motion, pausa y navegación directa. |
| Resultado parecido a Forza/Honda | Crear lenguaje propio; fuentes sólo como investigación, sin activos, logotipos ni interfaz copiada. |

---

## 18. Plan recomendado de implementación

### Fase 0 — Congelar lo que funciona

- Inventario de rutas, contenidos, enlaces, SEO, trackers, formularios y pagos.
- Capturas de escritorio y móvil.
- Pruebas base.
- Confirmación de licencia del GLB.

### Fase 1 — Sistema visual

- Tokens de color sin reemplazar la paleta.
- Tipografía y escalas responsivas.
- Grilla, superficies, iconos y vocabulario japonés aprobado.
- Storyboard del preloader y cinco estados 3D.

### Fase 2 — Prototipo de riesgo

- Probar únicamente preloader → hero → primer capítulo.
- Medir GLB real en escritorio y teléfono.
- Validar fallback y reduced-motion.
- Decidir LOD antes de extender Three.js al resto.

### Fase 3 — Integración de contenido

- Migrar todas las secciones y rutas sin pérdida.
- Humanizer + edición humana por bloque.
- Conservar información comercial, enlaces y pagos.
- Integrar globo y Japón con formulación verificable.

### Fase 4 — Motion y acabados

- Scroll choreography.
- Transiciones entre capítulos.
- Neón selectivo, materiales, audio opcional y microinteracciones.
- Pulido móvil específico.

### Fase 5 — Verificación

- Build de producción.
- Auditoría de rutas y enlaces.
- Comparación SEO/tracking sin cambios.
- Pruebas de pago.
- Teclado, lector, contraste y reduced-motion.
- 320, 390, 768, 1024, 1440 y 1920 px.
- iOS Safari, Android Chrome y navegadores de escritorio.
- Red lenta, WebGL fallido y dispositivo de gama media/baja.
- Revisión cultural y lingüística final.

### Fase 6 — Commit

- Un diff revisable y sin archivos temporales/modelos duplicados.
- Evidencia de build y pruebas.
- Commit sólo después de pasar los criterios de aceptación.

---

## 19. Criterios de aceptación

El rediseño está listo cuando:

- Toda ruta y enlace existente continúa disponible.
- No falta contenido comercial.
- El pago completa sus rutas de éxito, error y cancelación.
- SEO, schema, trackers y planeaciones no cambiaron.
- El sitio funciona sin WebGL y con reduced-motion.
- El preloader nunca bloquea indefinidamente.
- El Civic es protagonista, pero no impide leer ni convertir.
- El japonés usado tiene lectura, significado y contexto.
- No hay texto chino/ruso heredado de referencias.
- No hay símbolos religiosos o tradicionales como relleno.
- Móvil tiene composición y coreografía propias.
- El modelo está optimizado y su licencia está confirmada.
- Los textos pasaron por Humanizer y una edición humana posterior.
- Build y pruebas salen limpios antes del commit.

---

## 20. Fuentes primarias

### Referencias visuales

- [Hirotos — portfolio](https://www.hirotos.com/)
- [Toyota — Japan Mobility Show 2025](https://global.toyota/info/jms2025/jp/toyota/)

### Honda

- [Honda News — 2017 Honda Civic Type R: History](https://hondanews.com/en-US/releases/honda-civic-type-r-history)
- [Honda — 2015 Civic Type R world premiere](https://global.honda/en/newsroom/news/2015/4150303eng.html)
- [Honda — 2015 Civic Type R Japan launch](https://global.honda/en/newsroom/news/2015/4151028eng-civic.html)
- [Honda Stories — 30th anniversary of Type R](https://global.honda/en/stories/048.html)
- [Honda — all-new Civic Type R, 2022](https://global.honda/en/newsroom/news/2022/4220721eng.html)
- [Honda — 2023 Civic Type R design](https://global.honda/en/design/award/2023civictyper/)
- [Honda — original Civic Type R, 1997](https://global.honda/jp/news/1997/4970822.html)
- [Honda Civic Type R 2023 manual — preparation and engine start](https://www.honda.co.jp/ownersmanual/webom/jpn/civictyper/2023/details/136227090-102389.html)

### Cultura automotriz y Forza Horizon 6

- [Tokyo Auto Salon — history/about](https://www.tokyoautosalon.jp/2025/about/index.php.html)
- [Forza Horizon 6 — now available](https://forza.net/news/forza-horizon-6-now-available)
- [Forza Horizon 6 — full map reveal](https://forza.net/news/forza-horizon-6-full-map-reveal)
- [Xbox Wire — choosing Japan and cultural consultation](https://news.xbox.com/en-us/2025/09/25/forza-horizon-6-japan-setting-2026/)
- [Forza Horizon 6 — Art of Driving](https://forza.net/news/forza-horizon-6-art-of-driving)
- [Forza Horizon 6 — car culture](https://forza.net/news/forza-horizon-6-car-culture)
- [Xbox Wire — Japan landmarks and respectful adaptation](https://news.xbox.com/en-us/2026/05/18/forza-horizon-6-japan-landmarks-launch-xbox/)

### Lengua japonesa

- [Japan Foundation — Irodori: writing systems and language tips](https://www.irodori.jpf.go.jp/assets/data/TIPS_all.pdf)
- [Japan Foundation — `準備` vocabulary entry](https://www.irodori.jpf.go.jp/assets/data/wordlist_Y.pdf)
- [IPA — software design/implementation guide](https://www.ipa.go.jp/archive/publish/qv6pgp0000001009-att/000005148.pdf)

### Accesibilidad

- [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
- [W3C — C39: `prefers-reduced-motion`](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
- [W3C — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [W3C — Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold)
- [W3C — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [W3C — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
- [W3C — Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

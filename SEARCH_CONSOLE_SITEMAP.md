# Google Search Console: todo lo que hay que subir

Actualizado el 16 de octubre de 2026, con la trayectoria en la home, el briefing nuevo y el
centro de preguntas de la suscripción.

## Datos de la propiedad

| Dato | Valor |
|---|---|
| Propiedad recomendada | **Dominio**: `bryanfdesign.com` (cubre www, sin www, http y https) |
| URL canónica del sitio | `https://www.bryanfdesign.com` |
| Sitemap | `https://www.bryanfdesign.com/sitemap.xml` |
| robots.txt | `https://www.bryanfdesign.com/robots.txt` (bloquea solo `/api/`) |
| País objetivo | México (`es-MX`) |
| Páginas en el sitemap | 14 |

## 1. Dar de alta la propiedad (si aún no existe)
1. Entra a https://search.google.com/search-console con la cuenta de Google del negocio.
2. *Agregar propiedad* → **Dominio** → escribe `bryanfdesign.com`.
3. Google te da un registro **TXT** (`google-site-verification=…`). Agrégalo en el DNS de tu
   dominio (donde lo compraste o en Vercel → Domains → DNS) y da clic en **Verificar**.
   Puede tardar de minutos a unas horas.

## 2. Enviar el sitemap
Menú izquierdo → **Sitemaps** → en "Agregar un sitemap" escribe `sitemap.xml` →
**Enviar**. Si ya estaba enviado, vuelve a darle **Enviar** para que Google lo relea:
cambiaron las fechas de la home y hay una página nueva.

Espera a que diga **Correcto** con **14 páginas descubiertas**.

## 3. Pedir indexación de lo nuevo y lo que cambió
En **Inspección de URLs** (barra de arriba) pega cada URL, espera el resultado y da clic en
**Solicitar indexación**. Google limita a unas 10 solicitudes por día; ve en este orden:

1. `https://www.bryanfdesign.com/` (nueva sección de trayectoria: +150 proyectos, países y software)
2. `https://www.bryanfdesign.com/suscripcion/preguntas-frecuentes` (**página nueva**, 58 preguntas)
3. `https://www.bryanfdesign.com/suscripcion` (ahora enlaza al centro de preguntas)
4. `https://www.bryanfdesign.com/conoce-a-bryan`
5. `https://www.bryanfdesign.com/crear-web`
6. `https://www.bryanfdesign.com/lumina`

Las landings de servicio no cambiaron (solo la cifra a +150); no hace falta pedirlas hoy.

## 4. Todas las URLs del sitio (lo que verá Google)

| URL | Título | Datos estructurados |
|---|---|---|
| `/` | Crea tu Página Web en México \| BryanF Design | Organization/ProfessionalService, WebSite, OfferCatalog, FAQPage |
| `/suscripcion` | Suscripción de diseño web: $7,000 MXN al mes \| BryanF Design | Service con precio mensual, FAQPage |
| `/suscripcion/preguntas-frecuentes` | Preguntas frecuentes de la suscripción de diseño web \| BryanF Design | FAQPage (58 preguntas), BreadcrumbList |
| `/conoce-a-bryan` | Conoce a Bryan F. \| Diseñador y desarrollador web \| BryanF Design | Organization |
| `/lumina` | Lumina, asesora IA de BryanF Design \| Cotiza tu web en minutos | Organization |
| `/crear-web` | Cotiza y paga tu web en línea \| BryanF Design | Organization |
| `/desarrollo-web-mexico` | Desarrollo web en México para negocios \| BryanF Design | Service, FAQPage, BreadcrumbList |
| `/diseno-web-mexico` | Diseño web en México para marcas y PyMEs \| BryanF Design | Service, FAQPage, BreadcrumbList |
| `/diseno-ux-ui-mexico` | Diseño UX/UI en México para web y plataformas \| BryanF Design | Service, FAQPage, BreadcrumbList |
| `/paginas-web-para-negocios` | Páginas web para negocios en México \| BryanF Design | Service, FAQPage, BreadcrumbList |
| `/software-a-medida-mexico` | Software a medida en México para empresas \| BryanF Design | Service, FAQPage, BreadcrumbList |
| `/mantenimiento-web-mexico` | Mantenimiento web en México para negocios \| BryanF Design | Service, FAQPage, BreadcrumbList |
| `/privacidad` | Aviso de Privacidad – BryanF Design | — |
| `/terminos` | Términos y Condiciones – BryanF Design | — |

**No deben aparecer en Google** (y es correcto que Search Console las marque como excluidas):
- `/gracias`: "Excluida por la etiqueta noindex". Es la página del pago y del briefing.
- `/api/...`: "Bloqueada por robots.txt".

## 5. Revisar los datos estructurados
Pega estas URLs en https://search.google.com/test/rich-results y confirma que no haya errores:
- `https://www.bryanfdesign.com/`
- `https://www.bryanfdesign.com/suscripcion`
- `https://www.bryanfdesign.com/suscripcion/preguntas-frecuentes`

Ojo: desde 2023 Google muestra el resultado enriquecido de preguntas frecuentes casi solo a
sitios de gobierno y salud. El marcado sigue siendo válido y ayuda a que Google entienda la
página, pero no esperes ver las preguntas desplegadas en los resultados.

## 6. Qué esperar y qué revisar cada semana
- **Páginas** (Indexación): las 14 URLs deben pasar a "Indexadas" en días o semanas.
- **Rendimiento**: búsquedas, clics e impresiones empiezan a aparecer conforme se indexa.
  Filtra por página `/suscripcion/preguntas-frecuentes` para ver qué dudas buscan.
- **Experiencia** → Métricas web principales: deben estar en "Buenas" en móvil.
- Si algo sale "Rastreada: actualmente sin indexar", vuelve a pedir la indexación en una o dos semanas.

## Mantenerlo al día
Cada página nueva se agrega en `app/sitemap.ts` (con su fecha real en `lastModified`) y se
pide su indexación en el paso 3.

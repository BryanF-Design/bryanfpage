# Sitemap y Google Search Console

El sitio genera solo su sitemap en **https://www.bryanfdesign.com/sitemap.xml**
(`app/sitemap.ts`). Incluye la home, `/suscripcion`, `/conoce-a-bryan`,
`/lumina`, `/crear-web`, las 6 landings de servicio, privacidad y términos.
`robots.txt` ya lo anuncia. Cada página nueva se agrega en `app/sitemap.ts`.

## Darlo de alta (una sola vez)
1. Entra a https://search.google.com/search-console con la cuenta de Google del negocio.
2. Elige la propiedad **bryanfdesign.com** (tipo Dominio, `sc-domain:bryanfdesign.com`).
   Si no existe: *Agregar propiedad → Dominio → bryanfdesign.com* y verifica
   con el registro TXT que te da Google, en el DNS de tu dominio.
3. Menú izquierdo → **Sitemaps** → en "Agregar un sitemap" escribe
   `https://www.bryanfdesign.com/sitemap.xml` → **Enviar**.
4. Espera a que diga **Correcto** y muestre las páginas descubiertas (de minutos a 1 o 2 días).

## Acelerar las páginas nuevas
En **Inspección de URLs** (barra de arriba) pega cada URL y da clic en
**Solicitar indexación**:
- https://www.bryanfdesign.com/
- https://www.bryanfdesign.com/suscripcion
- https://www.bryanfdesign.com/conoce-a-bryan
- https://www.bryanfdesign.com/lumina
- https://www.bryanfdesign.com/crear-web

## Qué esperar
- La indexación tarda de días a unas semanas; **Rendimiento** empieza a mostrar
  búsquedas e impresiones conforme Google indexa.
- Revisa **Páginas** cada semana. Si `/gracias` aparece como "Excluida por noindex",
  es correcto: no debe salir en Google.
- `/suscripcion` y la home llevan datos estructurados de preguntas frecuentes, y la
  suscripción además el de servicio con precio. Puedes revisarlos en https://search.google.com/test/rich-results

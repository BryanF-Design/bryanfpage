# Google Ads — configuración del sitio

El sitio ya mide y atribuye ventas para Google Ads. Falta conectar tu cuenta.

## 1. Conversiones que mide el sitio

| Evento GA4 | Cuándo ocurre | Uso en Ads |
|---|---|---|
| `purchase` | Pago **verificado** con Stripe o Mercado Pago en `/gracias` (monto real, una vez por transacción; la suscripción cuenta con valor $7,000 e item `suscripcion`) | **Principal**: optimiza a ventas |
| `quote_request` | Formulario "¿Prefieres que te contactemos?" enviado | **Principal**: prospecto calificado |
| `generate_lead` (method `whatsapp`) | Clic a WhatsApp | Secundaria (intención, no venta) |
| `begin_checkout` | Abrió Stripe / Mercado Pago / transferencia | Observación |
| `lead_form_start`, `lumina_action`, `checkout_cancelled` | Embudo | Observación |

## 2. Dos formas de conectarlo (elige una)

**A. Importar desde GA4 (más simple, sin código):**
1. GA4 → Administrar → Eventos: marca `purchase` y `quote_request` como *eventos clave*.
2. Google Ads → Herramientas → Cuentas vinculadas → Google Analytics → vincula la propiedad.
3. Google Ads → Objetivos → Conversiones → Nueva → Importar → GA4 → selecciona `purchase` y `quote_request` (principales) y `generate_lead` (secundaria).

**B. Etiqueta directa de Ads (más precisa, con conversiones mejoradas):**
1. Google Ads → Objetivos → Conversiones → Nueva → Sitio web → crea 3 acciones:
   *Compra* (valor dinámico), *Solicitud de cotización* y *Clic a WhatsApp* (secundaria).
2. De cada una copia el `AW-XXXXXXXXX/etiqueta` y ponlo en Vercel → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=xxxxxxxx
   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=xxxxxxxx
   NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=xxxxxxxx
   ```
3. Vuelve a desplegar (son variables de compilación).
4. Activa *Conversiones mejoradas* en cada acción: el sitio ya manda el correo y el teléfono (gtag los cifra).

No uses A y B para la misma conversión a la vez: contarías doble.

## 3. A dónde mandar los anuncios

| Campaña / grupo | URL final |
|---|---|
| "crear página web", "página web para negocio" | `/paginas-web-para-negocios` |
| "desarrollo web", "programador web" | `/desarrollo-web-mexico` |
| "diseño web" | `/diseno-web-mexico` |
| "tienda en línea", "ecommerce" | `/crear-web?plan=full&modules=ecommerce,payments` |
| "mantenimiento web" | `/mantenimiento-web-mexico` |
| "diseño web mensual", "agencia web por suscripción", "mantenimiento y cambios ilimitados" | `/suscripcion` |
| Remarketing (ya cotizó) | `/crear-web` (la cotización se recupera sola) |

Plantilla de seguimiento recomendada (nivel cuenta):
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}
```
Deja activado el *etiquetado automático* (gclid). El sitio guarda gclid/utm 90 días y los adjunta al pago y al formulario: aparecen en los correos de "Pago confirmado" y "Nueva solicitud de cotización".

Extensiones de enlace sugeridas: *Arma y paga tu web* → `/crear-web`, *Tienda en línea* → `/crear-web?plan=full&modules=ecommerce,payments`, *Portafolio* → `/#projects`, *Pide tu cotización* → `/crear-web#cotizacion`.

## 4. Ventas que se cierran por WhatsApp (conversiones offline)

Si el prospecto paga por transferencia o después de platicar, el correo de la solicitud trae su **GCLID**. Súbelo en Google Ads → Conversiones → Subidas, con la fecha y el monto: así Ads aprende también de esas ventas.

## 5. Antes de lanzar

- [ ] `RESEND_API_KEY` configurada en Vercel (sin ella el formulario cae a WhatsApp y no llega correo).
- [ ] Webhooks de Stripe y Mercado Pago apuntando a `/api/stripe-webhook` y `/api/mercadopago-webhook`.
- [ ] Una compra en modo prueba: ver `purchase` en GA4 → Tiempo real.
- [ ] El formulario: ver `quote_request` en GA4 → Tiempo real.
- [ ] Google Tag Assistant: la etiqueta `AW-` dispara en `/gracias` y al enviar el formulario.

# Correos de pago, recordatorios y "Armar mi brief"

## Qué hace el sitio

| Momento | Correo al cliente | Aviso para ti |
|---|---|---|
| Pago único confirmado (Stripe / Mercado Pago) | **Pago confirmado** + botón *Armar mi brief* | Pago confirmado |
| Alta de la suscripción | **Bienvenido a Todo Digital** + *Armar mi brief* | Nueva suscripción |
| Mensualidad cobrada | **Recibimos tu mensualidad** | Renovación cobrada |
| 3 días antes del cobro | **Tu mensualidad se cobra pronto** | — |
| Cobro mensual rechazado | **No pudimos cobrar tu mensualidad** + *Pagar ahora* | Cobro fallido |
| Cancelación | **Tu suscripción quedó cancelada** | Suscripción cancelada |
| Cobro con link que tú mandas | **Tienes un pago pendiente** + *Pagar ahora* | — |
| Transferencia que confirmas a mano | **Pago confirmado** + *Armar mi brief* | Pago confirmado |
| Brief enviado | **Recibimos tu brief** | **Brief de [negocio]**: por secciones, chips, enlaces, adjuntos y botón de WhatsApp |
| Formulario de contacto / cotización | **¡Gracias! Ya tenemos tu solicitud** (si dejó correo) | **[Nombre] quiere cotizar** + botón *Responder por WhatsApp* con saludo escrito |
| Ficha OXXO / SPEI generada (Mercado Pago) | **Tu ficha de pago está lista** + *Ver mi ficha* | Ficha de pago generada |
| Pago en revisión (Mercado Pago) | **Estamos revisando tu pago** | Pago en revisión |

Plantillas: `lib/email-templates.ts`. Envío: `lib/mailer.ts` (Gmail API, con Resend de respaldo).

### Flujo de compra
1. El cliente paga y vuelve a **`/gracias`**. La página verifica el pago con Stripe o Mercado Pago.
   **Sólo con el pago confirmado** muestra "Compra exitosa" y el botón **Armar mi brief**.
   Pendiente, fallido o sin confirmar: lo dice y ofrece ayuda, sin brief.
2. **`/armar-mi-brief`** es un apartado propio: vuelve a verificar el pago y, si no está confirmado,
   no muestra el formulario. El brief va en 6 pasos (Contacto, Negocio, Proyecto, Marca,
   Materiales, Revisar) y Lumina puede llenarlo.
3. El correo de comprobante trae el mismo enlace, por si lo llena después.

## 1. Google (Gmail API)

1. [Google Cloud Console](https://console.cloud.google.com/) → crea o elige un proyecto →
   **APIs y servicios → Biblioteca → Gmail API → Habilitar**.
2. **Pantalla de consentimiento de OAuth**: tipo *Interno* si es Google Workspace (así el token no caduca a los 7 días),
   y agrega el permiso `https://www.googleapis.com/auth/gmail.send`.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth → Aplicación web**. En
   **URIs de redireccionamiento autorizados → Agregar URI** escribe exactamente
   `http://localhost:3001/oauth2callback` (http, `localhost`, sin `/` final) y **Guardar**
   (Google puede tardar unos minutos en aplicarlo). Copia `GOOGLE_CLIENT_ID` y
   `GOOGLE_CLIENT_SECRET` a `.env.local` (está en `.gitignore`).
4. Saca el refresh token **en tu computadora** (Google regresa a tu `localhost`), con
   `npm run dev` detenido porque usa el mismo puerto 3001:
   ```bash
   npm install
   npm run google:token
   ```
   Se abre el navegador; entra con `bryanf@bryanfdesign.com` y acepta. El script valida `state`
   y PKCE, comprueba que autorizaste con esa cuenta y guarda `GOOGLE_REFRESH_TOKEN` **sólo en
   `.env.local`** (no lo imprime). Si dice que no llegó refresh token, quita el acceso de la app
   en https://myaccount.google.com/permissions y vuelve a correrlo.
5. Si quieres enviar como otra dirección (p. ej. `@bryanfdesign.com.mx`), agrégala en Gmail →
   Configuración → Cuentas → **Enviar como**, y ponla en `GOOGLE_SENDER_EMAIL`.

## 2. Variables en Vercel (Production)

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_SENDER_EMAIL=bryanf@bryanfdesign.com
GOOGLE_NOTIFICATION_EMAIL=bryanf@bryanfdesign.com
BRIEF_LINK_SECRET=      # openssl rand -hex 32
ADMIN_API_KEY=          # openssl rand -hex 24
CRON_SECRET=            # openssl rand -hex 24
REMINDER_DAYS=3
```

## 3. Stripe y Mercado Pago

- **Stripe → Webhooks** (`/api/stripe-webhook`): además de los de `SUSCRIPCION_SETUP.md`, activa
  **`invoice.upcoming`**. En *Settings → Billing → Subscriptions and emails → Upcoming renewal events*
  elige con cuántos días avisa (3 o 7).
- **Mercado Pago**: no avisa antes de cobrar; lo hace el cron diario `/api/cron/subscription-reminders`
  (`vercel.json`, 9:07 CDMX). Vercel le manda `CRON_SECRET` solo.

## 4. Probar

```bash
node scripts/email-test.mjs                           # vistas previas en email-previews/
node scripts/email-test.mjs --send tu@correo.com      # las 17 plantillas por Gmail API
```

¿Está listo producción? `https://www.bryanfdesign.com/api/health` dice `"mail": "google"` (o `resend`)
y qué integraciones tienen sus variables (sólo sí/no, nunca valores). Si dice `"none"`, faltan las
variables `GOOGLE_*` en Vercel y **no sale ningún correo**.

En producción (con `ADMIN_API_KEY`):
```bash
# Enviar todas las plantillas de prueba a tu correo
curl -X POST https://www.bryanfdesign.com/api/admin/test-emails \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"to":"bryanf@bryanfdesign.com"}'

# Ver qué recordatorios de Mercado Pago saldrían hoy (sin enviar)
curl "https://www.bryanfdesign.com/api/cron/subscription-reminders?dry=1" -H "Authorization: Bearer $CRON_SECRET"
```

## 5. Cobrar con link y confirmar transferencias

**Recordatorio de pago con link** (Mercado Pago: tarjeta, OXXO, SPEI; y Stripe: tarjeta):
```bash
curl -X POST https://www.bryanfdesign.com/api/admin/payment-link \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"email":"cliente@correo.com","name":"Ana López","amount":1750,
       "concept":"Saldo del proyecto web (50 %)","modalidad":"saldo","dueDate":"2026-10-30"}'
```
Al pagar, el webhook le manda su comprobante. Para volver a recordarle, llama otra vez.

**Transferencia recibida** (manda comprobante + enlace firmado a *Armar mi brief*, válido 90 días):
```bash
curl -X POST https://www.bryanfdesign.com/api/admin/confirm-payment \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"email":"cliente@correo.com","name":"Ana López","amount":1750,
       "concept":"Anticipo del proyecto web","modalidad":"anticipo","reference":"SPEI 123456"}'
```

## Pendientes / supuestos a confirmar
- El texto del anticipo dice "el 50 % restante se paga al aprobar el diseño final". Ajústalo en
  `paymentReceived` si tu política es otra.
- Las mensualidades de Mercado Pago se detectan por `operation_type = recurring_payment`; confírmalo con el
  primer cobro real (el aviso interno llega como "Renovación cobrada").
- Sin base de datos, la protección contra correos duplicados es por instancia; un reintento del webhook
  en otra instancia podría duplicar un correo (raro).

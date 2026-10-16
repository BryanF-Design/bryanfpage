# Suscripción Todo Digital ($7,000 MXN/mes): activación

El sitio ya cobra la suscripción de forma recurrente. Esto es lo que falta en
los paneles de Stripe, Mercado Pago y Vercel.

**Dónde se edita:** el precio, en `lib/catalog.ts` (`SUBSCRIPTION_PLAN`). Qué
incluye, los pasos, la política y las preguntas frecuentes, en `lib/subscription.ts`
(la página `/suscripcion`, Lumina y los términos leen de ahí).

## Stripe (tarjeta)
1. Funciona sin configurar nada extra: el precio mensual se arma desde el catálogo.
   Opcional: crea en Stripe un producto con precio recurrente de $7,000 MXN/mes y pon
   su id en `STRIPE_SUBSCRIPTION_PRICE_ID` (así ves el producto ordenado en Stripe).
2. Webhook (`/api/stripe-webhook`): además de `checkout.session.completed`, activa
   `invoice.paid`, `invoice.payment_failed` y `customer.subscription.deleted`.
   Te llegan correos de alta, renovación, cobro fallido y cancelación.
3. Portal de clientes: Stripe → Settings → Billing → Customer portal → activa
   "cancelar suscripción" y copia el **enlace de inicio de sesión** en
   `NEXT_PUBLIC_STRIPE_PORTAL_URL`. Aparece en `/suscripcion` como
   "Administra o cancela aquí".

## Mercado Pago
1. La primera vez que alguien da clic, el sitio busca o crea el plan
   "BryanF Design · Suscripción Todo Digital" ($7,000 MXN mensual). Para fijarlo,
   copia su id (Mercado Pago → Suscripciones) en `MP_SUBSCRIPTION_PLAN_ID`.
2. Webhooks (`/api/mercadopago-webhook`): activa los eventos **Pagos** y
   **Planes y suscripciones**.

## Transferencia
El botón "Transferencia mensual" abre WhatsApp con el mensaje listo; el cobro lo
llevas tú.

## Revisa antes de vender
- [ ] Lee la política en `lib/subscription.ts` y ajústala. Hay supuestos que
      escribí y que tienes que confirmar: hosting incluido, una solicitud activa a la vez,
      uso justo de una marca, pausa tras 7 días de cobro fallido, sin
      reembolsos por meses parciales. Tampoco dice si el precio incluye IVA.
- [ ] Haz una suscripción de prueba en modo test: `/gracias` debe decir
      "¡Bienvenido a tu suscripción Todo Digital!".

## Centro de preguntas (/suscripcion/preguntas-frecuentes)
58 preguntas por tema en `lib/subscription.ts` (`SUBSCRIPTION_FAQ_CATEGORIES`). Las
marcadas con `// CONFIRMAR` responden cosas que la política aún no fija; revísalas y
ajústalas a como lo vas a manejar: IVA, factura, dominio, correos con dominio, logo,
redes sociales, fotos, apps nativas y si el precio se respeta a quien ya está suscrito.

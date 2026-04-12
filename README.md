# BryanF Page - Vercel Ready

Proyecto preparado para deploy automático en Vercel desde GitHub.

## Stack final
- Frontend estático:
  - `index.html`
  - `privacidad.html`
  - `terminos.html`
  - `style.css`
  - `fast-track.css`
  - `script.js`
  - `img/`
- Backend serverless (Vercel Functions):
  - `api/health.js`
  - `api/stripe-checkout.js`
  - `api/mercadopago.js`
  - `api/openai-chat.js`

## Endpoints
- `GET /api/health`
- `POST /api/stripe-checkout`
- `POST /api/mercadopago`
- `POST /api/openai-chat`

## Variables de entorno (Vercel)
Configura en Project Settings > Environment Variables:
- `SITE_URL`
- `STRIPE_SECRET`
- `MP_ACCESS_TOKEN`
- `OPENAI_API_KEY`

Opcionales de frontend/metadata:
- `STRIPE_PUBLIC`
- `MP_PUBLIC_KEY`
- `MP_CLIENT_ID`
- `MP_CLIENT_SECRET`

## Deploy
1. Sube este proyecto a GitHub.
2. En Vercel importa el repo.
3. Agrega variables de entorno.
4. Deploy.

## Nota de seguridad
No subir `.env` al repositorio.

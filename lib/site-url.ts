/**
 * URL pública del sitio para redirecciones de pago y webhooks. En producción
 * viene de SITE_URL; si faltara, cae a NEXT_PUBLIC_SITE_URL y, como último
 * recurso, al dominio real — nunca a un placeholder que rompería el flujo.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.bryanfdesign.com.mx";
  return raw.replace(/\/$/, "");
}

const CANONICAL_SITE_URL = "https://www.bryanfdesign.com";

/**
 * URL pública del sitio para redirecciones de pago y webhooks. En producción
 * viene de SITE_URL; si faltara, cae a NEXT_PUBLIC_SITE_URL y, como último
 * recurso, al dominio real — nunca a un placeholder que rompería el flujo.
 *
 * El sitio se mudó de bryanfdesign.com.mx a www.bryanfdesign.com. Si una
 * variable de entorno todavía apunta al dominio anterior (que ya no está
 * conectado al proyecto), se corrige aquí para que Stripe y Mercado Pago no
 * regresen al cliente a un dominio muerto.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    CANONICAL_SITE_URL;
  const url = raw.replace(/\/$/, "");
  return /bryanfdesign\.com\.mx/i.test(url) ? CANONICAL_SITE_URL : url;
}

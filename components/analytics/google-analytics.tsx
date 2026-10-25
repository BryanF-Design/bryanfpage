import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

/**
 * Etiqueta de Google (gtag.js) tal cual la entrega GA4, dentro del <head> del
 * HTML del servidor: el verificador de etiquetas la detecta y las visitas que
 * rebotan antes de hidratar también se miden. `async` no bloquea el render.
 *
 * Si hay cuenta de Google Ads (`NEXT_PUBLIC_GOOGLE_ADS_ID`), la misma etiqueta
 * se configura también para Ads: remarketing, atribución del clic (gclid) y
 * conversiones mejoradas.
 */
export function GoogleAnalytics() {
  const adsConfig = GOOGLE_ADS_ID
    ? `\n  gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });`
    : "";

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        id="google-analytics-init"
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_MEASUREMENT_ID}');${adsConfig}
`,
        }}
      />
    </>
  );
}

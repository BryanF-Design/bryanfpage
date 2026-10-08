import { GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Etiqueta de Google (gtag.js) tal cual la entrega GA4, dentro del <head> del
 * HTML del servidor: el verificador de etiquetas la detecta y las visitas que
 * rebotan antes de hidratar también se miden. `async` no bloquea el render.
 */
export function GoogleAnalytics() {
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

  gtag('config', '${GA_MEASUREMENT_ID}');
`,
        }}
      />
    </>
  );
}

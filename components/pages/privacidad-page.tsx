"use client";

import { LegalPage } from "@/components/pages/legal-page";

/** /privacidad — Aviso de Privacidad (mismo contenido legal, dicho claro). */
export function PrivacidadPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Aviso de Privacidad"
      subtitle="Qué datos tuyos uso, para qué y cómo puedes pedir que los corrija o los borre."
      updated="Última actualización: noviembre de 2026"
      sections={[
        {
          title: "Qué datos recopilo",
          body: (
            <>
              <p>Para cotizar y hacer tu proyecto te pido:</p>
              <ul>
                <li>Nombre completo o razón social.</li>
                <li>Correo electrónico y teléfono (WhatsApp).</li>
                <li>Información general de tu negocio o proyecto.</li>
                <li>Datos de facturación, que se procesan por pasarelas seguras (Stripe, Mercado Pago).</li>
              </ul>
            </>
          ),
        },
        {
          title: "Para qué los uso",
          body: (
            <p>
              Solo para cotizarte, avisarte cómo va tu página o sistema, darte soporte y mandarte
              información de los servicios que contrataste.
            </p>
          ),
        },
        {
          title: "Con quién los comparto",
          body: (
            <p>
              No vendo, no rento y no comparto tus datos. Los únicos terceros son Stripe y Mercado Pago,
              y solo para procesar pagos.
            </p>
          ),
        },
        {
          title: "Cookies",
          body: (
            <p>
              El sitio usa cookies para medir las visitas y recordar tus preferencias, como el idioma o
              una cotización que dejaste a medias.
            </p>
          ),
        },
        {
          title: "Tus derechos ARCO",
          body: (
            <p>
              Para acceder, rectificar, cancelar u oponerte al uso de tus datos, escríbeme a{" "}
              <a href="mailto:bryanf@bryanfdesign.com?subject=Derechos%20ARCO">bryanf@bryanfdesign.com</a>.
            </p>
          ),
        },
      ]}
    />
  );
}

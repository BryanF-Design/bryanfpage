"use client";

import { LegalPage } from "@/components/pages/legal-page";

/** /terminos — Términos y Condiciones (mismo contenido legal, dicho claro). */
export function TerminosPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos y Condiciones"
      subtitle="Lo que acordamos cuando trabajas conmigo: qué hago, cómo se paga y qué le toca a cada quien."
      updated="Última actualización: noviembre de 2026"
      sections={[
        {
          title: "Qué servicios ofrezco",
          body: (
            <p>
              Páginas web, diseño UX/UI, plataformas digitales, sistemas en línea, software a medida y
              automatizaciones para negocios. Al contratar cualquiera de estos servicios aceptas estos
              términos.
            </p>
          ),
        },
        {
          title: "Pagos seguros",
          body: (
            <p>
              Los pagos en línea se procesan cifrados con Stripe y Mercado Pago; yo nunca guardo los datos
              de tu tarjeta. Al pagar por esas plataformas también aplican sus propios términos de uso.
              Si prefieres, puedes pagar por transferencia SPEI.
            </p>
          ),
        },
        {
          title: "Reembolsos",
          body: (
            <p>
              Como se trata de trabajo digital hecho a mano, no hay reembolsos una vez que el proyecto
              arrancó o que se entregó formalmente lo digital (hosting, dominio o código fuente).
            </p>
          ),
        },
        {
          title: "Lo que te toca a ti",
          body: (
            <p>
              Para cumplir los tiempos necesito tus materiales a tiempo: logotipo, textos, fotos o
              inventario. Si se retrasan de tu lado, la fecha de entrega se recorre lo mismo.
            </p>
          ),
        },
        {
          title: "Hasta dónde respondo",
          body: (
            <p>
              Entrego tu sitio completo y funcionando como lo acordamos. No respondo por fallas que
              vengan de cambios que otra persona haga al código, de caídas de servidores ajenos o del
              mal uso del panel después de la capacitación.
            </p>
          ),
        },
      ]}
    />
  );
}

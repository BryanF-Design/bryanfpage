import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";
import { SUBSCRIPTION_PRICE_LABEL } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Términos y Condiciones | BryanF Design",
  description: "Términos y condiciones de uso y contrataciones de BryanF Design.",
  alternates: { canonical: "/terminos" },
  openGraph: {
    url: "/terminos",
    title: "Términos y Condiciones | BryanF Design",
    description: "Términos y condiciones de uso y contrataciones de BryanF Design.",
  },
};

export default function TerminosPage() {
  return (
    <LegalPage eyebrow="Términos" title="Términos y Condiciones" updated="octubre de 2026">
      <p>
        Bienvenido a <strong>BryanF Design</strong>. Al contratar nuestros servicios, soluciones SaaS o cualquier
        proyecto de desarrollo de software, aceptas los siguientes términos de servicio.
      </p>

      <h2>1. Descripción de servicios</h2>
      <p>
        Ofrecemos soluciones tecnológicas premium que abarcan el{" "}
        <strong>
          desarrollo de páginas web, diseño UX/UI, programación de plataformas digitales, sistemas online, software a
          medida y automatizaciones
        </strong>{" "}
        para empresas.
      </p>

      <h2>2. Pagos y transacciones seguras</h2>
      <p>
        Todos los pagos se procesan de forma cifrada mediante pasarelas internacionales de alta seguridad,
        específicamente <strong>Stripe</strong> y <strong>Mercado Pago</strong>. Nosotros no almacenamos información
        directa de tarjetas bancarias. Al adquirir nuestros servicios, estás sujeto adicionalmente a los términos de uso
        de dichas plataformas financieras.
      </p>

      <h2>3. Política de reembolsos y devoluciones</h2>
      <p>
        Debido a la naturaleza de los bienes digitales y del trabajo manual involucrado en el diseño y desarrollo de
        software, <strong>no existen reembolsos una vez iniciado el proyecto</strong> o una vez entregada formalmente la
        infraestructura digital (hospedaje, dominios o código fuente).
      </p>

      <h2>4. Responsabilidades del cliente</h2>
      <p>
        Para asegurar tiempos óptimos de desarrollo y automatización de procesos, el cliente se compromete a entregar
        los materiales informativos (logotipos, copys, inventario) en el tiempo estipulado. Los retrasos imputables al
        cliente extenderán las fechas de entrega final del sistema web.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        BryanF Design garantiza la optimización estructural y entrega del ecosistema digital, pero no nos hacemos
        responsables por fallas críticas provocadas por modificaciones de terceros al código fuente, caídas de
        servidores ajenos o mal manejo del panel de administración por parte del cliente una vez capacitado.
      </p>

      <h2 id="suscripcion">6. Suscripción Todo Digital</h2>
      <p>
        La suscripción mensual Todo Digital ({SUBSCRIPTION_PRICE_LABEL} al mes) se cobra automáticamente cada mes con el
        método de pago elegido y no tiene plazo forzoso: el cliente puede cancelarla en cualquier momento y conserva el
        acceso hasta el final del periodo pagado, sin reembolsos por meses parciales. Cada solicitud se entrega en 1 a 2
        días hábiles según su complejidad, trabajando una solicitud activa a la vez. No incluye pagos a terceros (pauta
        publicitaria, licencias, dominios adicionales, comisiones de pasarelas ni impresión). Las reglas completas están
        en la <Link href="/suscripcion#politica">Política de la suscripción</Link>, que forma parte de estos Términos.
      </p>
    </LegalPage>
  );
}

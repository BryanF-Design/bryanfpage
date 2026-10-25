import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | BryanF Design",
  description: "Cómo recopilamos, usamos y protegemos tus datos personales en BryanF Design.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    url: "/privacidad",
    title: "Aviso de Privacidad | BryanF Design",
    description: "Cómo recopilamos, usamos y protegemos tus datos personales en BryanF Design.",
  },
};

export default function PrivacidadPage() {
  return (
    <LegalPage eyebrow="Privacidad" title="Aviso de Privacidad" updated="octubre de 2026">
      <p>
        En <strong>BryanF Design</strong> nos tomamos muy en serio la seguridad y privacidad de tus datos. Este Aviso de
        Privacidad explica cómo recopilamos, utilizamos y protegemos la información personal de nuestros clientes y
        usuarios que interactúan con nuestros servicios de{" "}
        <strong>desarrollo web, creación de plataformas digitales y sistemas online</strong>.
      </p>

      <h2>1. Información que recolectamos</h2>
      <p>
        Para brindarte el mejor servicio en el diseño y desarrollo de tu proyecto digital, recolectamos los siguientes
        datos personales y de negocio:
      </p>
      <ul>
        <li>Nombre completo o razón social.</li>
        <li>Correo electrónico y número de teléfono (WhatsApp).</li>
        <li>Información general de tu empresa o proyecto.</li>
        <li>Datos de facturación, procesados indirectamente a través de pasarelas seguras (Stripe, Mercado Pago).</li>
      </ul>

      <h2>2. Uso de la información</h2>
      <p>
        Tus datos son utilizados exclusivamente para: proporcionarte cotizaciones personalizadas de software a medida,
        mantener comunicación sobre los avances de tu página web, automatización de procesos digitales, notificaciones
        sobre servicios SaaS y soporte técnico.
      </p>

      <h2>3. Protección de datos y terceros</h2>
      <p>
        No vendemos, alquilamos ni compartimos tus datos con terceros no autorizados. Sin embargo, utilizamos
        proveedores externos certificados y seguros como <strong>Stripe</strong> y <strong>Mercado Pago</strong>{" "}
        estrictamente para el procesamiento de transacciones financieras.
      </p>

      <h2>4. Uso de cookies</h2>
      <p>
        Nuestra plataforma digital utiliza cookies esenciales para analizar el tráfico del sitio, recordar las
        preferencias de los usuarios (como el idioma o cotizaciones en curso) y ofrecer una experiencia de usuario (UX)
        impecable.
      </p>

      <h2>5. Contacto sobre privacidad</h2>
      <p>
        Si deseas rectificar, cancelar u oponerte al uso de tus datos (Derechos ARCO), por favor escríbenos directamente
        a: <a href="mailto:bryanf@bryanfdesign.com">bryanf@bryanfdesign.com</a>.
      </p>
    </LegalPage>
  );
}

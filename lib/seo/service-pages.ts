import type { Metadata } from "next";

export const SITE_URL = "https://www.bryanfdesign.com.mx";
export const BRAND_NAME = "BryanF Design";
export const CONTACT_EMAIL = "bryanf@bryanfdesign.com.mx";
export const WHATSAPP_URL = "https://wa.me/525663012505";

export interface ServicePage {
  slug: string;
  priority: number;
  keyword: string;
  serviceType: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  problems: string[];
  solution: string;
  process: string[];
  deliverables: string[];
  differentiators: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedSlugs: string[];
  relatedCases: string[];
}

export const servicePages: ServicePage[] = [
  {
    slug: "desarrollo-web-mexico",
    priority: 0.92,
    keyword: "desarrollo web en México",
    serviceType: "Desarrollo web",
    eyebrow: "Desarrollo web en México",
    title: "Desarrollo web profesional para negocios que necesitan vender en línea",
    metaTitle: "Desarrollo web en México para negocios | BryanF Design",
    metaDescription:
      "Desarrollo web en México para PyMEs y empresas: sitios rápidos, seguros, medibles y orientados a conversión. Cotiza tu proyecto con BryanF Design.",
    intro:
      "Construimos sitios y plataformas web con una base técnica sólida, diseño claro y rutas de conversión pensadas para que un visitante pueda entender, confiar y contactarte.",
    problems: [
      "Tu sitio actual no explica bien qué vendes ni por qué deberían elegirte.",
      "La web carga lento, se rompe en móvil o depende demasiado de plantillas genéricas.",
      "No tienes una ruta clara para captar leads, medir interés o actualizar contenido.",
    ],
    solution:
      "Diseñamos y desarrollamos una presencia web a medida con arquitectura Next.js, copy comercial, performance, SEO técnico y CTAs conectados a WhatsApp, correo o pago en línea.",
    process: [
      "Aterrizaje de objetivos, oferta, audiencia y evidencia disponible.",
      "Estructura de páginas, wireframe y mensajes clave antes de diseñar.",
      "Desarrollo responsive con metadata, schema y componentes reutilizables.",
      "Revisión, ajustes, publicación y checklist de medición.",
    ],
    deliverables: [
      "Sitio web responsive listo para publicar.",
      "Metadata, sitemap, robots y schema base.",
      "CTAs hacia WhatsApp, contacto o cotización.",
      "Capacitación breve y entrega de accesos cuando aplique.",
    ],
    differentiators: [
      "Enfoque comercial, no sólo visual.",
      "Base técnica moderna con buenas prácticas de SEO.",
      "Diseño a medida para diferenciarte de plantillas comunes.",
      "Automatización y pagos disponibles cuando el proyecto lo necesita.",
    ],
    faqs: [
      {
        question: "¿Cuánto tarda un desarrollo web?",
        answer:
          "Depende del alcance y del material disponible. Los proyectos pequeños pueden arrancar desde pocos días hábiles cuando la información está completa.",
      },
      {
        question: "¿Pueden mejorar un sitio existente?",
        answer:
          "Sí. Podemos auditarlo, ordenar su estructura, mejorar velocidad, actualizar diseño y preparar metadata sin reconstruir todo si no hace falta.",
      },
      {
        question: "¿Incluye SEO?",
        answer:
          "Incluye base técnica SEO: metadata, estructura semántica, sitemap, robots, schema recomendado e interlinking inicial.",
      },
    ],
    relatedSlugs: [
      "diseno-web-mexico",
      "software-a-medida-mexico",
      "paginas-web-para-negocios",
    ],
    relatedCases: ["Koi Arquitectura", "Efficient Plasticolors", "NKMOH Café"],
  },
  {
    slug: "diseno-web-mexico",
    priority: 0.9,
    keyword: "diseño web en México",
    serviceType: "Diseño web",
    eyebrow: "Diseño web en México",
    title: "Diseño web claro, moderno y orientado a convertir visitantes en clientes",
    metaTitle: "Diseño web en México para marcas y PyMEs | BryanF Design",
    metaDescription:
      "Diseño web en México para negocios que necesitan una presencia profesional, rápida y alineada a ventas. UX, contenido, visuales y CTAs claros.",
    intro:
      "Creamos interfaces que presentan tu negocio con intención: jerarquía visual, mensajes directos, navegación simple y una experiencia que guía al usuario hacia la acción correcta.",
    problems: [
      "Tu marca se ve menos profesional en línea que en la vida real.",
      "La página tiene demasiada información sin una prioridad visual clara.",
      "El visitante no sabe qué hacer después de leer tu oferta.",
    ],
    solution:
      "Definimos la experiencia visual y de contenido para que cada sección responda una duda, reduzca fricción y acerque al usuario a una cotización o conversación.",
    process: [
      "Revisión de marca, oferta, audiencia y referentes.",
      "Diseño de estructura, navegación, secciones y CTAs.",
      "Propuesta visual responsive y ajustes de contenido.",
      "Preparación para desarrollo, publicación o mejora continua.",
    ],
    deliverables: [
      "Diseño responsive para desktop y móvil.",
      "Jerarquía de mensajes para secciones clave.",
      "Guía de CTAs y navegación interna.",
      "Recomendaciones de contenido y recursos visuales.",
    ],
    differentiators: [
      "Diseño pensado para decisiones de compra, no para decorar.",
      "Texto y visuales trabajando juntos.",
      "Experiencia consistente en móvil.",
      "Preparación para SEO on-page desde la estructura.",
    ],
    faqs: [
      {
        question: "¿Diseño web es lo mismo que desarrollo web?",
        answer:
          "No exactamente. El diseño define estructura, experiencia y visuales; el desarrollo lo convierte en un sitio funcional y publicable.",
      },
      {
        question: "¿Pueden trabajar con mi identidad actual?",
        answer:
          "Sí. Podemos respetar tu identidad existente o proponer ajustes si detectamos problemas de claridad, legibilidad o conversión.",
      },
      {
        question: "¿El diseño se entrega listo para desarrollar?",
        answer:
          "Sí. El objetivo es que el diseño tenga estructura, contenido y prioridades claras para avanzar a desarrollo sin ambigüedad.",
      },
    ],
    relatedSlugs: [
      "desarrollo-web-mexico",
      "diseno-ux-ui-mexico",
      "paginas-web-para-negocios",
    ],
    relatedCases: ["Element Experiences", "Koi Arquitectura", "Golden Republic"],
  },
  {
    slug: "diseno-ux-ui-mexico",
    priority: 0.86,
    keyword: "diseño UX/UI en México",
    serviceType: "Diseño UX/UI",
    eyebrow: "Diseño UX/UI en México",
    title: "UX/UI para productos y sitios que necesitan ser claros, usables y medibles",
    metaTitle: "Diseño UX/UI en México para web y plataformas | BryanF Design",
    metaDescription:
      "Diseño UX/UI en México para sitios, plataformas y flujos digitales. Estructura, wireframes, interfaces y mejoras orientadas a conversión.",
    intro:
      "Ordenamos flujos, pantallas y decisiones para que tu sitio o plataforma sea más fácil de entender, usar y mejorar con datos reales.",
    problems: [
      "Los usuarios se pierden, abandonan o preguntan cosas que la interfaz debería resolver.",
      "El diseño visual no está conectado con objetivos de negocio medibles.",
      "Cada nueva pantalla se diseña de forma distinta y la experiencia pierde consistencia.",
    ],
    solution:
      "Creamos una arquitectura de experiencia con pantallas, componentes, jerarquía, estados y criterios de medición para mejorar claridad y conversión.",
    process: [
      "Diagnóstico de usuarios, objetivos y fricciones actuales.",
      "Mapa de flujos y wireframes para decisiones clave.",
      "Diseño UI responsive con componentes reutilizables.",
      "Checklist de usabilidad, accesibilidad y medición.",
    ],
    deliverables: [
      "Wireframes o estructura de flujos prioritarios.",
      "Pantallas UI para desktop y móvil.",
      "Sistema visual ligero para mantener consistencia.",
      "Recomendaciones de eventos y métricas de UX.",
    ],
    differentiators: [
      "UX conectado a negocio, no a teoría aislada.",
      "Diseño preparado para implementarse en frontend.",
      "Componentes reutilizables para escalar sin desorden.",
      "Criterios claros para decidir qué mejorar después.",
    ],
    faqs: [
      {
        question: "¿UX/UI sirve para sitios pequeños?",
        answer:
          "Sí. Incluso una landing sencilla necesita jerarquía, claridad, CTAs y navegación pensada para reducir dudas.",
      },
      {
        question: "¿Pueden auditar una interfaz existente?",
        answer:
          "Sí. Podemos revisar fricción, consistencia, accesibilidad, mensajes y oportunidades de conversión.",
      },
      {
        question: "¿Incluye desarrollo?",
        answer:
          "Puede incluirse. UX/UI puede entregarse como diseño o como parte de un desarrollo web completo.",
      },
    ],
    relatedSlugs: [
      "diseno-web-mexico",
      "software-a-medida-mexico",
      "desarrollo-web-mexico",
    ],
    relatedCases: ["HomeFlow", "Element Experiences", "Repissa"],
  },
  {
    slug: "paginas-web-para-negocios",
    priority: 0.88,
    keyword: "páginas web para negocios",
    serviceType: "Páginas web para negocios",
    eyebrow: "Páginas web para negocios",
    title: "Páginas web para negocios que necesitan presencia, confianza y contactos",
    metaTitle: "Páginas web para negocios en México | BryanF Design",
    metaDescription:
      "Páginas web para negocios: sitio profesional, secciones claras, WhatsApp, formulario, SEO base y diseño responsive para captar clientes.",
    intro:
      "Creamos páginas web prácticas para negocios que necesitan verse profesionales, explicar su oferta y recibir prospectos sin complicar el proceso.",
    problems: [
      "Tus clientes te buscan y encuentran redes sociales incompletas o información dispersa.",
      "No tienes una página que explique servicios, precios base, ubicación o proceso.",
      "Dependes de mensajes manuales para responder siempre las mismas preguntas.",
    ],
    solution:
      "Diseñamos un sitio directo con propuesta de valor, servicios, confianza, preguntas frecuentes y CTAs para que tus prospectos puedan avanzar rápido.",
    process: [
      "Recolectamos información de negocio, servicios y material visual.",
      "Definimos secciones esenciales y textos claros.",
      "Construimos el sitio con enfoque móvil y SEO básico.",
      "Conectamos WhatsApp, correo, formulario o pagos según el caso.",
    ],
    deliverables: [
      "Página web profesional para presentar tu negocio.",
      "Secciones de servicios, proceso, FAQ y contacto.",
      "Optimización móvil y base técnica SEO.",
      "Integración de CTA principal hacia WhatsApp o cotización.",
    ],
    differentiators: [
      "Pensado para dueños de negocio, no para equipos técnicos.",
      "Entrega clara, sin inflar funciones innecesarias.",
      "Estructura preparada para crecer a más páginas después.",
      "Lenguaje comercial directo y fácil de entender.",
    ],
    faqs: [
      {
        question: "¿Qué necesita mi negocio para empezar?",
        answer:
          "Nombre, servicios, fotos o referencias visuales, datos de contacto, ubicación si aplica y una idea clara de qué quieres vender o promover.",
      },
      {
        question: "¿Puedo empezar con una sola página?",
        answer:
          "Sí. Una página bien estructurada puede funcionar como primera presencia digital y luego crecer a servicios, casos o blog.",
      },
      {
        question: "¿Se puede conectar a WhatsApp?",
        answer:
          "Sí. Podemos crear CTAs directos y mensajes precargados para facilitar el contacto.",
      },
    ],
    relatedSlugs: [
      "diseno-web-mexico",
      "desarrollo-web-mexico",
      "mantenimiento-web-mexico",
    ],
    relatedCases: ["NKMOH Café", "Playera Publimax", "Servicios ECEM"],
  },
  {
    slug: "software-a-medida-mexico",
    priority: 0.84,
    keyword: "software a medida México",
    serviceType: "Software a medida",
    eyebrow: "Software a medida México",
    title: "Software a medida para procesos que ya no caben en hojas de cálculo",
    metaTitle: "Software a medida en México para empresas | BryanF Design",
    metaDescription:
      "Software a medida en México: plataformas internas, dashboards, automatizaciones, pagos y sistemas web pensados para procesos reales.",
    intro:
      "Cuando tu operación depende de procesos manuales repetidos, diseñamos herramientas web a medida para ordenar información, reducir errores y medir mejor.",
    problems: [
      "Tu equipo repite capturas, copias y seguimiento manual todos los días.",
      "La información vive repartida entre WhatsApp, hojas de cálculo y correos.",
      "Necesitas una herramienta propia pero no sabes si conviene empezar grande o pequeño.",
    ],
    solution:
      "Creamos una primera versión funcional con flujos claros, usuarios, datos y automatizaciones esenciales, cuidando que pueda crecer sin rehacer todo.",
    process: [
      "Mapeo del proceso actual y puntos de fricción.",
      "Definición de MVP, usuarios, permisos y datos críticos.",
      "Diseño y desarrollo de la plataforma web.",
      "Pruebas con casos reales y plan de mejora incremental.",
    ],
    deliverables: [
      "MVP o plataforma web a medida.",
      "Flujos de captura, consulta y administración.",
      "Integraciones con pagos, correo o APIs si aplica.",
      "Documentación básica de uso y siguientes mejoras.",
    ],
    differentiators: [
      "Construimos lo necesario primero, sin sobredimensionar.",
      "Diseño UX/UI integrado al desarrollo.",
      "Arquitectura preparada para automatización y analítica.",
      "Comunicación clara para usuarios no técnicos.",
    ],
    faqs: [
      {
        question: "¿Qué tipo de software pueden crear?",
        answer:
          "Dashboards, portales, formularios avanzados, cotizadores, sistemas de seguimiento, pagos y herramientas internas web.",
      },
      {
        question: "¿Necesito tener todo definido?",
        answer:
          "No. Podemos empezar con un diagnóstico y convertir tu proceso actual en un alcance de MVP.",
      },
      {
        question: "¿Puede integrarse con herramientas existentes?",
        answer:
          "Sí, cuando la herramienta tenga API o método de integración viable. Si no, se documenta la limitación antes de prometerlo.",
      },
    ],
    relatedSlugs: [
      "desarrollo-web-mexico",
      "diseno-ux-ui-mexico",
      "mantenimiento-web-mexico",
    ],
    relatedCases: ["HomeFlow", "Efficient Plasticolors", "Bravologix"],
  },
  {
    slug: "mantenimiento-web-mexico",
    priority: 0.82,
    keyword: "mantenimiento web México",
    serviceType: "Mantenimiento web",
    eyebrow: "Mantenimiento web México",
    title: "Mantenimiento web para mantener tu sitio actualizado, rápido y confiable",
    metaTitle: "Mantenimiento web en México para negocios | BryanF Design",
    metaDescription:
      "Mantenimiento web en México: actualizaciones, mejoras, respaldo, ajustes de contenido, revisión técnica y soporte para sitios de negocio.",
    intro:
      "Cuidamos sitios existentes para que sigan funcionando, carguen correctamente, mantengan contenido vigente y no pierdan oportunidades por errores evitables.",
    problems: [
      "Tu sitio se quedó desactualizado y ya no refleja tus servicios actuales.",
      "No tienes a quién pedir cambios rápidos sin abrir un proyecto desde cero.",
      "Han aparecido errores, enlaces rotos o problemas de rendimiento.",
    ],
    solution:
      "Damos seguimiento técnico y de contenido con prioridades claras: estabilidad, seguridad, velocidad, cambios comerciales y mejoras SEO incrementales.",
    process: [
      "Revisión inicial de estado técnico y contenido.",
      "Priorización de correcciones, actualizaciones y mejoras.",
      "Ejecución controlada con respaldo o historial de cambios.",
      "Reporte de acciones y pendientes recomendados.",
    ],
    deliverables: [
      "Ajustes de contenido, secciones o CTAs.",
      "Revisión de enlaces, metadata y errores visibles.",
      "Soporte técnico para actualizaciones y mejoras menores.",
      "Reporte simple de cambios realizados.",
    ],
    differentiators: [
      "Mantenimiento con mirada comercial y SEO.",
      "Cambios priorizados por impacto, no por ruido.",
      "Comunicación clara de riesgos antes de tocar áreas sensibles.",
      "Capacidad de escalar a rediseño o desarrollo si hace falta.",
    ],
    faqs: [
      {
        question: "¿Pueden mantener un sitio que no desarrollaron?",
        answer:
          "Sí, primero se revisa stack, accesos, hosting y riesgos. Si hay limitaciones técnicas se documentan antes de cambiarlo.",
      },
      {
        question: "¿Incluye cambios de contenido?",
        answer:
          "Sí, puede incluir ajustes de textos, imágenes, CTAs, enlaces y secciones pequeñas según el plan acordado.",
      },
      {
        question: "¿Incluye monitoreo SEO?",
        answer:
          "Puede incluir revisión de metadata, sitemap, robots, Search Console y oportunidades de mejora si se entregan accesos.",
      },
    ],
    relatedSlugs: [
      "paginas-web-para-negocios",
      "desarrollo-web-mexico",
      "software-a-medida-mexico",
    ],
    relatedCases: ["Servicios ECEM", "Industrias Tritton", "NDT 360"],
  },
];

export function getServicePage(slug: string) {
  const page = servicePages.find((item) => item.slug === slug);

  if (!page) {
    throw new Error(`Unknown service page: ${slug}`);
  }

  return page;
}

export function getRelatedServicePages(page: ServicePage) {
  return page.relatedSlugs.map(getServicePage);
}

export function createServiceMetadata(page: ServicePage): Metadata {
  const path = `/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName: BRAND_NAME,
      url: path,
      title: page.metaTitle,
      description: page.metaDescription,
      images: [
        {
          url: "/img/logotipo-blanco.png",
          width: 2904,
          height: 1016,
          alt: BRAND_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: ["/img/logotipo-blanco.png"],
    },
    robots: { index: true, follow: true },
  };
}

import type { Metadata } from "next";

export const SITE_URL = "https://www.bryanfdesign.com";
export const BRAND_NAME = "BryanF Design";
export const CONTACT_EMAIL = "bryanf@bryanfdesign.com";
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
    keyword: "desarrollo de sitios web en México",
    serviceType: "Desarrollo web",
    eyebrow: "Desarrollo web en México",
    title: "Desarrollo web a la medida de tu negocio, en cualquier parte de México",
    metaTitle: "Desarrollo de sitios web en México | BryanF Design",
    metaDescription:
      "Desarrollo de sitios web a medida para negocios de todo México, de la CDMX a Los Cabos. Rápidos, seguros y fáciles de actualizar. Platiquemos tu proyecto.",
    intro:
      "Programo sitios y plataformas web sobre una base técnica sólida, con un diseño claro y caminos sencillos para que quien te visita entienda lo que haces, confíe en ti y te escriba.",
    problems: [
      "Tu sitio actual no explica bien qué vendes ni por qué deberían elegirte.",
      "Carga lento, se rompe en el celular o se nota que es una plantilla.",
      "No tienes forma de recibir contactos, saber qué buscan tus visitas o cambiar el contenido sin ayuda.",
    ],
    solution:
      "Hago tu sitio a la medida con Next.js: textos que se entienden, velocidad, SEO técnico y botones que llevan a WhatsApp, a tu correo o al pago en línea, según lo que necesites.",
    process: [
      "Platicamos de tus objetivos, tu oferta, tu público y el material que ya tienes.",
      "Armo la estructura de páginas y los mensajes clave antes de diseñar.",
      "Programo el sitio responsive, con metadatos, datos estructurados y componentes reutilizables.",
      "Revisamos juntos, ajusto, publico y dejo lista la medición.",
    ],
    deliverables: [
      "Tu sitio responsive, listo para publicar.",
      "Metadatos, sitemap, robots y datos estructurados básicos.",
      "Botones hacia WhatsApp, contacto o cotización.",
      "Una capacitación corta y la entrega de tus accesos.",
    ],
    differentiators: [
      "Pienso en tu negocio, no solo en que se vea bonito.",
      "Tecnología moderna y buenas prácticas de SEO desde el inicio.",
      "Un diseño hecho para ti, que no se confunde con una plantilla.",
      "Si lo necesitas, sumo pagos en línea y automatizaciones.",
    ],
    faqs: [
      {
        question: "¿Cuánto tarda un desarrollo web?",
        answer:
          "Depende del alcance y de qué tan listo esté tu material. Los proyectos pequeños pueden arrancar en pocos días hábiles cuando ya tengo toda la información.",
      },
      {
        question: "¿Puedes mejorar un sitio que ya tengo?",
        answer:
          "Sí. Lo reviso, ordeno su estructura, mejoro la velocidad, actualizo el diseño y preparo los metadatos sin rehacer todo si no hace falta.",
      },
      {
        question: "¿Incluye SEO?",
        answer:
          "Incluye la base técnica: metadatos, estructura semántica, sitemap, robots, datos estructurados y enlaces internos.",
      },
      {
        question: "¿Trabajas con negocios fuera de la CDMX?",
        answer:
          "Sí. Trabajo a distancia con negocios de toda la República, de Los Cabos a Mérida, y también con clientes en España y Francia. Todo se resuelve por videollamada, WhatsApp y correo.",
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
    keyword: "diseño web en CDMX",
    serviceType: "Diseño web",
    eyebrow: "Diseño web en CDMX y todo México",
    title: "Diseño web en CDMX para que tu negocio se vea como lo que es",
    metaTitle: "Diseño web en CDMX (DF) y todo México | BryanF Design",
    metaDescription:
      "Diseño web en la Ciudad de México (el antiguo DF) para negocios de todo el país: sitios claros, rápidos y hechos a tu medida, con trato directo conmigo.",
    intro:
      "Diseño tu sitio pensando en quien lo va a visitar: qué necesita ver primero, qué dudas tiene y qué le ayuda a decidirse a escribirte. Trabajo desde la CDMX con negocios de todo México.",
    problems: [
      "En persona tu marca se ve mucho mejor que en internet.",
      "Tu página tiene mucha información, pero nada destaca.",
      "La gente lee tu oferta y no sabe qué hacer después.",
    ],
    solution:
      "Defino contigo el contenido y el diseño para que cada sección resuelva una duda, quite fricción y acerque a tu visitante a pedirte una cotización o a escribirte.",
    process: [
      "Reviso tu marca, tu oferta, tu público y las referencias que te gustan.",
      "Diseño la estructura, la navegación, las secciones y los botones.",
      "Te presento la propuesta para escritorio y celular, y ajustamos los textos.",
      "Lo dejo listo para programar, publicar o seguir mejorando.",
    ],
    deliverables: [
      "Diseño responsive para escritorio y celular.",
      "El orden de los mensajes en las secciones clave.",
      "Una guía de botones y navegación interna.",
      "Recomendaciones de contenido y de imágenes.",
    ],
    differentiators: [
      "Diseño pensado para ayudarte a cerrar clientes, no para decorar.",
      "Los textos y las imágenes trabajan juntos.",
      "Se ve igual de bien en el celular.",
      "La estructura ya viene lista para el SEO on-page.",
    ],
    faqs: [
      {
        question: "¿Diseño web es lo mismo que desarrollo web?",
        answer:
          "No exactamente. El diseño define la estructura, la experiencia y lo visual; el desarrollo lo convierte en un sitio que funciona y se puede publicar. Yo hago las dos cosas.",
      },
      {
        question: "¿Puedes trabajar con la identidad que ya tengo?",
        answer:
          "Claro. Respeto tu identidad actual o te propongo ajustes si veo problemas de claridad o de lectura.",
      },
      {
        question: "¿El diseño se entrega listo para programar?",
        answer:
          "Sí. La idea es que tenga estructura, contenido y prioridades claras para pasar a desarrollo sin dudas.",
      },
      {
        question: "¿Solo trabajas en la CDMX?",
        answer:
          "Estoy en la Ciudad de México, pero trabajo a distancia con negocios de todo el país. Nos vemos por videollamada y avanzamos por WhatsApp y correo.",
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
    title: "Diseño UX/UI para sitios y plataformas que la gente entiende a la primera",
    metaTitle: "Diseño UX/UI para sitios y plataformas | BryanF Design",
    metaDescription:
      "Diseño UX/UI en México para sitios, plataformas y flujos digitales: estructura, wireframes e interfaces fáciles de usar, pensadas con datos reales.",
    intro:
      "Ordeno los flujos, las pantallas y las decisiones para que tu sitio o tu plataforma sea más fácil de entender, de usar y de mejorar con datos reales.",
    problems: [
      "La gente se pierde, abandona o pregunta cosas que la pantalla debería resolver.",
      "El diseño se ve bien, pero no está conectado con lo que tu negocio necesita medir.",
      "Cada pantalla nueva se diseña distinto y la experiencia se siente dispareja.",
    ],
    solution:
      "Armo la arquitectura de la experiencia: pantallas, componentes, jerarquía, estados y qué medir, para que todo sea más claro y te escriban más.",
    process: [
      "Entiendo a tus usuarios, tus objetivos y dónde se atoran hoy.",
      "Dibujo el mapa de flujos y los wireframes de las decisiones clave.",
      "Diseño la interfaz responsive con componentes reutilizables.",
      "Reviso usabilidad, accesibilidad y medición.",
    ],
    deliverables: [
      "Wireframes o la estructura de los flujos principales.",
      "Pantallas para escritorio y celular.",
      "Un sistema visual ligero para mantener la consistencia.",
      "Recomendaciones de eventos y métricas de UX.",
    ],
    differentiators: [
      "UX aterrizado a tu negocio, no teoría.",
      "Diseño listo para programarse.",
      "Componentes reutilizables para crecer sin desorden.",
      "Criterios claros para decidir qué mejorar después.",
    ],
    faqs: [
      {
        question: "¿UX/UI sirve para sitios pequeños?",
        answer:
          "Sí. Hasta una landing sencilla necesita jerarquía, claridad, botones visibles y una navegación que no deje dudas.",
      },
      {
        question: "¿Puedes revisar una interfaz que ya existe?",
        answer:
          "Sí. Reviso dónde se atora la gente, la consistencia, la accesibilidad, los mensajes y lo que se puede mejorar para que te escriban más.",
      },
      {
        question: "¿Incluye desarrollo?",
        answer:
          "Puede incluirlo. Te entrego el diseño solo o como parte de un desarrollo web completo.",
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
    title: "Páginas web para negocios que quieren verse profesionales y recibir más contactos",
    metaTitle: "Páginas web para negocios en México | BryanF Design",
    metaDescription:
      "Páginas web para negocios en México: un sitio profesional con secciones claras, WhatsApp, formulario, SEO básico y diseño para celular.",
    intro:
      "Hago páginas web prácticas para negocios que quieren verse profesionales, explicar lo que ofrecen y recibir clientes sin complicarse.",
    problems: [
      "Te buscan y solo encuentran redes sociales a medias o información regada.",
      "No tienes una página que explique tus servicios, precios base, ubicación o forma de trabajar.",
      "Contestas a mano las mismas preguntas una y otra vez.",
    ],
    solution:
      "Armo un sitio directo, con lo que ofreces, por qué confiar en ti, preguntas frecuentes y botones claros para que tus clientes den el siguiente paso rápido.",
    process: [
      "Junto la información de tu negocio, tus servicios y tu material visual.",
      "Definimos las secciones esenciales y textos que se entiendan.",
      "Programo el sitio pensando primero en el celular, con SEO básico.",
      "Conecto WhatsApp, correo, formulario o pagos, según tu caso.",
    ],
    deliverables: [
      "Una página web profesional para presentar tu negocio.",
      "Secciones de servicios, proceso, preguntas frecuentes y contacto.",
      "Optimización para celular y base técnica de SEO.",
      "Un botón principal hacia WhatsApp o cotización.",
    ],
    differentiators: [
      "Pensado para dueños de negocio, no para equipos técnicos.",
      "Entrega clara, sin funciones que no vas a usar.",
      "Lista para crecer a más páginas después.",
      "Te explico todo con palabras sencillas.",
    ],
    faqs: [
      {
        question: "¿Qué necesita mi negocio para empezar?",
        answer:
          "Nombre, servicios, fotos o referencias, datos de contacto, ubicación si aplica y una idea clara de qué quieres vender o promover.",
      },
      {
        question: "¿Puedo empezar con una sola página?",
        answer:
          "Sí. Una página bien armada funciona muy bien como primera presencia en internet y después puede crecer con servicios, casos o blog.",
      },
      {
        question: "¿Se puede conectar a WhatsApp?",
        answer:
          "Sí. Pongo botones directos con un mensaje ya escrito para que contactarte sea muy fácil.",
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
    eyebrow: "Software a medida en México",
    title: "Software a medida para procesos que ya no caben en hojas de cálculo",
    metaTitle: "Software a medida en México para empresas | BryanF Design",
    metaDescription:
      "Software a medida en México: plataformas internas, dashboards, automatizaciones, pagos y sistemas web hechos para la forma en que ya trabaja tu equipo.",
    intro:
      "Si tu operación depende de tareas manuales que se repiten, diseño y programo herramientas web a tu medida para ordenar la información, equivocarse menos y medir mejor.",
    problems: [
      "Tu equipo captura, copia y da seguimiento a mano todos los días.",
      "La información está repartida entre WhatsApp, hojas de cálculo y correos.",
      "Necesitas una herramienta propia, pero no sabes si conviene empezar en grande o en pequeño.",
    ],
    solution:
      "Hago una primera versión que ya funciona, con flujos claros, usuarios, datos y las automatizaciones esenciales, cuidando que pueda crecer sin tener que rehacerla.",
    process: [
      "Mapeamos cómo trabajas hoy y dónde se atora el proceso.",
      "Definimos la primera versión, los usuarios, los permisos y los datos importantes.",
      "Diseño y programo la plataforma web.",
      "La probamos con casos reales y planeamos las siguientes mejoras.",
    ],
    deliverables: [
      "La primera versión o la plataforma web a tu medida.",
      "Flujos para capturar, consultar y administrar.",
      "Integraciones con pagos, correo o APIs cuando aplique.",
      "Documentación básica de uso y las siguientes mejoras.",
    ],
    differentiators: [
      "Primero construyo lo necesario, sin inflar el proyecto.",
      "Diseño UX/UI y desarrollo hechos por la misma persona.",
      "Una base lista para automatizar y medir.",
      "Te explico todo sin tecnicismos.",
    ],
    faqs: [
      {
        question: "¿Qué tipo de software puedes crear?",
        answer:
          "Dashboards, portales, formularios avanzados, cotizadores, sistemas de seguimiento, pagos y herramientas internas web.",
      },
      {
        question: "¿Necesito tener todo definido?",
        answer:
          "No. Podemos empezar con un diagnóstico y convertir tu proceso actual en el alcance de una primera versión.",
      },
      {
        question: "¿Se puede conectar con las herramientas que ya uso?",
        answer:
          "Sí, cuando la herramienta tiene una API o una forma viable de integrarse. Si no la tiene, te lo digo antes de prometer nada.",
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
    eyebrow: "Mantenimiento web en México",
    title: "Mantenimiento web para que tu sitio siga al día, rápido y confiable",
    metaTitle: "Mantenimiento web en México para negocios | BryanF Design",
    metaDescription:
      "Mantenimiento web en México: actualizaciones, mejoras, respaldos, cambios de contenido, revisión técnica y soporte para el sitio de tu negocio.",
    intro:
      "Cuido sitios que ya existen para que sigan funcionando, carguen bien, tengan la información al día y no pierdas clientes por errores que se pueden evitar.",
    problems: [
      "Tu sitio se quedó atrás y ya no refleja lo que ofreces hoy.",
      "No tienes a quién pedirle cambios rápidos sin empezar un proyecto desde cero.",
      "Aparecieron errores, enlaces rotos o el sitio se volvió lento.",
    ],
    solution:
      "Le doy seguimiento técnico y de contenido con prioridades claras: estabilidad, seguridad, velocidad, cambios en tu oferta y mejoras de SEO poco a poco.",
    process: [
      "Reviso cómo está tu sitio por dentro y su contenido.",
      "Priorizo las correcciones, actualizaciones y mejoras.",
      "Hago los cambios con respaldo o historial, sin riesgos innecesarios.",
      "Te reporto lo que hice y lo que recomiendo después.",
    ],
    deliverables: [
      "Cambios de contenido, secciones o botones.",
      "Revisión de enlaces, metadatos y errores visibles.",
      "Soporte técnico para actualizaciones y mejoras menores.",
      "Un reporte sencillo de los cambios.",
    ],
    differentiators: [
      "Mantenimiento que también cuida tu SEO y tus ventas.",
      "Primero lo que más impacta, no lo que más hace ruido.",
      "Te aviso de cualquier riesgo antes de tocar algo delicado.",
      "Si hace falta, crecemos a un rediseño o a un desarrollo nuevo.",
    ],
    faqs: [
      {
        question: "¿Puedes darle mantenimiento a un sitio que no hiciste tú?",
        answer:
          "Sí. Primero reviso la tecnología, los accesos, el hosting y los riesgos. Si hay limitaciones, te las explico antes de cambiar nada.",
      },
      {
        question: "¿Incluye cambios de contenido?",
        answer:
          "Sí, puede incluir ajustes de textos, imágenes, botones, enlaces y secciones pequeñas, según el plan que acordemos.",
      },
      {
        question: "¿Incluye seguimiento de SEO?",
        answer:
          "Puede incluir la revisión de metadatos, sitemap, robots, Search Console y oportunidades de mejora, si me compartes los accesos.",
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
          url: "/img/og-bryanf-apex.png",
          width: 1200,
          height: 630,
          alt: `${BRAND_NAME}: Haz que pase`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: ["/img/og-bryanf-apex.png"],
    },
    robots: { index: true, follow: true },
  };
}

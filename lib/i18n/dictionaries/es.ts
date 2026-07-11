// Source-of-truth dictionary. Every other locale file is typed against this
// shape (see dictionaries/index.ts) so a missing key is a compile error, not
// a silent fallback to Spanish at runtime.
const es = {
  nav: {
    inicio: "Inicio",
    proceso: "Proceso",
    proyectos: "Proyectos",
    precios: "Precios",
    faq: "FAQ",
    cliente: "¿Ya eres cliente?",
    armaTuWeb: "Arma tu web",
    verProyectos: "Ver proyectos",
    menu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  marquee: {
    words: ["Diseño", "Código", "SEO", "Performance", "E-commerce", "Branding"],
  },
  hero: {
    eyebrow: "Diseño y desarrollo web en México",
    titlePrefix: "Haz que",
    titleHighlight: "pase.",
    subtitle:
      "Creamos tu página web a medida: rápida, animada y orientada a conversión. Estrategia, performance y SEO real para que tu sitio se vea increíble y venda.",
    scrollHint: "Desliza para abrir la laptop",
  },
  trust: {
    years: "años",
    yearsCaption: "de experiencia",
    projects: "proyectos",
    projectsCaption: "digitales impulsados con éxito",
    deliveryPrefix: "Desde",
    days: "días",
    deliveryCaption: "hábiles de entrega",
  },
  process: {
    eyebrow: "Cómo trabajamos",
    title: "Un proceso claro, de la idea al lanzamiento",
    subtitle:
      "Sin humo: entregas que inician desde 3 días hábiles, con acompañamiento después de lanzar.",
    steps: [
      {
        title: "Cotización",
        content:
          "Te compartimos una propuesta clara: alcance, tiempos y precio. Sin letras chiquitas.",
      },
      {
        title: "Brief",
        content:
          "Entendemos tu negocio, tus objetivos y a quién le hablas. Definimos estrategia y contenido.",
      },
      {
        title: "Desarrollo",
        content:
          "Diseño UX/UI y código rápido y limpio: responsive, animado y optimizado para Core Web Vitals.",
      },
      {
        title: "Lanzamiento",
        content:
          "SEO técnico, despliegue y medición. Tu sitio queda listo para vender desde el día uno.",
      },
      {
        title: "Seguimiento",
        content:
          "1 mes de seguimiento post-entrega y acceso a Access BryanF, tu panel técnico, para asegurar el correcto funcionamiento del sitio.",
      },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "Los lenguajes que manejo",
    subtitle:
      "Frameworks y herramientas modernas con las que construyo: rápido, escalable y a la medida. La tecnología al servicio de la idea, no al revés.",
    ctaPrimary: "Ver proyectos",
    ctaSecondary: "Trabajemos juntos",
  },
  projects: {
    eyebrow: "Portafolio",
    titlePrefix: "Webs que",
    rotatingWords: ["venden", "convierten", "conectan", "destacan"],
    subtitle:
      "Webs que generan impacto real en cada cliente. Cada una diseñada y construida a la medida. Toca cualquiera para visitarla.",
    visitSite: "Visitar sitio",
    showMore: "Mostrar más proyectos",
    descs: {
      "goldenrepublic-com-mx": "Bienes raíces",
      "serviciosecem-com-mx": "Asesoría contable y fiscal",
      "industriastritton-com": "Mezclado y molienda industrial",
      "nkmohcafe-com": "Café de especialidad",
      "playerapublimax-com": "Playeras personalizadas",
      "proshieldmexico-com": "Protección patrimonial",
      "homeflowoficial-com": "Plataforma digital",
      "prefabricadosmx-com": "Prefabricados de concreto",
      "efficientplasticolors-com": "Concentrados de color para plástico",
      "ndt360-com-mx": "Pruebas no destructivas",
      "kafi-com-mx": "Espacios de trabajo",
      "mielyabejas-mx": "Miel artesanal, del campo a tu mesa",
      "bravologix-com-mx": "Logística y transporte",
      "verticlean-com-mx": "Limpieza profesional",
      "distribuidorajemar-com": "Distribución de suministros",
      "gruposum-com": "Experiencias que conectan equipos",
      "grupocosma-com": "Construcción y servicios",
      "koi-arquitectura-vercel-app": "Arquitectura",
      "repissa-vercel-app": "Marca y sitio web",
      "nezga-arquitectos-vercel-app": "Arquitectura y construcción",
      "epiko-vercel-app": "Producción de eventos",
      "element-experiences-com": "Experiencias y eventos",
    } as Record<string, string>,
  },
  world: {
    eyebrow: "Presencia",
    title: "Dónde hemos trabajado",
    subtitle: "Proyectos para clientes en México, España y Francia. Diseñamos sin fronteras.",
    dragHint: "Arrastra el globo para girarlo",
  },
  clients: {
    label: "Marcas que han confiado",
  },
  configurator: {
    eyebrow: "Configurador",
    title: "Arma tu web y paga en línea",
    subtitle:
      "Elige tu paquete, suma los módulos que necesites y paga con tarjeta, Mercado Pago o transferencia. Sin sorpresas.",
    step1: "1. Elige tu paquete",
    plans: {
      full: {
        name: "Desarrollo Web",
        desc: "Tu sitio profesional a la medida, rápido y orientado a vender.",
      },
      update: {
        name: "Actualización",
        desc: "Renueva tu web actual con diseño y performance reales.",
      },
      maintenance: {
        name: "Mantenimiento",
        desc: "Tu sitio siempre al día, seguro y respaldado. Por mes.",
      },
    },
    step2: "2. Módulos extra",
    modules: {
      ecommerce: "E-commerce / tienda en línea",
      payments: "Pasarela de pagos",
      maintenance: "Mantenimiento especializado",
    },
    extraSections: "Secciones adicionales",
    perUnit: "c/u",
    removeSection: "Quitar sección",
    addSection: "Agregar sección",
    step3: "3. Modalidad de pago",
    paymentFull: "Pago completo (100%)",
    paymentAdvance: "Anticipo (50%)",
    currencyLabel: "Moneda",
    currencyNote: (rate: string) =>
      `Conversión redondeada aprox. a ${rate} MXN por USD. Si Mercado Pago no admite USD, se cobra el equivalente en MXN.`,
    couponLabel: "Cupón",
    couponPlaceholder: "Ej. BRYANF10",
    apply: "Aplicar",
    couponNoneEntered: "",
    couponNoneActive:
      "No hay cupones activos por el momento. Revisa nuestras redes o pregunta a Lumina.",
    summary: "Tu resumen",
    totalProject: "Total proyecto",
    payNow: "A pagar ahora",
    payStripe: "Pagar con tarjeta (Stripe)",
    payMercadoPago: "Pagar con Mercado Pago",
    payTransfer: "Pagar por transferencia",
    additionalSectionsLabel: (n: number) => `Secciones adicionales x${n}`,
    opening: (label: string) => `Abriendo ${label}…`,
    openFailed: (reason: string) =>
      `No se pudo abrir el pago (${reason}). Intenta con transferencia o escríbenos por WhatsApp.`,
    openedInTab: (label: string) => `${label} abierto en otra pestaña. Completa tu pago para continuar.`,
    noPaymentLink: "No se recibió la liga de pago. Intenta de nuevo.",
    connectionError: "Error de conexión. Intenta de nuevo o usa WhatsApp.",
    transferInstructions: (amount: string) => `Transfiere ${amount} y envía tu comprobante.`,
    bank: {
      banco: "Banco",
      titular: "Titular",
      cuenta: "Cuenta",
      clabe: "CLABE",
      swift: "SWIFT",
    },
    copyLabel: (label: string) => `Copiar ${label}`,
    sendWhatsapp: "Enviar comprobante por WhatsApp",
    sendEmail: "Enviar comprobante por correo",
    securePaymentPrefix: "Pago seguro. Al continuar aceptas nuestros",
    terms: "Términos",
    and: "y",
    privacyNotice: "Aviso de Privacidad",
    whatsappTransferMsg: (opts: {
      plan: string;
      modules: string;
      mode: string;
      total: string;
      payNow: string;
    }) =>
      `Hola, quiero pagar mi proyecto por transferencia.\n\nPlan: ${opts.plan}\nMódulos: ${opts.modules}\nModalidad: ${opts.mode}\nTotal proyecto: ${opts.total}\nPago ahora: ${opts.payNow}`,
    modeFullLabel: "Pago completo",
    modeAdvanceLabel: "50% anticipo",
    none: "ninguno",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que necesitas saber",
    subtitle: "Toca una pregunta para ver la respuesta.",
    items: [
      {
        title: "¿Cuáles son los tiempos de entrega?",
        content:
          "Los tiempos de entrega empiezan desde 3 días una vez que nos hayas proporcionado la información completa de tu empresa.",
      },
      {
        title: "¿Cuántos cambios puedo pedir?",
        content:
          "En BryanF Design no manejamos un límite de cambios. La satisfacción total del cliente es lo más importante para entregar un producto de calidad.",
      },
      {
        title: "¿Cuál es su horario de atención?",
        content:
          "Nuestro horario es de Lunes a Viernes de 9:00 AM a 7:00 PM, hora de Ciudad de México (CDMX).",
      },
      {
        title: "¿Cuáles son los costos?",
        content:
          "Los costos empiezan a partir de los $3,500 MXN y pueden variar dependiendo de las necesidades específicas de tu proyecto.",
      },
      {
        title: "¿Qué se necesita para empezar?",
        content:
          "La información general de tu empresa, una breve llamada para recopilar requerimientos clave y un 50% de anticipo. El otro 50% se liquida al entregar y aprobar el proyecto.",
      },
      {
        title: "¿Qué se me entrega al final?",
        content:
          "Los accesos totales a la página web y a los correos (en caso de haberse creado), además de una capacitación breve, de no más de 30 minutos, para el manejo básico de tu sitio.",
      },
      {
        title: "¿Qué incluye trabajar juntos?",
        content:
          "Dominio y host gratuito por un año, correos ilimitados (1 GB cada uno), un diseño completamente personalizado y la satisfacción de un producto final garantizado.",
      },
    ],
    notFound: "¿No encontraste tu respuesta? Escríbenos y lo platicamos.",
    sendWhatsapp: "Mandar WhatsApp",
  },
  closingCta: {
    title: "¿Listo para que tu marca se vea como lo que vale?",
    subtitle:
      "Arma tu web, elige cómo pagar (tarjeta, Mercado Pago o transferencia) y arrancamos. Proyectos desde $3,500 MXN.",
    ctaPrimary: "Arma tu web",
    ctaSecondary: "WhatsApp directo",
  },
  about: {
    eyebrow: "Quién hace esto",
    title: "Soy Bryan. Diseño y construyo cada web yo mismo.",
    subtitle:
      "Sin agencia de por medio, sin intermediarios: hablas conmigo desde el primer mensaje hasta el día que tu web queda en línea. México, horario flexible, café de sobra.",
    role: "Diseñador & desarrollador",
    chips: ["Diseño + código", "Trato directo, sin agencia", "Entregas desde 3 días"],
    ctaPrimary: "Trabajemos juntos",
    ctaSecondary: "Mira mi proceso",
    quote: "Cada web que ves aquí salió de este escritorio.",
  },
  luminaSection: {
    eyebrow: "Tu asesora IA",
    titlePrefix: "Ella es",
    subtitle:
      "Lumina vive en este sitio y conoce todo lo que hacemos: precios, tiempos, módulos y proceso. Pregúntale lo que sea — responde al instante, a cualquier hora, y te deja tu web armada.",
    cta: "Chatea con Lumina",
    status: "En línea 24/7",
    hint: "Tócala para cambiar su ánimo · arrástrala para girarla",
    moods: {
      normal: "Modo normal",
      enfocada: "Modo enfocada",
      duda: "Modo curiosa",
      sorprendida: "Modo sorprendida",
    },
    phrases: [
      "¿Te cotizo tu web en 2 minutos?",
      "Pregúntame precios y tiempos…",
      "Puedo armar tu paquete ideal.",
      "¿Tienda en línea? También sé de eso.",
    ],
  },
  footer: {
    tagline: "Diseño que vende",
    taglineRest: ", no sólo que luce. Webs rápidas, animadas y a la medida, desde México.",
    navLabel: "Navegación",
    servicesLabel: "Servicios",
    legalLabel: "Legal y contacto",
    privacy: "Aviso de Privacidad",
    terms: "Términos y Condiciones",
    reviewGoogle: "Déjanos tu reseña en Google Maps",
    clientQuestion: "¿Ya eres cliente?",
    copyright: (year: number) => `© ${year} BryanF Design · Hecho en México`,
    acceptPrefix: "Al contactarnos aceptas nuestro",
    and: "y",
    services: {
      desarrolloWeb: "Desarrollo web",
      disenoWeb: "Diseño web",
      uxUi: "UX/UI",
      paginasNegocios: "Páginas para negocios",
      softwareMedida: "Software a medida",
      mantenimientoWeb: "Mantenimiento web",
    },
  },
  lumina: {
    name: "Lumina",
    greeting:
      "¡Hola! Soy <strong>Lumina</strong>, tu asesora en BryanF Design.<br>¿Te ayudo con precios, tiempos o a armar tu web?",
    quick: [
      "¿Cuánto cuesta una web?",
      "¿En cuánto tiempo la entregan?",
      "Quiero armar mi web",
    ],
    online: "Asesora IA · en línea",
    offline: "Sin conexión",
    thinking: "Pensando…",
    placeholder: "Escribe tu mensaje…",
    close: "Cerrar",
    send: "Enviar",
    open: "Abrir chat con Lumina",
    teaser: "¿Buscas crear tu web? Pregúntame precios, tiempos o cómo empezamos ✨",
    typing: "Escribiendo…",
    languageInstruction: "español",
    errorFallback:
      "Ahorita no puedo responder, pero escríbenos por <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a> y te atendemos al instante.",
    misunderstood: "Perdona, no te entendí. ¿Lo intentamos de nuevo?",
    connectionError:
      "Tuvimos un problema de conexión. Escríbenos por <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
  },
  languageNotice: {
    text:
      "Detectamos tu idioma automáticamente y guardamos tu elección en una cookie para recordarla en todo el sitio. Puedes cambiarlo cuando quieras.",
    dismiss: "Entendido",
  },
  languageSwitcher: {
    label: "Idioma",
  },
} as const;

export default es;

// Widen the literal types `as const` gives us (e.g. the exact string
// "Portafolio") down to `string`, `string[]`, etc. — otherwise every other
// locale would be type-checked against the literal Spanish text instead of
// just the shape.
type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepWiden<U>[]
    : T extends (...args: infer A) => infer R
      ? (...args: A) => DeepWiden<R>
      : T extends object
        ? { -readonly [K in keyof T]: DeepWiden<T[K]> }
        : T;

export type Dictionary = DeepWiden<typeof es>;

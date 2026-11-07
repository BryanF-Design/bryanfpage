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
    skipToContent: "Saltar al contenido",
    backToTop: "Volver arriba",
    serviciosEntrada: "Servicios de entrada",
    lumina: "Lumina",
    servicios: "Servicios",
    conoceme: "Conoce a Bryan",
    contacto: "Contacto",
    casos: "Casos de estudio",
  },
  marquee: {
    words: ["Diseño", "Código", "SEO", "Performance", "E-commerce", "Branding"],
    /** Botón que detiene/reanuda las cintas animadas (WCAG 2.2.2). */
    pause: "Pausar animación",
    play: "Reanudar animación",
  },
  hero: {
    eyebrow: "Diseño y desarrollo web en México",
    titlePrefix: "Haz que",
    titleHighlight: "pase.",
    subtitle:
      "Hago sitios que se entienden a la primera, cargan rápido y facilitan que te escriban. Desde la primera plática hasta el lanzamiento, hablas directo conmigo.",
    scrollHint: "Desliza para recorrer el Civic",
    sideTop: "Webs que",
    sideHighlight: "venden",
    panelTitle: "Diseño y código para que te encuentren y te escriban",
    available: "Agenda abierta para nuevos proyectos",
    proof: "+100 proyectos lanzados",
    features: ["Entrega desde 3 días", "SEO técnico incluido", "Pago en línea seguro"],
    featured: "Proyecto destacado",
  },
  experience: {
    startupSequence: "Secuencia de arranque",
    preparingAria: "Preparando la experiencia",
    readyAria: "Experiencia lista",
    prepare: "preparar",
    start: "arrancar",
    loaderLine: "Diseño, código y movimiento a punto.",
    aligning: "Alineando la interfaz",
    routeReady: "Ruta lista",
    skip: "Omitir entrada",
    phaseDesign: "Diseño",
    phaseDevelopment: "Desarrollo",
    phaseLaunch: "Lanzamiento",
    modelStudy: "Una obsesión personal, llevada a 3D",
    modelLoading: "Cargando modelo 3D",
    activateModel: "Activar modelo 3D",
    lightweightView: "Vista ligera activa",
    dragRotate: "Arrastra para girar",
    tapBoost: "Toca para acelerar",
    driving: "conducción",
    precision: "Precisión",
    systemOnline: "Sistema listo",
    civicAria: "Modelo 3D interactivo de un Honda Civic Type R 2023",
    statsAria: "Datos del estudio",
    statsRecord: "Datos reales del estudio",
  },
  trust: {
    years: "años",
    yearsCaption: "de experiencia",
    projects: "proyectos",
    projectsCaption: "digitales entregados",
    deliveryPrefix: "Desde",
    days: "días",
    deliveryCaption: "días hábiles de entrega",
  },
  process: {
    eyebrow: "Cómo trabajo",
    title: "Un proceso claro, de la idea al lanzamiento",
    subtitle:
      "Te digo qué sigue, qué necesito y cuándo lo verás. Las entregas empiezan desde 3 días hábiles y sigo contigo después del lanzamiento.",
    stepsLabel: "Pasos del proceso",
    steps: [
      {
        title: "Cotización",
        content:
          "Te mando una propuesta clara con alcance, tiempos y precio. Sin letras chiquitas.",
      },
      {
        title: "Brief",
        content:
          "Platicamos de tu negocio, de lo que quieres lograr y de a quién le hablas. Con eso definimos el contenido.",
      },
      {
        title: "Desarrollo",
        content:
          "Diseño la interfaz y la programo: que se vea bien en el celular, cargue rápido y pase las Core Web Vitals.",
      },
      {
        title: "Lanzamiento",
        content:
          "Publico tu sitio con SEO técnico y medición, para que desde el primer día sepas quién llega y qué busca.",
      },
      {
        title: "Seguimiento",
        content:
          "Te acompaño un mes después de la entrega y te doy acceso a Access BryanF, tu espacio de cliente en línea: ahí ves el calendario de tu proyecto y tienes guardados en privado los accesos de tu sitio.",
      },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "Los lenguajes que manejo",
    subtitle:
      "Elijo cada herramienta por lo que tu proyecto necesita, no por moda: que el sitio cargue bien, crezca contigo y sea fácil de mantener.",
    ctaPrimary: "Ver proyectos",
    ctaSecondary: "Trabajemos juntos",
    filtersLabel: "Filtrar herramientas por tipo",
    filters: { all: "Todo", front: "Frontend", back: "Backend", tools: "Herramientas" },
    paymentGateway: "Pasarela de pago",
    countLabel: "herramientas en mi día a día",
  },
  projects: {
    eyebrow: "Portafolio",
    titlePrefix: "Webs que",
    rotatingWords: ["funcionan", "conectan", "destacan", "crecen"],
    subtitle:
      "Todos estos proyectos están en línea y cada uno resolvió algo distinto. Ábrelos y recórrelos con calma.",
    visitSite: "Visitar sitio",
    showMore: "Mostrar más proyectos",
    title: "Trabajo real que ya está funcionando.",
    titleAccent: "funcionando",
    live: "En línea",
    countLabel: "sitios en línea que puedes abrir y recorrer",
    recent: "Recientes",
    all: "Todos",
    newBadge: "Nuevo",
    casesTitle: "Casos de estudio",
    casesSubtitle: "El problema, la decisión y el resultado detrás de cuatro proyectos.",
    casesEyebrow: "Detrás del sitio",
    launchedTitle: "Recién lanzados",
    launchedNote: "Ya están en línea: ábrelos y recórrelos en vivo.",
    nextTitle: "Tu web puede ser la siguiente.",
    moreLabel: "proyectos más",
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
      "gecomex-web-vercel-app": "Logística y aduanas internacionales",
      "ceahestructural-com-mx": "Soluciones estructurales FRP y PVC",
      "mixteca-web-vercel-app": "Hortalizas y aromáticas de Puebla",
      "urban-flip-com": "Compra y venta de propiedades",
      "bioslaboratorios-com": "Laboratorio de análisis clínicos",
      "haften-lyart-vercel-app": "Expertos en HVAC/R y BMS",
      "sermaqro-com": "Renta y venta de maquinaria ligera",
    } as Record<string, string>,
    caseLabels: {
      problem: "Problema",
      decision: "Decisión",
      result: "Resultado",
      metric: "En números",
    },
    cases: {
      "koi-arquitectura-vercel-app": {
        problem:
          "Traducir necesidades y estilos de vida en espacios, sin reducir la arquitectura a una galería.",
        decision:
          "Ordenar el relato en escucha, diseño, construcción y acompañamiento, con el proyecto como evidencia.",
        result:
          "Un sitio que explica el proceso, el valor de intervenir y abre contacto directo en el mismo recorrido.",
        metric:
          "4 etapas del servicio (escucha, diseño, construcción y acompañamiento) en un solo recorrido, con contacto directo al final.",
      },
      "element-experiences-com": {
        problem:
          "Reunir rutas abiertas, experiencias privadas y servicios corporativos sin diluir el propósito de la marca.",
        decision:
          "Separar la oferta por tipo de experiencia y sostenerla con calendario, niveles y acciones para reservar o cotizar.",
        result:
          "Un recorrido donde cada visitante identifica su experiencia y llega a la acción adecuada.",
        metric:
          "3 líneas de oferta (rutas abiertas, experiencias privadas y servicios corporativos), cada una con su forma de reservar o cotizar.",
      },
      "efficientplasticolors-com": {
        problem:
          "Explicar un catálogo técnico de masterbatch y aditivos y facilitar la igualación de color.",
        decision:
          "Convertir el color en una herramienta interactiva: buscador Pantone®, catálogo por familias y cotización directa.",
        result:
          "El sitio permite explorar tonos y productos y generar una solicitud por WhatsApp desde el mismo flujo.",
        metric:
          "De un catálogo técnico a 3 herramientas en un mismo flujo: buscador Pantone®, catálogo por familias y cotización por WhatsApp.",
      },
      "nkmohcafe-com": {
        problem:
          "Contar el origen de Zongolica y, a la vez, presentar café de especialidad y soluciones para negocios.",
        decision:
          "Combinar relato de origen, perfiles de servicio y producto con accesos claros a cotización.",
        result:
          "El sitio diferencia especialidad, café comercial y molienda, y guía al visitante hacia un pedido.",
        metric:
          "3 perfiles de café separados (especialidad, comercial y molienda), cada uno con su propio camino hacia un pedido.",
      },
    },
  },
  world: {
    eyebrow: "Presencia",
    title: "Dónde he trabajado",
    subtitle:
      "He trabajado con clientes de México, España y Francia, en tres husos horarios distintos.",
    dragHint: "Arrastra el globo para girarlo",
    locations: {
      mexico: "México",
      spain: "España",
      france: "Francia",
    },
    listTitle: "Ubicaciones",
    localTime: "Hora local",
    countries: "países",
    kinds: {
      work: "Proyectos",
    },
  },
  clients: {
    eyebrow: "Clientes",
    label: "Marcas que han confiado",
    subtitle: "Del corporativo al estudio independiente, cada proyecto recibe el mismo cuidado.",
    brands: "marcas",
  },
  entryServices: {
    eyebrow: "Servicios de entrada",
    title: "Si aún no necesitas un sitio completo, empieza por aquí",
    subtitle:
      "Una tarjeta, una firma de correo o una página sencilla para verte profesional desde ya, con el mismo cuidado en el diseño.",
    cta: "Preguntar por este servicio",
    note: "Precios en pesos mexicanos (MXN). ¿Tu proyecto es más grande? Lo combinamos con un sitio completo; pregúntale a Lumina.",
    fromPrice: (price: string) => `Desde ${price}`,
    items: [
      {
        id: "tarjetaDigital",
        name: "Tarjeta de presentación digital",
        price: "$900 MXN",
        desc: "Tu perfil de contacto en una página propia, con botón para guardar tus datos y código QR.",
        features: [
          "Página pública con tus datos",
          "Botón para guardar contacto (vCard)",
          "Código QR personalizado",
          "Diseño alineado a tu marca",
        ],
        question: "Quiero información sobre la tarjeta de presentación digital",
      },
      {
        id: "tarjetaImprimible",
        name: "Tarjeta de presentación imprimible",
        price: "$650 MXN",
        desc: "Diseño físico listo para imprimir, con código QR que conecta con tu presencia digital.",
        features: [
          "Diseño frontal y posterior",
          "Código QR de contacto",
          "Archivos listos para imprenta",
          "2 rondas de ajustes",
        ],
        question: "Quiero información sobre la tarjeta de presentación imprimible",
      },
      {
        id: "firmaCorreo",
        name: "Firma de correo profesional",
        price: "$350 MXN",
        desc: "Que cada correo que envíes se vea tan profesional como tu marca.",
        features: [
          "Compatible con Gmail, Outlook y Apple Mail",
          "Datos de contacto y redes",
          "Instalación guiada",
          "Variante para equipo",
        ],
        question: "Quiero información sobre la firma de correo profesional",
      },
      {
        id: "kitPresencia",
        name: "Kit de presencia digital",
        price: "$1,500 MXN",
        desc: "Tarjeta digital, firma de correo y QR en un solo paquete, con descuento sobre comprarlos por separado.",
        features: [
          "Tarjeta digital + firma de correo",
          "Código QR incluido",
          "Portada para redes sociales",
          "Tratamiento de foto de perfil",
        ],
        question: "Quiero información sobre el kit de presencia digital",
      },
      {
        id: "landingEsencial",
        name: "Landing page esencial",
        price: "Desde $2,000 MXN",
        desc: "Una página sencilla para presentarte o lanzar algo, sin el alcance de un sitio completo.",
        features: [
          "Ideal para profesionistas, eventos y negocios locales",
          "SEO técnico básico incluido",
          "Entrega desde 3 días hábiles",
          "Estructura enfocada en un solo objetivo",
        ],
        question: "Quiero información sobre la landing page esencial",
      },
    ],
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
        desc: "Tu sitio a la medida, rápido y pensado para que te contacten.",
      },
      update: {
        name: "Actualización",
        desc: "Una renovación de verdad para tu web actual: diseño y velocidad.",
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
      "Por ahora no hay cupones activos. Revisa mis redes o pregúntale a Lumina.",
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
    emailQuote: "Enviar cotización por correo",
    emailQuoteSubject: "Mi cotización · BryanF Design",
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
    viewSummary: "Ver resumen y pagar",
    payPrimaryAdvance: (amount: string) => `Pagar anticipo ${amount}`,
    payPrimaryFull: (amount: string) => `Pagar ${amount}`,
    payPrimaryNote: "Con tarjeta de crédito o débito, por Stripe",
    payAltPrefix: "o paga con",
    payAltMercadoPago: "Mercado Pago",
    payAltTransfer: "transferencia",
    payAltOr: "o",
    payWith: "Pagar con",
    todayAdvance: (now: string, rest: string) => `Hoy pagas ${now}. Los ${rest} restantes los pagas cuando te entregue el proyecto y lo apruebes.`,
    todayFull: (now: string) => `Hoy pagas ${now} y no queda nada pendiente.`,
    transferAlt: "Si prefieres, paga con tarjeta o Mercado Pago y arranca hoy.",
    transferAltCard: "Pagar con tarjeta",
    checkoutOpen: (label: string) => `Tu pago con ${label} está abierto en otra pestaña.`,
    checkoutDone: "¿Ya terminaste tu pago?",
    verifyPayment: "Verificar pago",
    retryPayment: "Volver a intentarlo",
    checkingPayment: "Revisando tu pago…",
    paymentConfirmed: "¡Listo! Tu pago quedó confirmado. Te llevo al siguiente paso…",
    paymentPending: "Tu pago aparece en proceso. Puede tardar unos minutos en confirmarse; vuelve a verificar en un momento.",
    paymentNotFound: "Todavía no veo tu pago. Si ya pagaste, espera un par de minutos y vuelve a verificar; si no, vuelve a intentarlo.",
    paymentFailed: "El pago no se completó. Puedes intentarlo de nuevo o elegir otro método.",
    verifyError: "No pude revisar tu pago en este momento. Si ya pagaste, escríbeme por WhatsApp y lo confirmo.",
    popupBlocked: "Tu navegador bloqueó la pestaña de pago. Ábrela desde aquí:",
    openPayment: "Abrir pago",
    dismissNotice: "Cerrar aviso",
    emailLabel: "Tu correo",
    emailPlaceholder: "tu@correo.com",
    emailSend: "Enviar",
    emailSending: "Enviando…",
    emailSent: (email: string) => `Te la envié a ${email}. Si no la ves en unos minutos, revisa tu carpeta de spam.`,
    emailInvalid: "Revisa tu correo, parece que le falta algo.",
    emailFailed: "No pude enviarla en este momento. Te la paso por WhatsApp:",
    emailWhatsapp: "Recibirla por WhatsApp",
    whatsappQuoteIntro: "Hola, me gustaría recibir esta cotización:",
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
          "Desde 3 días hábiles, contando a partir de que tengo toda la información de tu negocio.",
      },
      {
        title: "¿Cuántos cambios puedo pedir?",
        content:
          "No pongo un límite de cambios. Prefiero ajustar lo necesario hasta que tu sitio quede como lo imaginaste.",
      },
      {
        title: "¿Cuál es tu horario de atención?",
        content:
          "De lunes a viernes, de 9:00 a 19:00, hora de la Ciudad de México.",
      },
      {
        title: "¿Cuáles son los costos?",
        content:
          "Los proyectos empiezan en $3,500 MXN. El precio final depende de lo que necesites, y antes de arrancar te paso una propuesta con todo claro.",
      },
      {
        title: "¿Qué se necesita para empezar?",
        content:
          "La información general de tu negocio, una llamada corta para entender lo que necesitas y un anticipo del 50%. El otro 50% lo pagas cuando el proyecto está entregado y aprobado.",
      },
      {
        title: "¿Qué se me entrega al final?",
        content:
          "Todos los accesos a tu página y a tus correos (si los creamos), además de una capacitación corta, de máximo 30 minutos, para que manejes lo básico de tu sitio.",
      },
      {
        title: "¿Qué incluye trabajar juntos?",
        content:
          "Dominio y hosting gratis por un año, correos ilimitados (1 GB cada uno) y un diseño hecho desde cero para tu marca. Te garantizo que el sitio se entrega completo y funcionando como lo acordamos, con los ajustes que hagan falta hasta que lo apruebes. La garantía no cubre fallas por cambios que otra persona haga al código, caídas de servidores ajenos o mal uso del panel después de la capacitación.",
      },
    ],
    notFound: "¿No encontraste tu respuesta? Escríbeme y lo platicamos.",
    sendWhatsapp: "Mandar WhatsApp",
    bubble: "¿Dudas?",
  },
  closingCta: {
    title: "¿Empezamos tu web?",
    subtitle:
      "Arma tu web, elige cómo pagar (tarjeta, Mercado Pago o transferencia) y arrancamos. Proyectos desde $3,500 MXN.",
    ctaPrimary: "Arma tu web",
    ctaSecondary: "WhatsApp directo",
  },
  about: {
    eyebrow: "Diseño con autoría",
    title: "Soy Bryan. Yo diseño la experiencia y también escribo el código.",
    subtitle:
      "Trabajo contigo sin capas de agencia. La misma persona que escucha tu idea toma las decisiones de diseño y lleva el proyecto hasta producción.",
    role: "Diseñador y desarrollador",
    photoAlt: "Bryan diseñando y desarrollando en su escritorio",
    inspirationLabel: "Lo que llevo al trabajo",
    inspiration:
      "Me gustan los autos bien hechos y las redes bien armadas, y eso se nota en mi trabajo. Un ejemplo: en el sitio de Efficient Plasticolors convertí un catálogo técnico de colores en un buscador Pantone® donde el cliente encuentra su tono y pide cotización por WhatsApp sin salir de la página. Ese es el detalle que cuido en cada proyecto: que cada pieza conecte con la siguiente.",
    // Fragmento final de `inspiration` que se resalta (debe aparecer tal cual).
    inspirationAccent: "que cada pieza conecte con la siguiente",
    chips: ["Diseño + código", "Trato directo", "Performance con intención"],
    principlesLabel: "Mi forma de trabajar · precisión, ritmo y conexión",
    principles: [
      {
        title: "Precisión",
        body: "Cada elemento tiene una razón.",
        detail: "Jerarquía · accesibilidad · detalle",
      },
      {
        title: "Ritmo",
        body: "Una experiencia debe sentirse rápida antes de medirla.",
        detail: "Performance · movimiento · respuesta",
      },
      {
        title: "Conexión",
        body: "Diseño, código, SEO y negocio trabajan como un sistema.",
        detail: "Del primer clic al contacto",
      },
    ],
    ctaPrimary: "Trabajemos juntos",
    ctaSecondary: "Mira mi proceso",
    quote: "Cada web que ves aquí salió de este escritorio.",
  },
  // Compatibilidad con la antigua sección, ya fuera de la narrativa principal.
  garage: {
    eyebrow: "Diseño con autoría",
    title: "Precisión, ritmo y conexión.",
    subtitle:
      "Mis influencias se convierten en decisiones concretas de diseño, código y negocio.",
    verticalJp: "速さと精度",
    verticalRomaji: "seido · nagare · tsunagari",
    hint: "Una ruta, de la idea al resultado",
    spec: {
      modelLabel: "Principio",
      model: "Precisión",
      codeLabel: "Experiencia",
      code: "Ritmo",
      colorLabel: "Sistema",
      color: "Conexión",
      engineLabel: "Oficio",
      engine: "Diseño + código",
    },
    cards: [
      {
        index: "01",
        romaji: "seido",
        title: "Cada elemento tiene una razón.",
        body:
          "La jerarquía, la accesibilidad y cada detalle responden a una decisión concreta.",
        spec: "Precisión · intención",
      },
      {
        index: "02",
        romaji: "nagare",
        title: "La velocidad también se siente.",
        body:
          "Contenido, movimiento y respuesta mantienen un ritmo claro antes y después de medir el rendimiento.",
        spec: "Ritmo · performance",
      },
      {
        index: "03",
        romaji: "tsunagari",
        title: "Todo trabaja como un sistema.",
        body:
          "Diseño, código, SEO y negocio conectan el primer clic con una acción útil.",
        spec: "Conexión · resultado",
      },
    ],
  },
  luminaJourney: {
    eyebrow: "Cómo funciona",
    title: "De la idea al proyecto, contigo en cada paso",
    subtitle:
      "Lumina no es un chat que responde y ya. Te lleva por todo el camino, en minutos.",
    steps: [
      { title: "Te conoce", desc: "Le cuentas qué necesitas y entiende tu negocio, tu objetivo y a quién le hablas." },
      { title: "Te recomienda", desc: "Sugiere el paquete y los módulos que mejor te quedan, y te explica por qué." },
      { title: "Te cotiza", desc: "Arma tu presupuesto al instante, con precios claros y sin letras chiquitas." },
      { title: "Te lleva al pago", desc: "Pagas con tarjeta, Mercado Pago o transferencia. Anticipo o pago completo, tú eliges." },
      { title: "Te acompaña", desc: "Recibes tu folio y tu comprobante, llenas tu briefing y arrancamos tu proyecto." },
    ],
    cta: "Empieza con Lumina",
  },
  luminaSection: {
    eyebrow: "Tu asesora IA",
    titlePrefix: "Ella es",
    subtitle:
      "Lumina vive en este sitio y conoce todo lo que hacemos: precios, tiempos, módulos y proceso. Pregúntale lo que sea: te lleva a la sección exacta, te enseña proyectos como el tuyo y te deja tu cotización armada.",
    cta: "Chatea con Lumina",
    status: "En línea 24/7",
    hint: "Tócala para cambiar su ánimo",
    badges: [
      { title: "Te lleva a donde necesitas", desc: "Te muestra la sección exacta, sin que busques." },
      { title: "Te enseña proyectos como el tuyo", desc: "Elige del portafolio los sitios más parecidos a tu giro." },
      { title: "Te deja tu web armada", desc: "Arma el cotizador frente a ti y le pasa tu resumen a Bryan." },
    ],
    privacy: "No pedimos datos sensibles en el chat. Tu conversación se queda solo en este dispositivo.",
    quotePresets: ["Cotiza tu sitio a medida", "Cotiza tu tienda en línea", "Cotiza tu mantenimiento"],
    presetsTitle: "Cotiza en un clic",
    quickLabel: "Preguntas rápidas",
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
    tagline: "Diseño con intención",
    taglineRest: ". Webs rápidas, claras y hechas a tu medida, desde México.",
    navLabel: "Navegación",
    servicesLabel: "Servicios",
    legalLabel: "Legal y contacto",
    privacy: "Aviso de Privacidad",
    terms: "Términos y Condiciones",
    reviewGoogle: "Déjanos tu reseña en Google Maps",
    clientQuestion: "¿Ya eres cliente?",
    signatureLabel: "Firma de Bryan F.",
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
      barberias: "Sistema para barberías",
    },
  },
  lumina: {
    name: "Lumina",
    greeting:
      "¡Hola! Soy <strong>Lumina</strong>, tu asesora en BryanF Design.<br>¿Te ayudo con precios, tiempos o a armar tu web?",
    quick: [
      "¿Cuánto cuesta una web?",
      "Muéstrame proyectos como el mío",
      "Quiero armar mi web",
    ],
    online: "Asesora IA · en línea",
    offline: "Sin conexión",
    thinking: "Pensando…",
    placeholder: "Escribe tu mensaje…",
    close: "Cerrar",
    send: "Enviar",
    open: "Abrir chat con Lumina",
    teaser: "¿Estás pensando en tu web? Pregúntame precios, tiempos o por dónde empezar.",
    teaserShort: "¿Dudas con tu web? Pregúntame.",
    quoteReady: "Tu cotización ya está armada. ¿Seguimos platicando?",
    typing: "Escribiendo…",
    retry: "Reintentar",
    actions: {
      go: "Llévame a {section}",
      quote: "Ver mi cotización armada",
      whatsapp: "Pasarle mi resumen a Bryan",
      whatsappIntro: "Hola Bryan, vengo de platicar con Lumina en tu sitio. Esto es lo que busco:",
      visit: "Abrir sitio",
      cases: "Casos de estudio",
    },
    languageInstruction: "español",
    errorFallback:
      "Ahorita no puedo responder. Escríbele a Bryan por <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a> y te contesta en cuanto pueda.",
    misunderstood: "Perdona, no te entendí. ¿Lo intentamos de nuevo?",
    connectionError:
      "Se cortó la conexión. Escríbele a Bryan por <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
  },
  languageNotice: {
    text:
      "Detectamos tu idioma automáticamente y guardamos tu elección en una cookie para recordarla en todo el sitio. Puedes cambiarlo cuando quieras.",
    dismiss: "Entendido",
  },
  /** Panel flotante de accesibilidad (vive fuera del proveedor: sigue a <html lang>). */
  a11y: {
    title: "Accesibilidad",
    textSize: "Tamaño de texto",
    decrease: "Disminuir tamaño de texto",
    increase: "Aumentar tamaño de texto",
    contrast: "Alto contraste",
    reduceMotion: "Reducir movimiento",
    underlineLinks: "Subrayar enlaces",
    readableSpacing: "Espaciado de lectura fácil",
    visibleFocus: "Foco de teclado visible",
    reset: "Restablecer",
    open: "Abrir opciones de accesibilidad",
    close: "Cerrar opciones de accesibilidad",
    closePanel: "Cerrar panel de accesibilidad",
  },
  /** Página 404 (la cuenta regresiva se pausa al interactuar). */
  notFound: {
    badge: "Error 404",
    titleLead: "¿Te",
    titleWord: "perdiste?",
    body: "Esta página no existe o cambió de lugar. Tranquilo, nos pasa hasta a nosotros: te regresamos al inicio en unos segundos.",
    homeNow: "Volver al inicio ahora",
    redirecting: (s: number) => `Redirigiendo en ${s}s`,
    paused: "Redirección pausada",
    stay: "Quedarme aquí",
    shortcutsLabel: "O ve directo a:",
    shortcutsAria: "Atajos",
  },
  languageSwitcher: {
    label: "Idioma",
  },
  /** Inicio compacto: bloques que enlazan a las páginas movidas. */
  home: {
    presence: "Proyectos en México, España y Francia",
    presenceLink: "Ver dónde",
    casesAll: "Ver todos los casos",
    casesCta: "Ver caso completo",
    bryanEyebrow: "Fundador",
    bryanLine: "Diseño la experiencia y también escribo el código: trabajas directo conmigo, de la idea al lanzamiento.",
    bryanCta: "Conoce a Bryan",
    luminaEyebrow: "Asesora IA",
    luminaLine: "Lumina resuelve tus dudas al instante, te enseña proyectos como el tuyo y te deja la cotización armada.",
    luminaCta: "Conoce a Lumina",
    luminaChat: "Hablar con Lumina",
    faqMore: "Ver todas las preguntas",
  },
  /** Páginas a las que se movieron secciones del inicio. */
  pages: {
    breadcrumb: "Ruta de navegación",
    conoceme: {
      eyebrow: "Fundador",
      title: "Conoce a Bryan",
      subtitle: "Quién diseña y programa tu web, cómo trabaja y con qué herramientas.",
    },
    lumina: {
      eyebrow: "Asesora IA",
      title: "Lumina, tu asesora en BryanF Design",
      subtitle: "Pregúntale lo que quieras: precios, tiempos o qué necesita tu web. Te responde al instante y te lleva a la cotización.",
    },
    contacto: {
      eyebrow: "Contacto",
      title: "Hablemos de tu proyecto",
      subtitle: "Escríbeme por donde te quede más cómodo. Abajo están las respuestas a las preguntas más comunes y los lugares donde he trabajado.",
      whatsapp: "WhatsApp",
      email: "Correo",
      phone: "Teléfono",
    },
    casos: {
      eyebrow: "Casos de estudio",
      title: "Casos de estudio completos",
      subtitle: "El problema, la decisión de diseño y el resultado de cada proyecto, contado en detalle.",
    },
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

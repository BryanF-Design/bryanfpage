/**
 * CV interactivo · Español (idioma fuente). Los demás idiomas copian esta
 * forma exacta: `CvDict` sale de aquí.
 *
 * Regla de contenido: nada de cifras ni niveles inventados. Lo que no está
 * confirmado en el perfil maestro se omite o se dice tal cual.
 */
const es = {
  langName: "Español",
  ui: {
    pressStart: "Presiona Start",
    startHint: "Enter para empezar · flechas para moverte",
    dragHint: "Arrastra las apps · Enter para empezar",
    readMore: "Leer todo",
    skipIntro: "Ir directo al CV",
    next: "Siguiente",
    prev: "Anterior",
    finish: "Terminar recorrido",
    restart: "Ver de nuevo",
    level: "Nivel",
    levelSelect: "Selecciona un nivel",
    keysHint: "← → para cambiar de nivel · 1–6 para saltar",
    language: "Idioma",
    print: "Guardar en PDF",
    visit: "Visitar",
    close: "Cerrar",
    player: "Jugador 1",
    playerClass: "Clase",
    playerClassValue: "Tech Lead · Arquitecto web",
    guild: "Gremio",
    base: "Base",
    baseValue: "Estado de México · Reubicación posible",
    status: "Estado",
    statusValue: "Disponible para nuevas misiones",
    xp: "Experiencia",
    xpValue: "Desde {year}",
    languages: "Idiomas",
    loading: "Cargando mundo…",
    guideOn: "Guía de Lumina",
    muteGuide: "Ocultar a Lumina",
    showGuide: "Mostrar a Lumina",
    today: "hoy",
  },
  levels: {
    perfil: { name: "Perfil", tag: "Jugador" },
    misiones: { name: "Misiones", tag: "Experiencia" },
    inventario: { name: "Inventario", tag: "Stack" },
    logros: { name: "Logros", tag: "Proyectos" },
    academia: { name: "Academia", tag: "Formación" },
    contacto: { name: "Continuar", tag: "Contacto" },
  },
  start: {
    welcome: "Bienvenido a mi",
    script: "Curriculum",
    block: "VITAE.",
    edition: "Edición 2026",
    role: "Líder de desarrollo web y aplicaciones",
  },
  profile: {
    eyebrow: "Ficha del jugador",
    title: "Desarrollo, arquitectura y operación en un mismo jugador.",
    summary:
      "Profesional de desarrollo web, arquitectura de soluciones digitales y operación tecnológica. Más de dos años al frente del área de desarrollo y de la coordinación operativa de proyectos en Partum Design, con funciones técnicas y de gestión en Indusecc. Uno desarrollo Full-Stack, apps y plataformas, UX/UI, infraestructura web, DNS, hosting y correo con dirección de equipos, grabaciones, atención al cliente y resolución de incidentes críticos.",
    classesTitle: "Clases desbloqueadas",
    classes: [
      "Tech Architect",
      "Operations Manager",
      "Full-Stack Developer",
      "UX/UI Designer",
      "Dirección audiovisual",
      "Customer Service",
      "Integración de IA"
    ],
    powersTitle: "Habilidades especiales",
    powers: [
      { title: "Desarrollo", desc: "Convierto requerimientos de negocio en interfaces, sitios y experiencias web funcionales." },
      { title: "Arquitectura", desc: "Elijo plataformas, estructura del proyecto, integraciones y estrategia de despliegue según el alcance." },
      { title: "Operación y liderazgo", desc: "Dirijo equipos y varios proyectos y clientes a la vez: prioridades, responsables, entregas y calidad." },
      { title: "Apps y plataformas", desc: "Creo y evoluciono productos con reservas, cuentas de usuario, catálogos y herramientas operativas." },
      { title: "Producción audiovisual", desc: "Coordino grabaciones: agenda, equipo, revisión de material y entrega de contenido." },
      { title: "Infraestructura", desc: "Diagnostico y resuelvo DNS, hosting, publicación, correo empresarial, SSL y migraciones." },
      { title: "Cliente y negocio", desc: "Aterrizo el alcance, explico decisiones técnicas y acompaño cada implementación." },
      { title: "Diseño", desc: "Uno identidad visual, usabilidad, responsive y resultados de negocio." },
    ],
    studioLabel: "proyectos digitales impulsados por el estudio BryanF Design desde 2020",
    marketsLabel: "México · España · Francia",
  },
  quests: {
    eyebrow: "Registro de misiones",
    title: "Experiencia profesional",
    kinds: {
      main: "Misión principal",
      side: "Misión paralela",
      guild: "Gremio propio",
      past: "Misión completada",
    },
    concurrent: "En paralelo a Partum",
    noDate: "Fechas por confirmar",
    scope: "Alcance",
    techTitle: "Técnico",
    opsTitle: "Operación y dirección",
    loot: "Botín de habilidades",
    earlier: "Misiones anteriores",
    items: {
      partum: {
        role: "Responsable de Desarrollo Web · Tech Architect · Operations Manager",
        scope:
          "Responsabilidad transversal sobre desarrollo y operación: desde levantar necesidades y diseñar la arquitectura hasta producción, mantenimiento y seguimiento.",
        tech: [
          "Lidero el área de desarrollo y las decisiones de tecnología, estructura y mantenimiento.",
          "Experiencias web responsive con HTML, CSS, JavaScript, React, Next.js y Tailwind CSS.",
          "Flujos y despliegues con Git/GitHub, Vercel y hosting; dominios, DNS, correo, SSL y migraciones.",
          "Atiendo caídas de sitios, correos que dejan de llegar, DNS mal configurado y restauraciones (Plesk/IONOS).",
          "Integraciones con APIs, formularios, webhooks y automatizaciones con n8n.",
        ],
        ops: [
          "Dirijo equipos de desarrollo, diseño, marketing, producción audiovisual y soporte.",
          "Llevo varios clientes y proyectos a la vez: diagnóstico, desarrollo, grabación, revisión, publicación y soporte.",
          "Coordino y dirijo grabaciones para clientes, de la planeación a la validación de entregables.",
          "Traduzco solicitudes de clientes en tareas técnicas, reviso calidad y gestiono liberaciones.",
        ],
        loot: ["Next.js", "React", "Vercel", "DNS", "n8n", "Plesk", "Liderazgo", "QA"],
      },
      indusecc: {
        role: "Tech Architect · Operations Manager",
        scope:
          "Arquitectura técnica, coordinación de desarrollo y soporte operativo del entorno digital de una consultora ISO, de capacitación y mejora continua.",
        tech: [
          "Arquitectura y mantenimiento de soluciones digitales para la empresa.",
          "Seguimiento a desarrollo web, cambios técnicos, integraciones y disponibilidad de servicios.",
          "Dominios, hosting, DNS, correo y servicios digitales de los proyectos asignados.",
        ],
        ops: [
          "Planeo actividades, asigno prioridades y superviso entregables en proyectos simultáneos.",
          "Coordino la comunicación entre responsables técnicos, áreas administrativas y dirección.",
          "Estandarizo procedimientos y mantengo visible el estado de cada proyecto.",
        ],
        loot: ["Arquitectura", "Infraestructura", "Procesos", "Coordinación"],
      },
      bryanf: {
        role: "Fundador · Full-Stack · UX/UI · Consultor digital",
        scope:
          "Mi estudio independiente: acompaño a empresas desde el diagnóstico hasta el lanzamiento y la evolución de sus plataformas.",
        tech: [
          "Diseño, creo y mantengo aplicaciones web y plataformas: usuarios, reservas, catálogos y solicitudes.",
          "Sitios corporativos, landing pages, tiendas en línea y soluciones a medida.",
          "Pagos, formularios, automatizaciones, analítica, despliegues, dominios y DNS.",
        ],
        ops: [
          "Trato directo con clientes: reuniones, alcance, prioridades y seguimiento postlanzamiento.",
          "Propuestas, presupuestos, documentación e identidad visual de cada proyecto.",
        ],
        loot: ["Next.js", "Stripe", "Three.js", "Figma", "Ventas", "Producto"],
      },
      teleperformance: {
        role: "Manager de operación para Boost Mobile · Customer Service",
        scope: "Atención y experiencia del cliente en una cuenta de telecomunicaciones.",
        tech: [
          "Supervisión de actividades de servicio al cliente y seguimiento a procedimientos de calidad.",
          "Atención y escalamiento de incidencias y resolución de conflictos en escenarios exigentes.",
        ],
        ops: [
          "Coordinación de equipos, organización de personal y prioridades de operación.",
          "Comunicación profesional en inglés y español.",
        ],
        loot: ["Customer Service", "Liderazgo", "Inglés", "Escalamiento"],
      },
      hermanmiller: {
        role: "Diseñador gráfico",
        scope: "Material visual para campañas internas y externas, y apoyo en proyectos UX/UI.",
        tech: [
          "Diseño de material gráfico coherente con la marca.",
          "Participación en proyectos de diseño de interfaces y experiencia de usuario.",
        ],
        ops: ["Colaboración con otras áreas para mantener coherencia visual y usabilidad."],
        loot: ["Diseño", "UX/UI", "Marca"],
      },
      ocadeoro: {
        role: "Community Manager · Marketing digital",
        scope: "Redes sociales, contenido y comunidad de un equipo de e-sports.",
        tech: ["Estrategias de contenido y comunidad.", "Seguimiento de métricas y ajuste de campañas."],
        ops: [],
        loot: ["Contenido", "Métricas"],
      },
      cero: {
        role: "Diseñador gráfico y creativo",
        scope: "Portadas editoriales e identidad visual para autores y creadores de contenido.",
        tech: ["Conceptualización y creación de portadas de libros."],
        ops: [],
        loot: ["Editorial", "Identidad"],
      },
      itaca: {
        role: "Ventas y atención a clientes",
        scope: "Venta de servicios educativos con soporte y seguimiento telefónico.",
        tech: [],
        ops: [],
        loot: ["Ventas"],
      },
      moslo: {
        role: "Ventas y atención a clientes",
        scope: "Atención telefónica, gestión comercial y seguimiento de clientes.",
        tech: [],
        ops: [],
        loot: ["Ventas"],
      },
    },
  },
  inventory: {
    eyebrow: "Inventario",
    title: "Equipo y herramientas",
    hint: "Toca un objeto para ver su ficha.",
    slots: {
      front: "Front-end y web",
      ai: "Inteligencia artificial",
      mkt: "Marketing y analítica",
      infra: "Infraestructura",
      auto: "Automatización",
      design: "Diseño y video",
      lead: "Liderazgo",
    },
    tiers: { core: "Equipo principal", extra: "Equipo adicional" },
    leadNames: {
      teams: "Dirección de equipos",
      multi: "Proyectos simultáneos",
      clients: "Gestión multicliente",
      qa: "QA y validación",
      incidents: "Manejo de incidentes",
      docs: "Documentación técnica",
      service: "Customer Service",
      video: "Dirección de grabaciones",
    },
    mktNames: { seo: "SEO técnico", pixels: "Píxeles y conversiones", campaigns: "Campañas y métricas" },
    aiNames: { prompts: "Prompt engineering", aiApi: "IA por API", agents: "Agentes con IA" },
    autoNames: { forms: "Formularios", notify: "Notificaciones" },
    infraNames: { mail: "Correo empresarial" },
  },
  trophies: {
    eyebrow: "Sala de trofeos",
    title: "Proyectos destacados",
    credits: {
      own: "Marca propia",
      bryanf: "Portafolio BryanF Design",
      partum: "Desarrollado por Partum Design",
    },
    items: {
      bryanf: {
        sector: "Diseño y desarrollo web",
        desc: "Mi plataforma: portafolio, servicios, configurador de paquetes, pagos en línea y Lumina, la asistente con IA.",
      },
      cortmart: {
        sector: "App de reservas",
        desc: "Plataforma de citas y fidelización: servicios y precios, barbero y horario, cuentas, tarjeta de sellos con QR y panel de administración.",
      },
      mcspine: {
        sector: "Tecnología médica",
        desc: "Catálogo de implantes de columna por zona anatómica, fichas de producto y flujo de cotización.",
      },
      mixteca: {
        sector: "Agroexportación",
        desc: "Presencia digital para hortalizas y aromáticas: empresa, productos, ventajas comerciales y contacto.",
      },
      gecomex: {
        sector: "Logística y comercio exterior",
        desc: "Sitio corporativo para servicios logísticos y aduanas internacionales.",
      },
      koi: {
        sector: "Arquitectura e interiorismo",
        desc: "Experiencia editorial: proyectos, proceso creativo y narrativa visual de marca.",
      },
      partum: {
        sector: "Consultoría tecnológica B2B",
        desc: "Ecosistema de servicios, software, cotizaciones y propuestas comerciales de la agencia.",
      },
    },
    more: "Más misiones del mapa",
  },
  academy: {
    eyebrow: "Academia",
    title: "Formación",
    education: [
      { school: "Universidad Tecnológica de México (UNITEC)", degree: "Licenciatura en Diseño Digital y Animación", period: "2023 –" },
      { school: "Tecnológico de Estudios Superiores de Ecatepec", degree: "Ingeniería en Sistemas Computacionales (estudios cursados)", period: "2018 – 2020" },
    ],
    coursesTitle: "Power-ups",
    courses: [
      { year: "2023", name: "Diplomado en Adobe", org: "Travesía Educación" },
      { year: "2020", name: "Premiere Pro: la película a un clic", org: "Domestika" },
      { year: "2020", name: "After Effects: animación desde la imaginación", org: "Domestika" },
      { year: "2020", name: "Illustrator: arte con un vector", org: "Crehana" },
      { year: "2019", name: "Marketing en la era digital", org: "Fundación Google" },
      { year: "2018", name: "Desarrollo de aplicaciones móviles", org: "Fundación Google" },
      { year: "2018", name: "Fundamentos de redes inalámbricas", org: "" },
      { year: "2012", name: "Técnico en Informática", org: "CCPM" },
    ],
    languagesTitle: "Idiomas",
    languages: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "Avanzado" },
    ],
  },
  contact: {
    eyebrow: "¿Continuar?",
    thank: "GRACIAS",
    script: "por jugar",
    text: "Si buscas liderazgo técnico, criterio de diseño y capacidad de ejecución para tu equipo, hablemos.",
    whatsapp: "WhatsApp",
    email: "Correo",
    website: "Portafolio",
    vcard: "Guardar contacto",
    print: "Guardar CV en PDF",
    roles: "Puestos que busco",
    rolesList: [
      "Líder de Desarrollo Web",
      "Technical Operations Manager",
      "Web Solutions Architect",
      "Full-Stack · React / Next.js",
    ],
  },
  lumina: {
    name: "Lumina",
    role: "Tu guía",
    detected: "Detecté tu idioma: {lang}. Puedes cambiarlo arriba cuando quieras.",
    lines: {
      perfil:
        "¡Hola! Soy Lumina y te guiaré por el CV de Bryan. Aquí está su ficha: un jugador que desarrolla, diseña la arquitectura y además dirige la operación.",
      misiones:
        "Estas son sus misiones. La principal: dos años al frente de desarrollo y operación en Partum Design, en paralelo a Indusecc. Toca cada una para ver los detalles.",
      inventario:
        "¡Mira todo el equipo que carga! React, Next.js, Vercel, DNS, n8n, Adobe… y habilidades de liderazgo. Toca un objeto para ver su ficha. Además usa, controla y programa IA: Claude, ChatGPT, Gemini, Grok y Perplexity.",
      logros:
        "La sala de trofeos: apps de reservas, catálogos médicos, sitios corporativos y su propia plataforma. Cada logo es el oficial de la marca.",
      academia:
        "¿Sabías que empezó en sistemas computacionales y hoy estudia Diseño Digital y Animación? Por eso une código y diseño.",
      contacto:
        "¡Fin del recorrido! Si Bryan encaja con tu equipo, escríbele por WhatsApp o correo. También puedes guardar el CV en PDF.",
    },
  },
  meta: {
    title: "Bryan F. · CV interactivo | Líder de Desarrollo Web",
    description:
      "CV interactivo de Bryan Fernando López: líder de desarrollo web y aplicaciones, Tech Architect y Operations Manager. Recórrelo como un videojuego con Lumina como guía.",
  },
};

export type CvDict = typeof es;
export default es;

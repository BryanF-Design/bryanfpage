/**
 * SUSCRIPCIÓN "TODO DIGITAL" — contenido, política y preguntas frecuentes.
 *
 * Fuente única del texto comercial de la suscripción: la página /suscripcion,
 * su marcado FAQPage, el prompt de Lumina y los correos leen de aquí. El
 * precio vive en lib/catalog.ts (SUBSCRIPTION_PLAN). Para cambiar una regla de
 * la política, se edita aquí y se actualiza en todo el sitio.
 */

import { SUBSCRIPTION_PLAN } from "./catalog";

const price = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
}).format(SUBSCRIPTION_PLAN.price);

/** "$7,000 MXN" — para textos. */
export const SUBSCRIPTION_PRICE_LABEL = `${price} MXN`;

/** Lo que entra en la suscripción, agrupado para la página. */
export const SUBSCRIPTION_INCLUDES: { title: string; items: string[] }[] = [
  {
    title: "Sitios y páginas",
    items: [
      "Páginas web, landing pages y micrositios: los que necesites",
      "Tienda en línea y pasarela de pagos",
      "Rediseños y nuevas secciones",
      "Hosting de tus sitios mientras la suscripción esté activa",
    ],
  },
  {
    title: "Cambios ilimitados",
    items: [
      "Textos, fotos, precios, productos y promociones",
      "Ajustes de diseño y nuevas versiones",
      "Correcciones y mejoras de velocidad",
      "Mantenimiento, respaldos y actualizaciones",
    ],
  },
  {
    title: "Identidad digital",
    items: [
      "Tarjetas de presentación digitales",
      "Firmas de correo profesionales",
      "Kits de presencia digital y códigos QR",
      "Gráficos para redes sociales y banners",
    ],
  },
  {
    title: "Crecimiento",
    items: [
      "SEO técnico y Google Business Profile",
      "Medición: Google Analytics y conversiones",
      "Formularios, WhatsApp y automatizaciones",
      "Asesoría directa con Bryan",
    ],
  },
];

/** Cómo funciona, en pasos. */
export const SUBSCRIPTION_STEPS: { title: string; body: string }[] = [
  {
    title: "Te suscribes",
    body: `${SUBSCRIPTION_PRICE_LABEL} al mes, con tarjeta o Mercado Pago. Sin plazo forzoso.`,
  },
  {
    title: "Mandas tu solicitud",
    body: "Por WhatsApp o correo: qué necesitas, con ejemplos o referencias si los tienes.",
  },
  {
    title: "La entregamos en 1 a 2 días hábiles",
    body: "Según la complejidad. Los proyectos grandes se entregan por partes, cada una en ese tiempo.",
  },
  {
    title: "Pides cambios sin límite",
    body: "Revisas, ajustamos y seguimos con lo siguiente de tu lista.",
  },
];

/**
 * Política de la suscripción. Cada punto es una regla corta; la página los
 * pinta como lista y Términos y Condiciones enlaza aquí.
 */
export const SUBSCRIPTION_POLICY: { title: string; body: string }[] = [
  {
    title: "Cobro",
    body: `${SUBSCRIPTION_PRICE_LABEL} al mes, cobrados automáticamente el mismo día de cada mes con el método que elegiste. El acceso empieza en cuanto se confirma el primer pago.`,
  },
  {
    title: "Qué incluye",
    body: "Todo lo digital que necesites para tu negocio: sitios y páginas web, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes, SEO técnico, mantenimiento y hosting de los sitios que hagamos mientras la suscripción esté activa.",
  },
  {
    title: "Tiempos de entrega",
    body: "Cada solicitud se entrega en 1 a 2 días hábiles, según su complejidad. Lo que no cabe en ese tiempo (por ejemplo, una tienda completa) se divide en entregas más chicas, y cada una llega en ese plazo. El reloj corre desde que tenemos la información completa.",
  },
  {
    title: "Una solicitud a la vez",
    body: "Trabajamos tu lista por orden de prioridad, una solicitud activa a la vez. Puedes mandar todas las que quieras: en cuanto entregamos una, empezamos la siguiente.",
  },
  {
    title: "Horario",
    body: "Lunes a viernes de 9:00 a 19:00, hora de Ciudad de México. Las solicitudes que llegan fuera de horario o en días festivos se empiezan el siguiente día hábil.",
  },
  {
    title: "Costos de terceros",
    body: "No incluye lo que se le paga a otras empresas: pauta publicitaria (Google Ads, Meta), licencias o plugins de pago, dominios adicionales, comisiones de pasarelas de pago ni impresión física. Te avisamos antes de cualquier gasto y tú decides.",
  },
  {
    title: "Uso justo",
    body: "Es una suscripción para un negocio (una marca). Si necesitas atender varias marcas o empresas, lo platicamos y armamos un plan a tu medida.",
  },
  {
    title: "Cancelación",
    body: "Sin plazo forzoso: cancelas cuando quieras y no se vuelve a cobrar. Conservas el acceso hasta el final del mes ya pagado; no hay reembolsos por meses parciales.",
  },
  {
    title: "Tus archivos y sitios",
    body: "Todo lo que entregamos es tuyo. Si cancelas, te pasamos los archivos y accesos, y te ayudamos a mover tus sitios a tu propio hosting.",
  },
  {
    title: "Pagos fallidos",
    body: "Si un cobro no pasa, la plataforma lo reintenta y te avisamos. Si sigue pendiente después de 7 días, pausamos las solicitudes hasta que se regularice; tus sitios siguen en línea.",
  },
];

/** Preguntas frecuentes de la suscripción (también van como FAQPage). */
export const SUBSCRIPTION_FAQ: { question: string; answer: string }[] = [
  {
    question: "¿Qué incluye exactamente la suscripción?",
    answer: `Todo lo digital que tu negocio necesite por ${SUBSCRIPTION_PRICE_LABEL} al mes: páginas web, tienda en línea, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes, SEO técnico, mantenimiento y hosting de tus sitios.`,
  },
  {
    question: "¿Cuánto tardan en entregar cada solicitud?",
    answer: "Entre 1 y 2 días hábiles, según la complejidad. Si algo es grande (una tienda completa, un sitio de muchas secciones), lo dividimos en entregas más chicas y cada una llega en ese tiempo.",
  },
  {
    question: "¿De verdad los cambios son ilimitados?",
    answer: "Sí. Puedes pedir todos los cambios que quieras. Los trabajamos uno a la vez, por orden de prioridad, para entregarte cada uno rápido y bien hecho.",
  },
  {
    question: "¿Puedo pedir varias cosas al mismo tiempo?",
    answer: "Puedes mandar tu lista completa cuando quieras. Trabajamos una solicitud activa a la vez y, en cuanto la entregamos, seguimos con la siguiente.",
  },
  {
    question: "¿Hay plazo forzoso? ¿Cómo cancelo?",
    answer: "No hay plazo forzoso. Cancelas cuando quieras desde el portal de tu suscripción o escribiéndonos, y ya no se vuelve a cobrar. Mantienes el acceso hasta el final del mes pagado.",
  },
  {
    question: "¿Qué pasa con mi sitio si cancelo?",
    answer: "Es tuyo. Te entregamos los archivos y accesos, y te ayudamos a moverlo a tu propio hosting para que siga en línea.",
  },
  {
    question: "¿Qué no está incluido?",
    answer: "Los pagos a terceros: anuncios en Google o Meta, licencias o plugins de pago, dominios adicionales, comisiones de pasarelas e impresión física. Siempre te avisamos antes y tú decides.",
  },
  {
    question: "¿Me conviene más la suscripción o un proyecto de pago único?",
    answer: "Si solo necesitas un sitio y casi no lo vas a cambiar, el pago único (desde $3,500 MXN) es suficiente. Si tu negocio se mueve, lanzas promociones o necesitas varias piezas digitales cada mes, la suscripción sale más barata y vas más rápido.",
  },
  {
    question: "¿Cómo pago y cuándo se cobra?",
    answer: "Con tarjeta (Stripe) o Mercado Pago. El cobro es automático, el mismo día de cada mes en que te suscribiste. Si prefieres transferencia mensual, escríbenos.",
  },
  {
    question: "¿Cómo mando mis solicitudes?",
    answer: "Por WhatsApp o correo, en horario de lunes a viernes de 9:00 a 19:00 (CDMX). Mientras más claro (texto, fotos, ejemplos), más rápido entregamos.",
  },
];

/** Resumen corto para el prompt de Lumina. */
export const SUBSCRIPTION_PROMPT = `Suscripción "Todo Digital": ${SUBSCRIPTION_PRICE_LABEL} al mes, sin plazo forzoso. Incluye todo lo digital: páginas web y tiendas, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes, SEO técnico, mantenimiento y hosting. Cada solicitud tarda 1 a 2 días hábiles según complejidad; una solicitud activa a la vez. No incluye pagos a terceros (anuncios, licencias, dominios extra, impresión). Cancela cuando quiera. Página: suscripcion. Todas las dudas (factura, dominio, cancelación, pagos, tiempos): página suscripcion-preguntas.`;

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * CENTRO DE PREGUNTAS de la suscripción (/suscripcion/preguntas-frecuentes),
 * por categoría. Las respuestas siguen la política de arriba.
 *
 * Las marcadas con `// CONFIRMAR` describen algo que la política aún no fija
 * (facturación, dominio, correos, logo, redes, fotos, apps, precio futuro…):
 * revísalas y ajusta el texto a como de verdad lo vas a manejar.
 */
export const SUBSCRIPTION_FAQ_CATEGORIES: { id: string; title: string; items: FaqItem[] }[] = [
  {
    id: "basico",
    title: "Lo básico",
    items: [
      {
        question: "¿Qué es la Suscripción Todo Digital?",
        answer: `Es un plan mensual de ${SUBSCRIPTION_PRICE_LABEL} con el que tienes a BryanF Design como tu equipo digital: nos pides lo que tu negocio necesite (páginas, cambios, tarjetas digitales, firmas, gráficos, SEO) y lo entregamos en 1 a 2 días hábiles por solicitud, sin cotizar cada cosa por separado.`,
      },
      {
        question: "¿Para quién es la suscripción?",
        answer: "Para negocios que se mueven: los que lanzan promociones, cambian precios o productos, abren sucursales, hacen campañas o simplemente quieren tener todo lo digital resuelto sin buscar un proveedor para cada cosa.",
      },
      {
        question: "¿Cuánto cuesta y hay costos ocultos?",
        answer: `${SUBSCRIPTION_PRICE_LABEL} al mes. No hay costo de alta ni cargos escondidos. Lo único que va aparte son los pagos a terceros (anuncios, licencias de pago, dominios adicionales, comisiones de pasarelas, impresión), y siempre te avisamos antes de cualquier gasto.`,
      },
      {
        // CONFIRMAR: si el precio incluye IVA y si emites factura.
        question: "¿El precio incluye IVA?",
        answer: `El precio publicado es de ${SUBSCRIPTION_PRICE_LABEL} al mes. Si necesitas factura, escríbenos antes de suscribirte con tus datos fiscales y te confirmamos el monto final con impuestos.`,
      },
      {
        question: "¿Hay contrato o plazo forzoso?",
        answer: "No. Es mes a mes: te quedas porque te sirve, no por un contrato. Cancelas cuando quieras y no se vuelve a cobrar.",
      },
      {
        question: "¿Hay periodo de prueba?",
        answer: "No hay prueba gratis, pero tampoco plazo forzoso: si el primer mes no te convence, cancelas y no se vuelve a cobrar. Conservas todo lo que te entregamos.",
      },
      {
        question: "¿Cómo empiezo?",
        answer: "Te suscribes con tarjeta o Mercado Pago en la página de la suscripción (o por transferencia escribiéndonos). En la página de gracias nos cuentas de tu negocio (Lumina te ayuda a llenarlo) y nos mandas tu primera solicitud por WhatsApp.",
      },
      {
        question: "¿Con quién voy a trabajar?",
        answer: "Directo con Bryan, fundador del estudio. Sin intermediarios ni tickets perdidos: le escribes, te contesta y te entrega.",
      },
    ],
  },
  {
    id: "incluye",
    title: "Qué incluye",
    items: [
      {
        question: "¿Qué incluye exactamente la suscripción?",
        answer: `Todo lo digital que tu negocio necesite por ${SUBSCRIPTION_PRICE_LABEL} al mes: páginas web, landing pages, tienda en línea, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes y banners, SEO técnico, Google Business Profile, medición con Google Analytics, mantenimiento, respaldos y hosting de tus sitios.`,
      },
      {
        question: "¿Cuántas páginas o sitios puedo pedir?",
        answer: "Los que necesites para tu negocio. No hay un tope de páginas: las trabajamos una solicitud a la vez y, en cuanto entregamos una, seguimos con la siguiente.",
      },
      {
        question: "¿Incluye tienda en línea y pagos?",
        answer: "Sí. Armamos tu tienda y conectamos la pasarela de pagos (Stripe o Mercado Pago). Una tienda completa se entrega por partes, cada una en 1 a 2 días hábiles. Las comisiones que cobra la pasarela por cada venta van aparte.",
      },
      {
        question: "¿Incluye el hosting?",
        answer: "Sí. Los sitios que hagamos quedan hospedados sin costo extra mientras la suscripción esté activa. Si cancelas, te ayudamos a moverlos a tu propio hosting.",
      },
      {
        // CONFIRMAR: si el dominio principal entra o siempre va aparte.
        question: "¿Incluye el dominio (tunegocio.com)?",
        answer: "La configuración y conexión de tu dominio sí está incluida. El registro del dominio se paga al proveedor a tu nombre, para que siempre sea tuyo; los dominios adicionales también van aparte. Si aún no tienes uno, te ayudamos a elegirlo y comprarlo.",
      },
      {
        // CONFIRMAR: correos con dominio.
        question: "¿Incluye correos con mi dominio (tu@tunegocio.com)?",
        answer: "Te ayudamos a configurarlos con el proveedor que elijas (Google Workspace, Zoho u otro). Las licencias de correo las cobra el proveedor, como cualquier costo de terceros.",
      },
      {
        question: "¿Incluye tarjetas digitales y firmas de correo?",
        answer: "Sí, las que necesites: tarjetas de presentación digitales con QR, firmas de correo profesionales y kits de presencia digital para todo tu equipo.",
      },
      {
        // CONFIRMAR: alcance de logo / identidad.
        question: "¿Incluye diseño de logo o identidad?",
        answer: "Incluye adaptar tu marca a lo digital: versiones de tu logo para web y redes, favicon, firmas y gráficos. Si necesitas crear tu identidad desde cero, cuéntanos y lo planeamos contigo como solicitudes por partes.",
      },
      {
        // CONFIRMAR: alcance en redes sociales.
        question: "¿Incluye manejo de redes sociales?",
        answer: "Incluye gráficos para redes sociales y banners. Publicar todos los días, contestar mensajes y administrar tus cuentas (community management) no está incluido.",
      },
      {
        question: "¿Incluye anuncios en Google o Meta?",
        answer: "El dinero de la pauta lo pagas directo a Google o Meta y no está incluido. Sí incluye las landing pages para tus campañas y dejar lista la medición (Google Analytics y conversiones) para saber qué funciona.",
      },
      {
        question: "¿Incluye SEO? ¿Me garantizan el primer lugar en Google?",
        answer: "Incluye SEO técnico (velocidad, estructura, datos para Google) y tu perfil de Google Business. Nadie puede garantizar honestamente una posición en Google, pero sí dejamos tu sitio en las mejores condiciones para aparecer.",
      },
      {
        question: "¿Ustedes escriben los textos?",
        answer: "Sí. Redactamos y ajustamos los textos de tus páginas a partir de lo que nos cuentas de tu negocio. Tú los revisas y cambiamos lo que quieras.",
      },
      {
        // CONFIRMAR: fotografía.
        question: "¿Incluye fotos o sesiones fotográficas?",
        answer: "Trabajamos con tus fotos o con imágenes de bancos libres, y las optimizamos para web. Las sesiones fotográficas o de video presenciales no están incluidas.",
      },
      {
        // CONFIRMAR: apps nativas.
        question: "¿Hacen apps para celular?",
        answer: "Todo lo que hacemos se ve y funciona perfecto en celular. Las apps nativas para App Store o Google Play no entran en la suscripción; si las necesitas, lo platicamos aparte.",
      },
      {
        question: "¿Puedo pedir herramientas a medida (cotizadores, formularios, automatizaciones)?",
        answer: "Sí: formularios, cotizadores, conexiones con WhatsApp y automatizaciones sencillas entran. Si es un sistema grande, lo dividimos en entregas de 1 a 2 días hábiles; si no cabe en ese esquema, te lo decimos antes.",
      },
      {
        question: "¿Qué no está incluido?",
        answer: "Los pagos a terceros: anuncios en Google o Meta, licencias o plugins de pago, dominios adicionales, comisiones de pasarelas e impresión física. Siempre te avisamos antes y tú decides.",
      },
    ],
  },
  {
    id: "solicitudes",
    title: "Solicitudes y tiempos",
    items: [
      {
        question: "¿Cómo mando mis solicitudes?",
        answer: "Por WhatsApp o correo, de lunes a viernes de 9:00 a 19:00 (hora de Ciudad de México). Mientras más claro (texto, fotos, ejemplos), más rápido entregamos.",
      },
      {
        question: "¿Cuánto tardan en entregar cada solicitud?",
        answer: "Entre 1 y 2 días hábiles, según la complejidad. Un cambio de texto puede salir el mismo día; algo grande (una tienda completa, un sitio de muchas secciones) se divide en entregas más chicas y cada una llega en ese tiempo.",
      },
      {
        question: "¿Desde cuándo cuenta el tiempo de entrega?",
        answer: "Desde que tenemos la información completa para esa solicitud (textos, fotos, accesos). Si falta algo, te lo pedimos de inmediato.",
      },
      {
        question: "¿Qué cuenta como una solicitud?",
        answer: "Una tarea concreta: una página nueva, actualizar precios, un banner, una tarjeta digital, una sección extra, un ajuste de diseño. Si pides algo grande, lo dividimos en varias solicitudes y te decimos el orden.",
      },
      {
        question: "¿De verdad los cambios son ilimitados?",
        answer: "Sí. Puedes pedir todos los cambios que quieras. Los trabajamos uno a la vez, por orden de prioridad, para entregarte cada uno rápido y bien hecho.",
      },
      {
        question: "¿Puedo pedir varias cosas al mismo tiempo?",
        answer: "Puedes mandar tu lista completa cuando quieras. Trabajamos una solicitud activa a la vez y, en cuanto la entregamos, seguimos con la siguiente.",
      },
      {
        question: "¿Puedo cambiar el orden de mi lista?",
        answer: "Sí, tú decides las prioridades. La solicitud que ya está en curso se termina primero y después seguimos con la que marques como más urgente.",
      },
      {
        question: "¿Atienden fines de semana o urgencias?",
        answer: "El horario es de lunes a viernes de 9:00 a 19:00 (CDMX). Lo que llega fuera de horario o en días festivos se empieza el siguiente día hábil. Si tu sitio se cae, avísanos por WhatsApp y lo atendemos en cuanto lo veamos.",
      },
      {
        question: "¿Qué necesito mandar para que salga rápido?",
        answer: "Qué quieres, dónde va y cualquier material que tengas: textos, fotos, tu logo, precios y uno o dos ejemplos que te gusten. Puedes mandar links de Drive, Dropbox o WeTransfer.",
      },
      {
        question: "¿Puedo pedir que corrijan algo ya entregado?",
        answer: "Claro. Revisas cada entrega y ajustamos lo que haga falta, las veces que haga falta.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos y facturación",
    items: [
      {
        question: "¿Cómo pago y cuándo se cobra?",
        answer: "Con tarjeta (Stripe) o Mercado Pago. El cobro es automático, el mismo día de cada mes en que te suscribiste. Si prefieres transferencia mensual, escríbenos.",
      },
      {
        question: "¿Puedo pagar por transferencia?",
        answer: "Sí. Elige \"Transferencia mensual\" en la página de la suscripción y te mandamos los datos por WhatsApp. Cada mes nos mandas tu comprobante y seguimos trabajando.",
      },
      {
        question: "¿Puedo pagar desde otro país o con tarjeta extranjera?",
        answer: "Sí. El cobro es en pesos mexicanos y las tarjetas internacionales funcionan con Stripe; tu banco hace la conversión con su tipo de cambio.",
      },
      {
        // CONFIRMAR: facturación.
        question: "¿Emiten factura?",
        answer: "Escríbenos con tus datos fiscales al suscribirte y te confirmamos cómo se factura tu mensualidad.",
      },
      {
        question: "¿Dónde veo mis recibos?",
        answer: "Con tarjeta, Stripe te manda el recibo por correo en cada cobro; con Mercado Pago, lo ves en tu cuenta. Si necesitas una copia, pídenosla.",
      },
      {
        question: "¿Qué pasa si falla un cobro?",
        answer: "La plataforma lo reintenta y te avisamos. Si sigue pendiente después de 7 días, pausamos las solicitudes hasta que se regularice; tus sitios siguen en línea.",
      },
      {
        // CONFIRMAR: compromiso de precio.
        question: "¿El precio puede subir?",
        answer: "Tu precio se mantiene mientras sigas suscrito. Si algún día cambia, te avisamos con anticipación y decides si continúas.",
      },
      {
        question: "¿Hay descuento por pagar el año completo?",
        answer: "Por ahora solo existe el plan mensual. Si te interesa pagar varios meses por adelantado, escríbenos y lo vemos.",
      },
    ],
  },
  {
    id: "cancelar",
    title: "Cancelación y cambios de plan",
    items: [
      {
        question: "¿Cómo cancelo?",
        answer: "Desde el portal de tu suscripción o escribiéndonos por WhatsApp o correo. Ya no se vuelve a cobrar y mantienes el acceso hasta el final del mes pagado.",
      },
      {
        question: "¿Me devuelven dinero si cancelo a mitad de mes?",
        answer: "No hay reembolsos por meses parciales, pero conservas el servicio completo hasta el final del mes que ya pagaste.",
      },
      {
        question: "¿Puedo pausar la suscripción?",
        answer: "No manejamos pausas. Puedes cancelar y volver cuando quieras; si cancelas, te entregamos tus sitios y accesos para que sigan en línea en tu propio hosting.",
      },
      {
        question: "¿Puedo volver a suscribirme después?",
        answer: "Sí, cuando quieras. Retomamos donde nos quedamos.",
      },
      {
        question: "Ya tengo un sitio de pago único con ustedes, ¿puedo pasarme a la suscripción?",
        answer: "Sí. Lo seguimos atendiendo dentro de la suscripción: cambios, nuevas páginas y mantenimiento, sin cotizar cada cosa.",
      },
      {
        question: "¿Me conviene más la suscripción o un proyecto de pago único?",
        answer: "Si solo necesitas un sitio y casi no lo vas a cambiar, el pago único (desde $3,500 MXN) es suficiente. Si tu negocio se mueve, lanzas promociones o necesitas varias piezas digitales cada mes, la suscripción sale más barata y vas más rápido.",
      },
    ],
  },
  {
    id: "sitios",
    title: "Tus sitios, archivos y accesos",
    items: [
      {
        question: "¿Qué pasa con mi sitio si cancelo?",
        answer: "Es tuyo. Te entregamos los archivos y accesos, y te ayudamos a moverlo a tu propio hosting para que siga en línea.",
      },
      {
        question: "¿De quién son los diseños y el código?",
        answer: "Tuyos. Todo lo que entregamos dentro de la suscripción le pertenece a tu negocio.",
      },
      {
        question: "¿Pueden trabajar sobre mi sitio actual (WordPress, Wix, Shopify…)?",
        answer: "Sí. Lo revisamos y te decimos si conviene mejorarlo donde está o moverlo a algo más rápido y fácil de mantener. Tú decides.",
      },
      {
        question: "¿Hacen respaldos y actualizaciones?",
        answer: "Sí: mantenimiento, respaldos y actualizaciones de tus sitios están incluidos mientras la suscripción esté activa.",
      },
      {
        question: "¿Cómo comparto contraseñas y accesos de forma segura?",
        answer: "Nunca por formularios ni redes sociales. Cuando haga falta, te pedimos que nos invites como usuario o te indicamos un canal seguro; siempre puedes cambiar tus contraseñas después.",
      },
    ],
  },
  {
    id: "negocio",
    title: "Tu negocio y nosotros",
    items: [
      {
        question: "¿Puedo usar la suscripción para varias marcas o negocios?",
        answer: "La suscripción es para un negocio (una marca). Si atiendes varias marcas o empresas, lo platicamos y armamos un plan a tu medida.",
      },
      {
        question: "Soy agencia, ¿puedo revender sus servicios?",
        answer: "Sí podemos trabajar contigo, pero no con esta suscripción: como atiendes varias marcas, armamos un plan a tu medida. Escríbenos.",
      },
      {
        question: "¿Trabajan con negocios fuera de México?",
        answer: "Sí. Hemos trabajado con clientes en México, España y Francia. Atendemos en español o inglés y en horario de Ciudad de México.",
      },
      {
        question: "¿Cómo sé que el trabajo es bueno?",
        answer: "Llevamos más de 150 proyectos desde 2020. Puedes ver sitios reales en nuestro portafolio y, como no hay plazo forzoso, nos pruebas un mes sin amarrarte.",
      },
      {
        question: "¿Puedo hablar con alguien antes de suscribirme?",
        answer: "Claro. Escríbenos por WhatsApp al +52 56 6301 2505 o a bryanf@bryanfdesign.com, o pregúntale a Lumina en el sitio.",
      },
    ],
  },
];

/** Todas las preguntas en una lista (para el marcado FAQPage). */
export const SUBSCRIPTION_FAQ_ALL: FaqItem[] = SUBSCRIPTION_FAQ_CATEGORIES.flatMap((c) => c.items);

import type { Dictionary } from "./es";

const pt: Dictionary = {
  nav: {
    inicio: "Início",
    proceso: "Processo",
    proyectos: "Projetos",
    precios: "Preços",
    faq: "FAQ",
    cliente: "Já é cliente?",
    armaTuWeb: "Monte seu site",
    verProyectos: "Ver projetos",
  },
  hero: {
    eyebrow: "Design e desenvolvimento web no México",
    titlePrefix: "Faça",
    titleHighlight: "acontecer.",
    subtitle:
      "Criamos seu site sob medida: rápido, animado e orientado à conversão. Estratégia, performance e SEO de verdade para o seu site ficar incrível e vender.",
  },
  trust: {
    years: "anos",
    yearsCaption: "de experiência",
    projects: "projetos",
    projectsCaption: "digitais entregues com sucesso",
    deliveryPrefix: "A partir de",
    days: "dias",
    deliveryCaption: "dias úteis de entrega",
  },
  process: {
    eyebrow: "Como trabalhamos",
    title: "Um processo claro, da ideia ao lançamento",
    subtitle: "Sem enrolação: entregas a partir de 3 dias úteis, com acompanhamento após o lançamento.",
    steps: [
      {
        title: "Orçamento",
        content: "Compartilhamos uma proposta clara: escopo, prazos e preço. Sem letras miúdas.",
      },
      {
        title: "Briefing",
        content: "Entendemos seu negócio, seus objetivos e com quem você fala. Definimos estratégia e conteúdo.",
      },
      {
        title: "Desenvolvimento",
        content: "Design UX/UI e código rápido e limpo: responsivo, animado e otimizado para Core Web Vitals.",
      },
      {
        title: "Lançamento",
        content: "SEO técnico, deploy e monitoramento. Seu site pronto para vender desde o primeiro dia.",
      },
      {
        title: "Acompanhamento",
        content:
          "1 mês de acompanhamento pós-entrega e acesso ao Access BryanF, seu painel técnico, para garantir o bom funcionamento do site.",
      },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "As tecnologias que utilizo",
    subtitle:
      "Frameworks e ferramentas modernas com as quais construo: rápido, escalável e sob medida. A tecnologia a serviço da ideia, não o contrário.",
    ctaPrimary: "Ver projetos",
    ctaSecondary: "Vamos trabalhar juntos",
  },
  projects: {
    eyebrow: "Portfólio",
    titlePrefix: "Sites que",
    rotatingWords: ["vendem", "convertem", "conectam", "se destacam"],
    subtitle: "Sites que geram impacto real para cada cliente. Cada um projetado e construído sob medida. Toque em qualquer um para visitar.",
    visitSite: "Visitar site",
    showMore: "Mostrar mais projetos",
    descs: {
      "goldenrepublic-com-mx": "Imóveis",
      "serviciosecem-com-mx": "Assessoria contábil e fiscal",
      "industriastritton-com": "Mistura e moagem industrial",
      "nkmohcafe-com": "Café especial",
      "playerapublimax-com": "Camisetas personalizadas",
      "proshieldmexico-com": "Proteção patrimonial",
      "homeflowoficial-com": "Plataforma digital",
      "prefabricadosmx-com": "Pré-moldados de concreto",
      "efficientplasticolors-com": "Concentrados de cor para plástico",
      "ndt360-com-mx": "Ensaios não destrutivos",
      "kafi-com-mx": "Espaços de trabalho",
      "mielyabejas-mx": "Mel artesanal, direto do campo para a sua mesa",
      "bravologix-com-mx": "Logística e transporte",
      "verticlean-com-mx": "Limpeza profissional",
      "distribuidorajemar-com": "Distribuição de suprimentos",
      "gruposum-com": "Experiências que conectam equipes",
      "grupocosma-com": "Construção e serviços",
      "koi-arquitectura-vercel-app": "Arquitetura",
      "repissa-vercel-app": "Marca e site",
      "nezga-arquitectos-vercel-app": "Arquitetura e construção",
      "epiko-vercel-app": "Produção de eventos",
      "element-experiences-com": "Experiências e eventos",
    },
  },
  world: {
    eyebrow: "Presença",
    title: "Onde já trabalhamos",
    subtitle: "Projetos para clientes no México, Espanha e França. Projetamos sem fronteiras.",
  },
  clients: {
    label: "Marcas que confiaram",
  },
  configurator: {
    eyebrow: "Configurador",
    title: "Monte seu site e pague online",
    subtitle: "Escolha seu pacote, some os módulos que precisar e pague com cartão, Mercado Pago ou transferência. Sem surpresas.",
    step1: "1. Escolha seu pacote",
    plans: {
      full: {
        name: "Desenvolvimento Web",
        desc: "Seu site profissional sob medida, rápido e orientado a vender.",
      },
      update: {
        name: "Atualização",
        desc: "Renove seu site atual com design e performance de verdade.",
      },
      maintenance: {
        name: "Manutenção",
        desc: "Seu site sempre atualizado, seguro e com backup. Por mês.",
      },
    },
    step2: "2. Módulos extras",
    modules: {
      ecommerce: "E-commerce / loja online",
      payments: "Gateway de pagamento",
      maintenance: "Manutenção especializada",
    },
    extraSections: "Seções adicionais",
    perUnit: "cada",
    removeSection: "Remover seção",
    addSection: "Adicionar seção",
    step3: "3. Modalidade de pagamento",
    paymentFull: "Pagamento completo (100%)",
    paymentAdvance: "Entrada (50%)",
    couponLabel: "Cupom",
    couponPlaceholder: "Ex. BRYANF10",
    apply: "Aplicar",
    couponNoneEntered: "",
    couponNoneActive: "No momento não há cupons ativos. Veja nossas redes ou pergunte à Lumina.",
    summary: "Seu resumo",
    totalProject: "Total do projeto",
    payNow: "A pagar agora",
    payStripe: "Pagar com cartão (Stripe)",
    payMercadoPago: "Pagar com Mercado Pago",
    payTransfer: "Pagar por transferência",
    additionalSectionsLabel: (n) => `Seções adicionais x${n}`,
    opening: (label) => `Abrindo ${label}…`,
    openFailed: (reason) => `Não foi possível abrir o pagamento (${reason}). Tente por transferência ou fale conosco no WhatsApp.`,
    openedInTab: (label) => `${label} aberto em outra aba. Conclua seu pagamento para continuar.`,
    noPaymentLink: "O link de pagamento não foi recebido. Tente novamente.",
    connectionError: "Erro de conexão. Tente novamente ou use o WhatsApp.",
    transferInstructions: (amount) => `Transfira ${amount} e envie seu comprovante.`,
    bank: {
      banco: "Banco",
      titular: "Titular",
      cuenta: "Conta",
      clabe: "CLABE",
      swift: "SWIFT",
    },
    copyLabel: (label) => `Copiar ${label}`,
    sendWhatsapp: "Enviar comprovante pelo WhatsApp",
    sendEmail: "Enviar comprovante por e-mail",
    securePaymentPrefix: "Pagamento seguro. Ao continuar você aceita nossos",
    terms: "Termos",
    and: "e",
    privacyNotice: "Aviso de Privacidade",
    whatsappTransferMsg: ({ plan, modules, mode, total, payNow }) =>
      `Olá, quero pagar meu projeto por transferência.\n\nPlano: ${plan}\nMódulos: ${modules}\nModalidade: ${mode}\nTotal do projeto: ${total}\nA pagar agora: ${payNow}`,
    modeFullLabel: "Pagamento completo",
    modeAdvanceLabel: "Entrada de 50%",
    none: "nenhum",
  },
  faq: {
    eyebrow: "Perguntas frequentes",
    title: "O que você precisa saber",
    subtitle: "Toque em uma pergunta para ver a resposta.",
    items: [
      {
        title: "Quais são os prazos de entrega?",
        content: "Os prazos começam em 3 dias após você nos passar as informações completas da sua empresa.",
      },
      {
        title: "Quantas alterações posso pedir?",
        content:
          "Na BryanF Design não trabalhamos com limite de alterações. A satisfação total do cliente é o mais importante para entregar um produto de qualidade.",
      },
      {
        title: "Qual é o horário de atendimento?",
        content: "Nosso horário é de segunda a sexta, das 9h às 19h, horário da Cidade do México (CDMX).",
      },
      {
        title: "Quais são os custos?",
        content: "Os valores começam em $3.500 MXN e podem variar de acordo com as necessidades específicas do seu projeto.",
      },
      {
        title: "O que é necessário para começar?",
        content:
          "As informações gerais da sua empresa, uma breve chamada para levantar os requisitos principais e um sinal de 50%. Os outros 50% são pagos na entrega e aprovação do projeto.",
      },
      {
        title: "O que eu recebo no final?",
        content:
          "Acesso total ao site e aos e-mails (caso tenham sido criados), além de um treinamento rápido, de no máximo 30 minutos, sobre o manejo básico do seu site.",
      },
      {
        title: "O que está incluído ao trabalharmos juntos?",
        content:
          "Domínio e hospedagem gratuitos por um ano, e-mails ilimitados (1 GB cada), um design totalmente personalizado e a garantia de satisfação com o produto final.",
      },
    ],
    notFound: "Não encontrou sua resposta? Fale conosco e vamos conversar.",
    sendWhatsapp: "Enviar WhatsApp",
  },
  closingCta: {
    title: "Pronto para sua marca ter a cara do que ela vale?",
    subtitle: "Monte seu site, escolha como pagar (cartão, Mercado Pago ou transferência) e vamos começar. Projetos a partir de $3.500 MXN.",
    ctaPrimary: "Monte seu site",
    ctaSecondary: "WhatsApp direto",
  },
  about: {
    eyebrow: "Quem faz isso",
    title: "Eu sou o Bryan. Eu mesmo projeto e construo cada site.",
    subtitle:
      "Sem agência no meio, sem intermediários: você fala comigo desde a primeira mensagem até o dia em que seu site vai ao ar. México, horário flexível, café à vontade.",
  },
  footer: {
    tagline: "Design que vende",
    taglineRest: ", não só que parece bonito. Sites rápidos, animados e sob medida, direto do México.",
    navLabel: "Navegação",
    servicesLabel: "Serviços",
    legalLabel: "Legal e contato",
    privacy: "Aviso de Privacidade",
    terms: "Termos e Condições",
    reviewGoogle: "Deixe sua avaliação no Google Maps",
    clientQuestion: "Já é cliente?",
    copyright: (year) => `© ${year} BryanF Design · Feito no México`,
    acceptPrefix: "Ao nos contatar você aceita nosso",
    and: "e",
    services: {
      desarrolloWeb: "Desenvolvimento web",
      disenoWeb: "Design web",
      uxUi: "UX/UI",
      paginasNegocios: "Sites para negócios",
      softwareMedida: "Software sob medida",
      mantenimientoWeb: "Manutenção de sites",
    },
  },
  lumina: {
    name: "Lumina",
    greeting:
      "Olá! Eu sou a <strong>Lumina</strong>, sua consultora na BryanF Design.<br>Posso ajudar com preços, prazos ou a montar seu site?",
    quick: ["Quanto custa um site?", "Em quanto tempo entregam?", "Quero montar meu site"],
    online: "Consultora de IA · online",
    offline: "Sem conexão",
    thinking: "Pensando…",
    placeholder: "Digite sua mensagem…",
    close: "Fechar",
    send: "Enviar",
    open: "Abrir chat com a Lumina",
    teaser: "Quer criar seu site? Pergunte sobre preços, prazos ou como começar ✨",
    typing: "Digitando…",
    languageInstruction: "português",
    errorFallback:
      "Agora não consigo responder, mas fale conosco pelo <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a> que te atendemos na hora.",
    misunderstood: "Desculpa, não entendi. Vamos tentar de novo?",
    connectionError:
      "Tivemos um problema de conexão. Fale conosco pelo <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
  },
  languageNotice: {
    text: "Detectamos seu idioma automaticamente e salvamos sua escolha em um cookie para lembrar em todo o site. Você pode mudar quando quiser.",
    dismiss: "Entendi",
  },
  languageSwitcher: {
    label: "Idioma",
  },
};

export default pt;

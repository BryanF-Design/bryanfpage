import type { Dictionary } from "./es";

const en: Dictionary = {
  nav: {
    inicio: "Home",
    proceso: "Process",
    proyectos: "Projects",
    precios: "Pricing",
    faq: "FAQ",
    cliente: "Already a client?",
    armaTuWeb: "Build your site",
    verProyectos: "See projects",
    menu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },
  marquee: {
    words: ["Design", "Code", "SEO", "Performance", "E-commerce", "Branding"],
  },
  hero: {
    eyebrow: "Web design and development in Mexico",
    titlePrefix: "Make it",
    titleHighlight: "happen.",
    subtitle:
      "I design and build fast, clear websites made to convert. You work with me from the first idea to launch.",
    scrollHint: "Scroll to open the laptop",
  },
  trust: {
    years: "years",
    yearsCaption: "of experience",
    projects: "projects",
    projectsCaption: "shipped successfully",
    deliveryPrefix: "From",
    days: "days",
    deliveryCaption: "business days to launch",
  },
  process: {
    eyebrow: "How we work",
    title: "A clear process, from idea to launch",
    subtitle: "No smoke and mirrors: delivery starts at 3 business days, with support after launch.",
    steps: [
      {
        title: "Quote",
        content: "We share a clear proposal: scope, timeline, and price. No fine print.",
      },
      {
        title: "Brief",
        content: "We learn your business, your goals, and who you're talking to. We define strategy and content.",
      },
      {
        title: "Build",
        content: "Fast, clean UX/UI design and code: responsive, animated, and optimized for Core Web Vitals.",
      },
      {
        title: "Launch",
        content: "Technical SEO, deployment, and tracking. Your site is ready to sell from day one.",
      },
      {
        title: "Support",
        content:
          "1 month of post-launch support and access to Access BryanF, your technical dashboard, to keep the site running smoothly.",
      },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "The tools I build with",
    subtitle:
      "Modern frameworks and tools I use to build: fast, scalable, and tailored to the job. Technology in service of the idea, not the other way around.",
    ctaPrimary: "See projects",
    ctaSecondary: "Let's work together",
  },
  projects: {
    eyebrow: "Portfolio",
    titlePrefix: "Sites that",
    rotatingWords: ["sell", "convert", "connect", "stand out"],
    subtitle: "Sites that make a real impact for every client. Each one designed and built to order. Tap any of them to visit.",
    visitSite: "Visit site",
    showMore: "Show more projects",
    descs: {
      "goldenrepublic-com-mx": "Real estate",
      "serviciosecem-com-mx": "Accounting and tax advisory",
      "industriastritton-com": "Industrial blending and milling",
      "nkmohcafe-com": "Specialty coffee",
      "playerapublimax-com": "Custom t-shirts",
      "proshieldmexico-com": "Asset protection",
      "homeflowoficial-com": "Digital platform",
      "prefabricadosmx-com": "Precast concrete",
      "efficientplasticolors-com": "Color concentrates for plastics",
      "ndt360-com-mx": "Non-destructive testing",
      "kafi-com-mx": "Workspaces",
      "mielyabejas-mx": "Artisanal honey, straight from the farm",
      "bravologix-com-mx": "Logistics and freight",
      "verticlean-com-mx": "Professional cleaning",
      "distribuidorajemar-com": "Supply distribution",
      "gruposum-com": "Experiences that connect teams",
      "grupocosma-com": "Construction and services",
      "koi-arquitectura-vercel-app": "Architecture",
      "repissa-vercel-app": "Brand and website",
      "nezga-arquitectos-vercel-app": "Architecture and construction",
      "epiko-vercel-app": "Event production",
      "element-experiences-com": "Experiences and events",
    },
    caseLabels: {
      problem: "Problem",
      decision: "Decision",
      result: "Outcome",
    },
    cases: {
      "koi-arquitectura-vercel-app": {
        problem:
          "Translate needs and ways of living into spaces without reducing the architecture practice to a gallery.",
        decision:
          "Structure the story around listening, design, construction, and follow-up, using the project as evidence.",
        result:
          "A site that explains the process and the value of improving a space, then opens a direct path to contact.",
      },
      "element-experiences-com": {
        problem:
          "Bring open routes, private experiences, and corporate services together without diluting the brand's purpose.",
        decision:
          "Separate the offer by experience type and support it with dates, difficulty levels, and clear booking or quote actions.",
        result:
          "A journey where each visitor can identify the right experience and reach the appropriate next step.",
      },
      "efficientplasticolors-com": {
        problem:
          "Explain a technical masterbatch and additives catalog while making color matching easier.",
        decision:
          "Turn color into an interactive tool with Pantone® matching, product families, and a direct quote path.",
        result:
          "Visitors can explore shades and products and submit a WhatsApp request within the same flow.",
      },
      "nkmohcafe-com": {
        problem:
          "Tell the story of the Zongolica origin while presenting specialty coffee and solutions for businesses.",
        decision:
          "Combine the origin story, service profiles, and product details with clear paths to request a quote.",
        result:
          "The site distinguishes specialty coffee, commercial coffee, and custom grinding, then guides visitors toward an order.",
      },
    },
  },
  world: {
    eyebrow: "Reach",
    title: "Where we've worked",
    subtitle: "Projects for clients in Mexico, Spain, and France. We design without borders.",
    dragHint: "Drag the globe to spin it",
  },
  clients: {
    label: "Brands that have trusted us",
  },
  configurator: {
    eyebrow: "Configurator",
    title: "Build your site and pay online",
    subtitle: "Pick your package, add the modules you need, and pay by card, Mercado Pago, or transfer. No surprises.",
    step1: "1. Choose your package",
    plans: {
      full: {
        name: "Web Development",
        desc: "Your custom professional site, fast and built to sell.",
      },
      update: {
        name: "Refresh",
        desc: "Renew your current site with real design and performance.",
      },
      maintenance: {
        name: "Maintenance",
        desc: "Your site always up to date, secure, and backed up. Per month.",
      },
    },
    step2: "2. Extra modules",
    modules: {
      ecommerce: "E-commerce / online store",
      payments: "Payment gateway",
      maintenance: "Specialized maintenance",
    },
    extraSections: "Additional sections",
    perUnit: "each",
    removeSection: "Remove section",
    addSection: "Add section",
    step3: "3. Payment mode",
    paymentFull: "Full payment (100%)",
    paymentAdvance: "Deposit (50%)",
    currencyLabel: "Currency",
    currencyNote: (rate: string) =>
      `Rounded conversion at approx. ${rate} MXN per USD. If Mercado Pago doesn't support USD, the MXN equivalent is charged.`,
    couponLabel: "Coupon",
    couponPlaceholder: "E.g. BRYANF10",
    apply: "Apply",
    couponNoneEntered: "",
    couponNoneActive: "No active coupons right now. Check our socials or ask Lumina.",
    summary: "Your summary",
    totalProject: "Project total",
    payNow: "Due now",
    payStripe: "Pay by card (Stripe)",
    payMercadoPago: "Pay with Mercado Pago",
    payTransfer: "Pay by bank transfer",
    additionalSectionsLabel: (n) => `Additional sections x${n}`,
    opening: (label) => `Opening ${label}…`,
    openFailed: (reason) => `Couldn't open payment (${reason}). Try a transfer or message us on WhatsApp.`,
    openedInTab: (label) => `${label} opened in another tab. Complete your payment to continue.`,
    noPaymentLink: "No payment link was received. Please try again.",
    connectionError: "Connection error. Try again or use WhatsApp.",
    transferInstructions: (amount) => `Transfer ${amount} and send us your receipt.`,
    bank: {
      banco: "Bank",
      titular: "Account holder",
      cuenta: "Account",
      clabe: "CLABE",
      swift: "SWIFT",
    },
    copyLabel: (label) => `Copy ${label}`,
    sendWhatsapp: "Send receipt via WhatsApp",
    sendEmail: "Send receipt via email",
    securePaymentPrefix: "Secure payment. By continuing you accept our",
    terms: "Terms",
    and: "and",
    privacyNotice: "Privacy Notice",
    whatsappTransferMsg: ({ plan, modules, mode, total, payNow }) =>
      `Hi, I'd like to pay for my project by bank transfer.\n\nPlan: ${plan}\nModules: ${modules}\nMode: ${mode}\nProject total: ${total}\nDue now: ${payNow}`,
    modeFullLabel: "Full payment",
    modeAdvanceLabel: "50% deposit",
    none: "none",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "What you need to know",
    subtitle: "Tap a question to see the answer.",
    items: [
      {
        title: "What are your delivery times?",
        content: "Delivery starts at 3 days once you've given us your business's complete information.",
      },
      {
        title: "How many revisions can I ask for?",
        content:
          "At BryanF Design we don't cap revisions. Your full satisfaction matters more than a number, so we deliver a product you're happy with.",
      },
      {
        title: "What are your business hours?",
        content: "Monday to Friday, 9:00 AM to 7:00 PM, Mexico City time (CDMX).",
      },
      {
        title: "What does it cost?",
        content: "Pricing starts at $3,500 MXN and can vary depending on your project's specific needs.",
      },
      {
        title: "What do I need to get started?",
        content:
          "General information about your business, a short call to gather key requirements, and a 50% deposit. The remaining 50% is due once the project is delivered and approved.",
      },
      {
        title: "What do I get at the end?",
        content:
          "Full access to your website and email accounts (if created), plus a short training session — no more than 30 minutes — on the basics of managing your site.",
      },
      {
        title: "What's included when we work together?",
        content:
          "Free domain and hosting for a year, unlimited email accounts (1 GB each), a fully custom design, and a final product we guarantee you'll be happy with.",
      },
    ],
    notFound: "Didn't find your answer? Message us and let's talk it through.",
    sendWhatsapp: "Message us on WhatsApp",
  },
  closingCta: {
    title: "Ready for your brand to look like what it's worth?",
    subtitle: "Build your site, choose how to pay (card, Mercado Pago, or transfer), and let's get started. Projects from $3,500 MXN.",
    ctaPrimary: "Build your site",
    ctaSecondary: "WhatsApp us directly",
  },
  about: {
    eyebrow: "Design with authorship",
    title: "I'm Bryan. I design with intent and build things that work.",
    subtitle:
      "I design and develop every site from end to end. No agency or middlemen: you work with me from the first idea to launch.",
    role: "Designer & developer",
    photoAlt: "Bryan designing and developing at his desk",
    inspirationLabel: "What I bring to the work",
    inspiration:
      "I'm inspired by high-performance cars—my favorite is the 2016 Honda Civic Type R—Japanese visual culture and the logic of a well-built network. I don't paste them on as decoration: I translate them into precision, rhythm and connection.",
    chips: ["Design + code", "Direct contact", "Performance with purpose"],
    principlesLabel: "How I work · precision, rhythm and connection",
    principles: [
      {
        title: "Precision",
        body: "Every element has a reason.",
        detail: "Hierarchy · accessibility · detail",
      },
      {
        title: "Rhythm",
        body: "An experience should feel fast before you measure it.",
        detail: "Performance · motion · response",
      },
      {
        title: "Connection",
        body: "Design, code, SEO and business work as one system.",
        detail: "From first click to contact",
      },
    ],
    ctaPrimary: "Let's work together",
    ctaSecondary: "See my process",
    quote: "Every site you see here came out of this desk.",
  },
  garage: {
    eyebrow: "Design with authorship",
    title: "Precision, rhythm and connection.",
    subtitle:
      "My influences become concrete decisions across design, code and business.",
    verticalJp: "速さと精度",
    verticalRomaji: "seido · nagare · tsunagari",
    hint: "One route, from idea to outcome",
    spec: {
      modelLabel: "Principle",
      model: "Precision",
      codeLabel: "Experience",
      code: "Rhythm",
      colorLabel: "System",
      color: "Connection",
      engineLabel: "Craft",
      engine: "Design + code",
    },
    cards: [
      {
        index: "01",
        jp: "精度",
        romaji: "seido",
        title: "Every element has a reason.",
        body:
          "Hierarchy, accessibility and every detail come from a deliberate decision.",
        spec: "Precision · intent",
      },
      {
        index: "02",
        jp: "流れ",
        romaji: "nagare",
        title: "Speed is something you feel.",
        body:
          "Content, motion and response keep a clear pace before and after performance is measured.",
        spec: "Rhythm · performance",
      },
      {
        index: "03",
        jp: "繋",
        romaji: "tsunagari",
        title: "Everything works as a system.",
        body:
          "Design, code, SEO and business connect the first click to a useful action.",
        spec: "Connection · outcome",
      },
    ],
  },
  luminaSection: {
    eyebrow: "Your AI advisor",
    titlePrefix: "Meet",
    subtitle:
      "Lumina lives on this site and knows everything we do: pricing, timelines, modules, and process. Ask her anything — she answers instantly, any time, and helps you spec out your site.",
    cta: "Chat with Lumina",
    status: "Online 24/7",
    hint: "Tap her to change her mood · drag to spin her around",
    moods: {
      normal: "Normal mode",
      enfocada: "Focused mode",
      duda: "Curious mode",
      sorprendida: "Surprised mode",
    },
    phrases: [
      "Want a quote in 2 minutes?",
      "Ask me about pricing and timelines…",
      "I can build your ideal package.",
      "Online store? I know about that too.",
    ],
  },
  footer: {
    tagline: "Design that sells",
    taglineRest: ", not just looks good. Fast, animated, custom-built sites, from Mexico.",
    navLabel: "Navigation",
    servicesLabel: "Services",
    legalLabel: "Legal & contact",
    privacy: "Privacy Notice",
    terms: "Terms and Conditions",
    reviewGoogle: "Leave us a review on Google Maps",
    clientQuestion: "Already a client?",
    signatureLabel: "Bryan F.'s signature",
    copyright: (year) => `© ${year} BryanF Design · Made in Mexico`,
    acceptPrefix: "By contacting us you accept our",
    and: "and",
    services: {
      desarrolloWeb: "Web development",
      disenoWeb: "Web design",
      uxUi: "UX/UI",
      paginasNegocios: "Sites for businesses",
      softwareMedida: "Custom software",
      mantenimientoWeb: "Website maintenance",
    },
  },
  lumina: {
    name: "Lumina",
    greeting:
      "Hi! I'm <strong>Lumina</strong>, your advisor at BryanF Design.<br>Need help with pricing, timelines, or building your site?",
    quick: ["How much does a website cost?", "How long does delivery take?", "I want to build my site"],
    online: "AI advisor · online",
    offline: "Offline",
    thinking: "Thinking…",
    placeholder: "Type your message…",
    close: "Close",
    send: "Send",
    open: "Open chat with Lumina",
    teaser: "Looking to build your site? Ask me about pricing, timelines, or where to start ✨",
    typing: "Typing…",
    languageInstruction: "English",
    errorFallback:
      "I can't reply right now, but message us on <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a> and we'll help right away.",
    misunderstood: "Sorry, I didn't get that. Want to try again?",
    connectionError:
      "We had a connection issue. Message us on <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
  },
  languageNotice: {
    text: "We detect your language automatically and save your choice in a cookie so it's remembered across the site. You can change it anytime.",
    dismiss: "Got it",
  },
  languageSwitcher: {
    label: "Language",
  },
};

export default en;

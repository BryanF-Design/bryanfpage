import type { CvDict } from "./es";

const fr: CvDict = {
  langName: "Français",
  ui: {
    pressStart: "Appuie sur Start",
    startHint: "Entrée pour commencer · flèches pour naviguer",
    dragHint: "Déplace les apps · Entrée pour commencer",
    readMore: "Tout lire",
    skipIntro: "Aller directement au CV",
    next: "Suivant",
    prev: "Précédent",
    finish: "Terminer la visite",
    restart: "Rejouer",
    level: "Niveau",
    levelSelect: "Choisis un niveau",
    keysHint: "← → pour changer de niveau · 1–6 pour sauter",
    language: "Langue",
    print: "Enregistrer en PDF",
    visit: "Visiter",
    close: "Fermer",
    player: "Joueur 1",
    playerClass: "Classe",
    playerClassValue: "Tech Lead · Architecte web",
    guild: "Guilde",
    base: "Base",
    baseValue: "État de Mexico · Mobilité possible",
    status: "Statut",
    statusValue: "Disponible pour de nouvelles quêtes",
    xp: "Expérience",
    xpValue: "Depuis {year}",
    languages: "Langues",
    loading: "Chargement du monde…",
    guideOn: "Visite avec Lumina",
    muteGuide: "Masquer Lumina",
    showGuide: "Afficher Lumina",
    today: "auj.",
  },
  levels: {
    perfil: { name: "Profil", tag: "Joueur" },
    misiones: { name: "Quêtes", tag: "Expérience" },
    inventario: { name: "Inventaire", tag: "Stack" },
    logros: { name: "Trophées", tag: "Projets" },
    academia: { name: "Académie", tag: "Formation" },
    contacto: { name: "Continuer", tag: "Contact" },
  },
  start: {
    welcome: "Bienvenue dans mon",
    script: "Curriculum",
    block: "VITAE.",
    edition: "Édition 2026",
    role: "Responsable développement web et applications",
  },
  profile: {
    eyebrow: "Fiche du joueur",
    title: "Développement, architecture et opérations en un seul joueur.",
    summary:
      "Professionnel du développement web, de l'architecture de solutions numériques et des opérations technologiques. Plus de deux ans à la tête du développement et de la coordination opérationnelle des projets chez Partum Design, avec des fonctions techniques et de gestion chez Indusecc. J'associe développement Full-Stack, apps et plateformes, UX/UI, infrastructure web, DNS, hébergement et e-mail à la direction d'équipes, aux tournages, au service client et à la résolution d'incidents critiques.",
    classesTitle: "Classes débloquées",
    classes: [
      "Tech Architect",
      "Operations Manager",
      "Full-Stack Developer",
      "UX/UI Designer",
      "Réalisation audiovisuelle",
      "Customer Service",
      "Intégration d'IA"
    ],
    powersTitle: "Compétences spéciales",
    powers: [
      { title: "Développement", desc: "Je transforme les besoins métier en interfaces, sites et expériences web fonctionnels." },
      { title: "Architecture", desc: "Je choisis plateformes, structure du projet, intégrations et stratégie de déploiement selon le périmètre." },
      { title: "Opérations et leadership", desc: "Je dirige des équipes et plusieurs projets et clients à la fois : priorités, responsables, livraisons et qualité." },
      { title: "Apps et plateformes", desc: "Je crée et fais évoluer des produits avec réservations, comptes, catalogues et outils opérationnels." },
      { title: "Production audiovisuelle", desc: "Je coordonne les tournages : planning, équipe, revue des rushs et livraison." },
      { title: "Infrastructure", desc: "Je diagnostique et résous DNS, hébergement, mise en ligne, e-mail pro, SSL et migrations." },
      { title: "Client et business", desc: "Je cadre le périmètre, explique les choix techniques et accompagne chaque mise en œuvre." },
      { title: "Design", desc: "J'unis identité visuelle, ergonomie, responsive et résultats business." },
    ],
    studioLabel: "projets numériques portés par le studio BryanF Design depuis 2020",
    marketsLabel: "Mexique · Espagne · France",
  },
  quests: {
    eyebrow: "Journal de quêtes",
    title: "Expérience professionnelle",
    kinds: {
      main: "Quête principale",
      side: "Quête parallèle",
      guild: "Guilde personnelle",
      past: "Quête terminée",
    },
    concurrent: "En parallèle de Partum",
    noDate: "Dates à confirmer",
    scope: "Périmètre",
    techTitle: "Technique",
    opsTitle: "Opérations et direction",
    loot: "Butin de compétences",
    earlier: "Quêtes précédentes",
    items: {
      partum: {
        role: "Responsable Développement Web · Tech Architect · Operations Manager",
        scope:
          "Responsabilité transversale du développement et des opérations : du recueil des besoins et de l'architecture jusqu'à la production, la maintenance et le suivi.",
        tech: [
          "Je dirige le pôle développement et les choix de technologie, de structure et de maintenance.",
          "Expériences web responsive avec HTML, CSS, JavaScript, React, Next.js et Tailwind CSS.",
          "Workflows et déploiements avec Git/GitHub, Vercel et hébergement ; domaines, DNS, e-mail, SSL et migrations.",
          "Je traite les sites en panne, les e-mails qui n'arrivent plus, le DNS mal configuré et les restaurations (Plesk/IONOS).",
          "Intégrations avec API, formulaires, webhooks et automatisations n8n.",
        ],
        ops: [
          "Je dirige des équipes de développement, design, marketing, production audiovisuelle et support.",
          "Je gère plusieurs clients et projets à la fois : diagnostic, développement, tournage, revue, mise en ligne et support.",
          "Je coordonne et réalise des tournages pour les clients, de la planification à la validation.",
          "Je traduis les demandes clients en tâches techniques, contrôle la qualité et gère les mises en production.",
        ],
        loot: ["Next.js", "React", "Vercel", "DNS", "n8n", "Plesk", "Leadership", "QA"],
      },
      indusecc: {
        role: "Tech Architect · Operations Manager",
        scope:
          "Architecture technique, coordination du développement et support opérationnel de l'environnement numérique d'un cabinet de conseil ISO, de formation et d'amélioration continue.",
        tech: [
          "Architecture et maintenance des solutions numériques de l'entreprise.",
          "Suivi du développement web, des changements techniques, des intégrations et de la disponibilité.",
          "Domaines, hébergement, DNS, e-mail et services numériques des projets confiés.",
        ],
        ops: [
          "Je planifie les activités, fixe les priorités et supervise les livrables de projets simultanés.",
          "Je coordonne la communication entre responsables techniques, administration et direction.",
          "Je standardise les procédures et rends visible l'état de chaque projet.",
        ],
        loot: ["Architecture", "Infrastructure", "Processus", "Coordination"],
      },
      bryanf: {
        role: "Fondateur · Full-Stack · UX/UI · Consultant digital",
        scope:
          "Mon studio indépendant : j'accompagne les entreprises du diagnostic au lancement et à l'évolution de leurs plateformes.",
        tech: [
          "Je conçois, développe et maintiens des applications web et plateformes : utilisateurs, réservations, catalogues et demandes.",
          "Sites corporate, landing pages, boutiques en ligne et solutions sur mesure.",
          "Paiements, formulaires, automatisations, analytics, déploiements, domaines et DNS.",
        ],
        ops: [
          "Relation directe avec les clients : réunions, périmètre, priorités et suivi après lancement.",
          "Propositions, devis, documentation et identité visuelle de chaque projet.",
        ],
        loot: ["Next.js", "Stripe", "Three.js", "Figma", "Vente", "Produit"],
      },
      teleperformance: {
        role: "Manager des opérations pour Boost Mobile · Customer Service",
        scope: "Service et expérience client sur un compte télécoms.",
        tech: [
          "Supervision des activités de service client et suivi des procédures qualité.",
          "Traitement et escalade des incidents, résolution de conflits dans des situations exigeantes.",
        ],
        ops: [
          "Coordination d'équipes, organisation du personnel et priorités opérationnelles.",
          "Communication professionnelle en anglais et en espagnol.",
        ],
        loot: ["Customer Service", "Leadership", "Anglais", "Escalade"],
      },
      hermanmiller: {
        role: "Graphiste",
        scope: "Supports visuels pour campagnes internes et externes, et appui sur des projets UX/UI.",
        tech: [
          "Supports graphiques cohérents avec la marque.",
          "Participation à des projets de design d'interface et d'expérience utilisateur.",
        ],
        ops: ["Collaboration avec d'autres services pour la cohérence visuelle et l'ergonomie."],
        loot: ["Design", "UX/UI", "Marque"],
      },
      ocadeoro: {
        role: "Community Manager · Marketing digital",
        scope: "Réseaux sociaux, contenu et communauté d'une équipe d'e-sport.",
        tech: ["Stratégies de contenu et de communauté.", "Suivi des indicateurs et ajustement des campagnes."],
        ops: [],
        loot: ["Contenu", "Indicateurs"],
      },
      cero: {
        role: "Graphiste et créatif",
        scope: "Couvertures de livres et identité visuelle pour auteurs et créateurs de contenu.",
        tech: ["Conception et création de couvertures de livres."],
        ops: [],
        loot: ["Édition", "Identité"],
      },
      itaca: {
        role: "Ventes et service client",
        scope: "Vente de services éducatifs avec support et suivi téléphonique.",
        tech: [],
        ops: [],
        loot: ["Ventes"],
      },
      moslo: {
        role: "Ventes et service client",
        scope: "Accueil téléphonique, gestion commerciale et suivi des clients.",
        tech: [],
        ops: [],
        loot: ["Ventes"],
      },
    },
  },
  inventory: {
    eyebrow: "Inventaire",
    title: "Équipement et outils",
    hint: "Touche un objet pour voir sa fiche.",
    slots: {
      front: "Front-end et web",
      ai: "Intelligence artificielle",
      infra: "Infrastructure",
      auto: "Automatisation",
      design: "Design et vidéo",
      lead: "Leadership",
    },
    tiers: { core: "Équipement principal", extra: "Équipement supplémentaire" },
    leadNames: {
      teams: "Direction d'équipes",
      multi: "Projets simultanés",
      clients: "Gestion multi-clients",
      qa: "QA et validation",
      incidents: "Gestion des incidents",
      docs: "Documentation technique",
      service: "Customer Service",
      video: "Direction de tournages",
    },
    aiNames: { prompts: "Ingénierie de prompts", aiApi: "IA par API", agents: "Agents IA" },
    autoNames: { forms: "Formulaires", notify: "Notifications" },
    infraNames: { mail: "E-mail professionnel" },
  },
  trophies: {
    eyebrow: "Salle des trophées",
    title: "Projets phares",
    credits: {
      own: "Marque propre",
      bryanf: "Portfolio BryanF Design",
      partum: "Développé par Partum Design",
    },
    items: {
      bryanf: {
        sector: "Design et développement web",
        desc: "Ma plateforme : portfolio, services, configurateur de forfaits, paiement en ligne et Lumina, l'assistante IA.",
      },
      cortmart: {
        sector: "App de réservation",
        desc: "Plateforme de rendez-vous et de fidélité : services et tarifs, barbier et créneau, comptes, carte à tampons QR et back-office.",
      },
      mcspine: {
        sector: "Technologie médicale",
        desc: "Catalogue d'implants rachidiens par zone anatomique, fiches produit et demande de devis.",
      },
      mixteca: {
        sector: "Agro-export",
        desc: "Présence numérique pour légumes et herbes aromatiques : entreprise, produits, atouts et contact.",
      },
      gecomex: {
        sector: "Logistique et commerce international",
        desc: "Site corporate pour services logistiques et dédouanement international.",
      },
      koi: {
        sector: "Architecture et intérieur",
        desc: "Expérience éditoriale : projets, processus créatif et récit visuel de la marque.",
      },
      partum: {
        sector: "Conseil technologique B2B",
        desc: "L'écosystème de services, logiciels, devis et propositions commerciales de l'agence.",
      },
    },
    more: "Autres quêtes sur la carte",
  },
  academy: {
    eyebrow: "Académie",
    title: "Formation",
    education: [
      { school: "Universidad Tecnológica de México (UNITEC)", degree: "Licence en Design numérique et Animation", period: "2023 –" },
      { school: "Tecnológico de Estudios Superiores de Ecatepec", degree: "Ingénierie des systèmes informatiques (études suivies)", period: "2018 – 2020" },
    ],
    coursesTitle: "Power-ups",
    courses: [
      { year: "2023", name: "Diplôme Adobe", org: "Travesía Educación" },
      { year: "2020", name: "Premiere Pro : le film en un clic", org: "Domestika" },
      { year: "2020", name: "After Effects : l'animation par l'imagination", org: "Domestika" },
      { year: "2020", name: "Illustrator : l'art vectoriel", org: "Crehana" },
      { year: "2019", name: "Le marketing à l'ère numérique", org: "Fondation Google" },
      { year: "2018", name: "Développement d'applications mobiles", org: "Fondation Google" },
      { year: "2018", name: "Fondamentaux des réseaux sans fil", org: "" },
      { year: "2012", name: "Technicien en informatique", org: "CCPM" },
    ],
    languagesTitle: "Langues",
    languages: [
      { name: "Espagnol", level: "Langue maternelle" },
      { name: "Anglais", level: "Avancé" },
    ],
  },
  contact: {
    eyebrow: "Continuer ?",
    thank: "MERCI",
    script: "d'avoir joué",
    text: "Si votre équipe cherche du leadership technique, un œil de designer et une vraie capacité d'exécution, parlons-en.",
    whatsapp: "WhatsApp",
    email: "E-mail",
    website: "Portfolio",
    vcard: "Enregistrer le contact",
    print: "CV en PDF",
    roles: "Postes recherchés",
    rolesList: [
      "Responsable Développement Web",
      "Technical Operations Manager",
      "Web Solutions Architect",
      "Full-Stack · React / Next.js",
    ],
  },
  lumina: {
    name: "Lumina",
    role: "Ta guide",
    detected: "J'ai détecté ta langue : {lang}. Tu peux la changer en haut à tout moment.",
    lines: {
      perfil:
        "Salut ! Je suis Lumina et je vais te guider dans le CV de Bryan. Voici sa fiche : un joueur qui développe, conçoit l'architecture et dirige aussi les opérations.",
      misiones:
        "Voici ses quêtes. La principale : deux ans à la tête du développement et des opérations chez Partum Design, en parallèle d'Indusecc. Touche chacune pour les détails.",
      inventario:
        "Regarde tout l'équipement qu'il porte ! React, Next.js, Vercel, DNS, n8n, Adobe… et des compétences de leadership. Touche un objet. Il utilise, pilote et programme aussi l'IA : Claude, ChatGPT, Gemini, Grok et Perplexity.",
      logros:
        "La salle des trophées : apps de réservation, catalogues médicaux, sites corporate et sa propre plateforme. Chaque logo est le logo officiel.",
      academia:
        "Tu savais qu'il a commencé en informatique et qu'il étudie aujourd'hui le Design numérique et l'Animation ? C'est pour ça qu'il marie code et design.",
      contacto:
        "Fin de la visite ! Si Bryan correspond à ton équipe, écris-lui sur WhatsApp ou par e-mail. Tu peux aussi enregistrer le CV en PDF.",
    },
  },
  meta: {
    title: "Bryan F. · CV interactif | Responsable Développement Web",
    description:
      "CV interactif de Bryan Fernando López : responsable développement web et applications, Tech Architect et Operations Manager. Parcours-le comme un jeu vidéo avec Lumina.",
  },
};

export default fr;

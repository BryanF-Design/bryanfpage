import type { Dictionary } from "./es";

const fr: Dictionary = {
  nav: {
    inicio: "Accueil",
    proceso: "Processus",
    proyectos: "Projets",
    precios: "Tarifs",
    faq: "FAQ",
    cliente: "Déjà client ?",
    armaTuWeb: "Créer mon site",
    verProyectos: "Voir les projets",
  },
  hero: {
    eyebrow: "Design et développement web au Mexique",
    titlePrefix: "Fais-le",
    titleHighlight: "vraiment.",
    subtitle:
      "Nous créons votre site sur mesure : rapide, animé et pensé pour convertir. Stratégie, performance et SEO réels pour un site qui a de l'allure et qui vend.",
    scrollHint: "Faites défiler pour ouvrir le laptop",
  },
  trust: {
    years: "ans",
    yearsCaption: "d'expérience",
    projects: "projets",
    projectsCaption: "menés avec succès",
    deliveryPrefix: "Dès",
    days: "jours",
    deliveryCaption: "ouvrés de livraison",
  },
  process: {
    eyebrow: "Comment on travaille",
    title: "Un processus clair, de l'idée au lancement",
    subtitle: "Sans blabla : livraison dès 3 jours ouvrés, avec suivi après le lancement.",
    steps: [
      {
        title: "Devis",
        content: "On vous partage une proposition claire : périmètre, délais et prix. Sans petites lignes.",
      },
      {
        title: "Brief",
        content: "On comprend votre activité, vos objectifs et à qui vous vous adressez. On définit stratégie et contenu.",
      },
      {
        title: "Développement",
        content: "Design UX/UI et code rapide et propre : responsive, animé et optimisé pour les Core Web Vitals.",
      },
      {
        title: "Lancement",
        content: "SEO technique, mise en ligne et suivi. Votre site est prêt à vendre dès le premier jour.",
      },
      {
        title: "Suivi",
        content:
          "1 mois de suivi après la livraison et accès à Access BryanF, votre tableau de bord technique, pour garantir le bon fonctionnement du site.",
      },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "Les technologies que j'utilise",
    subtitle:
      "Des frameworks et outils modernes pour construire : rapide, évolutif et sur mesure. La technologie au service de l'idée, jamais l'inverse.",
    ctaPrimary: "Voir les projets",
    ctaSecondary: "Travaillons ensemble",
  },
  projects: {
    eyebrow: "Portfolio",
    titlePrefix: "Des sites qui",
    rotatingWords: ["vendent", "convertissent", "connectent", "se démarquent"],
    subtitle: "Des sites qui font une vraie différence pour chaque client. Chacun conçu et construit sur mesure. Touchez-en un pour le visiter.",
    visitSite: "Visiter le site",
    showMore: "Voir plus de projets",
    descs: {
      "goldenrepublic-com-mx": "Immobilier",
      "serviciosecem-com-mx": "Conseil comptable et fiscal",
      "industriastritton-com": "Mélange et broyage industriel",
      "nkmohcafe-com": "Café de spécialité",
      "playerapublimax-com": "T-shirts personnalisés",
      "proshieldmexico-com": "Protection du patrimoine",
      "homeflowoficial-com": "Plateforme numérique",
      "prefabricadosmx-com": "Préfabriqués en béton",
      "efficientplasticolors-com": "Concentrés de couleur pour plastique",
      "ndt360-com-mx": "Contrôles non destructifs",
      "kafi-com-mx": "Espaces de travail",
      "mielyabejas-mx": "Miel artisanal, directement de la ferme",
      "bravologix-com-mx": "Logistique et transport",
      "verticlean-com-mx": "Nettoyage professionnel",
      "distribuidorajemar-com": "Distribution de fournitures",
      "gruposum-com": "Des expériences qui rassemblent les équipes",
      "grupocosma-com": "Construction et services",
      "koi-arquitectura-vercel-app": "Architecture",
      "repissa-vercel-app": "Marque et site web",
      "nezga-arquitectos-vercel-app": "Architecture et construction",
      "epiko-vercel-app": "Production d'événements",
      "element-experiences-com": "Expériences et événements",
    },
  },
  world: {
    eyebrow: "Présence",
    title: "Où nous avons travaillé",
    subtitle: "Des projets pour des clients au Mexique, en Espagne et en France. On conçoit sans frontières.",
    dragHint: "Faites glisser le globe pour le faire tourner",
  },
  clients: {
    label: "Des marques qui nous ont fait confiance",
  },
  configurator: {
    eyebrow: "Configurateur",
    title: "Créez votre site et payez en ligne",
    subtitle: "Choisissez votre formule, ajoutez les modules dont vous avez besoin et payez par carte, Mercado Pago ou virement. Sans surprise.",
    step1: "1. Choisissez votre formule",
    plans: {
      full: {
        name: "Développement web",
        desc: "Votre site professionnel sur mesure, rapide et pensé pour vendre.",
      },
      update: {
        name: "Refonte",
        desc: "Modernisez votre site actuel avec un vrai design et de vraies performances.",
      },
      maintenance: {
        name: "Maintenance",
        desc: "Votre site toujours à jour, sécurisé et sauvegardé. Par mois.",
      },
    },
    step2: "2. Modules supplémentaires",
    modules: {
      ecommerce: "E-commerce / boutique en ligne",
      payments: "Passerelle de paiement",
      maintenance: "Maintenance spécialisée",
    },
    extraSections: "Sections supplémentaires",
    perUnit: "chacune",
    removeSection: "Retirer une section",
    addSection: "Ajouter une section",
    step3: "3. Mode de paiement",
    paymentFull: "Paiement complet (100 %)",
    paymentAdvance: "Acompte (50 %)",
    currencyLabel: "Devise",
    currencyNote: (rate: string) =>
      `Conversion arrondie à env. ${rate} MXN par USD. Si Mercado Pago n'accepte pas l'USD, l'équivalent en MXN est facturé.`,
    couponLabel: "Code promo",
    couponPlaceholder: "Ex. BRYANF10",
    apply: "Appliquer",
    couponNoneEntered: "",
    couponNoneActive: "Aucun code promo actif pour le moment. Consultez nos réseaux ou demandez à Lumina.",
    summary: "Votre résumé",
    totalProject: "Total du projet",
    payNow: "À payer maintenant",
    payStripe: "Payer par carte (Stripe)",
    payMercadoPago: "Payer avec Mercado Pago",
    payTransfer: "Payer par virement",
    additionalSectionsLabel: (n) => `Sections supplémentaires x${n}`,
    opening: (label) => `Ouverture de ${label}…`,
    openFailed: (reason) => `Impossible d'ouvrir le paiement (${reason}). Essayez un virement ou écrivez-nous sur WhatsApp.`,
    openedInTab: (label) => `${label} ouvert dans un autre onglet. Terminez votre paiement pour continuer.`,
    noPaymentLink: "Aucun lien de paiement reçu. Merci de réessayer.",
    connectionError: "Erreur de connexion. Réessayez ou utilisez WhatsApp.",
    transferInstructions: (amount) => `Virez ${amount} et envoyez-nous votre justificatif.`,
    bank: {
      banco: "Banque",
      titular: "Titulaire",
      cuenta: "Compte",
      clabe: "CLABE",
      swift: "SWIFT",
    },
    copyLabel: (label) => `Copier ${label}`,
    sendWhatsapp: "Envoyer le justificatif par WhatsApp",
    sendEmail: "Envoyer le justificatif par e-mail",
    securePaymentPrefix: "Paiement sécurisé. En continuant, vous acceptez nos",
    terms: "Conditions générales",
    and: "et",
    privacyNotice: "notre Politique de confidentialité",
    whatsappTransferMsg: ({ plan, modules, mode, total, payNow }) =>
      `Bonjour, je souhaite payer mon projet par virement.\n\nFormule : ${plan}\nModules : ${modules}\nMode : ${mode}\nTotal du projet : ${total}\nÀ payer maintenant : ${payNow}`,
    modeFullLabel: "Paiement complet",
    modeAdvanceLabel: "Acompte de 50 %",
    none: "aucun",
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Ce qu'il faut savoir",
    subtitle: "Touchez une question pour voir la réponse.",
    items: [
      {
        title: "Quels sont les délais de livraison ?",
        content: "La livraison démarre dès 3 jours une fois que vous nous avez transmis toutes les informations sur votre entreprise.",
      },
      {
        title: "Combien de modifications puis-je demander ?",
        content:
          "Chez BryanF Design, il n'y a pas de limite de modifications. Votre entière satisfaction compte plus qu'un chiffre, pour livrer un produit de qualité.",
      },
      {
        title: "Quels sont vos horaires ?",
        content: "Du lundi au vendredi, de 9h à 19h, heure de Mexico (CDMX).",
      },
      {
        title: "Quels sont les tarifs ?",
        content: "Les tarifs démarrent à 3 500 $ MXN et peuvent varier selon les besoins spécifiques de votre projet.",
      },
      {
        title: "Que faut-il pour démarrer ?",
        content:
          "Les informations générales de votre entreprise, un court appel pour recueillir les besoins essentiels, et un acompte de 50 %. Les 50 % restants sont réglés à la livraison et à l'approbation du projet.",
      },
      {
        title: "Que reçoit-on à la fin ?",
        content:
          "Un accès complet au site et aux e-mails (s'ils ont été créés), plus une courte formation, de 30 minutes maximum, pour gérer les bases de votre site.",
      },
      {
        title: "Que comprend une collaboration avec vous ?",
        content:
          "Domaine et hébergement gratuits pendant un an, e-mails illimités (1 Go chacun), un design entièrement personnalisé et la garantie d'un résultat final à la hauteur.",
      },
    ],
    notFound: "Vous n'avez pas trouvé votre réponse ? Écrivez-nous, on en discute.",
    sendWhatsapp: "Envoyer un WhatsApp",
  },
  closingCta: {
    title: "Prêt à ce que votre marque ait enfin l'allure qu'elle mérite ?",
    subtitle: "Créez votre site, choisissez comment payer (carte, Mercado Pago ou virement) et on démarre. Projets dès 3 500 $ MXN.",
    ctaPrimary: "Créer mon site",
    ctaSecondary: "WhatsApp direct",
  },
  about: {
    eyebrow: "Qui est derrière tout ça",
    title: "Je suis Bryan. Je conçois et je construis chaque site moi-même.",
    subtitle:
      "Pas d'agence entre nous, pas d'intermédiaires : vous me parlez, du premier message jusqu'au jour où votre site est en ligne. Mexique, horaires flexibles, café à volonté.",
  },
  footer: {
    tagline: "Un design qui vend",
    taglineRest: ", pas seulement qui a de l'allure. Des sites rapides, animés et sur mesure, depuis le Mexique.",
    navLabel: "Navigation",
    servicesLabel: "Services",
    legalLabel: "Mentions légales et contact",
    privacy: "Politique de confidentialité",
    terms: "Conditions générales",
    reviewGoogle: "Laissez-nous un avis sur Google Maps",
    clientQuestion: "Déjà client ?",
    copyright: (year) => `© ${year} BryanF Design · Fabriqué au Mexique`,
    acceptPrefix: "En nous contactant, vous acceptez notre",
    and: "et nos",
    services: {
      desarrolloWeb: "Développement web",
      disenoWeb: "Design web",
      uxUi: "UX/UI",
      paginasNegocios: "Sites pour entreprises",
      softwareMedida: "Logiciel sur mesure",
      mantenimientoWeb: "Maintenance de site",
    },
  },
  lumina: {
    name: "Lumina",
    greeting:
      "Bonjour ! Je suis <strong>Lumina</strong>, votre conseillère chez BryanF Design.<br>Je peux vous aider sur les tarifs, les délais ou la création de votre site ?",
    quick: ["Combien coûte un site web ?", "En combien de temps est-il livré ?", "Je veux créer mon site"],
    online: "Conseillère IA · en ligne",
    offline: "Hors ligne",
    thinking: "Réflexion en cours…",
    placeholder: "Écrivez votre message…",
    close: "Fermer",
    send: "Envoyer",
    open: "Ouvrir le chat avec Lumina",
    teaser: "Vous voulez créer votre site ? Demandez-moi les tarifs, les délais ou comment démarrer ✨",
    typing: "En train d'écrire…",
    languageInstruction: "français",
    errorFallback:
      "Je ne peux pas répondre pour l'instant, mais écrivez-nous sur <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>, on vous répond tout de suite.",
    misunderstood: "Désolée, je n'ai pas compris. On réessaie ?",
    connectionError:
      "Nous avons eu un problème de connexion. Écrivez-nous sur <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
  },
  languageNotice: {
    text: "Nous détectons votre langue automatiquement et enregistrons votre choix dans un cookie pour le mémoriser sur tout le site. Vous pouvez le changer à tout moment.",
    dismiss: "Compris",
  },
  languageSwitcher: {
    label: "Langue",
  },
};

export default fr;

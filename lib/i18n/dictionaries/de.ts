import type { Dictionary } from "./es";

const de: Dictionary = {
  nav: {
    inicio: "Start",
    proceso: "Ablauf",
    proyectos: "Projekte",
    precios: "Preise",
    faq: "FAQ",
    cliente: "Bereits Kunde?",
    armaTuWeb: "Website gestalten",
    verProyectos: "Projekte ansehen",
  },
  hero: {
    eyebrow: "Webdesign und -entwicklung in Mexiko",
    titlePrefix: "Mach es",
    titleHighlight: "wahr.",
    subtitle:
      "Wir bauen deine Website maßgeschneidert: schnell, animiert und auf Conversion ausgelegt. Echte Strategie, Performance und SEO, damit deine Seite großartig aussieht und verkauft.",
    scrollHint: "Scrollen, um den Laptop zu öffnen",
  },
  trust: {
    years: "Jahre",
    yearsCaption: "Erfahrung",
    projects: "Projekte",
    projectsCaption: "erfolgreich umgesetzt",
    deliveryPrefix: "Ab",
    days: "Werktagen",
    deliveryCaption: "bis zur Lieferung",
  },
  process: {
    eyebrow: "So arbeiten wir",
    title: "Ein klarer Ablauf, von der Idee bis zum Launch",
    subtitle: "Ohne Nebelkerzen: Lieferung ab 3 Werktagen, mit Betreuung nach dem Launch.",
    steps: [
      {
        title: "Angebot",
        content: "Wir teilen einen klaren Vorschlag: Umfang, Zeitplan und Preis. Ohne Kleingedrucktes.",
      },
      {
        title: "Briefing",
        content: "Wir verstehen dein Geschäft, deine Ziele und deine Zielgruppe. Wir legen Strategie und Inhalte fest.",
      },
      {
        title: "Entwicklung",
        content: "Schnelles, sauberes UX/UI-Design und Code: responsiv, animiert und auf Core Web Vitals optimiert.",
      },
      {
        title: "Launch",
        content: "Technisches SEO, Deployment und Tracking. Deine Seite ist ab Tag eins verkaufsbereit.",
      },
      {
        title: "Betreuung",
        content:
          "1 Monat Betreuung nach der Lieferung und Zugang zu Access BryanF, deinem technischen Dashboard, damit alles reibungslos läuft.",
      },
    ],
  },
  stack: {
    eyebrow: "Stack",
    title: "Die Technologien, mit denen ich arbeite",
    subtitle:
      "Moderne Frameworks und Tools, mit denen ich baue: schnell, skalierbar und maßgeschneidert. Technologie im Dienst der Idee, nicht umgekehrt.",
    ctaPrimary: "Projekte ansehen",
    ctaSecondary: "Lass uns zusammenarbeiten",
  },
  projects: {
    eyebrow: "Portfolio",
    titlePrefix: "Websites, die",
    rotatingWords: ["verkaufen", "konvertieren", "verbinden", "überzeugen"],
    subtitle: "Websites mit echter Wirkung für jeden Kunden. Jede maßgeschneidert entworfen und gebaut. Tippe auf eine, um sie zu besuchen.",
    visitSite: "Website besuchen",
    showMore: "Mehr Projekte anzeigen",
    descs: {
      "goldenrepublic-com-mx": "Immobilien",
      "serviciosecem-com-mx": "Steuer- und Buchhaltungsberatung",
      "industriastritton-com": "Industrielles Mischen und Mahlen",
      "nkmohcafe-com": "Spezialitätenkaffee",
      "playerapublimax-com": "Individuelle T-Shirts",
      "proshieldmexico-com": "Vermögensschutz",
      "homeflowoficial-com": "Digitale Plattform",
      "prefabricadosmx-com": "Betonfertigteile",
      "efficientplasticolors-com": "Farbkonzentrate für Kunststoff",
      "ndt360-com-mx": "Zerstörungsfreie Prüfung",
      "kafi-com-mx": "Arbeitsräume",
      "mielyabejas-mx": "Handwerklicher Honig, direkt vom Hof",
      "bravologix-com-mx": "Logistik und Transport",
      "verticlean-com-mx": "Professionelle Reinigung",
      "distribuidorajemar-com": "Vertrieb von Betriebsmitteln",
      "gruposum-com": "Erlebnisse, die Teams verbinden",
      "grupocosma-com": "Bau und Dienstleistungen",
      "koi-arquitectura-vercel-app": "Architektur",
      "repissa-vercel-app": "Marke und Website",
      "nezga-arquitectos-vercel-app": "Architektur und Bau",
      "epiko-vercel-app": "Eventproduktion",
      "element-experiences-com": "Erlebnisse und Events",
    },
  },
  world: {
    eyebrow: "Präsenz",
    title: "Wo wir gearbeitet haben",
    subtitle: "Projekte für Kunden in Mexiko, Spanien und Frankreich. Wir gestalten ohne Grenzen.",
    dragHint: "Ziehe den Globus, um ihn zu drehen",
  },
  clients: {
    label: "Marken, die uns vertraut haben",
  },
  configurator: {
    eyebrow: "Konfigurator",
    title: "Gestalte deine Website und bezahle online",
    subtitle: "Wähle dein Paket, ergänze die benötigten Module und bezahle per Karte, Mercado Pago oder Überweisung. Keine Überraschungen.",
    step1: "1. Wähle dein Paket",
    plans: {
      full: {
        name: "Webentwicklung",
        desc: "Deine maßgeschneiderte, professionelle Website – schnell und auf Verkauf ausgelegt.",
      },
      update: {
        name: "Auffrischung",
        desc: "Erneuere deine bestehende Website mit echtem Design und echter Performance.",
      },
      maintenance: {
        name: "Wartung",
        desc: "Deine Website immer aktuell, sicher und gesichert. Pro Monat.",
      },
    },
    step2: "2. Zusatzmodule",
    modules: {
      ecommerce: "E-Commerce / Onlineshop",
      payments: "Zahlungsgateway",
      maintenance: "Spezialisierte Wartung",
    },
    extraSections: "Zusätzliche Bereiche",
    perUnit: "je",
    removeSection: "Bereich entfernen",
    addSection: "Bereich hinzufügen",
    step3: "3. Zahlungsart",
    paymentFull: "Vollzahlung (100 %)",
    paymentAdvance: "Anzahlung (50 %)",
    currencyLabel: "Währung",
    currencyNote: (rate: string) =>
      `Gerundete Umrechnung, ca. ${rate} MXN pro USD. Falls Mercado Pago kein USD unterstützt, wird der MXN-Gegenwert berechnet.`,
    couponLabel: "Gutschein",
    couponPlaceholder: "z. B. BRYANF10",
    apply: "Anwenden",
    couponNoneEntered: "",
    couponNoneActive: "Derzeit sind keine Gutscheine aktiv. Schau auf unseren Social-Media-Kanälen vorbei oder frag Lumina.",
    summary: "Deine Zusammenfassung",
    totalProject: "Projekt gesamt",
    payNow: "Jetzt fällig",
    payStripe: "Mit Karte bezahlen (Stripe)",
    payMercadoPago: "Mit Mercado Pago bezahlen",
    payTransfer: "Per Überweisung bezahlen",
    additionalSectionsLabel: (n) => `Zusätzliche Bereiche x${n}`,
    opening: (label) => `${label} wird geöffnet …`,
    openFailed: (reason) => `Zahlung konnte nicht geöffnet werden (${reason}). Versuche es per Überweisung oder schreib uns auf WhatsApp.`,
    openedInTab: (label) => `${label} wurde in einem neuen Tab geöffnet. Schließe deine Zahlung ab, um fortzufahren.`,
    noPaymentLink: "Es wurde kein Zahlungslink empfangen. Bitte versuche es erneut.",
    connectionError: "Verbindungsfehler. Versuche es erneut oder nutze WhatsApp.",
    transferInstructions: (amount) => `Überweise ${amount} und sende uns deinen Beleg.`,
    bank: {
      banco: "Bank",
      titular: "Kontoinhaber",
      cuenta: "Konto",
      clabe: "CLABE",
      swift: "SWIFT",
    },
    copyLabel: (label) => `${label} kopieren`,
    sendWhatsapp: "Beleg per WhatsApp senden",
    sendEmail: "Beleg per E-Mail senden",
    securePaymentPrefix: "Sichere Zahlung. Mit dem Fortfahren akzeptierst du unsere",
    terms: "AGB",
    and: "und",
    privacyNotice: "Datenschutzerklärung",
    whatsappTransferMsg: ({ plan, modules, mode, total, payNow }) =>
      `Hallo, ich möchte mein Projekt per Überweisung bezahlen.\n\nPaket: ${plan}\nModule: ${modules}\nZahlungsart: ${mode}\nProjekt gesamt: ${total}\nJetzt fällig: ${payNow}`,
    modeFullLabel: "Vollzahlung",
    modeAdvanceLabel: "50 % Anzahlung",
    none: "keine",
  },
  faq: {
    eyebrow: "Häufig gestellte Fragen",
    title: "Was du wissen musst",
    subtitle: "Tippe auf eine Frage, um die Antwort zu sehen.",
    items: [
      {
        title: "Wie lange dauert die Lieferung?",
        content: "Die Lieferung beginnt ab 3 Tagen, sobald du uns alle Informationen zu deinem Unternehmen gegeben hast.",
      },
      {
        title: "Wie viele Änderungen kann ich anfragen?",
        content:
          "Bei BryanF Design gibt es kein Limit für Änderungswünsche. Deine vollständige Zufriedenheit ist am wichtigsten für ein Produkt in hoher Qualität.",
      },
      {
        title: "Wie sind eure Geschäftszeiten?",
        content: "Montag bis Freitag, 9:00 bis 19:00 Uhr, Ortszeit Mexiko-Stadt (CDMX).",
      },
      {
        title: "Was kostet es?",
        content: "Die Preise beginnen bei $3.500 MXN und können je nach den konkreten Anforderungen deines Projekts variieren.",
      },
      {
        title: "Was wird für den Start benötigt?",
        content:
          "Allgemeine Informationen zu deinem Unternehmen, ein kurzes Gespräch zur Klärung der wichtigsten Anforderungen und eine Anzahlung von 50 %. Die restlichen 50 % werden bei Lieferung und Abnahme des Projekts fällig.",
      },
      {
        title: "Was bekomme ich am Ende?",
        content:
          "Vollen Zugriff auf die Website und die E-Mail-Konten (falls erstellt) sowie eine kurze Einweisung von maximal 30 Minuten für die grundlegende Verwaltung deiner Website.",
      },
      {
        title: "Was ist bei der Zusammenarbeit inklusive?",
        content:
          "Kostenlose Domain und Hosting für ein Jahr, unbegrenzte E-Mail-Konten (je 1 GB), ein vollständig individuelles Design und die Garantie für ein Endprodukt, mit dem du zufrieden bist.",
      },
    ],
    notFound: "Deine Frage war nicht dabei? Schreib uns, wir klären es gemeinsam.",
    sendWhatsapp: "WhatsApp schreiben",
  },
  closingCta: {
    title: "Bereit, dass deine Marke so aussieht, wie sie es verdient?",
    subtitle: "Gestalte deine Website, wähle deine Zahlungsart (Karte, Mercado Pago oder Überweisung) und wir legen los. Projekte ab $3.500 MXN.",
    ctaPrimary: "Website gestalten",
    ctaSecondary: "Direkt per WhatsApp",
  },
  about: {
    eyebrow: "Wer dahintersteckt",
    title: "Ich bin Bryan. Ich entwerfe und baue jede Website selbst.",
    subtitle:
      "Keine Agentur dazwischen, keine Mittelsmänner: Du sprichst mit mir, von der ersten Nachricht bis zum Tag, an dem deine Website live geht. Mexiko, flexible Zeiten, reichlich Kaffee.",
  },
  footer: {
    tagline: "Design, das verkauft",
    taglineRest: ", nicht nur gut aussieht. Schnelle, animierte, maßgeschneiderte Websites, aus Mexiko.",
    navLabel: "Navigation",
    servicesLabel: "Leistungen",
    legalLabel: "Rechtliches & Kontakt",
    privacy: "Datenschutzerklärung",
    terms: "Allgemeine Geschäftsbedingungen",
    reviewGoogle: "Hinterlasse uns eine Bewertung auf Google Maps",
    clientQuestion: "Bereits Kunde?",
    copyright: (year) => `© ${year} BryanF Design · Made in Mexiko`,
    acceptPrefix: "Wenn du uns kontaktierst, akzeptierst du unsere",
    and: "und",
    services: {
      desarrolloWeb: "Webentwicklung",
      disenoWeb: "Webdesign",
      uxUi: "UX/UI",
      paginasNegocios: "Websites für Unternehmen",
      softwareMedida: "Individuelle Software",
      mantenimientoWeb: "Website-Wartung",
    },
  },
  lumina: {
    name: "Lumina",
    greeting:
      "Hallo! Ich bin <strong>Lumina</strong>, deine Beraterin bei BryanF Design.<br>Kann ich mit Preisen, Zeitplänen oder deiner Website helfen?",
    quick: ["Was kostet eine Website?", "Wie lange dauert die Lieferung?", "Ich möchte meine Website gestalten"],
    online: "KI-Beraterin · online",
    offline: "Offline",
    thinking: "Denkt nach …",
    placeholder: "Schreib deine Nachricht …",
    close: "Schließen",
    send: "Senden",
    open: "Chat mit Lumina öffnen",
    teaser: "Willst du eine Website erstellen? Frag mich nach Preisen, Zeitplänen oder wie wir starten ✨",
    typing: "Tippt …",
    languageInstruction: "Deutsch",
    errorFallback:
      "Ich kann gerade nicht antworten, aber schreib uns auf <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a> — wir helfen dir sofort weiter.",
    misunderstood: "Entschuldige, das habe ich nicht verstanden. Nochmal versuchen?",
    connectionError:
      "Es gab ein Verbindungsproblem. Schreib uns auf <a href='https://wa.me/525663012505' target='_blank'>WhatsApp</a>.",
  },
  languageNotice: {
    text: "Wir erkennen deine Sprache automatisch und speichern deine Wahl in einem Cookie, damit sie auf der ganzen Seite erhalten bleibt. Du kannst sie jederzeit ändern.",
    dismiss: "Verstanden",
  },
  languageSwitcher: {
    label: "Sprache",
  },
};

export default de;

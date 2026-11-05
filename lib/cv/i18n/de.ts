import type { CvDict } from "./es";

const de: CvDict = {
  langName: "Deutsch",
  ui: {
    pressStart: "Start drücken",
    startHint: "Enter zum Starten · Pfeiltasten zum Navigieren",
    skipIntro: "Direkt zum Lebenslauf",
    next: "Weiter",
    prev: "Zurück",
    finish: "Tour beenden",
    restart: "Noch einmal",
    level: "Level",
    levelSelect: "Level wählen",
    keysHint: "← → Level wechseln · 1–6 springen",
    language: "Sprache",
    print: "Als PDF speichern",
    visit: "Besuchen",
    close: "Schließen",
    player: "Spieler 1",
    playerClass: "Klasse",
    playerClassValue: "Tech Lead · Web-Architekt",
    guild: "Gilde",
    base: "Basis",
    baseValue: "Bundesstaat Mexiko · Umzugsbereit",
    status: "Status",
    statusValue: "Bereit für neue Quests",
    xp: "Erfahrung",
    xpValue: "Seit {year}",
    languages: "Sprachen",
    loading: "Welt wird geladen…",
    guideOn: "Luminas Tour",
    muteGuide: "Lumina ausblenden",
    showGuide: "Lumina einblenden",
    today: "heute",
  },
  levels: {
    perfil: { name: "Profil", tag: "Spieler" },
    misiones: { name: "Quests", tag: "Erfahrung" },
    inventario: { name: "Inventar", tag: "Stack" },
    logros: { name: "Trophäen", tag: "Projekte" },
    academia: { name: "Akademie", tag: "Ausbildung" },
    contacto: { name: "Weiter", tag: "Kontakt" },
  },
  start: {
    welcome: "Willkommen in meinem",
    script: "Curriculum",
    block: "VITAE.",
    edition: "Ausgabe 2026",
    role: "Leiter Web- & App-Entwicklung",
  },
  profile: {
    eyebrow: "Spielerkarte",
    title: "Entwicklung, Architektur und Betrieb in einem Spieler.",
    summary:
      "Spezialist für Webentwicklung, Architektur digitaler Lösungen und Technologiebetrieb. Über zwei Jahre Leitung des Entwicklungsbereichs und der operativen Projektkoordination bei Partum Design, dazu technische und Managementaufgaben bei Indusecc. Ich verbinde Full-Stack-Entwicklung, Apps und Plattformen, UX/UI, Web-Infrastruktur, DNS, Hosting und E-Mail mit Teamführung, Videoproduktion, Kundenservice und der Lösung kritischer Störungen.",
    classesTitle: "Freigeschaltete Klassen",
    classes: [
      "Tech Architect",
      "Operations Manager",
      "Full-Stack Developer",
      "UX/UI Designer",
      "Videoproduktion",
      "Customer Service",
    ],
    powersTitle: "Spezialfähigkeiten",
    powers: [
      { title: "Entwicklung", desc: "Ich mache aus Geschäftsanforderungen funktionierende Interfaces, Websites und Web-Erlebnisse." },
      { title: "Architektur", desc: "Ich wähle Plattformen, Projektstruktur, Integrationen und Deployment-Strategie passend zum Umfang." },
      { title: "Betrieb & Führung", desc: "Ich führe Teams und mehrere Projekte und Kunden gleichzeitig: Prioritäten, Verantwortliche, Lieferungen, Qualität." },
      { title: "Apps & Plattformen", desc: "Ich baue und entwickle Produkte mit Buchungen, Benutzerkonten, Katalogen und Betriebstools." },
      { title: "Videoproduktion", desc: "Ich koordiniere Drehs: Planung, Crew, Sichtung des Materials und Auslieferung." },
      { title: "Infrastruktur", desc: "Ich diagnostiziere und behebe DNS, Hosting, Veröffentlichung, Firmen-E-Mail, SSL und Migrationen." },
      { title: "Kunde & Business", desc: "Ich definiere den Umfang, erkläre technische Entscheidungen und begleite jede Umsetzung." },
      { title: "Design", desc: "Ich verbinde visuelle Identität, Usability, Responsive Design und Geschäftsergebnisse." },
    ],
    studioLabel: "digitale Projekte des Studios BryanF Design seit 2020",
    marketsLabel: "Mexiko · Spanien · Frankreich",
  },
  quests: {
    eyebrow: "Quest-Log",
    title: "Berufserfahrung",
    kinds: {
      main: "Hauptquest",
      side: "Nebenquest",
      guild: "Eigene Gilde",
      past: "Abgeschlossene Quest",
    },
    concurrent: "Parallel zu Partum",
    noDate: "Daten folgen",
    scope: "Umfang",
    techTitle: "Technik",
    opsTitle: "Betrieb & Führung",
    loot: "Skill-Beute",
    earlier: "Frühere Quests",
    items: {
      partum: {
        role: "Leiter Webentwicklung · Tech Architect · Operations Manager",
        scope:
          "Übergreifende Verantwortung für Entwicklung und Betrieb: von der Anforderungsaufnahme und Architektur bis zu Produktion, Wartung und Nachbetreuung.",
        tech: [
          "Ich leite den Entwicklungsbereich und die Entscheidungen zu Technologie, Struktur und Wartung.",
          "Responsive Web-Erlebnisse mit HTML, CSS, JavaScript, React, Next.js und Tailwind CSS.",
          "Workflows und Deployments mit Git/GitHub, Vercel und Hosting; Domains, DNS, E-Mail, SSL und Migrationen.",
          "Ich behebe Website-Ausfälle, ausbleibende E-Mails, falsches DNS und Wiederherstellungen (Plesk/IONOS).",
          "Integrationen mit APIs, Formularen, Webhooks und n8n-Automatisierungen.",
        ],
        ops: [
          "Ich führe Teams aus Entwicklung, Design, Marketing, Videoproduktion und Support.",
          "Ich betreue mehrere Kunden und Projekte gleichzeitig: Analyse, Umsetzung, Dreh, Review, Launch und Support.",
          "Ich koordiniere und leite Videodrehs für Kunden, von der Planung bis zur Abnahme.",
          "Ich übersetze Kundenwünsche in technische Aufgaben, prüfe Qualität und steuere Releases.",
        ],
        loot: ["Next.js", "React", "Vercel", "DNS", "n8n", "Plesk", "Führung", "QA"],
      },
      indusecc: {
        role: "Tech Architect · Operations Manager",
        scope:
          "Technische Architektur, Entwicklungskoordination und operativer Support für die digitale Umgebung einer Beratung für ISO, Schulung und kontinuierliche Verbesserung.",
        tech: [
          "Architektur und Wartung der digitalen Lösungen des Unternehmens.",
          "Begleitung von Webentwicklung, technischen Änderungen, Integrationen und Verfügbarkeit.",
          "Domains, Hosting, DNS, E-Mail und digitale Dienste der zugewiesenen Projekte.",
        ],
        ops: [
          "Ich plane Aufgaben, setze Prioritäten und überwache Lieferungen in parallelen Projekten.",
          "Ich koordiniere die Kommunikation zwischen Technik, Verwaltung und Geschäftsleitung.",
          "Ich standardisiere Abläufe und halte den Status jedes Projekts sichtbar.",
        ],
        loot: ["Architektur", "Infrastruktur", "Prozesse", "Koordination"],
      },
      bryanf: {
        role: "Gründer · Full-Stack · UX/UI · Digitalberater",
        scope:
          "Mein unabhängiges Studio: Ich begleite Unternehmen von der ersten Analyse bis zum Launch und Ausbau ihrer Plattformen.",
        tech: [
          "Ich entwerfe, baue und pflege Web-Apps und Plattformen: Benutzer, Buchungen, Kataloge und Anfragen.",
          "Unternehmenswebsites, Landingpages, Onlineshops und Individuallösungen.",
          "Zahlungen, Formulare, Automatisierungen, Analytics, Deployments, Domains und DNS.",
        ],
        ops: [
          "Direkter Kundenkontakt: Meetings, Umfang, Prioritäten und Betreuung nach dem Launch.",
          "Angebote, Kostenvoranschläge, Dokumentation und visuelle Identität je Projekt.",
        ],
        loot: ["Next.js", "Stripe", "Three.js", "Figma", "Vertrieb", "Produkt"],
      },
      teleperformance: {
        role: "Operations Manager für Boost Mobile · Customer Service",
        scope: "Kundenbetreuung und Kundenerlebnis auf einem Telekommunikations-Account.",
        tech: [
          "Überwachung der Kundenservice-Aktivitäten und Einhaltung der Qualitätsprozesse.",
          "Bearbeitung und Eskalation von Vorfällen sowie Konfliktlösung in anspruchsvollen Situationen.",
        ],
        ops: [
          "Teamkoordination, Personalorganisation und operative Prioritäten.",
          "Professionelle Kommunikation auf Englisch und Spanisch.",
        ],
        loot: ["Customer Service", "Führung", "Englisch", "Eskalation"],
      },
      hermanmiller: {
        role: "Grafikdesigner",
        scope: "Visuelles Material für interne und externe Kampagnen sowie Unterstützung bei UX/UI-Projekten.",
        tech: [
          "Markenkonformes Grafikmaterial.",
          "Mitarbeit an Projekten für Interface- und User-Experience-Design.",
        ],
        ops: ["Zusammenarbeit mit anderen Bereichen für visuelle Konsistenz und Usability."],
        loot: ["Design", "UX/UI", "Marke"],
      },
      ocadeoro: {
        role: "Community Manager · Digitalmarketing",
        scope: "Social Media, Content und Community eines E-Sports-Teams.",
        tech: ["Content- und Community-Strategien.", "Kennzahlen verfolgen und Kampagnen anpassen."],
        ops: [],
        loot: ["Content", "Kennzahlen"],
      },
      cero: {
        role: "Grafik- und Kreativdesigner",
        scope: "Buchcover und visuelle Identität für Autoren und Content-Creator.",
        tech: ["Konzept und Gestaltung von Buchcovern."],
        ops: [],
        loot: ["Verlag", "Identität"],
      },
      itaca: {
        role: "Vertrieb & Kundenservice",
        scope: "Verkauf von Bildungsangeboten mit telefonischem Support und Nachverfolgung.",
        tech: [],
        ops: [],
        loot: ["Vertrieb"],
      },
      moslo: {
        role: "Vertrieb & Kundenservice",
        scope: "Telefonische Betreuung, Vertriebssteuerung und Kundennachverfolgung.",
        tech: [],
        ops: [],
        loot: ["Vertrieb"],
      },
    },
  },
  inventory: {
    eyebrow: "Inventar",
    title: "Ausrüstung und Werkzeuge",
    hint: "Tippe auf einen Gegenstand für seine Karte.",
    slots: {
      front: "Front-end & Web",
      infra: "Infrastruktur",
      auto: "Automatisierung",
      design: "Design & Video",
      lead: "Führung",
    },
    tiers: { core: "Hauptausrüstung", extra: "Zusatzausrüstung" },
    leadNames: {
      teams: "Teamführung",
      multi: "Parallele Projekte",
      clients: "Multi-Kunden-Management",
      qa: "QA & Validierung",
      incidents: "Störungsmanagement",
      docs: "Technische Doku",
      service: "Customer Service",
      video: "Drehregie",
    },
    autoNames: { forms: "Formulare", notify: "Benachrichtigungen" },
    infraNames: { mail: "Firmen-E-Mail" },
  },
  trophies: {
    eyebrow: "Trophäenraum",
    title: "Ausgewählte Projekte",
    credits: {
      own: "Eigene Marke",
      bryanf: "Portfolio BryanF Design",
      partum: "Entwickelt von Partum Design",
    },
    items: {
      bryanf: {
        sector: "Webdesign & -entwicklung",
        desc: "Meine Plattform: Portfolio, Leistungen, Paket-Konfigurator, Online-Zahlung und Lumina, die KI-Assistentin.",
      },
      cortmart: {
        sector: "Buchungs-App",
        desc: "Termin- und Treueplattform: Leistungen und Preise, Barbier und Uhrzeit, Konten, QR-Stempelkarte und Admin-Panel.",
      },
      mcspine: {
        sector: "Medizintechnik",
        desc: "Katalog für Wirbelsäulenimplantate nach Körperregion, Produktblätter und Angebotsablauf.",
      },
      mixteca: {
        sector: "Agrarexport",
        desc: "Digitale Präsenz für Gemüse und Kräuter: Unternehmen, Produkte, Vorteile und Kontakt.",
      },
      gecomex: {
        sector: "Logistik & Außenhandel",
        desc: "Unternehmenswebsite für Logistik- und internationale Zolldienstleistungen.",
      },
      koi: {
        sector: "Architektur & Innenarchitektur",
        desc: "Editoriales Erlebnis: Projekte, kreativer Prozess und visuelles Marken-Storytelling.",
      },
      partum: {
        sector: "B2B-Technologieberatung",
        desc: "Das Ökosystem der Agentur aus Leistungen, Software, Angeboten und Vorschlägen.",
      },
    },
    more: "Weitere Quests auf der Karte",
  },
  academy: {
    eyebrow: "Akademie",
    title: "Ausbildung",
    education: [
      { school: "Universidad Tecnológica de México (UNITEC)", degree: "Bachelor Digitales Design und Animation", period: "2023 –" },
      { school: "Tecnológico de Estudios Superiores de Ecatepec", degree: "Informatik-Ingenieurwesen (Studienleistungen)", period: "2018 – 2020" },
    ],
    coursesTitle: "Power-ups",
    courses: [
      { year: "2023", name: "Adobe-Zertifikatskurs", org: "Travesía Educación" },
      { year: "2020", name: "Premiere Pro: der Film mit einem Klick", org: "Domestika" },
      { year: "2020", name: "After Effects: Animation aus der Fantasie", org: "Domestika" },
      { year: "2020", name: "Illustrator: Vektorkunst", org: "Crehana" },
      { year: "2019", name: "Marketing im digitalen Zeitalter", org: "Google-Stiftung" },
      { year: "2018", name: "Entwicklung mobiler Apps", org: "Google-Stiftung" },
      { year: "2018", name: "Grundlagen drahtloser Netzwerke", org: "" },
      { year: "2012", name: "IT-Techniker", org: "CCPM" },
    ],
    languagesTitle: "Sprachen",
    languages: [
      { name: "Spanisch", level: "Muttersprache" },
      { name: "Englisch", level: "Fortgeschritten" },
    ],
  },
  contact: {
    eyebrow: "Weiter?",
    thank: "DANKE",
    script: "fürs Spielen",
    text: "Wenn dein Team technische Führung, Designgespür und Umsetzungsstärke sucht, lass uns reden.",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    website: "Portfolio",
    vcard: "Kontakt speichern",
    print: "Lebenslauf als PDF",
    roles: "Gesuchte Rollen",
    rolesList: [
      "Leiter Webentwicklung",
      "Technical Operations Manager",
      "Web Solutions Architect",
      "Full-Stack · React / Next.js",
    ],
  },
  lumina: {
    name: "Lumina",
    role: "Deine Guide",
    detected: "Ich habe deine Sprache erkannt: {lang}. Du kannst sie oben jederzeit ändern.",
    lines: {
      perfil:
        "Hallo! Ich bin Lumina und führe dich durch Bryans Lebenslauf. Hier ist seine Spielerkarte: jemand, der entwickelt, die Architektur entwirft und auch den Betrieb leitet.",
      misiones:
        "Das sind seine Quests. Die Hauptquest: zwei Jahre Leitung von Entwicklung und Betrieb bei Partum Design, parallel zu Indusecc. Tippe auf jede für Details.",
      inventario:
        "Schau, wie viel Ausrüstung er trägt! React, Next.js, Vercel, DNS, n8n, Adobe… und Führungsqualitäten. Tippe auf einen Gegenstand.",
      logros:
        "Der Trophäenraum: Buchungs-Apps, Medizinkataloge, Unternehmensseiten und seine eigene Plattform. Jedes Logo ist das offizielle der Marke.",
      academia:
        "Wusstest du, dass er mit Informatik begann und heute Digitales Design und Animation studiert? Deshalb verbindet er Code und Design.",
      contacto:
        "Ende der Tour! Wenn Bryan zu deinem Team passt, schreib ihm per WhatsApp oder E-Mail. Du kannst den Lebenslauf auch als PDF speichern.",
    },
  },
  meta: {
    title: "Bryan F. · Interaktiver Lebenslauf | Leiter Webentwicklung",
    description:
      "Interaktiver Lebenslauf von Bryan Fernando López: Leiter Web- & App-Entwicklung, Tech Architect und Operations Manager. Erkunde ihn wie ein Videospiel mit Lumina als Guide.",
  },
};

export default de;

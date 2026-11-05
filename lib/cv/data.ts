/**
 * CV interactivo (/cv): todo lo que NO cambia con el idioma. Logotipos,
 * enlaces, fechas y el orden de los niveles. Los textos viven en
 * lib/cv/i18n/<locale>.ts y se cruzan por `id`.
 *
 * Logotipos: archivos oficiales tomados de los repositorios y sitios de cada
 * marca (Partum, Indusecc, MC Spine, Koi, CortMart, Gecomex) o de los
 * paquetes de marca públicos (Teleperformance, Boost Mobile, Adobe, Figma,
 * n8n). Las tecnologías usan Simple Icons (react-icons/si) con su color de
 * marca. Nunca se redibujan ni se alteran.
 */

export const LEVELS = ["perfil", "misiones", "inventario", "logros", "academia", "contacto"] as const;
export type LevelId = (typeof LEVELS)[number];

export const CV_CONTACT = {
  fullName: "Bryan Fernando López López",
  shortName: "Bryan F.",
  email: "bryanf@bryanfdesign.com",
  phone: "+525663012505",
  phoneLabel: "+52 56 6301 2505",
  whatsapp: "https://wa.me/525663012505",
  website: "https://www.bryanfdesign.com/",
  linkedin: "https://www.linkedin.com/in/bryanfdesigner",
  github: "https://github.com/BryanF-Design",
  instagram: "https://www.instagram.com/bryanf_design/",
  vcard: "/tarjeta/contacto.vcf",
} as const;

export interface CvLogo {
  src: string;
  w: number;
  h: number;
  /** Fondo de la ficha donde el logo se lee bien tal como es. */
  tone: "light" | "dark";
}

export type QuestKind = "main" | "side" | "guild" | "past";

export interface Quest {
  id: string;
  company: string;
  url?: string;
  kind: QuestKind;
  /** Fechas como aparecen en el CV. `null` = el texto lo pone el diccionario. */
  period: string | null;
  logos: CvLogo[];
  /** Iniciales para las empresas sin archivo de logo oficial disponible. */
  monogram?: string;
}

export const QUESTS: Quest[] = [
  {
    id: "partum",
    company: "Partum Design",
    url: "https://www.partumdesign.com.mx/",
    kind: "main",
    period: "2024 – 2026",
    logos: [{ src: "/img/cv/logos/partum.webp", w: 640, h: 193, tone: "dark" }],
  },
  {
    id: "indusecc",
    company: "Indusecc",
    url: "https://www.indusecc.com.mx/",
    kind: "side",
    period: null,
    logos: [{ src: "/img/cv/logos/indusecc.webp", w: 600, h: 235, tone: "dark" }],
  },
  {
    id: "bryanf",
    company: "BryanF Design",
    url: "https://www.bryanfdesign.com/",
    kind: "guild",
    period: "2020 –",
    logos: [{ src: "/img/brand/logo-light.png", w: 720, h: 253, tone: "dark" }],
  },
  {
    id: "teleperformance",
    company: "Teleperformance · Boost Mobile",
    url: "https://www.teleperformance.com/",
    kind: "past",
    period: null,
    logos: [
      { src: "/img/cv/logos/teleperformance.svg", w: 100, h: 19, tone: "light" },
      { src: "/img/cv/logos/boost-mobile.svg", w: 427, h: 50, tone: "light" },
    ],
  },
  {
    id: "hermanmiller",
    company: "Herman Miller",
    url: "https://www.hermanmiller.com/",
    kind: "past",
    period: "2022 – 2024",
    logos: [{ src: "/img/clients/herman-miller-1.svg", w: 1002, h: 1007, tone: "light" }],
  },
  { id: "ocadeoro", company: "Oca de Oro E-Sports", kind: "past", period: "2021 – 2025", logos: [], monogram: "OO" },
  { id: "cero", company: "Editorial Cero a la Izquierda", kind: "past", period: "2018 – 2020", logos: [], monogram: "C0" },
  { id: "itaca", company: "Universidad Ítaca", kind: "past", period: "2020 – 2021", logos: [], monogram: "UÍ" },
  { id: "moslo", company: "MOSLO Tours", kind: "past", period: "2018 – 2020", logos: [], monogram: "MT" },
];

export type Credit = "own" | "bryanf" | "partum";

export interface Trophy {
  id: string;
  name: string;
  url: string;
  shot: { src: string; w: number; h: number };
  logo?: CvLogo;
  credit: Credit;
}

export const TROPHIES: Trophy[] = [
  {
    id: "bryanf",
    name: "BryanF Design",
    url: "https://www.bryanfdesign.com/",
    shot: { src: "/img/cv/shots/bryanf.webp", w: 960, h: 504 },
    logo: { src: "/img/brand/logo-light.png", w: 720, h: 253, tone: "dark" },
    credit: "own",
  },
  {
    id: "cortmart",
    name: "CortMart · Barbería",
    url: "https://barberia-partum.vercel.app/",
    shot: { src: "/img/cv/shots/cortmart.webp", w: 960, h: 726 },
    logo: { src: "/img/cv/logos/cortmart.webp", w: 208, h: 256, tone: "dark" },
    credit: "partum",
  },
  {
    id: "mcspine",
    name: "MC Spine",
    url: "https://mcspine.vercel.app/",
    shot: { src: "/img/cv/shots/mcspine.webp", w: 960, h: 600 },
    logo: { src: "/img/cv/logos/mcspine.webp", w: 302, h: 164, tone: "light" },
    credit: "partum",
  },
  {
    id: "mixteca",
    name: "Mixteca Foods",
    url: "https://mixtecafoods.com.mx/",
    shot: { src: "/img/cv/shots/mixteca.webp", w: 960, h: 667 },
    credit: "bryanf",
  },
  {
    id: "gecomex",
    name: "Gecomex",
    url: "https://www.geco-mex.com/",
    shot: { src: "/img/cv/shots/gecomex.webp", w: 960, h: 667 },
    logo: { src: "/img/cv/logos/gecomex.webp", w: 546, h: 134, tone: "dark" },
    credit: "bryanf",
  },
  {
    id: "koi",
    name: "Koi Arquitectura",
    url: "https://www.koiarquitectura.com/",
    shot: { src: "/img/cv/shots/koi.webp", w: 960, h: 667 },
    logo: { src: "/img/cv/logos/koi.webp", w: 520, h: 382, tone: "light" },
    credit: "bryanf",
  },
  {
    id: "partum",
    name: "Partum Design",
    url: "https://www.partumdesign.com.mx/",
    shot: { src: "/img/cv/shots/partum.webp", w: 900, h: 678 },
    logo: { src: "/img/cv/logos/partum.webp", w: 640, h: 193, tone: "dark" },
    credit: "partum",
  },
];

/** Más proyectos: solo nombre, enlace y, si existe, captura o logo oficial. */
export const SIDE_PROJECTS: { name: string; url: string; shot?: string; logo?: CvLogo }[] = [
  { name: "CEAH Estructural", url: "https://ceahestructural.com.mx/", shot: "/img/cv/shots/ceah.webp" },
  {
    name: "Efficient Plasticolors",
    url: "https://efficientplasticolors.com/",
    shot: "/img/cv/shots/efficient.webp",
    logo: { src: "/img/cv/logos/efficient-plastic-colors.webp", w: 420, h: 124, tone: "light" },
  },
  {
    name: "Haften",
    url: "https://haften.com.mx/",
    shot: "/img/cv/shots/haften.webp",
    logo: { src: "/img/cv/logos/haften.webp", w: 420, h: 83, tone: "light" },
  },
  {
    name: "BIOS Laboratorios",
    url: "https://bioslaboratorios.com/",
    shot: "/img/cv/shots/bios.webp",
    logo: { src: "/img/cv/logos/laboratorio-bios.webp", w: 353, h: 160, tone: "light" },
  },
  { name: "Pro Shield México", url: "https://proshieldmexico.com/", shot: "/img/cv/shots/proshield.webp" },
  {
    name: "Grupo AD",
    url: "https://grupoadplasticos.com.mx/",
    logo: { src: "/img/cv/logos/grupo-ad.webp", w: 414, h: 160, tone: "light" },
  },
  { name: "FoodiePack", url: "https://foodiepack.com.mx/" },
  { name: "Maktrom", url: "https://maktrom.com/" },
  { name: "Menbel", url: "https://menbel.com.mx/" },
];

/** Inventario. `icon` = Simple Icons (react-icons/si); `img` = SVG oficial a color. */
export type ItemSource =
  | { kind: "si"; icon: string; color: string }
  | { kind: "img"; src: string }
  | { kind: "lucide"; icon: string };

export interface InventoryItem {
  id: string;
  name: string;
  slot: "front" | "infra" | "auto" | "design" | "lead";
  /** "core" = stack principal declarado; "extra" = también publicado en el portafolio. */
  tier: "core" | "extra";
  source: ItemSource;
}

export const INVENTORY: InventoryItem[] = [
  // Front-end y desarrollo web (stack principal).
  { id: "js", name: "JavaScript", slot: "front", tier: "core", source: { kind: "si", icon: "SiJavascript", color: "#F7DF1E" } },
  { id: "react", name: "React", slot: "front", tier: "core", source: { kind: "si", icon: "SiReact", color: "#61DAFB" } },
  { id: "next", name: "Next.js", slot: "front", tier: "core", source: { kind: "si", icon: "SiNextdotjs", color: "#FFFFFF" } },
  { id: "html", name: "HTML5", slot: "front", tier: "core", source: { kind: "si", icon: "SiHtml5", color: "#E34F26" } },
  { id: "css", name: "CSS3", slot: "front", tier: "core", source: { kind: "si", icon: "SiCss", color: "#2965F1" } },
  { id: "tailwind", name: "Tailwind CSS", slot: "front", tier: "core", source: { kind: "si", icon: "SiTailwindcss", color: "#06B6D4" } },
  { id: "ts", name: "TypeScript", slot: "front", tier: "extra", source: { kind: "si", icon: "SiTypescript", color: "#3178C6" } },
  { id: "three", name: "Three.js", slot: "front", tier: "extra", source: { kind: "si", icon: "SiThreedotjs", color: "#FFFFFF" } },
  { id: "node", name: "Node.js", slot: "front", tier: "extra", source: { kind: "si", icon: "SiNodedotjs", color: "#5FA04E" } },
  { id: "php", name: "PHP", slot: "front", tier: "extra", source: { kind: "si", icon: "SiPhp", color: "#8892BF" } },
  { id: "wordpress", name: "WordPress", slot: "front", tier: "extra", source: { kind: "si", icon: "SiWordpress", color: "#3C8DC5" } },
  { id: "stripe", name: "Stripe", slot: "front", tier: "extra", source: { kind: "si", icon: "SiStripe", color: "#8F87FF" } },
  // Infraestructura y despliegues.
  { id: "git", name: "Git", slot: "infra", tier: "core", source: { kind: "si", icon: "SiGit", color: "#F05032" } },
  { id: "github", name: "GitHub", slot: "infra", tier: "core", source: { kind: "si", icon: "SiGithub", color: "#FFFFFF" } },
  { id: "vercel", name: "Vercel", slot: "infra", tier: "core", source: { kind: "si", icon: "SiVercel", color: "#FFFFFF" } },
  { id: "dns", name: "DNS · A · CNAME · MX · TXT", slot: "infra", tier: "core", source: { kind: "lucide", icon: "Globe" } },
  { id: "ssl", name: "SSL", slot: "infra", tier: "core", source: { kind: "lucide", icon: "ShieldCheck" } },
  { id: "mail", name: "Email", slot: "infra", tier: "core", source: { kind: "lucide", icon: "Mail" } },
  { id: "hosting", name: "Hosting", slot: "infra", tier: "core", source: { kind: "lucide", icon: "Server" } },
  { id: "plesk", name: "Plesk", slot: "infra", tier: "core", source: { kind: "si", icon: "SiPlesk", color: "#52BBE6" } },
  { id: "ionos", name: "IONOS", slot: "infra", tier: "core", source: { kind: "si", icon: "SiIonos", color: "#6FA8FF" } },
  { id: "linux", name: "Linux", slot: "infra", tier: "core", source: { kind: "si", icon: "SiLinux", color: "#FCC624" } },
  { id: "windows", name: "Windows Server", slot: "infra", tier: "core", source: { kind: "img", src: "/img/cv/logos/windows.svg" } },
  // Automatizaciones y servicios.
  { id: "n8n", name: "n8n", slot: "auto", tier: "core", source: { kind: "img", src: "/img/cv/logos/n8n-icon.svg" } },
  { id: "webhooks", name: "Webhooks", slot: "auto", tier: "core", source: { kind: "lucide", icon: "Webhook" } },
  { id: "apis", name: "APIs", slot: "auto", tier: "core", source: { kind: "lucide", icon: "Plug" } },
  { id: "forms", name: "Forms", slot: "auto", tier: "core", source: { kind: "lucide", icon: "ClipboardList" } },
  { id: "notify", name: "Notify", slot: "auto", tier: "core", source: { kind: "lucide", icon: "BellRing" } },
  // Diseño, video y comunicación digital.
  { id: "figma", name: "Figma", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/figma.svg" } },
  { id: "ps", name: "Photoshop", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/photoshop.svg" } },
  { id: "ai", name: "Illustrator", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/illustrator.svg" } },
  { id: "pr", name: "Premiere Pro", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/premiere.svg" } },
  { id: "ae", name: "After Effects", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/after-effects.svg" } },
  { id: "afd", name: "Affinity Designer", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/affinity-designer.svg" } },
  { id: "afp", name: "Affinity Photo", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/affinity-photo.svg" } },
  { id: "afpub", name: "Affinity Publisher", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/affinity-publisher.svg" } },
  { id: "vscode", name: "VS Code", slot: "design", tier: "core", source: { kind: "img", src: "/img/cv/logos/vscode.svg" } },
  // Liderazgo y operación: habilidades, no software.
  { id: "teams", name: "teams", slot: "lead", tier: "core", source: { kind: "lucide", icon: "Users" } },
  { id: "multi", name: "multi", slot: "lead", tier: "core", source: { kind: "lucide", icon: "LayoutGrid" } },
  { id: "clients", name: "clients", slot: "lead", tier: "core", source: { kind: "lucide", icon: "Handshake" } },
  { id: "qa", name: "qa", slot: "lead", tier: "core", source: { kind: "lucide", icon: "BadgeCheck" } },
  { id: "incidents", name: "incidents", slot: "lead", tier: "core", source: { kind: "lucide", icon: "Siren" } },
  { id: "docs", name: "docs", slot: "lead", tier: "core", source: { kind: "lucide", icon: "FileText" } },
  { id: "service", name: "service", slot: "lead", tier: "core", source: { kind: "lucide", icon: "Headset" } },
  { id: "video", name: "video", slot: "lead", tier: "core", source: { kind: "lucide", icon: "Clapperboard" } },
];

export const INVENTORY_SLOTS = ["front", "infra", "auto", "design", "lead"] as const;
export type InventorySlot = (typeof INVENTORY_SLOTS)[number];


/**
 * Logos de las escuelas, en el mismo orden que `academy.education`.
 * TESE: escudo oficial del Tecnológico de Estudios Superiores de Ecatepec.
 * UNITEC: falta el archivo oficial; al tenerlo, guárdalo en
 * public/img/cv/logos/unitec.webp y reemplaza `null` por su ficha.
 */
export const EDUCATION_LOGOS: (CvLogo | null)[] = [
  null,
  { src: "/img/cv/logos/tese.webp", w: 300, h: 300, tone: "light" },
];

/** Línea de tiempo de experiencia (años desde el primer trabajo en 2018). */
export const CAREER_START = 2018;

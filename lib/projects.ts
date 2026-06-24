export interface Project {
  /** Matches the screenshot filename (without .png) in /public/img/portafolio/* */
  slug: string;
  name: string;
  url: string;
  /** Short, human description taken from the site's own content. */
  desc: string;
}

/**
 * Live client sites. Screenshots live in:
 *   /public/img/portafolio/{escritorio,movil,tablet}/<slug>.png
 */
export const projects: Project[] = [
  { slug: "goldenrepublic-com-mx", name: "Golden Republic", url: "https://goldenrepublic.com.mx/", desc: "Bienes raíces" },
  { slug: "serviciosecem-com-mx", name: "Servicios ECEM", url: "https://serviciosecem.com.mx/", desc: "Asesoría contable y fiscal" },
  { slug: "industriastritton-com", name: "Industrias Tritton", url: "https://industriastritton.com/", desc: "Mezclado y molienda industrial" },
  { slug: "nkmohcafe-com", name: "NKMOH Café", url: "https://nkmohcafe.com/", desc: "Café de especialidad" },
  { slug: "playerapublimax-com", name: "Playera Publimax", url: "https://playerapublimax.com/", desc: "Playeras personalizadas" },
  { slug: "proshieldmexico-com", name: "ProShield México", url: "https://proshieldmexico.com/", desc: "Protección patrimonial" },
  { slug: "homeflowoficial-com", name: "HomeFlow", url: "https://homeflowoficial.com/", desc: "Plataforma digital" },
  { slug: "prefabricadosmx-com", name: "Prefabricados MX", url: "https://prefabricadosmx.com/", desc: "Prefabricados de concreto" },
  { slug: "efficientplasticolors-com", name: "Efficient Plasticolors", url: "https://efficientplasticolors.com/", desc: "Concentrados de color para plástico" },
  { slug: "ndt360-com-mx", name: "NDT 360", url: "https://ndt360.com.mx/", desc: "Pruebas no destructivas" },
  { slug: "kafi-com-mx", name: "Kafi", url: "https://kafi.com.mx/", desc: "Espacios de trabajo" },
  { slug: "mielyabejas-mx", name: "Miel y Abejas", url: "https://mielyabejas.mx/", desc: "Miel artesanal, del campo a tu mesa" },
  { slug: "bravologix-com-mx", name: "Bravologix", url: "https://bravologix.com.mx/", desc: "Logística y transporte" },
  { slug: "verticlean-com-mx", name: "Verticlean", url: "https://verticlean.com.mx/", desc: "Limpieza profesional" },
  { slug: "distribuidorajemar-com", name: "Distribuidora Jemar", url: "https://distribuidorajemar.com/", desc: "Distribución de suministros" },
  { slug: "gruposum-com", name: "Grupo SUM", url: "https://gruposum.com/", desc: "Experiencias que conectan equipos" },
  { slug: "grupocosma-com", name: "Grupo Cosma", url: "https://grupocosma.com/", desc: "Construcción y servicios" },
  { slug: "koi-arquitectura-vercel-app", name: "Koi Arquitectura", url: "https://koi-arquitectura.vercel.app", desc: "Arquitectura" },
  { slug: "repissa-vercel-app", name: "Repissa", url: "https://repissa.vercel.app/", desc: "Marca y sitio web" },
  { slug: "nezga-arquitectos-vercel-app", name: "Nezga Arquitectos", url: "https://nezga-arquitectos.vercel.app/", desc: "Arquitectura y construcción" },
  { slug: "epiko-vercel-app", name: "Epiko", url: "https://epiko.vercel.app/", desc: "Producción de eventos" },
  { slug: "element-experiences-com", name: "Element Experiences", url: "https://element-experiences.com/", desc: "Experiencias y eventos" },
];

export const desktopShot = (slug: string) =>
  `/img/portafolio/escritorio/${slug}.png`;
export const mobileShot = (slug: string) => `/img/portafolio/movil/${slug}.png`;
export const tabletShot = (slug: string) => `/img/portafolio/tablet/${slug}.png`;

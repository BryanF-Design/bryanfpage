import { ZoomParallax, type ParallaxImage } from "@/components/ui/zoom-parallax";
import { SectionHeading } from "@/components/sections/section-heading";
import { desktopShot, mobileShot, tabletShot } from "@/lib/projects";

/**
 * Gallery images.
 * - Mobile: always the vertical phone capture (desktop shots look bad at small slots).
 * - Desktop: a MIX of horizontal (escritorio) and vertical (móvil/tablet) for variety.
 * <picture> loads only the image that matches the breakpoint.
 */
const proyectos: ParallaxImage[] = [
  { src: desktopShot("goldenrepublic-com-mx"), mobileSrc: mobileShot("goldenrepublic-com-mx"), alt: "Golden Republic" },
  { src: mobileShot("nkmohcafe-com"), mobileSrc: mobileShot("nkmohcafe-com"), alt: "NKMOH Café" },
  { src: desktopShot("element-experiences-com"), mobileSrc: mobileShot("element-experiences-com"), alt: "Element Experiences" },
  { src: tabletShot("koi-arquitectura-vercel-app"), mobileSrc: mobileShot("koi-arquitectura-vercel-app"), alt: "Koi Arquitectura" },
  { src: desktopShot("grupocosma-com"), mobileSrc: mobileShot("grupocosma-com"), alt: "Grupo Cosma" },
  { src: mobileShot("epiko-vercel-app"), mobileSrc: mobileShot("epiko-vercel-app"), alt: "Epiko" },
  { src: desktopShot("serviciosecem-com-mx"), mobileSrc: mobileShot("serviciosecem-com-mx"), alt: "Servicios ECEM" },
];

export function ProjectsParallax() {
  return (
    <section
      id="projects"
      aria-label="Trabajos destacados"
      className="relative overflow-hidden border-t border-border"
    >
      <div aria-hidden className="mesh-glow-a opacity-50" />
      <div className="container relative flex h-[60vh] flex-col items-center justify-center">
        <SectionHeading
          eyebrow="Portafolio"
          title="Trabajos que hablan por sí solos"
          subtitle="Desplázate: cada proyecto toma el centro de la pantalla."
        />
      </div>
      <ZoomParallax images={proyectos} />
      <div className="h-[20vh]" />
    </section>
  );
}

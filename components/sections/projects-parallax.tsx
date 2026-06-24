import { ZoomParallax, type ParallaxImage } from "@/components/ui/zoom-parallax";
import { SectionHeading } from "@/components/sections/section-heading";

/**
 * Curated portfolio screenshots (served from /public/img/portafolio/escritorio).
 * Center image (index 0) stays put while the rest fan out on scroll.
 */
const proyectos: ParallaxImage[] = [
  { src: "/img/portafolio/escritorio/goldenrepublic-com-mx.png", alt: "Golden Republic" },
  { src: "/img/portafolio/escritorio/element-experiences-com.png", alt: "Element Experiences" },
  { src: "/img/portafolio/escritorio/koi-arquitectura-vercel-app.png", alt: "Koi Arquitectura" },
  { src: "/img/portafolio/escritorio/epiko-vercel-app.png", alt: "Epiko" },
  { src: "/img/portafolio/escritorio/grupocosma-com.png", alt: "Grupo Cosma" },
  { src: "/img/portafolio/escritorio/nkmohcafe-com.png", alt: "NKMOH Café" },
];

export function ProjectsParallax() {
  return (
    <section
      id="projects"
      aria-label="Trabajos destacados"
      className="relative border-t border-border"
    >
      <div className="container flex h-[60vh] flex-col items-center justify-center">
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

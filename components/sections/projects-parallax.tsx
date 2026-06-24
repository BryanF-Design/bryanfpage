import { ZoomParallax, type ParallaxImage } from "@/components/ui/zoom-parallax";
import { SectionHeading } from "@/components/sections/section-heading";

/**
 * Real portfolio screenshots (served from /public/img/portfolio).
 * Center image (index 0) stays put while the rest fan out on scroll.
 */
const proyectos: ParallaxImage[] = [
  { src: "/img/portfolio/goldenrepublicsite.jpg", alt: "Golden Republic — sitio web" },
  { src: "/img/portfolio/brasaprivesite.jpg", alt: "Brasa Privé — sitio web" },
  { src: "/img/portfolio/ecemsite.jpg", alt: "ECEM — sitio web" },
  { src: "/img/portfolio/trittonsite.jpg", alt: "Tritton — sitio web" },
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

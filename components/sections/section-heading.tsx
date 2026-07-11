import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

/**
 * Cabecera de sección estilo plano de obra: hairline superior, eyebrow en
 * mono con tick lima y titular expandido. Alineada a la izquierda por
 * defecto — el sitio ya no centra todo. Entra revelándose con el scroll
 * (Reveal), igual en el home que en las landings.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={cn(
          "flex flex-col gap-5 border-t border-border pt-6",
          align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start",
          className
        )}
      >
        {eyebrow && (
          <span className="tech-label inline-flex items-center gap-3 text-primary">
            <span className="h-1.5 w-1.5 bg-primary" />
            {eyebrow}
          </span>
        )}
        <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}

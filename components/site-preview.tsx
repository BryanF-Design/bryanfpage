import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Portada de marca para un sitio del portafolio que todavía no tiene captura
 * (`shots: false`): el nombre y el dominio sobre el bosque con su parche de
 * puntos, escalados con el ancho de la caja (unidades de contenedor). Nunca
 * finge una captura. En cuanto existan las capturas
 * (`node scripts/capture-portfolio.mjs <slug>` y quitar `shots: false`),
 * las fichas vuelven a mostrar la imagen real.
 */
export function SitePreview({
  name,
  host,
  compact = false,
  className,
}: {
  name: string;
  host: string;
  /** Caja angosta (teléfono): solo la chispa y el nombre, más grande. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-[3cqw] overflow-hidden bg-forest px-[6cqw] text-center text-white [container-type:size]",
        className
      )}
    >
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,hsl(var(--lime)/0.22),transparent_70%)]" />
      <span className="dot-cluster absolute -bottom-[4cqw] -right-[4cqw] h-[40cqh] w-[45cqw] opacity-30 [mask-image:radial-gradient(circle_at_70%_70%,black,transparent_72%)]" />
      <Sparkle className="relative size-[9cqw] max-h-[14cqh] max-w-[14cqh] fill-lime text-lime" />
      <span
        className={cn(
          "display-xl relative max-w-full truncate leading-[0.9] text-white",
          compact ? "text-[22cqw]" : "text-[min(16cqw,30cqh)]"
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          "relative inline-flex max-w-full items-center gap-[1.5cqw] rounded-full bg-white/10 px-[3.5cqw] py-[1.2cqw] text-[max(0.625rem,min(4cqw,7cqh))] font-semibold text-white/85",
          compact && "hidden"
        )}
      >
        <span className="size-[0.5em] shrink-0 rounded-full bg-lime" />
        <span className="truncate">{host}</span>
      </span>
    </div>
  );
}

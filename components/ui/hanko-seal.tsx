import { cn } from "@/lib/utils";

interface HankoSealProps {
  /** Tamaño de la firma en px. */
  size?: number;
  className?: string;
  /** Etiqueta accesible: la firma comunica autoría. */
  label?: string;
}

/**
 * Firma estática inspirada en los sellos de autor japoneses.
 *
 * No se presenta como botón ni como easter egg: cierra el trabajo con un
 * detalle cultural propio sin inventar una acción para quien navega.
 */
export function HankoSeal({
  size = 56,
  className,
  label = "Firma de Bryan F.",
}: HankoSealProps) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      style={{ width: size, height: size, fontSize: size * 0.25 }}
      className={cn(
        "maker-mark shrink-0 flex-row-reverse items-start gap-px p-1",
        className
      )}
    >
      <span className="vertical-jp !tracking-normal leading-none">ブライ</span>
      <span className="vertical-jp !tracking-normal leading-none">アン</span>
    </span>
  );
}

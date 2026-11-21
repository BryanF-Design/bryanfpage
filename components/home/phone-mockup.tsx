import Image from "next/image";

import { thumbLoader } from "@/lib/image-loaders";
import { cn } from "@/lib/utils";

/**
 * Teléfono dibujado con CSS que muestra la captura real de la primera
 * pantalla del sitio (390×845, WebP, máx. 400 px). Al entrar a la vista gira
 * un poco ("hero turn") y al pasar el mouse se endereza: solo transform,
 * apagado con movimiento reducido. Sin video ni 3D.
 */
export function PhoneMockup({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("phone-turn relative mx-auto w-[11.5rem] md:w-[13rem]", className)}>
      <div className="rounded-[2.2rem] bg-ink p-[0.45rem] shadow-float">
        <div className="relative aspect-[390/845] overflow-hidden rounded-[1.8rem] bg-white">
          <Image src={src} alt={alt} fill loader={thumbLoader} sizes="13rem" className="object-cover object-top" />
          <span aria-hidden className="absolute left-1/2 top-2 h-[1.15rem] w-[4.2rem] -translate-x-1/2 rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

import type { SVGProps } from "react";

/**
 * Iconos de marca desde un sprite estático (public/img/icons/sprite.svg):
 * el trazo vive una sola vez en un archivo cacheado y cada uso pesa ~100
 * bytes en el HTML (antes, ~1 KB por cada logo de WhatsApp en línea).
 * Misma API que los de react-icons: className y color por currentColor.
 */
function SpriteIcon({ id, viewBox, className, ...rest }: SVGProps<SVGSVGElement> & { id: string; viewBox: string }) {
  return (
    <svg viewBox={viewBox} fill="currentColor" aria-hidden className={className} width="1em" height="1em" {...rest}>
      <use href={`/img/icons/sprite.svg#${id}`} />
    </svg>
  );
}

export function FaWhatsapp(props: SVGProps<SVGSVGElement>) {
  return <SpriteIcon id="wa" viewBox="0 0 448 512" {...props} />;
}

export function SiMercadopago(props: SVGProps<SVGSVGElement>) {
  return <SpriteIcon id="mp" viewBox="0 0 24 24" {...props} />;
}

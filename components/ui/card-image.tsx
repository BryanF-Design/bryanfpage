"use client";

import Image, { type ImageProps } from "next/image";

import { cardLoader } from "@/lib/image-loaders";

/**
 * `next/image` con tope de 800 px (tarjetas). Envoltorio de cliente para
 * poder usarlo desde componentes de servidor (el `loader` es una función).
 */
export function CardImage(props: Omit<ImageProps, "loader">) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image loader={cardLoader} {...props} />;
}

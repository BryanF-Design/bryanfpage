"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export interface ParallaxImage {
  /** Desktop-breakpoint image (can be horizontal or vertical, for format variety). */
  src: string;
  /** Mobile-breakpoint image (vertical phone capture). Loads only below md. */
  mobileSrc?: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Up to 7 images. The center image stays put while the rest fan out. */
  images: ParallaxImage[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, mobileSrc, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]" : ""} ${index === 2 ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]" : ""} ${index === 3 ? "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]" : ""} ${index === 4 ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]" : ""} ${index === 5 ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]" : ""} ${index === 6 ? "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]" : ""} `}
            >
              <div className="relative h-[28vh] w-[42vw] overflow-hidden rounded-md ring-1 ring-border sm:h-[25vh] sm:w-[25vw]">
                {mobileSrc && (
                  <Image
                    src={mobileSrc}
                    alt={alt || `Proyecto ${index + 1}`}
                    fill
                    sizes="42vw"
                    loading="lazy"
                    className="object-cover object-top md:hidden"
                  />
                )}
                <Image
                  src={src}
                  alt={alt || `Proyecto ${index + 1}`}
                  fill
                  sizes="25vw"
                  loading="lazy"
                  className={`object-cover object-top ${mobileSrc ? "hidden md:block" : ""}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

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

  const scale4 = useTransform(scrollYProgress, [0, 1], [1.3, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1.3, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1.3, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1.3, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1.3, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, mobileSrc, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? "[&>div]:!-top-[28vh] [&>div]:!left-[5vw] [&>div]:!h-[34vh] [&>div]:!w-[38vw]" : ""} ${index === 2 ? "[&>div]:!-top-[8vh] [&>div]:!-left-[26vw] [&>div]:!h-[48vh] [&>div]:!w-[24vw]" : ""} ${index === 3 ? "[&>div]:!left-[28vw] [&>div]:!h-[30vh] [&>div]:!w-[28vw]" : ""} ${index === 4 ? "[&>div]:!top-[25vh] [&>div]:!left-[6vw] [&>div]:!h-[30vh] [&>div]:!w-[24vw]" : ""} ${index === 5 ? "[&>div]:!top-[25vh] [&>div]:!-left-[23vw] [&>div]:!h-[30vh] [&>div]:!w-[34vw]" : ""} ${index === 6 ? "[&>div]:!top-[20vh] [&>div]:!left-[26vw] [&>div]:!h-[22vh] [&>div]:!w-[20vw]" : ""} `}
            >
              <div className="relative h-[34vh] w-[48vw] overflow-hidden rounded-2xl ring-1 ring-white/15 sm:h-[30vh] sm:w-[28vw]">
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

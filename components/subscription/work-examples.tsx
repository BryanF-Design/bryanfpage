import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { mobileShot, projects } from "@/lib/projects";

const SHOWN = projects.filter((p) => p.shots !== false);

function Row({ items, reverse }: { items: typeof SHOWN; reverse?: boolean }) {
  // La lista va dos veces: la cinta se desplaza la mitad y vuelve sin salto.
  const loop = [...items, ...items];
  return (
    <div className="sub-marquee group/marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <ul
        className="sub-marquee-track flex w-max gap-3 py-3"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {loop.map((p, i) => (
          <li key={`${p.slug}-${i}`} aria-hidden={i >= items.length || undefined} className="w-[13rem] shrink-0 sm:w-[15rem]">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={i >= items.length ? -1 : undefined}
              className="group flex h-full items-center gap-3 rounded-card bg-white p-2 pr-3 ring-1 ring-ink/[0.08] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="relative h-[6.5rem] w-[3.6rem] shrink-0 overflow-hidden rounded-[0.8rem] bg-ink ring-2 ring-ink">
                <Image src={mobileShot(p.slug)} alt="" fill sizes="58px" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-sm font-bold text-ink">{p.name}</span>
                <span className="mt-1 line-clamp-2 text-xs text-ink/60">{p.desc}</span>
              </span>
              <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-forest transition-transform group-hover:rotate-45" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Ejemplos reales de trabajo, en dos cintas que se mueven en sentidos opuestos. */
export function WorkExamples() {
  const half = Math.ceil(SHOWN.length / 2);
  return (
    <div className="mt-8 flex flex-col gap-1">
      <Row items={SHOWN.slice(0, half)} />
      <Row items={SHOWN.slice(half)} reverse />
    </div>
  );
}

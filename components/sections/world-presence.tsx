"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/sections/section-heading";

// Client-only + code-split: keeps the heavy dotted-map out of the initial
// bundle and avoids server rendering the animated SVG.
const WorldMap = dynamic(
  () => import("@/components/ui/map").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[2/1] w-full animate-pulse rounded-lg bg-secondary/20" />
    ),
  }
);

const MEXICO = { lat: 19.4326, lng: -99.1332, label: "México" };
const ESPANA = { lat: 40.4168, lng: -3.7038, label: "España" };
const FRANCIA = { lat: 48.8566, lng: 2.3522, label: "Francia" };

export function WorldPresence() {
  return (
    <section
      id="presencia"
      aria-label="Países en los que hemos trabajado"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-50" />
      <div className="container relative">
        <SectionHeading
          eyebrow="Presencia"
          title="Dónde hemos trabajado"
          subtitle="Proyectos para clientes en México, España y Francia. Diseñamos sin fronteras."
        />

        <div className="glass mx-auto mt-14 max-w-5xl rounded-3xl p-4 md:p-8">
          <WorldMap
            lineColor="#B4E332"
            dots={[
              { start: MEXICO, end: ESPANA },
              { start: MEXICO, end: FRANCIA },
              { start: ESPANA, end: FRANCIA },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

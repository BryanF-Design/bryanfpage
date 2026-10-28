"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { CARD } from "@/lib/contact-card";

/** Grados por píxel arrastrado. */
const DRAG_RATIO = 0.55;
/** Por debajo de este movimiento el gesto cuenta como toque. */
const TAP_SLOP = 6;

/**
 * Tarjeta física en 3D. Flota y se mece todo el tiempo (animación CSS en el
 * envoltorio, ver `.dc-float` en globals.css) y encima gira con el dedo: al
 * arrastrar sigue al puntero y al soltar asienta en la cara más cercana; un
 * toque (o Enter/Espacio) la voltea. Frente: foto y nombre. Reverso: el QR,
 * que puede llevar el contacto completo (se guarda sin internet y sirve para
 * Google Wallet) o solo el enlace a esta página.
 * `touch-action: pan-y` deja el scroll vertical al navegador.
 */
export function FlipCard({ qrContactSvg, qrLinkSvg }: { qrContactSvg: string; qrLinkSvg: string }) {
  const [angle, setAngle] = useState(0);
  const [qrMode, setQrMode] = useState<"contacto" | "enlace">("contacto");
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; base: number; moved: boolean } | null>(null);

  const showingBack = Math.round(angle / 180) % 2 !== 0;

  function flip() {
    setAngle((a) => Math.round(a / 180) * 180 + 180);
    trackEvent("card_flip");
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, base: angle, moved: false };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < TAP_SLOP) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setAngle(d.base + dx * DRAG_RATIO);
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setDragging(false);
    if (d.moved) setAngle((a) => Math.round(a / 180) * 180);
    else flip();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full [perspective:1400px]">
        <div className="dc-float [transform-style:preserve-3d]">
          <div
            role="button"
            tabIndex={0}
            aria-label={showingBack ? "Voltear tarjeta: ver frente" : "Voltear tarjeta: ver código QR"}
            aria-pressed={showingBack}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            style={{ transform: `rotateY(${angle}deg)` }}
            className={`relative grid cursor-grab touch-pan-y select-none rounded-[2rem] outline-none [transform-style:preserve-3d] focus-visible:ring-4 focus-visible:ring-lime/60 active:cursor-grabbing ${
              dragging ? "" : "transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(.2,.9,.25,1.15)]"
            }`}
          >
            {/* ── Frente ─────────────────────────────────────────── */}
            <div
              aria-hidden={showingBack}
              className="relative col-start-1 row-start-1 overflow-hidden rounded-[2rem] bg-ink px-5 pb-6 pt-5 text-white shadow-[0_34px_60px_-30px_hsl(var(--ink)/0.75)] [backface-visibility:hidden]"
            >
              <CardDecor />

              <div className="relative flex items-center justify-between">
                <Image
                  src="/img/brand/logo-light.png"
                  alt="BryanF Design"
                  width={720}
                  height={253}
                  className="pointer-events-none h-7 w-auto"
                  draggable={false}
                  priority
                />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-lime">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
                  Disponible
                </span>
              </div>

              <div className="relative mt-7 flex flex-col items-center text-center">
                <div className="relative">
                  {/* Aro con degradado que gira sin parar. */}
                  <div className="dc-ring absolute -inset-1.5 rounded-full" />
                  <Image
                    src={CARD.photo.src}
                    alt={`Foto de ${CARD.fullName}`}
                    width={CARD.photo.width}
                    height={CARD.photo.height}
                    priority
                    draggable={false}
                    className="pointer-events-none relative h-32 w-32 rounded-full border-4 border-ink object-cover object-[50%_30%]"
                  />
                </div>

                <h1
                  id="card-name"
                  className="mt-5 font-display text-[2.5rem] font-extrabold italic leading-none tracking-[-0.03em]"
                >
                  {CARD.fullName}
                </h1>
                <p className="mt-2 text-[0.9375rem] font-semibold text-lime">{CARD.role}</p>
                <p className="mt-1 text-sm text-white/60">
                  {CARD.company} · {CARD.city}
                </p>
                <p className="mt-4 max-w-[19rem] text-[0.9375rem] leading-relaxed text-white/80">
                  {CARD.bio}
                </p>
                <p className="mt-3 font-serif text-2xl italic text-white">{CARD.tagline}</p>
              </div>
            </div>

            {/* ── Reverso ────────────────────────────────────────── */}
            <div
              aria-hidden={!showingBack}
              className="relative col-start-1 row-start-1 flex flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-lime px-5 pb-6 pt-5 text-ink shadow-[0_34px_60px_-30px_hsl(var(--lime-deep)/0.9)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <CardDecor light />

              <div className="relative flex w-full items-center justify-between">
                <Image
                  src="/img/brand/logo-dark.png"
                  alt=""
                  width={720}
                  height={253}
                  className="pointer-events-none h-7 w-auto"
                  draggable={false}
                />
                {/* Selector de contenido: no debe voltear la tarjeta. */}
                <div
                  role="group"
                  aria-label="Contenido del QR"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="flex rounded-full bg-ink/10 p-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em]"
                >
                  {(["contacto", "enlace"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      tabIndex={showingBack ? 0 : -1}
                      aria-pressed={qrMode === mode}
                      onClick={() => setQrMode(mode)}
                      className={`rounded-full px-3 py-1.5 transition-colors ${
                        qrMode === mode ? "bg-ink text-lime" : "text-ink/70"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full max-w-[16rem] rounded-[1.75rem] bg-white p-5 shadow-[0_20px_40px_-24px_hsl(var(--ink)/0.6)]">
                <div
                  role="img"
                  aria-label={
                    qrMode === "contacto"
                      ? `Código QR con el contacto de ${CARD.fullName}`
                      : `Código QR que abre ${CARD.cardUrl}`
                  }
                  className="aspect-square w-full [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrMode === "contacto" ? qrContactSvg : qrLinkSvg }}
                />
                <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg bg-ink ring-[3px] ring-white">
                  <Image
                    src="/img/favicon.png"
                    alt=""
                    width={28}
                    height={28}
                    className="pointer-events-none h-6 w-6"
                    draggable={false}
                  />
                </span>
              </div>

              <div className="relative text-center">
                <p className="font-display text-2xl font-extrabold italic leading-tight tracking-[-0.02em]">
                  {qrMode === "contacto" ? "Escanéame y guárdame" : "Abre mi tarjeta"}
                </p>
                <p className="mt-1 text-xs text-ink/60">
                  {qrMode === "contacto"
                    ? "Se agrega a tus contactos, sin internet"
                    : CARD.cardUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={flip}
        className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
      >
        <RotateCw aria-hidden className="dc-spin-hint h-4 w-4 text-lime-deep" />
        {showingBack ? "Toca o desliza para ver el frente" : "Toca o desliza para ver mi QR"}
      </button>
    </div>
  );
}

/** Brillo que barre la tarjeta, halo y retícula de puntos. */
function CardDecor({ light = false }: { light?: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl ${
          light ? "bg-white/40" : "bg-lime/25"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 [background-size:14px_14px] ${
          light
            ? "opacity-[0.12] [background-image:radial-gradient(hsl(var(--ink))_1px,transparent_1px)]"
            : "opacity-[0.07] [background-image:radial-gradient(hsl(0_0%_100%)_1px,transparent_1px)]"
        }`}
      />
      <div aria-hidden className="dc-sheen pointer-events-none absolute inset-0" />
    </>
  );
}

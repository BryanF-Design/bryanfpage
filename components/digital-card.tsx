"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Share2,
  Star,
  UserPlus,
  Wallet,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

import { FlipCard } from "@/components/digital-card-flip";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { trackEvent } from "@/lib/analytics";
import { CARD } from "@/lib/contact-card";

const VCARD_URL = "/tarjeta/contacto.vcf";

const quickActions = [
  { label: "Llamar", href: `tel:${CARD.phone}`, Icon: Phone, external: false },
  { label: "WhatsApp", href: CARD.whatsapp, Icon: FaWhatsapp, external: true },
  { label: "Correo", href: `mailto:${CARD.email}`, Icon: Mail, external: false },
  { label: "Sitio", href: CARD.website, Icon: Globe, external: true },
];

const details = [
  { label: "Teléfono", value: CARD.phoneLabel, href: `tel:${CARD.phone}`, Icon: Phone },
  { label: "WhatsApp", value: CARD.phoneLabel, href: CARD.whatsapp, Icon: FaWhatsapp },
  {
    label: "Correo",
    // <wbr>: en pantallas angostas el correo corta en la arroba.
    value: (
      <>
        bryanf@
        <wbr />
        bryanfdesign.com
      </>
    ),
    href: `mailto:${CARD.email}`,
    Icon: Mail,
  },
  { label: "Sitio web", value: CARD.websiteLabel, href: CARD.website, Icon: Globe },
  { label: "Ubicación", value: `${CARD.city}, ${CARD.country}`, href: null, Icon: MapPin },
] satisfies {
  label: string;
  value: ReactNode;
  href: string | null;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[];

const social = [
  { label: "Instagram", href: CARD.social.instagram, Icon: FaInstagram },
  { label: "LinkedIn", href: CARD.social.linkedin, Icon: FaLinkedinIn },
  { label: "Facebook", href: CARD.social.facebook, Icon: FaFacebookF },
  { label: "GitHub", href: CARD.social.github, Icon: FaGithub },
];

function isExternal(href: string) {
  return href.startsWith("http");
}

/**
 * Tarjeta de presentación digital (/tarjeta). No aparece en la navegación: se
 * comparte con el QR o el enlace. Pensada primero para teléfono: una columna,
 * botones grandes al alcance del pulgar y "Guardar contacto" siempre visible
 * abajo.
 */
export function DigitalCard({
  qrContactSvg,
  qrLinkSvg,
  walletEnabled,
}: {
  qrContactSvg: string;
  qrLinkSvg: string;
  /** Hay credenciales de Google Wallet: se muestra "Agregar a Google Wallet". */
  walletEnabled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [saveInView, setSaveInView] = useState(true);
  const [walletError, setWalletError] = useState(false);
  const copyTimer = useRef<number>();
  const saveRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    // /tarjeta/google-wallet regresa aquí con ?wallet=error si no pudo crear el pase.
    setWalletError(new URLSearchParams(window.location.search).get("wallet") === "error");
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  // La barra fija solo aparece cuando el botón grande de "Guardar contacto"
  // ya no está en pantalla, para no repetirlo dos veces a la vista.
  useEffect(() => {
    const el = saveRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setSaveInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(CARD.cardUrl);
    } catch {
      // Navegadores sin portapapeles: se selecciona a mano del prompt.
      window.prompt("Copia el enlace de la tarjeta:", CARD.cardUrl);
    }
    setCopied(true);
    trackEvent("card_copy_link");
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  async function share() {
    trackEvent("card_share");
    try {
      await navigator.share({
        title: `${CARD.fullName} · ${CARD.company}`,
        text: `${CARD.fullName} — ${CARD.role}. Guarda mi contacto:`,
        url: CARD.cardUrl,
      });
    } catch {
      // Cancelado por el usuario: no hay nada que hacer.
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      data-language="es-only"
      className="relative min-h-[100svh] overflow-hidden bg-canvas px-4 pb-32 pt-5 outline-none sm:pt-10"
    >
      <SpanishPageLanguage />

      {/* Halo lima detrás de la tarjeta. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-lime/40 blur-[110px]"
      />

      <div className="relative mx-auto flex w-full max-w-[26rem] flex-col gap-3">
        {/* ── Tarjeta 3D: frente con la foto, reverso con el QR ───── */}
        <FlipCard qrContactSvg={qrContactSvg} qrLinkSvg={qrLinkSvg} />

        {/* Accesos rápidos. */}
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col items-center gap-1.5 rounded-2xl bg-ink py-3 text-xs font-semibold text-white/85 shadow-[0_12px_26px_-18px_hsl(var(--ink)/0.8)] transition-colors hover:bg-ink-soft active:scale-[0.97]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:-translate-y-0.5">
                <Icon aria-hidden className="h-[1.1rem] w-[1.1rem]" />
              </span>
              {label}
            </a>
          ))}
        </div>

        {/* ── Guardar contacto ───────────────────────────────────── */}
        <a
          ref={saveRef}
          href={VCARD_URL}
          download="Bryan-F-BryanF-Design.vcf"
          onClick={() => trackEvent("card_save_contact")}
          className="group flex h-16 items-center justify-between rounded-[1.5rem] bg-lime pl-6 pr-2 text-ink shadow-[0_16px_30px_-16px_hsl(var(--lime-deep)/0.9)] transition-transform active:scale-[0.98]"
        >
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold">Guardar contacto</span>
            <span className="text-xs font-medium text-ink/70">Se agrega a tu agenda con foto</span>
          </span>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-lime transition-transform group-hover:rotate-[-8deg]">
            <UserPlus aria-hidden className="h-5 w-5" />
          </span>
        </a>

        {walletEnabled && (
          <a
            href="/tarjeta/google-wallet"
            rel="nofollow"
            onClick={() => trackEvent("card_google_wallet")}
            className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-black text-[0.9375rem] font-semibold text-white shadow-[0_14px_30px_-16px_rgb(0_0_0/0.8)] transition-transform active:scale-[0.98]"
          >
            <Wallet aria-hidden className="h-5 w-5" />
            Agregar a Google Wallet
          </a>
        )}
        {walletError && (
          <p role="status" className="rounded-2xl bg-white px-4 py-3 text-center text-sm text-ink/75">
            Google Wallet no respondió. Intenta de nuevo o usa{" "}
            <strong className="font-semibold text-ink">Guardar contacto</strong>.
          </p>
        )}

        {/* ── Datos ──────────────────────────────────────────────── */}
        <section aria-label="Datos de contacto" className="rounded-[2rem] bg-white p-2 shadow-[0_18px_40px_-28px_hsl(var(--ink)/0.45)]">
          <ul className="divide-y divide-ink/[0.07]">
            {details.map(({ label, value, href, Icon }) => {
              const body = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime-soft text-forest-deep">
                    <Icon aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink/50">
                      {label}
                    </span>
                    <span className="block break-words text-[0.9375rem] font-semibold text-ink">
                      {value}
                    </span>
                  </span>
                  {href && (
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-ink/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  )}
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-3 rounded-[1.25rem] px-3 py-3 transition-colors hover:bg-canvas"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Redes ──────────────────────────────────────────────── */}
        <nav aria-label="Redes sociales" className="grid grid-cols-4 gap-2">
          {social.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-14 items-center justify-center rounded-2xl bg-white text-ink shadow-[0_12px_26px_-22px_hsl(var(--ink)/0.6)] transition-[transform,background-color,color] hover:-translate-y-0.5 hover:bg-ink hover:text-lime"
            >
              <Icon aria-hidden className="h-5 w-5" />
            </a>
          ))}
        </nav>

        {/* ── Compartir ──────────────────────────────────────────── */}
        <section
          aria-labelledby="card-qr"
          className="rounded-[2rem] bg-white p-5 shadow-[0_18px_40px_-28px_hsl(var(--ink)/0.45)]"
        >
          <div className="flex items-center gap-2">
            <QrCode aria-hidden className="h-4 w-4 text-forest" />
            <h2
              id="card-qr"
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink/60"
            >
              Comparte mi tarjeta
            </h2>
          </div>
          <p className="mt-1 text-sm text-ink/70">
            Voltea la tarjeta para mostrar el QR, mándala directo o guárdala en tu Wallet.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {canShare ? (
              <button
                type="button"
                onClick={share}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-transform active:scale-[0.97]"
              >
                <Share2 aria-hidden className="h-4 w-4 text-lime" />
                Compartir
              </button>
            ) : (
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${CARD.fullName} — ${CARD.role}. Guarda su contacto: ${CARD.cardUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("card_share_whatsapp")}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-transform active:scale-[0.97]"
              >
                <FaWhatsapp aria-hidden className="h-4 w-4 text-lime" />
                Enviar
              </a>
            )}
            <button
              type="button"
              onClick={copyLink}
              aria-live="polite"
              className="flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-ink/15 text-sm font-semibold text-ink transition-[transform,border-color] hover:border-ink/50 active:scale-[0.97]"
            >
              {copied ? (
                <>
                  <Check aria-hidden className="h-4 w-4 text-lime-deep" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy aria-hidden className="h-4 w-4" />
                  Copiar enlace
                </>
              )}
            </button>
          </div>

          {/* Google Wallet guarda cualquier QR desde una foto o captura. */}
          <a
            href="/tarjeta/qr-contacto.png"
            download="QR-contacto-Bryan-F.png"
            onClick={() => trackEvent("card_wallet_qr")}
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-lime-soft text-sm font-semibold text-ink transition-transform active:scale-[0.97]"
          >
            <Wallet aria-hidden className="h-4 w-4 text-forest" />
            Descargar QR para Google Wallet
          </a>
          <p className="mt-3 text-xs leading-relaxed text-ink/55">
            {walletEnabled && "¿Prefieres la foto? "}En Google Wallet toca <strong className="font-semibold text-ink/75">Agregar a Wallet → Foto</strong>{" "}
            y elige la imagen: el pase guarda el QR con mi nombre, teléfono, correo y sitio. Quien lo
            escanee me agrega a sus contactos al instante.
          </p>
        </section>

        <a
          href={CARD.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
        >
          <Star aria-hidden className="h-4 w-4 fill-lime text-lime-deep" />
          ¿Trabajamos juntos? Déjame una reseña en Google
        </a>
        <p className="text-center text-xs text-ink/40">
          © {new Date().getFullYear()} {CARD.company} · Haz que pase.
        </p>
      </div>

      {/* Barra fija en teléfono: guardar el contacto siempre a un toque. */}
      {/* El margen izquierdo deja libre la pestaña de accesibilidad. */}
      <div
        aria-hidden={saveInView}
        className={`fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-canvas via-canvas/95 to-transparent pb-[max(1rem,env(safe-area-inset-bottom))] pl-12 pr-4 pt-6 transition-[transform,opacity] duration-300 sm:hidden ${
          saveInView ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[26rem] gap-2">
          <a
            tabIndex={saveInView ? -1 : 0}
            href={VCARD_URL}
            download="Bryan-F-BryanF-Design.vcf"
            onClick={() => trackEvent("card_save_contact", { position: "sticky" })}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[0.9375rem] font-semibold text-white shadow-[0_14px_30px_-14px_hsl(var(--ink)/0.8)] active:scale-[0.98]"
          >
            <UserPlus aria-hidden className="h-5 w-5 text-lime" />
            Guardar contacto
          </a>
          <a
            href={CARD.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            tabIndex={saveInView ? -1 : 0}
            className="grid h-14 w-14 place-items-center rounded-full bg-lime text-ink shadow-[0_14px_30px_-14px_hsl(var(--lime-deep)/0.9)] active:scale-[0.98]"
          >
            <FaWhatsapp aria-hidden className="h-6 w-6" />
          </a>
        </div>
      </div>
    </main>
  );
}

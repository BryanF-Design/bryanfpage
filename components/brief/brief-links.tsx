"use client";

import { useState, type ClipboardEvent, type KeyboardEvent } from "react";
import type { IconType } from "react-icons";
import {
  SiApplemusic,
  SiAppstore,
  SiAirbnb,
  SiBehance,
  SiBox,
  SiCalendly,
  SiCanva,
  SiDribbble,
  SiDropbox,
  SiEtsy,
  SiFacebook,
  SiFigma,
  SiGithub,
  SiGoogledocs,
  SiGoogledrive,
  SiGooglemaps,
  SiGoogleplay,
  SiGooglephotos,
  SiGooglesheets,
  SiGoogleslides,
  SiIcloud,
  SiInstagram,
  SiLinktree,
  SiMega,
  SiMercadopago,
  SiNotion,
  SiPinterest,
  SiShopify,
  SiSoundcloud,
  SiSpotify,
  SiSquarespace,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiTripadvisor,
  SiTwitch,
  SiVimeo,
  SiWhatsapp,
  SiWix,
  SiWordpress,
  SiX,
  SiYelp,
  SiYoutube,
} from "react-icons/si";
import { FaAmazon, FaLinkedin } from "react-icons/fa";
import { FileText, Globe, Link2, MapPin, Plus, Store, X } from "lucide-react";

import {
  LINK_PURPOSES,
  extractUrls,
  makeBriefLink,
  normalizeUrl,
  type BriefLink,
  type LinkPurpose,
} from "@/lib/brief";
import { cn } from "@/lib/utils";

const ICONS: Record<string, IconType> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  linkedin: FaLinkedin,
  youtube: SiYoutube,
  x: SiX,
  threads: SiThreads,
  pinterest: SiPinterest,
  behance: SiBehance,
  dribbble: SiDribbble,
  figma: SiFigma,
  canva: SiCanva,
  gdrive: SiGoogledrive,
  gdocs: SiGoogledocs,
  gsheets: SiGooglesheets,
  gslides: SiGoogleslides,
  gforms: SiGoogledocs,
  gphotos: SiGooglephotos,
  gmaps: SiGooglemaps,
  gbusiness: SiGooglemaps,
  googleplay: SiGoogleplay,
  appstore: SiAppstore,
  dropbox: SiDropbox,
  icloud: SiIcloud,
  mega: SiMega,
  box: SiBox,
  notion: SiNotion,
  linktree: SiLinktree,
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
  calendly: SiCalendly,
  vimeo: SiVimeo,
  spotify: SiSpotify,
  soundcloud: SiSoundcloud,
  twitch: SiTwitch,
  github: SiGithub,
  mercadolibre: SiMercadopago,
  amazon: FaAmazon,
  etsy: SiEtsy,
  shopify: SiShopify,
  wix: SiWix,
  wordpress: SiWordpress,
  squarespace: SiSquarespace,
  airbnb: SiAirbnb,
  tripadvisor: SiTripadvisor,
  yelp: SiYelp,
  applemusic: SiApplemusic,
};

/** Icono del tipo de enlace (marca si la conocemos; si no, por categoría). */
export function LinkTypeIcon({ link, className }: { link: Pick<BriefLink, "type" | "category">; className?: string }) {
  const Brand = ICONS[link.type];
  if (Brand) return <Brand aria-hidden className={className} />;
  const Fallback =
    link.category === "files" ? FileText : link.category === "maps" ? MapPin : link.category === "store" ? Store : Globe;
  return <Fallback aria-hidden className={className} />;
}

function shortUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/**
 * Enlaces del briefing: el cliente pega uno o varios links (o un texto con
 * links) y cada uno se reconoce al instante: Instagram, Drive, Figma, Maps,
 * su sitio… con un propósito sugerido que puede cambiar.
 */
export function BriefLinks({
  links,
  onChange,
  highlight,
}: {
  links: BriefLink[];
  onChange: (links: BriefLink[]) => void;
  highlight?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const preview = (() => {
    const result = draft.trim() ? normalizeUrl(draft) : null;
    return result && "url" in result ? makeBriefLink(result.url) : null;
  })();

  function addMany(urls: string[]) {
    const fresh = urls.filter((u) => !links.some((l) => l.url === u)).map((u) => makeBriefLink(u));
    if (!fresh.length) {
      setError(urls.length ? "Ese enlace ya está en la lista." : "No encontramos enlaces en lo que pegaste.");
      return false;
    }
    onChange([...links, ...fresh].slice(0, 20));
    setDraft("");
    setError("");
    return true;
  }

  function add() {
    if (!draft.trim()) return;
    const several = extractUrls(draft);
    if (several.length > 1) {
      addMany(several);
      return;
    }
    const result = normalizeUrl(draft);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    addMany([result.url]);
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text");
    const urls = extractUrls(text);
    // Si pegó varios links (o un texto con links), se agregan de una vez.
    if (urls.length > 1 || (urls.length === 1 && /\s/.test(text.trim()))) {
      event.preventDefault();
      addMany(urls);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    }
  }

  function setPurpose(url: string, purpose: LinkPurpose) {
    onChange(links.map((l) => (l.url === url ? { ...l, purpose } : l)));
  }

  return (
    <div className={cn("flex flex-col gap-3 rounded-inner transition-shadow", highlight && "brief-flash")}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="gb-link" className="sr-only">
          Pega un enlace
        </label>
        <div className="relative min-w-0 flex-1">
          <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-mint text-ink">
            {preview ? <LinkTypeIcon link={preview} className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          </span>
          <input
            id="gb-link"
            type="text"
            inputMode="url"
            autoComplete="off"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError("");
            }}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
            placeholder="Pega tu Instagram, tu sitio, una carpeta de Drive…"
            aria-describedby="gb-link-help"
            aria-invalid={!!error}
            className="h-12 w-full rounded-inner bg-white pl-12 pr-4 text-[0.9375rem] font-medium text-ink outline-none ring-1 ring-inset ring-ink/10 placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-ink"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-lime transition-transform active:scale-[0.98]"
        >
          <Plus aria-hidden className="h-4 w-4" />
          Agregar
        </button>
      </div>
      <p id="gb-link-help" className={cn("px-1 text-xs", error ? "font-semibold text-ink" : "text-ink/55")} role={error ? "alert" : undefined}>
        {(error && `⚠ ${error}`) ||
          (preview
            ? `Detectamos: ${preview.label}. Da Enter o "Agregar".`
            : "Puedes pegar varios a la vez. Reconocemos redes, Drive, Dropbox, WeTransfer, Figma, Canva, Maps, tiendas y sitios.")}
      </p>

      {links.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label="Enlaces agregados">
          {links.map((link) => (
            <li
              key={link.url}
              className="flex flex-col gap-2 rounded-inner bg-white p-2.5 ring-1 ring-inset ring-ink/[0.08] sm:flex-row sm:items-center"
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-lime">
                  <LinkTypeIcon link={link} className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-ink/60">{link.label}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="block truncate text-sm font-semibold text-ink underline-offset-2 hover:underline"
                  >
                    {shortUrl(link.url)}
                  </a>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`purpose-${link.url}`}>
                  Para qué nos mandas este enlace
                </label>
                <select
                  id={`purpose-${link.url}`}
                  value={link.purpose}
                  onChange={(e) => setPurpose(link.url, e.target.value as LinkPurpose)}
                  className="h-10 min-w-0 flex-1 cursor-pointer rounded-full bg-mint px-3 text-xs font-semibold text-ink outline-none ring-1 ring-inset ring-ink/10 focus-visible:ring-2 focus-visible:ring-ink sm:w-52 sm:flex-none"
                >
                  {LINK_PURPOSES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onChange(links.filter((l) => l.url !== link.url))}
                  aria-label={`Quitar ${link.label}`}
                  className="grid size-10 shrink-0 place-items-center rounded-full text-ink/60 transition-colors hover:bg-signal/15 hover:text-ink"
                >
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

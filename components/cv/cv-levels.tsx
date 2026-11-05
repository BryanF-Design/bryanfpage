"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  Blocks,
  Boxes,
  BriefcaseBusiness,
  Clapperboard,
  Code2,
  Download,
  GraduationCap,
  Handshake,
  Languages,
  LockOpen,
  Mail,
  Network,
  Palette,
  Printer,
  Server,
  Sparkle,
  Star,
  UserPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

import {
  CV_CONTACT,
  INVENTORY,
  INVENTORY_SLOTS,
  QUESTS,
  SIDE_PROJECTS,
  TROPHIES,
  type InventoryItem,
  type Quest,
} from "@/lib/cv/data";
import type { CvDict } from "@/lib/cv/i18n";
import { cn } from "@/lib/utils";

import {
  Chip,
  ItemIcon,
  LevelHeader,
  LogoTile,
  Tilt,
  cvStyles as s,
  dragRowClass,
  useDragScroll,
} from "./cv-parts";
import { PlayerCard } from "./cv-player-card";

type LevelProps = { t: CvDict; index: number };

/**
 * Lista que en teléfono es un carrusel arrastrable y desde `sm` (o nunca, con
 * `always`) vuelve a ser rejilla normal.
 */
function DragRow({
  className,
  gridClassName,
  children,
  always = false,
}: {
  className?: string;
  gridClassName?: string;
  children: React.ReactNode;
  always?: boolean;
}) {
  const ref = useDragScroll<HTMLUListElement>();
  return (
    <ul
      ref={ref}
      data-drag-row=""
      className={cn(
        dragRowClass,
        s.stagger,
        "-mx-4 gap-2.5 px-4 pb-1",
        !always &&
          "sm:mx-0 sm:grid sm:cursor-auto sm:overflow-visible sm:px-0 sm:pb-0 sm:[-webkit-mask-image:none] sm:[mask-image:none]",
        !always && gridClassName,
        className
      )}
    >
      {children}
    </ul>
  );
}

/** Ancho de cada tarjeta dentro del carrusel móvil. */
const SLIDE = "w-[80%] shrink-0 snap-start sm:w-auto";

const POWER_ICONS: LucideIcon[] = [Code2, Network, Zap, Blocks, Clapperboard, Server, Handshake, Palette];

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(s.glass, "rounded-[1.6rem] p-5 md:p-6", className)}>{children}</div>;
}

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <h3 className={cn(s.pixel, "flex items-center gap-2 text-xs uppercase text-white/60 md:text-[0.8rem]")}>
      {Icon ? <Icon aria-hidden className="h-4 w-4 text-[var(--cv-lime)]" /> : null}
      {children}
    </h3>
  );
}

/* ═══ 01 · Perfil ═════════════════════════════════════════════════════════ */
export function ProfileLevel({ t, index }: LevelProps) {
  const p = t.profile;
  return (
    <div className={cn(s.levelEnter, "space-y-5")}>
      <LevelHeader index={index} levelLabel={t.ui.level} eyebrow={p.eyebrow} title={p.title} />

      {/* En pantallas sin columna lateral la ficha del jugador va aquí. */}
      <div className="lg:hidden">
        <PlayerCard t={t} compact />
      </div>

      <Card className="relative overflow-hidden">
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-[#b4e332]/10 blur-2xl" />
        <p className="relative text-pretty text-[0.98rem] leading-relaxed text-white/85 md:text-[1.05rem]">{p.summary}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <Card>
          <SectionTitle icon={LockOpen}>{p.classesTitle}</SectionTitle>
          <ul className={cn(s.stagger, "mt-4 flex flex-wrap gap-2")}>
            {p.classes.map((c, i) => (
              <li key={c} style={{ "--i": i } as CSSProperties}>
                <Chip tone={i < 2 ? "lime" : "dark"} className="px-3.5 py-1.5 text-[0.8rem]">
                  <Star aria-hidden className={cn("h-3.5 w-3.5", i < 2 ? "fill-[#0c1512]" : "text-[var(--cv-lime)]")} />
                  {c}
                </Chip>
              </li>
            ))}
          </ul>
        </Card>
        {/* Cifra comercial del estudio (no individual): así la presenta el sitio. */}
        <div className="relative overflow-hidden rounded-[1.6rem] bg-[var(--cv-lime)] p-5 text-[#0c1512] md:w-64 md:p-6">
          <span aria-hidden className={cn(s.spinSlow, "absolute -right-8 -top-8 size-28 rounded-full border-[10px] border-dashed border-[#0c1512]/15")} />
          <p className="relative font-display text-6xl font-black leading-none tracking-[-0.04em] [font-stretch:120%]">150+</p>
          <p className="relative mt-2 text-sm font-semibold leading-snug">{p.studioLabel}</p>
          <p className={cn(s.pixel, "relative mt-3 text-[0.65rem] uppercase opacity-70")}>{p.marketsLabel}</p>
        </div>
      </div>

      <div>
        <SectionTitle icon={Sparkle}>{p.powersTitle}</SectionTitle>
        <DragRow className="mt-4" gridClassName="sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          {p.powers.map((power, i) => {
            const Icon = POWER_ICONS[i] ?? Sparkle;
            return (
              <li key={power.title} style={{ "--i": i } as CSSProperties} className={SLIDE}>
                <Tilt className="h-full rounded-[1.4rem]">
                  <div className={cn(s.glass, "group flex h-full flex-col rounded-[1.4rem] p-4")}>
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-2xl bg-[var(--cv-lime)] text-[#0c1512] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon aria-hidden className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <span className={cn(s.pixel, "text-[0.65rem] text-white/35")}>SP-{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="mt-3 font-bold leading-tight">{power.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">{power.desc}</p>
                  </div>
                </Tilt>
              </li>
            );
          })}
        </DragRow>
      </div>
    </div>
  );
}

/* ═══ 02 · Misiones ═══════════════════════════════════════════════════════ */
function QuestLogos({ quest, size = "md" }: { quest: Quest; size?: "sm" | "md" | "lg" }) {
  // En los botones basta el primer logo; la ficha completa los muestra todos.
  const logos = size === "lg" ? quest.logos : quest.logos.slice(0, 1);
  const box =
    size === "lg" ? "h-16 w-32 rounded-2xl md:h-20 md:w-40" : size === "md" ? "h-12 w-24 rounded-xl" : "h-10 w-10 rounded-xl";
  if (quest.logos.length === 0) {
    return (
      <span
        aria-hidden
        className={cn(
          s.pixel,
          "grid shrink-0 place-items-center bg-white/[0.06] text-sm font-bold text-[var(--cv-lime)] ring-1 ring-inset ring-white/10",
          size === "sm" ? box : "h-12 w-12 rounded-xl"
        )}
      >
        {quest.monogram}
      </span>
    );
  }
  return (
    <span className="flex shrink-0 gap-1.5">
      {logos.map((logo, i) => (
        <LogoTile
          key={logo.src}
          logo={logo}
          alt={i === 0 ? quest.company : ""}
          className={cn(box, size === "sm" && "w-10")}
          imgClassName={logo.w / logo.h < 1.3 ? "h-[72%]" : undefined}
        />
      ))}
    </span>
  );
}

function QuestDetail({ quest, t }: { quest: Quest; t: CvDict }) {
  const q = t.quests.items[quest.id as keyof CvDict["quests"]["items"]];
  const period =
    quest.period === null
      ? quest.id === "indusecc"
        ? t.quests.concurrent
        : t.quests.noDate
      : quest.period.endsWith("–")
        ? `${quest.period} ${t.ui.today}`
        : quest.period;
  return (
    <article className={cn(s.glass, s.biteBr, "relative overflow-hidden rounded-[1.8rem] p-5 md:p-7")}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--cv-lime)] via-[#b4e332]/40 to-transparent" />
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <QuestLogos quest={quest} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={quest.kind === "main" ? "lime" : "outline"}>{t.quests.kinds[quest.kind]}</Chip>
            <span className={cn(s.pixel, "text-xs text-white/60")}>{period}</span>
          </div>
          <h3 className="mt-2 text-xl font-extrabold leading-tight md:text-2xl">{q.role}</h3>
          {quest.url ? (
            <a
              href={quest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--cv-lime)] hover:underline"
            >
              {quest.company}
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="mt-1 text-sm font-semibold text-white/70">{quest.company}</p>
          )}
        </div>
      </div>

      <p className="mt-5 text-pretty leading-relaxed text-white/80">
        <span className={cn(s.pixel, "mr-2 text-[0.7rem] uppercase text-[var(--cv-lime)]")}>{t.quests.scope}</span>
        {q.scope}
      </p>

      {(q.tech.length > 0 || q.ops.length > 0) && (
        <div className={cn("mt-5 grid gap-5", q.tech.length > 0 && q.ops.length > 0 && "md:grid-cols-2")}>
          {[
            { title: t.quests.techTitle, list: q.tech },
            { title: t.quests.opsTitle, list: q.ops },
          ]
            .filter((col) => col.list.length > 0)
            .map((col) => (
              <div key={col.title}>
                <SectionTitle>{col.title}</SectionTitle>
                <ul className="mt-3 space-y-2.5">
                  {col.list.map((line) => (
                    <li key={line} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-white/80">
                      <span aria-hidden className="mt-[0.55rem] size-2 shrink-0 rotate-45 bg-[var(--cv-lime)]" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4">
        <SectionTitle>{t.quests.loot}</SectionTitle>
        <ul className="mt-3 flex flex-wrap gap-2">
          {q.loot.map((l) => (
            <li key={l}>
              <Chip>+ {l}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function QuestsLevel({ t, index }: LevelProps) {
  const [active, setActive] = useState(QUESTS[0].id);
  const featured = QUESTS.slice(0, 5);
  const earlier = QUESTS.slice(5);

  const button = (quest: Quest, compact = false) => {
    const selected = quest.id === active;
    return (
      <button
        type="button"
        onClick={() => setActive(quest.id)}
        aria-pressed={selected}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-300",
          selected
            ? "bg-white text-[#0c1512] shadow-[0_14px_30px_-12px_rgb(180_227_50/0.6)]"
            : cn(s.glass, "hover:-translate-y-0.5 hover:border-[#b4e332]/50"),
          compact ? "min-h-[4rem]" : "min-h-[5rem]"
        )}
      >
        <QuestLogos quest={quest} size={compact ? "sm" : "md"} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{quest.company}</span>
          <span className={cn(s.pixel, "mt-0.5 block text-[0.62rem] uppercase", selected ? "text-[#0c1512]/60" : "text-white/50")}>
            {t.quests.kinds[quest.kind]}
          </span>
        </span>
        {selected && (
          <span aria-hidden className={cn(s.pixel, "absolute -top-2 right-3 rounded-full bg-[var(--cv-lime)] px-2 py-0.5 text-[0.6rem] text-[#0c1512]")}>
            ▶ ON
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={cn(s.levelEnter, "space-y-5")}>
      <LevelHeader index={index} levelLabel={t.ui.level} eyebrow={t.quests.eyebrow} title={t.quests.title} />

      <DragRow gridClassName="sm:grid-cols-2 xl:grid-cols-3">
        {featured.map((quest, i) => (
          <li key={quest.id} style={{ "--i": i } as CSSProperties} className={cn(SLIDE, "w-[78%] pt-2 sm:pt-0")}>
            {button(quest)}
          </li>
        ))}
      </DragRow>

      {/* En pantalla solo la misión elegida; al imprimir, todas. */}
      {QUESTS.map((quest) => (
        <div key={quest.id} className={cn(quest.id === active ? "block" : "hidden print:block", "print:mb-4")}>
          <QuestDetail quest={quest} t={t} />
        </div>
      ))}

      <div>
        <SectionTitle icon={BriefcaseBusiness}>{t.quests.earlier}</SectionTitle>
        <DragRow className="mt-3" gridClassName="sm:grid-cols-2">
          {earlier.map((quest, i) => (
            <li key={quest.id} style={{ "--i": i } as CSSProperties} className={cn(SLIDE, "w-[72%]")}>
              {button(quest, true)}
            </li>
          ))}
        </DragRow>
      </div>
    </div>
  );
}

/* ═══ 03 · Inventario ═════════════════════════════════════════════════════ */
function itemName(item: InventoryItem, t: CvDict) {
  const inv = t.inventory;
  if (item.slot === "lead") return inv.leadNames[item.id as keyof typeof inv.leadNames] ?? item.name;
  if (item.id in inv.autoNames) return inv.autoNames[item.id as keyof typeof inv.autoNames];
  if (item.id in inv.infraNames) return inv.infraNames[item.id as keyof typeof inv.infraNames];
  return item.name;
}

const SLOT_ICONS: Record<(typeof INVENTORY_SLOTS)[number], LucideIcon> = {
  front: Code2,
  infra: Server,
  auto: Zap,
  design: Palette,
  lead: Boxes,
};

export function InventoryLevel({ t, index }: LevelProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const pickedItem = INVENTORY.find((i) => i.id === picked) ?? null;

  return (
    <div className={cn(s.levelEnter, "space-y-5")}>
      <LevelHeader index={index} levelLabel={t.ui.level} eyebrow={t.inventory.eyebrow} title={t.inventory.title} />

      <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-[4px] ring-2 ring-[var(--cv-lime)]" />
          {t.inventory.tiers.core}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-[4px] ring-1 ring-white/30" />
          {t.inventory.tiers.extra}
        </span>
      </div>

      {/* Ficha del objeto elegido, como el panel de una tienda. */}
      <div
        aria-live="polite"
        className={cn(
          s.glass,
          "flex min-h-[5.25rem] items-center gap-4 rounded-[1.4rem] p-4 transition-colors",
          pickedItem && "border-[#b4e332]/50"
        )}
      >
        {pickedItem ? (
          <>
            <span key={pickedItem.id} className={cn(s.slot, s.luminaSwap, "grid size-14 shrink-0 place-items-center rounded-2xl")}>
              <ItemIcon item={pickedItem} className="h-8 w-8" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-extrabold leading-tight">{itemName(pickedItem, t)}</span>
              <span className={cn(s.pixel, "mt-1 block text-[0.65rem] uppercase text-[var(--cv-lime)]")}>
                {t.inventory.slots[pickedItem.slot]} · {t.inventory.tiers[pickedItem.tier]}
              </span>
            </span>
          </>
        ) : (
          <p className="text-sm text-white/55">
            <Sparkle aria-hidden className="mr-1.5 inline h-4 w-4 text-[var(--cv-lime)]" />
            {t.inventory.hint}
          </p>
        )}
      </div>

      {INVENTORY_SLOTS.map((slot) => {
        const items = INVENTORY.filter((i) => i.slot === slot);
        const Icon = SLOT_ICONS[slot];
        return (
          <section key={slot} aria-label={t.inventory.slots[slot]}>
            <SectionTitle icon={Icon}>{t.inventory.slots[slot]}</SectionTitle>
            <ul className={cn(s.stagger, "mt-3 grid grid-cols-4 gap-2 sm:gap-2.5 md:grid-cols-5 xl:grid-cols-7")}>
              {items.map((item, i) => {
                const name = itemName(item, t);
                return (
                  <li key={item.id} style={{ "--i": i } as CSSProperties}>
                    <button
                      type="button"
                      onClick={() => setPicked(item.id)}
                      onMouseEnter={() => setPicked(item.id)}
                      aria-pressed={picked === item.id}
                      className={cn(
                        s.slot,
                        item.tier === "core" && s.slotCore,
                        "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center",
                        picked === item.id && "!border-[var(--cv-lime)]"
                      )}
                    >
                      <ItemIcon item={item} className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      <span className="line-clamp-2 text-[0.6rem] font-semibold leading-tight text-white/80 sm:text-[0.68rem] md:text-[0.72rem]">
                        {name}
                      </span>
                      {item.tier === "core" && (
                        <span aria-hidden className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--cv-lime)]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ═══ 04 · Logros ═════════════════════════════════════════════════════════ */
export function TrophiesLevel({ t, index }: LevelProps) {
  const [active, setActive] = useState(TROPHIES[0].id);

  return (
    <div className={cn(s.levelEnter, "space-y-5")}>
      <LevelHeader index={index} levelLabel={t.ui.level} eyebrow={t.trophies.eyebrow} title={t.trophies.title} />

      {/* Estante: un botón por trofeo. */}
      <DragRow always className="md:-mx-1 md:px-1">
        {TROPHIES.map((trophy, i) => {
          const selected = trophy.id === active;
          return (
            <li key={trophy.id} className="snap-start" style={{ "--i": i } as CSSProperties}>
              <button
                type="button"
                onClick={() => setActive(trophy.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-14 min-w-[9.5rem] items-center gap-2.5 rounded-2xl px-3 text-left text-sm font-bold transition-all duration-300",
                  selected ? "bg-[var(--cv-lime)] text-[#0c1512]" : cn(s.glass, "text-white/80 hover:text-white")
                )}
              >
                <span aria-hidden className={cn(s.pixel, "text-[0.65rem]", selected ? "text-[#0c1512]/60" : "text-[var(--cv-lime)]")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-nowrap">{trophy.name}</span>
              </button>
            </li>
          );
        })}
      </DragRow>

      {TROPHIES.map((trophy) => {
        const item = t.trophies.items[trophy.id as keyof CvDict["trophies"]["items"]];
        return (
          <div key={trophy.id} className={cn(trophy.id === active ? "block" : "hidden print:block", "print:mb-4")}>
            <article className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
              <Tilt max={6} className="rounded-[1.6rem]">
                <div className={cn(s.glass, s.luminaSwap, "overflow-hidden rounded-[1.6rem] p-2")}>
                  {/* Marco de navegador. */}
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-3 truncate rounded-full bg-white/[0.06] px-3 py-0.5 text-[0.7rem] text-white/50">
                      {trophy.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </span>
                  </div>
                  <div
                    className="relative overflow-hidden rounded-[1.1rem] bg-black"
                    style={{ aspectRatio: `${trophy.shot.w} / ${trophy.shot.h}` }}
                  >
                    <Image
                      src={trophy.shot.src}
                      alt={trophy.name}
                      fill
                      sizes="(min-width: 1280px) 520px, (min-width: 1024px) 60vw, 100vw"
                      className="object-cover object-top transition-transform [transition-duration:1200ms] ease-out hover:scale-[1.04]"
                    />
                  </div>
                </div>
              </Tilt>
              <div className={cn(s.glass, "relative flex flex-col rounded-[1.6rem] p-5 md:p-6")}>
                <div className="flex items-center gap-3">
                  {trophy.logo ? (
                    <LogoTile
                      logo={trophy.logo}
                      alt={trophy.name}
                      className="h-14 w-28 shrink-0 rounded-2xl"
                      imgClassName={trophy.logo.w / trophy.logo.h < 1.3 ? "h-[76%]" : undefined}
                    />
                  ) : (
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--cv-lime)] text-[#0c1512]">
                      <Star aria-hidden className="h-6 w-6 fill-[#0c1512]" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold leading-tight">{trophy.name}</h3>
                    <p className={cn(s.pixel, "mt-1 text-[0.65rem] uppercase text-[var(--cv-lime)]")}>{item.sector}</p>
                  </div>
                </div>
                <p className="mt-4 text-pretty leading-relaxed text-white/80">{item.desc}</p>
                <div className="mt-4">
                  <Chip tone="outline">{t.trophies.credits[trophy.credit]}</Chip>
                </div>
                <a
                  href={trophy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0c1512] transition-transform duration-200 hover:-translate-y-0.5 max-xl:mt-5 xl:mt-6"
                >
                  {t.ui.visit}
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </article>
          </div>
        );
      })}

      <div>
        <SectionTitle icon={Star}>{t.trophies.more}</SectionTitle>
        <ul className={cn(s.stagger, "mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3")}>
          {SIDE_PROJECTS.filter((p) => p.shot || p.logo).map((project, i) => (
            <li key={project.name} style={{ "--i": i } as CSSProperties}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(s.glass, "group block overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1")}
              >
                <span className="relative block aspect-[16/9] overflow-hidden bg-[#0a1210]">
                  {project.shot ? (
                    <Image
                      src={project.shot}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 260px, 45vw"
                      className="object-cover object-top opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : null}
                  {project.logo ? (
                    <LogoTile
                      logo={project.logo}
                      alt=""
                      className={cn(
                        "rounded-lg shadow-lg",
                        project.shot ? "absolute bottom-2 left-2 h-9 w-20" : "absolute inset-3"
                      )}
                    />
                  ) : null}
                </span>
                <span className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold">
                  <span className="truncate">{project.name}</span>
                  <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-[var(--cv-lime)]" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {SIDE_PROJECTS.filter((p) => !p.shot && !p.logo).map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(s.glass, "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:border-[#b4e332]/60")}
              >
                {project.name}
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-[var(--cv-lime)]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ═══ 05 · Academia ═══════════════════════════════════════════════════════ */
export function AcademyLevel({ t, index }: LevelProps) {
  const a = t.academy;
  return (
    <div className={cn(s.levelEnter, "space-y-5")}>
      <LevelHeader index={index} levelLabel={t.ui.level} eyebrow={a.eyebrow} title={a.title} />

      <ul className="grid gap-3 md:grid-cols-2">
        {a.education.map((ed, i) => (
          <li key={ed.school}>
            <Tilt className="h-full rounded-[1.6rem]">
              <div
                className={cn(
                  "flex h-full flex-col rounded-[1.6rem] p-5 md:p-6",
                  i === 0 ? "bg-white text-[#0c1512]" : cn(s.glass)
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl",
                      i === 0 ? "bg-[#0c1512] text-[var(--cv-lime)]" : "bg-[var(--cv-lime)] text-[#0c1512]"
                    )}
                  >
                    <GraduationCap aria-hidden className="h-6 w-6" />
                  </span>
                  <span className={cn(s.pixel, "text-xs", i === 0 ? "text-[#0c1512]/60" : "text-white/60")}>
                    {ed.period.endsWith("–") ? `${ed.period} ${t.ui.today}` : ed.period}
                  </span>
                </div>
                <p className="mt-4 text-lg font-extrabold leading-snug">{ed.degree}</p>
                <p className={cn("mt-1 text-sm", i === 0 ? "text-[#0c1512]/65" : "text-white/65")}>{ed.school}</p>
              </div>
            </Tilt>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionTitle icon={Zap}>{a.coursesTitle}</SectionTitle>
          <ol className="relative mt-4 space-y-3 before:absolute before:bottom-2 before:left-[1.45rem] before:top-2 before:w-px before:bg-white/15">
            {a.courses.map((c, i) => (
              <li key={`${c.year}-${i}`} className="relative flex items-start gap-3">
                <span className={cn(s.pixel, "relative z-10 grid h-7 w-[2.9rem] shrink-0 place-items-center rounded-full bg-[var(--cv-lime)] text-[0.65rem] font-bold text-[#0c1512]")}>
                  {c.year}
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-sm font-semibold leading-snug">{c.name}</span>
                  {c.org ? <span className="block text-xs text-white/55">{c.org}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="flex flex-col">
          <SectionTitle icon={Languages}>{a.languagesTitle}</SectionTitle>
          <ul className="mt-4 space-y-3">
            {a.languages.map((l, i) => (
              <li key={l.name} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3.5">
                <span className={cn(s.pixel, "grid size-11 shrink-0 place-items-center rounded-xl bg-white text-sm font-bold text-[#0c1512]")}>
                  {i === 0 ? "ES" : "EN"}
                </span>
                <span>
                  <span className="block font-bold">{l.name}</span>
                  <span className="block text-sm text-[var(--cv-lime)]">{l.level}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ═══ 06 · Continuar / Contacto ══════════════════════════════════════════ */
export function ContactLevel({ t, index }: LevelProps) {
  const c = t.contact;
  const actions = [
    { label: c.whatsapp, href: CV_CONTACT.whatsapp, Icon: FaWhatsapp, primary: true, external: true },
    { label: c.email, href: `mailto:${CV_CONTACT.email}`, Icon: Mail, primary: false, external: false },
    { label: c.website, href: CV_CONTACT.website, Icon: ArrowUpRight, primary: false, external: true },
    { label: "LinkedIn", href: CV_CONTACT.linkedin, Icon: FaLinkedinIn, primary: false, external: true },
    { label: "GitHub", href: CV_CONTACT.github, Icon: FaGithub, primary: false, external: true },
    { label: c.vcard, href: CV_CONTACT.vcard, Icon: UserPlus, primary: false, external: false },
  ];

  return (
    <div className={cn(s.levelEnter, "space-y-5")}>
      <LevelHeader index={index} levelLabel={t.ui.level} eyebrow={c.eyebrow} title={c.text} />

      <div className="relative overflow-hidden rounded-[2rem] bg-[var(--cv-paper)] px-5 pb-6 pt-10 text-[#0c1512] md:px-10 md:pb-10 md:pt-14">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgb(12_21_18/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(12_21_18/0.07)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="relative grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <span className={cn(s.selected, "inline-block bg-[var(--cv-lime)] px-4 py-1 md:px-6")}>
              <span className="block font-display text-[2.35rem] font-black leading-[0.95] tracking-[-0.04em] [font-stretch:118%] min-[420px]:text-[2.9rem] sm:text-7xl sm:[font-stretch:125%] md:text-8xl">
                {c.thank}
              </span>
              <span aria-hidden className={s.handleBl} />
              <span aria-hidden className={s.handleBr} />
            </span>
            <p className={cn(s.scriptWord, "-mt-1 ml-10 -rotate-3 text-5xl sm:text-6xl md:ml-24 md:text-7xl")}>{c.script}!!</p>
          </div>
          <Image
            src="/img/cv/bryan-photo.webp"
            alt=""
            width={760}
            height={1013}
            sizes="(min-width: 768px) 200px, 150px"
            className="pointer-events-none -mb-6 hidden h-auto w-[160px] justify-self-end drop-shadow-[0_18px_24px_rgb(0_0_0/0.35)] sm:block md:-mb-10 md:w-[200px]"
          />
        </div>
      </div>

      <ul className={cn(s.stagger, "grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3")}>
        {actions.map(({ label, href, Icon, primary, external }, i) => (
          <li key={label} style={{ "--i": i } as CSSProperties}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(href.endsWith(".vcf") ? { download: "bryan-f.vcf" } : {})}
              className={cn(
                "group flex min-h-[3.75rem] items-center justify-between gap-3 rounded-2xl px-5 font-bold transition-all duration-200 hover:-translate-y-0.5",
                primary ? "bg-[var(--cv-lime)] text-[#0c1512]" : cn(s.glass, "hover:border-[#b4e332]/60")
              )}
            >
              {label}
              <Icon aria-hidden className="h-5 w-5 transition-transform group-hover:scale-110" />
            </a>
          </li>
        ))}
        <li style={{ "--i": actions.length } as CSSProperties} className="print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex min-h-[3.75rem] w-full items-center justify-between gap-3 rounded-2xl bg-white px-5 font-bold text-[#0c1512] transition-all duration-200 hover:-translate-y-0.5"
          >
            {c.print}
            <Printer aria-hidden className="h-5 w-5" />
          </button>
        </li>
      </ul>

      <Card>
        <SectionTitle icon={BriefcaseBusiness}>{c.roles}</SectionTitle>
        <ul className="mt-3 flex flex-wrap gap-2">
          {c.rolesList.map((r) => (
            <li key={r}>
              <Chip tone="outline" className="px-3.5 py-1.5 text-[0.8rem]">
                {r}
              </Chip>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
          <a href={`mailto:${CV_CONTACT.email}`} className="hover:text-white">
            {CV_CONTACT.email}
          </a>
          <a href={`tel:${CV_CONTACT.phone}`} className="hover:text-white">
            {CV_CONTACT.phoneLabel}
          </a>
          <a href={CV_CONTACT.website} className="hover:text-white">
            bryanfdesign.com
          </a>
          <span className="inline-flex items-center gap-1">
            <Download aria-hidden className="h-3.5 w-3.5" />
            <a href={CV_CONTACT.vcard} download="bryan-f.vcf" className="hover:text-white">
              vCard
            </a>
          </span>
        </p>
      </Card>
    </div>
  );
}

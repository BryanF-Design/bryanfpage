"use client";

import { ArrowRight, Megaphone, MessageSquareDashed, X } from "lucide-react";

import { activeSeason, seasonDef, type SiteSettings } from "@/lib/seasons";

import { Button, Card, Field, Input, Textarea, Toggle } from "./admin-ui";

function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : "");

/**
 * Avisos: la píldora bajo el menú (reemplaza al aviso de temporada mientras
 * esté activa) y el pop-up que sale una vez por visita.
 */
export function NoticesTab({
  draft,
  setDraft,
}: {
  draft: SiteSettings;
  setDraft: React.Dispatch<React.SetStateAction<SiteSettings>>;
}) {
  const a = draft.announcement;
  const p = draft.popup;
  const setA = (patch: Partial<SiteSettings["announcement"]>) => setDraft((s) => ({ ...s, announcement: { ...s.announcement, ...patch } }));
  const setP = (patch: Partial<SiteSettings["popup"]>) => setDraft((s) => ({ ...s, popup: { ...s.popup, ...patch } }));
  const season = activeSeason(draft, Date.now());
  const discount = draft.discounts.enabled ? draft.discounts.global : 0;

  function fillFromSeason() {
    if (!season) return;
    const name = draft.discounts.label || seasonDef(season).name;
    setP({
      enabled: true,
      title: discount ? `${discount}% de descuento por ${name}` : `Temporada de ${seasonDef(season).name}`,
      text: discount
        ? "En todos los servicios del cotizador y los de entrada. Arma tu web y paga ya con el descuento."
        : seasonDef(season).banner,
      cta: discount ? "Aprovechar descuento" : "Arma tu web",
      href: "/#precios",
    });
  }

  return (
    <>
      <Card id="announcement-title" title="Aviso arriba" icon={Megaphone}>
        <Toggle
          checked={a.enabled}
          onChange={(v) => setA({ enabled: v })}
          label="Mostrar mi aviso"
          description="Aparece bajo el menú en todas las páginas; en temporada, ocupa el lugar del aviso de temporada."
        />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Texto" className="md:col-span-2">
            <Input value={a.text} maxLength={180} onChange={(e) => setA({ text: e.target.value })} placeholder="Ej. Esta semana: tarjeta digital gratis con tu web" />
          </Field>
          <Field label="Botón">
            <Input value={a.cta} maxLength={40} onChange={(e) => setA({ cta: e.target.value })} placeholder="Ver más" />
          </Field>
          <Field label="Lleva a" hint="Una ruta del sitio (/suscripcion) o un enlace https://">
            <Input value={a.href} onChange={(e) => setA({ href: e.target.value })} placeholder="/#precios" />
          </Field>
          <Field label="Termina" hint="Vacío: hasta que lo apagues.">
            <Input type="datetime-local" value={toLocalInput(a.endsAt)} onChange={(e) => setA({ endsAt: fromLocalInput(e.target.value) })} />
          </Field>
        </div>
        <div aria-hidden className="rounded-[1.25rem] bg-canvas p-4">
          <p className="mb-2 text-xs font-semibold text-ink/50">Así se ve</p>
          <div className="season-strip mx-auto flex w-fit max-w-full items-center gap-2 rounded-full py-1.5 pl-3 pr-1.5 text-[0.8125rem] font-semibold">
            {discount > 0 && <strong className="rounded-full bg-ink px-1.5 py-0.5 text-[0.75rem] text-lime">-{discount}%</strong>}
            <span className="line-clamp-1">{a.text || "Tu aviso aquí"}</span>
            <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-ink px-3 text-xs font-bold text-white">
              {a.cta || "Ver más"} <ArrowRight className="h-3.5 w-3.5 text-lime" />
            </span>
            <X className="mx-1 h-4 w-4 opacity-60" />
          </div>
        </div>
      </Card>

      <Card
        id="popup-title"
        title="Pop-up de promoción"
        icon={MessageSquareDashed}
        action={
          season ? (
            <Button variant="soft" onClick={fillFromSeason}>
              Llenar con la temporada
            </Button>
          ) : undefined
        }
      >
        <Toggle
          checked={p.enabled}
          onChange={(v) => setP({ enabled: v })}
          label="Mostrar el pop-up"
          description="Una vez por visita, nunca en Mi panel, el pago o el brief. Se cierra con Escape o tocando fuera."
        />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Título" className="md:col-span-2">
            <Input value={p.title} maxLength={80} onChange={(e) => setP({ title: e.target.value })} placeholder="15% en todo por Día de Muertos" />
          </Field>
          <Field label="Texto" className="md:col-span-2">
            <Textarea value={p.text} maxLength={280} onChange={(e) => setP({ text: e.target.value })} />
          </Field>
          <Field label="Botón">
            <Input value={p.cta} maxLength={40} onChange={(e) => setP({ cta: e.target.value })} placeholder="Ver la promoción" />
          </Field>
          <Field label="Lleva a">
            <Input value={p.href} onChange={(e) => setP({ href: e.target.value })} placeholder="/#precios" />
          </Field>
          <Field label="Aparece a los (segundos)">
            <Input inputMode="numeric" value={String(p.delay)} onChange={(e) => setP({ delay: Math.min(120, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
          </Field>
          <Field label="Termina" hint="Vacío: hasta que lo apagues.">
            <Input type="datetime-local" value={toLocalInput(p.endsAt)} onChange={(e) => setP({ endsAt: fromLocalInput(e.target.value) })} />
          </Field>
        </div>
        <div aria-hidden className="grid place-items-center rounded-[1.25rem] bg-ink/40 p-6">
          <div className="w-full max-w-[22rem] rounded-[1.6rem] bg-white p-5 text-ink shadow-float">
            {discount > 0 && (
              <span className="mb-2 inline-flex rounded-full bg-lime px-3 py-1 text-[0.6875rem] font-black uppercase tracking-wide">
                {draft.discounts.label || "Promoción"} · -{discount}%
              </span>
            )}
            <p className="display-title text-2xl leading-[0.95]">{p.title || "Tenemos algo para ti"}</p>
            {p.text && <p className="mt-2 text-sm text-ink/70">{p.text}</p>}
            <span className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white">
              {p.cta || "Ver la promoción"} <ArrowRight className="h-4 w-4 text-lime" />
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}

import { Clock, Mail, MessageCircle, Phone, Rocket, Video } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

import { STUDIO_FACTS } from "@/lib/brief";

const NEXT_STEPS = [
  { Icon: MessageCircle, title: "Revisamos tu briefing", body: "En menos de 24 horas hábiles te mandamos la ruta del proyecto." },
  { Icon: Video, title: "Arranque por videollamada", body: "20 minutos para alinear objetivos, tiempos y materiales." },
  { Icon: Rocket, title: "Construimos contigo", body: "Te enseñamos avances y ajustamos hasta publicar." },
];

const CONTACTS = [
  { Icon: FaWhatsapp, label: "WhatsApp", value: STUDIO_FACTS.whatsapp, href: STUDIO_FACTS.whatsappHref },
  { Icon: Mail, label: "Correo", value: STUDIO_FACTS.email, href: `mailto:${STUDIO_FACTS.email}` },
  { Icon: Phone, label: "Llamada", value: STUDIO_FACTS.whatsapp, href: STUDIO_FACTS.phoneHref },
  { Icon: FaInstagram, label: "Instagram", value: "@bryanf_design", href: STUDIO_FACTS.instagram },
  { Icon: FaFacebook, label: "Facebook", value: "BryanF Design", href: STUDIO_FACTS.facebook },
  { Icon: FaLinkedin, label: "LinkedIn", value: "Bryan F.", href: STUDIO_FACTS.linkedin },
];

/**
 * Quiénes somos, qué sigue y cómo contactarnos: lo que el cliente necesita
 * saber justo después de pagar.
 */
export function StudioInfo({ subscription }: { subscription: boolean }) {
  return (
    <section aria-labelledby="studio-title" className="grid gap-gutter lg:grid-cols-12">
      <div className="panel flex flex-col gap-5 p-5 pt-6 shadow-soft sm:p-8 lg:col-span-5">
        <span className="eyebrow w-fit pl-3">
          <span aria-hidden className="size-2 rounded-full bg-lime" />
          Quiénes somos
        </span>
        <h2 id="studio-title" className="display-title text-balance text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1] text-ink">
          Un estudio chico, con más de 150 proyectos encima
        </h2>
        <p className="text-pretty text-[0.975rem] leading-relaxed text-muted-foreground">
          BryanF Design es un estudio de diseño y desarrollo web en Ciudad de México, fundado en 2020. Hemos hecho
          sitios, tiendas y plataformas para negocios en México, España y Francia. Trabajas directo con Bryan: sin
          intermediarios ni tickets perdidos.
        </p>
        <ul className="grid grid-cols-3 gap-2 text-center">
          {[
            { value: "+150", label: "proyectos" },
            { value: "3", label: "países" },
            { value: subscription ? "1–2" : "3", label: subscription ? "días por solicitud" : "días hábiles desde" },
          ].map((s) => (
            <li key={s.label} className="rounded-card bg-mint px-2 py-3 ring-1 ring-inset ring-ink/[0.06]">
              <span className="display-title block text-[1.75rem] leading-none text-ink">{s.value}</span>
              <span className="mt-1 block text-xs font-semibold text-ink/60">{s.label}</span>
            </li>
          ))}
        </ul>
        <ol className="flex flex-col gap-3">
          {NEXT_STEPS.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[0.9375rem] font-semibold text-ink">{title}</span>
                <span className="block text-sm leading-snug text-ink/65">{body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="panel panel-ink flex flex-col gap-5 p-5 pt-6 sm:p-8 lg:col-span-7">
        <span className="eyebrow w-fit bg-white/10 pl-3 text-white">
          <span aria-hidden className="size-2 rounded-full bg-lime" />
          Medios de contacto
        </span>
        <p className="display-title text-balance text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1] text-white">
          Escríbenos por donde te acomode
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CONTACTS.map(({ Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex min-h-14 items-center gap-3 rounded-card bg-white/[0.06] p-3 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]"
              >
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-white/60">{label}</span>
                  <span className="block truncate text-[0.9375rem] font-semibold text-white">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-auto flex items-start gap-2 text-sm text-white/70">
          <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
          {STUDIO_FACTS.hours}. Respondemos en menos de 24 horas hábiles.
        </p>
      </div>
    </section>
  );
}

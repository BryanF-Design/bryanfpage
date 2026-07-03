import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const GOOGLE_MAPS_REVIEW = "https://maps.app.goo.gl/CWNcgPfAZt31K3ey6";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram", glow: "#E1306C" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook", glow: "#1877F2" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp", glow: "#25D366" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn", glow: "#0A66C2" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub", glow: "#FFFFFF" },
];

const nav = [
  { label: "Inicio", href: "#home" },
  { label: "Proceso", href: "#proceso" },
  { label: "Proyectos", href: "#projects" },
  { label: "Precios", href: "#precios" },
  { label: "FAQ", href: "#faq" },
];

const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="border-t border-border bg-background" aria-label="Pie de página">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            style={{ height: 46, width: "auto" }}
            className="object-contain"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Diseño que vende</span>
            , no sólo que luce. Webs rápidas, animadas y a la medida, desde México.
          </p>
          <div className="flex gap-3">
            {social.map(({ Icon, href, label, glow }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ ["--glow" as string]: glow }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-[var(--glow)] hover:text-[var(--glow)] hover:shadow-[0_0_16px_var(--glow)]"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="Navegación del pie">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Navegación
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={CLIENT_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                ¿Ya eres cliente?
              </Link>
            </li>
          </ul>
        </nav>

        {/* Legal + contacto */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Legal y contacto
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/privacidad" className="text-foreground/80 transition-colors hover:text-primary">
                Aviso de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="text-foreground/80 transition-colors hover:text-primary">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <a href="mailto:bryanf@bryanfdesign.com.mx" className="text-foreground/80 transition-colors hover:text-primary">
                bryanf@bryanfdesign.com.mx
              </a>
            </li>
            <li>
              <a href="https://wa.me/525663012505" target="_blank" rel="noopener noreferrer" className="text-foreground/80 transition-colors hover:text-primary">
                WhatsApp directo
              </a>
            </li>
            <li>
              <a
                href={GOOGLE_MAPS_REVIEW}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5" />
                Déjanos tu reseña en Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} BryanF Design · Hecho en México</span>
          <span>
            Al contactarnos aceptas nuestro{" "}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-primary">
              Aviso de Privacidad
            </Link>{" "}
            y{" "}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-primary">
              Términos
            </Link>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}

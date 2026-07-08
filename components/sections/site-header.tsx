import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP = "https://wa.me/525663012505";
const CLIENT_PORTAL = "https://access.bryanfdesign.com.mx/";

const links = [
  { label: "Proceso", href: "/#proceso" },
  { label: "Proyectos", href: "/#projects" },
  { label: "Precios", href: "/#precios" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4">
      <div className="glass-nav relative flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 px-5 py-3 shadow-lg shadow-black/30">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/[0.04]" />
        <Link href="/" className="flex items-center" aria-label="BryanF Design — inicio">
          <Image
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            priority
            style={{ height: 42, width: "auto" }}
            className="object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              ¿Ya eres cliente?
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/#precios">Arma tu web</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

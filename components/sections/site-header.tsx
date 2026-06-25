import Link from "next/link";
import { Button } from "@/components/ui/button";

const WHATSAPP = "https://wa.me/525663012505";

const links = [
  { label: "Proceso", href: "#proceso" },
  { label: "Proyectos", href: "#projects" },
  { label: "Precios", href: "#precios" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-border bg-background/70 px-5 py-2.5 backdrop-blur-xl">
        <Link href="#home" className="flex items-center" aria-label="BryanF Design — inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logotipo-blanco.png"
            alt="BryanF Design"
            width={2904}
            height={1016}
            style={{ height: 30, width: "auto" }}
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

        <Button asChild size="sm" className="rounded-full">
          <Link href="#precios">Arma tu web</Link>
        </Button>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

const WHATSAPP = "https://wa.me/525663012505";

const links = [
  { label: "Proceso", href: "#proceso" },
  { label: "Stack", href: "#stack" },
  { label: "Proyectos", href: "#projects" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-border bg-background/70 px-5 py-2.5 backdrop-blur-xl">
        <Link
          href="#home"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          BryanF
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
          <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            Cotizar
          </Link>
        </Button>
      </div>
    </header>
  );
}

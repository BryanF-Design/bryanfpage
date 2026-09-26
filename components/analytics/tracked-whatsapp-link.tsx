"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackEvent } from "@/lib/analytics";

export function TrackedWhatsAppLink({
  href,
  service,
  children,
  className,
}: {
  href: string;
  service: string;
  children: ReactNode;
  /** Lo inyecta `Button asChild`; sin reenviarlo el enlace salía sin estilo. */
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("generate_lead", { method: "whatsapp", service })}
    >
      {children}
    </Link>
  );
}

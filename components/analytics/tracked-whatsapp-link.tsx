"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackEvent } from "@/lib/analytics";

export function TrackedWhatsAppLink({
  href,
  service,
  children,
}: {
  href: string;
  service: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("generate_lead", { method: "whatsapp", service })}
    >
      {children}
    </Link>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Enlace de WhatsApp con el servicio de origen. El evento `generate_lead` lo
 * envía el listener global de `ClickTracking`, que lee `data-track-service`.
 */
export function TrackedWhatsAppLink({
  href,
  service,
  children,
  className,
  onPointerDown,
}: {
  href: string;
  service: string;
  children: ReactNode;
  /** Lo inyecta `Button asChild`; sin reenviarlo el enlace salía sin estilo. */
  className?: string;
  /** Para apagar el pulso del botón al tocarlo. */
  onPointerDown?: () => void;
}) {
  return (
    <Link
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      data-track-service={service}
      onPointerDown={onPointerDown}
    >
      {children}
    </Link>
  );
}

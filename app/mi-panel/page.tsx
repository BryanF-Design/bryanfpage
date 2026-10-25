import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ClientPanelPage } from "@/components/subscriber-panel/client-panel-page";
import { CLIENT_COOKIE, readClientSession } from "@/lib/client-session";
import { loadClientPanel } from "@/lib/client-panel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi panel | BryanF Design",
  description: "Panel de clientes de BryanF Design: tu proyecto o tu suscripción, tus pagos y tus solicitudes.",
  alternates: { canonical: "/mi-panel" },
  robots: { index: false, follow: false },
};

/**
 * /mi-panel — el panel de cada cliente (compra única o suscripción). Sin
 * sesión pide el correo (enlace) o la contraseña; con sesión muestra todo.
 */
export default async function MiPanelPage({ searchParams }: { searchParams: { e?: string } }) {
  const email = readClientSession(cookies().get(CLIENT_COOKIE)?.value);
  if (!email) return <ClientPanelPage state={{ kind: "login", linkError: searchParams.e === "enlace" }} />;

  const panel = await loadClientPanel(email);
  if (!panel) return <ClientPanelPage state={{ kind: "empty", email }} />;
  return <ClientPanelPage state={{ kind: "panel", panel }} />;
}

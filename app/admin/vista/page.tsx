import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientPanelPage } from "@/components/subscriber-panel/client-panel-page";
import { ACCESS_COOKIE, verifySessionToken } from "@/lib/access-session";
import { loadClientPanel } from "@/lib/client-panel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /admin/vista?email=… — "ver como cliente": el Mi panel de esa persona tal
 * como lo ve ella, con los botones desactivados. Solo con sesión del panel.
 */
export default async function AdminPreviewPage({ searchParams }: { searchParams: { email?: string } }) {
  if (!verifySessionToken(cookies().get(ACCESS_COOKIE)?.value)) redirect("/admin");
  const email = (searchParams.email || "").trim().toLowerCase();
  const panel = email ? await loadClientPanel(email) : null;
  if (!panel) return <ClientPanelPage state={{ kind: "empty", email: email || "ese correo" }} />;
  return <ClientPanelPage state={{ kind: "panel", panel }} preview />;
}

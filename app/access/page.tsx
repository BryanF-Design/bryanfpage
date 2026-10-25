import { cookies } from "next/headers";

import { AccessDashboard } from "@/components/access/access-dashboard";
import { AccessLogin } from "@/components/access/access-login";
import { ACCESS_COOKIE, accessConfigured, verifySessionToken } from "@/lib/access-session";
import { listSubscribers } from "@/lib/subscribers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /access — BryanF Access, el panel privado: quién está suscrito, cuándo se
 * le cobra otra vez y cuántos días le faltan. Sin sesión, muestra el acceso.
 */
export default async function AccessPage() {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return <AccessLogin configured={accessConfigured()} />;
  }
  const data = await listSubscribers();
  return <AccessDashboard data={data} />;
}

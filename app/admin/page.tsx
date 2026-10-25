import { cookies } from "next/headers";

import { AdminDashboard } from "@/components/admin-panel/admin-dashboard";
import { AdminLogin } from "@/components/admin-panel/admin-login";
import { ACCESS_COOKIE, accessConfigured, verifySessionToken } from "@/lib/access-session";
import { listSubscribers } from "@/lib/subscribers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /admin — Panel BryanF, el panel privado: quién está suscrito, cuándo se
 * le cobra otra vez y cuántos días le faltan. Sin sesión, muestra el acceso.
 */
export default async function AdminPage() {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return <AdminLogin configured={accessConfigured()} />;
  }
  const data = await listSubscribers();
  return <AdminDashboard data={data} />;
}

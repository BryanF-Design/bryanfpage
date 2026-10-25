import { cookies } from "next/headers";

import { AdminApp, type AdminData } from "@/components/admin-panel/admin-app";
import { AdminLogin } from "@/components/admin-panel/admin-login";
import { ACCESS_COOKIE, accessConfigured, verifySessionToken } from "@/lib/access-session";
import { dbConfigured, listAccounts, rpc, type Account } from "@/lib/db";
import { listAllPayments } from "@/lib/payments";
import { normalizeSettings } from "@/lib/seasons";
import { listSubscribers } from "@/lib/subscribers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadSettings() {
  if (!dbConfigured()) return { settings: normalizeSettings({}), error: "" };
  try {
    const all = await rpc<Record<string, unknown>>("ajustes_todos");
    return { settings: normalizeSettings(all?.sitio), error: "" };
  } catch (error) {
    return { settings: normalizeSettings({}), error: error instanceof Error ? error.message : "No se pudo leer" };
  }
}

async function loadAccounts(): Promise<{ accounts: Account[]; error: string }> {
  if (!dbConfigured()) return { accounts: [], error: "" };
  try {
    return { accounts: (await listAccounts()) || [], error: "" };
  } catch (error) {
    return { accounts: [], error: error instanceof Error ? error.message : "No se pudo leer" };
  }
}

/**
 * /admin — Panel BryanF: el panel privado de todo el sitio. Resumen,
 * clientes (cuentas, contraseñas, ver como cliente), suscripciones, pagos,
 * temporadas, descuentos y avisos. Sin sesión, muestra el acceso.
 */
export default async function AdminPage({ searchParams }: { searchParams: { tab?: string } }) {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return <AdminLogin configured={accessConfigured()} />;
  }
  const [subscribers, payments, accounts, settings] = await Promise.all([
    listSubscribers(),
    listAllPayments(),
    loadAccounts(),
    loadSettings(),
  ]);
  const data: AdminData = {
    subscribers,
    payments: payments.payments,
    accounts: accounts.accounts,
    settings: settings.settings,
    db: dbConfigured(),
    errors: [...payments.errors, accounts.error, settings.error].filter(Boolean),
    fetchedAt: Date.now(),
  };
  return <AdminApp data={data} initialTab={searchParams.tab} />;
}

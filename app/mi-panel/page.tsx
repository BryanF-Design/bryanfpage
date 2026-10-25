import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ClientPanelPage } from "@/components/subscriber-panel/client-panel-page";
import { CLIENT_COOKIE, readClientSession } from "@/lib/client-session";
import { findSubscriptionsByEmail } from "@/lib/subscribers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi panel | BryanF Design",
  description: "Panel de los suscriptores de Todo Digital: tu plan, tu próximo cobro y tus solicitudes.",
  alternates: { canonical: "/mi-panel" },
  robots: { index: false, follow: false },
};

/**
 * /mi-panel — el panel del suscriptor. Sin sesión pide el correo y manda un
 * enlace de acceso; con sesión muestra su suscripción en vivo.
 */
export default async function MiPanelPage({ searchParams }: { searchParams: { e?: string } }) {
  const email = readClientSession(cookies().get(CLIENT_COOKIE)?.value);
  if (!email) return <ClientPanelPage state={{ kind: "login", linkError: searchParams.e === "enlace" }} />;

  const subs = await findSubscriptionsByEmail(email);
  const current = subs[0];
  if (!current) return <ClientPanelPage state={{ kind: "empty", email }} />;

  return (
    <ClientPanelPage
      state={{
        kind: "panel",
        data: {
          name: current.name,
          email,
          status: current.status,
          provider: current.provider,
          amount: current.amount,
          currency: current.currency,
          startedAt: current.startedAt,
          periodStart: current.periodStart,
          nextChargeAt: current.nextChargeAt,
          cancelAtPeriodEnd: current.cancelAtPeriodEnd,
          charges: current.charges,
          now: Date.now(),
        },
      }}
    />
  );
}

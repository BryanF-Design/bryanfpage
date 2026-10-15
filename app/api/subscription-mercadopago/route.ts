import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, PreApprovalPlan } from "mercadopago";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

/**
 * Suscripción mensual con Mercado Pago (plan de "Suscripciones" / preapproval).
 *
 * Mercado Pago cobra un plan recurrente: el cliente entra al `init_point` del
 * plan, da su tarjeta y MP cobra cada mes. Se usa el plan de
 * MP_SUBSCRIPTION_PLAN_ID si existe; si no, se busca un plan activo con el
 * mismo nombre y monto y, sólo si no hay ninguno, se crea una vez. Así no se
 * duplican planes aunque la función arranque en frío.
 */
let cachedInitPoint: string | null = null;

export async function POST(req: NextRequest) {
  try {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "MP_ACCESS_TOKEN missing" }, { status: 500 });
    if (!isSameOrigin(req)) return forbidden();

    const { ok } = rateLimit(`subscription-mp:${getClientIp(req)}`, {
      limit: 10,
      windowMs: 5 * 60 * 1000,
    });
    if (!ok) return tooManyRequests();

    if (cachedInitPoint) return NextResponse.json({ initPoint: cachedInitPoint });

    const plans = new PreApprovalPlan(new MercadoPagoConfig({ accessToken: token }));
    const configuredId = (process.env.MP_SUBSCRIPTION_PLAN_ID || "").trim();

    let initPoint = "";
    if (configuredId) {
      const plan = await plans.get({ preApprovalPlanId: configuredId });
      initPoint = plan.init_point || "";
    }

    if (!initPoint) {
      const found = await plans.search({
        options: { status: "active", q: SUBSCRIPTION_PLAN.productName },
      });
      const match = (found.results || []).find(
        (p) =>
          p.reason === SUBSCRIPTION_PLAN.productName &&
          Number(p.auto_recurring?.transaction_amount) === SUBSCRIPTION_PLAN.price &&
          p.init_point
      );
      initPoint = match?.init_point || "";
    }

    if (!initPoint) {
      const created = await plans.create({
        body: {
          reason: SUBSCRIPTION_PLAN.productName,
          back_url: `${getSiteUrl()}/gracias?provider=mercadopago&plan=${SUBSCRIPTION_PLAN.id}`,
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: SUBSCRIPTION_PLAN.price,
            currency_id: "MXN",
          },
        },
      });
      initPoint = created.init_point || "";
    }

    if (!initPoint) {
      return NextResponse.json({ error: "Mercado Pago no devolvió el enlace de suscripción." }, { status: 502 });
    }
    cachedInitPoint = initPoint;
    return NextResponse.json({ initPoint });
  } catch (error) {
    console.error("Mercado Pago subscription error:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar la suscripción con Mercado Pago. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

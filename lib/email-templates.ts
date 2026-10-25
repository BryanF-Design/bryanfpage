/**
 * PLANTILLAS DE CORREO — BryanF Design.
 *
 * Un solo layout (tablas + estilos en línea, para que se vea igual en Gmail,
 * Outlook y Apple Mail) y una función por correo. Cada plantilla devuelve
 * `{ subject, html, text }`; el envío lo hace lib/mailer.ts.
 *
 * Al cliente:
 *   paymentReceived        Pago único confirmado (+ enlace a "Armar mi brief")
 *   subscriptionWelcome    Alta de la suscripción mensual
 *   monthlyPaymentReceived Mensualidad cobrada
 *   renewalReminder        Recordatorio: se cobra tu mensualidad en N días
 *   paymentFailed          No pasó el cobro: actualiza tu método de pago
 *   paymentRequest         Recordatorio de pago con link (anticipo, saldo, etc.)
 *   subscriptionCancelled  Confirmación de cancelación
 *   briefReceived          Copia de que recibimos su brief
 *   leadReceived           Respuesta automática al formulario de contacto
 *   paymentPending         Pago en revisión / ficha de OXXO o SPEI por pagar
 *
 * Internos (a GOOGLE_NOTIFICATION_EMAIL):
 *   internalNotice         Pagos, suscripciones, cobros (genérico)
 *   leadNotice             Nueva solicitud de contacto / cotización
 *   briefNotice            Brief completo, por secciones, listo para trabajar
 *
 * Vista previa: `node scripts/email-test.mjs` (escribe email-previews/).
 */

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export const BRAND = {
  name: "BryanF Design",
  site: "https://www.bryanfdesign.com",
  email: "bryanf@bryanfdesign.com",
  whatsapp: "+52 56 6301 2505",
  whatsappHref: "https://wa.me/525663012505",
  ink: "#10201a",
  inkSoft: "#22342d",
  lime: "#b4e332",
  limeSoft: "#e6f5c4",
  limeDeep: "#5b8a00",
  mint: "#f5faf1",
  canvas: "#eef1e6",
  muted: "#55635d",
  border: "#dfe5d8",
  signal: "#e5452d",
} as const;

export function escapeHtml(text: unknown) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatMoney(amount: number, currency = "MXN") {
  try {
    return `${new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-MX", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 ? 2 : 0,
    }).format(amount || 0)} ${currency}`;
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatDate(date: Date | string | number | null | undefined) {
  if (date == null || date === "") return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Mexico_City",
  }).format(d);
}

function firstName(name?: string | null) {
  const first = String(name || "").trim().split(/\s+/)[0];
  return first ? escapeHtml(first) : "";
}

function hello(name?: string | null) {
  const first = firstName(name);
  return first ? `Hola, ${first}:` : "Hola:";
}

// ——— Bloques del layout ———

type Tone = "lime" | "ink" | "white" | "alert";

const TONES: Record<Tone, { bg: string; fg: string; badgeBg: string; badgeFg: string }> = {
  lime: { bg: BRAND.lime, fg: BRAND.ink, badgeBg: BRAND.ink, badgeFg: BRAND.lime },
  ink: { bg: BRAND.ink, fg: "#ffffff", badgeBg: BRAND.lime, badgeFg: BRAND.ink },
  white: { bg: "#ffffff", fg: BRAND.ink, badgeBg: BRAND.limeSoft, badgeFg: BRAND.ink },
  alert: { bg: "#fff1ee", fg: BRAND.ink, badgeBg: BRAND.signal, badgeFg: "#ffffff" },
};

const FONT = "'Plus Jakarta Sans','Segoe UI',Helvetica,Arial,sans-serif";
const DISPLAY = "'Archivo','Arial Black','Segoe UI',Helvetica,Arial,sans-serif";

export function paragraph(html: string) {
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;line-height:1.6;color:${BRAND.ink};">${html}</p>`;
}

export function muted(html: string) {
  return `<p style="margin:0 0 12px;font-family:${FONT};font-size:13px;line-height:1.55;color:${BRAND.muted};">${html}</p>`;
}

/** Tabla de datos (folio, monto, fecha…). */
export function details(rows: Array<[string, string | null | undefined | false]>, highlight?: string) {
  const body = rows
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT};font-size:13px;color:${BRAND.muted};vertical-align:top;">${escapeHtml(label)}</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT};font-size:14px;font-weight:700;color:${BRAND.ink};vertical-align:top;${label === highlight ? `font-size:17px;` : ""}">${value}</td>
        </tr>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 20px;border-collapse:collapse;background:${BRAND.mint};border-radius:16px;">
      <tr><td style="padding:6px 20px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${body}</table>
      </td></tr>
    </table>`;
}

/** Botón principal (bulletproof: funciona en Outlook). */
export function button(label: string, href: string, variant: "ink" | "lime" | "outline" = "ink") {
  const styles = {
    ink: { bg: BRAND.ink, fg: "#ffffff", border: BRAND.ink },
    lime: { bg: BRAND.lime, fg: BRAND.ink, border: BRAND.lime },
    outline: { bg: "#ffffff", fg: BRAND.ink, border: BRAND.ink },
  }[variant];
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 12px;">
      <tr><td bgcolor="${styles.bg}" style="border-radius:999px;border:1.5px solid ${styles.border};">
        <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:15px 28px;font-family:${FONT};font-size:15px;font-weight:700;line-height:1;color:${styles.fg};text-decoration:none;border-radius:999px;">${escapeHtml(label)}&nbsp;&nbsp;&rarr;</a>
      </td></tr>
    </table>`;
}

/** Lista numerada de próximos pasos. */
export function steps(items: Array<[string, string]>) {
  const rows = items
    .map(
      ([title, body], i) => `
      <tr>
        <td width="40" style="padding:0 12px 14px 0;vertical-align:top;">
          <div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:999px;background:${BRAND.ink};color:${BRAND.lime};font-family:${FONT};font-size:12px;font-weight:800;">${String(i + 1).padStart(2, "0")}</div>
        </td>
        <td style="padding:0 0 14px;vertical-align:top;font-family:${FONT};">
          <div style="font-size:14px;font-weight:700;color:${BRAND.ink};line-height:1.4;">${title}</div>
          <div style="font-size:13px;color:${BRAND.muted};line-height:1.5;">${body}</div>
        </td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 12px;">${rows}</table>`;
}

/** Recuadro de aviso. */
export function callout(html: string, tone: "lime" | "alert" = "lime") {
  const bg = tone === "alert" ? "#fff1ee" : BRAND.limeSoft;
  const bar = tone === "alert" ? BRAND.signal : BRAND.limeDeep;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;">
      <tr><td style="background:${bg};border-left:4px solid ${bar};border-radius:12px;padding:14px 16px;font-family:${FONT};font-size:14px;line-height:1.55;color:${BRAND.ink};">${html}</td></tr>
    </table>`;
}

interface LayoutOptions {
  preheader: string;
  eyebrow: string;
  title: string;
  tone?: Tone;
  /** Cifra grande en el encabezado (monto). */
  figure?: string;
  figureNote?: string;
  body: string;
  /** "internal" = aviso para Bryan (pie distinto, sin ayuda al cliente). */
  audience?: "client" | "internal";
}

const LOGO_DARK = `${BRAND.site}/img/brand/logo-dark.png`;
const LOGO_LIGHT = `${BRAND.site}/img/brand/logo-light.png`;

/** Píldora pequeña de contacto (WhatsApp / correo / sitio). */
function contactPill(label: string, href: string) {
  return `<td style="padding:4px;"><a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:9px 14px;border-radius:999px;background:#ffffff;border:1px solid ${BRAND.border};font-family:${FONT};font-size:12px;font-weight:700;color:${BRAND.ink};text-decoration:none;white-space:nowrap;">${label}</a></td>`;
}

export function layout({ preheader, eyebrow, title, tone = "ink", figure, figureNote, body, audience = "client" }: LayoutOptions) {
  const t = TONES[tone];
  const year = new Date().getFullYear();
  const internal = audience === "internal";
  const accent = tone === "alert" ? BRAND.signal : tone === "lime" ? BRAND.ink : BRAND.lime;

  const help = internal
    ? ""
    : `
      <tr><td bgcolor="${BRAND.mint}" style="background:${BRAND.mint};padding:20px 24px 18px;border-top:1px solid ${BRAND.border};">
        <div style="margin:0 0 10px;font-family:${FONT};font-size:13px;font-weight:700;color:${BRAND.ink};text-align:center;">¿Dudas? Te contestamos rápido</div>
        <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
          ${contactPill("WhatsApp", `${BRAND.whatsappHref}?text=${encodeURIComponent("Hola Bryan, tengo una duda sobre mi proyecto.")}`)}
          ${contactPill("Responder correo", `mailto:${BRAND.email}`)}
          ${contactPill("bryanfdesign.com", BRAND.site)}
        </tr></table>
        <div style="margin:10px 0 0;font-family:${FONT};font-size:11px;color:${BRAND.muted};text-align:center;">Lunes a viernes, 9:00 a 19:00 (hora de Ciudad de México)</div>
      </td></tr>`;

  const footer = internal
    ? `<tr><td style="padding:18px 12px 0;font-family:${FONT};font-size:11px;line-height:1.6;color:${BRAND.muted};text-align:center;">
        Aviso automático de <a href="${BRAND.site}" style="color:${BRAND.muted};">bryanfdesign.com</a> · Sólo para ti
      </td></tr>`
    : `<tr><td style="padding:16px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND.ink}" style="background:${BRAND.ink};border-radius:24px;">
          <tr><td style="padding:26px 28px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <a href="${BRAND.site}" target="_blank" style="text-decoration:none;"><img src="${LOGO_LIGHT}" width="120" alt="BryanF Design" style="display:block;width:120px;max-width:120px;height:auto;border:0;font-family:${DISPLAY};font-size:16px;font-weight:900;color:#ffffff;"></a>
              </td>
              <td align="right" style="vertical-align:middle;font-family:${FONT};font-size:12px;line-height:1.5;color:#b9c4bd;">
                Diseño y desarrollo web<br>Ciudad de México
              </td>
            </tr></table>
            <div style="margin:18px 0 14px;height:1px;line-height:1px;background:#2b3d35;">&nbsp;</div>
            <div style="font-family:${FONT};font-size:12px;line-height:1.9;color:#b9c4bd;">
              <a href="${BRAND.site}" style="color:#ffffff;text-decoration:none;font-weight:700;">Sitio</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${BRAND.site}/suscripcion" style="color:#ffffff;text-decoration:none;font-weight:700;">Suscripción</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${BRAND.whatsappHref}" style="color:#ffffff;text-decoration:none;font-weight:700;">WhatsApp ${BRAND.whatsapp}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${BRAND.site}/privacidad.html" style="color:#ffffff;text-decoration:none;font-weight:700;">Privacidad</a>
            </div>
            <div style="margin:10px 0 0;font-family:${FONT};font-size:11px;color:#7f8f87;">© ${year} BryanF Design. Recibes este correo por una solicitud, compra o suscripción en bryanfdesign.com.</div>
          </td></tr>
        </table>
      </td></tr>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
<style>
  @media (max-width:620px){
    .bf-pad{padding-left:22px!important;padding-right:22px!important;}
    .bf-title{font-size:26px!important;}
    .bf-figure{font-size:34px!important;}
  }
  a{color:${BRAND.ink};}
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.canvas};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND.canvas}" style="background:${BRAND.canvas};">
  <tr><td align="center" style="padding:28px 12px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <!-- Marca -->
      <tr><td style="padding:0 6px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;">
            <a href="${BRAND.site}" target="_blank" style="text-decoration:none;"><img src="${LOGO_DARK}" width="150" alt="BryanF Design" style="display:block;width:150px;max-width:150px;height:auto;border:0;font-family:${DISPLAY};font-size:18px;font-weight:900;color:${BRAND.ink};"></a>
          </td>
          <td align="right" style="vertical-align:middle;font-family:${FONT};font-size:12px;font-weight:600;color:${BRAND.muted};">
            ${internal ? "Aviso interno" : `<a href="${BRAND.site}" style="color:${BRAND.muted};text-decoration:none;">bryanfdesign.com</a>`}
          </td>
        </tr></table>
      </td></tr>
      <!-- Tarjeta -->
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid ${BRAND.border};">
          <tr><td height="6" bgcolor="${accent}" style="background:${accent};height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>
          <tr><td bgcolor="${t.bg}" class="bf-pad" style="background:${t.bg};padding:32px 34px 30px;">
            <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${t.badgeBg};color:${t.badgeFg};font-family:${FONT};font-size:11px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;">${escapeHtml(eyebrow)}</span>
            <h1 class="bf-title" style="margin:16px 0 0;font-family:${DISPLAY};font-size:31px;line-height:1.08;font-weight:900;letter-spacing:-0.8px;color:${t.fg};">${escapeHtml(title)}</h1>
            ${
              figure
                ? `<div class="bf-figure" style="margin:18px 0 0;font-family:${DISPLAY};font-size:42px;line-height:1;font-weight:900;letter-spacing:-1.2px;color:${t.fg};">${escapeHtml(figure)}</div>${
                    figureNote
                      ? `<div style="margin:8px 0 0;font-family:${FONT};font-size:13px;font-weight:600;color:${t.fg};opacity:0.72;">${escapeHtml(figureNote)}</div>`
                      : ""
                  }`
                : ""
            }
          </td></tr>
          <tr><td class="bf-pad" style="padding:30px 34px 22px;">
            ${body}
          </td></tr>
          ${help}
        </table>
      </td></tr>
      ${footer}
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function build(subject: string, html: string): EmailContent {
  // El texto plano lo deriva el mailer; aquí se deja una versión limpia básica.
  const text = html
    .replace(/<(style|head)[\s\S]*?<\/\1>/gi, "")
    .replace(/<div style="display:none[\s\S]*?<\/div>/i, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, label: string) => {
      const t = label.replace(/<[^>]+>/g, "").replace(/&nbsp;|&rarr;/g, " ").trim();
      return t && !href.includes(t) ? `${t}: ${href}` : href;
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|tr|li)>/gi, "\n")
    .replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&rarr;/g, "→")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { subject, html, text };
}

// ——— Plantillas para el cliente ———

export interface PaymentReceivedData {
  name?: string | null;
  folio: string;
  amount: number;
  currency: string;
  concept?: string | null;
  method: string;
  /** "anticipo" | "liquidacion" */
  modalidad?: string | null;
  date?: Date | string | number;
  briefUrl: string;
  /** Portal de clientes (Bitácora), si el cliente ya tiene cuenta. */
  portalUrl?: string | null;
}

export function paymentReceived(d: PaymentReceivedData): EmailContent {
  const isDeposit = d.modalidad === "anticipo";
  // Pago del saldo o de un cobro posterior: el brief ya se armó.
  const isFollowUp = d.modalidad === "saldo" || d.modalidad === "cobro";
  if (isFollowUp) return followUpPaymentReceived(d);
  const html = layout({
    preheader: `Recibimos tu pago de ${formatMoney(d.amount, d.currency)}. Siguiente paso: arma tu brief.`,
    eyebrow: "Pago confirmado",
    title: "¡Gracias! Tu pago está confirmado",
    tone: "lime",
    figure: formatMoney(d.amount, d.currency),
    figureNote: isDeposit ? "Anticipo del 50 %" : "Pago recibido",
    body: [
      paragraph(hello(d.name)),
      paragraph(
        "Recibimos tu pago y tu proyecto ya tiene lugar en la agenda. Guarda este correo: es tu comprobante."
      ),
      details(
        [
          ["Folio", escapeHtml(d.folio)],
          ["Concepto", escapeHtml(d.concept || "Proyecto web")],
          ["Modalidad", isDeposit ? "Anticipo (50 %)" : d.modalidad ? "Pago completo" : null],
          ["Método", escapeHtml(d.method)],
          ["Fecha", formatDate(d.date ?? Date.now())],
          ["Total pagado", `<span style="color:${BRAND.limeDeep};">${escapeHtml(formatMoney(d.amount, d.currency))}</span>`],
        ],
        "Total pagado"
      ),
      `<h2 style="margin:6px 0 10px;font-family:${DISPLAY};font-size:20px;font-weight:900;color:${BRAND.ink};">Siguiente paso: arma tu brief</h2>`,
      paragraph(
        "Son unos minutos: nos cuentas de tu negocio, qué quieres lograr y nos compartes logo, fotos o enlaces. Si prefieres, Lumina lo llena contigo platicando."
      ),
      button("Armar mi brief", d.briefUrl, "ink"),
      d.portalUrl ? button("Ver mi proyecto en Bitácora", d.portalUrl, "outline") : "",
      steps([
        ["Armas tu brief", "Tu negocio, objetivos, estilo y materiales."],
        ["Lo revisamos en 24 h hábiles", "Te mandamos la ruta del proyecto y agendamos el arranque."],
        ["Construimos contigo", "Te enseñamos avances y ajustamos hasta publicar."],
      ]),
      isDeposit
        ? muted("El 50 % restante se paga al aprobar el diseño final; te mandaremos el enlace de pago en su momento.")
        : "",
    ].join(""),
  });
  return build(`Pago confirmado ${d.folio} · Arma tu brief`, html);
}

function followUpPaymentReceived(d: PaymentReceivedData): EmailContent {
  const html = layout({
    preheader: `Recibimos tu pago de ${formatMoney(d.amount, d.currency)}. Gracias.`,
    eyebrow: "Pago confirmado",
    title: "¡Gracias! Recibimos tu pago",
    tone: "lime",
    figure: formatMoney(d.amount, d.currency),
    figureNote: d.modalidad === "saldo" ? "Pago del saldo" : "Pago recibido",
    body: [
      paragraph(hello(d.name)),
      paragraph("Confirmamos tu pago. Guarda este correo: es tu comprobante."),
      details(
        [
          ["Folio", escapeHtml(d.folio)],
          ["Concepto", escapeHtml(d.concept || "Proyecto web")],
          ["Método", escapeHtml(d.method)],
          ["Fecha", formatDate(d.date ?? Date.now())],
          ["Total pagado", `<span style="color:${BRAND.limeDeep};">${escapeHtml(formatMoney(d.amount, d.currency))}</span>`],
        ],
        "Total pagado"
      ),
      paragraph(
        d.modalidad === "saldo"
          ? "Con esto tu proyecto queda liquidado. Te escribimos para coordinar la publicación y la entrega de accesos."
          : "Seguimos con tu proyecto; te escribimos con los siguientes pasos."
      ),
    ].join(""),
  });
  return build(`Pago confirmado ${d.folio} · BryanF Design`, html);
}

export interface SubscriptionWelcomeData {
  name?: string | null;
  folio: string;
  amount: number;
  currency: string;
  method: string;
  nextChargeDate?: Date | string | number | null;
  briefUrl: string;
  manageUrl?: string | null;
  policyUrl: string;
  portalUrl?: string | null;
}

export function subscriptionWelcome(d: SubscriptionWelcomeData): EmailContent {
  const html = layout({
    preheader: "Tu suscripción Todo Digital ya está activa. Te contamos cómo pedir tu primera solicitud.",
    eyebrow: "Suscripción activa",
    title: "¡Bienvenido a Todo Digital!",
    tone: "ink",
    figure: formatMoney(d.amount, d.currency),
    figureNote: "al mes · cancela cuando quieras",
    body: [
      paragraph(hello(d.name)),
      paragraph(
        "Tu suscripción ya está activa. Desde hoy tienes a un estudio de diseño y desarrollo para todo lo digital de tu negocio."
      ),
      details([
        ["Folio", escapeHtml(d.folio)],
        ["Plan", "Suscripción Todo Digital"],
        ["Cobro mensual", escapeHtml(formatMoney(d.amount, d.currency))],
        ["Método", escapeHtml(d.method)],
        ["Próximo cobro", formatDate(d.nextChargeDate)],
      ]),
      `<h2 style="margin:6px 0 10px;font-family:${DISPLAY};font-size:20px;font-weight:900;color:${BRAND.ink};">Para arrancar</h2>`,
      steps([
        ["Arma tu brief", "Cuéntanos de tu negocio una sola vez; lo usamos en todas tus solicitudes."],
        ["Manda tu primera solicitud", `Por WhatsApp al <a href="${BRAND.whatsappHref}" style="color:${BRAND.ink};font-weight:700;">${BRAND.whatsapp}</a> o respondiendo este correo.`],
        ["Recíbela en 1 a 2 días hábiles", "Según su complejidad. Una solicitud activa a la vez."],
      ]),
      button("Armar mi brief", d.briefUrl, "ink"),
      d.portalUrl ? button("Entrar a mi portal", d.portalUrl, "outline") : "",
      muted(
        `Política y preguntas frecuentes: <a href="${escapeHtml(d.policyUrl)}" style="color:${BRAND.ink};">${escapeHtml(d.policyUrl.replace(/^https?:\/\//, ""))}</a>${
          d.manageUrl
            ? ` · Administra o cancela tu suscripción <a href="${escapeHtml(d.manageUrl)}" style="color:${BRAND.ink};">aquí</a>.`
            : ""
        }`
      ),
    ].join(""),
  });
  return build(`Tu suscripción Todo Digital está activa ${d.folio}`, html);
}

export interface MonthlyPaymentData {
  name?: string | null;
  folio: string;
  amount: number;
  currency: string;
  method: string;
  date?: Date | string | number;
  period?: string | null;
  nextChargeDate?: Date | string | number | null;
  invoiceUrl?: string | null;
  manageUrl?: string | null;
}

export function monthlyPaymentReceived(d: MonthlyPaymentData): EmailContent {
  const html = layout({
    preheader: `Cobramos tu mensualidad de ${formatMoney(d.amount, d.currency)}. Tu suscripción sigue activa.`,
    eyebrow: "Mensualidad confirmada",
    title: "Recibimos tu mensualidad",
    tone: "lime",
    figure: formatMoney(d.amount, d.currency),
    figureNote: d.period || "Suscripción Todo Digital",
    body: [
      paragraph(hello(d.name)),
      paragraph("Se cobró tu mensualidad y tu suscripción sigue activa. ¡Gracias por seguir con nosotros!"),
      details([
        ["Folio", escapeHtml(d.folio)],
        ["Plan", "Suscripción Todo Digital"],
        ["Periodo", d.period ? escapeHtml(d.period) : null],
        ["Fecha de cobro", formatDate(d.date ?? Date.now())],
        ["Método", escapeHtml(d.method)],
        ["Monto", escapeHtml(formatMoney(d.amount, d.currency))],
        ["Próximo cobro", formatDate(d.nextChargeDate)],
      ]),
      paragraph("¿Tienes algo nuevo en mente? Mándanos tu siguiente solicitud cuando quieras."),
      button("Mandar una solicitud", `${BRAND.whatsappHref}?text=${encodeURIComponent("Hola Bryan, tengo una nueva solicitud: ")}`, "ink"),
      d.invoiceUrl ? muted(`Recibo de la plataforma: <a href="${escapeHtml(d.invoiceUrl)}" style="color:${BRAND.ink};">ver recibo</a>`) : "",
      d.manageUrl ? muted(`Administra o cancela tu suscripción <a href="${escapeHtml(d.manageUrl)}" style="color:${BRAND.ink};">aquí</a>.`) : "",
    ].join(""),
  });
  return build(`Mensualidad recibida ${d.folio} · ${formatMoney(d.amount, d.currency)}`, html);
}

export interface RenewalReminderData {
  name?: string | null;
  amount: number;
  currency: string;
  chargeDate: Date | string | number;
  method: string;
  manageUrl?: string | null;
}

export function renewalReminder(d: RenewalReminderData): EmailContent {
  const when = formatDate(d.chargeDate);
  const html = layout({
    preheader: `El ${when} se cobra tu mensualidad de ${formatMoney(d.amount, d.currency)}. No tienes que hacer nada.`,
    eyebrow: "Recordatorio de pago",
    title: "Tu mensualidad se cobra pronto",
    tone: "white",
    figure: formatMoney(d.amount, d.currency),
    figureNote: `se cobra el ${when}`,
    body: [
      paragraph(hello(d.name)),
      paragraph(
        `Te avisamos con tiempo: el <strong>${escapeHtml(when)}</strong> se cobrará automáticamente tu mensualidad de la suscripción Todo Digital. No tienes que hacer nada.`
      ),
      details([
        ["Plan", "Suscripción Todo Digital"],
        ["Monto", escapeHtml(formatMoney(d.amount, d.currency))],
        ["Fecha de cobro", escapeHtml(when)],
        ["Método", escapeHtml(d.method)],
      ]),
      callout(
        "Revisa que tu tarjeta esté vigente y con saldo para que no se pausen tus solicitudes. Si cambió, actualízala antes de la fecha de cobro."
      ),
      d.manageUrl ? button("Actualizar mi método de pago", d.manageUrl, "outline") : "",
      muted("Si ya no quieres continuar, puedes cancelar antes de la fecha de cobro. No hay plazo forzoso."),
    ].join(""),
  });
  return build(`Recordatorio: tu mensualidad se cobra el ${when}`, html);
}

export interface PaymentFailedData {
  name?: string | null;
  amount: number;
  currency: string;
  /** Enlace para pagar o actualizar la tarjeta. */
  payUrl?: string | null;
  manageUrl?: string | null;
  nextAttempt?: Date | string | number | null;
  graceDays?: number;
}

export function paymentFailed(d: PaymentFailedData): EmailContent {
  const grace = d.graceDays ?? 7;
  const html = layout({
    preheader: "No pudimos cobrar tu mensualidad. Actualiza tu método de pago para no pausar tus solicitudes.",
    eyebrow: "Acción necesaria",
    title: "No pudimos cobrar tu mensualidad",
    tone: "alert",
    figure: formatMoney(d.amount, d.currency),
    figureNote: "pendiente de pago",
    body: [
      paragraph(hello(d.name)),
      paragraph(
        "Intentamos cobrar tu mensualidad de la suscripción Todo Digital y el banco la rechazó. Suele pasar por tarjeta vencida, sin saldo o un bloqueo de seguridad del banco."
      ),
      callout(
        `Actualiza tu método de pago o paga con el botón de abajo. Si el pago sigue pendiente ${grace} días, se pausan las solicitudes hasta que se regularice.`,
        "alert"
      ),
      d.payUrl ? button("Pagar ahora", d.payUrl, "ink") : "",
      d.manageUrl && d.manageUrl !== d.payUrl ? button("Actualizar mi tarjeta", d.manageUrl, "outline") : "",
      d.nextAttempt ? muted(`La plataforma lo reintentará automáticamente el ${escapeHtml(formatDate(d.nextAttempt))}.`) : "",
      muted("¿Prefieres pagar por transferencia? Escríbenos y te pasamos los datos."),
    ].join(""),
  });
  return build("Acción necesaria: no pudimos cobrar tu mensualidad", html);
}

export interface PaymentRequestData {
  name?: string | null;
  amount: number;
  currency: string;
  concept: string;
  payUrl: string;
  /** Segundo método (p. ej. tarjeta con Stripe si el principal es Mercado Pago). */
  altPayUrl?: string | null;
  altPayLabel?: string | null;
  dueDate?: Date | string | number | null;
  note?: string | null;
  folio?: string | null;
}

export function paymentRequest(d: PaymentRequestData): EmailContent {
  const due = formatDate(d.dueDate);
  const html = layout({
    preheader: `${d.concept}: ${formatMoney(d.amount, d.currency)}${due ? `, vence el ${due}` : ""}. Paga en línea con tarjeta, OXXO o transferencia.`,
    eyebrow: "Recordatorio de pago",
    title: "Tienes un pago pendiente",
    tone: "white",
    figure: formatMoney(d.amount, d.currency),
    figureNote: due ? `vence el ${due}` : d.concept,
    body: [
      paragraph(hello(d.name)),
      paragraph(
        `Te compartimos el enlace para pagar <strong>${escapeHtml(d.concept)}</strong>. Es seguro y puedes usar tarjeta de crédito o débito, OXXO o transferencia SPEI.`
      ),
      details([
        ["Folio", d.folio ? escapeHtml(d.folio) : null],
        ["Concepto", escapeHtml(d.concept)],
        ["Monto", escapeHtml(formatMoney(d.amount, d.currency))],
        ["Fecha límite", due || null],
      ]),
      d.note ? callout(escapeHtml(d.note).replace(/\n/g, "<br>")) : "",
      button("Pagar ahora", d.payUrl, "ink"),
      d.altPayUrl ? button(d.altPayLabel || "Pagar con tarjeta", d.altPayUrl, "outline") : "",
      muted("Al pagar te llega tu comprobante a este correo. Si ya pagaste, ignora este mensaje."),
    ].join(""),
  });
  return build(
    `Recordatorio de pago${d.folio ? ` ${d.folio}` : ""} · ${d.concept} (${formatMoney(d.amount, d.currency)})`,
    html
  );
}

export function subscriptionCancelled(d: { name?: string | null; endsAt?: Date | string | number | null }): EmailContent {
  const html = layout({
    preheader: "Confirmamos la cancelación de tu suscripción Todo Digital.",
    eyebrow: "Suscripción cancelada",
    title: "Tu suscripción quedó cancelada",
    tone: "white",
    body: [
      paragraph(hello(d.name)),
      paragraph(
        `Confirmamos la cancelación de tu suscripción Todo Digital. No se harán más cobros${
          d.endsAt ? `; tus beneficios siguen hasta el <strong>${escapeHtml(formatDate(d.endsAt))}</strong>` : ""
        }.`
      ),
      paragraph(
        "Si necesitas tus archivos o accesos, respóndenos este correo y te los entregamos. Gracias por confiar en nosotros: aquí estaremos cuando quieras volver."
      ),
      button("Volver a suscribirme", `${BRAND.site}/suscripcion`, "outline"),
    ].join(""),
  });
  return build("Tu suscripción Todo Digital fue cancelada", html);
}

export function briefReceived(d: {
  name?: string | null;
  businessName: string;
  links?: number;
  files?: number;
}): EmailContent {
  const extras = [d.links ? `${d.links} enlace(s)` : "", d.files ? `${d.files} archivo(s)` : ""].filter(Boolean).join(" y ");
  const html = layout({
    preheader: "Recibimos tu brief. En menos de 24 horas hábiles te mandamos la ruta del proyecto.",
    eyebrow: "Brief recibido",
    title: `¡Listo! Recibimos el brief de ${d.businessName}`,
    tone: "lime",
    body: [
      paragraph(hello(d.name)),
      paragraph(`Recibimos tu brief${extras ? ` con ${escapeHtml(extras)}` : ""}. Esto es lo que sigue:`),
      steps([
        ["Lo revisamos", "En menos de 24 horas hábiles te mandamos la ruta del proyecto."],
        ["Videollamada de arranque", "20 minutos para alinear objetivos, tiempos y materiales."],
        ["Construimos contigo", "Te enseñamos avances y ajustamos hasta publicar."],
      ]),
      muted("¿Se te olvidó algo? Responde este correo con lo que falte (textos, fotos o enlaces)."),
    ].join(""),
  });
  return build(`Recibimos tu brief · ${d.businessName}`, html);
}

export function leadReceived(d: { name?: string | null; service?: string | null }): EmailContent {
  const html = layout({
    preheader: "Recibimos tu solicitud. Te mandamos tu propuesta por WhatsApp en menos de 24 horas hábiles.",
    eyebrow: "Mensaje recibido",
    title: "¡Gracias! Ya tenemos tu solicitud",
    tone: "lime",
    body: [
      paragraph(hello(d.name)),
      paragraph(
        `Recibimos tu solicitud${d.service ? ` para <strong>${escapeHtml(d.service)}</strong>` : ""}. Bryan la revisa personalmente y te escribe por WhatsApp con una propuesta clara en menos de 24 horas hábiles.`
      ),
      steps([
        ["Revisamos tu idea", "Vemos qué necesitas y qué conviene para tu negocio."],
        ["Te mandamos tu cotización", "Precio cerrado, tiempos y lo que incluye. Sin letras chiquitas."],
        ["Arrancamos cuando digas", "Con el anticipo apartas tu lugar y armamos tu brief juntos."],
      ]),
      callout("¿Tienes prisa? Escríbenos directo por WhatsApp y lo vemos en el momento."),
      button("Escribir por WhatsApp", `${BRAND.whatsappHref}?text=${encodeURIComponent("Hola Bryan, acabo de mandar una solicitud desde la página.")}`, "ink"),
      button("Ver proyectos y precios", BRAND.site, "outline"),
      muted("Si no fuiste tú quien llenó el formulario, ignora este correo."),
    ].join(""),
  });
  return build("Recibimos tu solicitud · BryanF Design", html);
}

export interface PaymentPendingData {
  name?: string | null;
  folio: string;
  amount: number;
  currency: string;
  concept?: string | null;
  /** "review" = el banco/plataforma lo está revisando; "ticket" = falta pagar la ficha (OXXO/SPEI). */
  kind: "review" | "ticket";
  method: string;
  ticketUrl?: string | null;
  expiresAt?: Date | string | number | null;
}

export function paymentPending(d: PaymentPendingData): EmailContent {
  const ticket = d.kind === "ticket";
  const expires = formatDate(d.expiresAt);
  const html = layout({
    preheader: ticket
      ? `Tu ficha de pago por ${formatMoney(d.amount, d.currency)} está lista${expires ? `; vence el ${expires}` : ""}.`
      : `Tu pago de ${formatMoney(d.amount, d.currency)} está en revisión. Te avisamos en cuanto se acredite.`,
    eyebrow: ticket ? "Pago por completar" : "Pago en revisión",
    title: ticket ? "Tu ficha de pago está lista" : "Estamos revisando tu pago",
    tone: "white",
    figure: formatMoney(d.amount, d.currency),
    figureNote: ticket ? (expires ? `paga antes del ${expires}` : "pendiente de pago") : "en revisión",
    body: [
      paragraph(hello(d.name)),
      paragraph(
        ticket
          ? "Generaste una ficha para pagar en efectivo o por transferencia. En cuanto la pagues y se acredite, te llega tu comprobante y el enlace para armar tu brief."
          : "Tu pago se registró y la plataforma lo está revisando por seguridad. Normalmente tarda unos minutos, a veces hasta 48 horas. No tienes que hacer nada más."
      ),
      details([
        ["Folio", escapeHtml(d.folio)],
        ["Concepto", escapeHtml(d.concept || "Proyecto web")],
        ["Método", escapeHtml(d.method)],
        ["Monto", escapeHtml(formatMoney(d.amount, d.currency))],
        ["Fecha límite", ticket && expires ? escapeHtml(expires) : null],
      ]),
      ticket && d.ticketUrl ? button("Ver mi ficha de pago", d.ticketUrl, "ink") : "",
      callout(
        ticket
          ? "Tu lugar en la agenda se aparta cuando el pago se acredita. OXXO tarda hasta 1 día hábil en reflejarse."
          : "Si el banco necesita confirmar algo, te puede llegar un SMS o una notificación de tu app. Revísala para que el pago no se detenga."
      ),
      muted("Te avisamos por correo en cuanto se acredite. ¿Dudas? Responde este correo."),
    ].join(""),
  });
  return build(
    ticket ? `Tu ficha de pago está lista ${d.folio}` : `Tu pago está en revisión ${d.folio}`,
    html
  );
}

// ——— Avisos internos ———

function sectionTitle(text: string, note?: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 10px;"><tr>
    <td style="font-family:${DISPLAY};font-size:18px;font-weight:900;letter-spacing:-0.3px;color:${BRAND.ink};">${escapeHtml(text)}</td>
    ${note ? `<td align="right" style="font-family:${FONT};font-size:12px;font-weight:700;color:${BRAND.muted};">${escapeHtml(note)}</td>` : ""}
  </tr></table>`;
}

/** Bloque de texto largo (mensaje del cliente, descripción del proyecto). */
function quoteBlock(text: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr>
    <td style="background:${BRAND.mint};border-left:4px solid ${BRAND.lime};border-radius:12px;padding:14px 16px;font-family:${FONT};font-size:14px;line-height:1.6;color:${BRAND.ink};">${escapeHtml(text).replace(/\n/g, "<br>")}</td>
  </tr></table>`;
}

/** Fila de chips (funciones, etiquetas). */
function chips(items: string[]) {
  return `<div style="margin:0 0 14px;line-height:2.2;">${items
    .map(
      (i) =>
        `<span style="display:inline-block;margin:0 6px 0 0;padding:5px 12px;border-radius:999px;background:${BRAND.limeSoft};font-family:${FONT};font-size:12px;font-weight:700;color:${BRAND.ink};white-space:nowrap;">${escapeHtml(i)}</span>`
    )
    .join("")}</div>`;
}

/** Dos botones lado a lado (contestar por WhatsApp / por correo). */
function buttonRow(items: Array<{ label: string; href: string; variant: "ink" | "lime" | "outline" }>) {
  const cells = items
    .map((b) => `<td style="padding:0 8px 0 0;vertical-align:top;">${button(b.label, b.href, b.variant)}</td>`)
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 4px;"><tr>${cells}</tr></table>`;
}

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  const full = digits.length === 10 ? `52${digits}` : digits;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}

export interface LeadNoticeData {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  timeline?: string | null;
  message?: string | null;
  quote?: string | null;
  page?: string | null;
  campaign?: string | null;
  gclid?: string | null;
  receivedAt?: Date | string | number;
}

export function leadNotice(d: LeadNoticeData): EmailContent {
  const first = d.name.split(/\s+/)[0];
  const wa = waLink(
    d.phone,
    `Hola ${first}, soy Bryan de BryanF Design. Recibí tu solicitud${d.service ? ` para ${d.service}` : ""}. ¿Te parece si lo platicamos?`
  );
  const html = layout({
    preheader: `${d.name}${d.service ? ` · ${d.service}` : ""}${d.timeline ? ` · ${d.timeline}` : ""}. Contesta pronto.`,
    audience: "internal",
    eyebrow: "Nuevo contacto",
    title: `${d.name} quiere cotizar`,
    tone: "lime",
    figure: d.service || undefined,
    figureNote: d.timeline ? `Para: ${d.timeline}` : undefined,
    body: [
      callout("<strong>Contesta en menos de 2 horas.</strong> Los prospectos de anuncios se enfrían rápido; el botón abre WhatsApp con el saludo ya escrito."),
      buttonRow([
        { label: "Responder por WhatsApp", href: wa, variant: "ink" },
        ...(d.email
          ? [{ label: "Responder por correo", href: `mailto:${d.email}?subject=${encodeURIComponent("Tu cotización con BryanF Design")}`, variant: "outline" as const }]
          : []),
      ]),
      sectionTitle("Datos de contacto"),
      details([
        ["Nombre", escapeHtml(d.name)],
        ["WhatsApp", escapeHtml(d.phone)],
        ["Correo", d.email ? escapeHtml(d.email) : "No lo dejó"],
        ["Le interesa", d.service ? escapeHtml(d.service) : null],
        ["¿Para cuándo?", d.timeline ? escapeHtml(d.timeline) : null],
        ["Recibido", formatDateTime(d.receivedAt ?? Date.now())],
      ]),
      d.message ? sectionTitle("Su mensaje") + quoteBlock(d.message) : "",
      d.quote ? sectionTitle("Cotización que armó en el sitio") + quoteBlock(d.quote) : "",
      sectionTitle("De dónde llegó"),
      details([
        ["Campaña", d.campaign ? escapeHtml(d.campaign) : "Directo / orgánico"],
        ["GCLID", d.gclid ? escapeHtml(d.gclid) : null],
        ["Formulario en", d.page ? escapeHtml(d.page) : null],
      ]),
    ].join(""),
  });
  return build(`Nuevo contacto: ${d.name}${d.service ? ` — ${d.service}` : ""}`, html);
}

export interface BriefNoticeData {
  fullName: string;
  businessName: string;
  phone: string;
  email?: string | null;
  sections: Array<{ title: string; rows: Array<[string, string]>; chips?: string[] }>;
  links: Array<{ label: string; purpose: string; url: string }>;
  files: string[];
  notes?: string | null;
  payment?: Array<[string, string | null | undefined | false]>;
  services?: Array<[string, string]>;
  progress?: number;
}

export function briefNotice(d: BriefNoticeData): EmailContent {
  const wa = waLink(
    d.phone,
    `Hola ${d.fullName.split(/\s+/)[0]}, soy Bryan. Ya recibí el brief de ${d.businessName}; lo reviso y te mando la ruta del proyecto.`
  );
  const sectionHtml = d.sections
    .filter((s) => s.rows.length || s.chips?.length)
    .map((s) => {
      const short = s.rows.filter(([, v]) => v.length <= 90 && !v.includes("\n"));
      const long = s.rows.filter(([, v]) => v.length > 90 || v.includes("\n"));
      return [
        sectionTitle(s.title),
        short.length ? details(short.map(([k, v]) => [k, escapeHtml(v)])) : "",
        long
          .map(
            ([k, v]) =>
              `<div style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:800;letter-spacing:0.4px;text-transform:uppercase;color:${BRAND.muted};">${escapeHtml(k)}</div>${quoteBlock(v)}`
          )
          .join(""),
        s.chips?.length ? chips(s.chips) : "",
      ].join("");
    })
    .join("");
  const linksHtml = d.links.length
    ? sectionTitle("Enlaces", `${d.links.length}`) +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;">${d.links
        .map(
          (l) => `<tr><td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT};">
            <div style="font-size:14px;font-weight:700;color:${BRAND.ink};">${escapeHtml(l.label)} <span style="font-weight:600;color:${BRAND.muted};">· ${escapeHtml(l.purpose)}</span></div>
            <a href="${escapeHtml(l.url)}" style="font-size:13px;color:${BRAND.limeDeep};word-break:break-all;">${escapeHtml(l.url)}</a>
          </td></tr>`
        )
        .join("")}</table>`
    : "";
  const filesHtml = d.files.length
    ? sectionTitle("Archivos adjuntos", `${d.files.length}`) +
      `<div style="margin:0 0 16px;">${d.files
        .map(
          (f) =>
            `<div style="margin:0 0 6px;padding:10px 14px;border-radius:12px;background:${BRAND.mint};font-family:${FONT};font-size:13px;font-weight:700;color:${BRAND.ink};">📎 ${escapeHtml(f)}</div>`
        )
        .join("")}<div style="font-family:${FONT};font-size:12px;color:${BRAND.muted};">Vienen adjuntos en este correo.</div></div>`
    : "";
  const html = layout({
    preheader: `${d.fullName} (${d.businessName}) mandó su brief${d.links.length ? `, ${d.links.length} enlace(s)` : ""}${d.files.length ? ` y ${d.files.length} archivo(s)` : ""}.`,
    audience: "internal",
    eyebrow: "Brief recibido",
    title: `Brief de ${d.businessName}`,
    tone: "ink",
    figure: d.progress != null ? `${d.progress}%` : undefined,
    figureNote: d.progress != null ? "del brief completo" : undefined,
    body: [
      paragraph(
        `<strong>${escapeHtml(d.fullName)}</strong> terminó su brief. Promesa al cliente: ruta del proyecto en menos de 24 horas hábiles.`
      ),
      buttonRow([
        { label: "WhatsApp al cliente", href: wa, variant: "ink" },
        ...(d.email
          ? [{ label: "Responder por correo", href: `mailto:${d.email}?subject=${encodeURIComponent(`Tu proyecto · ${d.businessName}`)}`, variant: "outline" as const }]
          : []),
      ]),
      sectionTitle("Contacto"),
      details([
        ["Nombre", escapeHtml(d.fullName)],
        ["Negocio", escapeHtml(d.businessName)],
        ["WhatsApp", escapeHtml(d.phone)],
        ["Correo", d.email ? escapeHtml(d.email) : "No lo compartió"],
      ]),
      sectionHtml,
      linksHtml,
      filesHtml,
      d.notes ? sectionTitle("Notas") + quoteBlock(d.notes) : "",
      d.payment?.some((r) => r[1]) ? sectionTitle("Pago") + details(d.payment.map(([k, v]) => [k, v ? escapeHtml(v) : v])) : "",
      d.services?.length ? sectionTitle("Servicios seleccionados") + details(d.services.map(([k, v]) => [k, escapeHtml(v)])) : "",
    ].join(""),
  });
  return build(`Brief: ${d.businessName} — ${d.fullName}`, html);
}

export function formatDateTime(date: Date | string | number) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  }).format(d);
}

// ——— Aviso interno genérico ———

export function internalNotice(d: {
  title: string;
  intro: string;
  rows: Array<[string, string | null | undefined | false]>;
  tone?: Tone;
  extraHtml?: string;
  eyebrow?: string;
  figure?: string;
  figureNote?: string;
  /** Botones de acción (contestar al cliente, ver en la plataforma…). */
  actions?: Array<{ label: string; href: string }>;
}): EmailContent {
  const html = layout({
    preheader: d.intro,
    audience: "internal",
    eyebrow: d.eyebrow ?? "Aviso interno",
    title: d.title,
    tone: d.tone ?? "ink",
    figure: d.figure,
    figureNote: d.figureNote,
    body: [
      paragraph(escapeHtml(d.intro)),
      d.actions?.length
        ? buttonRow(d.actions.map((a, i) => ({ label: a.label, href: a.href, variant: i ? "outline" : "ink" })))
        : "",
      details(d.rows.map(([k, v]) => [k, v ? escapeHtml(v) : v] as [string, string | null | undefined | false])),
      d.extraHtml || "",
    ].join(""),
  });
  return build(d.title, html);
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Eye,
  KeyRound,
  Loader2,
  Mail,
  Plus,
  Receipt,
  Save,
  Search,
  Send,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { cn } from "@/lib/utils";

import { previewHref, type AdminData } from "./admin-app";
import {
  Button,
  Card,
  Field,
  Input,
  Notice,
  Pill,
  Select,
  Textarea,
  Toggle,
  money,
  shortDate,
  useAdminAction,
} from "./admin-ui";
import { buildClients, type ClientRow } from "./clients";

type Filter = "todos" | "suscritos" | "compras" | "sin-acceso";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "suscritos", label: "Con plan mensual" },
  { id: "compras", label: "Compras únicas" },
  { id: "sin-acceso", label: "Sin contraseña" },
];

/**
 * Clientes: todas las personas que han pagado algo (suscripción, compra o
 * transferencia), unidas por correo. Desde aquí se crea la cuenta de quien
 * pagó por transferencia, se le pone contraseña, se le manda su acceso y se
 * ve su panel tal como lo ve él.
 */
export function ClientsTab({ data }: { data: AdminData }) {
  const clients = useMemo(() => buildClients(data), [data]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [open, setOpen] = useState<string | "nuevo" | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients
      .filter((c) =>
        filter === "suscritos"
          ? c.subscribed
          : filter === "compras"
            ? c.payments.length > 0
            : filter === "sin-acceso"
              ? !c.account?.con_password
              : true
      )
      .filter((c) => !q || `${c.name} ${c.email} ${c.phone} ${c.account?.empresa || ""}`.toLowerCase().includes(q));
  }, [clients, query, filter]);

  const selected = open && open !== "nuevo" ? clients.find((c) => c.email === open) || null : null;

  return (
    <>
      <Card
        id="clients-title"
        title={
          <>
            Clientes <span className="text-ink/45">({rows.length})</span>
          </>
        }
        icon={UserRound}
        action={
          <Button onClick={() => setOpen("nuevo")} disabled={!data.db}>
            <Plus aria-hidden className="h-4 w-4 text-lime" />
            Nuevo cliente
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 sm:max-w-sm">
            <span className="sr-only">Buscar cliente</span>
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre, correo, teléfono o empresa"
              className="h-11 w-full rounded-full border border-ink/[0.12] bg-white pl-10 pr-4 text-sm text-ink outline-none focus-visible:border-forest focus-visible:shadow-[0_0_0_4px_hsl(var(--lime)/0.45)]"
            />
          </label>
          <div role="group" aria-label="Filtrar clientes" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                  filter === f.id ? "bg-ink text-white" : "bg-ink/[0.05] text-ink hover:bg-ink/10"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-[1.25rem] bg-mint px-5 py-10 text-center text-sm font-medium text-ink/70">
            {clients.length ? "Nadie coincide con la búsqueda." : "Aún no hay clientes. Las compras y suscripciones aparecerán aquí solas."}
          </p>
        ) : (
          <ul role="list" className="flex flex-col gap-2">
            {rows.map((c) => (
              <li key={c.email}>
                <button
                  type="button"
                  onClick={() => setOpen(c.email)}
                  className="grid w-full gap-3 rounded-[1.25rem] bg-white p-3.5 text-left ring-1 ring-ink/[0.08] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-soft sm:grid-cols-12 sm:items-center"
                >
                  <span className="flex min-w-0 items-center gap-3 sm:col-span-5">
                    <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold uppercase text-lime">
                      {(c.name || c.email).charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9375rem] font-bold text-ink">{c.name || "Sin nombre"}</span>
                      <span className="block truncate text-xs text-ink/60">{c.email}</span>
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1 sm:col-span-3">
                    {c.subscribed && <Pill tone="lime">Plan activo</Pill>}
                    {c.tags.map((t) => (
                      <Pill key={t} tone="mint">
                        {t}
                      </Pill>
                    ))}
                  </span>
                  <span className="text-xs text-ink/65 sm:col-span-2">
                    <span className="block font-bold tabular-nums text-ink">{money(c.paidMxn)}</span>
                    {c.payments.length} {c.payments.length === 1 ? "pago" : "pagos"}
                  </span>
                  <span className="flex items-center justify-between gap-2 text-xs text-ink/60 sm:col-span-2 sm:justify-end">
                    {c.account?.con_password ? <Pill tone="ink">Con contraseña</Pill> : <Pill>Solo enlace</Pill>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <ClientDrawer
          key={open}
          client={selected}
          isNew={open === "nuevo"}
          onClose={() => setOpen(null)}
          onCreated={(email) => setOpen(email)}
        />
      )}
    </>
  );
}

interface FormState {
  email: string;
  nombre: string;
  telefono: string;
  empresa: string;
  tipo: "suscripcion" | "compra" | "transferencia" | "manual";
  servicio: string;
  monto: string;
  moneda: "MXN" | "USD";
  estado: "activa" | "pausada" | "cancelada";
  proximo_cobro: string;
  notas: string;
}

function initialForm(c: ClientRow | null): FormState {
  const a = c?.account;
  return {
    email: c?.email || "",
    nombre: a?.nombre || c?.name || "",
    telefono: a?.telefono || c?.phone || "",
    empresa: a?.empresa || "",
    tipo: a?.tipo || (c?.subscriptions.length ? "suscripcion" : c?.payments.length ? "compra" : "transferencia"),
    servicio: a?.servicio || c?.payments[0]?.descripcion || "",
    monto: a?.monto ? String(a.monto) : "",
    moneda: a?.moneda === "USD" ? "USD" : "MXN",
    estado: a?.estado || "activa",
    proximo_cobro: a?.proximo_cobro ? a.proximo_cobro.slice(0, 10) : "",
    notas: a?.notas || "",
  };
}

function ClientDrawer({
  client,
  isNew,
  onClose,
  onCreated,
}: {
  client: ClientRow | null;
  isNew: boolean;
  onClose: () => void;
  onCreated: (email: string) => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialForm(client));
  const [password, setPassword] = useState("");
  const [shownPassword, setShownPassword] = useState("");
  const [sendPassword, setSendPassword] = useState(true);
  const [pay, setPay] = useState({ amount: "", description: "", date: "", receipt: true });
  const { run, busy, message } = useAdminAction();
  const panelRef = useRef<HTMLDivElement>(null);
  const email = client?.email || form.email.trim().toLowerCase();

  // Diálogo: Escape cierra, el foco entra y vuelve al cerrar.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("input, button")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [onClose]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function saveForm() {
    const res = await run("account.save", { account: { ...form, email } }, { ok: isNew ? "Cliente creado." : "Datos guardados." });
    if (res && isNew) onCreated(email);
  }

  async function savePassword(generate: boolean) {
    const res = await run<{ password: string }>(
      "account.password",
      { email, password: generate ? "" : password },
      { ok: "Contraseña guardada. Pásasela al cliente o mándale su acceso." }
    );
    if (res?.password) {
      setShownPassword(res.password);
      setPassword("");
    }
  }

  async function invite() {
    await run(
      "account.invite",
      { email, password: sendPassword && shownPassword ? shownPassword : "" },
      { ok: `Acceso enviado a ${email}.`, refresh: false }
    );
  }

  async function addPayment() {
    const res = await run(
      "purchase.add",
      {
        email,
        name: form.nombre,
        amount: Number(pay.amount),
        currency: form.moneda,
        description: pay.description || form.servicio || "Proyecto web",
        date: pay.date,
        sendReceipt: pay.receipt,
      },
      { ok: pay.receipt ? "Pago registrado y comprobante enviado." : "Pago registrado." }
    );
    if (res) setPay({ amount: "", description: "", date: "", receipt: true });
  }

  async function remove() {
    if (!window.confirm(`¿Borrar la cuenta de ${email}? Sus pagos se quedan en el historial.`)) return;
    const res = await run("account.delete", { email }, { ok: "Cuenta borrada." });
    if (res) onClose();
  }

  const whatsapp = form.telefono.replace(/\D/g, "");
  const monthly = form.tipo === "transferencia" || form.tipo === "suscripcion";

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-ink/40 backdrop-blur-[2px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="admin-drawer flex h-full w-full max-w-xl flex-col overflow-y-auto overscroll-contain bg-canvas shadow-[0_0_80px_-20px_hsl(var(--shade)/0.6)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-canvas/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink/55">{isNew ? "Nuevo cliente" : "Cliente"}</p>
            <h2 id="drawer-title" className="display-title truncate text-2xl text-ink">
              {form.nombre || email || "Sin nombre"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-ink hover:bg-ink hover:text-white">
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-8">
          {message && <Notice tone={message.tone}>{message.text}</Notice>}

          {!isNew && (
            <div className="flex flex-wrap gap-2">
              <a
                href={previewHref(email)}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lime px-4 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-lime"
              >
                <Eye aria-hidden className="h-4 w-4" />
                Ver como cliente
              </a>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.06] px-4 text-sm font-semibold text-ink hover:bg-ink hover:text-white">
                <Mail aria-hidden className="h-4 w-4" />
                Correo
              </a>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.06] px-4 text-sm font-semibold text-ink hover:bg-ink hover:text-white"
                >
                  <FaWhatsapp aria-hidden className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Datos de la cuenta */}
          <section className="panel flex flex-col gap-3 p-4 shadow-soft">
            <h3 className="text-sm font-bold text-ink">Datos</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Correo (con el que entra)" className="sm:col-span-2">
                <Input type="email" value={isNew ? form.email : email} disabled={!isNew} onChange={(e) => set("email", e.target.value)} placeholder="cliente@correo.com" />
              </Field>
              <Field label="Nombre">
                <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </Field>
              <Field label="Teléfono / WhatsApp">
                <Input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="52 55 1234 5678" />
              </Field>
              <Field label="Empresa">
                <Input value={form.empresa} onChange={(e) => set("empresa", e.target.value)} />
              </Field>
              <Field label="Tipo de cliente">
                <Select value={form.tipo} onChange={(e) => set("tipo", e.target.value as FormState["tipo"])}>
                  <option value="compra">Compra única</option>
                  <option value="suscripcion">Suscripción</option>
                  <option value="transferencia">Paga por transferencia</option>
                  <option value="manual">Otro / manual</option>
                </Select>
              </Field>
              <Field label="Servicio" className="sm:col-span-2">
                <Input value={form.servicio} onChange={(e) => set("servicio", e.target.value)} placeholder="Desarrollo web, tarjeta digital, Todo Digital…" />
              </Field>
              {monthly && (
                <>
                  <Field label="Mensualidad" hint="Para el anillo de días de su panel.">
                    <Input inputMode="numeric" value={form.monto} onChange={(e) => set("monto", e.target.value.replace(/[^\d.]/g, ""))} placeholder="7000" />
                  </Field>
                  <Field label="Próximo cobro">
                    <Input type="date" value={form.proximo_cobro} onChange={(e) => set("proximo_cobro", e.target.value)} />
                  </Field>
                </>
              )}
              <Field label="Moneda">
                <Select value={form.moneda} onChange={(e) => set("moneda", e.target.value as FormState["moneda"])}>
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                </Select>
              </Field>
              <Field label="Estado">
                <Select value={form.estado} onChange={(e) => set("estado", e.target.value as FormState["estado"])}>
                  <option value="activa">Activa</option>
                  <option value="pausada">Pausada</option>
                  <option value="cancelada">Cancelada</option>
                </Select>
              </Field>
              <Field label="Notas (solo tú las ves)" className="sm:col-span-2">
                <Textarea value={form.notas} onChange={(e) => set("notas", e.target.value)} />
              </Field>
            </div>
            <Button onClick={saveForm} disabled={!!busy || !email} className="self-start">
              {busy === "account.save" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Save aria-hidden className="h-4 w-4 text-lime" />}
              {isNew ? "Crear cliente" : "Guardar datos"}
            </Button>
          </section>

          {!isNew && (
            <>
              {/* Acceso */}
              <section className="panel flex flex-col gap-3 p-4 shadow-soft">
                <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                  <KeyRound aria-hidden className="h-4 w-4 text-forest" />
                  Acceso a Mi panel
                  {client?.account?.con_password ? <Pill tone="ink">Tiene contraseña</Pill> : <Pill>Solo enlace por correo</Pill>}
                </h3>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="text"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Escribe una contraseña (mín. 8)"
                    aria-label="Nueva contraseña del cliente"
                  />
                  <Button onClick={() => savePassword(false)} disabled={!!busy || password.length < 8} className="shrink-0">
                    Guardar
                  </Button>
                  <Button variant="soft" onClick={() => savePassword(true)} disabled={!!busy} className="shrink-0">
                    Generar una
                  </Button>
                </div>
                {shownPassword && (
                  <div className="flex flex-wrap items-center gap-2 rounded-[1rem] bg-lime px-4 py-3 text-sm text-ink">
                    <span>
                      Contraseña nueva: <strong className="font-mono text-base">{shownPassword}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(shownPassword)}
                      className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink px-3 text-xs font-bold text-white"
                    >
                      <Copy aria-hidden className="h-3.5 w-3.5" />
                      Copiar
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 border-t border-ink/[0.07] pt-3">
                  <Button variant="lime" onClick={invite} disabled={!!busy}>
                    {busy === "account.invite" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Send aria-hidden className="h-4 w-4" />}
                    Enviar acceso por correo
                  </Button>
                  {shownPassword && <Toggle checked={sendPassword} onChange={setSendPassword} label="Incluir la contraseña nueva" />}
                </div>
                <p className="text-xs text-ink/55">Le llega un botón para entrar (vale 7 días) y, después, entra en bryanfdesign.com/mi-panel.</p>
              </section>

              {/* Pagos */}
              <section className="panel flex flex-col gap-3 p-4 shadow-soft">
                <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Receipt aria-hidden className="h-4 w-4 text-forest" />
                  Pagos
                </h3>
                {client?.subscriptions.map((s) => (
                  <p key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[1rem] bg-mint px-3.5 py-2.5 text-sm">
                    <span className="font-semibold text-ink">
                      Suscripción · {s.provider === "stripe" ? "Stripe" : "Mercado Pago"}
                    </span>
                    <span className="text-ink/65">
                      {money(s.amount, s.currency)}/mes · {s.nextChargeAt ? `cobra ${shortDate(s.nextChargeAt)}` : s.rawStatus}
                    </span>
                  </p>
                ))}
                {client?.payments.length ? (
                  <ul className="flex flex-col divide-y divide-ink/[0.07]">
                    {client.payments.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">{p.descripcion || "Pago"}</span>
                          <span className="block text-xs text-ink/55">
                            {shortDate(Date.parse(p.creada))} · {p.proveedor}
                          </span>
                        </span>
                        <span className="shrink-0 font-bold tabular-nums">{money(Number(p.monto), p.moneda)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !client?.subscriptions.length && <p className="text-sm text-ink/55">Sin pagos registrados.</p>
                )}
                <div className="grid gap-2 rounded-[1rem] bg-ink/[0.03] p-3 sm:grid-cols-6">
                  <Field label="Monto" className="sm:col-span-2">
                    <Input inputMode="numeric" value={pay.amount} onChange={(e) => setPay((p) => ({ ...p, amount: e.target.value.replace(/[^\d.]/g, "") }))} placeholder="3500" />
                  </Field>
                  <Field label="Concepto" className="sm:col-span-4">
                    <Input value={pay.description} onChange={(e) => setPay((p) => ({ ...p, description: e.target.value }))} placeholder={form.servicio || "Anticipo del proyecto"} />
                  </Field>
                  <Field label="Fecha" className="sm:col-span-2">
                    <Input type="date" value={pay.date} onChange={(e) => setPay((p) => ({ ...p, date: e.target.value }))} />
                  </Field>
                  <div className="flex items-end sm:col-span-4">
                    <Toggle checked={pay.receipt} onChange={(v) => setPay((p) => ({ ...p, receipt: v }))} label="Mandarle comprobante y su brief" />
                  </div>
                  <Button onClick={addPayment} disabled={!!busy || !(Number(pay.amount) > 0)} className="sm:col-span-6">
                    {busy === "purchase.add" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Plus aria-hidden className="h-4 w-4 text-lime" />}
                    Registrar pago por transferencia
                  </Button>
                </div>
              </section>

              <Button variant="danger" onClick={remove} disabled={!!busy || !client?.account} className="self-start">
                <Trash2 aria-hidden className="h-4 w-4" />
                Borrar cuenta
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

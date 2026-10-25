/**
 * BASE DE DATOS DEL SITIO — Supabase (proyecto BryanF-Access, esquema `sitio`).
 *
 * El esquema no está expuesto: todo pasa por dos funciones de Postgres que se
 * llaman por HTTPS con la llave pública de Supabase:
 *  - `sitio_publico()` — ajustes públicos (temporada, descuentos, aviso).
 *  - `sitio_rpc(llave, op, args)` — cuentas, compras y ajustes. Exige
 *    SITIO_DB_KEY, que solo vive en el servidor (su hash está en sitio.llave).
 *
 * Sin las variables, `dbConfigured()` es false y el sitio funciona con los
 * valores por defecto (temporada automática por fecha, sin descuentos).
 */

const TIMEOUT_MS = 6_000;

function base() {
  return (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
}

function publicKey() {
  return process.env.SUPABASE_PUBLISHABLE_KEY || "";
}

export function dbConfigured() {
  return !!(base() && publicKey() && (process.env.SITIO_DB_KEY || "").length >= 32);
}

export function publicDbConfigured() {
  return !!(base() && publicKey());
}

async function call<T>(fn: string, body: Record<string, unknown> | null): Promise<T> {
  const res = await fetch(`${base()}/rest/v1/rpc/${fn}`, {
    method: body ? "POST" : "GET",
    headers: {
      apikey: publicKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase ${fn} ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

/** Operación protegida (solo servidor). */
export function rpc<T = unknown>(op: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!dbConfigured()) return Promise.reject(new Error("Base de datos no configurada"));
  return call<T>("sitio_rpc", { p_llave: process.env.SITIO_DB_KEY, p_op: op, p_args: args });
}

/** Ajustes públicos del sitio (o `{}` si no hay base). */
export async function readPublicSettings(): Promise<Record<string, unknown>> {
  if (!publicDbConfigured()) return {};
  const value = await call<unknown>("sitio_publico", null);
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

// ——— Cuentas ———————————————————————————————————————————————————————————

export type AccountKind = "suscripcion" | "compra" | "transferencia" | "manual";
export type AccountState = "activa" | "pausada" | "cancelada";

export interface Account {
  email: string;
  nombre: string;
  telefono: string;
  empresa: string;
  tipo: AccountKind;
  servicio: string;
  monto: number;
  moneda: string;
  estado: AccountState;
  proximo_cobro: string | null;
  notas: string;
  creada: string;
  actualizada: string;
  ultimo_acceso: string | null;
  /** Solo en la lista: si ya tiene contraseña. */
  con_password?: boolean;
  /** Solo al leer una cuenta (nunca sale del servidor). */
  password_hash?: string | null;
}

export type AccountInput = Partial<Omit<Account, "creada" | "actualizada" | "con_password">> & { email: string };

export const getAccount = (email: string) => rpc<Account | null>("cuenta", { email });
export const listAccounts = () => rpc<Account[]>("cuentas");
export const saveAccount = (input: AccountInput) => rpc<Account>("cuenta_guardar", input);
export const deleteAccount = (email: string) => rpc("cuenta_borrar", { email });

// ——— Compras (pagos únicos) ————————————————————————————————————————————

export interface Purchase {
  id: string;
  email: string;
  nombre: string;
  proveedor: "stripe" | "mercadopago" | "transferencia" | "manual";
  descripcion: string;
  monto: number;
  moneda: string;
  estado: string;
  creada: string;
  meta: Record<string, unknown>;
}

export type PurchaseInput = Omit<Purchase, "creada" | "meta" | "estado" | "nombre"> &
  Partial<Pick<Purchase, "creada" | "meta" | "estado" | "nombre">>;

export const listPurchases = (email = "") => rpc<Purchase[]>("compras", { email });
export const savePurchase = (input: PurchaseInput) => rpc("compra_guardar", input);
export const deletePurchase = (id: string) => rpc("compra_borrar", { id });

/**
 * Registra un pago único y abre (o actualiza) la cuenta de esa persona, para
 * que entre a Mi panel con el mismo correo. Nunca rompe el flujo que lo
 * llama: si la base falla, solo se anota en el log.
 */
export async function recordPurchase(input: PurchaseInput & { telefono?: string; subscription?: boolean }) {
  if (!dbConfigured() || !input.email) return;
  const { telefono, subscription, ...purchase } = input;
  const email = input.email.trim().toLowerCase();
  try {
    await savePurchase({ ...purchase, email });
    const existing = await getAccount(email);
    await saveAccount({
      email,
      nombre: existing?.nombre || input.nombre || "",
      telefono: existing?.telefono || telefono || "",
      // Una suscripción pesa más que una compra: no se degrada.
      tipo:
        subscription || existing?.tipo === "suscripcion"
          ? "suscripcion"
          : existing?.tipo || (input.proveedor === "transferencia" ? "transferencia" : "compra"),
      servicio: existing?.servicio || input.descripcion,
      estado: "activa",
    });
  } catch (error) {
    console.error("DB: no se pudo registrar la compra", error);
  }
}

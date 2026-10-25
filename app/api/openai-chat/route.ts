import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { buildLuminaSystemPrompt } from "@/lib/lumina-prompt";

const PRIMARY_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const FALLBACK_MODEL = "gpt-4o-mini";
/** Turnos de la conversación que se mandan al modelo (los más recientes). */
const MAX_TURNS = 14;
const MAX_USER_CHARS = 600;
const MAX_ASSISTANT_CHARS = 1200;

/** Identificador anónimo por visitante para el monitoreo de abuso de OpenAI. */
function hashIp(ip: string) {
  return createHash("sha256").update(`bfd:${ip}`).digest("hex").slice(0, 16);
}

export const runtime = "nodejs";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY missing" },
        { status: 500 }
      );
    }

    // --- Abuse guards (this is a key-bearing proxy) ---
    // Same-origin only when called from a browser: block other sites from
    // burning the OpenAI key. Server-to-server (no Origin) still allowed.
    if (!isSameOrigin(req)) return forbidden();

    // Ráfaga corta y tope diario por IP: una conversación normal cabe de
    // sobra; un script que quiera gastar la llave no.
    const ip = getClientIp(req);
    const burst = rateLimit(`openai-chat:${ip}`, { limit: 12, windowMs: 5 * 60 * 1000 });
    const daily = rateLimit(`openai-chat-day:${ip}`, { limit: 80, windowMs: 24 * 60 * 60 * 1000 });
    if (!burst.ok || !daily.ok) return tooManyRequests();

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const raw = Array.isArray(body.messages) ? body.messages : [];

    // Solo turnos de usuario y asistente: cualquier "system" que mande el
    // navegador se descarta (el prompt lo arma el servidor).
    const turns = raw
      .filter(
        (m): m is { role: "user" | "assistant"; content: string } =>
          !!m &&
          typeof m === "object" &&
          ((m as { role?: unknown }).role === "user" || (m as { role?: unknown }).role === "assistant") &&
          typeof (m as { content?: unknown }).content === "string"
      )
      .slice(-MAX_TURNS)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, m.role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS),
      }));

    if (!turns.length || turns[turns.length - 1].role !== "user") {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    if (!turns[turns.length - 1].content.trim()) {
      return NextResponse.json({ error: "empty message" }, { status: 400 });
    }

    const locale = typeof body.locale === "string" ? body.locale : "es";
    const section = typeof body.section === "string" ? body.section : "inicio";

    const messages = [
      { role: "system", content: buildLuminaSystemPrompt(locale, section) },
      ...turns,
    ];

    const callOpenAI = (model: string) =>
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.35,
          // Respuestas cortas: tope duro de costo por mensaje.
          max_tokens: 380,
          user: `lumina-${hashIp(ip)}`,
        }),
      });

    // Modelo configurable (OPENAI_MODEL); si no existe en la cuenta, cae al
    // modelo económico de siempre.
    let openaiRes = await callOpenAI(PRIMARY_MODEL);
    if (!openaiRes.ok && (openaiRes.status === 404 || openaiRes.status === 400) && PRIMARY_MODEL !== FALLBACK_MODEL) {
      openaiRes = await callOpenAI(FALLBACK_MODEL);
    }

    const contentType = (
      openaiRes.headers.get("content-type") || ""
    ).toLowerCase();
    const data = contentType.includes("application/json")
      ? await openaiRes.json()
      : {
          error: {
            message: `OpenAI returned non-JSON (${openaiRes.status})`,
          },
        };

    if (!openaiRes.ok || data.error) {
      // Log details server-side; return a generic message to the client.
      console.error("OpenAI error:", data?.error || openaiRes.status);
      return NextResponse.json(
        { error: "El asistente no está disponible por el momento." },
        { status: 502 }
      );
    }

    // Solo el texto: nada de metadatos de la cuenta hacia el navegador.
    const content = String(data?.choices?.[0]?.message?.content ?? "").slice(0, 2400);
    return NextResponse.json({ choices: [{ message: { content } }] });
  } catch (error) {
    console.error("OpenAI proxy error:", error);
    return NextResponse.json(
      { error: "El asistente no está disponible por el momento." },
      { status: 500 }
    );
  }
}

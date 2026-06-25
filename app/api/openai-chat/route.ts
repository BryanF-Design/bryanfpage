import { NextRequest, NextResponse } from "next/server";

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

    const body = await req.json().catch(() => ({}) as Record<string, unknown>);
    const messages = Array.isArray((body as Record<string, unknown>).messages)
      ? (body as Record<string, unknown>).messages
      : [];
    const temperature =
      typeof (body as Record<string, unknown>).temperature === "number"
        ? ((body as Record<string, unknown>).temperature as number)
        : 0.4;
    const max_tokens =
      typeof (body as Record<string, unknown>).max_tokens === "number"
        ? ((body as Record<string, unknown>).max_tokens as number)
        : undefined;
    const response_format = (body as Record<string, unknown>).response_format;

    if (!Array.isArray(messages) || !messages.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // --- Abuse guards (this is a key-bearing proxy) ---
    // Same-origin only when called from a browser: block other sites from
    // burning the OpenAI key. Server-to-server (no Origin) still allowed.
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin) {
      try {
        if (new URL(origin).host !== host) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    if (messages.length > 30) {
      return NextResponse.json({ error: "Too many messages" }, { status: 400 });
    }
    const totalChars = (messages as Array<{ content?: unknown }>).reduce(
      (n, m) => n + String(m?.content ?? "").length,
      0
    );
    if (totalChars > 16000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const payload: Record<string, unknown> = {
      model: "gpt-4o-mini",
      messages,
      temperature: Math.min(Math.max(temperature, 0), 1),
      // Always bound output to cap cost/abuse.
      max_tokens: max_tokens ? Math.min(max_tokens, 800) : 600,
    };
    if (response_format) payload.response_format = response_format;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

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

    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenAI proxy error:", error);
    return NextResponse.json(
      { error: "El asistente no está disponible por el momento." },
      { status: 500 }
    );
  }
}

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

    const payload: Record<string, unknown> = {
      model: "gpt-4o-mini",
      messages,
      temperature,
    };
    if (max_tokens) payload.max_tokens = max_tokens;
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
      const msg =
        data && data.error
          ? data.error.message || JSON.stringify(data.error)
          : "OpenAI request failed";
      return NextResponse.json(
        { error: `OpenAI error: ${msg}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json(
      { error: `OpenAI proxy error: ${message}` },
      { status: 500 }
    );
  }
}

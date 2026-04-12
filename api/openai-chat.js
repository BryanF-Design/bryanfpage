function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY missing" });
    }

    const body = parseBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const temperature = typeof body.temperature === "number" ? body.temperature : 0.4;
    const max_tokens = typeof body.max_tokens === "number" ? body.max_tokens : undefined;
    const response_format = body.response_format;

    if (!messages.length) return res.status(400).json({ error: "messages required" });

    const payload = {
      model: "gpt-4o-mini",
      messages,
      temperature
    };
    if (max_tokens) payload.max_tokens = max_tokens;
    if (response_format) payload.response_format = response_format;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const contentType = (openaiRes.headers.get("content-type") || "").toLowerCase();
    const data = contentType.includes("application/json")
      ? await openaiRes.json()
      : { error: { message: `OpenAI returned non-JSON (${openaiRes.status})` } };

    if (!openaiRes.ok || data.error) {
      const msg = data && data.error ? data.error.message || JSON.stringify(data.error) : "OpenAI request failed";
      return res.status(500).json({ error: `OpenAI error: ${msg}` });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: `OpenAI proxy error: ${error.message}` });
  }
};

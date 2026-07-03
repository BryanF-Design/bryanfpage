import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory sliding-window rate limiter. Good enough as a defense-in-depth
 * layer on a single long-lived Node process; on Vercel serverless it only
 * protects within a warm instance (state doesn't survive cold starts or
 * spread across instances). For hard guarantees, pair with Vercel
 * Firewall / WAF rate-limit rules in the project dashboard.
 */
const buckets = new Map<string, number[]>();

// Periodically drop stale buckets so this doesn't leak memory on a
// long-lived server.
const MAX_TRACKED_KEYS = 5000;

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > MAX_TRACKED_KEYS) {
    const cutoff = now - windowMs;
    buckets.forEach((v, k) => {
      if (!v.length || v[v.length - 1] < cutoff) buckets.delete(k);
    });
  }

  return { ok: hits.length <= limit, remaining: Math.max(0, limit - hits.length) };
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Blocks cross-site browser calls; allows server-to-server (no Origin header). */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export function tooManyRequests() {
  return NextResponse.json({ error: "Demasiadas solicitudes. Intenta más tarde." }, { status: 429 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

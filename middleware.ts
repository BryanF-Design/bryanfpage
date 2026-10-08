import { NextResponse, type NextRequest } from "next/server";

import { isLocale, localeFromAcceptLanguage, localeFromCountry } from "@/lib/i18n/locales";

const COOKIE_NAME = "bryanf_lang";
const CANONICAL_HOST = "www.bryanfdesign.com";
const LEGACY_HOSTS = new Set([
  "bryanfdesign.com",
  "bryanfdesign.com.mx",
  "www.bryanfdesign.com.mx",
]);
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Runs once per visitor, on their very first request. If they already have a
// language cookie (an earlier visit, or an explicit choice from the
// switcher), we leave it alone. Otherwise we guess a starting language from
// Vercel's edge geo header (free, no external API) and fall back to the
// browser's Accept-Language header for local dev / non-Vercel hosting. The
// visitor can always override it from the language switcher afterwards.
export function middleware(request: NextRequest) {
  // The canonical public host is www.bryanfdesign.com. The apex and the
  // previous .com.mx domain (if it still points here) redirect permanently,
  // path and query included, so links and rankings consolidate on one host.
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (host && LEGACY_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (isLocale(existing)) return NextResponse.next();

  const country = request.headers.get("x-vercel-ip-country");
  const locale = country
    ? localeFromCountry(country)
    : localeFromAcceptLanguage(request.headers.get("accept-language"));

  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};

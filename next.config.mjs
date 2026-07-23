/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lottie.host" },
    ],
  },
  // Clean URLs for the legacy pages still served as static files from /public
  // (legal pages + post-payment briefing, pending migration to Next routes).
  // `/crear-web` ya NO se reescribe: ahora es una ruta React real
  // (app/crear-web) con el Configurador nuevo y el catálogo centralizado.
  async rewrites() {
    return [
      { source: "/privacidad", destination: "/privacidad.html" },
      { source: "/terminos", destination: "/terminos.html" },
      { source: "/gracias", destination: "/gracias.html" },
    ];
  },
  // Baseline security headers on every response.
  async headers() {
    // 'unsafe-inline' on script/style is required by GA/Clarity's inline init
    // snippets, the JSON-LD block, and a legacy inline onload= swap on
    // crear-web.html — none of them are attacker-controlled, and the real
    // protection here is the origin allowlist (blocks injected <script src>
    // from a third-party domain) plus frame-ancestors/object-src/base-uri.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.clarity.ms https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "img-src 'self' data: blob:",
      "font-src 'self' https://cdnjs.cloudflare.com data:",
      "connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;

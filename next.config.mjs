/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lottie.host" },
    ],
  },
  // Las páginas viejas en HTML estático ya son rutas de Next: quien llegue
  // con la URL antigua (buscadores, enlaces guardados) va a la nueva.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/crear-web.html", destination: "/crear-web", permanent: true },
      { source: "/terminos.html", destination: "/terminos", permanent: true },
      { source: "/privacidad.html", destination: "/privacidad", permanent: true },
      // El panel de administración se llamaba BryanF Access.
      { source: "/access", destination: "/admin", permanent: true },
    ];
  },
  // Baseline security headers on every response.
  async headers() {
    // 'unsafe-inline' on script/style is required by GA/Clarity's inline init
    // snippets, the bootstrap scripts in app/layout and the JSON-LD block —
    // none of them are attacker-controlled, and the real
    // protection here is the origin allowlist (blocks injected <script src>
    // from a third-party domain) plus frame-ancestors/object-src/base-uri.
    const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${devEval} https://*.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.clarity.ms`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com https://*.google.com.mx https://www.googleadservices.com https://*.clarity.ms https://c.bing.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.google.com https://*.google.com.mx https://www.googleadservices.com https://*.clarity.ms https://c.bing.com",
      // Google Ads abre un iframe invisible para atribución y remarketing.
      "frame-src 'self' https://td.doubleclick.net https://www.googletagmanager.com",
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

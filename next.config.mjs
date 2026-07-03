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
  // (payments configurator + legal pages, pending migration to Next routes).
  async rewrites() {
    return [
      { source: "/crear-web", destination: "/crear-web.html" },
      { source: "/privacidad", destination: "/privacidad.html" },
      { source: "/terminos", destination: "/terminos.html" },
      { source: "/gracias", destination: "/gracias.html" },
    ];
  },
  // Baseline security headers on every response.
  async headers() {
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
        ],
      },
    ];
  },
};

export default nextConfig;

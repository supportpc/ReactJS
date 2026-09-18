/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  serverExternalPackages: ["pdfkit"],

  sassOptions: {
    quietDeps: true,
    silenceDeprecations: [
      "mixed-decls",
      "legacy-js-api",
      "import",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.nustechacademy.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/.well-known/security.txt',
        destination: '/security.txt',
      },
    ];
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Force HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },

          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },

          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Control referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Restrict browser features
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=()",
          },

          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
              "style-src 'self' 'unsafe-inline' https:; " +
              "img-src 'self' data: blob: https:; " +
              "font-src 'self' data: https:; " +
              "connect-src 'self' https:; " +
              "media-src 'self' blob: https:; " +
              "frame-src 'self' https:; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self';",
          },
        ],
      },
    ];
  },
  // X-Powered-By: Next.js
  poweredByHeader: false,

};

module.exports = nextConfig;
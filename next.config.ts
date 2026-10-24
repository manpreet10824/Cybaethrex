import type { NextConfig } from "next";

/**
 * Every page is static or SSG. The one server feature is POST /api/contact,
 * which delivers the contact form, so the site ships either way:
 *
 *   npm run build          server output (Vercel, Node hosting). The contact
 *                          form posts to the API route and is delivered.
 *   npm run build:static   a plain `out/` folder (Cloudflare Pages, Netlify,
 *                          GitHub Pages, S3, any static host). The API route
 *                          is omitted, so the form's POST fails and it falls
 *                          back to opening the draft in the reader's mail
 *                          client. Pages are identical.
 *
 * Static export cannot use the Next image optimizer, so images are passed
 * through unoptimized. That costs nothing here: the only images are the logo
 * rasters and the share card, all already sized for their use.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

/**
 * `standalone` emits .next/standalone with a self-contained server.js and only
 * the node_modules actually reached, which is what the Dockerfile copies. Set
 * by the container build; harmless everywhere else.
 */
const standalone = process.env.BUILD_STANDALONE === "1";

/**
 * Content-Security-Policy, matched to what the site actually loads: every
 * script, style, font and image is served from this origin (next/font
 * self-hosts the Google fonts) and the only fetch is to /api/contact.
 *
 * Scripts keep 'unsafe-inline' because the pages are prerendered: Next.js
 * writes its hydration payload as inline <script> tags that differ per page,
 * and a nonce needs a server render per request, which would end static
 * delivery. What the policy does buy: no third-party script origins, no
 * plugins, no <base> hijack, no framing, and no exfiltration to other hosts
 * through fetch, images or forms. Styles need 'unsafe-inline' for the
 * animation libraries, which set inline styles on every frame.
 *
 * 'unsafe-eval' is added in development only, where React's tooling needs it.
 */
const dev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // no "X-Powered-By: Next.js" banner advertising the framework and version
  poweredByHeader: false,

  ...(staticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        // Static hosts serve /path/ as /path/index.html; trailing slashes keep
        // relative asset resolution correct across all of them.
        trailingSlash: true,
      }
    : standalone
      ? { output: "standalone" }
      : {}),

  // Security headers. Ignored by `output: "export"` (a static host has no
  // server to send them), so the same rules are mirrored in public/_headers
  // for Cloudflare Pages and Netlify.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

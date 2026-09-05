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

const nextConfig: NextConfig = {
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
        ],
      },
    ];
  },
};

export default nextConfig;

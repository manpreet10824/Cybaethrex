import type { NextConfig } from "next";

/**
 * The site has no server features: no route handlers, no server actions, no
 * runtime data. Every route is static or SSG, so it can ship either way.
 *
 *   npm run build          server output (Vercel, Node hosting)
 *   npm run build:static   a plain `out/` folder (Cloudflare Pages, Netlify,
 *                          GitHub Pages, S3, any static host)
 *
 * Static export cannot use the Next image optimizer, so images are passed
 * through unoptimized. That costs nothing here: the only images are the logo
 * rasters and the share card, all already sized for their use.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        // Static hosts serve /path/ as /path/index.html; trailing slashes keep
        // relative asset resolution correct across all of them.
        trailingSlash: true,
      }
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

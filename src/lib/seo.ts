/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL in the deploy environment; the
 * fallback only exists so local builds and previews resolve absolute URLs for
 * Open Graph images and the sitemap.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cybaethrex.com"
).replace(/\/$/, "");

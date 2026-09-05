import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required for `output: "export"`: these are route handlers, and a
// static export needs them pinned to build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

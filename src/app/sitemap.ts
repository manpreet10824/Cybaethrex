import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

// Required for `output: "export"`: these are route handlers, and a
// static export needs them pinned to build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/industries", priority: 0.7 },
    { path: "/insights", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/training", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/responsible-disclosure", priority: 0.3 },
  ];

  return [
    ...routes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...INSIGHTS.map((a) => ({
      url: `${SITE_URL}/insights/${a.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}

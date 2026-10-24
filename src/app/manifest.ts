import type { MetadataRoute } from "next";

// Required for `output: "export"`, like robots.ts and sitemap.ts.
export const dynamic = "force-static";

/** Lets the site be pinned to a home screen with the right name, icon and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cybaethrex",
    short_name: "Cybaethrex",
    description:
      "Cybersecurity consulting for a changing technology landscape.",
    start_url: "/",
    display: "browser",
    background_color: "#08080a",
    theme_color: "#08080a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

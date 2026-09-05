"use client";

import Image from "next/image";

/**
 * The lockup ships as two rasters because the wordmark is charcoal: readable on
 * a light ground, invisible on a dark one. Both are generated from the same
 * source artwork, so the cloud gradient and the red REX are pixel-identical:
 * only the AETH glyphs are recoloured. CSS picks the right one per theme, which
 * keeps the swap instant and avoids a flash on theme change.
 */
export function Logo({
  className = "",
  height = 26,
  variant = "lockup",
  priority = false,
}: {
  className?: string;
  height?: number;
  /** "lockup" = full wordmark, "mark" = the cloud only */
  variant?: "lockup" | "mark";
  priority?: boolean;
}) {
  if (variant === "mark") {
    return (
      <Image
        src="/cybaethrex-mark.png"
        alt="Cybaethrex"
        width={274}
        height={173}
        priority={priority}
        className={className}
        style={{ height, width: "auto" }}
      />
    );
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ height, aspectRatio: "808 / 173" }}
    >
      <Image
        src="/cybaethrex-logo-light.png"
        alt="Cybaethrex"
        width={808}
        height={173}
        priority={priority}
        className="logo-light absolute inset-0 h-full w-full object-contain"
      />
      <Image
        src="/cybaethrex-logo-dark.png"
        alt=""
        aria-hidden
        width={808}
        height={173}
        priority={priority}
        className="logo-dark absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

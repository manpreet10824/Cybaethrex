"use client";

import Image from "next/image";

/**
 * The lockup ships as two rasters because the wordmark is charcoal: readable on
 * a light ground, invisible on a dark one. Both are generated from the same
 * source artwork, so the cloud gradient and the red REX are pixel-identical:
 * only the AETH glyphs are recoloured. CSS picks the right one per theme, which
 * keeps the swap instant and avoids a flash on theme change.
 *
 * `sizes` tells next/image the rendered width, which never exceeds about
 * 130px: without it the optimizer serves the 1x/2x of the intrinsic 808px,
 * a 1920px-wide file for a 28px-tall logo. Ignored by the static export,
 * which serves the original file.
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
        sizes="64px"
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
        sizes="200px"
        priority={priority}
        className="logo-light absolute inset-0 h-full w-full object-contain"
      />
      <Image
        src="/cybaethrex-logo-dark.png"
        alt=""
        aria-hidden
        width={808}
        height={173}
        sizes="200px"
        priority={priority}
        className="logo-dark absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/**
 * GSAP owns scroll storytelling: scrubbed timelines, SVG path drawing and
 * multi-element choreography. Motion keeps hover, layout and UI state; CSS
 * `position: sticky` keeps the pinning, which it does more cheaply than a
 * pin-spacer would.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);
}

/**
 * Scrubbed tweens track the scrollbar, so they are linear by definition:
 * easing them would break the "animation follows the user" contract. Easing
 * belongs to the non-scrubbed tweens only, where it matches our CSS curves.
 */
export const SCRUB = "none" as const;
export const GSAP_EASE_OUT = "power4.out";

/** Smoothing applied to every scrubbed trigger, in seconds. */
export const SCRUB_SMOOTH = 0.6;

export { gsap, ScrollTrigger, DrawSVGPlugin, useGSAP };

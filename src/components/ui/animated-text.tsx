"use client";

import { useEffect, useRef } from "react";
import { useMotionFlags } from "@/components/motion/MotionProfile";

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  minWeight?: number;
  maxWeight?: number;
  animationDuration?: number;
  delayMultiplier?: number;
  /** lets the effect sit inside an existing heading instead of owning layout */
  className?: string;
  bare?: boolean;
}

/**
 * Variable-weight "breathing" text.
 *
 * Three changes from the reference implementation, each load-bearing:
 *
 * 1. `font-weight` rather than `font-variation-settings`. On a variable font
 *    font-weight drives the same `wght` axis, but it interpolates natively;
 *    animating font-variation-settings through a CSS variable is inconsistent
 *    across engines.
 * 2. One global keyframe in globals.css fed by custom properties, instead of
 *    `<style jsx>` per instance. The original declares `@keyframes breath`
 *    inside every instance, so two instances with different weight ranges
 *    would fight over the same global name. It also nested a <style> inside a
 *    <p>, which is invalid.
 * 3. Honours prefers-reduced-motion. Text that never stops moving is exactly
 *    what that setting exists to stop.
 */
export function AnimatedText({
  text,
  fontSize,
  minWeight = 200,
  maxWeight = 800,
  animationDuration = 1.5,
  delayMultiplier = 0.25,
  className = "",
  bare = false,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { reduced, ready } = useMotionFlags();
  const animate = ready && !reduced;

  useEffect(() => {
    if (!containerRef.current || !animate) return;

    // Delay is mapped around the midpoint so the wave travels outward from the
    // centre rather than left to right.
    const spans = containerRef.current.querySelectorAll<HTMLElement>("span");
    const half = spans.length / 2;
    spans.forEach((span, i) => {
      span.style.animationDelay = `${(i - half) * delayMultiplier}s`;
    });
  }, [text, delayMultiplier, animate]);

  const characters = text.split("").map((char, index) => (
    <span
      key={index}
      aria-hidden="true"
      className={animate ? "animated-text-char" : undefined}
      style={
        animate
          ? ({
              "--w-min": minWeight,
              "--w-max": maxWeight,
              animationDuration: `${animationDuration}s`,
              fontWeight: minWeight,
            } as React.CSSProperties)
          : { fontWeight: Math.round((minWeight + maxWeight) / 2) }
      }
    >
      {/* preserve spaces: a bare space in an inline-block collapses */}
      {char === " " ? " " : char}
    </span>
  ));

  const content = (
    <span
      ref={containerRef}
      aria-label={text}
      className={className}
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
    >
      {characters}
    </span>
  );

  if (bare) return content;

  return <div className="flex items-center justify-center">{content}</div>;
}

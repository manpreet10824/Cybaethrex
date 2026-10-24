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
    const spans = containerRef.current.querySelectorAll<HTMLElement>('span[aria-hidden="true"]');
    const half = spans.length / 2;
    spans.forEach((span, i) => {
      span.style.animationDelay = `${(i - half) * delayMultiplier}s`;
    });
  }, [text, delayMultiplier, animate]);

  // Words are grouped so the line can wrap between them. A flat run of
  // per-character spans joined by non-breaking spaces gave the browser no
  // break opportunity, and a long headline overflowed narrow viewports.
  let index = 0;
  const words = text.split(" ").map((word, w) => (
    <span key={w} className="inline-block whitespace-nowrap">
      {word.split("").map((char) => {
        const i = index++;
        return (
          <span
            key={i}
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
            {char}
          </span>
        );
      })}
    </span>
  ));
  const characters = words.flatMap((w, i) =>
    i === 0 ? [w] : [" ", w],
  );

  const content = (
    <span
      ref={containerRef}
      className={className}
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
    >
      {/* aria-label is not allowed on a plain span, so screen readers get the
          words as text and the per-letter spans stay hidden */}
      <span className="sr-only">{text}</span>
      {characters}
    </span>
  );

  if (bare) return content;

  return <div className="flex items-center justify-center">{content}</div>;
}

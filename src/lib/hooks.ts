"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionFlags } from "@/components/motion/MotionProfile";

/**
 * Sets --mx/--my on the element so `.cursor-light` can paint a radial highlight
 * under the pointer. Desktop only; returns a no-op handler otherwise.
 */
export function useCursorLight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const { cursor } = useMotionFlags();
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!cursor) return;
      const el = ref.current;
      if (!el) return;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${clientX - r.left}px`);
        el.style.setProperty("--my", `${clientY - r.top}px`);
      });
    },
    [cursor],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, onPointerMove, enabled: cursor };
}

/** True while the element is intersecting, used to park rAF loops offscreen. */
export function useInViewport<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Window scroll position past a threshold, throttled to a frame. */
export function useScrolledPast(threshold = 24) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setPast(window.scrollY > threshold);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionFlags } from "@/components/motion/MotionProfile";

/**
 * Lenis, driven off the GSAP ticker so smooth scrolling and ScrollTrigger stay
 * on one clock. Disabled entirely under reduced motion, smoothing the scroll
 * is exactly the kind of motion that setting asks us not to add: and left off
 * for touch, where the native scroller is better than anything we can fake.
 */
export function SmoothScroll() {
  const { reduced, ready } = useMotionFlags();

  useEffect(() => {
    if (!ready || reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /**
     * In-page anchors must go through Lenis. A native fragment jump sets the
     * scroll position directly, which Lenis then pulls back toward its own
     * target, landing somewhere between the two. Intercept, and let Lenis do
     * the travel. Cross-page hashes fall through to Next's router untouched.
     */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const id = href.startsWith("#")
        ? href.slice(1)
        : href.startsWith("/#")
          ? href.slice(2)
          : null;
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return; // not on this page, let the router navigate

      e.preventDefault();
      // matches scroll-mt-24 on the sections, so the nav never covers a heading
      lenis.scrollTo(target, { offset: -96 });
      window.history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    // Anything inside a scrollable panel keeps its own native scrolling.
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [ready, reduced]);

  return null;
}

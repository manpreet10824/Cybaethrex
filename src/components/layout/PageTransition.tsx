"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { useMotionFlags } from "@/components/motion/MotionProfile";

/**
 * Route change: the outgoing page settles back, a dark security grid sweeps
 * across, the new page rises in. Total budget ~420ms.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { reduced } = useMotionFlags();
  const [wiping, setWiping] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  // Adjusting state during render on a route change: no effect, no extra frame.
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    if (!reduced && !wiping) setWiping(true);
  }

  if (reduced) return <>{children}</>;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="flex min-h-full flex-1 flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {wiping ? (
          <motion.div
            key="wipe"
            className="pointer-events-none fixed inset-0 z-[70] origin-bottom"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.42,
              ease: EASE_OUT,
              times: [0, 0.42, 0.58, 1],
            }}
            style={{ transformOrigin: "bottom" }}
            onAnimationComplete={() => setWiping(false)}
            aria-hidden
          >
            <div className="field-grid-fine absolute inset-0 bg-bg-deep" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(var(--rgb-signal)/0.10),transparent_70%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-signal/60" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

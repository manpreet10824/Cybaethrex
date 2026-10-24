"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DUR, EASE_OUT } from "@/lib/motion";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { useConsent } from "@/lib/consent";

/**
 * Privacy notice shown on the first visit, until the visitor answers.
 *
 * It is a non-modal region rather than a dialog: the page stays usable behind
 * it, nothing is loaded that would need consent, and a notice that blocks the
 * content it is explaining would be the worse pattern. Both choices are real
 * buttons of equal weight, so declining is as easy as accepting.
 */
export function ConsentBanner() {
  const { state, accept, decline } = useConsent();
  const { reduced } = useMotionFlags();
  const open = state === "pending";

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          key="consent"
          role="region"
          aria-label="Privacy and cookies"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: DUR.normal, ease: EASE_OUT }}
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-[680px] rounded-xl border border-line bg-[rgb(var(--rgb-panel)/0.96)] p-5 shadow-[0_24px_60px_-24px_rgb(var(--rgb-hair)/0.4)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <span
            className="absolute inset-x-0 top-0 block h-px rounded-t-xl bg-[linear-gradient(90deg,var(--brand-orange),var(--brand-red))]"
            aria-hidden
          />
          <p className="mono flex items-center gap-2 text-[10px] tracking-[0.2em] text-signal">
            <ShieldCheck size={13} strokeWidth={1.8} aria-hidden />
            PRIVACY &amp; COOKIES
          </p>
          <h2 className="mt-3 text-[15px] font-medium leading-snug text-ink">
            This site sets no tracking cookies.
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            We run no analytics or advertising scripts. Your browser keeps your
            theme and language choice on your own device, and the contact form
            sends us only what you type into it. Choose whether we may also
            store optional preferences in future; essential settings work either
            way. Details are in the{" "}
            <Link
              href="/privacy"
              className="link-underline text-signal underline-offset-4"
            >
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={accept}
              className="h-auto rounded-full px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--signal-hover)]"
            >
              Accept
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={decline}
              className="h-auto rounded-full border-line-strong bg-transparent px-5 py-2.5 text-[12.5px] hover:border-signal hover:bg-transparent hover:text-signal"
            >
              Essential only
            </Button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

/** Footer link that reopens the notice so a choice can be changed. */
export function ConsentSettingsLink({ className }: { className?: string }) {
  const { reopen } = useConsent();
  return (
    <button type="button" onClick={reopen} className={className}>
      Privacy &amp; cookie settings
    </button>
  );
}

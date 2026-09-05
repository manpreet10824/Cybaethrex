"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { cineIn, stagger } from "@/lib/motion";
import { AUDIENCES } from "@/lib/content.training";

/**
 * Training gets its own front door. Quieter than the consulting hero, no
 * canvas graph, so the two destinations never read as the same page.
 */
export function TrainingHero() {
  const { reduced } = useMotionFlags();

  return (
    <section className="relative isolate w-full overflow-hidden px-6 pb-20 pt-36 sm:px-10 lg:pt-40">
      <div
        className="field-grid absolute inset-0 -z-30 opacity-60"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-30 bg-[radial-gradient(100%_70%_at_20%_0%,rgb(var(--rgb-signal)/0.09),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(to_bottom,transparent,var(--bg))]"
        aria-hidden
      />

      <motion.div
        className="relative mx-auto w-full max-w-[1240px]"
        variants={reduced ? undefined : stagger(0.12, 0.1)}
        initial={reduced ? undefined : "hidden"}
        animate={reduced ? undefined : "show"}
      >
        <motion.div variants={reduced ? undefined : cineIn}>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[12.5px] text-muted-dim transition-colors duration-200 hover:text-signal"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.6}
              className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[3px]"
              aria-hidden
            />
            Cybaethrex Consulting
          </Link>
        </motion.div>

        <motion.p
          variants={reduced ? undefined : cineIn}
          className="eyebrow mt-8"
        >
          Cybaethrex Training
        </motion.p>

        <motion.h1
          variants={reduced ? undefined : cineIn}
          className="mt-5 max-w-4xl text-[clamp(2.2rem,5.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.03em]"
        >
          Build the skills to secure{" "}
          <span className="text-signal">what comes next</span>.
        </motion.h1>

        <motion.p
          variants={reduced ? undefined : cineIn}
          className="mt-7 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base"
        >
          Professional cybersecurity and AI security training designed for
          security professionals, technology teams and students, taught by the
          practitioners who run the engagements.
        </motion.p>

        <motion.div
          variants={reduced ? undefined : cineIn}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="/contact">Register your interest</MagneticButton>
          <MagneticButton href="#programmes" variant="ghost" strength={0.18}>
            See the programmes
          </MagneticButton>
        </motion.div>

        <motion.ul
          variants={reduced ? undefined : stagger(0.08, 0.6)}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "show"}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3"
        >
          {AUDIENCES.map((a) => (
            <motion.li
              key={a.title}
              variants={reduced ? undefined : cineIn}
              className="bg-surface/80 px-6 py-7"
            >
              <p className="mono text-[10px] tracking-[0.18em] text-signal">
                {a.title.toUpperCase()}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                {a.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                {a.items.map((i) => (
                  <li key={i} className="text-[12px] text-muted-dim">
                    {i}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}

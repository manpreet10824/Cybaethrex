"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { DUR, EASE_OUT, VIEWPORT } from "@/lib/motion";
import { UNIVERSITY } from "@/lib/content.training";

/**
 * A different audience needs a different motion language: softer entrances,
 * warmer surfaces, no adversarial diagrams. Same tokens throughout.
 */
export function Universities() {
  const { reduced } = useMotionFlags();

  return (
    <section
      id="universities"
      className="relative w-full scroll-mt-24 border-y border-line bg-[linear-gradient(to_bottom,var(--bg),rgb(var(--rgb-surface-2)/0.6),var(--bg))] px-6 py-24 sm:px-10 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <SectionHeading
            index="08"
            eyebrow="For universities"
            title="Close the gap before graduation."
            lede={UNIVERSITY.lede}
          />

          <Reveal className="flex flex-col items-start gap-5 lg:items-end">
            <p className="max-w-md text-[14px] leading-relaxed text-muted lg:text-right">
              Partnerships usually start with a short review of where your
              current syllabus and industry practice have drifted apart, and
              what would take the least effort to fix.
            </p>
            <MagneticButton href="/contact" variant="ghost" strength={0.2}>
              Talk about a partnership
            </MagneticButton>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSITY.offers.map((o, i) => (
            <motion.article
              key={o.title}
              initial={
                reduced ? false : { opacity: 0, y: 24, scale: 0.99 }
              }
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={VIEWPORT}
              transition={{
                duration: DUR.cinematic,
                ease: EASE_OUT,
                delay: (i % 3) * 0.07,
              }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-7 transition-colors duration-300 hover:border-signal/40"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden
              />
              <p className="mono text-[10px] tracking-[0.18em] text-muted-dim">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-[17px] font-medium tracking-tight transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                {o.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                {o.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

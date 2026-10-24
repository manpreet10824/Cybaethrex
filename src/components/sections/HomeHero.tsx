"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HeroDashboard } from "./HeroDashboard";
import { Container } from "@/components/ui/Layout";
import { AnimatedText } from "@/components/ui/animated-text";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { cineIn, stagger } from "@/lib/motion";
import { TOTAL_SERVICES } from "@/lib/services";

/**
 * Product-style hero: everything centred under a top glow, the headline at
 * display scale with the brand gradient on its final phrase, two actions, and
 * the illustrative engagement dashboard beneath.
 */
export function HomeHero() {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, parallax } = useMotionFlags();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate w-full overflow-hidden pb-10 pt-32 lg:pb-16 lg:pt-40"
    >
      <div
        className="field-grid absolute inset-0 -z-30 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(to_bottom,transparent,var(--bg))]"
        aria-hidden
      />

      <Container wide>
        <motion.div
          className="relative mx-auto flex max-w-[1000px] flex-col items-center text-center"
          style={parallax ? { y: copyY, opacity: copyOpacity } : undefined}
        >
          <motion.div
            variants={reduced ? undefined : stagger(0.12, 0.1)}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "show"}
            className="flex flex-col items-center"
          >
            <motion.p
              variants={reduced ? undefined : cineIn}
              className="pill"
            >
              <span className="pill-dot" aria-hidden />
              AI security is the lead practice · EU AI Act ready
            </motion.p>

            <motion.h1
              variants={reduced ? undefined : cineIn}
              className="mt-7 text-balance text-[clamp(2.5rem,7.2vw,5.25rem)] leading-[0.98] tracking-[-0.045em]"
            >
              <AnimatedText
                bare
                text="Where technology, security and trust"
                minWeight={380}
                maxWeight={760}
                animationDuration={2.4}
                delayMultiplier={0.04}
              />{" "}
              <span className="text-grad">come together.</span>
            </motion.h1>

            <motion.p
              variants={reduced ? undefined : cineIn}
              className="mt-7 max-w-[640px] text-[16px] leading-relaxed text-muted sm:text-[18px]"
            >
              We help organizations design, secure, engineer and transform
              technology across applications, AI, infrastructure, compliance
              and digital platforms.
            </motion.p>

            <motion.div
              variants={reduced ? undefined : cineIn}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/contact"
                className="btn-glow inline-flex items-center gap-2 rounded-xl bg-signal px-6 py-3.5 text-[14px] font-semibold text-[var(--on-signal)] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--signal-hover)] active:scale-[0.97]"
              >
                Talk to a security expert
              </Link>
              <Link
                href="/services"
                className="glass group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-semibold text-ink transition-colors duration-200 hover:border-signal hover:text-signal"
              >
                See the {TOTAL_SERVICES} services
                <ArrowRight
                  size={15}
                  strokeWidth={2.2}
                  className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.div>

            <motion.p
              variants={reduced ? undefined : cineIn}
              className="mt-5 text-[13px] text-muted-dim"
            >
              Looking for training?{" "}
              <Link
                href="/training"
                className="link-underline text-muted transition-colors duration-200 hover:text-signal"
              >
                Explore Cybaethrex Training
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroDashboard />
        </motion.div>
      </Container>
    </section>
  );
}

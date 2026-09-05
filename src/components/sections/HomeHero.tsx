"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HeroWave } from "./HeroWave";
import { Container } from "@/components/ui/Layout";
import { AnimatedText } from "@/components/ui/animated-text";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { cineIn, stagger } from "@/lib/motion";

const LINES = ["Where technology,", "security and trust", "come together."];

/**
 * Two columns, like the reference: the headline takes the frame at display
 * scale and the supporting column sits under it on the right. The previous
 * layout kept a 168px spine gutter and capped the headline at 4.1rem, which is
 * where most of the dead space came from.
 */
export function HomeHero() {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, parallax } = useMotionFlags();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "13%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[88svh] w-full flex-col justify-center overflow-hidden pb-14 pt-28 lg:min-h-[92svh] lg:pb-16"
    >
      <div className="field-grid absolute inset-0 -z-30 opacity-60" aria-hidden />
      <div
        className="absolute inset-0 -z-30 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(var(--rgb-signal)/0.07),transparent_58%)]"
        aria-hidden
      />

      <motion.div
        className="absolute inset-0 -z-20"
        style={parallax ? { y: fieldY } : undefined}
      >
        <HeroWave />
      </motion.div>

      {/* keeps the field off the type without dimming the whole frame */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,var(--bg)_1%,rgb(var(--rgb-bg)/0.72)_22%,transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(to_bottom,transparent,rgb(var(--rgb-bg)/0.6)_60%,var(--bg))]"
        aria-hidden
      />

      <motion.div
        className="relative"
        style={parallax ? { y: contentY, opacity: contentOpacity } : undefined}
      >
        <Container>
          <motion.div
            variants={reduced ? undefined : stagger(0.13, 0.12)}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "show"}
            className="grid items-end gap-10 lg:grid-cols-[1.45fr_0.85fr] lg:gap-14"
          >
            <h1 className="text-[clamp(2.35rem,7vw,5.5rem)] leading-[1.0] tracking-[-0.04em]">
              {LINES.map((line, i) => (
                <motion.span
                  key={line}
                  variants={reduced ? undefined : cineIn}
                  className="block"
                  style={i === 2 ? { color: "var(--signal)" } : undefined}
                >
                  <AnimatedText
                    bare
                    text={line}
                    minWeight={340}
                    maxWeight={760}
                    animationDuration={2.6}
                    delayMultiplier={0.055}
                  />
                </motion.span>
              ))}
            </h1>

            <div className="lg:pb-3">
              <motion.span
                variants={reduced ? undefined : cineIn}
                className="mb-6 block h-[3px] w-11 bg-signal"
                aria-hidden
              />
              <motion.p
                variants={reduced ? undefined : cineIn}
                className="mono text-[11px] tracking-[0.22em] text-signal"
              >
                TECHNOLOGY · SECURITY · ADVISORY
              </motion.p>
              <motion.p
                variants={reduced ? undefined : cineIn}
                className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted"
              >
                We help organizations design, secure, engineer and transform
                technology across applications, AI, infrastructure, compliance
                and digital platforms.
              </motion.p>

              <motion.div
                variants={reduced ? undefined : cineIn}
                className="mt-7 flex flex-col gap-3"
              >
                <Link
                  href="/services"
                  className="group inline-flex w-fit items-center gap-3 text-[15px] font-medium text-ink transition-colors duration-200 hover:text-signal"
                >
                  See what we do
                  <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-signal text-[var(--on-signal)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
                  </span>
                </Link>
                <Link
                  href="/training"
                  className="link-underline w-fit text-[13.5px] text-muted transition-colors duration-200 hover:text-signal"
                >
                  Looking for training? Explore Cybaethrex Training
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}

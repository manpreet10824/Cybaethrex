"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { DUR, EASE_OUT, SPRING_MAGNET } from "@/lib/motion";
import { useMotionFlags } from "@/components/motion/MotionProfile";

type Props = {
  href: string;
  children: React.ReactNode;
  /** subtle security pulse travelling the border */
  pulse?: boolean;
  variant?: "solid" | "ghost";
  className?: string;
  strength?: number;
};

/**
 * CTA with a magnetic pull toward the cursor and an optional pulse that runs
 * the border. Both are cursor effects, off on touch and reduced motion.
 */
export function MagneticButton({
  href,
  children,
  pulse = false,
  variant = "solid",
  className = "",
  strength = 0.32,
}: Props) {
  const box = useRef<HTMLAnchorElement | null>(null);
  const { cursor, reduced } = useMotionFlags();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING_MAGNET);
  const y = useSpring(my, SPRING_MAGNET);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!cursor || !box.current) return;
    const r = box.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength * 0.7);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const solid = variant === "solid";

  return (
    <motion.span
      className="relative inline-flex"
      style={cursor ? { x, y } : undefined}
    >
      <Link
        ref={box}
        href={href}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onBlur={reset}
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[13px] font-medium tracking-wide transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${
          solid
            ? "bg-signal text-[var(--on-signal)] hover:bg-[var(--signal-hover)]"
            : "border border-line-strong text-ink hover:border-signal hover:text-signal"
        } ${className}`}
      >
        <motion.span
          className="relative z-10"
          whileHover={reduced ? undefined : { x: 0 }}
        >
          {children}
        </motion.span>
        <ArrowRight
          size={14}
          strokeWidth={1.6}
          className="relative z-10 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
          aria-hidden
        />

        {/* hover sheen, transform only */}
        {!reduced ? (
          <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full">
            <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:[animation:sheen_700ms_cubic-bezier(0.16,1,0.3,1)]" />
          </span>
        ) : null}
      </Link>

      {pulse && !reduced ? (
        <svg
          className="pointer-events-none absolute -inset-px z-20 h-[calc(100%+2px)] w-[calc(100%+2px)]"
          aria-hidden
        >
          <motion.rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="999"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1"
            strokeDasharray="34 320"
            initial={{ strokeDashoffset: 0, opacity: 0.75 }}
            animate={{ strokeDashoffset: -354 }}
            transition={{
              duration: 3.2,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </svg>
      ) : null}
    </motion.span>
  );
}

/** Small text link with an animated underline. */
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="link-underline mono text-[12px] tracking-[0.12em] text-muted transition-colors duration-200 hover:text-signal"
      style={{ transitionTimingFunction: `cubic-bezier(${EASE_OUT.join(",")})`, transitionDuration: `${DUR.fast}s` }}
    >
      {children}
    </Link>
  );
}

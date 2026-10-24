"use client";

import { motion, type Variants } from "motion/react";
import { fadeUp, stagger, VIEWPORT } from "@/lib/motion";
import { useMotionFlags } from "@/components/motion/MotionProfile";

type Props = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "li" | "ol" | "ul" | "section" | "header" | "span";
};

/** Single in-view reveal. Collapses to an instant show under reduced motion. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
}: Props) {
  const { reduced, ready } = useMotionFlags();
  const Tag = motion[as];

  if (ready && reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

/** Parent that staggers its <Reveal> children. */
export function RevealGroup({
  children,
  className,
  each = 0.08,
  delay = 0,
  as = "div",
}: Omit<Props, "variants"> & { each?: number }) {
  const { reduced, ready } = useMotionFlags();
  const Tag = motion[as];

  if (ready && reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      variants={stagger(each, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

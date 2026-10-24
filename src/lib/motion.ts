import type { Transition, Variants } from "motion/react";

/**
 * One motion system for the whole site. Durations and easings are picked from
 * these bands only, no ad-hoc numbers in components.
 */
export const DUR = {
  fast: 0.22,
  normal: 0.42,
  cinematic: 0.85,
  ambient: 6,
} as const;

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SOFT: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 26,
  mass: 0.9,
};

export const SPRING_MAGNET: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 0.6,
};

export const SCROLL_SPRING = {
  stiffness: 120,
  damping: 30,
  restDelta: 0.001,
} as const;

/** Cinematic reveal used by headlines and hero copy. */
export const cineIn: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.cinematic, ease: EASE_OUT },
  },
};

/** Standard section reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.normal, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.normal, ease: EASE_OUT } },
};

export const stagger = (each = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/** Viewport defaults: fire once, slightly before the element is centred. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/** Collapse any variant set to a plain cross-fade for reduced motion. */
export const reduceVariants = (v: Variants): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.001 } },
  ...(v.exit ? { exit: { opacity: 0 } } : {}),
});

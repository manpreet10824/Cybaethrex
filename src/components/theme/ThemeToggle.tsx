"use client";

import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Dark is the brand default; light is a full second palette. The switch is a
 * micro-interaction like every other control: no page flash, no reload.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle, ready } = useTheme();
  const { reduced } = useMotionFlags();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-muted transition-colors duration-200 hover:border-signal hover:text-signal ${className}`}
    >
      <span className="sr-only">
        {dark ? "Switch to light theme" : "Switch to dark theme"}
      </span>

      <motion.span
        className="flex items-center justify-center"
        initial={false}
        animate={
          reduced || !ready ? undefined : { rotate: dark ? 0 : 180, scale: 1 }
        }
        transition={{ duration: DUR.normal, ease: EASE_OUT }}
        aria-hidden
      >
        {dark ? (
          <Moon size={15} strokeWidth={1.5} />
        ) : (
          <Sun size={15} strokeWidth={1.5} />
        )}
      </motion.span>
    </button>
  );
}

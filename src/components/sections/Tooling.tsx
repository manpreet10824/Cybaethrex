"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { DUR, EASE_OUT } from "@/lib/motion";
import { TOOLING } from "@/lib/content.training";

/** Two rings of six, offset 30deg, so nothing ever sits on top of anything. */
const RING_ANGLES = [
  [-60, 0, 60, 120, 180, 240],
  [-90, -30, 30, 90, 150, 210],
];
const RADIUS = [26, 45];

export function Tooling() {
  const { ambient, lite } = useMotionFlags();
  const [hover, setHover] = useState<string | null>(null);
  const orbiting = ambient && !lite;

  const seen = [0, 0];
  const placed = TOOLING.map((t) => ({
    ...t,
    angle: RING_ANGLES[t.ring][seen[t.ring]++ % 6],
  }));

  return (
    <section
      id="labs"
      className="relative w-full scroll-mt-24 px-6 py-24 sm:px-10 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <SectionHeading
          index="07"
          eyebrow="Labs & tooling"
          title="The tools you will actually be handed."
          lede="Not a logo wall. This is the working set across the programmes: offensive, cloud and the AI-specific tooling almost nobody teaches yet."
          align="center"
        />

        {orbiting ? (
          <Reveal className="relative mx-auto mt-14 aspect-square w-full max-w-[680px]">
            {RADIUS.map((r) => (
              <span
                key={r}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
                style={{ width: `${r * 2}%`, height: `${r * 2}%` }}
                aria-hidden
              />
            ))}

            <div className="absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-signal/40 bg-[rgb(var(--rgb-surface)/0.9)] text-center">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--rgb-signal) / 0.12), transparent 70%)",
                }}
                aria-hidden
              />
              <span className="mono relative text-[10px] tracking-[0.2em] text-signal">
                CYBAETHREX
              </span>
              <span className="mono relative mt-1 text-[10px] tracking-[0.2em] text-muted">
                LAB ENVIRONMENT
              </span>
            </div>

            {placed.map((t, i) => {
              const r = RADIUS[t.ring];
              const rad = (t.angle * Math.PI) / 180;
              const left = 50 + r * Math.cos(rad);
              const top = 50 + r * Math.sin(rad);
              const active = hover === t.name;

              return (
                <div
                  key={t.name}
                  className="orbit-float absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    ["--float-dur" as string]: `${8 + (i % 5) * 1.6}s`,
                    ["--float-delay" as string]: `${i * 0.4}s`,
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setHover(t.name)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(t.name)}
                    onBlur={() => setHover(null)}
                    className="relative whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-200"
                    style={{
                      borderColor: active
                        ? "rgb(var(--rgb-signal) / 0.55)"
                        : "var(--line)",
                      background: active
                        ? "rgb(var(--rgb-signal) / 0.10)"
                        : "rgb(var(--rgb-surface) / 0.8)",
                      color: active ? "var(--signal)" : "var(--muted)",
                    }}
                  >
                    {t.name}
                    <AnimatePresence>
                      {active ? (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: DUR.fast, ease: EASE_OUT }}
                          className="absolute left-1/2 top-[calc(100%+8px)] z-10 -translate-x-1/2 whitespace-nowrap rounded border border-line bg-[rgb(var(--rgb-panel)/0.96)] px-2.5 py-1.5 text-[11px] text-muted"
                        >
                          {t.note}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </button>
                </div>
              );
            })}
          </Reveal>
        ) : (
          <Reveal className="mt-12">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center justify-center rounded-full border border-signal/40 bg-surface px-6 py-4 text-center">
                <span className="mono text-[10px] tracking-[0.2em] text-signal">
                  CYBAETHREX
                </span>
                <span className="mono mt-1 text-[10px] tracking-[0.2em] text-muted">
                  LAB ENVIRONMENT
                </span>
              </div>
              <ul className="flex flex-wrap justify-center gap-2.5">
                {TOOLING.map((t) => (
                  <li
                    key={t.name}
                    className="rounded-full border border-line bg-surface/70 px-3.5 py-1.5"
                  >
                    <span className="text-[12px] text-muted">{t.name}</span>
                    <span className="ml-2 text-[11px] text-muted-dim">
                      {t.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

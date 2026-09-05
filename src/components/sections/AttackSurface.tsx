"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { EASE_OUT, SCROLL_SPRING } from "@/lib/motion";

const CX = 380;
const CY = 240;

/** Assembly order: WEB -> API -> CLOUD -> IDENTITY -> AI -> DATA */
const DOMAINS = [
  { id: "web", label: "WEB", x: 140, y: 108, note: "Public application layer" },
  { id: "api", label: "API", x: 380, y: 66, note: "Machine-to-machine surface" },
  { id: "cloud", label: "CLOUD", x: 620, y: 108, note: "Accounts, roles, workloads" },
  { id: "identity", label: "IDENTITY", x: 140, y: 372, note: "Humans, tokens, sessions" },
  { id: "ai", label: "AI", x: 620, y: 372, note: "Models, agents, tools" },
  { id: "data", label: "DATA", x: 380, y: 414, note: "What an attacker is after" },
];

/** Window in scroll progress where element `i` builds. */
const win = (i: number, offset = 0, len = 0.14): [number, number] => {
  const start = 0.14 + i * 0.115 + offset;
  return [start, start + len];
};

function Spoke({
  p,
  i,
  x,
  y,
  reduced,
}: {
  p: MotionValue<number>;
  i: number;
  x: number;
  y: number;
  reduced: boolean;
}) {
  const [a, b] = win(i, 0.04);
  const length = useTransform(p, [a, b], [0, 1]);
  const opacity = useTransform(p, [a, a + 0.02], [0, 1]);

  return (
    <motion.line
      x1={CX}
      y1={CY}
      x2={x}
      y2={y}
      stroke="var(--signal)"
      strokeWidth={1}
      strokeOpacity={0.34}
      style={
        reduced ? { opacity: 1 } : { pathLength: length, opacity }
      }
    />
  );
}

function Ring({
  p,
  i,
  from,
  to,
  reduced,
}: {
  p: MotionValue<number>;
  i: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  reduced: boolean;
}) {
  const [a, b] = win(i, 0.2, 0.16);
  const length = useTransform(p, [a, b], [0, 1]);

  return (
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgb(var(--rgb-hair) / 0.5)"
      strokeWidth={1}
      strokeOpacity={0.25}
      strokeDasharray="3 6"
      style={reduced ? undefined : { pathLength: length }}
    />
  );
}

function DomainNode({
  p,
  i,
  d,
  reduced,
  ambient,
}: {
  p: MotionValue<number>;
  i: number;
  d: (typeof DOMAINS)[number];
  reduced: boolean;
  ambient: boolean;
}) {
  const [a, b] = win(i);
  const scale = useTransform(p, [a, b], [0, 1]);
  const opacity = useTransform(p, [a, a + 0.03], [0, 1]);
  const labelOpacity = useTransform(p, [b, b + 0.06], [0, 1]);
  const labelY = useTransform(p, [b, b + 0.06], [6, 0]);

  return (
    <g>
      <motion.g style={reduced ? undefined : { scale, opacity, originX: `${d.x}px`, originY: `${d.y}px` }}>
        <circle
          cx={d.x}
          cy={d.y}
          r={17}
          fill="rgb(var(--rgb-signal) / 0.05)"
          stroke="var(--signal)"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        <circle cx={d.x} cy={d.y} r={3.4} fill="var(--signal)" />
        {ambient ? (
          <motion.circle
            cx={d.x}
            cy={d.y}
            r={17}
            fill="none"
            stroke="var(--signal)"
            strokeWidth={1}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2.1], opacity: [0.4, 0] }}
            transition={{
              duration: 3.2,
              ease: EASE_OUT,
              repeat: Infinity,
              repeatDelay: 2 + i * 0.5,
              delay: i * 0.35,
            }}
            style={{ originX: `${d.x}px`, originY: `${d.y}px` }}
          />
        ) : null}
      </motion.g>

      <motion.text
        x={d.x}
        y={d.y + 38}
        textAnchor="middle"
        className="mono"
        fontSize={11}
        letterSpacing="0.16em"
        fill="var(--ink)"
        style={reduced ? undefined : { opacity: labelOpacity, y: labelY }}
      >
        {d.label}
      </motion.text>
      <motion.text
        x={d.x}
        y={d.y + 54}
        textAnchor="middle"
        fontSize={9.5}
        fill="var(--muted-dim)"
        style={reduced ? undefined : { opacity: labelOpacity, y: labelY }}
      >
        {d.note}
      </motion.text>
    </g>
  );
}

export function AttackSurface({ index = "02" }: { index?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, ambient, lite } = useMotionFlags();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.55"],
  });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  const coreScale = useTransform(p, [0.02, 0.16], [0.6, 1]);
  const coreOpacity = useTransform(p, [0.02, 0.14], [0, 1]);
  const countRaw = useTransform(p, [0.14, 0.86], [0, 6]);
  const count = useTransform(countRaw, (v) =>
    String(Math.min(6, Math.max(0, Math.round(v)))).padStart(2, "0"),
  );

  return (
    <section
      ref={ref}
      id="attack-surface"
      className="relative w-full scroll-mt-24 px-6 py-24 sm:px-10 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            index={index}
            eyebrow="What we assess"
            title={
              <>
                Nothing you defend stands{" "}
                <span className="text-signal">alone</span>.
              </>
            }
            lede="Every engagement starts the same way: assembling the real picture. Web, API, cloud, identity, AI and the data behind them, assessed as one surface, because that is how they are attacked."
          />

          <Reveal className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <motion.span className="mono text-4xl text-signal tabular-nums">
                {reduced ? "06" : count}
              </motion.span>
              <span className="text-[13px] text-muted">
                domains mapped in a standard assessment
              </span>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-muted-dim">
              We map the surface before testing any part of it. Scope built on
              assumption is the most common reason an assessment misses the
              thing that matters.
            </p>
          </Reveal>
        </div>

        <Reveal className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(var(--rgb-signal)/0.06),transparent_70%)]"
            aria-hidden
          />
          <svg
            viewBox="0 0 760 480"
            className="h-auto w-full"
            role="img"
            aria-label="Attack surface map: web, API, cloud, identity, AI and data connected to a central surface"
          >
            {/* perimeter ring between domains */}
            {!lite
              ? DOMAINS.map((d, i) => (
                  <Ring
                    key={`ring-${d.id}`}
                    p={p}
                    i={i}
                    from={d}
                    to={DOMAINS[(i + 1) % DOMAINS.length]}
                    reduced={reduced}
                  />
                ))
              : null}

            {DOMAINS.map((d, i) => (
              <Spoke
                key={`spoke-${d.id}`}
                p={p}
                i={i}
                x={d.x}
                y={d.y}
                reduced={reduced}
              />
            ))}

            {/* core */}
            <motion.g
              style={
                reduced
                  ? undefined
                  : {
                      scale: coreScale,
                      opacity: coreOpacity,
                      originX: `${CX}px`,
                      originY: `${CY}px`,
                    }
              }
            >
              <circle
                cx={CX}
                cy={CY}
                r={54}
                fill="rgb(var(--rgb-signal) / 0.04)"
                stroke="var(--signal)"
                strokeOpacity={0.28}
              />
              <circle
                cx={CX}
                cy={CY}
                r={36}
                fill="rgb(var(--rgb-panel) / 0.9)"
                stroke="var(--signal)"
                strokeOpacity={0.5}
              />
              <text
                x={CX}
                y={CY - 3}
                textAnchor="middle"
                className="mono"
                fontSize={9}
                letterSpacing="0.14em"
                fill="var(--signal)"
              >
                ATTACK
              </text>
              <text
                x={CX}
                y={CY + 9}
                textAnchor="middle"
                className="mono"
                fontSize={9}
                letterSpacing="0.14em"
                fill="var(--signal)"
              >
                SURFACE
              </text>
            </motion.g>

            {DOMAINS.map((d, i) => (
              <DomainNode
                key={d.id}
                p={p}
                i={i}
                d={d}
                reduced={reduced}
                ambient={ambient && !lite}
              />
            ))}
          </svg>
        </Reveal>
      </div>
    </section>
  );
}

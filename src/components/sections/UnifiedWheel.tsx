"use client";

import { useRef } from "react";
import { Container, Heading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { gsap, useGSAP } from "@/lib/gsap";
import { WHEEL } from "@/lib/site";

/**
 * The capability wheel: five practices in the inner ring, the services beneath
 * them in the outer ring, and the three commitments that hold across all of it
 * on the arcs outside.
 *
 * Built as one SVG rather than a picture so every label is real text: legible
 * to a screen reader, searchable, and crisp at any size.
 */
const CX = 440;
const CY = 440;
const R_HUB = 86;
const R_IN0 = 96;
const R_IN1 = 176;
const R_OUT0 = 180;
const R_OUT1 = 262;
const ARC_R = [298, 344, 390];

const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

/** Annulus sector between two radii and two angles. */
function sector(r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`;
}

/**
 * Arc for a text baseline. Below the horizon the arc is reversed so the label
 * never renders upside down.
 */
function textArc(r: number, a0: number, a1: number) {
  const mid = (a0 + a1) / 2;
  const flip = mid > 90 && mid < 270;
  const [s, e] = flip ? [a1, a0] : [a0, a1];
  const [x0, y0] = polar(r, s);
  const [x1, y1] = polar(r, e);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} ${flip ? 0 : 1} ${x1} ${y1}`;
}

/** Practice hue: walks the logo gradient around the wheel. */
const hue = (t: number) =>
  `color-mix(in srgb, var(--brand-orange), var(--brand-red) ${Math.round(t * 100)}%)`;
/** Outer ring is the same hue, darkened, so white labels always hold. */
const hueDeep = (t: number) => `color-mix(in srgb, ${hue(t)}, #17110c 26%)`;

const SPAN = 360 / WHEEL.length;

const CLAIMS = [
  "Senior practitioners, no junior bench",
  "AI security as the lead practice",
  "Every engagement ends in evidence",
];

const CLAIMS_SHORT = [
  "One method",
  "One standard of evidence",
  "One person accountable",
];

/**
 * `compact` is the phone rendering. It crops the viewBox to the rings and drops
 * the commitment arcs, which occupy roughly 45% of the radius. Removing them
 * makes everything that carries information about 1.6x larger at the same
 * rendered width, which is the difference between 5px labels and legible ones.
 */
function Wheel({ compact }: { compact: boolean }) {
  const p = compact ? "m" : "d";
  const pad = 12;
  const viewBox = compact
    ? `${CX - R_OUT1 - pad} ${CY - R_OUT1 - pad} ${(R_OUT1 + pad) * 2} ${(R_OUT1 + pad) * 2}`
    : "0 0 880 880";

  const fPractice = compact ? 17 : 13;
  const fService = compact ? 14.5 : 12;
  const fHub = compact ? 27 : 20;
  const fHubSub = compact ? 11.5 : 9;

  return (
    <svg
      viewBox={viewBox}
      className="h-auto w-full"
      role="img"
      aria-label="Cybaethrex capability wheel: five practices, AI security, offensive security, security engineering, governance and advisory, each with its core services"
    >
      <defs>
        {WHEEL.map((prac, i) =>
          prac.services.map((_, k) => {
            const span = SPAN / prac.services.length;
            const a0 = i * SPAN + k * span;
            return (
              <path
                key={`sp-${i}-${k}`}
                id={`${p}-arc-s-${i}-${k}`}
                d={textArc((R_OUT0 + R_OUT1) / 2, a0 + 1.5, a0 + span - 1.5)}
                fill="none"
              />
            );
          }),
        )}
        {WHEEL.map((_, i) => (
          <path
            key={`pp-${i}`}
            id={`${p}-arc-p-${i}`}
            d={textArc((R_IN0 + R_IN1) / 2, i * SPAN + 2, (i + 1) * SPAN - 2)}
            fill="none"
          />
        ))}
        {!compact &&
          ARC_R.map((r, i) => (
            <path
              key={`ca-${i}`}
              id={`${p}-arc-c-${i}`}
              d={textArc(r, -78, 78)}
              fill="none"
            />
          ))}
      </defs>

      {!compact &&
        ARC_R.map((r, i) => (
          <g key={`claim-${i}`} data-claim>
            <path
              d={textArc(r, -108, 108)}
              fill="none"
              stroke="rgb(var(--rgb-signal) / 0.3)"
              strokeWidth={1}
            />
            <text className="display" fontSize={18} fill="var(--ink)" dy={-9}>
              <textPath
                href={`#${p}-arc-c-${i}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {CLAIMS[i]}
              </textPath>
            </text>
          </g>
        ))}

      {/* outer ring: services */}
      {WHEEL.map((prac, i) =>
        prac.services.map((sv, k) => {
          const span = SPAN / prac.services.length;
          const a0 = i * SPAN + k * span;
          const t = (i + k / prac.services.length) / WHEEL.length;
          return (
            <g key={`s-${i}-${k}`} data-service>
              <path
                d={sector(R_OUT0, R_OUT1, a0 + 0.7, a0 + span - 0.7)}
                fill={hueDeep(t)}
              />
              <text fontSize={fService} fontWeight={500} fill="#ffffff" dy={4}>
                <textPath
                  href={`#${p}-arc-s-${i}-${k}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {compact ? sv.short : sv.full}
                </textPath>
              </text>
            </g>
          );
        }),
      )}

      {/* inner ring: practices */}
      {WHEEL.map((prac, i) => {
        const t = i / (WHEEL.length - 1);
        return (
          <g key={`p-${i}`} data-practice>
            <path
              d={sector(R_IN0, R_IN1, i * SPAN + 0.8, (i + 1) * SPAN - 0.8)}
              fill={hue(t)}
            />
            <text
              className="mono"
              fontSize={fPractice}
              fontWeight={600}
              letterSpacing="0.06em"
              fill="#ffffff"
              dy={4}
            >
              <textPath
                href={`#${p}-arc-p-${i}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {prac.name}
              </textPath>
            </text>
          </g>
        );
      })}

      {/* hub */}
      <g data-hub>
        <circle
          data-spin
          cx={CX}
          cy={CY}
          r={R_HUB - 4}
          fill="none"
          stroke="rgb(var(--rgb-signal) / 0.45)"
          strokeWidth={1}
          strokeDasharray="3 7"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R_HUB - 14}
          fill="var(--bg-deep)"
          stroke="rgb(var(--rgb-signal) / 0.3)"
        />
        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          className="display"
          fontSize={fHub}
          fill="var(--ink)"
        >
          Cybaethrex
        </text>
        <text
          x={CX}
          y={CY + (compact ? 20 : 16)}
          textAnchor="middle"
          className="mono"
          fontSize={fHubSub}
          letterSpacing="0.18em"
          fill="var(--signal)"
        >
          SECURITY PRACTICE
        </text>
      </g>
    </svg>
  );
}

export function UnifiedWheel() {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, lite } = useMotionFlags();

  useGSAP(
    () => {
      if (reduced) return;

      const trigger = { trigger: ref.current, start: "top 85%", once: true };

      // On phones the wheel is small and scrolls past quickly, so a 15-step
      // stagger only risks being seen half-built. One fade, then done.
      if (lite) {
        gsap.from("#capability svg", {
          opacity: 0,
          scale: 0.94,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: trigger,
        });
        return;
      }

      // Desktop assembles outward: hub, practices, services, then commitments.
      gsap.from("[data-hub]", {
        scale: 0.7,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        transformOrigin: `${CX}px ${CY}px`,
        scrollTrigger: trigger,
      });
      gsap.from("[data-practice]", {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.045,
        ease: "power3.out",
        transformOrigin: `${CX}px ${CY}px`,
        scrollTrigger: trigger,
        delay: 0.1,
      });
      gsap.from("[data-service]", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.012,
        ease: "power2.out",
        scrollTrigger: trigger,
        delay: 0.3,
      });
      gsap.from("[data-claim]", {
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: trigger,
        delay: 0.45,
      });

      if (!lite) {
        gsap.to("[data-spin]", {
          rotation: 360,
          duration: 160,
          repeat: -1,
          ease: "none",
          transformOrigin: `${CX}px ${CY}px`,
        });
      }
    },
    { scope: ref, dependencies: [reduced, lite] },
  );

  return (
    <section
      ref={ref}
      id="capability"
      className="relative w-full scroll-mt-28 overflow-hidden py-14 lg:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_50%_50%,rgb(var(--rgb-signal)/0.09),transparent_70%)]"
        aria-hidden
      />

      <Container>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="eyebrow">Capability</p>
          </Reveal>
          <Heading
            title="One security practice."
            size="xl"
            className="mt-5 [&>h2]:mx-auto"
          />
          <Reveal>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {CLAIMS_SHORT.map((c) => (
                <li key={c} className="text-[15px] text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* phones get the cropped wheel; the arcs move to text beneath it */}
        <Reveal className="mx-auto -mx-2 mt-8 w-[calc(100%+1rem)] sm:mx-auto sm:w-full md:hidden">
          <Wheel compact />
        </Reveal>

        <Reveal className="mx-auto mt-8 hidden w-full max-w-[720px] md:block">
          <Wheel compact={false} />
        </Reveal>

        <ul className="mt-8 flex flex-col items-center gap-2.5 md:hidden">
          {CLAIMS.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2.5 text-[13.5px] text-muted"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
              {c}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

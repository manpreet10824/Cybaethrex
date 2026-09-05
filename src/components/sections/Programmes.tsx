"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/Layout";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { gsap, useGSAP, SCRUB, SCRUB_SMOOTH } from "@/lib/gsap";
import { PROGRAMMES, type Programme } from "@/lib/content.training";

const W = 300;
const H = 130;

/** Each programme carries a schematic of the system it teaches you to attack. */
function Schematic({ p }: { p: Programme }) {
  const px = (n: [number, number]) => ({ x: n[0] * W, y: n[1] * H });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
      {p.links.map(([a, b], i) => {
        const p1 = px(p.nodes[a]);
        const p2 = px(p.nodes[b]);
        return (
          <line
            key={`l-${i}`}
            className="trk-line"
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="var(--signal)"
            strokeWidth={1}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        );
      })}
      {p.nodes.map((n, i) => {
        const c = px(n);
        return (
          <circle
            key={`n-${i}`}
            className="trk-dot"
            cx={c.x}
            cy={c.y}
            r={3.4}
            fill="var(--signal)"
            style={{ transitionDelay: `${i * 45}ms` }}
          />
        );
      })}
      <line
        className="trk-sweep"
        x1={0}
        y1={0}
        x2={0}
        y2={H}
        stroke="var(--signal)"
        strokeWidth={1}
        strokeOpacity={0.5}
      />
    </svg>
  );
}

function Card({
  p,
  i,
  staticActive,
}: {
  p: Programme;
  i: number;
  staticActive: boolean;
}) {
  return (
    <article
      data-track-card={i}
      data-active={staticActive ? "true" : "false"}
      className="track-card relative flex h-[min(520px,68vh)] w-[84vw] shrink-0 flex-col overflow-hidden rounded-xl border p-6 sm:w-[440px]"
    >
      <div
        className="trk-glow pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, rgb(var(--rgb-signal) / var(--card-glow-alpha)), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between">
        <span className="trk-n mono text-[11px] tracking-[0.2em]">
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="mono rounded-full border border-line px-2.5 py-1 text-[9px] tracking-[0.16em] text-muted-dim">
          {p.badge.toUpperCase()}
        </span>
      </div>

      <h3 className="relative mt-5 text-[22px] font-medium leading-tight tracking-tight">
        {p.name}
      </h3>

      <div className="relative mt-2 flex items-center gap-3">
        <span className="mono text-[10px] tracking-[0.14em] text-signal">
          {p.duration}
        </span>
        <span className="h-3 w-px bg-line-strong" />
        <span className="mono text-[10px] tracking-[0.14em] text-muted-dim">
          {p.level.toUpperCase()}
        </span>
      </div>

      <p className="relative mt-3 text-[13.5px] leading-relaxed text-muted">
        {p.summary}
      </p>

      <div className="relative my-3 flex max-h-[120px] flex-1 items-center">
        <Schematic p={p} />
      </div>

      <ul className="relative flex flex-col gap-1.5 border-t border-line pt-4">
        {p.modules.slice(0, 4).map((m) => (
          <li key={m} className="flex items-center gap-2.5">
            <span className="trk-bullet h-1 w-1 rounded-full bg-current" />
            <span className="text-[12.5px] text-muted">{m}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className="group relative mt-5 inline-flex items-center gap-2 text-[12.5px] text-muted transition-colors duration-200 hover:text-signal"
      >
        Enrol or ask a question
        <ArrowRight
          size={13}
          strokeWidth={1.6}
          className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
          aria-hidden
        />
      </Link>
    </article>
  );
}

export function Programmes() {
  const ref = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef<HTMLSpanElement | null>(null);
  const { reduced, lite, ready } = useMotionFlags();

  const horizontal = ready && !lite && !reduced;

  useGSAP(
    () => {
      if (!horizontal) return;
      const track = trackRef.current;
      const section = ref.current;
      if (!track || !section) return;

      const distance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 80);

      let current = -1;
      const setActive = (i: number) => {
        if (i === current) return;
        current = i;
        track
          .querySelectorAll<HTMLElement>("[data-track-card]")
          .forEach((el, k) =>
            el.setAttribute("data-active", k === i ? "true" : "false"),
          );
        if (indexRef.current) {
          indexRef.current.textContent = String(i + 1).padStart(2, "0");
        }
      };

      gsap.to(track, {
        x: () => -distance(),
        ease: SCRUB,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB_SMOOTH,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            setActive(
              Math.min(
                PROGRAMMES.length - 1,
                Math.max(0, Math.floor(self.progress * PROGRAMMES.length)),
              ),
            ),
        },
      });

      gsap.fromTo(
        ".prog-rail",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: SCRUB,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: SCRUB_SMOOTH,
          },
        },
      );

      setActive(0);
    },
    { scope: ref, dependencies: [horizontal] },
  );

  const header = (
    <SectionHeading
      index="03"
      eyebrow="Programmes"
      title="Five programmes. No filler modules."
      lede="Each one is built around lab hours rather than slide count, and capped so every session is taught by the same person who wrote it."
    />
  );

  if (!horizontal) {
    return (
      <section
        ref={ref}
        id="programmes"
        className="relative w-full scroll-mt-24 py-24"
      >
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
          {header}
        </div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 sm:px-10">
          {PROGRAMMES.map((p, i) => (
            <div key={p.id} className="snap-center">
              <Card p={p} i={i} staticActive />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="programmes"
      className="relative w-full scroll-mt-24"
      style={{ height: `${PROGRAMMES.length * 34 + 70}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
          {header}
        </div>

        <div ref={trackRef} className="mt-8 flex w-max gap-6 px-6 sm:px-10">
          {PROGRAMMES.map((p, i) => (
            <Card key={p.id} p={p} i={i} staticActive={false} />
          ))}
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[1240px] items-center gap-4 px-6 sm:px-10">
          <span
            ref={indexRef}
            className="mono text-[11px] tabular-nums text-signal"
          >
            01
          </span>
          <div className="relative h-px flex-1 bg-line">
            <span className="prog-rail absolute inset-y-0 left-0 block w-full origin-left bg-signal" />
          </div>
          <span className="mono text-[11px] tabular-nums text-muted-dim">
            {String(PROGRAMMES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

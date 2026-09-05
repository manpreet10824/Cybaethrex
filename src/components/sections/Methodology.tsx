"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/Layout";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { gsap, useGSAP, SCRUB_SMOOTH } from "@/lib/gsap";

type Stage = {
  n: string;
  title: string;
  lede: string;
  body: string;
  points: string[];
};

function Rail({ staticAll, STAGES }: { staticAll: boolean; STAGES: Stage[] }) {
  return (
    <div className="flex items-center gap-0" aria-hidden>
      {STAGES.map((s, i) => (
        <div key={s.n} className="flex flex-1 items-center last:flex-none">
          <span
            data-rail-dot={i}
            data-state={staticAll ? "done" : i === 0 ? "active" : "idle"}
            className="rail-dot relative block h-2.5 w-2.5 shrink-0 rounded-full border"
          />
          {i < STAGES.length - 1 ? (
            <span className="relative mx-2 h-px flex-1 bg-line">
              <span
                data-rail-fill={i}
                data-state={staticAll ? "done" : "idle"}
                className="rail-fill absolute inset-y-0 left-0 block w-full bg-signal"
              />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Panel({
  s,
  i,
  staticActive,
}: {
  s: Stage;
  i: number;
  staticActive: boolean;
}) {
  return (
    <div
      data-stage-panel={i}
      data-active={staticActive || i === 0 ? "true" : "false"}
      className="stage-panel relative flex min-w-0 flex-col overflow-hidden rounded-xl border p-6"
    >
      <div className="flex items-center gap-3">
        <span className="stage-n mono text-[11px] tracking-[0.2em]">{s.n}</span>
        <span className="stage-tick h-px" />
      </div>

      <h3 className="stage-title mt-5 font-medium tracking-tight">{s.title}</h3>
      <p className="mt-2 text-[12px] tracking-wide text-muted-dim">{s.lede}</p>

      <div className="stage-detail">
        <div>
          <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-muted">
            {s.body}
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {s.points.map((pt) => (
              <li
                key={pt}
                className="flex items-center gap-2.5 text-[12.5px] text-muted-dim"
              >
                <span className="h-px w-3 bg-signal" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1" />

      <span className="stage-status mono mt-6 text-[10px] tracking-[0.2em]">
        {`STAGE ${i + 1}`}
      </span>
    </div>
  );
}

/**
 * One pinned, continuous four-stage timeline. Used twice with different
 * content: the consulting engagement model on `/`, and the teaching method on
 * `/training`. The mechanic is identical; only the stages differ.
 */
export function Methodology({
  id,
  stages,
  index,
  eyebrow,
  title,
  lede,
}: {
  id: string;
  stages: Stage[];
  index: string;
  eyebrow: string;
  title: string;
  lede: string;
}) {
  const STAGES = stages;
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, lite, ready } = useMotionFlags();
  const scrollDriven = ready && !lite && !reduced;

  useGSAP(
    () => {
      if (!scrollDriven) return;
      const root = ref.current;
      if (!root) return;

      const panels = root.querySelectorAll<HTMLElement>("[data-stage-panel]");
      const dots = root.querySelectorAll<HTMLElement>("[data-rail-dot]");
      const fills = root.querySelectorAll<HTMLElement>("[data-rail-fill]");

      let current = -1;
      const setActive = (i: number) => {
        if (i === current) return;
        current = i;
        panels.forEach((el, k) =>
          el.setAttribute("data-active", k === i ? "true" : "false"),
        );
        dots.forEach((el, k) =>
          el.setAttribute(
            "data-state",
            k < i ? "done" : k === i ? "active" : "idle",
          ),
        );
        fills.forEach((el, k) =>
          el.setAttribute("data-state", k < i ? "done" : "idle"),
        );
      };

      // The timeline is the section: one continuous progression through four
      // stages rather than four independent cards.
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB_SMOOTH,
          onUpdate: (self) =>
            setActive(
              Math.min(
                STAGES.length - 1,
                Math.max(0, Math.floor(self.progress * STAGES.length)),
              ),
            ),
        },
      });

      setActive(0);
    },
    { scope: ref, dependencies: [scrollDriven] },
  );

  const header = (
    <SectionHeading
      index={index}
      eyebrow={eyebrow}
      title={title}
      lede={lede}
    />
  );

  if (!scrollDriven) {
    return (
      <section
        ref={ref}
        id={id}
        className="relative w-full scroll-mt-24 px-6 py-24 sm:px-10"
      >
        <div className="mx-auto w-full max-w-[1240px]">
          {header}
          <div className="mt-10">
            <Rail staticAll STAGES={STAGES} />
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {STAGES.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-line bg-surface/60 p-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="mono text-[11px] tracking-[0.2em] text-signal">
                    {s.n}
                  </span>
                  <h3 className="text-2xl font-medium tracking-tight">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-1 text-[12px] text-muted-dim">{s.lede}</p>
                <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                  {s.body}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {s.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2.5 text-[12.5px] text-muted-dim"
                    >
                      <span className="h-px w-3 bg-signal" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id={id}
      className="relative w-full scroll-mt-24"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-14">
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
          {header}

          <div className="mt-10">
            <Rail staticAll={false} STAGES={STAGES} />
          </div>

          <div className="mt-8 flex h-[min(420px,52vh)] gap-4">
            {STAGES.map((s, i) => (
              <Panel key={s.n} s={s} i={i} staticActive={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

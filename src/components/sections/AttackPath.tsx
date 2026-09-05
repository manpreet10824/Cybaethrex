"use client";

import { useRef } from "react";
import { Container, SectionHeading } from "@/components/ui/Layout";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { gsap, useGSAP, SCRUB, SCRUB_SMOOTH } from "@/lib/gsap";
import { ATTACK_PATH, IMPACT_DIMENSIONS } from "@/lib/site";

/**
 * The chain runs left to right across the full measure, and escalation is
 * carried by colour: every node is mixed from the brand gradient by its depth,
 * so the path literally darkens from entry orange to crown-jewel red.
 */
const VB_W = 1200;
const VB_H = 210;
const X0 = 62;
const X1 = 1138;
const Y = 108;

const NODES = ATTACK_PATH.map((s, i) => ({
  ...s,
  x: X0 + (i * (X1 - X0)) / (ATTACK_PATH.length - 1),
  /** 0 at entry, 1 at objective */
  t: i / (ATTACK_PATH.length - 1),
}));

const hot = (t: number) =>
  `color-mix(in srgb, var(--brand-orange), var(--brand-red) ${Math.round(t * 100)}%)`;

const MAX = 5;

function StackedPath() {
  return (
    <ol className="mt-12 flex flex-col">
      {ATTACK_PATH.map((s, i) => (
        <li key={s.n} className="relative flex gap-5 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
              style={{
                borderColor: hot(i / (ATTACK_PATH.length - 1)),
                background: "rgb(var(--rgb-threat) / 0.07)",
              }}
            >
              <span
                className="mono text-[10px]"
                style={{ color: hot(i / (ATTACK_PATH.length - 1)) }}
              >
                {s.n}
              </span>
            </span>
            {i < ATTACK_PATH.length - 1 ? (
              <span className="mt-1 w-px flex-1 bg-[rgb(var(--rgb-threat)/0.3)]" />
            ) : null}
          </div>
          <div className="pt-1.5">
            <p className="eyebrow">{s.stage}</p>
            <p className="mt-1 text-[15px] font-medium tracking-tight text-ink">
              {s.name}
            </p>
            <p className="mt-1 text-[13px] text-muted-dim">{s.detail}</p>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
              {s.meaning}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function AttackPath({ index = "05" }: { index?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLSpanElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const nameRef = useRef<HTMLParagraphElement | null>(null);
  const detailRef = useRef<HTMLParagraphElement | null>(null);
  const meaningRef = useRef<HTMLParagraphElement | null>(null);

  const { reduced, lite, ready } = useMotionFlags();
  const scrollDriven = ready && !lite && !reduced;

  useGSAP(
    () => {
      if (!scrollDriven) return;
      const root = ref.current;
      if (!root) return;

      gsap.set("[data-link]", { drawSVG: 0 });
      gsap.set(".ap-hot, .ap-pulse, .ap-flow", { opacity: 0 });
      gsap.set(".ap-ring", { scale: 0.55, transformOrigin: "center" });
      NODES.forEach((n, i) => {
        gsap.set(`[data-node="${i}"] .ap-ring, [data-node="${i}"] .ap-hot`, {
          svgOrigin: `${n.x} ${Y}`,
        });
      });
      gsap.set(".ap-verdict", { opacity: 0, y: 10 });

      const segs = root.querySelectorAll<HTMLElement>("[data-seg]");
      const setMeters = (s: (typeof ATTACK_PATH)[number]) =>
        segs.forEach((el) => {
          const dim = el.dataset.dim as "access" | "blast" | "cost";
          const idx = Number(el.dataset.seg);
          el.setAttribute("data-on", idx < s.impact[dim] ? "true" : "false");
        });

      // Panel content is written straight to the DOM: scrolling this section
      // never enters the React render path.
      let current = -1;
      const setActive = (i: number) => {
        if (i === current) return;
        current = i;
        const s = ATTACK_PATH[i];
        if (stageRef.current) stageRef.current.textContent = s.stage;
        if (numRef.current) numRef.current.textContent = s.n;
        if (nameRef.current) nameRef.current.textContent = s.name;
        if (detailRef.current) detailRef.current.textContent = s.detail;
        if (meaningRef.current) meaningRef.current.textContent = s.meaning;
        setMeters(s);
        root
          .querySelectorAll<HTMLElement>("[data-node]")
          .forEach((el, k) =>
            el.setAttribute("data-current", k === i ? "true" : "false"),
          );
      };

      const tl = gsap.timeline({
        defaults: { ease: SCRUB },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB_SMOOTH,
          onUpdate: (self) =>
            setActive(
              Math.min(
                NODES.length - 1,
                Math.max(0, Math.floor(self.progress * NODES.length)),
              ),
            ),
        },
      });

      tl.to({}, { duration: 0.4 });

      NODES.forEach((n, i) => {
        const at = `s-${i}`;
        tl.addLabel(at);

        if (i > 0) {
          tl.to(
            `[data-link="${i - 1}"]`,
            { drawSVG: "100%", duration: 1.1 },
            `${at}-=0.55`,
          ).to(
            `[data-flow="${i - 1}"]`,
            { opacity: 1, duration: 0.4 },
            `${at}-=0.1`,
          );
        }

        tl.to(`[data-node="${i}"] .ap-ring`, { scale: 1, duration: 0.7 }, at)
          .to(`[data-node="${i}"] .ap-hot`, { opacity: 1, duration: 0.5 }, at)
          .to(
            `[data-node="${i}"] .ap-label`,
            { opacity: 1, y: 0, duration: 0.6 },
            at,
          );

        if (i === NODES.length - 1) {
          tl.to(`[data-node="${i}"] .ap-pulse`, { opacity: 1, duration: 0.5 }, at);
        }

        tl.to({}, { duration: 0.3 });
      });

      tl.to(".ap-verdict", { opacity: 1, y: 0, duration: 0.8 }, ">-0.1");
      tl.to({}, { duration: 0.4 });

      setActive(0);
    },
    { scope: ref, dependencies: [scrollDriven] },
  );

  const header = (
    <SectionHeading
      index={index}
      eyebrow="How findings are delivered"
      accent="threat"
      title={
        <>
          A finding is a fact. A <span className="text-threat">path</span> is a
          business risk.
        </>
      }
      lede="We do not hand over a list of issues. We show the chain, how one weak assumption becomes access to the thing you actually care about, and what breaking the chain costs."
    />
  );

  if (!scrollDriven) {
    return (
      <section
        ref={ref}
        id="attack-path"
        className="relative w-full scroll-mt-28 py-20"
      >
        <Container>
          {header}
          <StackedPath />
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="attack-path"
      className="relative w-full scroll-mt-28"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_60%_at_50%_45%,rgb(var(--rgb-threat)/0.07),transparent_70%)]"
          aria-hidden
        />

        <Container>
          {header}

          {/* the chain, across the full measure */}
          <div className="mt-10">
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="h-auto w-full"
              role="img"
              aria-label="Attack path from unauthenticated attacker through a public API, broken authorization, an internal service and an over-scoped cloud role to the customer data store"
            >
              <defs>
                <linearGradient id="ap-escalate" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brand-orange)" />
                  <stop offset="100%" stopColor="var(--brand-red)" />
                </linearGradient>
              </defs>

              {/* base rail */}
              <line
                x1={X0}
                y1={Y}
                x2={X1}
                y2={Y}
                stroke="rgb(var(--rgb-hair) / 0.28)"
                strokeWidth={1}
                strokeDasharray="2 5"
              />

              {NODES.slice(0, -1).map((n, i) => (
                <g key={`l-${i}`}>
                  <line
                    data-link={i}
                    x1={n.x}
                    y1={Y}
                    x2={NODES[i + 1].x}
                    y2={Y}
                    stroke="url(#ap-escalate)"
                    strokeWidth={2}
                  />
                  {/* traffic on a route that is already compromised */}
                  <line
                    data-flow={i}
                    className="ap-flow flow-dash"
                    x1={n.x}
                    y1={Y}
                    x2={NODES[i + 1].x}
                    y2={Y}
                    stroke="var(--brand-orange)"
                    strokeWidth={1}
                    strokeOpacity={0.9}
                  />
                </g>
              ))}

              {NODES.map((n, i) => {
                const last = i === NODES.length - 1;
                return (
                  <g key={n.n} data-node={i} data-current="false">
                    {last ? (
                      <circle
                        className="ap-pulse"
                        cx={n.x}
                        cy={Y}
                        r={30}
                        fill="none"
                        stroke={hot(1)}
                        strokeWidth={1}
                        strokeOpacity={0.5}
                      />
                    ) : null}

                    <circle
                      className="ap-ring"
                      cx={n.x}
                      cy={Y}
                      r={last ? 20 : 15}
                      fill="rgb(var(--rgb-panel) / 0.92)"
                      stroke="rgb(var(--rgb-hair) / 0.25)"
                      strokeWidth={1}
                    />
                    <g className="ap-hot">
                      <circle
                        cx={n.x}
                        cy={Y}
                        r={last ? 20 : 15}
                        fill="none"
                        stroke={hot(n.t)}
                        strokeWidth={1.4}
                      />
                      <circle
                        cx={n.x}
                        cy={Y}
                        r={last ? 6.5 : 4.5}
                        fill={hot(n.t)}
                      />
                    </g>

                    <text
                      x={n.x}
                      y={Y - 44}
                      textAnchor="middle"
                      className="mono"
                      fontSize={9}
                      letterSpacing="0.2em"
                      fill="var(--muted-dim)"
                    >
                      {n.stage.toUpperCase()}
                    </text>

                    <g className="ap-label" style={{ opacity: 0.3 }}>
                      <text
                        x={n.x}
                        y={Y + 46}
                        textAnchor="middle"
                        className="mono"
                        fontSize={8.5}
                        letterSpacing="0.18em"
                        fill="var(--muted-dim)"
                      >
                        {n.n}
                      </text>
                      <text
                        x={n.x}
                        y={Y + 66}
                        textAnchor="middle"
                        fontSize={13}
                        fontWeight={500}
                        fill="var(--ink)"
                      >
                        {n.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* live readout: what this step grants, and what it is worth */}
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-[1.55fr_1fr]">
            <div className="bg-surface/80 p-7">
              <div className="flex items-center gap-3">
                <span
                  ref={numRef}
                  className="mono text-[11px] tracking-[0.2em] text-threat"
                >
                  01
                </span>
                <span className="h-px w-6 bg-threat/50" />
                <span ref={stageRef} className="eyebrow">
                  Entry
                </span>
              </div>
              <p
                ref={nameRef}
                className="display mt-5 text-[26px] leading-tight tracking-tight text-ink"
              >
                Attacker
              </p>
              <p ref={detailRef} className="mt-1.5 text-[13.5px] text-muted-dim">
                Unauthenticated, internet-based
              </p>
              <p
                ref={meaningRef}
                className="mt-5 max-w-2xl text-[14px] leading-relaxed text-muted"
              >
                No credentials, no prior access, no insider.
              </p>
            </div>

            <div className="bg-surface/80 p-7">
              <p className="eyebrow">Impact at this step</p>
              <dl className="mt-6 flex flex-col gap-5">
                {IMPACT_DIMENSIONS.map((d) => (
                  <div key={d.key}>
                    <dt className="mono text-[10px] tracking-[0.16em] text-muted-dim">
                      {d.label}
                    </dt>
                    <dd className="mt-2 flex gap-1.5">
                      {Array.from({ length: MAX }).map((_, k) => (
                        <span
                          key={k}
                          data-seg={k}
                          data-dim={d.key}
                          data-on="false"
                          className="impact-seg h-1.5 flex-1 rounded-full"
                          style={{ ["--seg" as string]: hot(k / (MAX - 1)) }}
                        />
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="ap-verdict mt-6 flex justify-center">
            <span className="inline-flex items-center gap-3 rounded-full border border-[rgb(var(--rgb-threat)/0.4)] bg-[rgb(var(--rgb-threat)/0.07)] px-5 py-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-threat"
                  style={{ animation: "pulse-ring 2s var(--ease-out) infinite" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-threat" />
              </span>
              <span className="mono text-[11px] tracking-[0.22em] text-threat">
                SIX STEPS · NO ALERT FIRED
              </span>
            </span>
          </div>
        </Container>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/Layout";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { gsap, useGSAP, SCRUB, SCRUB_SMOOTH } from "@/lib/gsap";

type Node = {
  id: string;
  label: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  /** the risk this component introduces */
  threat?: string;
  threatSide?: "up" | "down" | "right";
  note: string;
};

const NODES: Node[] = [
  {
    id: "user",
    label: ["USER"],
    x: 62,
    y: 186,
    w: 96,
    h: 46,
    note: "Untrusted input, always",
  },
  {
    id: "app",
    label: ["AI APPLICATION"],
    x: 214,
    y: 186,
    w: 148,
    h: 46,
    threat: "Prompt Injection",
    threatSide: "down",
    note: "Where policy is enforced: or is not",
  },
  {
    id: "llm",
    label: ["LLM"],
    x: 420,
    y: 186,
    w: 108,
    h: 46,
    threat: "Guardrail Evasion",
    threatSide: "down",
    note: "Instruction-following, not judgement",
  },
  {
    id: "rag",
    label: ["RAG"],
    x: 420,
    y: 74,
    w: 108,
    h: 44,
    threat: "Indirect Injection",
    threatSide: "up",
    note: "Retrieved content is executable text",
  },
  {
    id: "agent",
    label: ["AGENT"],
    x: 588,
    y: 186,
    w: 116,
    h: 46,
    threat: "Agentic Risk",
    threatSide: "down",
    note: "Plans, loops and acts on your behalf",
  },
  {
    id: "tools",
    label: ["TOOLS"],
    x: 772,
    y: 86,
    w: 110,
    h: 44,
    threat: "Tool Abuse",
    threatSide: "right",
    note: "Every tool is a new privilege",
  },
  {
    id: "mcp",
    label: ["MCP"],
    x: 772,
    y: 290,
    w: 110,
    h: 44,
    threat: "Privilege Escalation",
    threatSide: "right",
    note: "Transitive trust across servers",
  },
  {
    id: "data",
    label: ["ENTERPRISE", "DATA"],
    x: 962,
    y: 178,
    w: 138,
    h: 62,
    threat: "Data Leakage",
    threatSide: "down",
    note: "The boundary that must hold",
  },
];

const IDX = new Map(NODES.map((n, i) => [n.id, i]));
const byId = (id: string) => NODES[IDX.get(id)!];

const EDGES: { from: string; to: string; bi?: boolean }[] = [
  { from: "user", to: "app" },
  { from: "app", to: "llm" },
  { from: "llm", to: "rag", bi: true },
  { from: "llm", to: "agent" },
  { from: "agent", to: "tools" },
  { from: "agent", to: "mcp" },
  { from: "tools", to: "data" },
  { from: "mcp", to: "data" },
];

const VB_W = 1160;
const VB_H = 440;

const center = (n: Node) => ({ cx: n.x + n.w / 2, cy: n.y + n.h / 2 });

/** Anchor points on the node edge so lines do not run under the boxes. */
function anchors(a: Node, b: Node) {
  const A = center(a);
  const B = center(b);
  const dx = B.cx - A.cx;
  const dy = B.cy - A.cy;
  const ax = A.cx + (dx > 0 ? a.w / 2 : dx < 0 ? -a.w / 2 : 0);
  const ay = A.cy + (Math.abs(dx) < 8 ? (dy > 0 ? a.h / 2 : -a.h / 2) : 0);
  const bx = B.cx + (dx > 0 ? -b.w / 2 : dx < 0 ? b.w / 2 : 0);
  const by = B.cy + (Math.abs(dx) < 8 ? (dy > 0 ? -b.h / 2 : b.h / 2) : 0);
  return { ax, ay, bx, by };
}

/** Which stage an edge belongs to: the later of its two endpoints. */
const edgeStage = (e: { from: string; to: string }) =>
  Math.max(IDX.get(e.from)!, IDX.get(e.to)!);

function StackedArchitecture() {
  return (
    <ol className="mt-12 flex flex-col gap-3">
      {NODES.map((n, i) => (
        <li
          key={n.id}
          className="flex items-start gap-4 rounded-lg border border-[rgb(var(--rgb-ai)/0.22)] bg-surface/60 p-4"
        >
          <span className="mono mt-0.5 text-[10px] text-[color:var(--ai)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <p className="mono text-[12.5px] tracking-[0.12em]">
              {n.label.join(" ")}
            </p>
            <p className="mt-1 text-[12.5px] text-muted-dim">{n.note}</p>
          </div>
          {n.threat ? (
            <span className="mono shrink-0 rounded-full border border-[rgb(var(--rgb-threat)/0.35)] px-2.5 py-1 text-[9px] tracking-[0.12em] text-[rgb(var(--rgb-threat-lift)/0.9)]">
              {n.threat.toUpperCase()}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function AISecurity({ index = "04" }: { index?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const stageRef = useRef<HTMLSpanElement | null>(null);
  const noteRef = useRef<HTMLParagraphElement | null>(null);

  const { reduced, lite, ready, ambient } = useMotionFlags();
  const scrollDriven = ready && !lite && !reduced;

  useGSAP(
    () => {
      if (!scrollDriven) return;

      gsap.set("[data-edge]", { drawSVG: 0 });
      gsap.set(".ai-flow, .ai-particle, .ai-threat, .ai-detail", { opacity: 0 });
      gsap.set("[data-arch-node]", { opacity: 0, scale: 0.86 });
      NODES.forEach((n, i) => {
        const { cx, cy } = center(n);
        gsap.set(`[data-arch-node="${i}"]`, { svgOrigin: `${cx} ${cy}` });
      });
      gsap.set(".ai-boundary", { drawSVG: 0, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: SCRUB },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB_SMOOTH,
        },
      });

      tl.to({}, { duration: 0.5 });

      NODES.forEach((n, i) => {
        const at = `stage-${i}`;
        tl.addLabel(at);

        // the pipe into this stage draws first, then the component lands
        EDGES.forEach((e, ei) => {
          if (edgeStage(e) !== i) return;
          tl.to(
            `[data-edge="${ei}"]`,
            { drawSVG: "100%", duration: 1 },
            `${at}-=0.4`,
          ).to(
            `[data-flow="${ei}"]`,
            { opacity: 1, duration: 0.6 },
            `${at}+=0.5`,
          );
        });

        tl.to(
          `[data-arch-node="${i}"]`,
          { opacity: 1, scale: 1, duration: 0.8 },
          at,
        );

        if (n.threat) {
          tl.to(
            `[data-threat="${i}"]`,
            { opacity: 1, duration: 0.6 },
            `${at}+=0.45`,
          );
        }

        // stage-triggered detail: tool fan-out, MCP channels, data boundary
        if (n.id === "tools") {
          tl.to(".ai-detail-tools", { opacity: 1, duration: 0.7 }, `${at}+=0.3`);
        }
        if (n.id === "mcp") {
          tl.to(".ai-detail-mcp", { opacity: 1, duration: 0.7 }, `${at}+=0.3`);
        }
        if (n.id === "data") {
          tl.to(
            ".ai-boundary",
            { opacity: 1, drawSVG: "100%", duration: 1.2 },
            `${at}+=0.4`,
          ).to(
            ".ai-boundary-label",
            { opacity: 1, duration: 0.6 },
            `${at}+=0.8`,
          );
        }

        tl.to({}, { duration: 0.35 });
      });

      tl.to({}, { duration: 0.5 });

      // Readout is written straight to the DOM, no React render on scroll.
      ScrollReadout(ref.current!, pctRef, stageRef, noteRef);

      // Ambient data flow, once its pipe exists.
      if (ambient) {
        EDGES.forEach((e, ei) => {
          const a = byId(e.from);
          const b = byId(e.to);
          const { ax, ay, bx, by } = anchors(a, b);
          gsap.fromTo(
            `[data-particle="${ei}"]`,
            { attr: { cx: ax, cy: ay } },
            {
              attr: { cx: bx, cy: by },
              duration: 2.6,
              ease: "none",
              repeat: -1,
              repeatDelay: 0.9,
              delay: edgeStage(e) * 0.22,
            },
          );
        });
      }
    },
    { scope: ref, dependencies: [scrollDriven, ambient] },
  );

  const header = (
    <SectionHeading
      index={index}
      eyebrow="AI Security · in practice"
      accent="ai"
      title={
        <>
          An AI system is an{" "}
          <span style={{ color: "var(--ai)" }}>architecture</span>, not a model.
        </>
      }
      lede="Every component moves trust somewhere new, and every label under it is a class of finding we test for. This is the scope of an AI security assessment."
    />
  );

  if (!scrollDriven) {
    return (
      <section
        ref={ref}
        id="ai-architecture"
        className="relative w-full scroll-mt-24 px-6 py-24 sm:px-10"
      >
        <div className="mx-auto w-full max-w-[1240px]">
          {header}
          <StackedArchitecture />
        </div>
      </section>
    );
  }

  const tools = byId("tools");
  const mcp = byId("mcp");
  const data = byId("data");

  return (
    <section
      ref={ref}
      id="ai-architecture"
      className="relative w-full scroll-mt-24"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_60%_50%,rgb(var(--rgb-ai)/0.07),transparent_70%)]"
          aria-hidden
        />

        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10">
          {header}
        </div>

        <div className="mx-auto mt-4 w-full max-w-[1280px] px-4">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="mx-auto h-auto max-h-[50vh] w-full"
            role="img"
            aria-label="AI architecture: user, AI application, LLM, RAG, agent, tools, MCP and enterprise data"
          >
            {EDGES.map((e, ei) => {
              const a = byId(e.from);
              const b = byId(e.to);
              const { ax, ay, bx, by } = anchors(a, b);
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line
                    data-edge={ei}
                    x1={ax}
                    y1={ay}
                    x2={bx}
                    y2={by}
                    stroke="rgb(var(--rgb-ai) / 0.45)"
                    strokeWidth={1.2}
                  />
                  <line
                    data-flow={ei}
                    className="ai-flow flow-dash"
                    x1={ax}
                    y1={ay}
                    x2={bx}
                    y2={by}
                    stroke="var(--ai)"
                    strokeWidth={1.2}
                    strokeOpacity={0.7}
                  />
                  {e.bi ? (
                    <line
                      data-flow={ei}
                      className="ai-flow"
                      x1={bx}
                      y1={by}
                      x2={ax}
                      y2={ay}
                      stroke="var(--ai)"
                      strokeWidth={1}
                      strokeDasharray="2 7"
                      strokeOpacity={0.4}
                    />
                  ) : null}
                  {ambient ? (
                    <circle
                      data-particle={ei}
                      data-flow={ei}
                      className="ai-flow ai-particle"
                      cx={ax}
                      cy={ay}
                      r={2.4}
                      fill="var(--ai)"
                    />
                  ) : null}
                </g>
              );
            })}

            {/* tool fan-out */}
            <g className="ai-detail ai-detail-tools">
              {[0, 1, 2].map((k) => {
                const bx = tools.x + 14 + k * 30;
                const by = tools.y - 58;
                return (
                  <g key={`tool-${k}`}>
                    <line
                      x1={tools.x + tools.w / 2}
                      y1={tools.y}
                      x2={bx + 8}
                      y2={by + 16}
                      stroke="rgb(var(--rgb-ai) / 0.35)"
                      strokeWidth={1}
                    />
                    <rect
                      x={bx}
                      y={by}
                      width={16}
                      height={16}
                      rx={2}
                      fill="rgb(var(--rgb-surface) / 0.9)"
                      stroke="rgb(var(--rgb-ai) / 0.45)"
                    />
                  </g>
                );
              })}
            </g>

            {/* MCP channels */}
            <g className="ai-detail ai-detail-mcp">
              {[0, 1].map((k) => {
                const bx = mcp.x + 24 + k * 34;
                const by = mcp.y + mcp.h + 22;
                return (
                  <g key={`mcp-${k}`}>
                    <line
                      className="flow-dash"
                      x1={mcp.x + mcp.w / 2}
                      y1={mcp.y + mcp.h}
                      x2={bx + 10}
                      y2={by}
                      stroke="rgb(var(--rgb-ai) / 0.4)"
                      strokeWidth={1}
                      strokeDasharray="3 5"
                    />
                    <rect
                      x={bx}
                      y={by}
                      width={20}
                      height={14}
                      rx={2}
                      fill="rgb(var(--rgb-surface) / 0.9)"
                      stroke="rgb(var(--rgb-ai) / 0.4)"
                    />
                  </g>
                );
              })}
              <text
                x={mcp.x + mcp.w / 2}
                y={mcp.y + mcp.h + 52}
                textAnchor="middle"
                className="mono"
                fontSize={8.5}
                letterSpacing="0.16em"
                fill="var(--muted-dim)"
              >
                TOOL SERVERS
              </text>
            </g>

            {/* security boundary around enterprise data */}
            <rect
              className="ai-boundary"
              x={data.x - 26}
              y={data.y - 34}
              width={data.w + 52}
              height={data.h + 68}
              rx={8}
              fill="none"
              stroke="var(--signal)"
              strokeWidth={1}
              strokeDasharray="6 6"
              strokeOpacity={0.75}
            />
            <text
              className="ai-boundary-label mono"
              x={data.x + data.w / 2}
              y={data.y - 42}
              textAnchor="middle"
              fontSize={8.5}
              letterSpacing="0.18em"
              fill="var(--signal)"
              style={{ opacity: 0 }}
            >
              SECURITY BOUNDARY
            </text>

            {NODES.map((n, i) => {
              const { cx, cy } = center(n);
              const isData = n.id === "data";
              return (
                <g key={n.id}>
                  <g data-arch-node={i}>
                    <rect
                      x={n.x}
                      y={n.y}
                      width={n.w}
                      height={n.h}
                      rx={5}
                      fill={
                        isData
                          ? "rgb(var(--rgb-ai) / 0.10)"
                          : "rgb(var(--rgb-surface) / 0.92)"
                      }
                      stroke={
                        isData ? "var(--ai)" : "rgb(var(--rgb-ai) / 0.42)"
                      }
                      strokeWidth={1}
                    />
                    {n.label.map((line, li) => (
                      <text
                        key={line}
                        x={cx}
                        y={cy + (n.label.length === 1 ? 1 : li === 0 ? -6 : 8)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="mono"
                        fontSize={11}
                        letterSpacing="0.12em"
                        fill="var(--ink)"
                      >
                        {line}
                      </text>
                    ))}
                  </g>

                  {n.threat ? (
                    <g data-threat={i} className="ai-threat">
                      {n.threatSide === "right" ? (
                        <>
                          <line
                            x1={n.x + n.w + 4}
                            y1={cy}
                            x2={n.x + n.w + 14}
                            y2={cy}
                            stroke="rgb(var(--rgb-threat) / 0.5)"
                            strokeWidth={1}
                          />
                          <text
                            x={n.x + n.w + 20}
                            y={cy + 3}
                            textAnchor="start"
                            className="mono"
                            fontSize={9}
                            letterSpacing="0.14em"
                            fill="rgb(var(--rgb-threat-lift) / 0.85)"
                          >
                            {n.threat.toUpperCase()}
                          </text>
                        </>
                      ) : (
                        <>
                          <line
                            x1={cx}
                            y1={n.threatSide === "up" ? n.y - 4 : n.y + n.h + 4}
                            x2={cx}
                            y2={
                              n.threatSide === "up" ? n.y - 16 : n.y + n.h + 16
                            }
                            stroke="rgb(var(--rgb-threat) / 0.5)"
                            strokeWidth={1}
                          />
                          <text
                            x={cx}
                            y={
                              n.threatSide === "up" ? n.y - 22 : n.y + n.h + 28
                            }
                            textAnchor="middle"
                            className="mono"
                            fontSize={9}
                            letterSpacing="0.14em"
                            fill="rgb(var(--rgb-threat-lift) / 0.85)"
                          >
                            {n.threat.toUpperCase()}
                          </text>
                        </>
                      )}
                    </g>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        {/* scroll progress readout, the animation is the scrollbar */}
        <div className="mx-auto mt-4 flex w-full max-w-[1240px] items-center gap-5 px-6 sm:px-10">
          <span
            ref={pctRef}
            className="mono w-12 text-[11px] tabular-nums text-[color:var(--ai)]"
          >
            0%
          </span>
          <div className="relative h-px flex-1 bg-line">
            <span
              className="ai-rail absolute inset-y-0 left-0 block w-full origin-left"
              style={{ background: "var(--ai)", transform: "scaleX(0)" }}
            />
          </div>
          <span
            ref={stageRef}
            className="mono w-56 text-right text-[11px] tracking-[0.14em] text-muted"
          >
            {NODES[0].label.join(" ")}
          </span>
        </div>
        <p
          ref={noteRef}
          className="mx-auto mt-2 w-full max-w-[1240px] px-6 text-right text-[12px] text-muted-dim sm:px-10"
        >
          {NODES[0].note}
        </p>
      </div>
    </section>
  );
}

/**
 * Drives the percentage, stage name and note straight from scroll position.
 * Kept out of React state so scrolling never triggers a render.
 */
function ScrollReadout(
  trigger: HTMLElement,
  pctRef: React.RefObject<HTMLSpanElement | null>,
  stageRef: React.RefObject<HTMLSpanElement | null>,
  noteRef: React.RefObject<HTMLParagraphElement | null>,
) {
  let last = -1;
  gsap.to(".ai-rail", {
    scaleX: 1,
    ease: SCRUB,
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB_SMOOTH,
      onUpdate: (self) => {
        const p = self.progress;
        if (pctRef.current) {
          pctRef.current.textContent = `${Math.round(p * 100)}%`;
        }
        const i = Math.min(
          NODES.length - 1,
          Math.max(0, Math.floor((p - 0.06) / (0.94 / NODES.length))),
        );
        if (i !== last) {
          last = i;
          if (stageRef.current) {
            stageRef.current.textContent = NODES[i].label.join(" ");
          }
          if (noteRef.current) noteRef.current.textContent = NODES[i].note;
        }
      },
    },
  });
}

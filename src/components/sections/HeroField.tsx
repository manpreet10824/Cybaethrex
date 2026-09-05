"use client";

import { useEffect, useRef } from "react";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { useTheme } from "@/components/theme/ThemeProvider";

type NodeDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
};

/** The attack surface, as a graph. Positions are normalised to the canvas. */
const NODES: NodeDef[] = [
  { id: "internet", label: "INTERNET", x: 0.09, y: 0.17, r: 4.5 },
  { id: "web", label: "WEB", x: 0.26, y: 0.36, r: 4 },
  { id: "api", label: "API", x: 0.44, y: 0.19, r: 4.5 },
  { id: "cloud", label: "CLOUD", x: 0.62, y: 0.35, r: 5 },
  { id: "identity", label: "IDENTITY", x: 0.29, y: 0.69, r: 4 },
  { id: "infra", label: "INFRASTRUCTURE", x: 0.48, y: 0.82, r: 4 },
  { id: "ai", label: "AI", x: 0.77, y: 0.17, r: 4.5 },
  { id: "agent", label: "AGENT", x: 0.86, y: 0.45, r: 4 },
  { id: "mcp", label: "MCP", x: 0.7, y: 0.63, r: 4 },
  { id: "data", label: "DATA", x: 0.9, y: 0.78, r: 5.5 },
];

const EDGES: [string, string][] = [
  ["internet", "web"],
  ["internet", "api"],
  ["web", "api"],
  ["web", "cloud"],
  ["api", "cloud"],
  ["web", "identity"],
  ["api", "identity"],
  ["identity", "infra"],
  ["infra", "cloud"],
  ["cloud", "ai"],
  ["ai", "agent"],
  ["agent", "mcp"],
  ["cloud", "mcp"],
  ["mcp", "data"],
  ["cloud", "data"],
  ["agent", "data"],
  ["infra", "data"],
];

/** INTERNET -> API -> APPLICATION -> CLOUD -> SENSITIVE ASSET */
const ATTACK_PATH = ["internet", "api", "web", "cloud", "data"];

const INDEX = new Map(NODES.map((n, i) => [n.id, i]));

type Live = {
  bx: number;
  by: number;
  x: number;
  y: number;
  phase: number;
  amp: number;
  glow: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; a: number };

/** Canvas cannot use CSS variables, so read the channels once per theme. */
function readChannels() {
  const cs = getComputedStyle(document.documentElement);
  const triplet = (name: string, fallback: [number, number, number]) => {
    const raw = cs.getPropertyValue(name).trim();
    const parts = raw.split(/[\s,]+/).map(Number);
    return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
      ? (parts as [number, number, number])
      : fallback;
  };
  const boost = Number.parseFloat(cs.getPropertyValue("--canvas-boost"));
  return {
    boost: Number.isFinite(boost) && boost > 0 ? boost : 1,
    signal: triplet("--rgb-signal", [0, 230, 195]),
    threat: triplet("--rgb-threat", [255, 83, 71]),
    threatLift: triplet("--rgb-threat-lift", [255, 120, 110]),
    hair: triplet("--rgb-hair", [148, 174, 205]),
  };
}

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reduced, lite, cursor, ready } = useMotionFlags();
  const { theme } = useTheme();

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const C = readChannels();
    const rgb = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    /** hairline alpha, weighted for the current ground */
    const hairA = (a: number) => Math.min(1, a * C.boost);

    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 1.75);
    const particleCount = lite ? 16 : 46;

    const live: Live[] = NODES.map((n, i) => ({
      bx: 0,
      by: 0,
      x: 0,
      y: 0,
      phase: (i * Math.PI * 2) / NODES.length,
      amp: 3 + (i % 3) * 1.6,
      glow: 0,
    }));

    const particles: Particle[] = [];

    const seedParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          a: 0.12 + Math.random() * 0.3,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      live.forEach((l, i) => {
        l.bx = NODES[i].x * w;
        l.by = NODES[i].y * h;
        l.x = l.bx;
        l.y = l.by;
      });
      seedParticles();
    };

    // Pointer influence (desktop only), eased toward the real position.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      pointer.on = 1;
    };
    const onLeave = () => {
      pointer.on = 0;
    };

    // Attack-path state machine: dwell -> traverse -> mark -> fade.
    let apT = 0;
    let apPhase: "idle" | "run" | "mark" | "fade" = "idle";
    const SEG = 0.82;

    const paint = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);

      if (cursor) {
        pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 6);
        pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 6);
      }

      // --- node positions: slow drift + gentle pointer attraction ---
      for (let i = 0; i < live.length; i++) {
        const l = live[i];
        const driftX = Math.sin(t * 0.24 + l.phase) * l.amp;
        const driftY = Math.cos(t * 0.19 + l.phase * 1.3) * l.amp * 0.8;
        let ox = 0;
        let oy = 0;
        if (cursor && pointer.on) {
          const dx = pointer.x - (l.bx + driftX);
          const dy = pointer.y - (l.by + driftY);
          const d = Math.hypot(dx, dy);
          const R = 240;
          if (d < R) {
            const f = (1 - d / R) ** 2 * 16;
            ox = (dx / (d || 1)) * f;
            oy = (dy / (d || 1)) * f;
            l.glow = Math.max(l.glow, (1 - d / R) ** 2);
          }
        }
        l.glow *= 1 - Math.min(1, dt * 2.4);
        l.x = l.bx + driftX + ox;
        l.y = l.by + driftY + oy;
      }

      // --- attack path progression ---
      apT += dt;
      if (apPhase === "idle" && apT > 4.6) {
        apPhase = "run";
        apT = 0;
      } else if (apPhase === "run" && apT > SEG * (ATTACK_PATH.length - 1)) {
        apPhase = "mark";
        apT = 0;
      } else if (apPhase === "mark" && apT > 1.1) {
        apPhase = "fade";
        apT = 0;
      } else if (apPhase === "fade" && apT > 0.9) {
        apPhase = "idle";
        apT = 0;
      }

      const apProgress =
        apPhase === "run" ? apT / SEG : apPhase === "idle" ? -1 : 99;
      const apAlpha =
        apPhase === "run" || apPhase === "mark"
          ? 1
          : apPhase === "fade"
            ? 1 - apT / 0.9
            : 0;

      const onPath = (a: string, b: string) => {
        for (let i = 0; i < ATTACK_PATH.length - 1; i++) {
          const p = ATTACK_PATH[i];
          const q = ATTACK_PATH[i + 1];
          if ((p === a && q === b) || (p === b && q === a)) return i;
        }
        return -1;
      };

      // --- particles: ambient data in the field ---
      if (!reduced) {
        ctx.fillStyle = rgb(C.hair, hairA(0.5));
        for (const p of particles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
          ctx.globalAlpha = hairA(p.a * 0.6);
          ctx.fillRect(p.x, p.y, 1.4, 1.4);
        }
        ctx.globalAlpha = 1;
      }

      // --- edges ---
      ctx.lineWidth = 1;
      for (const [a, b] of EDGES) {
        const la = live[INDEX.get(a)!];
        const lb = live[INDEX.get(b)!];
        const mx = (la.x + lb.x) / 2;
        const my = (la.y + lb.y) / 2;

        let alpha = hairA(0.14);
        if (cursor && pointer.on) {
          const d = Math.hypot(pointer.x - mx, pointer.y - my);
          if (d < 260) alpha += (1 - d / 260) ** 2 * 0.42;
        }

        const seg = onPath(a, b);
        const hot = seg >= 0 && apAlpha > 0 && apProgress > seg;

        ctx.beginPath();
        ctx.moveTo(la.x, la.y);
        ctx.lineTo(lb.x, lb.y);
        ctx.strokeStyle = hot
          ? rgb(C.threat, (0.28 + alpha) * apAlpha)
          : rgb(C.hair, Math.min(1, alpha));
        ctx.stroke();

        // travelling exploit pulse on the live segment
        if (
          seg >= 0 &&
          apPhase === "run" &&
          apProgress >= seg &&
          apProgress < seg + 1
        ) {
          const k = apProgress - seg;
          const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
          const px = la.x + (lb.x - la.x) * e;
          const py = la.y + (lb.y - la.y) * e;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 22);
          g.addColorStop(0, rgb(C.threat, 0.85));
          g.addColorStop(1, rgb(C.threat, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = rgb(C.threatLift, 0.95);
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- nodes ---
      ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < live.length; i++) {
        const l = live[i];
        const n = NODES[i];
        const apIdx = ATTACK_PATH.indexOf(n.id);
        const compromised =
          apIdx >= 0 &&
          apAlpha > 0 &&
          (apPhase !== "run" || apProgress >= apIdx);
        const crown =
          n.id === "data" && (apPhase === "mark" || apPhase === "fade");

        const [cr, cg, cb] = compromised ? C.threat : C.signal;
        const pulse = crown ? 0.5 + 0.5 * Math.sin(t * 6) : 0;

        // halo
        const haloR = n.r * (crown ? 7 : 5) + l.glow * 18;
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, haloR);
        g.addColorStop(
          0,
          `rgba(${cr},${cg},${cb},${(compromised ? 0.3 : 0.16) + l.glow * 0.3 + pulse * 0.25})`,
        );
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(l.x, l.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        // ring
        ctx.beginPath();
        ctx.arc(l.x, l.y, n.r + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.38 + l.glow * 0.5 + pulse * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // core
        ctx.beginPath();
        ctx.arc(l.x, l.y, n.r * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.75 + l.glow * 0.25})`;
        ctx.fill();

        // label
        ctx.fillStyle = compromised
          ? rgb(C.threatLift, 0.85 + l.glow * 0.15)
          : rgb(C.hair, hairA(0.72) + l.glow * 0.28);
        ctx.fillText(n.label, l.x, l.y + n.r + 14);
      }

      // crown-jewel marker
      if (apPhase === "mark" || apPhase === "fade") {
        const l = live[INDEX.get("data")!];
        const k = apPhase === "mark" ? apT / 1.1 : 1;
        const r = 14 + k * 26;
        ctx.beginPath();
        ctx.arc(l.x, l.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = rgb(C.threat, (1 - k) * 0.7 * apAlpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    let last = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      paint(now / 1000, dt);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) paint(0, 0);
    });
    ro.observe(canvas);
    resize();

    if (reduced) {
      // One static frame: the full surface, no movement.
      paint(0, 0);
      return () => ro.disconnect();
    }

    if (cursor) {
      window.addEventListener("pointermove", onMove, { passive: true });
      canvas.addEventListener("pointerleave", onLeave);
    }

    // Park the loop when offscreen or backgrounded.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [ready, reduced, lite, cursor, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

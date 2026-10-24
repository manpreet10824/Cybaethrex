"use client";

import { useEffect, useRef } from "react";
import { useMotionFlags } from "@/components/motion/MotionProfile";

/**
 * The hero's flow field: a ridge of parallel dashed lines displaced by layered
 * sine motion, coloured along the brand gradient. Canvas rather than SVG:
 * around 60 polylines redrawn every frame is well past where SVG stays cheap.
 *
 * Depth comes from three stacked cues: lines compress toward the back, their
 * amplitude falls away, and their alpha drops. Nothing here is random, so the
 * shape reads as one surface rather than noise.
 */
export function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reduced, lite, ready } = useMotionFlags();

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const cs = getComputedStyle(document.documentElement);
    const triplet = (name: string, fallback: [number, number, number]) => {
      const raw = cs.getPropertyValue(name).trim();
      const m = raw.match(/#?([0-9a-f]{6})/i);
      if (m) {
        const h = m[1];
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ] as [number, number, number];
      }
      const parts = raw.split(/[\s,]+/).map(Number);
      return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
        ? (parts as [number, number, number])
        : fallback;
    };

    const ORANGE = triplet("--brand-orange", [248, 127, 23]);
    const RED = triplet("--brand-red", [193, 17, 38]);
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    /** the field is designed for a dark ground; on light it must recede */
    const alphaScale = isLight ? 0.42 : 1;

    const LINES = lite ? 40 : 92;
    const STEPS = lite ? 54 : 104;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 1.75);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const channels = (t: number) => {
      const r = Math.round(ORANGE[0] + (RED[0] - ORANGE[0]) * t);
      const g = Math.round(ORANGE[1] + (RED[1] - ORANGE[1]) * t);
      const b = Math.round(ORANGE[2] + (RED[2] - ORANGE[2]) * t);
      return `${r},${g},${b}`;
    };

    const paint = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time / 1000;

      // The field occupies the right of the frame and runs off both edges, so
      // it never sits behind the headline and can be driven far brighter.
      const bx0 = w * 0.28;
      const bw = w * 0.82;

      // Additive blending is what gives the crest its bloom where lines
      // converge. On a light ground it would blow out, so it stays off there.
      if (!isLight) ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = 0; i < LINES; i++) {
        const d = i / (LINES - 1); // 0 = front, 1 = back
        const depth = Math.pow(d, 1.22);

        // rows climb the frame and bunch as they recede
        const baseY = h * 1.14 - depth * h * 1.02;
        const amp = h * 0.42 * (1 - depth * 0.36);
        const alpha = Math.pow(1 - depth, 1.0) * 1.35 + 0.06;

        ctx.beginPath();
        ctx.setLineDash(depth < 0.45 ? [2.6, 2.9] : [1.9, 4.0]);
        ctx.lineWidth = 1.5 - depth * 0.7;

        for (let j = 0; j <= STEPS; j++) {
          const nx = j / STEPS;
          const x = bx0 + nx * bw;

          // one crest, slightly right of the band centre
          const env = Math.exp(-Math.pow((nx - 0.52) * 2.5, 2));

          const y =
            baseY -
            env *
              amp *
              (Math.sin(nx * 3.05 + t * 0.3 - depth * 2.45) +
                Math.sin(nx * 6.4 - t * 0.21 + depth * 3.1) * 0.36 +
                Math.sin(nx * 11.7 + t * 0.15 - depth * 1.4) * 0.13);

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Fading along the line's own axis keeps the right side at full
        // strength while the field dissolves before it reaches the headline:
        // a page-level scrim would have had to dim the whole thing.
        const col = channels(Math.min(1, depth * 1.15));
        const grad = ctx.createLinearGradient(bx0, 0, bx0 + bw, 0);
        const a = alpha * alphaScale;
        grad.addColorStop(0, `rgba(${col},0)`);
        grad.addColorStop(0.3, `rgba(${col},${a * 0.25})`);
        grad.addColorStop(0.52, `rgba(${col},${a})`);
        grad.addColorStop(1, `rgba(${col},${a * 0.85})`);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      ctx.setLineDash([]);
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (!running) return;
      paint(now);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) paint(0);
    });
    ro.observe(canvas);
    resize();

    if (reduced) {
      paint(0);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting) {
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
    };
  }, [ready, reduced, lite]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
  );
}

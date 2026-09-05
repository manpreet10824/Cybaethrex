"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { cineIn, DUR, EASE_OUT, stagger, VIEWPORT } from "@/lib/motion";

/**
 * The editorial system every page is built on.
 *
 * One measure (1240px), one rhythm, and a numbered spine down the left of each
 * section. The consistency is the point: it is what makes a site read as one
 * considered document rather than a sequence of templates.
 */

export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-10 ${wide ? "max-w-[1440px]" : "max-w-[1240px]"} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A section with a numbered spine. On wide screens the number and label sit in
 * their own column, the way a technical report indexes its chapters.
 */
export function Section({
  id,
  index,
  label,
  children,
  className = "",
  tone = "default",
  ruled = true,
}: {
  id?: string;
  index?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "raised" | "deep";
  ruled?: boolean;
}) {
  const bg =
    tone === "raised"
      ? "bg-[linear-gradient(to_bottom,var(--bg),rgb(var(--rgb-surface-2)/0.55),var(--bg))]"
      : tone === "deep"
        ? "bg-bg-deep"
        : "";

  return (
    <section
      id={id}
      className={`relative w-full scroll-mt-28 ${bg} ${className}`}
    >
      {ruled ? (
        <Container>
          <div className="h-px w-full bg-line" />
        </Container>
      ) : null}

      <Container className="py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[152px_1fr] lg:gap-14">
          <div className="lg:pt-1">
            {index || label ? (
              <Reveal>
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                  {index ? (
                    <span className="mono text-[11px] tracking-[0.22em] text-signal">
                      {index}
                    </span>
                  ) : null}
                  {label ? (
                    <span className="eyebrow lg:mt-1">{label}</span>
                  ) : null}
                </div>
              </Reveal>
            ) : null}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** Display heading with the optional supporting paragraph beneath it. */
export function Heading({
  title,
  lede,
  size = "lg",
  className = "",
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  className?: string;
}) {
  const { reduced } = useMotionFlags();
  const scale =
    size === "xl"
      ? "text-[clamp(2.1rem,4.6vw,3.4rem)]"
      : size === "lg"
        ? "text-[clamp(1.8rem,3.4vw,2.6rem)]"
        : "text-[clamp(1.4rem,2.4vw,1.85rem)]";

  return (
    <motion.div
      className={className}
      variants={reduced ? undefined : stagger(0.08)}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={VIEWPORT}
    >
      <motion.h2
        variants={reduced ? undefined : cineIn}
        className={`max-w-4xl text-balance leading-[1.1] ${scale}`}
      >
        {title}
      </motion.h2>
      {lede ? (
        <motion.p
          variants={reduced ? undefined : cineIn}
          className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted"
        >
          {lede}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

/** Page-level masthead used by every route except the homepage. */
export function PageHero({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  meta?: { label: string; value: string }[];
}) {
  const { reduced } = useMotionFlags();

  return (
    <header className="relative isolate w-full overflow-hidden pb-12 pt-32 lg:pb-16 lg:pt-40">
      <div className="field-grid absolute inset-0 -z-30 opacity-50" aria-hidden />
      <div
        className="absolute inset-0 -z-30 bg-[radial-gradient(90%_60%_at_15%_0%,rgb(var(--rgb-signal)/0.08),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(to_bottom,transparent,var(--bg))]"
        aria-hidden
      />

      <Container>
        <motion.div
          variants={reduced ? undefined : stagger(0.1, 0.05)}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "show"}
          className="grid gap-6 lg:grid-cols-[152px_1fr] lg:gap-14"
        >
          <motion.p
            variants={reduced ? undefined : cineIn}
            className="eyebrow lg:pt-3"
          >
            {eyebrow}
          </motion.p>

          <div>
            <motion.h1
              variants={reduced ? undefined : cineIn}
              className="max-w-4xl text-balance text-[clamp(2.3rem,5.2vw,4rem)] leading-[1.06]"
            >
              {title}
            </motion.h1>

            {lede ? (
              <motion.p
                variants={reduced ? undefined : cineIn}
                className="mt-7 max-w-2xl text-[16px] leading-relaxed text-muted"
              >
                {lede}
              </motion.p>
            ) : null}

            {meta?.length ? (
              <motion.dl
                variants={reduced ? undefined : cineIn}
                className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4"
              >
                {meta.map((m) => (
                  <div key={m.label} className="bg-surface/80 px-5 py-4">
                    <dt className="mono text-[10px] tracking-[0.16em] text-muted-dim">
                      {m.label}
                    </dt>
                    <dd className="mt-1.5 text-[13.5px] text-ink">{m.value}</dd>
                  </div>
                ))}
              </motion.dl>
            ) : null}
          </div>
        </motion.div>
      </Container>
    </header>
  );
}

/** Numbered editorial row, the workhorse for service and deliverable lists. */
export function EditorialRow({
  index,
  title,
  body,
  meta,
  href,
}: {
  index: string;
  title: string;
  body: string;
  meta?: string;
  href?: string;
}) {
  const inner = (
    <div className="grid gap-3 border-b border-line py-6 sm:grid-cols-[52px_1fr_auto] sm:gap-6">
      <span className="mono pt-1 text-[10px] tracking-[0.18em] text-muted-dim">
        {index}
      </span>
      <div className="min-w-0">
        <p className="text-[15.5px] font-medium tracking-tight text-ink transition-colors duration-200 group-hover:text-signal">
          {title}
        </p>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
          {body}
        </p>
      </div>
      {meta ? (
        <span className="mono self-start pt-1 text-[10px] tracking-[0.14em] text-muted-dim sm:text-right">
          {meta}
        </span>
      ) : null}
    </div>
  );

  if (!href) return <Reveal>{inner}</Reveal>;
  return (
    <Reveal>
      <Link href={href} className="group block">
        {inner}
      </Link>
    </Reveal>
  );
}

/** Text link with the arrow motion used sitewide. */
export function ArrowLink({
  href,
  children,
  tone = "signal",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "signal" | "muted";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-[13px] transition-colors duration-200 ${
        tone === "signal" ? "text-signal" : "text-muted hover:text-signal"
      } ${className}`}
    >
      {children}
      <ArrowRight
        size={14}
        strokeWidth={1.6}
        className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
        aria-hidden
      />
    </Link>
  );
}

/** Seam between sections: a continuous spine with a slow travelling pulse. */
export function Seam({ accent = "var(--signal)" }: { accent?: string }) {
  const { ambient } = useMotionFlags();

  return (
    <div className="pointer-events-none relative mx-auto h-16 w-full" aria-hidden>
      <div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${accent} 45%, transparent) 55%, transparent)`,
        }}
      />
      {ambient ? (
        <motion.span
          className="absolute left-1/2 h-8 w-px -translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
          }}
          initial={{ top: "-14%", opacity: 0 }}
          animate={{ top: ["-14%", "100%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 3.2,
            ease: EASE_OUT,
            repeat: Infinity,
            repeatDelay: 1.8,
          }}
        />
      ) : null}
    </div>
  );
}

/** Big stat, used sparingly. */
export function Stat({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="bg-surface/80 px-5 py-6">
      <p
        className="display text-[30px] leading-none text-signal tabular-nums"
        style={{ transitionDuration: `${DUR.normal}s` }}
      >
        {value}
      </p>
      <p className="mt-3 text-[13px] text-ink">{label}</p>
      {note ? <p className="mt-1 text-[12px] text-muted-dim">{note}</p> : null}
    </div>
  );
}

/**
 * Heading used by the pinned diagram sections, which render their own
 * `<section>` and cannot sit inside `Section`. Same type scale and spine
 * treatment, so they stay visually of a piece with the rest of the system.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  accent = "signal",
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  accent?: "signal" | "threat" | "ai";
}) {
  const { reduced } = useMotionFlags();
  const color =
    accent === "threat"
      ? "var(--threat)"
      : accent === "ai"
        ? "var(--ai)"
        : "var(--signal)";

  return (
    <motion.header
      className={`flex flex-col gap-5 ${align === "center" ? "items-center text-center" : "items-start"}`}
      variants={reduced ? undefined : stagger(0.08)}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={VIEWPORT}
    >
      <motion.div
        className="flex items-center gap-3"
        variants={reduced ? undefined : cineIn}
      >
        <span className="mono text-[11px] tracking-[0.22em]" style={{ color }}>
          {index}
        </span>
        <span className="h-px w-8" style={{ background: color, opacity: 0.5 }} />
        <span className="eyebrow">{eyebrow}</span>
      </motion.div>

      <motion.h2
        className="max-w-3xl text-balance text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1]"
        variants={reduced ? undefined : cineIn}
      >
        {title}
      </motion.h2>

      {lede ? (
        <motion.p
          className="max-w-2xl text-[15px] leading-relaxed text-muted"
          variants={reduced ? undefined : cineIn}
        >
          {lede}
        </motion.p>
      ) : null}
    </motion.header>
  );
}

/** Back-compat alias for the seam used by the training route. */
export { Seam as SectionSeam };

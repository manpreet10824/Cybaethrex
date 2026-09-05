"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Heading } from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { useCursorLight } from "@/lib/hooks";
import {
  SERVICE_CATEGORIES,
  TOTAL_SERVICES,
  type ServiceCategory,
} from "@/lib/services";

/**
 * Card grid in the reference's rhythm: a category tag, a title, and either a
 * graphic panel or body copy, ending in an expand affordance.
 *
 * Every third card takes the gradient treatment so the grid has the same
 * alternation of image and text cards rather than ten identical tiles.
 */
function Card({ c, i }: { c: ServiceCategory; i: number }) {
  const { ref, onPointerMove } = useCursorLight<HTMLAnchorElement>();
  const graphic = i % 3 === 1;
  // walks the logo gradient across the grid so no two neighbours match
  const t = i / (SERVICE_CATEGORIES.length - 1);
  const tone = `color-mix(in srgb, var(--brand-orange), var(--brand-red) ${Math.round(t * 100)}%)`;

  return (
    <Reveal className="h-full">
      <Link
        ref={ref}
        onPointerMove={onPointerMove}
        href={`/services#${c.id}`}
        className="svc-card cursor-light group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface/80"
      >
        <div className="relative z-10 flex flex-1 flex-col p-6">
          <p className="mono text-[10px] tracking-[0.2em] text-muted-dim">
            {c.family.toUpperCase()}
          </p>

          <h3 className="mt-4 text-[19px] font-semibold leading-[1.2] tracking-tight text-ink transition-colors duration-200 group-hover:text-signal">
            {c.name}
          </h3>

          {graphic ? null : (
            <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-muted">
              {c.intro}
            </p>
          )}

          <div
            className={`flex items-center justify-between ${graphic ? "mt-4" : "mt-6"}`}
          >
            <span className="mono text-[10px] tracking-[0.14em] text-muted-dim">
              {c.services.length} SERVICES
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-signal">
              Explore
              <ArrowRight
                size={13}
                strokeWidth={2}
                className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </div>

        {graphic ? (
          <div
            className="relative mt-auto h-44 w-full overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 100% at 25% 110%, ${tone}, transparent 70%)`,
              }}
            />
            <div className="field-grid-fine absolute inset-0 opacity-50" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgb(var(--rgb-bg) / 0.5), transparent 60%)",
              }}
            />
            <ul className="absolute inset-x-6 bottom-5 flex flex-wrap gap-x-3 gap-y-1">
              {c.services.slice(0, 3).map((s) => (
                <li key={s} className="text-[11.5px] text-ink/85">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Link>
    </Reveal>
  );
}

export function ServiceCards({ index }: { index: string }) {
  return (
    <section
      id="services-overview"
      className="relative w-full scroll-mt-28 py-16 lg:py-20"
    >
      <Container>
        <div className="h-px w-full bg-line" />
      </Container>

      <Container className="pt-16 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-[152px_1fr] lg:gap-14">
          <Reveal>
            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
              <span className="mono text-[11px] tracking-[0.22em] text-signal">
                {index}
              </span>
              <span className="eyebrow lg:mt-1">What we do</span>
            </div>
          </Reveal>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Heading
                title="Ten practices, one accountable team."
                lede={`${TOTAL_SERVICES} services across assessment, engineering, build, governance and advisory. Most engagements draw on two or three.`}
              />
              <Reveal>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 whitespace-nowrap text-[13.5px] font-medium text-signal"
                >
                  View all services
                  <ArrowRight
                    size={14}
                    strokeWidth={2}
                    className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            </div>

            <RevealGroup
              as="div"
              each={0.05}
              className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {SERVICE_CATEGORIES.map((c, i) => (
                <Card key={c.id} c={c} i={i} />
              ))}
            </RevealGroup>
          </div>
        </div>
      </Container>
    </section>
  );
}

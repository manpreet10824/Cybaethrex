"use client";

import Link from "next/link";
import { ArrowRight, Code2, Compass, ShieldCheck } from "lucide-react";
import { HeroField } from "./HeroField";
import { Container } from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import {
  FAMILY_NOTE,
  FAMILY_ORDER,
  FAMILY_TITLE,
  byFamily,
  type Family,
} from "@/lib/services";

const ICON: Record<Family, typeof Code2> = {
  Technology: Code2,
  Security: ShieldCheck,
  Advisory: Compass,
};

/**
 * The statement band, in the reference's split: copy held left against a full
 * visual panel on the right, with the three pillars listed beneath as a
 * selector.
 *
 * The panel runs the security-graph canvas behind a scanline overlay rather
 * than a photograph. There is no owned photography yet, and stock imagery of
 * people at laptops would say less about the practice than its own diagram.
 */
export function Pillars({ index }: { index: string }) {
  return (
    <section id="what-we-are" className="relative w-full scroll-mt-28">
      <Container>
        <div className="h-px w-full bg-line" />
      </Container>

      <div className="grid items-stretch lg:grid-cols-[1fr_0.86fr]">
        {/* left: statement */}
        <div className="flex items-center py-16 lg:py-24">
          <Container className="lg:mr-0 lg:max-w-none lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] lg:pr-14">
            <Reveal>
              <span className="mb-8 block h-[3px] w-28 bg-signal" aria-hidden />
            </Reveal>
            <Reveal>
              <p className="mono mb-5 text-[11px] tracking-[0.22em] text-signal">
                {index}
                <span className="ml-3 text-muted-dim">WHAT WE ARE</span>
              </p>
            </Reveal>
            <Reveal>
              <h2 className="max-w-[15ch] text-[clamp(2.1rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
                Build it, secure it, prove it.
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-muted">
                One practice across the full life of a system. We design and
                build technology, we assess and secure it, and we help you
                govern it well enough to show a regulator, an auditor or your
                largest customer.
              </p>
            </Reveal>

            <RevealGroup as="ul" each={0.07} className="mt-10 flex flex-col">
              {FAMILY_ORDER.map((f) => {
                const Icon = ICON[f];
                const count = byFamily(f).length;
                return (
                  <Reveal key={f} as="li">
                    <Link
                      href="/services"
                      className="group flex items-center gap-4 border-b border-line py-4 first:border-t"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line-strong text-muted transition-colors duration-200 group-hover:border-signal group-hover:text-signal">
                        <Icon size={15} strokeWidth={1.8} aria-hidden />
                      </span>
                      <span className="flex-1 text-[15px] font-medium text-ink transition-colors duration-200 group-hover:text-signal">
                        {FAMILY_TITLE[f]}
                      </span>
                      <span className="mono text-[10px] tracking-[0.14em] text-muted-dim">
                        {count} {count === 1 ? "PRACTICE" : "PRACTICES"}
                      </span>
                      <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                        className="text-muted-dim transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-signal"
                        aria-hidden
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </RevealGroup>
          </Container>
        </div>

        {/* right: visual panel, bleeding to the edge like the reference */}
        <div className="relative min-h-[340px] overflow-hidden lg:min-h-full">
          <div className="absolute inset-0 bg-bg-deep" aria-hidden />
          <div className="absolute inset-0" aria-hidden>
            <HeroField />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 70% at 70% 60%, rgb(var(--rgb-signal) / 0.18), transparent 68%)",
            }}
            aria-hidden
          />
          {/* the reference's vertical scanline treatment */}
          <div
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgb(var(--rgb-bg) / 0.55) 0 2px, transparent 2px 7px)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-y-0 left-0 w-32 bg-[linear-gradient(to_right,var(--bg),transparent)]"
            aria-hidden
          />
        </div>
      </div>

      {/* numbered pillar columns */}
      <Container>
        <div className="h-px w-full bg-line" />
        <RevealGroup
          as="div"
          each={0.08}
          className="grid gap-px overflow-hidden bg-line lg:grid-cols-3"
        >
          {FAMILY_ORDER.map((f, i) => (
            <Reveal key={f} className="h-full">
              <div className="group flex h-full flex-col bg-bg px-1 py-10 lg:px-8">
                <span className="mono text-[11px] tracking-[0.22em] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mono mt-5 text-[13px] font-semibold tracking-[0.18em] text-ink">
                  {f.toUpperCase()}
                </h3>
                <p className="mt-5 text-[14px] leading-relaxed text-muted">
                  {FAMILY_NOTE[f]}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5">
                  {byFamily(f).map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/services#${c.id}`}
                        className="text-[12.5px] text-muted-dim transition-colors duration-200 hover:text-signal"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
        <div className="h-px w-full bg-line" />
      </Container>
    </section>
  );
}

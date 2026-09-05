"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import {
  ArrowLink,
  Container,
  EditorialRow,
  Heading,
  Section,
} from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCursorLight } from "@/lib/hooks";
import { FRAMEWORKS, CASES, TRAINING_BRIDGE } from "@/lib/content";
import {
  INDUSTRIES,
  INSIGHTS,
  ENGAGEMENT_MODELS,
  IDENTITY,
  RESEARCH,
} from "@/lib/site";

/** How the firm is bought, the section most consultancies forget. */
export function HowWeEngage({ index }: { index: string }) {
  return (
    <Section id="engage" index={index} label="How to engage" tone="raised">
      <Heading
        title="Four ways to work with us."
        lede="Scope and commitment differ; the standard of delivery does not. Every model is priced up front and staffed by the person who scoped it."
      />

      <RevealGroup as="div" each={0.07} className="mt-12 grid gap-5 lg:grid-cols-2">
        {ENGAGEMENT_MODELS.map((m) => (
          <Reveal key={m.id} className="h-full">
            <article className="svc-card group relative flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-7">
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--brand-orange),var(--brand-red))] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden
              />
              <div className="flex items-baseline justify-between gap-4">
                <span className="mono text-[11px] tracking-[0.2em] text-muted-dim">
                  {m.n}
                </span>
                <span className="mono text-[10px] tracking-[0.14em] text-signal">
                  {m.shape}
                </span>
              </div>
              <h3 className="mt-6 text-[20px] tracking-tight">{m.name}</h3>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">
                {m.body}
              </p>
              <p className="mt-5 border-t border-line pt-4 text-[12.5px] text-muted-dim">
                <span className="text-signal">Right when</span> {m.fit}
              </p>
            </article>
          </Reveal>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** Sectors, kept honest about which are backed by published work. */
export function Industries({ index }: { index: string }) {
  return (
    <Section id="industries" index={index} label="Industries">
      <Heading
        title="Where the work concentrates."
        lede="Security problems rhyme across sectors, but the consequences do not. These are the environments we know well enough to be useful quickly."
      />

      <RevealGroup as="div" each={0.06} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((ind) => (
          <Reveal key={ind.id} className="h-full">
            <Link
              href={`/industries#${ind.id}`}
              className="group flex h-full flex-col bg-surface/80 p-6 transition-colors duration-300 hover:bg-surface-2"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[16px] tracking-tight transition-colors duration-200 group-hover:text-signal">
                  {ind.name}
                </h3>
                {ind.proven ? (
                  <span className="mono shrink-0 rounded-full border border-line px-2 py-0.5 text-[9px] tracking-[0.12em] text-muted-dim">
                    CASE STUDY
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                {ind.lede}
              </p>
            </Link>
          </Reveal>
        ))}
      </RevealGroup>

      <Reveal className="mt-10">
        <ArrowLink href="/industries">Read the sector detail</ArrowLink>
      </Reveal>
    </Section>
  );
}

/** Selected work: three real engagements, stated plainly. */
export function Work({ index }: { index: string }) {
  return (
    <Section id="work" index={index} label="Selected work">
      <Heading
        title="What the engagements produced."
        lede="Anonymised, but real. Each ran the same way: assess the actual exposure, advise on the decisions that matter, design the fix, prove it holds."
      />

      <RevealGroup as="div" each={0.08} className="mt-12 grid gap-5 lg:grid-cols-3">
        {CASES.map((c) => (
          <CaseCard key={c.sector} c={c} />
        ))}
      </RevealGroup>
    </Section>
  );
}

function CaseCard({ c }: { c: (typeof CASES)[number] }) {
  const { ref, onPointerMove } = useCursorLight<HTMLDivElement>();

  return (
    <Reveal className="h-full">
      <article
        ref={ref}
        onPointerMove={onPointerMove}
        className="svc-card cursor-light group relative flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-7"
      >
        <div className="flex items-center justify-between">
          <span className="eyebrow">{c.sector}</span>
          <span className="mono text-[10px] tracking-[0.14em] text-signal">
            {c.scope}
          </span>
        </div>

        <p className="display mt-8 text-[26px] leading-tight tracking-tight text-ink">
          {c.metric}
        </p>
        <p className="mt-2 text-[13px] text-muted">{c.metricNote}</p>

        <dl className="mt-7 flex flex-col gap-4 border-t border-line pt-6">
          {(
            [
              ["Challenge", c.challenge],
              ["Approach", c.approach],
              ["Outcome", c.outcome],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="mono text-[10px] tracking-[0.18em] text-muted-dim">
                {k}
              </dt>
              <dd className="mt-1.5 text-[13px] leading-relaxed text-muted">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </Reveal>
  );
}

/** Standards band + the proof stats, together as one credibility block. */
export function Credibility({ index }: { index: string }) {
  return (
    <Section id="standards" index={index} label="Standards">
      <Heading
        title="Measured against what your auditors actually ask about."
        lede="Findings are mapped to the frameworks your regulators, customers and certification bodies already use, so the work lands as evidence rather than opinion."
      />

      <RevealGroup
        as="div"
        each={0.04}
        className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4"
      >
        {FRAMEWORKS.map((f) => (
          <Reveal key={f.name} className="h-full">
            <div className="group h-full bg-surface/80 px-5 py-5 transition-colors duration-300 hover:bg-surface-2">
              <p className="mono text-[11.5px] tracking-[0.08em] text-ink transition-colors duration-200 group-hover:text-signal">
                {f.name}
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-dim">
                {f.note}
              </p>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** The single training doorway on the consulting site. */
export function TrainingBridge() {
  return (
    <Container className="py-14">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-line bg-surface/50 px-7 py-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex items-start gap-4">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted"
              aria-hidden
            >
              <GraduationCap size={16} strokeWidth={1.5} />
            </span>
            <div>
              <p className="eyebrow">{TRAINING_BRIDGE.eyebrow}</p>
              <h2 className="mt-2 text-[19px] tracking-tight">
                {TRAINING_BRIDGE.title}
              </h2>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                {TRAINING_BRIDGE.body}
              </p>
            </div>
          </div>
          <Link
            href="/training"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[12.5px] text-ink transition-colors duration-200 hover:border-signal hover:text-signal"
          >
            {TRAINING_BRIDGE.cta}
          </Link>
        </div>
      </Reveal>
    </Container>
  );
}

/** Closing call to action, shared across routes. */
export function CTA({
  eyebrow = "Next step",
  title = "Have a security decision to make?",
  line2 = "Let’s make it an informed one.",
  body = "Tell us what you are building, adopting or worried about. You will get a practitioner’s view of where the risk actually sits, before any engagement is scoped.",
  primary = { label: "Talk to a security expert", href: "/contact" },
  secondary = { label: "Explore our services", href: "/services" },
}: {
  eyebrow?: string;
  title?: string;
  line2?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative w-full overflow-hidden border-t border-line py-24 lg:py-32">
      <div
        className="field-grid pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgb(var(--rgb-signal)/0.09),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="eyebrow mb-8">{eyebrow}</p>
            <h2 className="text-[clamp(2rem,4.8vw,3.2rem)] leading-[1.08]">
              {title}
            </h2>
            <h2 className="mt-1 text-[clamp(2rem,4.8vw,3.2rem)] leading-[1.08] text-signal">
              {line2}
            </h2>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted">
              {body}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href={primary.href} pulse strength={0.4}>
                {primary.label}
              </MagneticButton>
              <MagneticButton
                href={secondary.href}
                variant="ghost"
                strength={0.18}
              >
                {secondary.label}
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * The plainest block on the site. A visitor should be able to answer "what are
 * they, what do they do" from this alone, without inference.
 */
export function Identity({ index }: { index: string }) {
  const items = [IDENTITY.what, IDENTITY.do, IDENTITY.notDo];
  return (
    <Section id="what-we-are" index={index} label="Who we are">
      <Heading
        title="What we are, and what we do."
        lede="Security consulting is a crowded word. Here is exactly what it means here, including the parts we decline."
      />
      <RevealGroup as="div" each={0.08} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.label} className="h-full">
            <div className="flex h-full flex-col bg-surface/80 p-7">
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] tracking-[0.2em] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="eyebrow">{it.label}</span>
              </div>
              <p className="mt-6 text-[14.5px] leading-relaxed text-muted">
                {it.body}
              </p>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** Established positions. Assertions we will defend, not open questions. */
export function Research({ index }: { index: string }) {
  return (
    <Section id="research" index={index} label="Specialist depth" tone="raised">
      <Heading
        title="The patterns we see before you do."
        lede="Four things the engagements keep proving. Recognising them on day one is most of what makes an assessment fast."
      />
      <RevealGroup as="div" each={0.07} className="mt-12 grid gap-x-10 gap-y-9 lg:grid-cols-2">
        {RESEARCH.map((r) => (
          <Reveal key={r.id}>
            <article className="border-t border-line pt-6">
              <p className="mono text-[11px] tracking-[0.16em] text-signal">
                {r.area}
              </p>
              <p className="mt-4 text-[17px] font-medium leading-snug tracking-tight text-ink">
                {r.claim}
              </p>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted">
                {r.body}
              </p>
              <p className="mono mt-4 text-[10px] tracking-[0.14em] text-muted-dim">
                {r.proof.toUpperCase()}
              </p>
            </article>
          </Reveal>
        ))}
      </RevealGroup>

      <div className="mt-14 border-t border-line pt-10">
        <p className="eyebrow mb-6">Published analysis</p>
        {INSIGHTS.slice(0, 3).map((a, i) => (
          <EditorialRow
            key={a.slug}
            index={String(i + 1).padStart(2, "0")}
            title={a.title}
            body={a.dek}
            meta={`${a.tag} · ${a.readingTime}`}
            href={`/insights/${a.slug}`}
          />
        ))}
        <Reveal className="mt-8">
          <ArrowLink href="/insights">Read all analysis</ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}

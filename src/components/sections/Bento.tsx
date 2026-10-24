"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { CONTACT, FRAMEWORKS } from "@/lib/content";
import { SERVICE_CATEGORIES, TOTAL_SERVICES } from "@/lib/services";

/** One attack path, the shape every engagement report leads with. */
const CHAIN = [
  "Attacker",
  "Public API",
  "Broken authorisation",
  "Internal service",
  "Cloud role",
  "Customer data",
];

const AI_FRAMEWORKS = ["OWASP LLM Top 10", "NIST AI RMF", "ISO/IEC 42001", "EU AI Act"];

/**
 * The at-a-glance grid under the hero: the scale of the practice, how findings
 * are delivered, and the lead practice, as six tiles of unequal size. Every
 * number comes from the catalogue, so it cannot drift from the services page.
 */
export function Bento({ index }: { index: string }) {
  const practices = SERVICE_CATEGORIES.length;

  return (
    <section id="at-a-glance" className="relative w-full scroll-mt-28 py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <p className="mono text-[11px] tracking-[0.22em] text-signal">
            {index}
            <span className="ml-3 text-muted-dim">AT A GLANCE</span>
          </p>
          <h2 className="mt-5 text-balance text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.04em]">
            Everything a security decision needs, in one engagement.
          </h2>
          <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-muted sm:text-[16px]">
            {practices} practices and {TOTAL_SERVICES} services, grouped by the
            order work actually happens: assess what is there, engineer what is
            missing, build what does not exist, govern it, then decide where it
            goes next.
          </p>
        </Reveal>

        <RevealGroup
          as="div"
          each={0.06}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(220px,auto)]"
        >
          <Tile span="lg:col-span-2" href="/services">
            <Key>Practices</Key>
            <Big>{practices}</Big>
            <Body>
              One accountable team across assessment, engineering, build,
              governance and advisory.
            </Body>
          </Tile>

          <Tile span="sm:col-span-2 lg:col-span-4" href="/#attack-path">
            <Key>Attack path · how findings are delivered</Key>
            <h3 className="mt-3 text-[20px] tracking-[-0.02em]">
              A finding is a fact. A path is a business risk.
            </h3>
            <Body>
              We show the chain: how one weak assumption becomes access to the
              thing you actually care about.
            </Body>
            <ol className="mt-5 flex flex-wrap items-center gap-2" aria-label="Example attack path">
              {CHAIN.map((step, i) => {
                const last = i === CHAIN.length - 1;
                return (
                  <li key={step} className="flex items-center gap-2">
                    <span
                      className={`panel-ink rounded-lg border px-3 py-2 text-[12.5px] ${
                        last
                          ? "border-[rgb(var(--rgb-threat)/0.6)] text-[var(--bad)]"
                          : "border-[var(--glass-line)] text-ink"
                      }`}
                    >
                      {step}
                    </span>
                    {last ? null : (
                      <ArrowRight
                        size={13}
                        strokeWidth={2}
                        className="text-signal"
                        aria-hidden
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </Tile>

          <Tile span="sm:col-span-2 lg:col-span-3" href="/#ai-architecture">
            <Key>AI security · lead practice</Key>
            <h3 className="mt-3 text-[20px] tracking-[-0.02em]">
              An AI system is an architecture, not a model.
            </h3>
            <Body>
              User, application, LLM, RAG, agent, tools, MCP, enterprise data:
              every component moves trust somewhere new, and each is a class of
              finding we test for.
            </Body>
            <ul className="mt-5 flex flex-wrap gap-2">
              {AI_FRAMEWORKS.map((f) => (
                <li
                  key={f}
                  className="mono rounded-full border border-[var(--glass-line)] px-3 py-1.5 text-[11.5px] text-muted"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Tile>

          <Tile span="lg:col-span-1" href="/services">
            <Key>Services</Key>
            <Big size="sm">{TOTAL_SERVICES}</Big>
            <Body small>in the catalogue</Body>
          </Tile>

          <Tile span="lg:col-span-2" href="/contact">
            <Key>Response</Key>
            <Big size="md">1 day</Big>
            <Body>
              A practitioner replies {CONTACT.responseTime}. Not a sales desk.
            </Body>
          </Tile>
        </RevealGroup>

        {/* framework strip */}
        <Reveal className="mt-10">
          <ul
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-line py-6 lg:justify-between"
            aria-label="Frameworks the work is mapped to"
          >
            {FRAMEWORKS.map((f) => (
              <li
                key={f.name}
                className="display text-[16px] font-bold tracking-[-0.02em] text-muted-dim transition-colors duration-200 hover:text-ink sm:text-[18px]"
                title={f.note}
              >
                {f.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

function Tile({
  span,
  href,
  children,
}: {
  span: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={`h-full ${span}`}>
      <Link
        href={href}
        className="glass svc-card group relative flex h-full flex-col overflow-hidden rounded-[20px] p-6 sm:p-7"
      >
        {children}
      </Link>
    </Reveal>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono text-[10px] tracking-[0.16em] text-muted-dim">
      {String(children).toUpperCase()}
    </p>
  );
}

function Big({
  children,
  size = "lg",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const cls =
    size === "lg"
      ? "text-[64px] lg:text-[72px]"
      : size === "md"
        ? "text-[48px] lg:text-[56px]"
        : "text-[56px] lg:text-[64px]";
  return (
    <p
      className={`display text-grad mt-3 font-bold leading-none tracking-[-0.05em] tabular-nums ${cls}`}
    >
      {children}
    </p>
  );
}

function Body({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <p
      className={`mt-2 max-w-[420px] leading-relaxed text-muted ${small ? "text-[12.5px]" : "text-[13.5px]"}`}
    >
      {children}
    </p>
  );
}

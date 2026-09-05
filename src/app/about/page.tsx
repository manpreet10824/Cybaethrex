import type { Metadata } from "next";
import { Heading, PageHero, Section, Stat } from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/HomeSections";
import { BRAND, CERTIFICATIONS, PROOF } from "@/lib/content";
import { IDENTITY, PRACTICE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About · Cybaethrex",
  description:
    "A founder-led security consulting practice built around AI risk, governance and technology advisory. Cyber, Aethics, Rex.",
};

export default function AboutPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="About"
        title={
          <>
            Security advice you can{" "}
            <span className="text-signal">act on</span>, from people who have
            done the work.
          </>
        }
        lede="Cybaethrex is a security consulting practice built around AI risk, governance and technology advisory. The name is Cyber, Aethics and Rex, security practised with ethics at the front."
        meta={[
          { label: "Model", value: "Founder-led" },
          { label: "Lead practice", value: "AI Security" },
          { label: "Delivery", value: "Senior, direct" },
          { label: "Reach", value: "Global · remote-first" },
        ]}
      />

      <Section index="01" label="In plain terms">
        <Heading
          title="What we are, and what we do."
          lede="Security consulting is a crowded word. Here is exactly what it means here, including the parts we decline."
        />
        <RevealGroup
          as="div"
          each={0.08}
          className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-3"
        >
          {[IDENTITY.what, IDENTITY.do, IDENTITY.notDo].map((it, i) => (
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

      <Section index="02" label="Why we exist">
        <Heading
          title="Most security reports are read once and filed."
          lede="They describe issues rather than consequences, and leave the reader to work out what to do on Monday morning."
        />
        <Reveal className="mt-10 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            We work the other way round: establish what an adversary can
            actually reach, translate it into decisions with costs attached,
            design the fix at the level of root cause, and then prove it holds.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            That sequence: assess, advise, architect, assure, is the whole
            method. It is deliberately unglamorous, and it is the reason clients
            can show our work to an auditor rather than filing it.
          </p>
          <p className="mono mt-8 text-[11px] tracking-[0.16em] text-muted-dim">
            {BRAND.etymology.join(" · ").toUpperCase()}
          </p>
        </Reveal>
      </Section>

      <Section index="03" label="How we practise" tone="raised">
        <Heading
          title="Small, senior, and honest about scope."
          lede="The operating model is the product. These four choices decide what an engagement is worth."
        />
        <RevealGroup as="div" each={0.07} className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {PRACTICE.model.map((m, i) => (
            <Reveal key={m.title}>
              <div className="flex gap-5">
                <span className="mono pt-1 text-[10px] tracking-[0.18em] text-muted-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] font-medium tracking-tight text-ink">
                    {m.title}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                    {m.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      <Section index="04" label="Principles">
        <Heading title="Four rules we do not trade away." size="sm" />
        <RevealGroup as="ol" each={0.06} className="mt-10">
          {PRACTICE.principles.map((p, i) => (
            <Reveal key={p} as="li">
              <div className="flex items-baseline gap-6 border-b border-line py-5">
                <span className="mono text-[10px] tracking-[0.18em] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] tracking-tight text-ink">{p}</span>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      <Section index="05" label="Credentials">
        <Heading
          title="Certified where it counts."
          lede="Certifications are a floor, not a differentiator: but for AI governance work in particular, they are what lets us sign the assessment."
          size="sm"
        />
        <Reveal className="mt-10">
          <ul className="flex flex-wrap gap-2.5">
            {CERTIFICATIONS.map((c) => (
              <li
                key={c}
                className="mono rounded-full border border-line bg-surface/70 px-4 py-2 text-[11.5px] tracking-[0.1em] text-muted"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <RevealGroup
          as="div"
          each={0.06}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4"
        >
          {PROOF.map((s) => (
            <Reveal key={s.label} className="h-full">
              <Stat value={s.value} label={s.label} note={s.note} />
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      <CTA
        title="Want to know if we are a fit?"
        line2="Ask us directly."
        body="We will tell you when a control is adequate, when an engagement is unnecessary, and when the honest answer is that you do not need us yet."
        secondary={{ label: "Read our perspectives", href: "/insights" }}
      />
    </div>
  );
}

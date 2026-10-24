import type { Metadata } from "next";
import { Heading, PageHero, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/HomeSections";
import { INDUSTRIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries · Cybaethrex",
  description:
    "Where our security consulting work concentrates: financial services, healthcare, SaaS, public sector, retail and industrial.",
};

export default function IndustriesPage() {
  const proven = INDUSTRIES.filter((i) => i.proven).length;

  return (
    <div className="relative">
      <PageHero
        eyebrow="Industries"
        title={
          <>
            Security problems rhyme.{" "}
            <span className="text-signal">Consequences do not.</span>
          </>
        }
        lede="The technical failure modes repeat across sectors. What changes is what happens next: who reports it, what it costs, and how long you have. These are the environments we know well enough to be useful quickly."
        meta={[
          { label: "Sectors", value: String(INDUSTRIES.length) },
          { label: "With published work", value: String(proven) },
          { label: "Lead practice", value: "AI Security" },
          { label: "Reach", value: "Global · remote-first" },
        ]}
      />

      {INDUSTRIES.map((ind, i) => (
        <Section
          key={ind.id}
          id={ind.id}
          index={String(i + 1).padStart(2, "0")}
          label={ind.name}
        >
          <Heading title={ind.lede} lede={ind.body} size="sm" />

          <Reveal className="mt-8">
            <ul className="flex flex-wrap gap-2.5">
              {ind.focus.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[12.5px] text-muted"
                >
                  {f}
                </li>
              ))}
              {ind.proven ? (
                <li className="mono rounded-full border border-signal/40 px-3.5 py-1.5 text-[10px] tracking-[0.14em] text-signal">
                  PUBLISHED CASE STUDY
                </li>
              ) : null}
            </ul>
          </Reveal>
        </Section>
      ))}

      <CTA
        title="Work in a sector we have not listed?"
        line2="The method transfers."
        body="The technical work is the same; the consequence model is what we would need to learn from you. That is a short conversation."
        secondary={{ label: "See our services", href: "/services" }}
      />
    </div>
  );
}

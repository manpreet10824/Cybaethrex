import type { Metadata } from "next";
import { EditorialRow, PageHero, Section, Heading } from "@/components/ui/Layout";
import { CTA } from "@/components/sections/HomeSections";
import { INSIGHTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights · Cybaethrex",
  description:
    "Positions on AI security, assurance, security engineering and how to buy security testing well.",
};

export default function InsightsPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Insights"
        title={
          <>
            What we think, <span className="text-signal">and why</span>.
          </>
        }
        lede="Positions we hold because of what the work keeps showing us. Arguments rather than announcements. Each one is something we would defend in a room with your engineers."
        meta={[
          { label: "Pieces", value: String(INSIGHTS.length) },
          { label: "Topics", value: "AI, assurance, engineering" },
          { label: "Cadence", value: "When we have something" },
          { label: "Author", value: "The practice" },
        ]}
      />

      <Section index="01" label="All pieces">
        <Heading
          title="Written by the people doing the work."
          lede="No ghostwritten thought leadership, no vendor talking points."
          size="sm"
        />
        <div className="mt-12">
          {INSIGHTS.map((a, i) => (
            <EditorialRow
              key={a.slug}
              index={String(i + 1).padStart(2, "0")}
              title={a.title}
              body={a.dek}
              meta={`${a.tag} · ${a.readingTime}`}
              href={`/insights/${a.slug}`}
            />
          ))}
        </div>
      </Section>

      <CTA
        title="Disagree with any of it?"
        line2="That is a useful conversation."
        body="These are positions, not doctrine. If your environment argues otherwise we would genuinely like to hear it."
        secondary={{ label: "See our services", href: "/services" }}
      />
    </div>
  );
}

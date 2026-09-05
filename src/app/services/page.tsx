import type { Metadata } from "next";
import {
  ArrowLink,
  Container,
  EditorialRow,
  Heading,
  PageHero,
  Section,
} from "@/components/ui/Layout";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/HomeSections";
import { UnifiedWheel } from "@/components/sections/UnifiedWheel";
import {
  FAMILY_NOTE,
  FAMILY_ORDER,
  TOTAL_SERVICES,
  byFamily,
} from "@/lib/services";
import { DELIVERABLES, ENGAGEMENT_MODELS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services · Cybaethrex",
  description:
    "Ten practices across assessment, engineering, build, governance and advisory: application and AI security, DevSecOps, software and dashboard development, ISO and privacy compliance, GRC and technology consulting.",
};

export default function ServicesPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Services"
        title={
          <>
            Everything we do, <span className="text-signal">in full</span>.
          </>
        }
        lede={`Ten practices and ${TOTAL_SERVICES} services, grouped by the order work actually happens: assess what is there, engineer what is missing, build what does not exist, govern it, then decide where it goes next.`}
        meta={[
          { label: "Practices", value: "10" },
          { label: "Services", value: String(TOTAL_SERVICES) },
          { label: "Lead practice", value: "AI & LLM Security" },
          { label: "Delivery", value: "Senior, direct" },
        ]}
      />

      {/* the wheel is this page's table of contents */}
      <UnifiedWheel />

      {FAMILY_ORDER.map((family, fi) => (
        <Section
          key={family}
          index={String(fi + 1).padStart(2, "0")}
          label={family}
          tone={fi % 2 === 1 ? "raised" : "default"}
        >
          <Heading title={FAMILY_NOTE[family]} size="sm" />

          <div className="mt-12 flex flex-col gap-14">
            {byFamily(family).map((c) => (
              <div key={c.id} id={c.id} className="scroll-mt-28">
                <Reveal>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="mono text-[11px] tracking-[0.2em] text-signal">
                      {c.n}
                    </span>
                    <h3 className="text-[22px] font-semibold tracking-tight text-ink">
                      {c.name}
                    </h3>
                    <span className="mono text-[10px] tracking-[0.14em] text-muted-dim">
                      {c.services.length} SERVICES
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] font-medium text-signal">
                    {c.promise}
                  </p>
                  <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
                    {c.intro}
                  </p>
                </Reveal>

                <RevealGroup
                  as="ul"
                  each={0.03}
                  className="mt-7 grid gap-x-8 gap-y-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 sm:gap-x-0"
                >
                  {c.services.map((s) => (
                    <Reveal key={s} as="li">
                      <div className="flex items-center gap-3 bg-surface/80 px-5 py-3.5">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-signal" />
                        <span className="text-[13.5px] text-muted">{s}</span>
                      </div>
                    </Reveal>
                  ))}
                </RevealGroup>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section index="06" label="Deliverables">
        <Heading
          title="What actually arrives."
          lede="An engagement that ends at a slide deck leaves you with an opinion. These are the artefacts every engagement produces."
        />
        <RevealGroup
          as="div"
          each={0.06}
          className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2"
        >
          {DELIVERABLES.map((d, i) => (
            <Reveal key={d.title}>
              <div className="flex gap-5">
                <span className="mono pt-1 text-[10px] tracking-[0.18em] text-muted-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] font-medium tracking-tight text-ink">
                    {d.title}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                    {d.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      <Section id="engage" index="07" label="Engagement models" tone="raised">
        <Heading
          title="Four ways to work with us."
          lede="Scope and commitment differ; the standard of delivery does not."
        />
        <div className="mt-12">
          {ENGAGEMENT_MODELS.map((m) => (
            <EditorialRow
              key={m.id}
              index={m.n}
              title={m.name}
              body={`${m.body} Right when ${m.fit.charAt(0).toLowerCase()}${m.fit.slice(1)}`}
              meta={m.shape}
            />
          ))}
        </div>
        <Reveal className="mt-10">
          <ArrowLink href="/contact">Talk through a scope</ArrowLink>
        </Reveal>
      </Section>

      <Container className="pb-4">
        <div className="h-px w-full bg-line" />
      </Container>

      <CTA
        title="Not sure which one you need?"
        line2="That is the first conversation."
        body="Describe the situation and we will tell you which practice fits, what it would take, and whether you need us at all."
        secondary={{ label: "Read our insights", href: "/insights" }}
      />
    </div>
  );
}

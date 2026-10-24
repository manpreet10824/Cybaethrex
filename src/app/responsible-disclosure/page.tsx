import type { Metadata } from "next";
import { Heading, PageHero, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/HomeSections";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Responsible disclosure · Cybaethrex",
  description:
    "How to report a security issue in Cybaethrex systems, what we commit to in return, and the safe harbour that applies to good-faith research.",
};

const COMMITMENTS = [
  {
    t: "Acknowledge within one business day",
    b: "You will get a human reply confirming receipt, not an automated ticket number.",
  },
  {
    t: "Triage within five business days",
    b: "We will tell you whether we can reproduce the issue, how we have rated it, and what we intend to do about it.",
  },
  {
    t: "Keep you informed until it is closed",
    b: "You will hear from us at each state change rather than having to chase for status.",
  },
  {
    t: "Credit you if you want it",
    b: "We will name you in the fix note, or keep you anonymous. Your choice, and we will ask explicitly.",
  },
];

const IN_SCOPE = [
  "cybaethrex.com and its subdomains",
  "Any service we operate that handles client or candidate data",
  "Our published tooling and code repositories",
];

const OUT_OF_SCOPE = [
  "Findings in client systems reached through our engagements. Report those to the client, or to us in confidence and we will route them",
  "Volumetric denial of service, or any test that degrades availability for others",
  "Social engineering of our people, suppliers or clients",
  "Reports generated solely by an automated scanner with no demonstrated impact",
  "Missing hardening headers or configuration weaknesses with no exploitable consequence",
];

export default function ResponsibleDisclosurePage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Responsible disclosure"
        title={
          <>
            Found something?{" "}
            <span className="text-signal">Tell us properly.</span>
          </>
        }
        lede="We test other organisations' systems for a living, so we hold our own to the standard we ask of clients. If you have found a security issue in anything we run, here is how to report it and what we owe you in return."
        meta={[
          { label: "Report to", value: CONTACT.emails[0] },
          { label: "Acknowledgement", value: "1 business day" },
          { label: "Triage", value: "5 business days" },
          { label: "Safe harbour", value: "Yes, in good faith" },
        ]}
      />

      <Section index="01" label="How to report">
        <Heading
          title="One email, with as much detail as you have."
          lede="No portal, no account, no bug bounty platform in the way."
          size="sm"
        />
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            Email{" "}
            <a
              href={`mailto:${CONTACT.emails[0]}`}
              className="link-underline text-signal"
            >
              {CONTACT.emails[0]}
            </a>{" "}
            with the affected URL or component, the steps to reproduce, and what
            an attacker could achieve. A short proof of concept helps more than a
            long description. If the issue is sensitive, say so in the first line
            and we will move to an encrypted channel before you send details.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Please give us a reasonable window to fix the issue before disclosing
            it publicly. We will agree a date with you rather than impose one, and
            we will not ask you to stay quiet indefinitely.
          </p>
        </Reveal>
      </Section>

      <Section index="02" label="What we commit to" tone="raised">
        <Heading title="Our side of the exchange." size="sm" />
        <div className="mt-10">
          {COMMITMENTS.map((c, i) => (
            <Reveal key={c.t}>
              <div className="flex gap-6 border-b border-line py-5 first:border-t">
                <span className="mono pt-1 text-[10px] tracking-[0.18em] text-muted-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] font-medium tracking-tight text-ink">
                    {c.t}
                  </p>
                  <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-muted">
                    {c.b}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section index="03" label="Scope">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">In scope</p>
            <ul className="flex flex-col gap-3">
              {IN_SCOPE.map((s) => (
                <li
                  key={s}
                  className="flex gap-3 text-[14px] leading-relaxed text-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="eyebrow mb-5">Out of scope</p>
            <ul className="flex flex-col gap-3">
              {OUT_OF_SCOPE.map((s) => (
                <li
                  key={s}
                  className="flex gap-3 text-[14px] leading-relaxed text-muted-dim"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[rgb(var(--rgb-hair)/0.5)]" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section index="04" label="Safe harbour" tone="raised">
        <Heading
          title="Research in good faith is welcome, not litigated."
          size="sm"
        />
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            If you follow this policy, act in good faith, avoid privacy
            violations and service degradation, and only interact with accounts
            you own or have explicit permission to test, we will not pursue or
            support legal action against you for your research.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            If a third party brings action against you for work carried out
            within this policy, tell us and we will make our position clear: that
            the research was authorised.
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-muted-dim">
            This policy covers systems Cybaethrex operates. It does not grant
            permission to test any client system, whether or not you believe we
            work with them.
          </p>
        </Reveal>
      </Section>

      <CTA
        eyebrow="Security contact"
        title="Reporting something urgent?"
        line2="Put URGENT in the subject."
        body={`Send it to ${CONTACT.emails[0]} and we will pick it up the same working day. If you need an encrypted channel, say so and we will arrange one before you send any details.`}
        primary={{
          label: "Email the security contact",
          href: `mailto:${CONTACT.emails[0]}`,
        }}
        secondary={{ label: "Back to home", href: "/" }}
      />
    </div>
  );
}

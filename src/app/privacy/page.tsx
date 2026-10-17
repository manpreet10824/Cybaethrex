import type { Metadata } from "next";
import Link from "next/link";
import { Heading, PageHero, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/HomeSections";
import { BRAND, CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy policy · Cybaethrex",
  description:
    "What Cybaethrex collects through this website and the Cybaethrex Publisher marketing app, how it is used and protected, and how to have it deleted.",
};

const UPDATED = "17 October 2026";

const APP_COLLECTS = [
  {
    t: "Account details",
    b: "The ID and name of each Facebook Page, Instagram, Google or TikTok account you connect, and the permissions you granted on the platform's sign-in screen.",
  },
  {
    t: "Access tokens",
    b: "The keys the platform issues so the app can act for the account. They are encrypted before they are stored and are never shown in the app.",
  },
  {
    t: "Content we publish",
    b: "The posts and ads created in the app, their approval history, and the ID the platform assigns to each published item.",
  },
  {
    t: "Results",
    b: "Views, reach, likes, comments, shares, clicks and ad spend for content published through the app, as the platform reports them.",
  },
  {
    t: "Team accounts",
    b: "For people who sign in to the app: name, email address, role, a hashed password and two-factor authentication settings.",
  },
];

const APP_USES = [
  "Publishing the posts and ads that an authorised person in your business has approved.",
  "Showing you how your published content and campaigns are performing.",
  "Suggesting improvements to campaigns. Nothing changes on a platform until a person approves it.",
  "Keeping the service secure, including a tamper-evident log of who approved and published what.",
];

const SHARED_WITH = [
  {
    t: "The platforms you connect",
    b: "Meta, Google and TikTok, to publish content and read its results.",
  },
  {
    t: "AI providers that help write content",
    b: "Anthropic (Claude) receives brand details, campaign goals and results summaries to draft content and recommendations. Google (Gemini) receives image and video descriptions to generate visuals. Access tokens are never sent to them.",
  },
  {
    t: "Hosting and delivery providers",
    b: "The cloud providers that run our services, and the service that delivers contact-form enquiries to our inbox.",
  },
  {
    t: "Authorities",
    b: "Only where the law requires it.",
  },
];

const RIGHTS = [
  "Disconnect an account at any time, in the app or in the platform's own settings.",
  "Ask for a copy of your information, or for it to be corrected or deleted. We reply within 30 days.",
  "Withdraw consent for anything that relies on it, without affecting what was done before.",
];

function Points({ items }: { items: { t: string; b: string }[] }) {
  return (
    <div className="mt-10">
      {items.map((c, i) => (
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
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((s) => (
        <li key={s} className="flex gap-3 text-[14px] leading-relaxed text-muted">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
          {s}
        </li>
      ))}
    </ul>
  );
}

const email = CONTACT.emails[0];
const mail = (
  <a href={`mailto:${email}`} className="link-underline text-signal">
    {email}
  </a>
);

export default function PrivacyPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Privacy policy"
        title={
          <>
            Your data, <span className="text-signal">kept to what we need.</span>
          </>
        }
        lede={`${BRAND.legalName} ("Cybaethrex", "we") runs this website and Cybaethrex Publisher, the app we use to plan, approve and publish marketing content for our own business and for client businesses that connect their social and advertising accounts. This policy covers both.`}
        meta={[
          { label: "Last updated", value: UPDATED },
          { label: "Contact", value: email },
          { label: "Requests answered", value: "Within 30 days" },
          { label: "Data sold", value: "Never" },
        ]}
      />

      <Section index="01" label="This website">
        <Heading
          title="The contact form, and nothing tracking you."
          lede="No analytics, no advertising pixels, no tracking cookies."
          size="sm"
        />
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            When you send an enquiry we receive your name, company, work email,
            the type of engagement you chose and your message. We use them only
            to reply and to discuss the work you asked about, and keep them for
            as long as that conversation or engagement needs.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Your browser remembers your theme and language choice on your own
            device. That preference is never sent to us.
          </p>
        </Reveal>
      </Section>

      <Section index="02" label="Cybaethrex Publisher" tone="raised">
        <Heading
          title="What the app receives when you connect an account."
          lede="Only what you allow on the platform's own sign-in screen. We do not collect the profiles of people who follow, like or comment on your Pages, and we do not read private messages."
          size="sm"
        />
        <Points items={APP_COLLECTS} />
      </Section>

      <Section index="03" label="How we use it">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">We use it for</p>
            <Bullets items={APP_USES} />
          </Reveal>
          <Reveal>
            <p className="eyebrow mb-5">We do not</p>
            <Bullets
              items={[
                "Sell your information, or share it for anyone else's advertising.",
                "Post or change anything on a platform without a person's approval.",
                "Send access tokens to AI providers or anyone outside the platform that issued them.",
              ]}
            />
          </Reveal>
        </div>
      </Section>

      <Section index="04" label="Who we share it with" tone="raised">
        <Heading title="A short, named list." size="sm" />
        <Points items={SHARED_WITH} />
      </Section>

      <Section index="05" label="Protection and retention">
        <Heading title="Encrypted, separated, and deleted on disconnect." size="sm" />
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            Access tokens are encrypted at rest. Signing in to the app needs a
            password and, for privileged roles, two-factor authentication. Each
            business&apos;s data is kept separate from every other
            business&apos;s, and every approval and publication is recorded in
            an audit log.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            We keep account details and tokens while an account stays connected.
            Disconnecting deletes the stored token and connection details.
            Published-content records, results and audit records are kept while
            you work with us, and afterwards only as long as security,
            accounting or legal obligations require.
          </p>
        </Reveal>
      </Section>

      <Section index="06" label="Your rights" tone="raised">
        <Heading title="Ask, and we act within 30 days." size="sm" />
        <Reveal className="mt-8 max-w-2xl">
          <Bullets items={RIGHTS} />
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Email {mail}, or follow our{" "}
            <Link href="/data-deletion" className="link-underline text-signal">
              data deletion instructions
            </Link>
            . Cybaethrex Publisher is a business tool and is not intended for
            anyone under 18. If we change this policy we update the date above
            and, for significant changes, tell connected businesses by email.
          </p>
        </Reveal>
      </Section>

      <CTA
        eyebrow="Privacy contact"
        title="A question about your data?"
        line2="Ask us directly."
        body={`Email ${email} and a person will reply ${CONTACT.responseTime}.`}
        primary={{ label: "Email us", href: `mailto:${email}` }}
        secondary={{ label: "Delete my data", href: "/data-deletion" }}
      />
    </div>
  );
}

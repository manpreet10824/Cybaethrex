import type { Metadata } from "next";
import Link from "next/link";
import { Heading, PageHero, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/HomeSections";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Data deletion · Cybaethrex",
  description:
    "How to remove Cybaethrex Publisher's access to your Facebook, Instagram, Google or TikTok account and have the data we hold about you deleted.",
};

const REMOVE = [
  {
    t: "In Cybaethrex Publisher",
    b: "An owner opens the brand, goes to Connections and clicks Disconnect. This deletes the stored access token and connection details and asks the platform to revoke the app's access.",
  },
  {
    t: "On Facebook",
    b: "Go to Settings & privacy → Settings → Business integrations, find Cybaethrex Publisher and click Remove. For Instagram, Google or TikTok, remove the app in that platform's connected-apps settings.",
  },
];

const DELETED = [
  "Connection details and any stored access tokens",
  "Drafts, published-content records and their results",
  "Images and videos generated for you",
  "Team sign-in accounts linked only to your business",
];

const KEPT = [
  "Records the law requires us to keep, such as invoices",
  "A minimal security log entry recording that the deletion took place",
  "Posts already published on your Page, until you delete them on the platform",
];

const email = CONTACT.emails[0];

export default function DataDeletionPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Data deletion"
        title={
          <>
            Remove access. <span className="text-signal">Delete the rest.</span>
          </>
        }
        lede="You can stop Cybaethrex Publisher from accessing your accounts at any time, and ask us to delete everything we hold about you."
        meta={[
          { label: "Request to", value: email },
          { label: "Deleted within", value: "30 days" },
          { label: "Confirmation", value: "By email" },
          { label: "Cost", value: "None" },
        ]}
      />

      <Section index="01" label="Remove the app's access">
        <Heading
          title="Either route stops access straight away."
          lede="Removing the app on Facebook stops access, but Facebook does not tell us automatically. To have your stored records deleted too, also send the request below."
          size="sm"
        />
        <div className="mt-10">
          {REMOVE.map((c, i) => (
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

      <Section index="02" label="Ask us to delete your data" tone="raised">
        <Heading title="One email." size="sm" />
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            Email{" "}
            <a href={`mailto:${email}?subject=Data%20deletion%20request`} className="link-underline text-signal">
              {email}
            </a>{" "}
            with the subject &ldquo;Data deletion request&rdquo;, the name of
            your business, Page or account, and the email address you used with
            us, if any. We may ask you to confirm that you manage the account
            before we delete anything.
          </p>
        </Reveal>
      </Section>

      <Section index="03" label="What happens">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">Deleted within 30 days</p>
            <ul className="flex flex-col gap-3">
              {DELETED.map((s) => (
                <li key={s} className="flex gap-3 text-[14px] leading-relaxed text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="eyebrow mb-5">Kept</p>
            <ul className="flex flex-col gap-3">
              {KEPT.map((s) => (
                <li key={s} className="flex gap-3 text-[14px] leading-relaxed text-muted-dim">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[rgb(var(--rgb-hair)/0.5)]" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="mt-10 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-muted">
            When the deletion is complete we email you a reference number you can
            quote if you have questions. The{" "}
            <Link href="/privacy" className="link-underline text-signal">
              privacy policy
            </Link>{" "}
            explains what we hold and why.
          </p>
        </Reveal>
      </Section>

      <CTA
        eyebrow="Data deletion"
        title="Ready to send a request?"
        line2="It takes one email."
        body={`Send it to ${email}. A person will reply ${CONTACT.responseTime}, and the deletion is complete within 30 days.`}
        primary={{
          label: "Email a deletion request",
          href: `mailto:${email}?subject=Data%20deletion%20request`,
        }}
        secondary={{ label: "Read the privacy policy", href: "/privacy" }}
      />
    </div>
  );
}

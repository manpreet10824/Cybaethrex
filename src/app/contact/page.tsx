import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact · Cybaethrex",
  description:
    "Enrol on a cohort, ask about a programme, or start a university partnership. Cybaethrex replies within one business day.",
};

const FACTS = [
  ["Fit call", "20 minutes with the person who teaches the programme"],
  ["Honest answer", "Which programme fits: or that none of them do yet"],
  ["Then", `A reply ${CONTACT.responseTime}, and a cohort date`],
];

export default function ContactPage() {
  return (
    <div className="relative min-h-[100svh] px-6 pb-28 pt-36 sm:px-10">
      <div
        className="field-grid pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(70%_50%_at_50%_20%,black,transparent)]"
        aria-hidden
      />
      <div className="mx-auto grid w-full max-w-[1100px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-10">
          <SectionHeading
            index="→"
            eyebrow="Contact"
            title="Start with where you are."
            lede="Enrolling, asking about a cohort date, or exploring a university partnership. It all starts the same way. Tell us the context and we will tell you honestly what fits."
          />

          <Reveal>
            <ul className="flex flex-col gap-px overflow-hidden rounded-lg border border-line bg-line">
              {FACTS.map(([k, v]) => (
                <li key={k} className="bg-surface/80 px-5 py-4">
                  <p className="mono text-[10px] tracking-[0.18em] text-signal">
                    {k}
                  </p>
                  <p className="mt-1.5 text-[13px] text-muted">{v}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface/60 p-5">
              <p className="eyebrow">Direct</p>
              {CONTACT.emails.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="link-underline w-fit text-[13.5px] text-muted transition-colors duration-200 hover:text-signal"
                >
                  {e}
                </a>
              ))}
              {CONTACT.phones.map((t) => (
                <a
                  key={t}
                  href={`tel:${t.replace(/\s/g, "")}`}
                  className="link-underline w-fit text-[13.5px] text-muted transition-colors duration-200 hover:text-signal"
                >
                  {t}
                </a>
              ))}
              <p className="mt-1 text-[12px] text-muted-dim">
                {CONTACT.location}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}

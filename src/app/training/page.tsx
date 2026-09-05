import type { Metadata } from "next";
import { TrainingHero } from "@/components/sections/TrainingHero";
import { Programmes } from "@/components/sections/Programmes";
import { Methodology } from "@/components/sections/Methodology";
import { Tooling } from "@/components/sections/Tooling";
import { Universities } from "@/components/sections/Universities";
import { TrainingFaq } from "@/components/sections/TrainingFaq";
import { CTA } from "@/components/sections/HomeSections";
import { SectionSeam } from "@/components/ui/Layout";
import { METHOD } from "@/lib/content.training";

export const metadata: Metadata = {
  title: "Cybaethrex Training · Cyber, Cloud & AI Security",
  description:
    "Professional, corporate and university training in AI security, cloud security and offensive security, taught by the practitioners who run the engagements.",
};

export default function TrainingPage() {
  return (
    <div className="relative">
      <div
        className="field-grid pointer-events-none fixed inset-0 -z-50 opacity-30 [mask-image:radial-gradient(80%_60%_at_50%_40%,black,transparent)]"
        aria-hidden
      />

      <TrainingHero />
      <Programmes />
      <SectionSeam />

      <Methodology
        id="method"
        index="04"
        eyebrow="How we teach"
        title="Learn. Practice. Apply. Achieve."
        lede="One continuous progression, not four disconnected modules. Each stage hands the next something real, and the last one hands you evidence."
        stages={METHOD}
      />

      <Tooling />
      <Universities />
      <TrainingFaq />
      <CTA
        eyebrow="Next cohort"
        title="Ready to build the capability?"
        line2="Let’s find the right programme."
        body="Tell us where your team is now and what they need to be able to do. We will tell you which programme fits: or honestly, if none of them do yet."
        primary={{ label: "Register your interest", href: "/contact" }}
        secondary={{ label: "See the programmes", href: "/training#programmes" }}
      />
    </div>
  );
}

import { HomeHero } from "@/components/sections/HomeHero";
import {
  Industries,
  Work,
  Research,
  Credibility,
  TrainingBridge,
  CTA,
} from "@/components/sections/HomeSections";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { Pillars } from "@/components/sections/Pillars";
import { AISecurity } from "@/components/sections/AISecurity";
import { AttackPath } from "@/components/sections/AttackPath";
import { Methodology } from "@/components/sections/Methodology";
import { Faq } from "@/components/sections/Faq";
import { ENGAGEMENT } from "@/lib/content";

/**
 * The numbered spine is generated, not typed. Hand-written indices had drifted
 * badly, 02 appeared twice and 05 three times, which undoes the one thing
 * the numbering exists for. Reordering the page now renumbers it for free.
 */
function spine() {
  let n = 0;
  return () => String(++n).padStart(2, "0");
}

export default function Home() {
  const next = spine();

  return (
    <div className="relative">
      <div
        className="field-grid pointer-events-none fixed inset-0 -z-50 opacity-25 [mask-image:radial-gradient(80%_60%_at_50%_40%,black,transparent)]"
        aria-hidden
      />

      <HomeHero />

      {/* who we are → what that covers → proof the method is real */}
      <Pillars index={next()} />
      <ServiceCards index={next()} />

      <AISecurity index={next()} />
      <AttackPath index={next()} />

      <Methodology
        id="method"
        index={next()}
        eyebrow="How we work"
        title="Assess. Advise. Architect. Assure."
        lede="One continuous engagement model. Each stage hands the next something real, and the last one hands you evidence."
        stages={ENGAGEMENT}
      />

      <Industries index={next()} />
      <Work index={next()} />
      <Research index={next()} />
      <Credibility index={next()} />
      <Faq index={next()} />

      <TrainingBridge />
      <CTA />
    </div>
  );
}

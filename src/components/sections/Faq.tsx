"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLink, Heading, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { FAQS, CONTACT } from "@/lib/content";
import { TRAINING_FAQS } from "@/lib/content.training";

function FaqBlock({
  id,
  index,
  label,
  title,
  lede,
  items,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  lede: string;
  items: { q: string; a: string }[];
}) {
  return (
    <Section id={id} index={index} label={label}>
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Heading title={title} lede={lede} size="sm" />
          <Reveal className="mt-8">
            <ArrowLink href="/contact" tone="muted">
              {CONTACT.emails[0]}
            </ArrowLink>
          </Reveal>
        </div>

        <Reveal>
          <Accordion
            defaultValue={[items[0].q]}
            className="w-full border-t border-line"
          >
            {items.map((f) => (
              <AccordionItem
                key={f.q}
                value={f.q}
                className="border-b border-line"
              >
                <AccordionTrigger className="rounded-none px-0 py-5 text-left text-[15px] font-medium tracking-tight transition-colors duration-200 hover:no-underline hover:text-signal aria-expanded:text-signal">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 pr-8 text-[13.5px] leading-relaxed text-muted">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

export function Faq({ index = "10" }: { index?: string }) {
  return (
    <FaqBlock
      id="faq"
      index={index}
      label="FAQ"
      title="The questions people actually ask."
      lede="If yours is not here, ask it directly: the first reply comes from a practitioner, not a sales desk."
      items={FAQS}
    />
  );
}

export function TrainingFaq() {
  return (
    <FaqBlock
      id="training-faq"
      index="07"
      label="FAQ"
      title="Before you enrol."
      lede="If yours is not here, ask it directly, the first reply comes from the person who teaches the programme."
      items={TRAINING_FAQS}
    />
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DUR, EASE_OUT, cineIn, stagger } from "@/lib/motion";
import { useMotionFlags } from "@/components/motion/MotionProfile";

const ENGAGEMENTS = [
  "AI Security Professional",
  "AWS Security Professional",
  "CEH preparation",
  "OSCP bootcamp",
  "AI in Cybersecurity",
  "University partnership",
  "Security assessment",
];

/** Cybaethrex field treatment over the shadcn primitive: same border, radius
 *  and focus colour as every other control on the site. */
const FIELD_CLASS =
  "h-auto w-full rounded-lg border border-line bg-surface/70 px-4 py-3 text-[14px] text-ink transition-colors duration-200 placeholder:text-muted-dim focus-visible:border-signal/60 focus-visible:ring-0 md:text-[14px]";

function Field({
  id,
  label,
  type = "text",
  required = false,
  textarea = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const shared = {
    id,
    name: id,
    required,
    autoComplete,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: FIELD_CLASS,
  };

  return (
    <div className="relative flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="mono text-[10px] tracking-[0.16em] transition-colors duration-200"
        style={{ color: focused ? "var(--signal)" : "var(--muted-dim)" }}
      >
        {label}
        {required ? <span className="text-threat"> *</span> : null}
      </Label>

      {textarea ? (
        <Textarea {...shared} rows={5} />
      ) : (
        <Input {...shared} type={type} />
      )}

      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-signal"
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: DUR.fast, ease: EASE_OUT }}
      />
    </div>
  );
}

export function ContactForm() {
  const { reduced } = useMotionFlags();
  const [sent, setSent] = useState(false);
  const [engagement, setEngagement] = useState<string[]>([ENGAGEMENTS[0]]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.normal, ease: EASE_OUT }}
            className="rounded-xl border border-signal/40 bg-signal/5 p-8"
          >
            <p className="mono flex items-center gap-2 text-[11px] tracking-[0.2em] text-signal">
              <ShieldCheck size={14} strokeWidth={1.6} aria-hidden />
              MESSAGE READY
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              This form is not wired to a backend yet.
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              Connect it to your inbox, CRM or ticketing system before going
              live, the submit handler is the only place that needs to change.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSent(false)}
              className="mt-6 h-auto rounded-full border-line-strong bg-transparent px-5 py-2.5 text-[12.5px] hover:border-signal hover:bg-transparent hover:text-signal"
            >
              Edit the message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={reduced ? undefined : stagger(0.07)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "show"}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: DUR.normal, ease: EASE_OUT }}
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <motion.div
              variants={reduced ? undefined : cineIn}
              className="grid gap-6 sm:grid-cols-2"
            >
              <Field id="name" label="Name" required autoComplete="name" />
              <Field id="company" label="Company" autoComplete="organization" />
            </motion.div>

            <motion.div variants={reduced ? undefined : cineIn}>
              <Field
                id="email"
                label="Work email"
                type="email"
                required
                autoComplete="email"
              />
            </motion.div>

            <motion.div
              variants={reduced ? undefined : cineIn}
              className="flex flex-col gap-3"
            >
              <Label
                htmlFor="engagement"
                className="mono text-[10px] tracking-[0.16em] text-muted-dim"
              >
                What do you need?
              </Label>
              <ToggleGroup
                id="engagement"
                multiple
                value={engagement}
                onValueChange={(v: string[]) => setEngagement(v)}
                className="flex flex-wrap gap-2 bg-transparent p-0"
                aria-label="Type of engagement"
              >
                {ENGAGEMENTS.map((e) => (
                  <ToggleGroupItem
                    key={e}
                    value={e}
                    className="h-auto rounded-full border border-line bg-transparent px-3.5 py-1.5 text-[12.5px] text-muted transition-colors duration-200 hover:bg-transparent hover:text-ink data-[pressed]:border-signal/50 data-[pressed]:bg-signal/10 data-[pressed]:text-signal"
                  >
                    {e}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </motion.div>

            <motion.div variants={reduced ? undefined : cineIn}>
              <Field
                id="context"
                label="Where are you now, and what are you aiming at?"
                textarea
                required
              />
            </motion.div>

            <motion.div
              variants={reduced ? undefined : cineIn}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                type="submit"
                className="group h-auto rounded-full px-7 py-3.5 text-[13px] font-medium hover:bg-[var(--signal-hover)]"
              >
                Send it over
                <ArrowRight
                  size={14}
                  strokeWidth={1.6}
                  className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
                  aria-hidden
                />
              </Button>
              <p className="text-[12px] text-muted-dim">
We reply within one business day. Your details stay confidential.
              </p>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

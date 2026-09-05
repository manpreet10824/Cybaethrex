"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { CONTACT } from "@/lib/content";
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
  invalid = false,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  autoComplete?: string;
  invalid?: boolean;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  const shared = {
    id,
    name: id,
    required,
    autoComplete,
    // shadcn's primitives carry their own aria-invalid treatment, which now
    // resolves to the brand threat colour, so no override is needed here
    "aria-invalid": invalid || undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: FIELD_CLASS,
  };

  return (
    <div className="relative flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="mono text-[10px] tracking-[0.16em] transition-colors duration-200"
        style={{
          color: invalid
            ? "var(--threat)"
            : focused
              ? "var(--signal)"
              : "var(--muted-dim)",
        }}
      >
        {label}
        {required ? <span className="text-threat"> *</span> : null}
        {hint ? (
          <span className="ml-2 tracking-normal text-muted-dim">{hint}</span>
        ) : null}
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

type Status = "idle" | "sending" | "sent" | "error";

/** Last resort when delivery fails: hand the reader their own draft back. */
function mailtoFallback(values: {
  name: string;
  company: string;
  email: string;
  engagement: string[];
  context: string;
}) {
  const subject = values.company
    ? `Enquiry: ${values.name} at ${values.company}`
    : `Enquiry: ${values.name}`;
  const body = [
    `Name: ${values.name}`,
    `Company: ${values.company || "-"}`,
    `Email: ${values.email}`,
    `Interested in: ${values.engagement.join(", ") || "-"}`,
    "",
    values.context,
  ].join("\n");
  return `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** What the server means by each field name, in the reader's terms. */
const FIELD_PROBLEM: Record<string, string> = {
  name: "add your name",
  email: "check the email address",
  context: "write at least a few words in the message",
  company: "shorten the company name",
};

export function ContactForm() {
  const { reduced } = useMotionFlags();
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState("");
  const [invalid, setInvalid] = useState<string[]>([]);
  const [fallback, setFallback] = useState("");
  const [engagement, setEngagement] = useState<string[]>([ENGAGEMENTS[0]]);

  const sent = status === "sent";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const data = new FormData(e.currentTarget);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      context: String(data.get("context") ?? "").trim(),
      engagement,
      website: String(data.get("website") ?? ""),
    };

    setStatus("sending");
    setProblem("");
    setInvalid([]);
    setFallback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setStatus("sent");
        return;
      }

      if (res.status === 422) {
        const payload = (await res
          .json()
          .catch(() => ({}))) as { fields?: string[] };
        const fields = payload.fields ?? [];
        setInvalid(fields);

        // Name the fields. "Some details did not look right" leaves the
        // reader to guess which of four it was, which is how this got
        // reported as a bug in the first place.
        const asks = fields
          .map((f) => FIELD_PROBLEM[f])
          .filter(Boolean) as string[];
        setProblem(
          asks.length
            ? `Please ${asks.length > 1 ? `${asks.slice(0, -1).join(", ")} and ${asks[asks.length - 1]}` : asks[0]}.`
            : "Some details did not look right.",
        );
      } else {
        setProblem(
          res.status === 429
            ? "That is several messages in a short time. Give it a few minutes, or email us directly."
            : "We could not deliver that just now.",
        );
        // not the reader's fault, so offer the route that does not depend on us
        setFallback(mailtoFallback(values));
      }
      setStatus("error");
    } catch {
      setProblem("We could not reach the server. Your connection may be down.");
      setFallback(mailtoFallback(values));
      setStatus("error");
    }
  }

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
              MESSAGE SENT
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              Thank you. It is with us.
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              A person reads every enquiry and replies {CONTACT.responseTime}.
              If it is urgent, {CONTACT.emails[0]} reaches the same inbox.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStatus("idle")}
              className="mt-6 h-auto rounded-full border-line-strong bg-transparent px-5 py-2.5 text-[12.5px] hover:border-signal hover:bg-transparent hover:text-signal"
            >
              Send another
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
            onSubmit={onSubmit}
          >
            {/* Honeypot. Off-screen rather than display:none, which some bots
                check for, and removed from the tab order and the a11y tree so
                no real person can reach it. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <motion.div
              variants={reduced ? undefined : cineIn}
              className="grid gap-6 sm:grid-cols-2"
            >
              <Field
                id="name"
                label="Name"
                required
                autoComplete="name"
                invalid={invalid.includes("name")}
              />
              <Field
                id="company"
                label="Company"
                autoComplete="organization"
                invalid={invalid.includes("company")}
              />
            </motion.div>

            <motion.div variants={reduced ? undefined : cineIn}>
              <Field
                id="email"
                label="Work email"
                type="email"
                required
                autoComplete="email"
                invalid={invalid.includes("email")}
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
                hint="a sentence is enough"
                invalid={invalid.includes("context")}
              />
            </motion.div>

            <motion.div
              variants={reduced ? undefined : cineIn}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                type="submit"
                disabled={status === "sending"}
                className="group h-auto rounded-full px-7 py-3.5 text-[13px] font-medium hover:bg-[var(--signal-hover)] disabled:opacity-70"
              >
                {status === "sending" ? "Sending" : "Send it over"}
                {status === "sending" ? (
                  <LoaderCircle
                    size={14}
                    strokeWidth={1.8}
                    className="animate-spin"
                    aria-hidden
                  />
                ) : (
                  <ArrowRight
                    size={14}
                    strokeWidth={1.6}
                    className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
                    aria-hidden
                  />
                )}
              </Button>
              <p className="text-[12px] text-muted-dim">
                We reply {CONTACT.responseTime}. Your details stay confidential.
              </p>
            </motion.div>

            {status === "error" ? (
              <div
                role="alert"
                className="rounded-xl border border-threat/40 bg-threat/5 p-5"
              >
                <p className="mono flex items-center gap-2 text-[11px] tracking-[0.2em] text-threat">
                  <TriangleAlert size={13} strokeWidth={1.8} aria-hidden />
                  NOT SENT
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink">
                  {problem}
                </p>
                {fallback ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    Nothing is lost.{" "}
                    <a
                      href={fallback}
                      className="font-medium text-signal underline underline-offset-4"
                    >
                      Open it in your email client
                    </a>{" "}
                    with everything you typed already filled in, or write to{" "}
                    {CONTACT.emails[0]}.
                  </p>
                ) : null}
              </div>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

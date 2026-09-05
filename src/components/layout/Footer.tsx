"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { BRAND, CONTACT } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";

const COLUMNS = [
  {
    title: "Services",
    links: [
      ["AI Security & AI Risk", "/services#ai-security"],
      ["Offensive Security & Testing", "/services#offensive"],
      ["Security Engineering", "/services#engineering"],
      ["Information Security & GRC", "/services#grc"],
      ["Technology Advisory", "/services#advisory"],
      ["All services", "/services"],
    ],
  },
  {
    title: "Firm",
    links: [
      ["About", "/about"],
      ["Industries", "/industries"],
      ["Insights", "/insights"],
      ["How we engage", "/services#engage"],
      ["Deliverables", "/services#deliverables"],
    ],
  },
  {
    title: "Training",
    links: [
      ["Cybaethrex Training", "/training"],
      ["Programmes", "/training#programmes"],
      ["Corporate training", "/training"],
      ["University programs", "/training#universities"],
    ],
  },
  {
    title: "Contact",
    links: [
      ["Start a conversation", "/contact"],
      ["Privacy policy", "/contact"],
      ["Terms of service", "/contact"],
      ["Responsible disclosure", "/responsible-disclosure"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg-deep">
      <div
        className="field-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-[1240px] px-6 py-16 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <Reveal>
            <Logo height={28} />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
              {BRAND.positioning} AI risk, governance and technology advisory,
              delivered by senior practitioners.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              {CONTACT.emails.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="link-underline inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-200 hover:text-signal"
                >
                  <Mail size={13} strokeWidth={1.6} aria-hidden />
                  {e}
                </a>
              ))}
              {CONTACT.phones.map((t) => (
                <a
                  key={t}
                  href={`tel:${t.replace(/\s/g, "")}`}
                  className="link-underline inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-200 hover:text-signal"
                >
                  <Phone size={13} strokeWidth={1.6} aria-hidden />
                  {t}
                </a>
              ))}
            </div>
          </Reveal>

          <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" each={0.07}>
            {COLUMNS.map((col) => (
              <Reveal key={col.title}>
                <p className="eyebrow mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="link-underline text-[13px] text-muted transition-colors duration-200 hover:text-ink"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </RevealGroup>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-[11px] tracking-[0.12em] text-muted-dim">
            © {new Date().getFullYear()} CYBAETHREX · {CONTACT.location.toUpperCase()}
          </p>
          <p className="mono text-[11px] tracking-[0.12em] text-muted-dim">
            ASSESS · ADVISE · ARCHITECT · ASSURE
          </p>
        </div>
      </div>
    </footer>
  );
}

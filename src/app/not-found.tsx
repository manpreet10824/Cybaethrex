import type { Metadata } from "next";
import { Container, ArrowLink } from "@/components/ui/Layout";
import { NAV } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found · Cybaethrex",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80svh] items-center py-32">
      <div
        className="field-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_50%_at_50%_40%,black,transparent)]"
        aria-hidden
      />
      <Container>
        <div className="grid gap-6 lg:grid-cols-[152px_1fr] lg:gap-14">
          <p className="mono text-[11px] tracking-[0.22em] text-signal lg:pt-3">
            404
          </p>
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2rem,4.2vw,3rem)] leading-[1.08]">
              That page does not exist.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-muted">
              The link may be out of date, or the page may have moved. Everything
              on the site is reachable from the routes below.
            </p>

            <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
              {[
                { href: "/", label: "Home" },
                ...NAV.map((g) => ({ href: g.href, label: g.label })),
                { href: "/training", label: "Training" },
                { href: "/contact", label: "Contact" },
              ].map(
                (l) => (
                  <li key={l.href} className="py-4">
                    <ArrowLink href={l.href} tone="muted">
                      {l.label}
                    </ArrowLink>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArrowLink, Container } from "@/components/ui/Layout";
import { CTA } from "@/components/sections/HomeSections";
import { INSIGHTS } from "@/lib/site";

export function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = INSIGHTS.find((x) => x.slug === slug);
  if (!a) return { title: "Insights · Cybaethrex" };
  return { title: `${a.title} · Cybaethrex`, description: a.dek };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = INSIGHTS.find((a) => a.slug === slug);
  if (!article) notFound();

  const others = INSIGHTS.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <div className="relative">
      <article className="relative pb-16 pt-36 lg:pt-44">
        <div className="field-grid absolute inset-0 -z-30 h-80 opacity-50" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-60 -z-10 h-32 bg-[linear-gradient(to_bottom,transparent,var(--bg))]"
          aria-hidden
        />

        <Container>
          <Link
            href="/insights"
            className="group inline-flex items-center gap-2 text-[12.5px] text-muted-dim transition-colors duration-200 hover:text-signal"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.6}
              className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[3px]"
              aria-hidden
            />
            All insights
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[168px_1fr] lg:gap-16">
            <div className="lg:pt-3">
              <p className="eyebrow">{article.tag}</p>
              <p className="mono mt-2 text-[10px] tracking-[0.16em] text-muted-dim">
                {article.readingTime}
              </p>
            </div>

            <div>
              <h1 className="max-w-3xl text-balance text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08]">
                {article.title}
              </h1>
              <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-muted">
                {article.dek}
              </p>

              <div className="mt-12 max-w-[68ch] border-t border-line pt-12">
                {article.body.map((para, i) => (
                  <p
                    key={i}
                    className="mb-6 text-[16px] leading-[1.75] text-ink/90 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="mt-14 border-t border-line pt-8">
                <p className="eyebrow mb-5">Continue</p>
                <div className="flex flex-col gap-4">
                  {others.map((o) => (
                    <ArrowLink key={o.slug} href={`/insights/${o.slug}`} tone="muted">
                      {o.title}
                    </ArrowLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </article>

      <CTA
        title="Want this applied to your environment?"
        line2="That is what an assessment is."
        body="The positions above come out of engagements. If any of them describe a problem you recognise, the next step is a scoping conversation."
        secondary={{ label: "Read more insights", href: "/insights" }}
      />
    </div>
  );
}

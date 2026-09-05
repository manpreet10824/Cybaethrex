import { SERVICE_CATEGORIES } from "./services";
import { INSIGHTS } from "./site";
import { PROGRAMMES } from "./content.training";

export type SearchGroup =
  | "Practices"
  | "Services"
  | "Insights"
  | "Training"
  | "Pages";

/** Groups render in this order, so the most decision-shaped results sit first. */
export const GROUP_ORDER: SearchGroup[] = [
  "Practices",
  "Services",
  "Insights",
  "Training",
  "Pages",
];

export type SearchEntry = {
  id: string;
  title: string;
  sub: string;
  href: string;
  group: SearchGroup;
  /** terms that should match but do not belong in the visible label */
  terms?: string;
};

const PAGES: SearchEntry[] = [
  { id: "p-services", group: "Pages", title: "Services", sub: "Ten practices in full", href: "/services", terms: "what we do capabilities offerings" },
  { id: "p-industries", group: "Pages", title: "Industries", sub: "Where the work concentrates", href: "/industries", terms: "sectors verticals fintech healthcare saas" },
  { id: "p-insights", group: "Pages", title: "Insights", sub: "What we think", href: "/insights", terms: "articles writing blog research" },
  { id: "p-about", group: "Pages", title: "About", sub: "Who we are, and how we work", href: "/about", terms: "company practice team" },
  { id: "p-training", group: "Pages", title: "Training", sub: "Programmes, labs and university work", href: "/training", terms: "courses learning academy" },
  { id: "p-contact", group: "Pages", title: "Contact", sub: "Start a conversation", href: "/contact", terms: "email enquiry get in touch scope quote" },
  { id: "p-engage", group: "Pages", title: "Engagement models", sub: "Four ways to work with us", href: "/services#engage", terms: "pricing retainer assessment programme commercial" },
  { id: "p-disclosure", group: "Pages", title: "Responsible disclosure", sub: "Report a security issue", href: "/responsible-disclosure", terms: "vulnerability report security.txt bug bounty" },
];

/**
 * The index is derived, never hand-maintained. Adding a service to the
 * catalogue puts it in search on the same commit.
 */
export const SEARCH_INDEX: SearchEntry[] = [
  ...SERVICE_CATEGORIES.map((c) => ({
    id: `c-${c.id}`,
    group: "Practices" as const,
    title: c.name,
    sub: c.promise,
    href: `/services#${c.id}`,
    terms: `${c.family} ${c.services.join(" ")}`,
  })),
  ...SERVICE_CATEGORIES.flatMap((c) =>
    c.services.map((s, i) => ({
      id: `s-${c.id}-${i}`,
      group: "Services" as const,
      title: s,
      sub: c.name,
      href: `/services#${c.id}`,
      terms: c.family,
    })),
  ),
  ...INSIGHTS.map((a) => ({
    id: `i-${a.slug}`,
    group: "Insights" as const,
    title: a.title,
    sub: a.dek,
    href: `/insights/${a.slug}`,
    terms: `${a.tag} ${a.readingTime}`,
  })),
  ...PROGRAMMES.map((p) => ({
    id: `t-${p.id}`,
    group: "Training" as const,
    title: p.name,
    sub: `${p.duration} · ${p.level}`,
    href: "/training#programmes",
    terms: `training course ${p.modules.join(" ")}`,
  })),
  ...PAGES,
];

const norm = (s: string) => s.toLowerCase().normalize("NFKD");

/**
 * Field-weighted scoring. A title match always outranks a body match, and a
 * match at a word boundary outranks one buried mid-word, so typing "api"
 * surfaces "API Security Testing" above "Rapid7"-style incidental hits.
 */
/** True when the token begins a word, without paying to escape it into a regex. */
function startsWord(hay: string, token: string): boolean {
  const WORD = /[a-z0-9]/;
  for (let i = hay.indexOf(token); i > -1; i = hay.indexOf(token, i + 1)) {
    if (i === 0 || !WORD.test(hay[i - 1])) return true;
  }
  return false;
}

function scoreOne(entry: SearchEntry, token: string): number {
  const title = norm(entry.title);
  if (title === token) return 120;
  if (title.startsWith(token)) return 90;
  if (startsWord(title, token)) return 70;
  if (title.includes(token)) return 45;
  if (norm(entry.sub).includes(token)) return 22;
  if (entry.terms && norm(entry.terms).includes(token)) return 12;
  return 0;
}

export function searchSite(query: string, limit = 24): SearchEntry[] {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  const hits: { entry: SearchEntry; score: number }[] = [];
  for (const entry of SEARCH_INDEX) {
    let total = 0;
    // every token must land somewhere, so "ai audit" cannot match on "ai" alone
    for (const t of tokens) {
      const s = scoreOne(entry, t);
      if (s === 0) {
        total = 0;
        break;
      }
      total += s;
    }
    if (total > 0) hits.push({ entry, score: total });
  }

  hits.sort(
    (a, b) =>
      b.score - a.score ||
      a.entry.title.length - b.entry.title.length ||
      GROUP_ORDER.indexOf(a.entry.group) - GROUP_ORDER.indexOf(b.entry.group),
  );
  return hits.slice(0, limit).map((h) => h.entry);
}

/** Shown before the reader has typed anything. */
export const SEARCH_SUGGESTIONS = [
  "AI security",
  "Penetration testing",
  "ISO 27001",
  "DevSecOps",
  "DPDP",
  "Dashboards",
];

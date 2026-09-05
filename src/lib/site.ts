/**
 * Structural content for the consulting practice: how the firm is organised,
 * how it is bought, what it hands over, and what it believes.
 *
 * Nothing here asserts a fact that cannot be defended: no client names, no
 * headcount, no awards, no invented metrics. Positions and offerings only.
 */

export type NavGroup = {
  label: string;
  href: string;
  viewAll: string;
  /** two-column panel, for groups with more than about six entries */
  wide?: boolean;
  items: { label: string; href: string; note?: string }[];
};

/**
 * Plain-language nav. Buyers do not search for "services", they ask what a
 * firm does, what it thinks and who it is. Each group opens onto its own
 * contents and ends in a link to the full page.
 */
export const NAV: NavGroup[] = [
  {
    label: "What we do",
    href: "/services",
    viewAll: "View all services",
    wide: true,
    items: [
      { label: "Application Security", href: "/services#application-security", note: "Web, mobile, API, pentest" },
      { label: "AI & LLM Security", href: "/services#ai-security", note: "Lead practice" },
      { label: "Security Architecture", href: "/services#security-architecture", note: "Design and roadmap" },
      { label: "DevSecOps & Engineering", href: "/services#devsecops", note: "Pipeline and automation" },
      { label: "Software Development", href: "/services#software-development", note: "Built secure by default" },
      { label: "Dashboards & Platforms", href: "/services#dashboards", note: "Posture made visible" },
      { label: "ISO & Compliance", href: "/services#iso-compliance", note: "27001, 42001, 27701" },
      { label: "Privacy & Data Protection", href: "/services#privacy", note: "DPDP and beyond" },
      { label: "GRC, Risk & Audit", href: "/services#grc-audit", note: "Evidence that holds" },
      { label: "Technology Consulting", href: "/services#advisory", note: "Strategy and transformation" },
    ],
  },
  {
    label: "What we think",
    href: "/insights",
    viewAll: "View all insights",
    items: [
      { label: "Your AI system is an architecture, not a model", href: "/insights/ai-is-an-architecture", note: "AI Security" },
      { label: "A finding is not a risk", href: "/insights/findings-are-not-risk", note: "Assurance" },
      { label: "Security outside the flow gets routed around", href: "/insights/security-in-the-flow", note: "Engineering" },
      { label: "How to buy security testing", href: "/insights/buying-security-testing", note: "Advisory" },
    ],
  },
  {
    label: "Who we are",
    href: "/about",
    viewAll: "About Cybaethrex",
    items: [
      { label: "The practice", href: "/about", note: "How we work, and why" },
      { label: "Industries", href: "/industries", note: "Where the work concentrates" },
      { label: "Selected work", href: "/#work", note: "What engagements produced" },
      { label: "Responsible disclosure", href: "/responsible-disclosure", note: "Report an issue" },
    ],
  },
];

/** How an engagement is bought. A firm without this reads like a freelancer. */
export const ENGAGEMENT_MODELS = [
  {
    id: "assessment",
    n: "01",
    name: "Assessment",
    shape: "Fixed scope · 2–6 weeks",
    body: "A defined question answered properly: an application, a cloud estate, an AI system, a control set. Scoped up front, priced up front, delivered with evidence.",
    fit: "You need to know where you stand before deciding anything else.",
  },
  {
    id: "programme",
    n: "02",
    name: "Programme",
    shape: "Multi-phase · 3–9 months",
    body: "Assessment through to design and validation, run as phases with decision points between them. You can stop at any phase boundary without stranding the work.",
    fit: "You have a known gap and need it closed, not just documented.",
  },
  {
    id: "retainer",
    n: "03",
    name: "Assurance retainer",
    shape: "Ongoing · quarterly cadence",
    body: "Recurring validation as the estate changes: release testing, drift review, new-service assessment and the evidence refresh your customers keep asking for.",
    fit: "You ship continuously and cannot re-prove security annually.",
  },
  {
    id: "fractional",
    n: "04",
    name: "Fractional security leadership",
    shape: "Embedded · monthly commitment",
    body: "Senior security ownership without a full-time hire: strategy, risk decisions, vendor and audit support, and the authority to say no on your behalf.",
    fit: "You need the judgement of a security leader before you need the headcount.",
  },
];

/** What actually arrives at the end. Concrete deliverables signal a real practice. */
export const DELIVERABLES = [
  {
    title: "Executive summary",
    body: "Two pages a board can read: what is exposed, what it would cost you, and the three decisions that matter.",
  },
  {
    title: "Attack-path narratives",
    body: "Each significant finding written as a chain: entry point, pivot, impact, so the consequence is legible without a security background.",
  },
  {
    title: "Technical findings",
    body: "Reproduction steps, evidence, affected components and root cause. Written for the engineer who has to fix it.",
  },
  {
    title: "Prioritised remediation plan",
    body: "Ordered by consequence and effort, with owners, dependencies and the design-level fixes that close whole classes of issue.",
  },
  {
    title: "Framework mapping",
    body: "Findings mapped to ISO 27001, NIST CSF, NIST 800-53, the EU AI Act or ISO/IEC 42001, whichever your auditors and customers ask about.",
  },
  {
    title: "Retest and evidence pack",
    body: "Verification that the fix holds, packaged for customer security reviews, regulators and audit committees.",
  },
];

/**
 * Sectors where the work concentrates. The three carrying a case study are
 * marked: the rest describe capability, not claimed client history.
 */
export const INDUSTRIES = [
  {
    id: "financial",
    name: "Financial services",
    proven: true,
    lede: "Regulated, integrated and attacked constantly.",
    body: "Payment flows, partner APIs and tenant boundaries where an authorisation flaw becomes a reportable incident. Work here is shaped by regulatory expectation as much as by threat.",
    focus: ["API & authorisation testing", "Third-party risk", "Regulatory evidence"],
  },
  {
    id: "healthcare",
    name: "Healthcare & life sciences",
    proven: true,
    lede: "Clinical systems and models that affect care.",
    body: "Patient data, clinical platforms and increasingly ML models entering clinical pathways with no adversarial testing in their assurance plan.",
    focus: ["Clinical AI assurance", "Data protection", "Segmentation review"],
  },
  {
    id: "saas",
    name: "SaaS & technology",
    proven: true,
    lede: "Your security posture is a sales dependency.",
    body: "Multi-tenant isolation, rapid release cycles and customer security reviews that stall deals. Security has to keep pace with deployment, not gate it.",
    focus: ["Multi-tenant isolation", "Secure SDLC", "Customer review support"],
  },
  {
    id: "public",
    name: "Public sector",
    proven: false,
    lede: "Scrutiny, legacy and obligation together.",
    body: "Long-lived systems, layered accountability and a low tolerance for unexplained risk. The work is as much about defensible decisions as technical findings.",
    focus: ["Control assurance", "Legacy risk", "Governance"],
  },
  {
    id: "retail",
    name: "Retail & e-commerce",
    proven: false,
    lede: "High volume, thin margins, hostile traffic.",
    body: "Payment paths, account takeover, automated abuse and a peak trading window where nothing can be taken offline to be fixed.",
    focus: ["Fraud & abuse paths", "Payment security", "Peak readiness"],
  },
  {
    id: "industrial",
    name: "Manufacturing & industrial",
    proven: false,
    lede: "Where IT decisions reach physical process.",
    body: "Converged IT and operational technology, remote access to plant, and suppliers with deeper network reach than anyone documented.",
    focus: ["IT/OT boundaries", "Remote access", "Supplier risk"],
  },
];

/** The firm's stated positions. Opinions, argued, not news. */
export const INSIGHTS = [
  {
    slug: "ai-is-an-architecture",
    tag: "AI Security",
    title: "Your AI system is an architecture, not a model",
    dek: "Most AI security effort is aimed at the model. Almost every real failure we see happens somewhere else in the chain.",
    readingTime: "6 min",
    body: [
      "Ask an organisation how they secure their AI and you will usually hear about the model: which one, hosted where, with what guardrails. It is the wrong unit of analysis. The model is one component in a system that also contains an application, a retrieval pipeline, a set of tools, an agent loop and, at the end of it, production data.",
      "Compromise rarely requires touching the model at all. A document lands in the retrieval corpus carrying instructions. The agent reads it as content, acts on it as direction, and calls a tool it was legitimately granted. Nothing was jailbroken. Every component behaved exactly as designed.",
      "This is why we assess AI as an architecture. The questions that matter are structural: what can reach the retrieval layer, what can the agent invoke without a human, what scope did the MCP server inherit, and what data sits inside the blast radius when all of it behaves normally.",
      "The practical consequence is that guardrails at the model boundary are necessary and insufficient. The controls that hold are the boring architectural ones: scoped tool permissions, provenance on retrieved content, human approval on high-impact actions, and a data boundary you can actually point at.",
    ],
  },
  {
    slug: "findings-are-not-risk",
    tag: "Assurance",
    title: "A finding is not a risk",
    dek: "Severity labels describe a vulnerability. They say almost nothing about what it would cost you.",
    readingTime: "5 min",
    body: [
      "A report arrives with forty findings: six critical, eleven high. The security team works top-down. Six months later the same report arrives with a similar distribution, and nobody can say whether the organisation is safer.",
      "The problem is that severity is a property of a vulnerability in isolation. Risk is a property of a chain: what an attacker can reach from where they start, and what happens to the business when they get there. A medium-severity issue on the path to customer data outranks a critical on a system nobody can route to.",
      "We write findings as paths for this reason. Entry point, pivot, consequence. It changes the conversation from a queue of tickets into a small number of decisions, and it usually reveals that closing one design-level weakness collapses a dozen individual findings at once.",
      "It also survives contact with leadership. A board cannot act on 'eleven high'. It can act on 'an unauthenticated route reaches customer records in three steps, and here is what closing it costs'.",
    ],
  },
  {
    slug: "security-in-the-flow",
    tag: "Engineering",
    title: "Security that lives outside the flow gets routed around",
    dek: "If the secure path is slower than the insecure one, engineers will find the insecure one. Every time.",
    readingTime: "5 min",
    body: [
      "Most security programmes fail quietly. Not through a breach, but through erosion: a gate is added, it slows delivery, teams learn the exception process, and within two quarters the control exists on paper and nowhere else.",
      "The fix is not more enforcement. It is placing the control where the work already happens: in the pull request, in the pipeline, in the design review that was going to occur anyway. A check that runs in CI and fails with an actionable message is worth more than a policy nobody reads.",
      "This is also why we treat security dashboards as an engineering deliverable rather than a reporting afterthought. If a team cannot see its own posture without asking someone, it will not manage it. If leadership cannot see trend rather than snapshot, it will fund the wrong thing.",
      "The test is simple: is the secure path the path of least resistance? If not, the programme is running on goodwill, and goodwill is not a control.",
    ],
  },
  {
    slug: "buying-security-testing",
    tag: "Advisory",
    title: "How to buy security testing without wasting the budget",
    dek: "The scoping conversation determines the value of the engagement more than the testing does.",
    readingTime: "6 min",
    body: [
      "Two organisations buy the same number of testing days. One receives a document that gets filed. The other closes a class of issues and can prove it to a customer. The difference is almost always established before any testing begins.",
      "Scope by objective, not by asset count. 'Test these forty hosts' produces coverage. 'Establish whether an external attacker can reach customer data, and how' produces a decision. The second framing costs the same and is worth considerably more.",
      "Insist on knowing who does the work. In much of the industry the person who scopes the engagement is not the person who delivers it, and quality varies accordingly. Ask directly, and ask what happens if the tester finds something outside scope.",
      "Finally, buy the retest. An engagement that ends at the report leaves you with an opinion. An engagement that ends at verified closure leaves you with evidence: and evidence is the thing your customers, auditors and regulators are actually asking for.",
    ],
  },
];

/** How the practice is run. No invented biography. */
export const PRACTICE = {
  model: [
    {
      title: "Founder-led delivery",
      body: "The person who scopes an engagement delivers it. There is no handoff to a junior bench after signature, and no template report waiting to be populated.",
    },
    {
      title: "Deliberately small",
      body: "Capacity is capped so that senior attention is the default rather than an upgrade. We turn work away rather than staff it thinly.",
    },
    {
      title: "Ethics before commercials",
      body: "Cyber, Aethics, Rex. We will tell you when a control is adequate, when an engagement is unnecessary, and when the honest answer is that you do not need us yet.",
    },
    {
      title: "Practice keeps teaching honest",
      body: "The consulting work is what keeps the training current, and the training is what forces the practice to explain itself clearly. Neither would be as good alone.",
    },
  ],
  principles: [
    "Scope by objective, not by asset count",
    "Write findings as paths, not as inventory",
    "Fix at root cause, not at symptom",
    "End every engagement in evidence",
  ],
};

/**
 * The signature attack-path visualisation. Escalation is the story, so each
 * step carries what it grants, not just what it is, the impact levels are what
 * turn a technical chain into a business argument.
 */
export type PathStep = {
  n: string;
  stage: string;
  name: string;
  detail: string;
  meaning: string;
  /** 1–5 per dimension, monotonically escalating down the chain */
  impact: { access: number; blast: number; cost: number };
};

export const ATTACK_PATH: PathStep[] = [
  {
    n: "01",
    stage: "Entry",
    name: "Attacker",
    detail: "Unauthenticated, internet-based",
    meaning:
      "No credentials, no prior access, no insider. Everything that follows is earned from a standing start, which is what makes the chain worth taking seriously.",
    impact: { access: 1, blast: 1, cost: 1 },
  },
  {
    n: "02",
    stage: "Exposure",
    name: "Public API",
    detail: "Undocumented v1 route still reachable",
    meaning:
      "A deprecated endpoint nobody owns is still routed, still authenticating, and absent from the asset inventory the security team works from.",
    impact: { access: 2, blast: 1, cost: 1 },
  },
  {
    n: "03",
    stage: "Vulnerability",
    name: "Broken authorization",
    detail: "Object ID accepted without ownership check",
    meaning:
      "Any authenticated user can read any object by changing an identifier. Individually this scores medium. In this chain it is the hinge everything turns on.",
    impact: { access: 3, blast: 3, cost: 3 },
  },
  {
    n: "04",
    stage: "Pivot",
    name: "Internal service",
    detail: "Trusted network call, no second check",
    meaning:
      "The internal service trusts the caller because the call came from inside the perimeter. The perimeter stopped being a boundary two steps ago.",
    impact: { access: 4, blast: 4, cost: 3 },
  },
  {
    n: "05",
    stage: "Privilege",
    name: "Cloud role",
    detail: "Service identity scoped far too widely",
    meaning:
      "The workload's role can read every bucket in the account rather than the one it needs. Convenience at provisioning time becomes blast radius at breach time.",
    impact: { access: 5, blast: 5, cost: 4 },
  },
  {
    n: "06",
    stage: "Objective",
    name: "Crown jewel",
    detail: "Customer data store, fully readable",
    meaning:
      "The full customer dataset, readable and exfiltratable without a single alert firing. This is the number that appears in the breach notification.",
    impact: { access: 5, blast: 5, cost: 5 },
  },
];

export const IMPACT_DIMENSIONS = [
  { key: "access", label: "Access" },
  { key: "blast", label: "Blast radius" },
  { key: "cost", label: "Business cost" },
] as const;

/**
 * The wheel mirrors the catalogue: five families inside, their categories
 * outside. `short` is used by the compact phone wheel, where a segment gives a
 * label roughly 11 characters of arc before it collides with its neighbour.
 */
export const WHEEL = [
  {
    id: "assess",
    name: "ASSESS",
    services: [
      { full: "AppSec", short: "AppSec" },
      { full: "AI & LLM", short: "AI & LLM" },
    ],
  },
  {
    id: "engineer",
    name: "ENGINEER",
    services: [
      { full: "Architecture", short: "Arch." },
      { full: "DevSecOps", short: "DevSecOps" },
    ],
  },
  {
    id: "build",
    name: "BUILD",
    services: [
      { full: "Software", short: "Software" },
      { full: "Dashboards", short: "Dashboards" },
    ],
  },
  {
    id: "govern",
    name: "GOVERN",
    services: [
      { full: "ISO 27001", short: "ISO" },
      { full: "Privacy", short: "Privacy" },
      { full: "GRC & Audit", short: "GRC" },
    ],
  },
  {
    id: "advise",
    name: "ADVISE",
    services: [{ full: "Technology Consulting", short: "Consulting" }],
  },
];

/**
 * Established positions from repeated engagements. Claims we will defend,
 * never an unmeasured statistic.
 */
export const RESEARCH = [
  {
    id: "agent-trust",
    area: "Agent & MCP trust",
    claim: "An agent's real authority is always wider than its operator believes.",
    body: "Permission scope compounds across tool servers. We map effective authority rather than declared authority, because the gap between the two is where agent compromise actually happens.",
    proof: "Assessed on every AI engagement",
  },
  {
    id: "retrieval",
    area: "Retrieval integrity",
    claim: "Retrieved content is executable text, and most pipelines treat it as data.",
    body: "We test RAG against an attacker who can write to the corpus, because that is the only threat model that matters once retrieval sits in the loop. Provenance and isolation hold. Output filtering does not.",
    proof: "Standard scope in LLM testing",
  },
  {
    id: "privilege-paths",
    area: "Cloud privilege paths",
    claim: "The route from build pipeline to production data is usually three steps.",
    body: "The same role-assumption chains recur across estates because the same provisioning habits do. We look for them first, which is why cloud assessments close faster than teams expect.",
    proof: "Found in most multi-account estates",
  },
  {
    id: "evidence",
    area: "Assurance & evidence",
    claim: "Most penetration-test reports fail a customer security review.",
    body: "Auditors, enterprise buyers and regulators each accept different evidence. We write to all three from the first day of an engagement, which is why our reports survive procurement instead of triggering another round.",
    proof: "Built into every deliverable",
  },
];

/** The plain answer to "what are you". */
export const IDENTITY = {
  what: {
    label: "What we are",
    body: "A specialist security consulting practice: not a reseller, not a managed service, not a body shop. Senior practitioners who assess, advise, architect and assure, with AI security as the lead discipline.",
  },
  do: {
    label: "What we do",
    body: "We establish what an adversary can actually reach in your systems, translate it into decisions with costs attached, design the fix at root cause, and produce the evidence that proves it holds.",
  },
  notDo: {
    label: "What we do not do",
    body: "We do not sell tooling, staff long-term augmentation, or run your security operations. When an engagement is unnecessary, we say so, which is why the scoping call is free and technical.",
  },
};

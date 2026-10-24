/**
 * Content for the consulting business, the primary narrative.
 *
 * Training lives in `content.training.ts` and is reached only through the
 * single bridge band on the homepage and the Training nav item.
 */

export const BRAND = {
  name: "Cybaethrex",
  /** Cyber + Aethics + Rex */
  etymology: ["Cyber", "Aethics", "Rex"],
  tagline: "Cybersecurity consulting",
  positioning: "Cybersecurity consulting for a changing technology landscape.",
};

export const CONTACT = {
  emails: ["support@cybaethrex.com", "info@cybaethrex.com"],
  phones: ["+44 7874 042225", "+91 95821 11194"],
  location: "Global · remote-first",
  responseTime: "within one business day",
};

export const CERTIFICATIONS = [
  "AIGP",
  "AAISM",
  "CISSP",
  "CCSP",
  "CISM",
  "CEH",
  "CCNP Security",
  "AWS Security Specialty",
  "Azure Security",
];

export const PROOF = [
  {
    value: "9+",
    label: "Certifications held",
    note: "AIGP, AAISM, CISSP, CCSP, CISM",
  },
  {
    value: "AI-first",
    label: "Lead practice",
    note: "LLM, RAG, agents and MCP",
  },
  {
    value: "Direct",
    label: "Senior delivery",
    note: "No handoff to a junior bench",
  },
  {
    value: "Evidence",
    label: "Every engagement ends in it",
    note: "Audit and customer-review ready",
  },
];

export type Pillar = {
  id: string;
  n: string;
  name: string;
  promise: string;
  intro: string;
  services: { title: string; body: string }[];
  cta: string;
};

export const PILLARS: Pillar[] = [
  {
    id: "ai-security",
    n: "01",
    name: "AI Security & AI Risk",
    promise: "Secure AI before it becomes business risk.",
    intro:
      "We help organizations assess, govern, architect and secure AI systems across the full lifecycle, from LLM applications and RAG pipelines to autonomous agents and enterprise AI platforms.",
    services: [
      {
        title: "AI Risk Management",
        body: "Identify, assess and manage risks introduced by AI adoption, deployment and autonomous decision-making.",
      },
      {
        title: "LLM & Generative AI Security",
        body: "Assess LLM applications for prompt injection, data exposure, model abuse, insecure integrations and emerging AI attack vectors.",
      },
      {
        title: "AI Application Security",
        body: "Secure applications that integrate AI models, APIs, tools, plugins and enterprise data.",
      },
      {
        title: "RAG & AI Agent Security",
        body: "Assess retrieval pipelines, agent workflows, tool execution, permissions and data boundaries for AI-driven applications.",
      },
      {
        title: "AI Security Architecture",
        body: "Design security controls and reference architectures for enterprise AI platforms and AI-enabled applications.",
      },
      {
        title: "AI Governance & Regulatory Advisory",
        body: "Prepare AI programs against frameworks and regulations including EU AI Act, NIST AI RMF and ISO/IEC 42001.",
      },
    ],
    cta: "Discuss your AI security strategy",
  },
  {
    id: "offensive",
    n: "02",
    name: "Offensive Security & Testing",
    promise: "Find it before someone else does.",
    intro:
      "Adversary-led testing across applications, APIs, networks and cloud: delivered as attack paths with business consequence attached, not a scanner export with severity labels.",
    services: [
      {
        title: "Application Security Testing",
        body: "Web, API and mobile applications tested by hand for business-logic, authorisation and session flaws that automated tooling cannot reach.",
      },
      {
        title: "Vulnerability Assessment & Penetration Testing (VAPT)",
        body: "Structured assessment and exploitation across networks, hosts and cloud estates, prioritised by what an attacker can actually reach.",
      },
      {
        title: "Network & Infrastructure Penetration Testing",
        body: "External and internal testing of perimeter, hosts, segmentation and the lateral movement between them.",
      },
      {
        title: "Red Teaming & Adversary Simulation",
        body: "Objective-based engagements run against your real detection and response capability, the way a motivated adversary would run them.",
      },
      {
        title: "Cloud Penetration Testing",
        body: "AWS, Azure and GCP estates tested for identity paths, exposed services, key material and blast radius.",
      },
      {
        title: "Purple Teaming",
        body: "Joint exercises that convert each finding into a detection your security operations team keeps and can re-run.",
      },
    ],
    cta: "Scope a test",
  },
  {
    id: "engineering",
    n: "03",
    name: "Security Engineering & Enablement",
    promise: "Build security into the flow, not on top of it.",
    intro:
      "We work inside the delivery process: design, code, pipeline, release and the reporting layer above it, so security becomes part of how software ships rather than a gate at the end.",
    services: [
      {
        title: "Secure SDLC Design",
        body: "Embed security into design review, code review, CI/CD and release so issues surface while they are still cheap to fix.",
      },
      {
        title: "DevSecOps Pipeline Integration",
        body: "Automated application, dependency, container and secrets scanning wired into the pipelines your engineers already use.",
      },
      {
        title: "Security Dashboards & Metrics",
        body: "Design the reporting layer: posture, coverage, risk and remediation trend lines that leadership can actually act on.",
      },
      {
        title: "Detection Engineering",
        body: "Build and tune detections against the behaviour that matters, then validate them with real adversary technique.",
      },
      {
        title: "Secure Architecture & Design Review",
        body: "Threat modelling and design-level review before code is written, where the expensive findings are cheapest to close.",
      },
      {
        title: "Security Tooling Rationalisation",
        body: "Consolidate overlapping tools around the outcomes you need, and retire what is only generating noise.",
      },
    ],
    cta: "Design your security flow",
  },
  {
    id: "grc",
    n: "04",
    name: "Information Security & GRC",
    promise:
      "Turn security requirements into a program the business can actually operate.",
    intro:
      "We help organizations establish security governance, manage information-security risk and prepare for regulatory, customer and audit requirements.",
    services: [
      {
        title: "Information Security Risk Management",
        body: "Identify, assess and prioritize information-security risks based on business impact.",
      },
      {
        title: "ISO 27001 Advisory & Implementation",
        body: "Build and strengthen an information-security management system aligned with ISO 27001 requirements.",
      },
      {
        title: "NIST CSF & NIST 800-53 Alignment",
        body: "Assess security programs against established NIST frameworks and identify practical improvement opportunities.",
      },
      {
        title: "Privacy & Data Protection Advisory",
        body: "Strengthen controls around sensitive data, privacy obligations and data protection practices.",
      },
      {
        title: "Third-Party Risk Management",
        body: "Assess and manage security risks introduced by vendors, partners and technology providers.",
      },
      {
        title: "Security Governance",
        body: "Establish policies, processes, accountability and security operating models that scale with the organization.",
      },
      {
        title: "Audit & Compliance Readiness",
        body: "Identify control gaps and prepare teams for internal, customer, regulatory and certification assessments.",
      },
    ],
    cta: "Assess your security program",
  },
  {
    id: "advisory",
    n: "05",
    name: "Technology & Security Advisory",
    promise:
      "Make security part of the technology strategy, not an afterthought.",
    intro:
      "We work with technology and security leaders to evaluate architectures, define security roadmaps and transform security programs around real business and technology priorities.",
    services: [
      {
        title: "Security Strategy & Roadmap",
        body: "Define a practical security roadmap aligned with business objectives, technology priorities and risk.",
      },
      {
        title: "Technology Risk Advisory",
        body: "Identify security and technology risks across platforms, applications, infrastructure and emerging technologies.",
      },
      {
        title: "Security Transformation",
        body: "Modernize security capabilities, processes and operating models to support a changing technology landscape.",
      },
      {
        title: "Architecture Review",
        body: "Evaluate application, cloud, infrastructure and security architectures to identify design-level risks and improvement opportunities.",
      },
      {
        title: "Security Program Development",
        body: "Build structured security programs across people, processes, technology and governance.",
      },
      {
        title: "Security Awareness Program Design",
        body: "Develop role-based security awareness programs that help teams recognize and respond to security risks.",
      },
    ],
    cta: "Build your roadmap",
  },
];

/** Consulting engagement model, the homepage's four-stage timeline. */
export const ENGAGEMENT = [
  {
    n: "01",
    title: "ASSESS",
    lede: "Establish the real picture",
    body: "Systems, exposure, ownership and business impact, mapped as they actually are rather than as the architecture diagram claims. Nothing useful follows from a scope built on assumptions.",
    points: [
      "Attack surface and asset discovery",
      "Trust boundaries and privilege paths",
      "Impact framed in business terms",
    ],
  },
  {
    n: "02",
    title: "ADVISE",
    lede: "Turn findings into decisions",
    body: "Findings ranked by consequence rather than severity label, with trade-offs made explicit. Leadership gets a small number of decisions to make, each with a cost and a reason.",
    points: [
      "Prioritised, costed remediation",
      "Board and regulator-ready framing",
      "Clear ownership per decision",
    ],
  },
  {
    n: "03",
    title: "ARCHITECT",
    lede: "Design what closes the gap",
    body: "Reference architectures, control design and the operating model that keeps them working after we leave. Design-level fixes close classes of issues rather than individual tickets.",
    points: [
      "Reference architectures and control design",
      "Policy, process and accountability",
      "Built to be run by your team",
    ],
  },
  {
    n: "04",
    title: "ASSURE",
    lede: "Prove it holds",
    body: "Validation that the change worked, documented to a standard that survives a customer security review, a regulator or an audit committee.",
    points: [
      "Targeted retesting and verification",
      "Evidence packs for audit and customers",
      "Ongoing assurance cadence",
    ],
  },
];

/** Standards the practice aligns to. */
export const FRAMEWORKS = [
  { name: "EU AI Act", note: "AI regulatory readiness" },
  { name: "NIST AI RMF", note: "AI risk management" },
  { name: "ISO/IEC 42001", note: "AI management systems" },
  { name: "ISO 27001", note: "Information security management" },
  { name: "NIST CSF", note: "Program benchmarking" },
  { name: "NIST 800-53", note: "Control baselines" },
  { name: "GDPR", note: "Privacy and data protection" },
  { name: "OWASP LLM Top 10", note: "AI failure classes" },
];

export const TRAINING_BRIDGE = {
  eyebrow: "Cybaethrex Training",
  title: "Need to build your team's security capabilities?",
  body: "Cybaethrex Training delivers professional, corporate and university programs in AI security, cloud security and offensive security, taught by the same practitioners who run the engagements.",
  cta: "Explore Cybaethrex Training",
};

export const CASES = [
  {
    sector: "Multi-cloud",
    scope: "Cloud security",
    metric: "89 findings",
    metricNote: "misconfigurations closed across AWS and Azure",
    challenge:
      "Two clouds grown separately, with no shared view of identity, exposure or blast radius.",
    approach:
      "We reviewed both estates against the privilege paths that actually reach data, rather than auditing settings in isolation.",
    outcome:
      "Eighty-nine misconfigurations remediated and a single posture baseline the team could keep enforcing after we left.",
  },
  {
    sector: "Healthcare",
    scope: "AI security",
    metric: "Adversarial",
    metricNote: "vulnerabilities found in a clinical ML model",
    challenge:
      "A healthcare AI system heading toward clinical use with no adversarial testing in its assurance plan.",
    approach:
      "We tested the model the way an attacker would: crafted inputs, boundary probing and the data pipeline feeding it.",
    outcome:
      "Adversarial weaknesses identified and documented before deployment, with retraining and input-validation guidance.",
  },
  {
    sector: "Incident response",
    scope: "Containment",
    metric: "2 hours",
    metricNote: "to containment, 100% of data recovered",
    challenge:
      "Live ransomware with encryption already spreading across shared infrastructure.",
    approach:
      "Containment first, forensics second: isolate propagation paths, then establish entry point and dwell time.",
    outcome:
      "Contained inside two hours with full data recovery, followed by the access-control changes that closed the original route in.",
  },
];

export const FAQS = [
  {
    q: "What does a typical engagement look like?",
    a: "It starts with a scoping conversation, not a proposal template. Most engagements run Assess → Advise → Architect → Assure, though many clients begin with a single assessment and expand from there. You will know the shape and the cost before any work begins.",
  },
  {
    q: "How is your AI security work different from a normal penetration test?",
    a: "An AI system fails differently. We test the architecture: prompt handling, retrieval pipelines, agent tool permissions, MCP trust boundaries and the data those components can reach, alongside the governance question of whether the organisation can evidence control of it.",
  },
  {
    q: "Do you work against specific frameworks?",
    a: "Yes. AI programs are assessed against the EU AI Act, NIST AI RMF and ISO/IEC 42001; security programs against ISO 27001, NIST CSF and NIST 800-53. Findings are mapped to whichever framework your auditors, customers or regulators actually ask about.",
  },
  {
    q: "Who does the work?",
    a: "Senior practitioners, directly. There is no handoff to a junior bench after the sales conversation, the person who scopes the engagement is the person who delivers it.",
  },
  {
    q: "Can you support an audit or a customer security review?",
    a: "Yes. Audit and compliance readiness sits inside the GRC pillar: control gap identification, evidence preparation, and support through internal, customer, regulatory and certification assessments.",
  },
  {
    q: "Do you also provide training?",
    a: "We do, as a separate offering. Cybaethrex Training runs professional, corporate and university programs in AI, cloud and offensive security. It is a distinct engagement from consulting, see the training site for programs and formats.",
  },
];

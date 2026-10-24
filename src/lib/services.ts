/**
 * The service catalogue: ten categories under three pillars.
 *
 * Technology, Security and Advisory is the whole positioning in three words.
 * Ten flat categories is more than a reader holds in their head; three is the
 * answer to "what are you" that survives a lift.
 */

export type ServiceCategory = {
  id: string;
  n: string;
  family: Family;
  name: string;
  /** one line a buyer can act on */
  promise: string;
  intro: string;
  services: string[];
};

export type Family = "Technology" | "Security" | "Advisory";

export const FAMILY_ORDER: Family[] = ["Technology", "Security", "Advisory"];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "application-security",
    n: "01",
    family: "Security",
    name: "Application Security",
    promise: "Find the flaws a scanner will never reach.",
    intro:
      "Manual, adversary-led testing of web, mobile and API surfaces. Business logic and authorisation first, because those are the findings that turn into breaches rather than tickets.",
    services: [
      "Web Application Security Testing",
      "Mobile Application Security Testing",
      "API Security Testing",
      "Penetration Testing",
      "Vulnerability Assessment",
      "Secure Code Review",
      "Threat Modeling",
      "Application Security Architecture",
    ],
  },
  {
    id: "ai-security",
    n: "02",
    family: "Security",
    name: "AI & LLM Security",
    promise: "Secure AI before it becomes business risk.",
    intro:
      "The lead practice. We assess AI as an architecture rather than a model: prompts, retrieval, agents, tools and the enterprise data sitting at the end of the chain.",
    services: [
      "AI / LLM Security Assessment",
      "Generative AI Security",
      "AI Application Security",
      "RAG Security Assessment",
      "AI Agent Security",
      "Prompt Injection Testing",
      "AI Red Teaming",
      "AI Security Architecture",
      "AI Governance & Risk Assessment",
    ],
  },
  {
    id: "security-architecture",
    n: "03",
    family: "Security",
    name: "Security Architecture",
    promise: "Design the controls before you need them.",
    intro:
      "Architecture-level work where the expensive findings are cheapest to close: reference designs, trust boundaries and the roadmap that sequences them.",
    services: [
      "Security Architecture Review",
      "Cloud Security Architecture",
      "Application Security Architecture",
      "Zero Trust Architecture",
      "DevSecOps Engineering",
      "Security Engineering",
      "Security Controls Implementation",
      "Security Strategy & Roadmap",
    ],
  },
  {
    id: "devsecops",
    n: "04",
    family: "Security",
    name: "DevSecOps & Security Engineering",
    promise: "Put the control where the work already happens.",
    intro:
      "Security inside the pipeline rather than beside it. If the secure path is slower than the insecure one, engineers route around it, so we make the secure path the default.",
    services: [
      "DevSecOps Implementation",
      "CI/CD Security",
      "SAST / DAST / SCA Integration",
      "Secrets Management",
      "Infrastructure Security",
      "Cloud Security Engineering",
      "Security Automation",
      "Secure SDLC",
      "Security Tool Integration",
    ],
  },
  {
    id: "software-development",
    n: "05",
    family: "Technology",
    name: "Software & Application Development",
    promise: "Built secure, because we test for a living.",
    intro:
      "We build the applications and tooling we would otherwise be asked to assess. The same people who break software for clients write this, which is the whole argument for having us do it.",
    services: [
      "Web Application Development",
      "Mobile Application Development",
      "Custom Software Development",
      "SaaS Application Development",
      "API Development & Integration",
      "Secure Application Development",
      "Security Tool Development",
      "Enterprise Application Engineering",
    ],
  },
  {
    id: "dashboards",
    n: "06",
    family: "Technology",
    name: "Dashboards & Platforms",
    promise: "Make posture visible to the people who fund it.",
    intro:
      "A team that cannot see its own posture will not manage it, and leadership that only sees snapshots funds the wrong thing. We build the reporting layer that fixes both.",
    services: [
      "Security Dashboard Development",
      "Executive Security Dashboards",
      "SOC / Security Operations Dashboards",
      "Risk & Compliance Dashboards",
      "Vulnerability Management Dashboards",
      "Custom Business Intelligence Dashboards",
      "Security Analytics & Visualization",
      "Enterprise Portal Development",
    ],
  },
  {
    id: "iso-compliance",
    n: "07",
    family: "Advisory",
    name: "ISO & Compliance Advisory",
    promise: "Certification without the theatre.",
    intro:
      "ISMS work that produces a system the business can actually operate, not a binder written for an auditor and never opened again.",
    services: [
      "ISO 27001 Implementation",
      "ISO 27001 Gap Assessment",
      "ISO 27001 Internal Audit",
      "ISO 27001 Audit Readiness",
      "ISO 42001 Advisory",
      "ISO 27701 Advisory",
      "ISO Certification Readiness",
      "ISMS Development & Documentation",
      "Compliance Program Development",
    ],
  },
  {
    id: "privacy",
    n: "08",
    family: "Advisory",
    name: "Privacy & Data Protection",
    promise: "Know what data you hold, and why.",
    intro:
      "DPDP Act and wider privacy work that starts with data mapping, because every privacy obligation downstream depends on knowing what you actually process.",
    services: [
      "DPDP Act Compliance",
      "Privacy Gap Assessment",
      "Data Protection Program",
      "Privacy Governance",
      "Data Mapping & Classification",
      "Privacy Risk Assessment",
      "Data Retention & Protection",
      "Third-Party Privacy Risk",
    ],
  },
  {
    id: "grc-audit",
    n: "09",
    family: "Advisory",
    name: "GRC, Risk & Audit",
    promise: "Evidence that survives scrutiny.",
    intro:
      "Audit, risk and governance work written to the standard your regulators, customers and certification bodies actually apply.",
    services: [
      "Information Security Audit",
      "ISO Internal Audit",
      "Security Compliance Audit",
      "IT & Technology Audit",
      "Risk Assessment",
      "Third-Party Risk Management",
      "Security Governance",
      "Policy & Procedure Development",
      "Audit Remediation Support",
      "Compliance Readiness",
    ],
  },
  {
    id: "advisory",
    n: "10",
    family: "Advisory",
    name: "Technology Consulting",
    promise: "Make security part of the technology strategy.",
    intro:
      "Working with technology and security leaders on the decisions that set direction: strategy, transformation, and where the risk actually sits in a changing estate.",
    services: [
      "Technology Strategy",
      "Cybersecurity Strategy",
      "Security Transformation",
      "Architecture Consulting",
      "Technology Risk Advisory",
      "Cloud Security Advisory",
      "Digital Transformation Security",
      "Security Program Development",
    ],
  },
];

export const TOTAL_SERVICES = SERVICE_CATEGORIES.reduce(
  (n, c) => n + c.services.length,
  0,
);

export const byFamily = (f: Family) =>
  SERVICE_CATEGORIES.filter((c) => c.family === f);

/** What each family means, for the wheel hub and the card grid intro. */
export const FAMILY_NOTE: Record<Family, string> = {
  Technology:
    "We design and develop software, applications, digital platforms, SaaS products, AI solutions and technology-enabled services.",
  Security:
    "We assess, engineer and secure applications, AI systems, cloud environments, infrastructure and digital technologies.",
  Advisory:
    "We help organizations navigate security architecture, privacy, GRC, ISO, compliance, risk and technology transformation.",
};

/** Short headline for each pillar, used on the homepage band. */
export const FAMILY_TITLE: Record<Family, string> = {
  Technology: "We build it.",
  Security: "We break it, then secure it.",
  Advisory: "We help you govern it.",
};

/**
 * Content for the /training destination, a separate business from consulting.
 * Kept in its own module so neither narrative bleeds into the other.
 */

export type Programme = {
  id: string;
  name: string;
  badge: string;
  duration: string;
  level: string;
  summary: string;
  modules: string[];
  outcomes: string[];
  /** schematic drawn on the card: normalised nodes + links */
  nodes: [number, number][];
  links: [number, number][];
};

export const PROGRAMMES: Programme[] = [
  {
    id: "ai-security",
    name: "AI Security Professional",
    badge: "Flagship",
    duration: "3 months · 60 hrs",
    level: "Practical",
    summary:
      "Secure the systems everyone is shipping and almost nobody is testing: LLM applications, retrieval pipelines, agents and the tool servers behind them.",
    modules: [
      "Prompt & indirect injection",
      "RAG and retrieval poisoning",
      "Agent and tool-call security",
      "MCP server trust boundaries",
      "AI governance & risk (AIGP)",
    ],
    outcomes: [
      "Threat-model an LLM application end to end",
      "Run an adversarial test pass against an agent",
      "Produce evidence a risk committee accepts",
    ],
    nodes: [
      [0.1, 0.5],
      [0.36, 0.5],
      [0.62, 0.26],
      [0.62, 0.74],
      [0.9, 0.5],
    ],
    links: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
    ],
  },
  {
    id: "aws-security",
    name: "AWS Security Professional",
    badge: "In demand",
    duration: "3 months · 60 hrs",
    level: "Practical",
    summary:
      "Cloud security as it is actually practised: identity paths, network boundaries, detection and the compliance evidence that follows.",
    modules: [
      "IAM and privilege paths",
      "VPC & network security",
      "Threat detection, GuardDuty, Security Hub",
      "Data protection & KMS",
      "Governance and compliance",
    ],
    outcomes: [
      "Map a privilege path from build runner to production data",
      "Stand up detection that catches real behaviour",
      "Prepare for AWS Security Specialty",
    ],
    nodes: [
      [0.12, 0.24],
      [0.12, 0.62],
      [0.45, 0.44],
      [0.72, 0.22],
      [0.72, 0.66],
      [0.92, 0.44],
    ],
    links: [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ],
  },
  {
    id: "ceh",
    name: "Certified Ethical Hacker (CEH)",
    badge: "Popular",
    duration: "80 hrs",
    level: "Certification",
    summary:
      "Full EC-Council CEH preparation, taught through live targets rather than slide decks.",
    modules: [
      "Footprinting & reconnaissance",
      "System hacking",
      "Web application attacks",
      "Network & wireless",
      "Exam technique",
    ],
    outcomes: [
      "Work a target the way an assessor does",
      "Write findings an engineer will act on",
      "Sit CEH with lab hours behind you",
    ],
    nodes: [
      [0.1, 0.5],
      [0.36, 0.28],
      [0.36, 0.72],
      [0.66, 0.5],
      [0.9, 0.5],
    ],
    links: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "oscp",
    name: "OSCP Preparation Bootcamp",
    badge: "Advanced",
    duration: "120 hrs",
    level: "Intensive",
    summary:
      "The hardest programme we run. Sustained hands-on offensive work aimed squarely at passing Offensive Security's exam.",
    modules: [
      "Buffer overflows",
      "Privilege escalation",
      "Active Directory attacks",
      "Pivoting & lateral movement",
      "Exam strategy and reporting",
    ],
    outcomes: [
      "Chain findings into a full compromise",
      "Work under exam time pressure",
      "Report to Offensive Security's standard",
    ],
    nodes: [
      [0.14, 0.28],
      [0.42, 0.28],
      [0.7, 0.28],
      [0.14, 0.72],
      [0.42, 0.72],
      [0.7, 0.72],
    ],
    links: [
      [0, 1],
      [1, 2],
      [3, 4],
      [4, 5],
      [1, 4],
      [2, 5],
    ],
  },
  {
    id: "ai-in-cyber",
    name: "AI in Cybersecurity",
    badge: "AI focus",
    duration: "60 hrs",
    level: "Applied",
    summary:
      "The other direction: using machine learning for detection, and understanding where those models fail under an adversary.",
    modules: [
      "ML for threat detection",
      "NLP on security data",
      "Adversarial machine learning",
      "Model evaluation & drift",
      "Deploying detection responsibly",
    ],
    outcomes: [
      "Build a detection model on real telemetry",
      "Attack a model you just trained",
      "Judge vendor AI claims critically",
    ],
    nodes: [
      [0.08, 0.3],
      [0.08, 0.7],
      [0.4, 0.5],
      [0.72, 0.24],
      [0.72, 0.5],
      [0.72, 0.76],
    ],
    links: [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [2, 5],
    ],
  },
];

export const METHOD = [
  {
    n: "01",
    title: "LEARN",
    lede: "Build the foundation",
    body: "Concepts first, in the order they actually matter, not in the order a syllabus lists them. You finish each module able to explain why a control exists, not just that it does.",
    points: [
      "Founder-led live sessions",
      "Concepts grounded in real incidents",
      "Recordings and notes you keep",
    ],
  },
  {
    n: "02",
    title: "PRACTICE",
    lede: "Gain confidence in the lab",
    body: "Dedicated cloud labs with deliberately vulnerable machines and cloud accounts. You break things repeatedly, in an environment where breaking things is the point.",
    points: [
      "Dedicated lab access",
      "Vulnerable targets, not simulations",
      "Guided then unguided repetition",
    ],
  },
  {
    n: "03",
    title: "APPLY",
    lede: "Solve real-world scenarios",
    body: "Scenario work drawn from engagements we have actually run: cloud misconfiguration, an over-scoped agent, a ransomware containment clock. Messy inputs, incomplete information.",
    points: [
      "Case-based scenarios",
      "Findings written to client standard",
      "Peer and instructor review",
    ],
  },
  {
    n: "04",
    title: "ACHIEVE",
    lede: "Career and certification ready",
    body: "Certification preparation, interview practice and a portfolio of work you can show. Doubt support continues for a year after the cohort ends.",
    points: [
      "Exam preparation and mocks",
      "Portfolio and interview coaching",
      "365 days of doubt support",
    ],
  },
];

/** `ring` places short names on the inner orbit so nothing collides. */
export const TOOLING: {
  name: string;
  note: string;
  group: string;
  ring: 0 | 1;
}[] = [
  { name: "Prisma AIRS", note: "AI runtime security", group: "ai", ring: 0 },
  { name: "TensorFlow", note: "Model building & attack", group: "ai", ring: 0 },
  { name: "Kali Linux", note: "Offensive toolchain", group: "offensive", ring: 0 },
  { name: "OWASP ZAP", note: "Web application testing", group: "offensive", ring: 0 },
  { name: "SIEM", note: "Detection engineering", group: "cloud", ring: 0 },
  { name: "CSPM", note: "Misconfiguration detection", group: "cloud", ring: 0 },
  { name: "NVIDIA Garak", note: "LLM vulnerability scanning", group: "ai", ring: 1 },
  { name: "Amazon Bedrock", note: "Managed model platform", group: "ai", ring: 1 },
  { name: "Google Vertex AI", note: "Model & pipeline security", group: "ai", ring: 1 },
  { name: "TrueFoundry", note: "ML deployment surface", group: "ai", ring: 1 },
  { name: "Cobalt Strike", note: "Adversary simulation", group: "offensive", ring: 1 },
  { name: "AWS Security Hub", note: "Cloud posture at scale", group: "cloud", ring: 1 },
];

export const UNIVERSITY = {
  lede: "We work with universities to close the same gap earlier, before students hit the job market and discover the syllabus stopped short.",
  offers: [
    {
      title: "Custom workshops",
      body: "Short, intensive sessions built around your existing modules rather than replacing them.",
    },
    {
      title: "Guest lectures",
      body: "Practitioner sessions on cloud, AI and offensive security, delivered live.",
    },
    {
      title: "Lab setup",
      body: "We stand up the vulnerable environments and keep them maintained.",
    },
    {
      title: "Curriculum advisory",
      body: "Where your syllabus and current industry practice have drifted apart, and what to do about it.",
    },
    {
      title: "Faculty training",
      body: "Bringing teaching staff current on AI and cloud security practice.",
    },
    {
      title: "Internship pipeline",
      body: "Routes from coursework into supervised, real project work.",
    },
  ],
};

/** The three audiences the training business serves. */
export const AUDIENCES = [
  {
    title: "Professional programs",
    body: "For individuals building a security career or moving into AI and cloud security.",
    items: [
      "AI Security",
      "Cloud Security",
      "Application Security",
      "Ethical Hacking",
      "Security Engineering",
      "AI in Cybersecurity",
    ],
  },
  {
    title: "Corporate training",
    body: "For teams that need capability in place before the next release, audit or AI rollout.",
    items: [
      "AI Security Awareness",
      "Secure AI Development",
      "Cloud Security",
      "Application Security",
      "Security Engineering",
    ],
  },
  {
    title: "University & student programs",
    body: "For institutions closing the gap between the syllabus and industry practice.",
    items: [
      "Cybersecurity Bootcamps",
      "Ethical Hacking Workshops",
      "CTF Programs",
      "Bug Bounty Training",
      "AI Security Workshops",
    ],
  },
];

export const TRAINING_FAQS = [
  {
    q: "What training programs do you offer for working professionals?",
    a: "Certification preparation (CISSP, CCSP, CISM, AWS and Azure Security, OSCP) alongside practical programs in AI Security, AWS Security and AI in Cybersecurity. Every program includes dedicated lab access, and schedules run evenings and weekends so you can keep working.",
  },
  {
    q: "Can I join with no prior security experience?",
    a: "Yes, for the applied programs. AI Security Professional and AWS Security Professional assume general IT or development familiarity but no security background. The OSCP bootcamp is the exception. It expects prior hands-on offensive experience, and we will tell you honestly if it is too early for you.",
  },
  {
    q: "How does corporate training differ from the professional programs?",
    a: "Corporate training is scoped to your stack and your risks: the labs use environments that resemble yours, and the sessions are built around what your teams are about to ship. Delivery is on your schedule, onsite or remote.",
  },
  {
    q: "Do you provide placement assistance?",
    a: "We provide career support rather than placement guarantees: interview practice, portfolio review, CV work and introductions where they genuinely fit. Doubt support continues for 365 days after your cohort ends.",
  },
  {
    q: "Can our university partner with Cybaethrex?",
    a: "Yes. Partnerships cover custom workshops, guest lectures, lab environment setup, curriculum advisory, faculty training and internship pipelines. The starting point is usually a short review of where your current syllabus and industry practice have drifted apart.",
  },
  {
    q: "Are cohorts really taught by the founder?",
    a: "Yes, every session. Cohorts are deliberately small so that is possible. It is the main reason we cap enrolment rather than scaling seat numbers.",
  },
];

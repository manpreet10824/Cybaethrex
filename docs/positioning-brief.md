# Cybaethrex — Repositioning Brief

The positioning this site was rebuilt against, kept in the repository so the
reasoning behind the information architecture survives the people who made the
decisions. It assumes the existing codebase, not a greenfield build.

---

## 0. The mandate, in one line

**Cybaethrex is a cybersecurity consulting firm. Training is a separate,
secondary destination — not a competing section of the homepage.**

A visitor landing on `/` must conclude, within one screen, that this is a
premium security advisory practice. They should be able to *find* training in
one click, and never feel they are on a training institute's website.

---

## 1. Mental model

```
CYBAETHREX
│
├── CONSULTING  ← PRIMARY BUSINESS (80–90% of the narrative)
│   ├── 01  AI Security & AI Risk        ← lead offering
│   ├── 02  Information Security & GRC
│   └── 03  Technology & Security Advisory
│
├── EXPERTISE
├── INDUSTRIES
├── INSIGHTS
├── ABOUT
│
├── TRAINING  ← SECONDARY / SEPARATE MODULE at /training
│   ├── Professional Training
│   ├── Corporate Training
│   ├── University Programs
│   └── Workshops
│
└── CONTACT
```

### The single most important design rule

**Training must never look visually equal to consulting on the homepage.**

On `/`, training appears exactly three times:

1. one nav item,
2. one small secondary link under the hero CTAs,
3. one bridge band near the end of the page.

That is the entire training footprint on the homepage. No programme cards, no
cohort dates, no enrolment CTAs, no course durations, no "register now".

---

## 2. Navigation

```
CYBAETHREX   Consulting · Expertise · Industries · Insights · About · Training · Contact
                                                                       ↑
                                                            routes to /training
```

- `Training` is a **route change**, not an anchor scroll. It must not use the
  `/#hash` pattern the other items use.
- Give it a subtle visual separation from the consulting items (a divider or
  slightly different weight) so the shift in destination is legible before the
  click.
- Primary nav CTA becomes **`Talk to a Security Expert`** (currently
  "Register").

---

## 3. What moves where

This is a re-architecture of an existing site. Reuse the built components; do
not rebuild the design or motion systems.

| Existing component | Action |
| --- | --- |
| `Hero` + `HeroField` (canvas security graph) | **Keep on `/`.** Rewrite copy to the consulting hero below. The graph is the signature system — it stays. |
| `AttackSurface` (assembling SVG graph) | **Keep on `/`.** Reframe: the surface we assess, not "what you learn to map". |
| `AISecurity` (pinned architecture + threat labels) | **Keep on `/`** as the centrepiece of pillar 01. Reframe from syllabus to assessment scope. |
| `AttackPath` (pinned compromise chain) | **Keep on `/`.** Reframe to how findings are delivered: chains, not lists. |
| `Programmes` (pinned horizontal track) | **Move to `/training`.** |
| `Methodology` (Learn → Practice → Apply → Achieve) | **Move to `/training`.** Replace on `/` with the consulting engagement model (§5). |
| `Tooling` (orbit) | **Move to `/training`** as the lab environment. On `/`, replace with a **frameworks band** (§4.6). |
| `Universities` | **Move to `/training`.** |
| `CaseStudies` | **Keep on `/`.** This is consulting proof. |
| `TheGap` | **Rewrite on `/`** as the consulting positioning section. |
| `Faq` | **Split.** Consulting questions on `/`, training questions on `/training`. |
| `FinalCTA` | **Keep on `/`.** Consulting language. |

New components required: `TrainingBridge`, `ConsultingPillars`, `Frameworks`,
`Expertise`, `Industries`, `Insights` (see §8 before building the last three).

---

## 4. Homepage (`/`) specification

Section order:

1. Hero
2. Consulting pillars (01 / 02 / 03)
3. Attack surface — what we assess
4. AI Security & AI Risk — deep dive (pillar 01 expanded)
5. Attack path — how findings are delivered
6. Engagement model
7. Frameworks & standards
8. Expertise
9. Industries
10. Case studies
11. Insights (teaser)
12. Training bridge ← the only training block on this page
13. Final CTA

### 4.1 Hero

**Headline**

> Cybersecurity Consulting for a Changing Technology Landscape

**Sub**

> Cybaethrex helps organizations identify, manage and reduce security risk
> across AI, applications, cloud, infrastructure and enterprise technology.

**Primary CTA:** `Talk to a Security Expert` → `/contact`
**Secondary CTA:** `Explore Our Consulting Services` → `#consulting`

**Tertiary, small, visually quieter than both buttons:**

> Looking for training? Explore Cybaethrex Training →   `/training`

Keep the existing three-line cinematic headline treatment and the certification
trust row. Remove any wording implying cohorts, courses or enrolment.

### 4.2 Consulting pillars

Three cards, equal weight, numbered 01–03, each linking to its own deep-dive
anchor. This is the most important block on the page after the hero — it must
read as the business's product line.

Full content is in §5.

### 4.6 Frameworks & standards

Replaces the tooling orbit on the homepage. A quiet, credible band listing what
the practice aligns to:

`EU AI Act · NIST AI RMF · ISO/IEC 42001 · ISO 27001 · NIST CSF · NIST 800-53 · GDPR`

Reuse the orbit mechanic **or** a simpler band — but do not show offensive
tooling logos here. Tooling belongs to `/training`.

### 4.12 Training bridge

The only training block on the homepage. One band, quiet, clearly a doorway
rather than a section:

> **Need to build your team's security capabilities?**
> Cybaethrex Training delivers professional, corporate and university programs
> in AI security, cloud security and offensive security.
>
> `Explore Cybaethrex Training →`

Constraints: no course names, no durations, no pricing, no cohort dates. One
CTA. It must occupy noticeably less visual weight than any consulting section.

---

## 5. Consulting service content

Use this copy as written. Each pillar gets a card in §4.2 and a deep-dive
section or `/consulting/[pillar]` page.

### 01 — AI Security & AI Risk

**Secure AI before it becomes business risk.**

We help organizations assess, govern, architect and secure AI systems across the
full lifecycle — from LLM applications and RAG pipelines to autonomous agents
and enterprise AI platforms.

| Service | Description |
| --- | --- |
| **AI Risk Management** | Identify, assess and manage risks introduced by AI adoption, deployment and autonomous decision-making. |
| **LLM & Generative AI Security** | Assess LLM applications for prompt injection, data exposure, model abuse, insecure integrations and emerging AI attack vectors. |
| **AI Application Security** | Secure applications that integrate AI models, APIs, tools, plugins and enterprise data. |
| **RAG & AI Agent Security** | Assess retrieval pipelines, agent workflows, tool execution, permissions and data boundaries for AI-driven applications. |
| **AI Security Architecture** | Design security controls and reference architectures for enterprise AI platforms and AI-enabled applications. |
| **AI Governance & Regulatory Advisory** | Prepare AI programs against frameworks and regulations including EU AI Act, NIST AI RMF and ISO/IEC 42001. |

**CTA:** `Discuss Your AI Security Strategy →`

**Implementation note:** the existing `AISecurity` architecture diagram
(USER → AI APPLICATION → LLM → RAG → AGENT → TOOLS → MCP → ENTERPRISE DATA,
with threat labels) is the visual anchor for this pillar. Reframe its labels
from curriculum topics to assessment scope.

### 02 — Information Security & GRC

**Turn security requirements into a program the business can actually operate.**

We help organizations establish security governance, manage information-security
risk and prepare for regulatory, customer and audit requirements.

| Service | Description |
| --- | --- |
| **Information Security Risk Management** | Identify, assess and prioritize information-security risks based on business impact. |
| **ISO 27001 Advisory & Implementation Support** | Build and strengthen an information-security management system aligned with ISO 27001 requirements. |
| **NIST CSF & NIST 800-53 Alignment** | Assess security programs against established NIST frameworks and identify practical improvement opportunities. |
| **Privacy & Data Protection Advisory** | Strengthen controls around sensitive data, privacy obligations and data protection practices. |
| **Third-Party Risk Management** | Assess and manage security risks introduced by vendors, partners and technology providers. |
| **Security Governance** | Establish policies, processes, accountability and security operating models that scale with the organization. |
| **Audit & Compliance Readiness** | Identify control gaps and prepare teams for internal, customer, regulatory and certification assessments. |

**CTA:** `Assess Your Security Program →`

### 03 — Technology & Security Advisory

**Make security part of the technology strategy — not an afterthought.**

We work with technology and security leaders to evaluate architectures, define
security roadmaps and transform security programs around real business and
technology priorities.

| Service | Description |
| --- | --- |
| **Security Strategy & Roadmap** | Define a practical security roadmap aligned with business objectives, technology priorities and risk. |
| **Technology Risk Advisory** | Identify security and technology risks across platforms, applications, infrastructure and emerging technologies. |
| **Security Transformation** | Modernize security capabilities, processes and operating models to support a changing technology landscape. |
| **Architecture Review** | Evaluate application, cloud, infrastructure and security architectures to identify design-level risks and improvement opportunities. |
| **Security Program Development** | Build structured security programs across people, processes, technology and governance. |
| **Security Awareness & Training** | Develop role-based security awareness programs that help teams recognize and respond to security risks. |

**CTA:** `Build Your Roadmap →`

> Note: "Security Awareness & Training" here is an **advisory** service — a
> program you design for a client. It is not the `/training` business, and must
> not link there.

---

## 5.1 Engagement model (replaces Learn/Practice/Apply/Achieve on `/`)

Reuse the existing four-stage pinned timeline mechanic with consulting stages:

| Stage | Meaning |
| --- | --- |
| **01 ASSESS** | Establish the real risk picture — systems, exposure, ownership and business impact. |
| **02 ADVISE** | Translate findings into prioritized, costed decisions leadership can act on. |
| **03 ARCHITECT** | Design the controls, reference architectures and operating model that close the gap. |
| **04 ASSURE** | Validate that what was built holds, and produce evidence that survives audit. |

---

## 6. `/training` — separate destination

A distinct route with its own information architecture, its own hero, and a
visible "back to consulting" path. It shares the design system but must read as
a sibling product, not a subsection.

### Hero

> **CYBAETHREX TRAINING**
> Build the skills to secure what comes next.
>
> Professional cybersecurity and AI security training designed for security
> professionals, technology teams and students.

### Sections

**Professional Programs** — AI Security · Cloud Security · Application Security ·
Ethical Hacking · Security Engineering · AI in Cybersecurity

**Corporate Training** — AI Security Awareness · Secure AI Development ·
Cloud Security · Application Security · Security Engineering

**University & Student Programs** — Cybersecurity Bootcamps · Ethical Hacking
Workshops · CTF Programs · Bug Bounty Training · AI Security Workshops

Then: engagement/teaching method (the moved Learn → Practice → Apply → Achieve
timeline), lab environment (the moved tooling orbit), university partnerships
(moved), training FAQ, training CTA.

### Navigation on `/training`

Nav switches to a training context: `Professional · Corporate · University ·
Method · Contact`, plus a persistent `← Cybaethrex Consulting` link back to `/`.

---

## 7. Constraints — do not renegotiate these

The repository already has a working design and motion system. Reuse it.

- **Tokens.** Colours are only ever `var(--token)` or
  `rgb(var(--rgb-token) / <alpha>)`. No literal hex or `rgba()` in components.
  Both light and dark themes must work; verify both.
- **Content.** All copy goes in `src/lib/content.ts`. Add
  `src/lib/content.training.ts` for the `/training` route rather than mixing
  the two businesses in one file.
- **Motion ownership.** GSAP (ScrollTrigger + DrawSVG) owns scrubbed scroll
  storytelling and SVG path drawing. Motion owns entrance reveals, hover,
  layout/UI state and route transitions. CSS owns scroll-state styling and
  ambient loops. Sticky pinning stays CSS `position: sticky`.
- **No scroll-driven React state.** Scroll updates write to the DOM or stamp
  `data-*` attributes that CSS styles.
- **shadcn/ui** primitives stay bridged onto Cybaethrex tokens. Never introduce
  a second token set.
- **Accessibility.** `prefers-reduced-motion` replaces every pinned section
  with a static stacked variant; touch gets the lite path; anchors route
  through Lenis with a 96px offset.
- **Icons.** Lucide only.
- **Page weight.** The homepage is already ~20 viewports. Moving training off
  it should *reduce* that. If the consulting homepage exceeds ~16 viewports,
  cut a section rather than adding scroll.

---

## 8. Content that does not exist yet

Three nav items in the target IA have no source content. None of it should be
written speculatively: an invented client or a fabricated metric is a
liability on a security firm's own site.

- **Insights** — implies articles. There are none. Either build the route with
  a real first post supplied by the client, or **omit the nav item until
  content exists**. A nav link to an empty page is worse than no link.
- **Industries** — needs real sector experience (which sectors, what work).
  The only evidence available is healthcare, financial services and multi-cloud
  from the existing case studies. Do not claim sectors beyond those without
  confirmation.
- **Expertise** — distinct from Consulting only if it describes capability
  depth (certifications, disciplines, methods). If it would just restate the
  pillars, fold it into About and drop the nav item.

Also unresolved and must not be asserted:

- The **"50+ universities"** figure — unverified; currently omitted.
- The **"cyber attacks every 39 seconds"** statistic — unsourced cliché;
  deliberately removed and should not return.

Ask before inventing any metric, client name, logo or testimonial.

---

## 9. Acceptance criteria

The work is done when all of the following are true.

**Positioning**

1. On `/`, the words "cohort", "enrol", "syllabus", "course" and "register" do
   not appear outside the single training bridge band.
2. The homepage contains zero programme cards, durations or lab references.
3. Training appears on `/` exactly three times: nav item, hero tertiary link,
   bridge band.
4. `Training` in the nav performs a route change to `/training`, not a scroll.
5. `/training` has its own hero, its own nav context and a link back to `/`.

**Structure**

6. Three consulting pillars are present, numbered, with the exact service copy
   from §5.
7. AI Security & AI Risk is visually the lead pillar.
8. The engagement model reads Assess → Advise → Architect → Assure.
9. Case studies remain on `/` and are framed as consulting proof.

**Quality gates**

10. `npm run build`, `npx tsc --noEmit` and `npx eslint src --max-warnings=0`
    all pass.
11. No console or page errors on `/`, `/training` and `/contact`.
12. Both themes verified; `prefers-reduced-motion` verified; 390px viewport
    verified.
13. Every in-page anchor lands at a 96px offset from the viewport top.
14. Homepage scroll length has decreased relative to the current build.

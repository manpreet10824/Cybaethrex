"use client";

import { ShieldCheck, Sparkles } from "lucide-react";

/**
 * The hero visual: a mock engagement dashboard. It is an illustration of what
 * an engagement hands back (posture, open paths, findings mapped to
 * frameworks), not a product, and the caption says so. Figures are static and
 * representative; nothing here is read from a live system.
 */

const NAV = [
  "Overview",
  "Attack paths",
  "AI systems",
  "Cloud posture",
  "Findings",
  "Frameworks",
  "Evidence",
  "Reports",
];

const KPIS = [
  { k: "Posture score", v: "78", d: "+37 since baseline", tone: "ok" },
  { k: "Open paths to data", v: "1", d: "down from 6", tone: "ok" },
  { k: "Critical findings", v: "2", d: "1 new this week", tone: "bad" },
  { k: "Evidence ready", v: "94%", d: "ISO 27001 · 42001", tone: "muted" },
] as const;

const ROWS = [
  {
    f: "Broken object-level authorisation on /v1/accounts",
    p: "AppSec",
    fw: "OWASP API 1",
    sev: "Critical",
    cls: "sev-c",
  },
  {
    f: "Indirect prompt injection via retrieved documents",
    p: "AI Security",
    fw: "OWASP LLM 01",
    sev: "High",
    cls: "sev-h",
  },
  {
    f: "Cloud role scoped far wider than the workload",
    p: "Cloud",
    fw: "NIST 800-53 AC-6",
    sev: "High",
    cls: "sev-h",
  },
  {
    f: "No adversarial test plan for clinical model",
    p: "AI Security",
    fw: "ISO 42001",
    sev: "Medium",
    cls: "sev-m",
  },
] as const;

const TONE: Record<(typeof KPIS)[number]["tone"], string> = {
  ok: "var(--ok)",
  bad: "var(--bad)",
  muted: "var(--muted-dim)",
};

export function HeroDashboard() {
  return (
    <figure className="relative mx-auto mt-14 w-full max-w-[1180px] lg:mt-20">
      <div
        className="glass glass-blur relative rounded-[22px] p-2.5 sm:p-4"
        style={{ boxShadow: "var(--glass-shadow)" }}
      >
        <div className="panel-ink grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--glass-line)] md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* sidebar */}
          <nav
            aria-label="Illustrative dashboard sections"
            className="hidden border-r border-[var(--glass-line)] p-4 text-[12.5px] text-muted md:block"
          >
            <ul>
              {NAV.map((n, i) => (
                <li
                  key={n}
                  className={`mb-1 rounded-lg px-2.5 py-2 ${i === 0 ? "bg-[rgb(var(--rgb-signal)/0.12)] text-signal" : ""}`}
                >
                  {n}
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 p-4 sm:p-5">
            {/* KPIs */}
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {KPIS.map((k) => (
                <div key={k.k} className="glass rounded-xl px-4 py-3.5">
                  <dt className="mono text-[10px] tracking-[0.14em] text-muted-dim">
                    {k.k.toUpperCase()}
                  </dt>
                  <dd className="display mt-1.5 text-[26px] font-bold leading-none tracking-[-0.03em] text-ink sm:text-[28px]">
                    {k.v}
                  </dd>
                  <dd
                    className="mt-1.5 text-[11.5px]"
                    style={{ color: TONE[k.tone] }}
                  >
                    {k.d}
                  </dd>
                </div>
              ))}
            </dl>

            {/* chart */}
            <div className="glass mt-3 rounded-xl p-4">
              <div className="flex justify-between text-[12.5px] text-muted">
                <span>Exposure over the engagement</span>
                <span>12 weeks</span>
              </div>
              <svg
                viewBox="0 0 900 150"
                className="mt-2 h-[110px] w-full sm:h-[150px]"
                preserveAspectRatio="none"
                role="img"
                aria-label="Area chart: exposure falling across assess, architect and assure stages"
              >
                <defs>
                  <linearGradient id="hd-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--signal)" stopOpacity="0.45" />
                    <stop offset="1" stopColor="var(--signal)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="var(--glass-line)">
                  <line x1="0" y1="30" x2="900" y2="30" />
                  <line x1="0" y1="70" x2="900" y2="70" />
                  <line x1="0" y1="110" x2="900" y2="110" />
                </g>
                <path
                  d="M0 25 C120 30 180 40 260 60 S420 95 520 105 S740 125 900 132 V150 H0Z"
                  fill="url(#hd-area)"
                />
                <path
                  d="M0 25 C120 30 180 40 260 60 S420 95 520 105 S740 125 900 132"
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                <g fill="var(--signal)">
                  <circle cx="260" cy="60" r="4" />
                  <circle cx="520" cy="105" r="4" />
                  <circle cx="900" cy="132" r="4" />
                </g>
                <g
                  fontFamily="var(--font-geist-mono), monospace"
                  fontSize="10"
                  fill="var(--muted-dim)"
                >
                  <text x="240" y="48">assess</text>
                  <text x="505" y="93">architect</text>
                  <text x="850" y="122">assure</text>
                </g>
              </svg>
            </div>

            {/* findings */}
            <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--glass-line)] text-[12.5px]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="mono text-[10px] tracking-[0.14em] text-muted-dim">
                    <th scope="col" className="px-3.5 py-2.5 font-normal">
                      FINDING
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3.5 py-2.5 font-normal sm:table-cell"
                    >
                      PRACTICE
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3.5 py-2.5 font-normal lg:table-cell"
                    >
                      FRAMEWORK
                    </th>
                    <th scope="col" className="px-3.5 py-2.5 font-normal">
                      SEVERITY
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  {ROWS.map((r) => (
                    <tr key={r.f} className="border-t border-[var(--glass-line)]">
                      <td className="min-w-[180px] px-3.5 py-2.5">{r.f}</td>
                      <td className="hidden px-3.5 py-2.5 sm:table-cell">
                        {r.p}
                      </td>
                      <td className="hidden px-3.5 py-2.5 lg:table-cell">
                        {r.fw}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className={`sev ${r.cls}`}>{r.sev}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* floating proof badges, desktop only so they never cover content */}
        <Badge
          className="float-badge -left-24 top-36 hidden xl:flex"
          style={{ "--float-delay": "0s" } as React.CSSProperties}
          icon={<ShieldCheck size={15} strokeWidth={2.4} aria-hidden />}
          title="ISO 27001 · 42001"
          sub="Evidence pack generated"
        />
        <Badge
          className="float-badge -right-12 top-72 hidden xl:flex"
          style={{ "--float-delay": "2.4s" } as React.CSSProperties}
          icon={<Sparkles size={15} strokeWidth={2.4} aria-hidden />}
          title="EU AI Act readiness"
          sub="High-risk system assessed"
        />
      </div>

      <figcaption className="mono mt-5 text-center text-[10.5px] tracking-[0.16em] text-muted-dim">
        ILLUSTRATION OF AN ENGAGEMENT&rsquo;S OUTPUT · REPRESENTATIVE FIGURES
      </figcaption>
    </figure>
  );
}

function Badge({
  className,
  style,
  icon,
  title,
  sub,
}: {
  className: string;
  style?: React.CSSProperties;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div
      className={`panel-ink absolute items-center gap-3 rounded-[14px] border border-[var(--glass-line)] px-4 py-3 text-[12.5px] shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)] ${className}`}
      style={style}
    >
      <span
        className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] text-[var(--on-signal)]"
        style={{ background: "var(--grad)", color: "#1a0e04" }}
      >
        {icon}
      </span>
      <span>
        <b className="block text-[13px] font-semibold text-ink">{title}</b>
        <small className="text-[12px] text-muted">{sub}</small>
      </span>
    </div>
  );
}

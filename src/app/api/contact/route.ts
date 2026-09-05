import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/content";

/**
 * Contact form delivery.
 *
 * Posts the enquiry to Resend's REST API rather than pulling in their SDK:
 * the call is one fetch, and a dependency that exists to wrap a single POST
 * is a dependency that has to be upgraded forever.
 *
 * Environment:
 *   RESEND_API_KEY   required. Without it the route reports itself
 *                    unconfigured and the form falls back to mailto.
 *   CONTACT_TO       where enquiries land. Defaults to the support address.
 *   CONTACT_FROM     the envelope sender. Must be an address on a domain
 *                    verified in Resend, except for Resend's own sandbox
 *                    sender, which can only deliver to the account owner.
 */

export const runtime = "nodejs";
// A POST-only handler is inherently dynamic, so no `dynamic` export is
// needed. Leaving it off is deliberate: `export const dynamic` would make
// `STATIC_EXPORT=1 next build` fail outright rather than simply omitting
// this route from the static bundle.

const TO = process.env.CONTACT_TO || CONTACT.emails[0];
const FROM =
  process.env.CONTACT_FROM || "Cybaethrex Website <onboarding@resend.dev>";

const LIMITS = {
  name: 100,
  company: 200,
  email: 200,
  context: 5000,
} as const;

/**
 * Best-effort throttle. A serverless instance holds this only while warm and
 * a burst can land on separate instances, so it stops casual repeat submits
 * rather than a determined flood. The honeypot does the rest.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const seen = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(ip, hits);

  // keep the map from growing without bound on a long-lived instance
  if (seen.size > 500) {
    for (const [k, v] of seen) {
      if (!v.some((t) => now - t < WINDOW_MS)) seen.delete(k);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Everything below goes into an HTML mail body, so it is escaped first. */
const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "unconfigured", message: "Email delivery is not configured." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many messages. Try again later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Bots fill in every field they are given. A real submitter never sees this
  // one, so anything in it is discarded: reported as success, because telling
  // a bot it failed only teaches it to try again.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name);
  const company = str(body.company);
  const email = str(body.email);
  const context = str(body.context);
  const engagement = Array.isArray(body.engagement)
    ? body.engagement.filter((e): e is string => typeof e === "string").slice(0, 20)
    : [];

  const errors: string[] = [];
  if (name.length < 2 || name.length > LIMITS.name) errors.push("name");
  if (
    email.length > LIMITS.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  )
    errors.push("email");
  if (context.length < 10 || context.length > LIMITS.context)
    errors.push("context");
  if (company.length > LIMITS.company) errors.push("company");

  if (errors.length) {
    return NextResponse.json({ error: "invalid", fields: errors }, { status: 422 });
  }

  const subject = company
    ? `Enquiry: ${name} at ${company}`
    : `Enquiry: ${name}`;

  const rows: [string, string][] = [
    ["Name", name],
    ["Company", company || "not given"],
    ["Email", email],
    ["Interested in", engagement.length ? engagement.join(", ") : "not specified"],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    context,
    "",
    `Received: ${new Date().toUTCString()}`,
  ].join("\n");

  const html = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;max-width:640px">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#a8490a">Cybaethrex &middot; website enquiry</p>
  <h2 style="margin:0 0 20px;font-size:19px;font-weight:600">${esc(subject)}</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:20px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:7px 14px 7px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top;border-bottom:1px solid #ececec">${esc(k)}</td><td style="padding:7px 0;border-bottom:1px solid #ececec">${esc(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:0 0 6px;color:#6b6b6b;font-size:12px">Message</p>
  <div style="white-space:pre-wrap;padding:14px 16px;background:#f7f7f7;border-left:3px solid #f87f17;border-radius:0 6px 6px 0">${esc(context)}</div>
  <p style="margin:22px 0 0;font-size:12px;color:#8a8a8a">Reply to this email to answer ${esc(name)} directly.</p>
</div>`.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // replying in the inbox reaches the person who wrote in, not the site
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("resend send failed", res.status, detail);
      return NextResponse.json(
        { error: "send_failed", message: "The message could not be sent." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("resend request threw", err);
    return NextResponse.json(
      { error: "send_failed", message: "The message could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

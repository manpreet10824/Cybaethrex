import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/content";

/**
 * Contact form delivery.
 *
 * Validation, spam handling and the message body are ours. Where the message
 * then goes is configuration, because the right answer differs by who is
 * running the site. Whichever of these is set wins, in order:
 *
 *   1. CONTACT_WEBHOOK_URL   POST the enquiry as JSON. This is the Google
 *                            Apps Script path (see docs/contact-apps-script.gs),
 *                            and equally Zapier, Make, n8n or your own
 *                            endpoint. Optionally signed with
 *                            CONTACT_WEBHOOK_SECRET.
 *   2. GOOGLE_FORM_ACTION    Submit into a Google Form, so responses collect
 *                            in a Sheet. Needs GOOGLE_FORM_FIELDS, a JSON map
 *                            of our field names to the form's entry ids:
 *                            {"name":"entry.1","email":"entry.2",...}
 *   3. RESEND_API_KEY        Send directly through Resend's REST API. Uses
 *                            CONTACT_FROM as the sender, which must be on a
 *                            domain verified in Resend.
 *
 * With none of them set the route reports itself unconfigured and the form
 * falls back to opening the reader's own mail client, so a missing variable
 * loses nothing.
 *
 * Note the asymmetry worth knowing when choosing: 1 and 3 produce a real
 * email with the sender in Reply-To, so answering in the inbox reaches them.
 * 2 produces a spreadsheet row, and Google's own new-response notification
 * links to the form rather than carrying the answers.
 *
 * All three are one fetch. No provider SDK is installed, because a dependency
 * that wraps a single POST is a dependency that has to be upgraded forever.
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

type Enquiry = {
  name: string;
  company: string;
  email: string;
  engagement: string[];
  context: string;
  subject: string;
  text: string;
  html: string;
  receivedAt: string;
};

/** A generic JSON webhook: Google Apps Script, Zapier, Make, n8n, your own. */
async function sendWebhook(url: string, enquiry: Enquiry) {
  const secret = process.env.CONTACT_WEBHOOK_SECRET;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Contact-Secret": secret } : {}),
    },
    // Apps Script web apps answer a POST with a 302 to googleusercontent,
    // which fetch follows on its own.
    redirect: "follow",
    body: JSON.stringify({ to: TO, ...enquiry, ...(secret ? { secret } : {}) }),
  });
}

/**
 * Google Forms. The public form accepts a plain form-encoded POST to its
 * formResponse endpoint, so no API, key or OAuth is involved. Responses land
 * in the linked Sheet.
 */
async function sendGoogleForm(action: string, enquiry: Enquiry) {
  let map: Record<string, string>;
  try {
    map = JSON.parse(process.env.GOOGLE_FORM_FIELDS || "{}");
  } catch {
    throw new Error("GOOGLE_FORM_FIELDS is not valid JSON");
  }

  const values: Record<string, string> = {
    name: enquiry.name,
    company: enquiry.company,
    email: enquiry.email,
    engagement: enquiry.engagement.join(", "),
    context: enquiry.context,
  };

  const form = new URLSearchParams();
  for (const [field, entryId] of Object.entries(map)) {
    if (values[field] !== undefined) form.set(entryId, values[field]);
  }
  if (![...form.keys()].length) {
    throw new Error("GOOGLE_FORM_FIELDS mapped nothing");
  }

  return fetch(action, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

/** Resend's REST API. */
async function sendResend(key: string, enquiry: Enquiry) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      // replying in the inbox reaches the person who wrote in, not the site
      reply_to: enquiry.email,
      subject: enquiry.subject,
      text: enquiry.text,
      html: enquiry.html,
    }),
  });
}

export async function POST(request: Request) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const googleForm = process.env.GOOGLE_FORM_ACTION;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhook && !googleForm && !resendKey) {
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

  const enquiry: Enquiry = {
    name,
    company,
    email,
    engagement,
    context,
    subject,
    text,
    html,
    receivedAt: new Date().toISOString(),
  };

  const provider = webhook ? "webhook" : googleForm ? "google-form" : "resend";

  try {
    const res = webhook
      ? await sendWebhook(webhook, enquiry)
      : googleForm
        ? await sendGoogleForm(googleForm, enquiry)
        : await sendResend(resendKey as string, enquiry);

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`contact ${provider} failed`, res.status, detail.slice(0, 500));
      return NextResponse.json(
        { error: "send_failed", message: "The message could not be sent." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error(`contact ${provider} threw`, err);
    return NextResponse.json(
      { error: "send_failed", message: "The message could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

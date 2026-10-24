import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import {
  BodyTooLarge,
  ENGAGEMENTS,
  RateLimiter,
  block,
  clientIp,
  line,
  originAllowed,
  readBodyLimited,
} from "@/lib/contact-guard";

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
  nameMin: 2,
  name: 100,
  company: 200,
  email: 200,
  // Low enough that a terse real enquiry ("Need VAPT") gets through, high
  // enough to reject an empty gesture. The form states it, so it is never a
  // surprise.
  contextMin: 5,
  context: 5000,
  // The largest legitimate body is the fields above at their limits, JSON
  // encoded. 32 KB leaves ample headroom while refusing anything abusive
  // before it is parsed.
  bodyBytes: 32 * 1024,
} as const;

/** How long a provider gets to answer before the form offers the fallback. */
const PROVIDER_TIMEOUT_MS = 10_000;

/**
 * Best-effort throttle: 5 sends per client and 60 in total per instance every
 * ten minutes. See RateLimiter for why it is in memory and what that means on
 * serverless hosts. The honeypot does the rest.
 */
const limiter = new RateLimiter(10 * 60 * 1000, 5, 60);

/** Responses from this route are never cacheable. */
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

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
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
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
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
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
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
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

/**
 * Whether the provider actually accepted the enquiry. A non-2xx status is a
 * failure, but so is a 2xx whose JSON body reports an error: Google Apps
 * Script web apps answer 200 whatever the script returns, so a rejected
 * secret comes back as 200 {"error":"forbidden"}. Treating that as delivered
 * would show the visitor "sent" while the enquiry went nowhere.
 */
async function delivered(res: Response): Promise<{ ok: boolean; detail: string }> {
  const detail = await res.text().catch(() => "");
  if (!res.ok) return { ok: false, detail };
  if ((res.headers.get("content-type") ?? "").includes("application/json")) {
    try {
      const data = JSON.parse(detail) as { error?: unknown; ok?: unknown };
      if (data && (data.error !== undefined || data.ok === false)) {
        return { ok: false, detail };
      }
    } catch {
      // a 2xx with an unparseable body is still a 2xx
    }
  }
  return { ok: true, detail };
}

export async function POST(request: Request) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const googleForm = process.env.GOOGLE_FORM_ACTION;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhook && !googleForm && !resendKey) {
    return json(
      { error: "unconfigured", message: "Email delivery is not configured." },
      503,
    );
  }

  if (!originAllowed(request.headers, SITE_URL)) {
    return json({ error: "forbidden" }, 403);
  }

  // Requiring JSON also means a plain cross-site <form> cannot reach this
  // route without a CORS preflight, which it would not pass.
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const ip = clientIp(request.headers);

  let body: Record<string, unknown>;
  try {
    const raw = await readBodyLimited(request, LIMITS.bodyBytes);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json({ error: "bad_request" }, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch (err) {
    if (err instanceof BodyTooLarge) {
      return json({ error: "too_large" }, 413);
    }
    return json({ error: "bad_request" }, 400);
  }

  // Bots fill in every field they are given. A real submitter never sees this
  // one, so anything in it is discarded: reported as success, because telling
  // a bot it failed only teaches it to try again.
  if (line(body.website)) {
    return json({ ok: true });
  }

  const name = line(body.name);
  const company = line(body.company);
  const email = line(body.email);
  const context = block(body.context);
  // only the options the form offers, each at most once
  const engagement = Array.isArray(body.engagement)
    ? ENGAGEMENTS.filter((e) => (body.engagement as unknown[]).includes(e))
    : [];

  const errors: string[] = [];
  if (name.length < LIMITS.nameMin || name.length > LIMITS.name)
    errors.push("name");
  if (
    email.length > LIMITS.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  )
    errors.push("email");
  if (context.length < LIMITS.contextMin || context.length > LIMITS.context)
    errors.push("context");
  if (company.length > LIMITS.company) errors.push("company");

  // Returned so the form can name the field rather than ask the reader to
  // guess which of four it was.
  if (errors.length) {
    return json({ error: "invalid", fields: errors }, 422);
  }

  // Throttle only what would otherwise be sent. Counting rejected submissions
  // punishes someone who mistypes their address twice, which is the opposite
  // of the intent.
  if (limiter.limited(ip)) {
    return json(
      { error: "rate_limited", message: "Too many messages. Try again later." },
      429,
    );
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

    const result = await delivered(res);
    if (!result.ok) {
      // provider detail stays in the server log; the visitor gets the fallback
      console.error(
        `contact ${provider} failed`,
        res.status,
        result.detail.slice(0, 500),
      );
      return json(
        { error: "send_failed", message: "The message could not be sent." },
        502,
      );
    }
  } catch (err) {
    console.error(
      `contact ${provider} threw`,
      err instanceof Error ? err.message : String(err),
    );
    return json(
      { error: "send_failed", message: "The message could not be sent." },
      502,
    );
  }

  return json({ ok: true });
}

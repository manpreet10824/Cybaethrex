/**
 * Request guards for POST /api/contact, kept apart from the route so each one
 * can be tested on its own. None of them is a substitute for the others: the
 * origin check stops other sites posting through a visitor's browser, the
 * size cap stops oversized bodies before they are parsed, and the limiter
 * caps what is actually sent.
 */

/** Engagement types the form offers. Anything else in a submission is dropped. */
export const ENGAGEMENTS = [
  "AI security & AI risk",
  "Security assessment / VAPT",
  "Security architecture & engineering",
  "ISO 27001, GRC & compliance",
  "Technology advisory",
  "Training programme",
  "University partnership",
] as const;

type Env = Record<string, string | undefined>;

/**
 * The client address used to key the rate limit.
 *
 * The first X-Forwarded-For entry is whatever the client chose to send, so
 * keying on it lets anyone reset their limit by changing a header. Each proxy
 * appends the address it received the connection from, so the trustworthy
 * entry is the one written by the nearest proxy we control: counted from the
 * right, TRUSTED_PROXY_COUNT hops in (1 for a single load balancer such as
 * App Runner or an ALB). On Vercel the platform overwrites x-real-ip itself.
 *
 * With TRUSTED_PROXY_COUNT=0 forwarding headers are ignored entirely, which is
 * correct when the Node server faces the internet directly.
 */
export function clientIp(headers: Headers, env: Env = process.env): string {
  if (env.VERCEL) {
    const real = headers.get("x-real-ip")?.trim();
    if (real) return real;
  }

  const parsed = Number.parseInt(env.TRUSTED_PROXY_COUNT ?? "1", 10);
  const hops = Number.isFinite(parsed) && parsed >= 0 ? parsed : 1;
  if (hops === 0) return "unknown";

  const chain = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return chain[chain.length - hops] ?? chain[0] ?? "unknown";
}

/**
 * Same-origin check for a browser POST. Browsers always send Origin on a
 * cross-origin fetch and cannot forge it, so a mismatch means another site is
 * submitting through the visitor's browser. A request with no Origin is not
 * from a browser page, and a header check would not stop it anyway: the
 * limiter and validation handle that case.
 *
 * Allowed: the host the request was addressed to (covers previews and local
 * runs), the canonical site origin, its www/apex twin, and any origins listed
 * in CONTACT_ALLOWED_ORIGINS (comma separated).
 */
export function originAllowed(
  headers: Headers,
  siteUrl: string,
  env: Env = process.env,
): boolean {
  const origin = headers.get("origin");
  if (!origin) return true;

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (host && originUrl.host === host.split(",")[0].trim()) return true;

  const allowed = new Set<string>();
  const add = (value: string) => {
    try {
      allowed.add(new URL(value).origin);
    } catch {
      // ignore a malformed entry rather than failing every submission
    }
  };
  add(siteUrl);
  try {
    const site = new URL(siteUrl);
    const twin = site.hostname.startsWith("www.")
      ? site.hostname.slice(4)
      : `www.${site.hostname}`;
    add(`${site.protocol}//${twin}${site.port ? `:${site.port}` : ""}`);
  } catch {
    // SITE_URL always parses in practice; nothing to add if it does not
  }
  for (const extra of (env.CONTACT_ALLOWED_ORIGINS ?? "").split(",")) {
    if (extra.trim()) add(extra.trim());
  }
  return allowed.has(originUrl.origin);
}

export class BodyTooLarge extends Error {}

/**
 * Reads the request body as text, refusing anything over `limit` bytes. The
 * declared Content-Length is checked first, and the stream is read with a
 * running count, so a chunked body without a length cannot slip past.
 */
export async function readBodyLimited(
  request: Request,
  limit: number,
): Promise<string> {
  const declared = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > limit) throw new BodyTooLarge();
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel().catch(() => {});
      throw new BodyTooLarge();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/**
 * A single-line field: trimmed, with control characters (including CR and
 * LF) collapsed to a space. The name and company end up in the email subject,
 * where a line break has no business being.
 */
export const line = (v: unknown): string =>
  typeof v === "string"
    ? v
        .replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim()
    : "";

/** A multi-line field: keeps newlines and tabs, drops other control characters. */
export const block = (v: unknown): string =>
  typeof v === "string"
    ? v
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "")
        .trim()
    : "";

/**
 * Sliding-window limiter held in memory. A serverless instance keeps it only
 * while warm and a burst can land on separate instances, so it stops casual
 * repeat submits rather than a determined flood. Two limits apply: per client,
 * and a ceiling across all clients so that rotating addresses cannot turn the
 * form into an unbounded mail sender. The map is bounded so it cannot grow
 * without limit under many distinct addresses.
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();
  private all: number[] = [];

  constructor(
    private readonly windowMs: number,
    private readonly perClient: number,
    private readonly global: number,
    private readonly maxKeys = 5000,
  ) {}

  /** Records an attempt and reports whether it is over either limit. */
  limited(key: string, now = Date.now()): boolean {
    const fresh = (t: number) => now - t < this.windowMs;

    this.all = this.all.filter(fresh);
    if (this.all.length >= this.global) return true;

    const hits = (this.hits.get(key) ?? []).filter(fresh);
    if (hits.length >= this.perClient) {
      this.hits.set(key, hits);
      return true;
    }

    hits.push(now);
    this.all.push(now);
    // delete then set so Map order tracks recency for eviction below
    this.hits.delete(key);
    this.hits.set(key, hits);
    this.prune(now);
    return false;
  }

  private prune(now: number) {
    if (this.hits.size <= this.maxKeys) return;
    for (const [k, v] of this.hits) {
      if (!v.some((t) => now - t < this.windowMs)) this.hits.delete(k);
    }
    // still over: drop the least recently active keys
    for (const k of this.hits.keys()) {
      if (this.hits.size <= this.maxKeys) break;
      this.hits.delete(k);
    }
  }
}

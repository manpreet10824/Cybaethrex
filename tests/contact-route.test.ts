import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Post = (req: Request) => Promise<Response>;

const valid = {
  name: "Ada Lovelace",
  company: "Analytical Engines",
  email: "ada@example.com",
  context: "We need a VAPT before launch.",
  engagement: ["Security assessment / VAPT"],
  website: "",
};

let POST: Post;
let fetchMock: ReturnType<typeof vi.fn>;

async function load(env: Record<string, string>) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  ({ POST } = (await import("@/app/api/contact/route")) as { POST: Post });
}

function req(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      origin: "http://localhost:3000",
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const jsonRes = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

beforeEach(async () => {
  fetchMock = vi.fn(async () => jsonRes({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  await load({
    CONTACT_WEBHOOK_URL: "https://hooks.example/exec",
    CONTACT_WEBHOOK_SECRET: "s3cret-for-tests-only",
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("delivers a valid enquiry", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hooks.example/exec");
    const sent = JSON.parse(init.body);
    expect(sent.name).toBe("Ada Lovelace");
    expect(sent.engagement).toEqual(["Security assessment / VAPT"]);
  });

  it("returns 503 when no provider is configured", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    vi.stubEnv("GOOGLE_FORM_ACTION", "");
    vi.stubEnv("RESEND_API_KEY", "");
    await load({});
    expect((await POST(req(valid))).status).toBe(503);
  });

  it("names the invalid fields", async () => {
    const res = await POST(req({ ...valid, name: "A", email: "nope" }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields).toEqual(["name", "email"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops honeypot submissions without sending", async () => {
    const res = await POST(req({ ...valid, website: "http://spam" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a cross-site origin", async () => {
    const res = await POST(req(valid, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects non-JSON bodies (plain cross-site form posts)", async () => {
    const res = await POST(
      req("name=a", { "content-type": "application/x-www-form-urlencoded" }),
    );
    expect(res.status).toBe(415);
  });

  it("rejects oversized bodies before parsing", async () => {
    const res = await POST(req({ ...valid, context: "x".repeat(40_000) }));
    expect(res.status).toBe(413);
  });

  it("rejects malformed and non-object JSON", async () => {
    expect((await POST(req("{not json"))).status).toBe(400);
    expect((await POST(req("[1,2]"))).status).toBe(400);
    expect((await POST(req("null"))).status).toBe(400);
  });

  it("rate limits after five sends from one client", async () => {
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await POST(req(valid))).status);
    expect(codes).toEqual([200, 200, 200, 200, 200, 429]);
  });

  it("does not let a spoofed X-Forwarded-For reset the limit", async () => {
    const codes = [];
    for (let i = 0; i < 6; i++) {
      const spoof = { "x-forwarded-for": `10.0.0.${i}, 203.0.113.9` };
      codes.push((await POST(req(valid, spoof))).status);
    }
    expect(codes.at(-1)).toBe(429);
  });

  it("strips line breaks from fields that reach the subject", async () => {
    await POST(req({ ...valid, name: "Ada\r\nBcc: x@example.com" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.subject).not.toMatch(/[\r\n]/);
  });

  it("keeps only the engagement options the form offers", async () => {
    await POST(
      req({ ...valid, engagement: ["Security assessment / VAPT", "x".repeat(5000), 7] }),
    );
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.engagement).toEqual(["Security assessment / VAPT"]);
  });

  it("escapes HTML in the email body", async () => {
    await POST(req({ ...valid, context: "<img src=x onerror=alert(1)>" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.html).not.toContain("<img");
    expect(sent.html).toContain("&lt;img");
  });

  it("treats a 200 with an error body (Apps Script) as a failure", async () => {
    fetchMock.mockResolvedValueOnce(jsonRes({ error: "forbidden" }));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
  });

  it("reports provider HTTP errors without leaking their detail", async () => {
    fetchMock.mockResolvedValueOnce(new Response("internal provider secret detail", { status: 500 }));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
    expect(await res.text()).not.toContain("provider secret");
  });

  it("reports a provider that throws or times out", async () => {
    fetchMock.mockRejectedValueOnce(new Error("timeout"));
    expect((await POST(req(valid))).status).toBe(502);
  });

  it("sends through Resend with the visitor in reply_to", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    vi.stubEnv("GOOGLE_FORM_ACTION", "");
    await load({ RESEND_API_KEY: "test-key" });
    fetchMock.mockResolvedValueOnce(jsonRes({ id: "1" }));
    expect((await POST(req(valid))).status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(init.body).reply_to).toBe("ada@example.com");
  });
});

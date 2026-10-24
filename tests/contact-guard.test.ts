import { describe, expect, it } from "vitest";
import {
  BodyTooLarge,
  RateLimiter,
  block,
  clientIp,
  line,
  originAllowed,
  readBodyLimited,
} from "@/lib/contact-guard";

const h = (init: Record<string, string>) => new Headers(init);

describe("clientIp", () => {
  it("takes the entry the nearest proxy appended, not the client's first", () => {
    const headers = h({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" });
    expect(clientIp(headers, {})).toBe("203.0.113.9");
  });

  it("cannot be reset by rotating a spoofed first entry", () => {
    const a = clientIp(h({ "x-forwarded-for": "1.1.1.1, 203.0.113.9" }), {});
    const b = clientIp(h({ "x-forwarded-for": "2.2.2.2, 203.0.113.9" }), {});
    expect(a).toBe(b);
  });

  it("honours TRUSTED_PROXY_COUNT", () => {
    const headers = h({ "x-forwarded-for": "9.9.9.9, 203.0.113.9, 10.0.0.1" });
    expect(clientIp(headers, { TRUSTED_PROXY_COUNT: "2" })).toBe("203.0.113.9");
    expect(clientIp(headers, { TRUSTED_PROXY_COUNT: "0" })).toBe("unknown");
  });

  it("uses the platform header on Vercel", () => {
    const headers = h({ "x-real-ip": "198.51.100.4", "x-forwarded-for": "6.6.6.6" });
    expect(clientIp(headers, { VERCEL: "1" })).toBe("198.51.100.4");
  });
});

describe("originAllowed", () => {
  const site = "https://cybaethrex.com";

  it("allows same-host, canonical and www origins", () => {
    expect(originAllowed(h({ origin: "http://localhost:3000", host: "localhost:3000" }), site, {})).toBe(true);
    expect(originAllowed(h({ origin: "https://cybaethrex.com", host: "x.internal" }), site, {})).toBe(true);
    expect(originAllowed(h({ origin: "https://www.cybaethrex.com", host: "x.internal" }), site, {})).toBe(true);
  });

  it("allows a request with no Origin (not a browser page)", () => {
    expect(originAllowed(h({}), site, {})).toBe(true);
  });

  it("rejects other sites and look-alike hosts", () => {
    expect(originAllowed(h({ origin: "https://evil.example", host: "cybaethrex.com" }), site, {})).toBe(false);
    expect(originAllowed(h({ origin: "https://cybaethrex.com.evil.example", host: "cybaethrex.com" }), site, {})).toBe(false);
    expect(originAllowed(h({ origin: "null", host: "cybaethrex.com" }), site, {})).toBe(false);
  });

  it("allows extra origins from CONTACT_ALLOWED_ORIGINS", () => {
    const env = { CONTACT_ALLOWED_ORIGINS: "https://preview.example, https://b.example" };
    expect(originAllowed(h({ origin: "https://b.example", host: "x" }), site, env)).toBe(true);
  });
});

describe("readBodyLimited", () => {
  it("reads a body under the limit", async () => {
    const req = new Request("http://x", { method: "POST", body: "hello" });
    await expect(readBodyLimited(req, 10)).resolves.toBe("hello");
  });

  it("rejects a declared length over the limit", async () => {
    const req = new Request("http://x", {
      method: "POST",
      body: "x",
      headers: { "content-length": "999999" },
    });
    await expect(readBodyLimited(req, 10)).rejects.toBeInstanceOf(BodyTooLarge);
  });

  it("rejects a streamed body that grows past the limit", async () => {
    const stream = new ReadableStream({
      start(c) {
        for (let i = 0; i < 5; i++) c.enqueue(new TextEncoder().encode("0123456789"));
        c.close();
      },
    });
    const req = new Request("http://x", { method: "POST", body: stream, duplex: "half" } as RequestInit);
    await expect(readBodyLimited(req, 25)).rejects.toBeInstanceOf(BodyTooLarge);
  });
});

describe("field cleaning", () => {
  it("line() removes line breaks that could reach a mail header", () => {
    expect(line("Ann\r\nBcc: victim@example.com")).toBe("Ann Bcc: victim@example.com");
    expect(line("  a b  ")).toBe("a b");
    expect(line(42)).toBe("");
  });

  it("block() keeps paragraphs but drops other control characters", () => {
    expect(block("one\r\ntwo\u0007\tthree")).toBe("one\ntwo\tthree");
  });
});

describe("RateLimiter", () => {
  it("allows five per client, then limits", () => {
    const rl = new RateLimiter(1000, 5, 100);
    const results = Array.from({ length: 6 }, () => rl.limited("a", 0));
    expect(results).toEqual([false, false, false, false, false, true]);
    expect(rl.limited("b", 0)).toBe(false);
  });

  it("frees the client once the window passes", () => {
    const rl = new RateLimiter(1000, 1, 100);
    expect(rl.limited("a", 0)).toBe(false);
    expect(rl.limited("a", 500)).toBe(true);
    expect(rl.limited("a", 1500)).toBe(false);
  });

  it("caps total sends across rotating clients", () => {
    const rl = new RateLimiter(1000, 5, 3);
    expect(["a", "b", "c", "d"].map((k) => rl.limited(k, 0))).toEqual([false, false, false, true]);
  });

  it("keeps its key map bounded", () => {
    const rl = new RateLimiter(1000, 5, 1_000_000, 100);
    for (let i = 0; i < 1000; i++) rl.limited(`ip${i}`, 0);
    // @ts-expect-error reading private state for the test
    expect(rl.hits.size).toBeLessThanOrEqual(100);
  });
});

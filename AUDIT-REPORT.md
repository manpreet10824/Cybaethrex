# Cybaethrex website: security, quality and accessibility audit

Date: 2026-10-23. Scope: the full repository as uploaded (`Cybaethrex-master.zip`).
Nothing was deployed and no production system was touched. All testing ran
against a local build.

## 1. Executive summary

The site is in good shape for a marketing site. It is small, every page is
prerendered, it has no database, logins or admin area, and the code was already
careful (HTML escaping in emails, a honeypot, a non-root Docker image, and most
security headers). The real risk sat in two places:

1. **Dependencies.** Next.js 16.3.4 was within the affected range of published
   critical advisories (remote code execution and SSRF in Next.js's own image
   optimiser and caching). `npm audit` reported 2 critical, 7 high and
   3 moderate issues. **Now 0.**
2. **The contact form endpoint**, the only server code. Its rate limit could
   be bypassed, oversized bodies were parsed without a cap, and a misconfigured
   Google Apps Script receiver would silently drop enquiries while visitors saw
   "Message sent". **All fixed and covered by tests.**

Accessibility had one systemic issue: the "dim" text colour failed WCAG AA
contrast in both themes, on every page (up to 45 failures on the homepage).
**Fixed by retuning two colour tokens.** Automated checks passing does not make
the site vulnerability-free. Section 8 lists what remains.

## 2. Stack and architecture

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4,
  shadcn/Base UI primitives, GSAP, Motion and Lenis for animation.
- 20 static/SSG pages. One dynamic route: `POST /api/contact`, which delivers
  through one of: a webhook (Google Apps Script / Zapier / etc.), a Google Form,
  or Resend.
- Deploy targets: Docker standalone (App Runner/ECS), Amplify, or static export
  (`npm run build:static`, which has no API route; the form falls back to mailto).
- Client storage: `localStorage` for theme and locale only. No cookies, no
  sessions, no third-party scripts.

## 3. Findings by severity

Status key: **Fixed** = confirmed and fixed. **Open** = confirmed, not fixed.
**Risk** = potential issue needing investigation. **Rec** = best practice.

| # | Severity | Status | Finding | Where |
| --- | --- | --- | --- | --- |
| F1 | Critical | Fixed | Next.js 16.3.4 is in the affected range of advisories including unauthenticated RCE in the Image Optimization API (SVG), RCE in `use cache`, SSRF in Image Optimization, and SSG/ISR cache poisoning. The site uses `next/image`, so the optimiser endpoint was exposed on server deployments | `package.json` |
| F2 | High | Fixed | `shadcn` (a code-generation CLI) was a runtime dependency. It pulled in the MCP SDK, hono, undici, zod and others with high/critical advisories (zod memory exhaustion, undici DoS, proxy-addr spoofing, etc.). It is only needed at build time for one CSS import | `package.json` |
| F3 | Medium | Fixed | Rate limit bypass: the limiter keyed on the **first** `X-Forwarded-For` entry, which the client controls. Changing the header on each request reset the limit, so the form could be used to flood the inbox | `api/contact/route.ts` |
| F4 | Medium | Fixed | Silent loss of enquiries: Apps Script always answers HTTP 200, and returns `{"error":"forbidden"}` on a wrong secret. The route only checked `res.ok`, so it reported success while nothing was delivered | `api/contact/route.ts`, `docs/contact-apps-script.gs` |
| F5 | Medium | Fixed | Apps Script receiver could run "open": the shipped secret is a public placeholder, and the script accepted any `to` address from the request. Anyone who found the `/exec` URL could send mail as your Google account to any recipient | `docs/contact-apps-script.gs` |
| F6 | Medium | Fixed | No request body size limit: `request.json()` buffered and parsed any size of body. `engagement` items had no length limit and flowed into the email | `api/contact/route.ts` |
| F7 | Medium | Fixed | No Content-Security-Policy | `next.config.ts`, `public/_headers` |
| F8 | Low | Fixed | Rate limiter memory could grow without bound under many distinct (spoofed) addresses | `api/contact/route.ts` |
| F9 | Low | Fixed | CR/LF and control characters in name/company reached the email subject line | `api/contact/route.ts` |
| F10 | Low | Fixed | Cross-site submission: no Origin check, and the route accepted any content type | `api/contact/route.ts` |
| F11 | Low | Fixed | Spreadsheet formula injection: the Apps Script wrote raw visitor text to Google Sheets, so a value starting with `=` would run as a formula (e.g. `HYPERLINK`, `IMPORTXML`) | `docs/contact-apps-script.gs` |
| F12 | Low | Fixed | Apps Script returned raw exception text to the caller | `docs/contact-apps-script.gs` |
| F13 | Low | Fixed | No timeout on provider requests; a hung provider held the visitor on "Sending" | `api/contact/route.ts` |
| F14 | Low | Fixed | `X-Powered-By: Next.js` header advertised the framework | `next.config.ts` |
| F15 | Info | Fixed | Disclosure page and search mention `security.txt`, but none existed | `public/.well-known/` |
| A1 | AA fail | Fixed | `--muted-dim` text contrast 3.4 to 3.8:1 (dark) and 4.2 to 4.4:1 (light), below 4.5:1, on all pages | `globals.css` |
| A2 | Serious | Fixed | `aria-label` on a plain `<span>` (hero animated text) is not exposed reliably | `animated-text.tsx` |
| A3 | Serious | Fixed | Logo link name "Cybaethrex home" did not include visible "TRAINING" on `/training` | `Nav.tsx` |
| A4 | Moderate | Fixed | `/contact` had no `<h1>` | `contact/page.tsx`, `Layout.tsx` |
| A5 | Moderate | Fixed | Nav dropdowns open on hover/focus but could not be dismissed with Escape (WCAG 1.4.13) | `Nav.tsx` |
| A6 | Minor | Fixed | Active "STAGE n" label in the light theme at 4.37:1 | `globals.css` |
| R1 | Medium | Open | On Vercel serverless, the in-memory limiter only holds per warm instance. A determined flood spread across instances is not stopped. See section 9 | `api/contact/route.ts` |
| R2 | Low | Open | CSP keeps `'unsafe-inline'` for scripts. Static prerendering writes per-page inline hydration scripts, and nonces would need per-request rendering. There is no user-generated HTML on the site, so the practical XSS exposure is very low | `next.config.ts` |
| R3 | Risk | Open | If the Node server is exposed with no proxy in front, `TRUSTED_PROXY_COUNT` must be set to `0`, or the limiter can again be spoofed (verified locally with `next start` directly). The global cap of 60 sends per 10 minutes still applies | deployment |
| R4 | Risk | Open | The privacy page describes "people who sign in to the app" with hashed passwords and 2FA, but no app exists in this code. Either it refers to another system or the policy overstates | `privacy/page.tsx` |
| R5 | Minor | Open | Inactive "STAGE n" labels in the methodology timeline are deliberately faded (about 1.6:1). It is a design choice; the active stage passes | `globals.css` |
| P1 | Rec | Open | About 380 KB gzipped JavaScript on first load. Two animation libraries (GSAP and Motion) plus Lenis are the largest chunks after React. Consolidating is a design-level refactor, not done | bundle |
| C1 | Rec | Open | `/contact` copy and metadata talk about cohorts and enrolment, which is training language on a consulting-first site | `contact/page.tsx` |

## 4. Fixes and reasoning

- **Dependencies (F1, F2):** `next` 16.3.4 to 16.4.3 and `eslint-config-next`
  to match. These are patch/minor upgrades within Next 16, and the build and all
  pages were unchanged. `shadcn` moved to devDependencies (still needed by
  `npm run build` for its CSS, and Docker's build stage installs dev deps).
  Ran `npm audit fix` for transitive patches. `@types/node` moved to `^22` to
  match the Node 22 runtime in the Dockerfile, which Vitest 5 needs.
- **Rate limiting (F3, F8):** the client IP now comes from the entry appended by
  your nearest trusted proxy (`TRUSTED_PROXY_COUNT`, default 1), or from
  `x-real-ip` on Vercel. A global ceiling (60 sends per 10 minutes per instance)
  caps damage even if an address can be rotated. The key map is bounded.
  Per-client limit unchanged (5 per 10 minutes).
- **Request hygiene (F6, F9, F10, F13):** 32 KB streamed body cap (413);
  JSON content type required (415); Origin must match the request host, the
  canonical site, its www/apex twin, or `CONTACT_ALLOWED_ORIGINS` (403);
  single-line fields stripped of control characters; engagement values limited
  to the options the form offers; 10 s provider timeout; `Cache-Control: no-store`.
- **Delivery truthfulness (F4):** a 2xx response whose JSON contains `error` or
  `ok:false` is now a failure, so the visitor gets the mailto fallback instead
  of a false "sent".
- **Apps Script (F5, F11, F12):** refuses all requests while the secret is
  empty, short or still the placeholder; fixed recipient; constant-time secret
  comparison; subject stripped of line breaks; reply-to validated; Sheet cells
  that start with `= + - @` are prefixed with `'`; errors logged, not returned.
- **Headers (F7, F14):** CSP allowing only this origin, `frame-ancestors 'none'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, plus
  `Cross-Origin-Opener-Policy`. Mirrored in `public/_headers`. Dev-only
  relaxations for `next dev`. Verified with zero CSP violations on every page.
- **Accessibility (A1 to A6):** `--muted-dim` retuned from `#6b6b73` to
  `#808088` (dark) and `#74747d` to `#6a6a72` (light). Both now pass 4.5:1 on
  every surface, and the visual hierarchy against `--muted` is kept. The other
  fixes are structural with no visual change.
- **Images:** lossless recompression of the six PNGs (pixel-identical,
  verified), saving about 77 KB in total (logos about 20%).

### Intentional behaviour changes

- Submissions from another website's pages are refused (403). Same-host
  requests (including Vercel previews and localhost) still work.
- Non-JSON posts get 415. The site's own form always sent JSON.
- Engagement values that aren't among the form's seven options are dropped.
- With the Apps Script, `CONTACT_TO` on the site no longer changes the
  destination; edit `TO` inside the script.
- The Apps Script now rejects all mail until a real secret is set.

## 5. Files changed

| File | Change |
| --- | --- |
| `package.json`, `package-lock.json` | Upgrades above; `test` and `typecheck` scripts; Vitest |
| `src/lib/contact-guard.ts` (new) | Client IP, origin check, body cap, field cleaning, rate limiter, engagement list |
| `src/app/api/contact/route.ts` | Uses the guards; provider result check; timeouts; no-store |
| `src/app/contact/ContactForm.tsx` | Engagement list imported from the shared module (no visual change) |
| `docs/contact-apps-script.gs` | Hardening (F5, F11, F12) |
| `next.config.ts`, `public/_headers` | CSP, COOP, no X-Powered-By |
| `public/.well-known/security.txt` (new) | RFC 9116 contact file |
| `src/app/globals.css` | Two contrast tokens; active stage label opacity |
| `src/components/ui/animated-text.tsx` | Screen-reader text instead of span `aria-label` |
| `src/components/layout/Nav.tsx` | Escape closes dropdowns; logo label on `/training` |
| `src/components/ui/Layout.tsx`, `src/app/contact/page.tsx` | Optional `as="h1"` on `SectionHeading`; used on `/contact` |
| `public/*.png`, `src/app/*.png` | Lossless recompression |
| `tests/*`, `vitest.config.mts` (new) | 34 regression tests |
| `.env.example`, `DEPLOY.md`, `README.md` | New variables, go-live checks, commands |

## 6. Checks executed (actual results)

| Check | Result |
| --- | --- |
| `npm ci` (clean install from lockfile) | Passed |
| `npm run lint` | Passed, 0 warnings |
| `npm run typecheck` | Passed |
| `npm test` | **34/34 passed** (2 files) |
| Same route tests against the original code | 9 of 17 fail, which confirms the tests detect the original issues |
| `npm run build` | Passed, 21 routes |
| `npm run build:static` | Passed; `out/` includes `_headers` with CSP and `.well-known/security.txt` |
| `BUILD_STANDALONE=1 npm run build` + `node server.js` | Passed; home 200, CSP and HSTS present, no X-Powered-By, API validates |
| `npm audit` / `npm audit --omit=dev` | **0 vulnerabilities** (was 2 critical, 7 high, 3 moderate) |
| Secret scan (grep for keys, tokens, private keys) | No real secrets in the repo |
| Browser (Chromium, Playwright) on 12 pages, desktop and 375 px mobile | No console errors, no CSP violations, no horizontal overflow |
| axe-core accessibility, dark and light themes | Before: contrast failures on every page plus 3 other rule types. After: only R5 remains |
| Keyboard walk of header, search (Ctrl+K, Enter), Escape on menus | Visible focus ring on every stop; search navigates; Escape closes and returns focus |
| Contact form in browser with failing provider | Shows "NOT SENT" alert with a working mailto fallback |

**Not run:** `docker build` (no Docker daemon available in my environment;
the standalone server it packages was tested directly instead), Lighthouse,
real email delivery through any provider (no credentials, by design), and
anything against production.

## 7. Remaining risks

See R1 to R5, P1 and C1 in section 3.

## 8. Recommended next steps (in priority order)

1. If you host on Vercel or another serverless platform, add a shared rate
   limit (e.g. Upstash Redis, or Vercel Firewall / Cloudflare rate-limiting
   rules on `/api/contact`). It is the only way to stop a distributed flood (R1).
2. Consider a CAPTCHA-style check (Cloudflare Turnstile) on the form only if
   spam actually appears. It adds a third-party script and needs CSP changes.
3. Add CI (GitHub Actions) running `npm ci`, lint, typecheck, test, build and
   `npm audit` on every push, plus Dependabot/Renovate for Next.js patches.
4. Submit the domain to the HSTS preload list only once every subdomain serves
   HTTPS (the header already requests preload).
5. Review the bundle (P1) and contact page copy (C1) when design work allows.

## 9. Manual actions required from you

1. **Apps Script (if used):** paste the new `docs/contact-apps-script.gs`, set
   `SECRET` to a fresh random value (`openssl rand -hex 32`), check `TO`, and
   deploy a **new version** (Deploy, Manage deployments, Edit, New version).
   Set the same value as `CONTACT_WEBHOOK_SECRET` in your host.
2. **Rotate the webhook secret** if the live script ever ran with the
   placeholder `change-me-...` value, since that value is public in this repo.
   I cannot see your live config, so I can't tell whether it did.
3. **Set `TRUSTED_PROXY_COUNT`** for your hosting: `1` for App Runner, an ALB
   or a single CDN; `2` for CloudFront in front of an ALB; `0` if Node is
   exposed directly. Not needed on Vercel.
4. If the form is ever embedded on another domain, list it in
   `CONTACT_ALLOWED_ORIGINS`.
5. **Static hosting on CloudFront:** add a Response Headers Policy with the
   values in `public/_headers` (CloudFront ignores that file).
6. Renew the `Expires` date in `security.txt` before 2027-10-23.
7. Confirm or correct the privacy policy wording (R4).

No database migrations are involved.

## Round 2 (same day): follow-up improvements

Done after the first local test passed, at the owner's request.

| Change | Files | Notes |
| --- | --- | --- |
| Privacy and cookie notice on first visit, with **Accept** and **Essential only**, reopenable from "Privacy & cookie settings" in the footer | `src/lib/consent.ts`, `src/components/layout/ConsentBanner.tsx`, `Footer.tsx`, `layout.tsx` | Honest copy: the site sets no tracking cookies and runs no analytics. The answer is stored on the visitor's device only (`cyb-consent`, versioned). Any future analytics must check `useConsent().optional` before loading. Non-modal, keyboard accessible, zero axe violations in both themes |
| Privacy policy paragraph describing the notice | `src/app/privacy/page.tsx` | |
| **Pre-existing visual defect fixed:** the contact form's "Send it over" button had no background, because the shadcn primitives' colour tokens (`--primary`, `--border`, `--ring`, etc.) were never defined. They now map onto the brand palette | `src/app/globals.css` | The button is now the brand orange, matching "Contact us" in the header |
| Contact page copy rewritten consulting-first; engagement options now cover the five practices plus training and university partnership | `src/app/contact/page.tsx`, `src/lib/contact-guard.ts` | **Content change, please review the wording.** The server validates against the same list, so old option names are no longer accepted |
| GitHub Actions CI and Dependabot | `.github/workflows/ci.yml`, `.github/dependabot.yml` | Runs install, lint, typecheck, tests, `npm audit --audit-level=high`, server build and static build on every push and PR. Active once the code is in GitHub |
| Images and icons: multi-size `favicon.ico` (5 KB, was a 94 KB PNG as the only favicon), `icon-192.png`, web app manifest, `theme-color` per scheme, `sizes` hints on the logo so server deployments serve a 32 to 48 px variant instead of a 1920 px one | `src/app/favicon.ico`, `public/icon-192.png`, `src/app/manifest.ts`, `layout.tsx`, `Logo.tsx` | The logo and OG image were reviewed at full size and are sharp; no re-rendering needed |

R4 from the table above is resolved: the privacy policy covers "Cybaethrex Publisher", a separate marketing app, so the sign-in wording is intentional.

Checks re-run after round 2: lint, typecheck, 34 tests, server and static builds, `npm audit` (0), browser pass over all pages in both themes (no console errors, no CSP violations, no overflow, axe clean except the deliberately faded inactive stage labels), consent banner accept/decline/reload/reopen flow verified in Chromium.

## Round 3 (same day): design C, bold product-style landing

Requested after the backend work: a visibly new front end. A first pass (counters, marquee, gradient type on the existing layout) was rejected and reverted in full. Three mock-ups were then produced and the owner chose **C, bold product-style landing**, keeping the original tagline as the hero headline.

What changed, by file:

| Change | Files |
| --- | --- |
| Palette and surfaces: near-black ground `#050507`, brand orange brightened to `#ff8a1f` in dark (light keeps the AA-safe `#a8490a`), top radial glow, glass panels (`.glass`, `.glass-blur`, `.panel-ink`), brand gradient as type and as a one-pixel card frame (`.text-grad`, `.grad-frame`), pill badge, glowing primary button, severity chips. Every new token has a light-theme value | `src/app/globals.css` |
| Homepage hero: centred, pill badge, headline **"Where technology, security and trust come together."** with the gradient on the final phrase, two actions, and an illustrative engagement dashboard (KPIs, exposure chart, findings table, floating ISO 27001/42001 and EU AI Act badges). The caption reads "Illustration of an engagement's output · representative figures" so it is not mistaken for a product | `src/components/sections/HomeHero.tsx`, `src/components/sections/HeroDashboard.tsx` (new) |
| "At a glance" bento grid: practices and services counts read from the catalogue, the attack-path chain, the AI security tile, response time, and a framework strip | `src/components/sections/Bento.tsx` (new), `src/app/page.tsx` |
| Glass tiles for services, industries, pillars, standards, engagement models, identity; gradient-framed case cards; CTA as a glass panel with a bottom glow and gradient second line; buttons rounded with glow | `HomeSections.tsx`, `ServiceCards.tsx`, `Pillars.tsx`, `MagneticButton.tsx` |
| Inner pages: centred masthead with pill eyebrow and glass meta cards; glass cards on about, contact, services, training, methodology, universities | `src/components/ui/Layout.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/services/page.tsx`, `TrainingHero.tsx`, `Methodology.tsx`, `Universities.tsx` |
| **Defect fixed:** the animated headline could not wrap. Each character was its own span and spaces were rendered as non-breaking spaces, so a long headline overflowed on phones. Characters are now grouped per word with real spaces between words | `src/components/ui/animated-text.tsx` |

No content, route, security header, API or consent behaviour changed. The CSP is unchanged (no new inline scripts, no external assets).

Checks re-run after round 3: lint (0 warnings), typecheck, 34 tests, server build, static export build, `npm audit` (0), browser pass over all 12 routes at 1440 px and 375 px (no console errors, no CSP violations, no horizontal overflow), axe clean on every route in dark and in light. Screenshots are in `/mnt/project-files/audit/design/round3-*.png`.

## 10. Reproduce the checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build && npm start          # http://localhost:3000
npm run build:static                # static export into out/
npm audit
curl -sI http://localhost:3000/ | grep -i content-security-policy
```

To test the form locally end to end, set one provider in `.env.local` (for
example `RESEND_API_KEY` with `CONTACT_FROM` on a verified domain), run
`npm run build && npm start`, and submit `/contact`. With no provider set, the
form shows the mailto fallback, which is the designed behaviour.

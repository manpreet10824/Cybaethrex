# Deploying Cybaethrex

Next.js 16 (App Router), React 19, Tailwind CSS v4. Node 20 or newer, npm.

Every page is prerendered at build time. The only server code is one route,
`POST /api/contact`, which delivers the contact form. That single fact decides
which AWS option fits: if you can run Node, take option A or B; if you only
want static hosting, take option C and accept that the form falls back to
opening the visitor's own mail client.

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

---

## Environment variables

| Variable | When it is read | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **build time** | recommended | Canonical origin used for sitemap, robots, and Open Graph URLs. Defaults to `https://cybaethrex.com`. Must be set before `npm run build`, not after |
| `CONTACT_TO` | runtime | no | Where enquiries land. Defaults to `support@cybaethrex.com` |
| `RESEND_API_KEY` | runtime | one of these | Send through Resend |
| `CONTACT_FROM` | runtime | no | Sender for Resend. Must be on a domain verified in Resend |
| `CONTACT_WEBHOOK_URL` | runtime | one of these | POST the enquiry as JSON (Google Apps Script, Zapier, your own endpoint) |
| `CONTACT_WEBHOOK_SECRET` | runtime | no | Shared secret sent with the webhook |
| `GOOGLE_FORM_ACTION` | runtime | one of these | Submit into a Google Form |
| `GOOGLE_FORM_FIELDS` | runtime | with the above | JSON map of field names to `entry.NNN` ids |

The three delivery routes are tried in the order webhook, Google Form, Resend.
Set exactly one. With none set the form still works and falls back to the
visitor's mail client. See `README.md` for the detail, and
`docs/contact-apps-script.gs` for the Google path.

`NEXT_PUBLIC_SITE_URL` is the one that catches people out. Anything prefixed
`NEXT_PUBLIC_` is inlined into the bundle during `npm run build`, so setting it
in a runtime environment after the image is built has no effect.

---

## Option A. Container on App Runner (recommended)

Full fidelity, no Next.js hosting adapter in the path, so nothing to go stale
when Next.js releases. A `Dockerfile` is included and produces a ~200 MB image
running the standalone server as an unprivileged user.

```bash
# 1. build and test locally first
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://cybaethrex.com -t cybaethrex .
docker run -p 3000:3000 -e RESEND_API_KEY=your_key cybaethrex

# 2. push to ECR
AWS_REGION=ap-south-1
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws ecr create-repository --repository-name cybaethrex --region $AWS_REGION
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com

docker tag cybaethrex:latest $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/cybaethrex:latest
docker push $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/cybaethrex:latest
```

Then in the App Runner console: create a service from that ECR image, port
`3000`, health check path `/`. Add the runtime environment variables there, and
store `RESEND_API_KEY` in Secrets Manager rather than as a plain variable.
Attach the custom domain in App Runner, which provisions the certificate.

App Runner scales to zero-ish on low traffic and is the least AWS plumbing of
any container option. If you already run ECS Fargate, the same image drops
into a task definition behind an ALB with no changes.

---

## Option B. Amplify Hosting

Least operational work: connect the Git repository, and Amplify builds on every
push and serves both the static pages and the API route.

- Build command `npm run build`, output directory `.next`
- Add the environment variables in **App settings → Environment variables**
- Add `NEXT_PUBLIC_SITE_URL` there too, since Amplify builds the app itself

One caveat worth checking before committing to this: Amplify implements its own
Next.js support, and it has historically trailed new Next.js majors. Confirm
that the Amplify build image supports Next.js 16 in your region before
choosing it. If the build fails on an unsupported version, option A has no such
dependency.

---

## Option C. Static on S3 + CloudFront

Cheapest and simplest infrastructure, at the cost of the contact API.

```bash
NEXT_PUBLIC_SITE_URL=https://cybaethrex.com npm run build:static   # writes out/
aws s3 sync out/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id ABCD --paths "/*"
```

What changes: `out/` contains no `/api/contact`, so the form's POST fails and
it falls back to opening the visitor's mail client with everything they typed
already filled in. That is a designed path, not a broken one, but it is a
worse conversion rate than a form that submits.

If you want option C and a working form, put the one route behind API Gateway
and a Lambda, or point `CONTACT_WEBHOOK_URL` at something that accepts a
browser POST directly.

Serve the bucket through CloudFront with Origin Access Control, not as a public
website endpoint. The build sets `trailingSlash`, so map the default root
object to `index.html`.

---

## Security headers

`next.config.ts` sends HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` and `Permissions-Policy`. Those are served by the Node
server, so options A and B get them for free.

Static hosting has no server to send them, which is why the same rules are
mirrored in `public/_headers` for hosts that read that file. **CloudFront does
not read `public/_headers`.** For option C, attach a CloudFront Response
Headers Policy with the same values, or the site ships without them.

---

## After the first deploy

1. Confirm `NEXT_PUBLIC_SITE_URL` matches the real domain, then check
   `/sitemap.xml` and `/robots.txt` show that domain rather than a placeholder.
2. Submit the contact form once and confirm the email arrives at `CONTACT_TO`.
3. Check `/` and one deep route (`/services`) over the custom domain on HTTPS.
4. Point DNS at the distribution or App Runner domain.

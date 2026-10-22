# HutchGroup LLC website

Static HTML/CSS/JavaScript with a Vercel intake API using Supabase and Resend.

## Customer journey delivery

[Delivery index](docs/README.md) · [Backlog](CUSTOMER_ACQUISITION_BACKLOG.md) · [Validation](docs/UAT_RESULTS.md) · [Release readiness](docs/RELEASE_READINESS.md)

The growth branch starts from verified production, not default main. See release readiness before merging or deploying. Local tests do not establish live intake health.

## Local preview and checks

Use Node with built-in fetch support. No npm dependencies are needed.

```sh
node scripts/dev-server.mjs --fixtures
npm test
npm run check:seo
```

Preview: http://127.0.0.1:4173. The fixture server uses the actual API handler with synthetic storage/email responses; it does not create real leads or send mail. Without `--fixtures`, the local API is disabled. Set `AGENT_BROWSER_BIN` to an installed agent-browser executable to run `node scripts/browser-check.mjs`.

## Deployment

Existing Vercel project uses static output `.` and the `api/` function. Keep production credentials in the project's environment, never in this repository. `.vercelignore` excludes internal docs, evidence, fixtures and tests. Follow the linked release checklist for preview, live persistence/email verification, domain smoke testing and rollback.

The Opportunity Review form requires a Cloudflare Turnstile widget scoped to `hutchgroupllc.com`. Set `TURNSTILE_SITE_KEY` (public widget key) and `TURNSTILE_SECRET_KEY` (Vercel Secret) for Production before deploying. The browser fetches the site key from `/api/opportunity-review-config`; the submission API verifies each token with Cloudflare, including its action and hostname, before saving or emailing. Missing keys and failed verification close the intake and show the visitor the email alternative. Use Cloudflare's dummy keys only with the local fixture server; never deploy them.

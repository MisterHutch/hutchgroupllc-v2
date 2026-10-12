# Hutchgroup website Phase 1 status

Updated October 12, 2026. Phase 1 started; not complete.

## Completed

- Saved the six-week implementation plan locally; publishing to the same GitHub repository and Honcho in this session.
- Confirmed the intake database is reachable through a read-only query.
- Inspected companies, leads, opportunity_reviews, and lead_activities columns and relevant constraints. lead_activities.activity_type is text with no CHECK constraint restricting the new notification event.
- Owner confirmed hutch@hutchgroupllc.com as the test inbox and requested it be highlighted in contact areas.
- Prior live verification in this session confirmed GA4 initializes, a Google collection request is issued, Vercel tracking remains installed, and the correct Business Profile is linked. Dashboard aggregation has not been verified.

## Next execution steps

1. Replace public shannon@ contact addresses with hutch@hutchgroupllc.com in the candidate and production checkout, including relevant structured data, contact copy, and notification defaults. Inspect configured server recipients before assuming defaults control delivery. Keep customer test data out of GitHub.
2. Verify Search Console property access and record available baseline periods; no connected Search Console tool or authenticated Google management browser is currently available. User response pending.
3. Use the owner-approved inbox for one clearly labeled synthetic inquiry through the candidate preview. Inspect persistence, attribution, notification status, and follow-up ownership. Confirm actual inbox receipt with the owner separately from provider acceptance. Preserve the test record unless cleanup is explicitly agreed.
4. Reconcile the homepage candidate with current production analytics/profile additions, rerun relevant checks, and complete the release decision with concrete evidence.
5. After release, verify public routes, analytics, Ops link, footer contact, and privacy of deployment exclusions. Record actual deployment and evidence.

## Workspaces and deployment boundaries

- Staged homepage: /home/hutch/Projects/hutchgroupllc-v2, branch growth/customer-journey-2026-09-29.
- Existing production source: /home/hutch/Work/vercel-analytics-2026-09-30/site, branch analytics/visitor-behavior-2026-09-30, with local Google tag/profile additions.
- Latest production at handoff: dpl_DAG4jbUVcGmetnxb7oGxUDs9GDJ5, https://hutchgroupllc.com/.
- Latest redesign preview: https://hutchgroupllc-h9epr59na-greedy-geckozs-projects.vercel.app, dpl_GFfkUFCTv72FMX3U73TtFaxfRnLM.
- The documentation branch is docs/growth-plan-2026-10-12, based on main; do not deploy that branch as the website.
- GitHub CLI has no configured authentication; connected GitHub tools can read and write this repo. Local Git author identity is unset. Do not invent an author or discard the staged index.

## Pending evidence

Search Console baseline, GA4 dashboard readback, live candidate submission, persisted attribution, provider acceptance, inbox delivery, and homepage production release remain unverified. Do not mark these complete based on local fixture tests.

## October 12 continuation: contact, live intake, and release gate

- Owner confirmed the Search Console property is verified. Baseline clicks, impressions, CTR, average position, and top queries/pages are still pending owner-provided dashboard values; no authenticated Search Console read was available in this session.
- Replaced public `shannon@hutchgroupllc.com` contact links and homepage JSON-LD with prominently displayed `hutch@hutchgroupllc.com` in the growth candidate and the current production checkout. Updated default internal alert and customer reply-to recipients. The sender default remains `hello@hutchgroupllc.com` pending provider/domain configuration.
- Vercel project environment metadata showed `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` scoped to Production, but no `RESEND_API_KEY`. No Supabase credentials are available to preview. The connected Vercel env API returned 403, so this result came from the scoped Vercel CLI. No secret values were pulled.
- The owner-approved synthetic submission to the existing live site returned HTTP 201 and review ID `b17c379b-508e-4387-aacd-03da944eb501`. Read-only Supabase SQL confirmed one review, the synthetic company and test inbox lead, and an `opportunity_review_submitted` activity. The currently deployed API did not persist attribution from this request or return notification status. Do not treat this as an email-delivery pass. Preserve the synthetic record for audit.
- Contact-only production deployment `dpl_AeegGNQR1smRpbzHNrJN9rukGK9x` is READY and aliased to https://hutchgroupllc.com/. Public readback found the new email and the existing GA4/Vercel analytics loader; the review route returned 200. Live homepage still contains Prep because the growth redesign has not been released.
- Growth preview deployment `dpl_5d4cHZYo1cJ7XD1CMVu6zmx3Y3Hw` is READY at https://hutchgroupllc-f40dgkx3p-greedy-geckozs-projects.vercel.app. Public readback found the new email and Ops link, with no Prep mention. All five automated test files and SEO validation pass. The preview cannot complete a real intake test until the intended Supabase environment is available there.
- The redesign production release remains pending reliable notification/follow-up configuration and a controlled test of the candidate API's persistence, attribution, and notification status. The current production form now gives the direct email address and avoids promising a prompt automatic follow-up. Search Console baseline and GA4 dashboard aggregation remain pending.

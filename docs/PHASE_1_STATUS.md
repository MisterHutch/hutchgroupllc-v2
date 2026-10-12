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

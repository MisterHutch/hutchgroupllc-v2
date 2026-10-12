# Hutchgroup website Phase 1 status

Updated October 12, 2026. The Phase 1 website release and source integration are complete. Search Console baseline and analytics dashboard reporting remain open.

## Completed

- The six-week growth plan and handoff were merged through [PR #11](https://github.com/MisterHutch/hutchgroupllc-v2/pull/11); the released website source was merged through [PR #12](https://github.com/MisterHutch/hutchgroupllc-v2/pull/12). Both passed GitHub CI. The source PR's GitHub tree matched the locally tested integration tree.
- Production `https://hutchgroupllc.com/` resolves to READY deployment `dpl_J4k8YWowjoA9AQbbsZ3s3gATknDK` after both merges. Public HTTP returned 200 for the homepage and Opportunity Review, 200 for `/assets/analytics.js`, and 404 for the internal `/docs/PHASE_1_STATUS.md` path. Homepage readback found the Ops demo, prominent `hutch@hutchgroupllc.com`, and the Google Business Profile link, with no Prep destination.
- Resend domain is verified per owner. Two isolated production-target submissions returned HTTP 201, saved reviews and notification activity, and accepted both internal and customer emails. The owner confirmed receipt of all four messages. The second submission persisted allowlisted source, medium, campaign, content, entry path, and pain-point attribution.
- Local automated tests (five files), SEO validation, and diff whitespace checks passed in the integration worktree. The public analytics loader includes GA4 `G-F3N1ZTF9JS` and Vercel Web Analytics. A prior live runtime check saw GA4 initialization and a Google collection request.

## Next execution steps

1. Export the verified Search Console property's last three months of Web clicks, impressions, CTR, position, and top queries/pages. Record the Phase 1 baseline and use actual query/page demand to prioritize resource and industry content.
2. Confirm GA4 and Vercel Analytics dashboard events. A scoped Vercel Web Analytics aggregate API query on October 12 returned `404 Web Analytics not found`; this is neither a dashboard confirmation nor evidence of zero traffic. GA4 dashboard readback is also pending.
3. Begin Phase 2 page foundations from the merged growth plan. Founder photograph, publishable customer evidence, and customer outcome claims still require owner-provided material and approval. Preserve synthetic review records for audit; keep customer data out of GitHub.

## Workspaces and deployment boundaries

- Mainline source is merged at `52261128c84f42ca7a8f825da12f1305aa6e7f7b` after PRs #12 and #11. A later closeout documentation PR may advance `main` without changing website behavior.
- Original live-release checkout: `/home/hutch/Projects/hutchgroupllc-v2`, branch `growth/customer-journey-2026-09-29`, still staged locally with additional working-tree edits. Its index was not discarded.
- Isolated integration worktree: `/home/hutch/Work/hutchgroup-phase1-integration`, branch `growth/phase1-source-integration`. It passed the local checks before PR #12.
- Current production deployment: `dpl_J4k8YWowjoA9AQbbsZ3s3gATknDK`, `https://hutchgroupllc.com/`.

## Pending evidence

Search Console baseline and GA4/Vercel dashboard aggregation are pending. Candidate submission, persisted attribution, provider acceptance, owner-confirmed inbox receipt, public route readback, and mainline source integration are verified. The chronological notes below record earlier states and are superseded by this current snapshot.

## October 12 continuation: contact, live intake, and release gate

- Owner confirmed the Search Console property is verified. Baseline clicks, impressions, CTR, average position, and top queries/pages are still pending owner-provided dashboard values; no authenticated Search Console read was available in this session.
- Replaced public `shannon@hutchgroupllc.com` contact links and homepage JSON-LD with prominently displayed `hutch@hutchgroupllc.com` in the growth candidate and the current production checkout. Updated default internal alert and customer reply-to recipients. The sender default remains `hello@hutchgroupllc.com` pending provider/domain configuration.
- Vercel project environment metadata showed `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` scoped to Production, but no `RESEND_API_KEY`. No Supabase credentials are available to preview. The connected Vercel env API returned 403, so this result came from the scoped Vercel CLI. No secret values were pulled.
- The owner-approved synthetic submission to the existing live site returned HTTP 201 and review ID `b17c379b-508e-4387-aacd-03da944eb501`. Read-only Supabase SQL confirmed one review, the synthetic company and test inbox lead, and an `opportunity_review_submitted` activity. The currently deployed API did not persist attribution from this request or return notification status. Do not treat this as an email-delivery pass. Preserve the synthetic record for audit.
- Contact-only production deployment `dpl_AeegGNQR1smRpbzHNrJN9rukGK9x` is READY and aliased to https://hutchgroupllc.com/. Public readback found the new email and the existing GA4/Vercel analytics loader; the review route returned 200. Live homepage still contains Prep because the growth redesign has not been released.
- Growth preview deployment `dpl_5d4cHZYo1cJ7XD1CMVu6zmx3Y3Hw` is READY at https://hutchgroupllc-f40dgkx3p-greedy-geckozs-projects.vercel.app. Public readback found the new email and Ops link, with no Prep mention. All five automated test files and SEO validation pass. The preview cannot complete a real intake test until the intended Supabase environment is available there.
- The redesign production release remains pending reliable notification/follow-up configuration and a controlled test of the candidate API's persistence, attribution, and notification status. The current production form now gives the direct email address and avoids promising a prompt automatic follow-up. Search Console baseline and GA4 dashboard aggregation remain pending.

## Resend setup attempt and Search Console handoff

Owner selected Resend. Vercel Marketplace discovery found `resend/resend-email`; the free-plan install for `hutchgroupllc.com` in `us-east-1`, targeting Production and Preview, stopped with `integration_terms_acceptance_required` before provisioning. Owner must review and accept terms at https://vercel.com/greedy-geckozs-projects/~/integrations/accept-terms/resend?source=cli. Do not retry installation until accepted, and confirm installation state before any retry to avoid duplicate resources. Domain verification and DNS may still be required. No Resend API key is available yet.

Owner confirmed Search Console property verification and requested export steps. Use Performance > Search results, last 3 months, Web, enable clicks/impressions/CTR/position, then Export; capture totals and top Queries/Pages. Baseline values have not been received.

## Resend terms accepted; Marketplace free plan unavailable

Owner accepted Vercel Marketplace terms. Scoped CLI check found no existing Resend installation. Retry of the exact free-plan Marketplace installation returned `Billing plan is disabled: free (400)` during provisioning. Subsequent readback found no Resend installation and no `RESEND_API_KEY` in the project, so no provider was provisioned and no paid plan was selected. Resend documents the Marketplace path as requiring a domain purchased through Vercel. Public DNS readback on October 12 returned ns1.vercel-dns.com and ns2.vercel-dns.com; DNS is hosted at Vercel, but domain purchase provenance has not been established. The free Marketplace plan returned 400, so proceed through a direct Resend account instead, with domain verification and a domain-restricted Sending access key entered into Vercel Production and Preview. Do not put the key in chat or GitHub.

Prepared both site checkouts to default sender, internal recipient, and customer reply-to to `hutch@hutchgroupllc.com`; the new sender default is not deployed yet. Growth candidate fixture tests now assert the recipient routing and all five test files plus SEO pass. Wait for verified domain and project key before redeploying and running the controlled end-to-end email test.

## Resend key detected; domain verification is the remaining email gate

Owner reported a duplicate `RESEND_API_KEY` message. Scoped Vercel CLI readback confirmed hidden Secret variables for Production and general Preview, plus a separate branch-specific Preview entry for `dependabot/github_actions/actions/checkout-7`; none were read, overwritten, or deleted. Production source with `hutch@hutchgroupllc.com` sender/alert/reply defaults deployed READY as `dpl_51x3bfmA7HGgERsNCq7WgLXzkcKM` at https://hutchgroupllc.com/. Growth preview with the same defaults deployed READY as `dpl_4agiz14gWS2xnsTwkNQPrwPgc7Q5` at https://hutchgroupllc-2g93wv3wo-greedy-geckozs-projects.vercel.app.

A labeled synthetic production submission returned HTTP 201 and review ID `4e6ee98b-3f15-45ef-8876-60942b57ccce`. Read-only Supabase SQL confirmed the review and matching submission activity. Vercel runtime logs showed Resend rejected the internal alert with HTTP 403 `validation_error` because `hutchgroupllc.com` is not verified in Resend. The old production API returns success for the saved request even when notification delivery fails; do not claim an email pass or customer inbox receipt. Owner needs to finish Resend domain DNS verification before retesting. Existing HEY receive-side MX records must not be displaced by adding Resend sending records.

Public DNS verification via Google DNS-over-HTTPS on October 12 returned `ns1.vercel-dns.com` and `ns2.vercel-dns.com` for `hutchgroupllc.com`; Vercel DNS is authoritative. This corrects the earlier statement that the domain uses external DNS. Add only the exact Resend verification records to Vercel DNS or use Resend's offered one-click DNS setup; preserve existing HEY receive-side MX records.

## Saved versus emailed status fix

Production checkout API now returns separate `notifications.internal` and `notifications.customer` status after saving a review and writes an `opportunity_review_notifications` activity with those statuses. The form displays an email-on-its-way message only when both notifications were accepted; otherwise it says the request was saved, discourages duplicate submission, and points to `hutch@hutchgroupllc.com`. Local provider fixtures verified both accepted and failed paths, HTML inline script syntax passed, and `git diff --check` passed. Production deployment `dpl_r5NZzqtPqTAYKJfGhW7kt9y8Uchi` is READY at https://hutchgroupllc.com/. No new live submission was sent after this deployment because Resend domain verification remains incomplete; fixture acceptance is not provider acceptance or inbox delivery.

Vercel domain API readback showed `boughtAt: null`, confirming the domain was not purchased through Vercel even though Vercel nameservers host DNS. This is consistent with Resend's Marketplace purchase prerequisite; the exact reason for its `free` plan 400 is not independently proven.

## Resend domain pending

Owner reports `hutchgroupllc.com` is added in Resend with status `Pending`, and Resend says it may take a few hours. A fresh read-only Vercel DNS record listing still showed no Resend-specific DKIM/SPF/MX record names. This means DNS record creation is not yet verified; do not assume time alone will resolve it. Asked owner whether Resend automatic DNS setup was used or to provide the exact public DNS rows so they can be added without disturbing HEY mail records. No additional live email test was sent.

## Resend auto-configuration propagated; provider still Pending

Owner clicked Resend auto configure. Fresh Vercel DNS readback showed `resend._domainkey` TXT, `send` TXT, and `send` MX added (TTL 3600). Google public DNS-over-HTTPS returned successful answers for all three names/types. The apex MX remains `10 work-mx.app.hey.com.`, preserving HEY inbound delivery. Owner reports Resend domain status is still `Pending`; no further email test was sent because provider verification has not completed. Keep Resend Receiving disabled for this domain; the `send` MX is the outbound return-path record, not a replacement for HEY inbound MX.

## Resend provider acceptance after verification

Owner reported Resend domain Verified. A labeled synthetic production submission returned HTTP 201, review ID `503651f5-4dea-4ac2-9be7-7dcf9e271b22`, and API notification statuses `internal: accepted`, `customer: accepted`. Read-only Supabase SQL confirmed the saved review, submission activity, and notification-status activity with both accepted flags. These are provider acceptance and persistence checks, not inbox delivery. Asked owner to confirm both messages in `hutch@hutchgroupllc.com`; answer pending. Growth candidate preview still lacks Supabase variables, so its live intake remains untested. Do not mark redesigned homepage production released until candidate path and release checks are complete.

# Customer acquisition: website delivery

Initiative: HG-WEB-2026-09 · Owner: Hutch Group LLC · Started: 2026-09-29
Updated: 2026-10-13 · Phase 1 and Phase 2 page foundations released; measurement and substantive resources are next.

The current plan is [docs/GROWTH_IMPLEMENTATION_PLAN.md](docs/GROWTH_IMPLEMENTATION_PLAN.md). The earlier `HUTCHGROUP_GROWTH_PLAN.md` is a historical reference. [Phase 1 status](docs/PHASE_1_STATUS.md) separates verified release evidence from pending measurement.

| ID | Scope | Acceptance | Status |
|---|---|---|---|
| HG-WEB-101 | Consolidate homepage | One pain story, concise services and process, consistent review CTA | Released; public readback verified |
| HG-WEB-102 | Show how the work is done | Optional working-roles disclosure and accurate Ops demonstration | Released; public readback verified |
| HG-WEB-103 | Pain selection | Three keyboard-accessible choices preselect an editable review priority | Released; local regression checks passed |
| HG-WEB-104 | Proof | Real Ops capture, sample-data disclosure, approved founder portrait | Ops proof released; portrait pending owner asset |
| HG-WEB-105 | Review path | Shorter form with saved, email-status, error, and retry states | Released; controlled intake verified |
| HG-WEB-106 | Follow-up and attribution | Review persists with allowlisted attribution; email acceptance distinguished from inbox receipt | Verified with controlled submissions and owner-confirmed receipt |
| HG-WEB-107 | Local campaign | Preserve the lead-follow-up URL and improve its buyer path | Released; local SEO check passed |
| HG-WEB-108 | Distribution and measurement | Campaign drafts, tagged links, outcome tracking, dashboard review | Draft material exists locally; Search Console baseline and dashboard readback pending; external distribution not verified |
| HG-WEB-201 | Resources foundation | Useful resource hub, clear authorship, mobile access, internal links, review path | Released; public route 200, local browser and SEO checks passed |
| HG-WEB-202 | Work foundation | Accurate Ops walkthrough with sample-data disclosure; reusable customer-story evidence template | Released; customer outcome publication awaits evidence and permission |
| HG-WEB-203 | Roofing entry page | Roofing-specific estimate-to-job workflow, relevant links and FAQs | Released; priority to revisit with Search Console and customer demand |
| HG-WEB-204 | HVAC entry page | HVAC-specific inquiry-to-dispatch workflow, relevant links and FAQs | Released; priority to revisit with Search Console and customer demand |
| HG-WEB-205 | Founder proof | Approved photograph and concise relevant background | Waiting for owner-provided asset and approval |
| HG-WEB-206 | Search and analytics baseline | Three-month Search Console Web export; GA4 and Vercel dashboard events | Waiting for authenticated data; Vercel aggregate API returned `404 Web Analytics not found` |
| HG-WEB-207 | Homepage skyline backdrop | Faint full Minneapolis silhouette across the opening section, readable on desktop and mobile | Released; placement and fitted scale merged in PRs #17 and #19 |
| HG-WEB-208 | First substantive resources | Choose topics from observed search demand and buyer questions; publish two original, authored resources with clear next steps | Next after baseline review; topics and outcome claims not yet validated |
| HG-WEB-209 | Calculator and distribution | Ungated, assumption-labeled calculator; draft channel copy; verify tracking and publication separately | Planned after first resources and measurement readback |

The Phase 1 source, plan, and closeout merged through GitHub PRs [#12](https://github.com/MisterHutch/hutchgroupllc-v2/pull/12), [#11](https://github.com/MisterHutch/hutchgroupllc-v2/pull/11), and [#13](https://github.com/MisterHutch/hutchgroupllc-v2/pull/13). Production route readback passed after the merge. No customer result, paid engagement, dashboard aggregation, or external campaign publication is implied by this backlog.

Phase 2 page foundations and the initial card skyline merged through [PR #14](https://github.com/MisterHutch/hutchgroupllc-v2/pull/14). Production deployment `dpl_5hEfXGQPqhLiaBJmoToHXs7fNrMh` is READY and serves `hutchgroupllc.com`; public readback returned 200 for all four pages and the skyline asset, and 404 for internal documentation. The next evidence priority is the verified Search Console property's three-month Web export and authenticated analytics dashboard readback before selecting additional resource topics or making traffic claims.

The skyline was extended across the full homepage hero in [PR #17](https://github.com/MisterHutch/hutchgroupllc-v2/pull/17). The production CSS and SVG asset returned 200, and the new hero backdrop rule was confirmed live.

The fitted full-skyline treatment merged through [PR #19](https://github.com/MisterHutch/hutchgroupllc-v2/pull/19). On October 13, production deployment `dpl_8WeetzkWe1ChQ3nZLKuc1fFHsLEJ` was READY; the homepage, four Phase 2 routes, and skyline asset each returned 200. See [the October 13 handoff](docs/SESSION_HANDOFF_2026-10-13.md) for verified status, workspace boundaries, and the next-session pickup order.

Next priority order: (1) obtain the verified Search Console property's three-month Web export and read authenticated GA4/Vercel dashboards; (2) choose and publish the first two substantive resources using that evidence; (3) build the ungated calculator and prepare distribution with event validation. Founder photography and customer-result publication remain dependent on owner-provided assets and permission. A `404 Web Analytics not found` aggregate API response is not evidence of zero visits.

# Hutchgroup website: next-session pickup

Prepared October 13, 2026. This is a dated handoff, not a claim that deployment or dashboard state will remain unchanged.

## Verified release state

- Repository: `MisterHutch/hutchgroupllc-v2`. Use current `origin/main` for new work. The original `/home/hutch/Projects/hutchgroupllc-v2` checkout has staged and unstaged work on `growth/customer-journey-2026-09-29`; preserve it for audit.
- Phase 1 website and intake release merged through PRs #11–#13. The controlled production review saved its record and attribution; provider acceptance and owner-confirmed inbox receipt were checked. See `docs/PHASE_1_STATUS.md` for the evidence boundaries.
- Phase 2 foundations merged through PR #14: `/resources/`, `/work/`, `/industries/roofing/`, and `/industries/hvac/`. The Work page describes an Ops demonstration with sample data, not a measured customer outcome.
- Homepage skyline and link refinements merged through PRs #16–#19. The footer LinkedIn URL is `https://www.linkedin.com/in/shannonmhutcheson/`. The downtown Minneapolis SVG spans the homepage hero; PR #19 fits the full silhouette at a capped width and makes the growth card slightly translucent. Desktop and mobile screenshots were inspected before release.
- On October 13, `hutchgroupllc.com` resolved to READY Vercel production deployment `dpl_8WeetzkWe1ChQ3nZLKuc1fFHsLEJ`. Public readback returned 200 for `/`, all four Phase 2 routes, and `/assets/minneapolis-skyline.svg`. PR #19 passed 27 local tests, SEO validation of 13 HTML files and 12 indexable routes, and GitHub CI.

## Next priority and dependency order

1. **Measurement baseline (HG-WEB-206 / HG-WEB-108).** Obtain the verified Search Console property's last three months of Web export with date range, queries, pages, clicks, impressions, CTR, and average position. Read GA4 and Vercel Analytics dashboards with authenticated access and distinguish events seen there from script loading. The earlier Vercel aggregate API returned `404 Web Analytics not found`; this does not establish zero visits.
2. **First useful resources (HG-WEB-208).** Use observed search demand and buyer questions to choose the first two substantive topics. Add original examples, authorship, relevant links, and one Opportunity Review path. Do not claim rankings, traffic gains, or customer outcomes without evidence.
3. **Calculator and distribution (HG-WEB-209).** Build the ungated missed-opportunity calculator with visible assumptions and no business figures sent to analytics. Draft LinkedIn, Business Profile, and partner copy; check attribution and events before publishing. Record drafts and actual publication separately.
4. **Founder and customer proof (HG-WEB-205 / HG-WEB-202).** Approved founder photograph/background and publishable customer metrics, testimony, and permission must come from the owner. The Ops demonstration may remain live independently.

## Working boundaries

- The project backlog is `CUSTOMER_ACQUISITION_BACKLOG.md`; the delivery plan is `docs/GROWTH_IMPLEMENTATION_PLAN.md`. Keep Hutchgroup work in this repository rather than moving its backlog into AnalystOS.
- Start from a fresh branch or worktree based on current `origin/main`; preserve the original staged checkout. Check GitHub main and current Vercel production deployment before release decisions.
- Use public or approved evidence for business claims. Separate local tests, production route readback, analytics collection, dashboard reporting, qualified leads, booked calls, and revenue.
- Keep customer contact data, secrets, and synthetic review records out of GitHub. Verify live intake only with a clearly labeled controlled submission when that check is actually needed.
- Honcho workspace `codex`, peer `hutch`, session `hutch` contains this project's recent handoff history. Search terms: `Hutchgroup Phase 2 skyline Search Console resources October 2026`.

## Suggested first message for a fresh session

> Continue Hutchgroup from `docs/SESSION_HANDOFF_2026-10-13.md` on current `origin/main`. Verify the live state, then work on the Search Console and analytics baseline before choosing the first two resource topics. Preserve the staged original checkout and update the project backlog with evidence.

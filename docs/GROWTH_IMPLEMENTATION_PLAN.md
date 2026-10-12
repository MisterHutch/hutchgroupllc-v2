# Hutchgroup website growth implementation plan

Owner: Hutch Group LLC. Created October 12, 2026. Phase 1 authorized and started.

Build resources that attract visitors, proof that earns trust, and industry pages that generate qualified inquiries. Proposed delivery: six weeks, followed by 90 days of measurement. Timing is a planning cadence, not a ranking or traffic promise.

Visitor journey: search or referral → useful resource → relevant industry page → proof or Ops demonstration → free 15-minute Opportunity Review.

## Current position

Google Analytics (G-F3N1ZTF9JS), Vercel Analytics, and the verified Google Business Profile link are live. The Ops homepage redesign remains in preview. Google profile: https://maps.app.goo.gl/Y84K6aq1KBcEvKSJA. Contact address: hutch@hutchgroupllc.com, explicitly confirmed by the owner on October 12. Make this address prominent throughout contact areas.

## 1 Build the resource library

Create /resources/ with four substantive resources and one ungated calculator:

| Resource | Practical value | Destination |
|---|---|---|
| How to stop roofing estimates from going cold | Follow-up workflow and message examples | Roofing industry page |
| How to organize website, phone, and email leads | Intake checklist and ownership template | Digital Business Systems |
| What a small-business CRM implementation involves | Scope, migration, cost drivers, common mistakes | Opportunity Review |
| Practical AI for a small service business | Concrete applications, limits, implementation examples | Services and Ops |
| Missed-opportunity calculator | Scenario based on visitor-supplied assumptions | Lead follow-up service |

Validate proposed titles against Search Console and search intent before finalizing them; no search-volume claim has been established. Each resource needs original examples, clear authorship, relevant visuals, related links, and one primary next step. The calculator must show its assumptions, distinguish scenarios from forecasts, work without email capture, and keep entered business figures out of analytics.

Acceptance: four useful resources and one tested calculator; accessible on mobile, internally linked, in the sitemap, with relevant conversion paths.

## 2 Build credible proof

Create /work/ for demonstrations and customer case studies. First publishable example: How Hutchgroup Ops makes estimate follow-up visible. Use the real demo, screenshots, and a short walkthrough. Describe design decisions and label sample data accurately.

Customer case study format: starting workflow and problem; exact intervention; before/after measures and measurement period; approved customer perspective; relevant limitations. Gather evidence and permission before publishing customer outcomes. The Ops demonstration can launch independently of a customer case study.

Add an approved founder photograph, concise relevant experience, and authored-resource links. Add only genuine testimonials with approved attribution.

Acceptance: one published Ops walkthrough, reusable case-study format, and an evidence request for the first customer story. Customer-result publication depends on evidence and permission.

## 3 Build industry entry points

Start with /industries/roofing/ and /industries/hvac/. Roofing reflects the owner's experience; HVAC already has an Ops demo. Validate these priorities against customer opportunities before expanding.

Each page covers its specific lead-to-job workflow, missed handoffs, implementable services, a relevant demonstration or case study, practical FAQs, and the Opportunity Review. Preserve existing service URLs. Industry pages explain application; service pages explain capabilities. Avoid duplicated suburb pages.

Support these pages with accurate Business Profile services, genuine reviews, and relevant Twin Cities relationships. External publication and outreach are separate execution steps.

Acceptance: two differentiated industry pages, linked from the homepage and resources, with working inquiry paths and accurate local positioning.

## Delivery phases

| Phase | Proposed timing | Work | Completion gate |
|---|---|---|---|
| 1 Foundation and release | Week 1 | Verify Search Console access; establish available baseline; test live intake/email; reconcile and release staged homepage; highlight business contact email | Controlled inquiry persists, reaches intended recipients, retains attribution; release readback verified |
| 2 Page foundations | Week 2 | Resources and Work templates; two industry drafts; founder material | Mobile, navigation, metadata, accessibility checked |
| 3 Initial content | Weeks 3–4 | Industry pages, Ops walkthrough, first two resources | Claims reviewed; links and tracking verified |
| 4 Tool and distribution | Weeks 5–6 | Remaining resources, calculator, distribution material | Calculator tested; full visitor journey verified |
| 5 Measure and improve | Following 90 days | Weekly review; improve promising pages; develop real case study | Expand based on demand and lead quality |

Each substantive resource should have accompanying draft LinkedIn, Business Profile, and partner-distribution material. Do not treat drafted posts as published.

## Measurement

| Goal | Indicators | Source |
|---|---|---|
| Discovery | Nonbranded impressions and clicks by query/page | Search Console |
| Local buyers | Local queries, Business Profile website clicks, partner referrals | Search Console, Business Profile, tagged links |
| Useful content | Resource-to-service clicks, calculator completion, Ops clicks | GA4 and supported Vercel events |
| Business outcomes | Saved requests, qualified inquiries, booked calls, paid engagements | Intake records and operator-confirmed outcomes |

Extend existing event and attribution allowlists for future resources and campaigns. Never send contact details or calculator inputs to analytics. Distinguish form submission, provider acceptance, inbox delivery, qualified lead, booked call, and revenue.

Use the available historical search data and new GA4 collection to establish a baseline. Do not invent prior GA4 data or numerical traffic targets. Impressions without clicks suggest a search-presentation issue; visits without inquiries suggest relevance, proof, or conversion issues. Low-volume results need sufficient observation before conclusions.

## Owner inputs and implementation responsibilities

Owner inputs: Search Console access, approved founder photo/background, and publishable customer evidence. The owner confirmed access to hutch@hutchgroupllc.com for the controlled test and requested that address throughout contact areas. Search Console access remains to be confirmed.

Implementation can proceed on templates, drafts, calculator, Ops walkthrough, and release preparation independently of customer evidence. Verify production target before mutations; preserve the staged site work and unrelated branches.

## Retrieval and continuity

Repository: https://github.com/MisterHutch/hutchgroupllc-v2
Plan path: docs/GROWTH_IMPLEMENTATION_PLAN.md
Initial documentation branch: docs/growth-plan-2026-10-12
Phase status: docs/PHASE_1_STATUS.md
Honcho workspace: codex; session: hutch; retrieval terms: Hutchgroup website growth implementation plan Phase 1 October 12 2026.

The documentation branch is based on main for review. It is not the homepage implementation branch and must not be deployed as the current website. Main differs from the production baseline. Staged implementation lives on growth/customer-journey-2026-09-29 in the website checkout.

## Sources

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://support.google.com/business/answer/7091
- https://support.google.com/webmasters/answer/7576553

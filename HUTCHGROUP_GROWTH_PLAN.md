# Hutchgroup Growth Website: SEO and Delivery Plan

## Direction

Hutchgroup is the revenue-producing service business. It helps Minneapolis–St. Paul small businesses become easier to find, easier to choose, and easier to run through web design, local SEO, lead automation, and practical AI. Prep remains a separate Hutchgroup-built product with its own audience and conversion path.

> Hutchgroup builds practical growth systems for Twin Cities small businesses. We improve how customers find you, contact you, and get followed up with—using websites, local SEO, automation, and AI where it creates real value.

Lead with outcomes:

| Customer outcome | Hutchgroup capability |
|---|---|
| Get found locally | Local SEO and Google Business Profile |
| Turn visitors into calls | Web design and conversion optimization |
| Stop losing leads | Follow-up and intake automation |
| Reduce repetitive work | Workflow automation and practical AI |

## 90-day goals and KPIs

1. Publish locally relevant service pages.
2. Generate qualified visibility-review requests.
3. Publish at least one evidence-backed case study.
4. Establish Google Business Profile and Search Console measurement.
5. Create repeatable content and outreach workflows.

Primary conversion: request a free local visibility review.

Measure non-branded impressions, local keyword positions, Google Business Profile actions, organic CTA clicks, qualified inquiries, proposals, closed projects, reviews, citations, and referring domains. Qualified local inquiries matter more than raw traffic.

## Target market

Start with home-service contractors, automotive repair/detailing/specialty shops, and independent professional services. Prioritize Minneapolis, Saint Paul, the Twin Cities metropolitan area, and Minnesota where relevant. Do not create dozens of near-duplicate city pages.

## Recommended architecture

| Priority | Route | Search intent |
|---|---|---|
| P0 | / | Twin Cities small-business growth partner |
| P0 | /web-design/ | Small-business web design |
| P0 | /local-seo/ | Local SEO and Google visibility |
| P0 | /lead-follow-up-automation/ | Lead response and intake automation |
| P1 | /google-business-profile/ | Profile optimization |
| P1 | /industries/home-services/ | Contractor growth systems |
| P1 | /industries/automotive/ | Automotive growth systems |
| P1 | /about/ | Founder trust and philosophy |
| P1 | /case-studies/ | Evidence and outcomes |
| P1 | /contact/ | Visibility-review intake |
| P2 | /insights/ | Helpful local-business guidance |
| P2 | /products/prep/ | Prep product showcase |

Every service page needs a clear audience, problem, deliverables, process, FAQs, internal links, and one primary CTA.

## Parallel workstreams

### A — Technical SEO foundation

Suggested branch: seo/technical-foundation

- Validate the production canonical hostname and redirects.
- Add unique titles and descriptions to every route.
- Maintain robots.txt and sitemap.xml.
- Add ProfessionalService globally and Service/BreadcrumbList schema where appropriate.
- Add an owned Open Graph image and complete social metadata.
- Check semantic headings, image dimensions, lazy loading, and alt text.
- Add a useful 404 page.
- Configure Search Console, sitemap submission, analytics, and conversion events.
- Run Lighthouse and fix material accessibility, SEO, and performance problems.

Acceptance: one canonical per page; no broken/orphan links; valid schema; sitemap HTTP 200 with canonical indexable URLs only; mobile SEO 95+ with no critical accessibility or performance failures.

### B — Service pages and on-page SEO

Suggested branch: seo/service-pages

- Build web-design, local-SEO, and lead-follow-up pages.
- Map one primary query and related customer questions to each.
- Write human-first copy with natural Minneapolis–St. Paul relevance.
- Add deliverables, process, context, FAQs, internal links, and CTA.
- Avoid unverifiable rankings, client counts, and results.

Acceptance: distinct intent and copy per route; one descriptive H1; useful titles/descriptions; no keyword stuffing or cloned city-page language.

### C — Conversion and intake

Suggested branch: growth/conversion-intake

- Replace mailto-only conversion with a short visibility-review form.
- Request only name, business, website, contact method, and challenge.
- Add success, error, spam-prevention, and privacy states.
- Track CTA click, form start, completion, and source without recording field contents.
- Add a confirmation page and response-time expectation.
- Test keyboard, mobile, and screen-reader behavior.

Acceptance: successful mobile/desktop submission; no sensitive fields; observable failures; privacy-safe analytics.

### D — Local authority and proof

Suggested branch: content/local-authority

- Create or complete the Google Business Profile if eligible.
- Standardize business name, service area, contact data, URL, and categories.
- Build an ethical review-request workflow.
- Audit major directory citations.
- Secure one proof-project client with baseline-measurement permission.
- Publish a case study with the problem, work, measurable change, and quote.
- Develop local referral partners and business-group relationships.

Acceptance: no fake address/reviews/service areas; all case-study claims supported by recorded data; consistent directory information.

### E — Niche landing pages

Suggested branch: seo/niche-pages

Dependency: service-page structure and at least one real example.

- Build home-services and automotive pages first.
- Address niche-specific buying journeys, missed-lead problems, and terminology.
- Add relevant service combinations, examples, FAQs, and internal links.

Acceptance: meaningfully distinct pages; no unsupported experience claims; useful links to services and the visibility review.

### F — Prep product integration

Suggested branch: product/prep-integration

Dependency: Prep has a stable public URL and demo-ready workflow.

- Replace Coming soon with the real Prep link.
- Add an authentic screenshot or short demo.
- Add Built by Hutchgroup attribution inside Prep.
- Keep Prep analytics and conversion separate from service inquiries.
- Add SoftwareApplication schema only when published product data supports it.

Acceptance: the service/product distinction is unmistakable and both properties link to the appropriate destination.

## Sequencing

Sprint 0 is the current homepage, baseline metadata/schema, crawl files, local positioning, and Prep separation.

Sprint 1 runs A, B, and C in parallel. Merge technical changes first when they affect shared routing or layout, then rebase the service and conversion branches.

Sprint 2 runs D and E in parallel. Publish a real case study before strengthening outcome claims.

Sprint 3 runs F when Prep is demo-ready and coordinates the change with its LinkedIn launch.

## Codex handoff protocol

Each Codex session receives the exact workstream, branch, owned files/routes, acceptance criteria, and an instruction not to modify unrelated sections.

Suggested handoff prompt:

> Work on Stream [letter] from HUTCHGROUP_GROWTH_PLAN.md. Create or use branch [branch]. Own only [routes/files]. Preserve the Hutchgroup positioning and visual system. Implement every task that is not externally blocked, validate against the acceptance criteria, and finish with changes, tests, assumptions, and blockers. Do not push, merge, deploy, purchase services, or change production configuration without explicit authorization.

Merge rules:

- One workstream per branch and pull request.
- Do not mix redesign work with technical SEO.
- Rebase before handoff when shared files change.
- Require mobile and desktop review for UI work.
- Require link, metadata, schema, and sitemap tests for SEO work.
- Never commit secrets or private customer data.

## Decisions needed

- Confirm the canonical domain is exactly https://hutchgroupllc.com/.
- Decide whether to use a business-domain email instead of Gmail.
- Confirm whether Hutchgroup is an eligible service-area business.
- Select the first proof-project client and niche.
- Select the form/CRM destination and analytics platform.
- Provide the final Prep URL, screenshot, and launch timing.

## SEO reality check

The homepage creates relevance but cannot carry the strategy alone. Sustainable local visibility requires distinct service pages, accurate entities and citations, genuine reviews, useful local content, internal links, reputable local backlinks, and evidence-backed case studies. Rankings cannot be guaranteed; the objective is to build the strongest legitimate relevance, trust, and conversion signals available.

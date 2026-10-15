# Hutchgroup Homepage v3 — Progressive Tile Experience
**Created:** October 14, 2026
**Status:** Preview / review only; no production release authorized.
**Repository:** `MisterHutch/hutchgroupllc-v2`
**Preview PR:** https://github.com/MisterHutch/hutchgroupllc-v2/pull/28

## Intent
Reduce cognitive overload from vertically stacked service and AI messaging while retaining a premium, trustworthy, accessible B2B experience. Borrow the **principle** of polished horizontal product tiles, not Salesforce-specific assets or code.

## Before → After
- Before: eight major homepage sections (hero, services, campaign solutions, Ops proof, resources, AI, founder, CTA).
- After: six major sections (hero, unified horizontal solutions, featured horizontal Ops examples, compact horizontal resources, founder, CTA).
- Repeated services, AI descriptions and flagship campaigns are consolidated into one four-card solution rail.
- HVAC and office-agent examples move into a large two-card proof rail, with a real Ops screenshot for HVAC and an explicitly labeled illustrative office interaction.
- Free tools and articles move into a four-card resource rail.
- The free Opportunity Review path and full digital menu remain prominent. Skyline, brand mark, contact and founder copy are preserved.

## Experience principles
1. **Scrolling still feels like scrolling:** Native CSS grid, overflow-x and scroll snapping, not mouse wheel interception. No autoplay, timers, or external animation dependencies.
2. **Explore at your own pace:** Touch swipe, trackpad, keyboard-accessible controls, arrow buttons and visible partial next card.
3. **Help owners choose:** Four solution categories with plain-language value and working page/demo links.
4. **Demonstrate, don't fabricate:** HVAC uses the real Ops screenshot and a synthetic estimate. Flexible-office agent sequence is an *illustration*, not a live Meta connection. Avoid numerical ROI guarantees.
5. **Lightweight and inclusive:** No third-party slider library. Reduced-motion settings disable animated transitions; card content is native semantic HTML with ordinary links. No JavaScript required for manual swiping.

## Release checks
- [x] New homepage assets implemented in isolated branch.
- [x] Existing hero and Opportunity Review path preserved.
- [x] Three horizontal rails with four solution, two demo, four resource cards.
- [x] Pure unit tests for nearest slide, physical last-card bounds and back-navigation.
- [x] Vercel preview deployment and HTTP 200 readback for required assets (verify against latest commit before release).
- [ ] Independent 320/390/768/1440px visual inspection and interactive swipe/keyboard test with a real browser.
- [ ] Reduced-motion verification in browser.
- [ ] Lighthouse/performance and a11y scan; follow up on any blocking errors.
- [ ] Owner design approval.
- [ ] Compare measured demo launches and Opportunity Review completion with the old homepage. Analytics baseline is still pending; do not invent uplift.

## What not to merge accidentally
Do not change `ops.hutchgroupllc.com`, the intake API, ad accounts, payments, or production data as part of the homepage redesign. The live site remains on main until review.

## Metrics after owner-approved release
1. Traffic reaching the solution rail / demo section if consent-based instrumentation supports it.
2. Ops demo link click-through, separately from actual demo engagement.
3. Free Review requests submitted.
4. Qualified customer conversations and pilot proposals.
5. Visitor feedback: Does the carousel help them choose, or does it hide too much content?

A simpler page is only successful if qualified visitors understand it and take the next meaningful action.

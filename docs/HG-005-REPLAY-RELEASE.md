# HG-005 replay rejection release

Status on 2026-11-10: local fix and regression pass; production database change,
deployment, and live replay verification are pending.

## Why

The 2026-11-02 production check recorded two HTTP 201 responses for a labeled
submission and a replay. Cloudflare documents Turnstile tokens as single-use,
but the observed second write means the intake needs its own durable guard.
The handler now stores only a SHA-256 token digest behind a unique database key
after Siteverify accepts a token and before any lead write or email.

## Release order

1. Confirm the production Supabase project is `qajoriwhhlefnmavebia`. Apply
   `docs/HG-005-REPLAY-GUARD.sql` there. Check the table, RLS, and grants.
2. Deploy this branch after the schema check. A missing claim table makes intake
   return HTTP 503, so do not reverse this order.
3. Verify the public form's widget and that invalid and missing tokens reject
   without writes. Run one owner-approved labeled accepted submission and one
   same-token replay. The accepted request should create one review and expected
   notifications; the replay should return HTTP 403 with no second write or email.
4. Confirm database rows, provider acceptance, and inbox delivery separately.
   Record revision, deployment, request times, review ID, and notification IDs
   without storing a token or secret.
5. The two 2026-11-02 synthetic reviews have separate cleanup approval. Read
   the exact-match count and links first, then execute
   `docs/HG-005-SYNTHETIC-CLEANUP.sql` if the count is exactly two. Verify the
   label has zero remaining reviews. Keep the shared hutch@ lead.
6. Update the Hutchgroup and AnalystOS backlogs only after production evidence
   establishes replay rejection and cleanup outcome.

The token claim table can be pruned of rows older than one day in a separate
maintenance operation. The table contains token digests and timestamps only.

# Hutchgroup Backend Foundation

## Vision

Hutchgroup is moving from a marketing website to an operating platform that demonstrates the same practical modernization work we sell to small businesses.

Hutchgroup is Customer Zero.

The backend should capture real operating data, automate useful follow-up, and eventually power a private Mission Control experience that can also serve as a live sales demonstration.

## Core architecture

- **Vercel**: hosting, serverless API routes, webhooks, protected server-side orchestration
- **Supabase**: PostgreSQL system of record, future authentication, storage, realtime, row-level security
- **Resend**: transactional email and internal lead notifications
- **AI providers**: modular server-side intelligence layer for summarization, recommendation, and opportunity analysis

### Architectural rule

Provider-specific code should stay behind small service boundaries. Supabase is the initial data platform, not the business domain itself. AI providers should be replaceable without changing lead or opportunity data models.

Production secrets must never be committed to GitHub.

## Phase 1: backend foundation

### Outcome

Turn the Technology Opportunity Review from a mailto workflow into a real lead intake pipeline.

### Flow

Website form -> `/api/opportunity-review` -> validation -> deterministic opportunity score -> Supabase -> Resend notification -> confirmation response

### Phase 1 scope

1. Create PostgreSQL schema for companies, leads, opportunity reviews, service interests, and lead activity.
2. Add a Vercel serverless endpoint for Opportunity Review submissions.
3. Validate and normalize incoming data server-side.
4. Add basic bot protection using a honeypot field and payload limits.
5. Calculate an initial deterministic opportunity score.
6. Persist the submission to Supabase.
7. Send an internal lead alert using Resend when configured.
8. Update the public form to submit directly to the API.
9. Preserve graceful failure messaging if the backend is unavailable.

## Opportunity scoring v1

Scoring starts deterministic so the source of every score is explainable.

Initial dimensions:

- **Priority fit**: alignment with Hutchgroup service areas
- **Pain signal**: evidence of repetitive/manual/disconnected work
- **Commercial signal**: evidence of missed leads, conversion, or growth friction
- **Operational signal**: evidence of systems/process inefficiency
- **Specificity**: enough context to act on the request

The API stores both the numeric score and its component reasons. AI can later add qualitative analysis without becoming the source of truth for the underlying score.

## Initial data model

### companies

Represents a business or organization.

### leads

Represents the person/contact and lifecycle state of an opportunity.

Suggested lifecycle:

`new -> reviewing -> qualified -> discovery -> proposal -> won/lost`

### opportunity_reviews

Stores the submitted challenge, priority, score, score rationale, and future AI analysis.

### service_interests

Links a review/lead to one or more Hutchgroup service families.

### lead_activities

Append-only history of submissions, emails, status changes, calls, notes, and automations.

## Mission Control roadmap

### V1

Private `/admin` dashboard:

- New leads
- Qualified opportunities
- Reviews
- Follow-ups
- Pipeline
- Recent activity

### V2: Opportunity Radar

- Prioritized lead queue
- Recommended Hutchgroup service
- Opportunity score and rationale
- Suggested next action
- AI-generated discovery questions
- Estimated engagement band

### V3

- Automated follow-up sequences
- Client/project views
- Revenue and conversion analytics
- Website-to-revenue attribution
- Automation health and exception monitoring

## Environment variables

The first API route expects:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (optional during initial development)
- `LEAD_NOTIFICATION_EMAIL` (optional, defaults should not be hard-coded in production)
- `LEAD_FROM_EMAIL` (optional until a verified Resend domain is configured)

Only server-side code may access the service-role key.

## Security baseline

- Server-side validation for every field
- No secrets in browser JavaScript
- Supabase RLS enabled on public-facing tables
- Service role used only in serverless functions
- Honeypot bot field
- Conservative input size limits
- No sensitive data requested or stored by the review form
- Future admin interface requires authentication before launch

## Definition of done for Phase 1

A real user can submit an Opportunity Review from hutchgroupllc.com, receive a successful browser response, and create a normalized database record that appears in Supabase. Hutchgroup receives an internal notification when Resend is configured. Failed submissions show a useful error without losing the user's typed form data.

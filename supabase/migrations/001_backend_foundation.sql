create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  name text not null,
  email text not null,
  status text not null default 'new' check (status in ('new','reviewing','qualified','discovery','proposal','won','lost')),
  source text not null default 'opportunity_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunity_reviews (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  priority text not null,
  challenge text not null,
  opportunity_score integer not null default 0 check (opportunity_score between 0 and 100),
  score_reasons jsonb not null default '[]'::jsonb,
  ai_summary text,
  ai_recommendation text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_interests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  opportunity_review_id uuid references public.opportunity_reviews(id) on delete cascade,
  service_key text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_email on public.leads(lower(email));
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_reviews_score on public.opportunity_reviews(opportunity_score desc);
create index if not exists idx_activities_lead_created on public.lead_activities(lead_id, created_at desc);

alter table public.companies enable row level security;
alter table public.leads enable row level security;
alter table public.opportunity_reviews enable row level security;
alter table public.service_interests enable row level security;
alter table public.lead_activities enable row level security;

-- No anonymous/public policies are created intentionally.
-- The public website writes through a trusted Vercel serverless function using
-- the Supabase service-role key. A future authenticated admin dashboard should
-- add explicit read policies scoped to authorized users.

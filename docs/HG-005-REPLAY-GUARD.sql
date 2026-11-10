-- Apply to the production Supabase project before deploying the API change.
-- The API uses the service-role key on the server; no browser role needs access.
begin;

create table if not exists public.turnstile_token_claims (
  token_sha256 text primary key check (token_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

create index if not exists turnstile_token_claims_created_at_idx
  on public.turnstile_token_claims (created_at);

alter table public.turnstile_token_claims enable row level security;
revoke all on public.turnstile_token_claims from public, anon, authenticated;
grant select, insert, delete on public.turnstile_token_claims to service_role;

commit;

-- Read-only deployment checks:
-- select to_regclass('public.turnstile_token_claims');
-- select relrowsecurity from pg_class where oid = 'public.turnstile_token_claims'::regclass;
-- select grantee, privilege_type from information_schema.role_table_grants
--   where table_schema = 'public' and table_name = 'turnstile_token_claims';

-- Optional retention after deployment: token validity is five minutes.
-- delete from public.turnstile_token_claims where created_at < now() - interval '1 day';

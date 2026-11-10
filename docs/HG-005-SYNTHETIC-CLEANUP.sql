-- Hutch approved cleanup of the two labeled 2026-11-02 synthetic reviews.
-- Run only after a read-only check confirms exactly two matching rows and their links.
-- Keep the shared hutch@ lead; earlier tests may reference it.
begin;

create temp table hg005_reviews on commit drop as
select id, lead_id, company_id
from public.opportunity_reviews
where challenge = 'Synthetic HG-005 production check on 2026-11-02. Not a customer request. No follow-up needed.';

do $$
declare review_count integer;
begin
  select count(*) into review_count from hg005_reviews;
  if review_count <> 2 then
    raise exception 'Expected exactly 2 labeled HG-005 reviews, found %', review_count;
  end if;
end $$;

delete from public.service_interests
where opportunity_review_id in (select id from hg005_reviews);

delete from public.lead_activities
where metadata->>'opportunity_review_id' in (select id::text from hg005_reviews);

delete from public.opportunity_reviews
where id in (select id from hg005_reviews);

delete from public.companies c
where c.name = 'HG-005 Synthetic Check'
  and not exists (select 1 from public.opportunity_reviews r where r.company_id = c.id)
  and not exists (select 1 from public.leads l where l.company_id = c.id);

commit;

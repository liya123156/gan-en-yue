-- Private feedback: browser credentials and administrator sessions are checked
-- by the Edge Function. No direct client role can read or write this table.
create table public.gratitude_feedback (
  id uuid primary key default gen_random_uuid(),
  owner_hash text not null check (owner_hash ~ '^[0-9a-f]{64}$'),
  category text not null check (category in ('使用问题','物料需求','优化建议','其他')),
  author text not null default '' check (char_length(author) <= 80),
  message text not null check (char_length(message) between 5 and 2000),
  created_at timestamptz not null default now()
);
alter table public.gratitude_feedback enable row level security;
revoke all on public.gratitude_feedback from public, anon, authenticated;
grant select, insert on public.gratitude_feedback to service_role;
create index gratitude_feedback_owner_created_idx
  on public.gratitude_feedback (owner_hash, created_at desc, id desc);
create index gratitude_feedback_created_idx
  on public.gratitude_feedback (created_at desc, id desc);

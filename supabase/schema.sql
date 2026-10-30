-- Existing project only: axnadxkfuemmktffcehb.
-- Prepared schema; execute with the project owner's database privileges.
-- Generic professional files only: never upload customer drafts or personal data.
-- Create the gratitude-materials bucket via the Storage API (see final comments),
-- rather than inserting/updating Storage's internal metadata tables directly.

create schema if not exists gratitude_private;
revoke all on schema gratitude_private from public, anon, authenticated;
-- USAGE permits calls to the explicitly granted helper; it does not expose this
-- schema through PostgREST. Keep gratitude_private OUT of exposed API schemas.
grant usage on schema gratitude_private to anon, authenticated;

create table if not exists public.gratitude_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.gratitude_admins enable row level security;
-- This action pack has one explicitly enrolled administrator, Liya.
create unique index if not exists gratitude_one_admin
  on public.gratitude_admins ((true));
revoke all on table public.gratitude_admins from public, anon, authenticated;
grant select on table public.gratitude_admins to authenticated;
grant select, insert, update, delete on table public.gratitude_admins to service_role;

drop policy if exists "admin can inspect own membership" on public.gratitude_admins;
create policy "admin can inspect own membership"
  on public.gratitude_admins for select to authenticated
  using (user_id = (select auth.uid()));

-- The only privileged lookup lives in a non-exposed schema and accepts no
-- caller-supplied user ID. Its result always concerns the authenticated caller.
create or replace function gratitude_private.is_gratitude_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1 from public.gratitude_admins
      where user_id = (select auth.uid())
    );
$$;
revoke all on function gratitude_private.is_gratitude_admin()
  from public, anon, authenticated;
grant execute on function gratitude_private.is_gratitude_admin()
  to anon, authenticated;

-- Optional compatible RPC facade. No privileged function is exposed in public.
create or replace function public.is_gratitude_admin()
returns boolean
language sql stable security invoker
set search_path = ''
as $$ select gratitude_private.is_gratitude_admin(); $$;
revoke all on function public.is_gratitude_admin()
  from public, anon, authenticated;
grant execute on function public.is_gratitude_admin()
  to anon, authenticated;

create table if not exists public.gratitude_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) between 1 and 80),
  category text not null check (category in ('hmall', 'market', 'other')),
  file_name text not null check (length(file_name) between 1 and 255),
  size bigint not null check (size > 0 and size <= 20971520),
  mime text not null,
  storage_path text not null unique check (
    storage_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|png|jpg|jpeg|webp|xlsx|docx|pptx)$'
  ),
  source text not null default '' check (length(source) <= 120),
  document_date date not null default current_date,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.gratitude_materials enable row level security;
revoke all on table public.gratitude_materials from public, anon, authenticated;
grant select on table public.gratitude_materials to anon, authenticated;
grant insert, update, delete on table public.gratitude_materials to authenticated;
grant select, insert, update, delete on table public.gratitude_materials to service_role;

drop policy if exists "read published gratitude materials" on public.gratitude_materials;
create policy "read published gratitude materials"
  on public.gratitude_materials for select to anon, authenticated
  using (active or (select gratitude_private.is_gratitude_admin()));
drop policy if exists "admin manages gratitude materials" on public.gratitude_materials;
create policy "admin manages gratitude materials"
  on public.gratitude_materials for all to authenticated
  using ((select gratitude_private.is_gratitude_admin()))
  with check ((select gratitude_private.is_gratitude_admin()));

-- Advisory locking serializes hmall publication; the unique partial index is
-- the final database-level guarantee that concurrent writes cannot publish two.
create or replace function gratitude_private.activate_latest_hmall()
returns trigger
language plpgsql volatile security invoker
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  if new.category = 'hmall' and new.active then
    perform pg_catalog.pg_advisory_xact_lock(1818324580, 104729);
    update public.gratitude_materials
       set active = false, updated_at = pg_catalog.now()
     where category = 'hmall' and active and id <> new.id;
  end if;
  return new;
end;
$$;
revoke all on function gratitude_private.activate_latest_hmall()
  from public, anon, authenticated;
drop trigger if exists gratitude_latest_hmall on public.gratitude_materials;
create trigger gratitude_latest_hmall
  before insert or update on public.gratitude_materials
  for each row execute function gratitude_private.activate_latest_hmall();
drop function if exists public.gratitude_activate_latest_hmall();
create unique index if not exists gratitude_single_active_hmall
  on public.gratitude_materials (category)
  where category = 'hmall' and active;
create index if not exists gratitude_published_materials_latest
  on public.gratitude_materials (updated_at desc) where active;

-- Upload/replace/delete is restricted to the explicitly enrolled administrator.
-- No permissive public upload policy, public signup, or user_metadata claim
-- grants administrator privileges. Public bucket downloads are read-only.
drop policy if exists "gratitude admin storage insert" on storage.objects;
create policy "gratitude admin storage insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gratitude-materials'
    and (select gratitude_private.is_gratitude_admin()));
drop policy if exists "gratitude admin storage select" on storage.objects;
create policy "gratitude admin storage select"
  on storage.objects for select to authenticated
  using (bucket_id = 'gratitude-materials'
    and (select gratitude_private.is_gratitude_admin()));
drop policy if exists "gratitude admin storage update" on storage.objects;
create policy "gratitude admin storage update"
  on storage.objects for update to authenticated
  using (bucket_id = 'gratitude-materials'
    and (select gratitude_private.is_gratitude_admin()))
  with check (bucket_id = 'gratitude-materials'
    and (select gratitude_private.is_gratitude_admin()));
drop policy if exists "gratitude admin storage delete" on storage.objects;
create policy "gratitude admin storage delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gratitude-materials'
    and (select gratitude_private.is_gratitude_admin()));

-- Enrollment is a separate owner-only step after verifying Liya's actual Auth
-- user. Bind a verified real UUID; do not invent an ID or auto-enroll first signup.
-- insert into public.gratitude_admins(user_id) values ('VERIFIED_REAL_AUTH_UUID');
--
-- Storage API bucket settings (no credentials belong in this SQL/source):
-- id/name: gratitude-materials; public: true; file_size_limit: 20971520;
-- allowed_mime_types: application/pdf, image/png, image/jpeg, image/webp,
-- application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
-- application/vnd.openxmlformats-officedocument.wordprocessingml.document,
-- application/vnd.openxmlformats-officedocument.presentationml.presentation.
-- With a public bucket, inactive metadata hides old files from the directory;
-- a previously known public file URL remains downloadable. For immediate access
-- revocation use a private bucket plus active-file RLS and short-lived URLs.

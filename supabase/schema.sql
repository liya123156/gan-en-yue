-- Prepared for the existing project axnadxkfuemmktffcehb. Not executed remotely.
-- Run with project-owner privileges. Public visitors can read published materials.
-- Only an explicitly enrolled admin can upload or modify. No public sign-up grants admin.
create table if not exists public.gratitude_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.gratitude_admins enable row level security;
create or replace function public.is_gratitude_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.gratitude_admins where user_id = auth.uid()); $$;
revoke all on function public.is_gratitude_admin() from public;
grant execute on function public.is_gratitude_admin() to anon, authenticated;
drop policy if exists "admin can inspect own membership" on public.gratitude_admins;
create policy "admin can inspect own membership" on public.gratitude_admins for select to authenticated using(user_id=auth.uid());
grant select on public.gratitude_admins to authenticated;

create table if not exists public.gratitude_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null check(length(title) between 1 and 80),
  category text not null check(category in ('hmall','market','other')),
  file_name text not null,
  size bigint not null check(size > 0 and size <= 20971520),
  mime text not null,
  storage_path text not null unique,
  source text not null default '',
  document_date date not null default current_date,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.gratitude_materials enable row level security;
drop policy if exists "read published gratitude materials" on public.gratitude_materials;
create policy "read published gratitude materials" on public.gratitude_materials for select to anon, authenticated using(active or public.is_gratitude_admin());
drop policy if exists "admin manages gratitude materials" on public.gratitude_materials;
create policy "admin manages gratitude materials" on public.gratitude_materials for all to authenticated using(public.is_gratitude_admin()) with check(public.is_gratitude_admin());
grant select on public.gratitude_materials to anon, authenticated;
grant insert, update, delete on public.gratitude_materials to authenticated;

create or replace function public.gratitude_activate_latest_hmall()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.category='hmall' and new.active then
    update public.gratitude_materials set active=false,updated_at=now()
    where category='hmall' and active and id<>new.id;
  end if;
  return new;
end;
$$;
drop trigger if exists gratitude_latest_hmall on public.gratitude_materials;
create trigger gratitude_latest_hmall before insert or update of active,category
on public.gratitude_materials for each row execute function public.gratitude_activate_latest_hmall();

-- Public professional files only. No customer drafts or customer personal information.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('gratitude-materials','gratitude-materials',true,20971520,array['application/pdf','image/png','image/jpeg','image/webp','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict(id) do nothing;
drop policy if exists "gratitude admin storage insert" on storage.objects;
create policy "gratitude admin storage insert" on storage.objects for insert to authenticated with check(bucket_id='gratitude-materials' and public.is_gratitude_admin());
drop policy if exists "gratitude admin storage select" on storage.objects;
create policy "gratitude admin storage select" on storage.objects for select to authenticated using(bucket_id='gratitude-materials' and public.is_gratitude_admin());
drop policy if exists "gratitude admin storage update" on storage.objects;
create policy "gratitude admin storage update" on storage.objects for update to authenticated using(bucket_id='gratitude-materials' and public.is_gratitude_admin()) with check(bucket_id='gratitude-materials' and public.is_gratitude_admin());
drop policy if exists "gratitude admin storage delete" on storage.objects;
create policy "gratitude admin storage delete" on storage.objects for delete to authenticated using(bucket_id='gratitude-materials' and public.is_gratitude_admin());

-- After creating Liya's actual Auth account, enroll its returned UUID explicitly:
-- insert into public.gratitude_admins(user_id) values ('ACTUAL_AUTH_USER_UUID');
-- Never use an unknown UUID, broad role rule, browser secret key, or public admin signup.

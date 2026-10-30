-- Single administrator password login. Credentials and sessions are server-only.
create table if not exists gratitude_private.admin_credentials (
  singleton boolean primary key default true check (singleton),
  password_hash text not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz
);
create table if not exists gratitude_private.admin_sessions (
  token_hash bytea primary key,
  expires_at timestamptz not null
);
alter table gratitude_private.admin_credentials enable row level security;
alter table gratitude_private.admin_sessions enable row level security;
revoke all on gratitude_private.admin_credentials, gratitude_private.admin_sessions
  from public, anon, authenticated, service_role;
grant usage on schema gratitude_private to service_role;

create or replace function gratitude_private.admin_pin_login(p_password text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare c gratitude_private.admin_credentials%rowtype; token text; expiry timestamptz;
begin
  select * into c from gratitude_private.admin_credentials where singleton for update;
  if not found then return jsonb_build_object('configured',false); end if;
  if c.locked_until > pg_catalog.now() then
    return jsonb_build_object('configured',true,'locked',true);
  end if;
  if c.locked_until is not null then
    c.failed_attempts := 0;
  end if;
  if p_password is null or pg_catalog.length(p_password)>72
    or extensions.crypt(p_password,c.password_hash) <> c.password_hash then
    update gratitude_private.admin_credentials set
      failed_attempts=c.failed_attempts+1,
      locked_until=case when c.failed_attempts+1>=5 then pg_catalog.now()+interval '15 minutes' else null end
      where singleton;
    return jsonb_build_object('configured',true,'authenticated',false);
  end if;
  update gratitude_private.admin_credentials set failed_attempts=0,locked_until=null where singleton;
  delete from gratitude_private.admin_sessions where expires_at<=pg_catalog.now();
  token := pg_catalog.encode(extensions.gen_random_bytes(32),'hex');
  expiry := pg_catalog.now()+interval '8 hours';
  insert into gratitude_private.admin_sessions(token_hash,expires_at)
    values(extensions.digest(token,'sha256'),expiry);
  return jsonb_build_object('configured',true,'authenticated',true,'token',token,'expiresAt',expiry);
end;
$$;
create or replace function gratitude_private.admin_pin_session(p_token text,p_logout boolean default false)
returns boolean language plpgsql security definer set search_path = '' as $$
declare valid boolean;
begin
  if p_token is null or pg_catalog.length(p_token)<>64 then return false; end if;
  select exists(select 1 from gratitude_private.admin_sessions
    where token_hash=extensions.digest(p_token,'sha256') and expires_at>pg_catalog.now()) into valid;
  if p_logout then delete from gratitude_private.admin_sessions where token_hash=extensions.digest(p_token,'sha256'); end if;
  return valid;
end;
$$;
revoke all on function gratitude_private.admin_pin_login(text), gratitude_private.admin_pin_session(text,boolean)
  from public, anon, authenticated;
grant execute on function gratitude_private.admin_pin_login(text), gratitude_private.admin_pin_session(text,boolean)
  to service_role;
create or replace function public.gratitude_admin_pin_login(p_password text)
returns jsonb language sql security invoker set search_path = ''
as $$ select gratitude_private.admin_pin_login(p_password); $$;
create or replace function public.gratitude_admin_pin_session(p_token text,p_logout boolean default false)
returns boolean language sql security invoker set search_path = ''
as $$ select gratitude_private.admin_pin_session(p_token,p_logout); $$;
revoke all on function public.gratitude_admin_pin_login(text),public.gratitude_admin_pin_session(text,boolean)
  from public, anon, authenticated;
grant execute on function public.gratitude_admin_pin_login(text),public.gratitude_admin_pin_session(text,boolean)
  to service_role;

-- A password hash is enrolled separately through the owner connection.
-- Never put the password, sessions, secret keys or a usable hash into public source.

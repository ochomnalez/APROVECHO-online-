-- APROVECHO: cuentas reales, comercios y administración.
-- Aplicar en un proyecto dedicado, mediante una migración remota.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table public.ap_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null check (char_length(full_name) between 1 and 80),
  role text not null check (role in ('consumer','merchant','admin')),
  created_at timestamptz not null default now()
);
create table private.ap_founders (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table private.ap_founders enable row level security;
revoke all on private.ap_founders from public,anon,authenticated;

create function private.ap_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from public.ap_profiles where id=auth.uid() and role='admin');
$$;
revoke all on function private.ap_is_admin() from public,anon;
grant execute on function private.ap_is_admin() to authenticated;

create table public.ap_merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.ap_profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  address text not null default '' check (char_length(address)<=200),
  cuit text not null default '' check (char_length(cuit)<=20),
  category text not null default '' check (char_length(category)<=80),
  plan text not null default 'basico' check (plan in ('basico','smart','intelligence')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  review_note text not null default '' check (char_length(review_note)<=500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_merchants_status_created_idx on public.ap_merchants(status,created_at desc);
create index ap_profiles_role_created_idx on public.ap_profiles(role,created_at desc);
create table public.ap_admin_events (
  id bigint generated always as identity primary key,
  merchant_id uuid not null references public.ap_merchants(id) on delete cascade,
  actor_id uuid references public.ap_profiles(id) on delete set null,
  previous_status text not null,
  new_status text not null,
  created_at timestamptz not null default now()
);
create index ap_admin_events_merchant_idx on public.ap_admin_events(merchant_id,created_at desc);
create index ap_admin_events_actor_idx on public.ap_admin_events(actor_id);

create function private.ap_on_signup() returns trigger language plpgsql security definer set search_path = '' as $$
declare chosen_role text; person_name text; business_name text;
begin
  chosen_role := case when new.raw_user_meta_data->>'account_type'='merchant' then 'merchant' else 'consumer' end;
  if new.email_confirmed_at is not null and exists(select 1 from private.ap_founders where email=lower(new.email)) then chosen_role:='admin'; end if;
  person_name:=left(trim(coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'Usuario')),80);
  if person_name='' then person_name:='Usuario'; end if;
  insert into public.ap_profiles(id,email,full_name,role) values(new.id,lower(new.email),person_name,chosen_role);
  if chosen_role='merchant' then
    business_name:=left(trim(coalesce(nullif(new.raw_user_meta_data->>'merchant_name',''),'Mi comercio')),100);
    if business_name='' then business_name:='Mi comercio'; end if;
    insert into public.ap_merchants(owner_id,name) values(new.id,business_name);
  end if;
  return new;
end;
$$;
create function private.ap_on_verified_email() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.ap_profiles set email=lower(new.email),role=case
    when new.email_confirmed_at is not null and exists(select 1 from private.ap_founders where email=lower(new.email)) then 'admin'
    when role='admin' then 'consumer' else role end where id=new.id;
  return new;
end;
$$;
create trigger ap_signup after insert on auth.users for each row execute function private.ap_on_signup();
create trigger ap_verified_email after update of email,email_confirmed_at on auth.users for each row execute function private.ap_on_verified_email();
revoke all on function private.ap_on_signup(),private.ap_on_verified_email() from public,anon,authenticated;

create function private.ap_guard_merchant() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.owner_id is distinct from old.owner_id or new.id is distinct from old.id or new.created_at is distinct from old.created_at then raise exception 'Identidad inmutable'; end if;
  if (new.status is distinct from old.status or new.review_note is distinct from old.review_note) and not private.ap_is_admin() then raise exception 'Solo administración puede revisar comercios'; end if;
  new.updated_at:=now();
  return new;
end;
$$;
create function private.ap_log_review() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.status is distinct from new.status then
    insert into public.ap_admin_events(merchant_id,actor_id,previous_status,new_status) values(new.id,auth.uid(),old.status,new.status);
  end if;
  return new;
end;
$$;
create trigger ap_merchant_guard before update on public.ap_merchants for each row execute function private.ap_guard_merchant();
create trigger ap_merchant_review after update on public.ap_merchants for each row execute function private.ap_log_review();
revoke all on function private.ap_guard_merchant(),private.ap_log_review() from public,anon,authenticated;

alter table public.ap_profiles enable row level security;
alter table public.ap_merchants enable row level security;
alter table public.ap_admin_events enable row level security;
revoke all on public.ap_profiles,public.ap_merchants,public.ap_admin_events from public,anon,authenticated;
grant select on public.ap_profiles,public.ap_merchants,public.ap_admin_events to authenticated;
grant update(full_name) on public.ap_profiles to authenticated;
grant update(name,address,cuit,category,plan,status,review_note) on public.ap_merchants to authenticated;
create policy profiles_read on public.ap_profiles for select to authenticated using(id=(select auth.uid()) or (select private.ap_is_admin()));
create policy profiles_edit_name on public.ap_profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy merchants_read on public.ap_merchants for select to authenticated using(owner_id=(select auth.uid()) or (select private.ap_is_admin()));
create policy merchants_edit on public.ap_merchants for update to authenticated using(owner_id=(select auth.uid()) or (select private.ap_is_admin())) with check(owner_id=(select auth.uid()) or (select private.ap_is_admin()));
create policy admin_events_read on public.ap_admin_events for select to authenticated using((select private.ap_is_admin()));

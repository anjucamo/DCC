create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'Role') then
    create type "Role" as enum ('USER','BACK','ADMIN');
  end if;
end $$;

create table if not exists "User" (
  id             text primary key default gen_random_uuid()::text,
  cedula         text unique not null,
  "fullName"     text not null,
  role           "Role" not null default 'USER',
  "passwordHash" text not null,
  "createdAt"    timestamptz not null default now(),
  "updatedAt"    timestamptz not null default now()
);

create or replace function app_login_cedula(p_cedula text, p_password text)
returns table (id text, cedula text, "fullName" text, role "Role")
language plpgsql
security definer
set search_path = public
as $$
declare u "User";
begin
  select * into u from "User" where "cedula" = p_cedula;
  if not found then
    return;
  end if;
  if crypt(p_password, u."passwordHash") = u."passwordHash" then
    id := u.id;
    cedula := u.cedula;
    "fullName" := u."fullName";
    role := u.role;
    return next;
  end if;
end;
$$;

grant execute on function app_login_cedula(text, text) to anon;

insert into "User"(cedula,"fullName",role,"passwordHash")
values ('1073513192','Admin','ADMIN', crypt('Admin25**', gen_salt('bf')))
on conflict (cedula) do nothing;

-- iGAS database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ─── hospitals ───────────────────────────────────────────────
create table if not exists hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  governorate text,
  contractor_name text,
  created_at timestamptz not null default now()
);

-- ─── reports ─────────────────────────────────────────────────
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references hospitals (id) on delete cascade,
  report_date date not null,
  month int not null,
  year int not null,
  engineer_id uuid not null references auth.users (id) default auth.uid(),
  sections jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_hospital_id_idx on reports (hospital_id);
create index if not exists reports_year_month_idx on reports (year, month);

-- keep updated_at current on every edit
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_set_updated_at on reports;
create trigger reports_set_updated_at
  before update on reports
  for each row
  execute function set_updated_at();

-- ─── Row Level Security ──────────────────────────────────────
-- Any signed-in engineer can read/write; there is no public (anon) access.
-- Reports stay editable indefinitely per spec (no lock/finalize step).

alter table hospitals enable row level security;
alter table reports enable row level security;

create policy "hospitals: authenticated read" on hospitals
  for select to authenticated using (true);

create policy "hospitals: authenticated write" on hospitals
  for insert to authenticated with check (true);

create policy "hospitals: authenticated update" on hospitals
  for update to authenticated using (true) with check (true);

create policy "reports: authenticated read" on reports
  for select to authenticated using (true);

create policy "reports: authenticated write" on reports
  for insert to authenticated with check (true);

create policy "reports: authenticated update" on reports
  for update to authenticated using (true) with check (true);

create policy "hospitals: authenticated delete" on hospitals
  for delete to authenticated using (true);

create policy "reports: authenticated delete" on reports
  for delete to authenticated using (true);

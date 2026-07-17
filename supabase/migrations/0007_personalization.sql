-- ROOTMAN MONEY ROUTE — Migration 0007: personalization profiles
-- Captures short post-assessment intake used to personalize the Blueprint,
-- experiment program and Route Kit. One profile per user (latest wins).
-- Apply via `node scripts/db-migrate.mjs`.

create table if not exists public.personalization_profiles (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  session_id         uuid references public.assessment_sessions (id) on delete set null,
  goal               text not null
                       check (goal in ('first_income','side_income','replace_salary','scale')),
  monthly_target_thb integer not null default 0,
  hours_per_week     integer not null default 0,
  budget_band        text not null
                       check (budget_band in ('none','under_1k','1k_5k','over_5k')),
  audience_band      text not null
                       check (audience_band in ('none','under_1k','1k_10k','over_10k')),
  blocker            text not null
                       check (blocker in ('time','money','skill','idea','confidence','selling')),
  niche_text         text not null default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create unique index if not exists uq_personalization_user
  on public.personalization_profiles (user_id);

alter table public.personalization_profiles enable row level security;

-- Users can read their own profile (writes go through the service role).
create policy "personalization_select_own"
  on public.personalization_profiles for select
  using (auth.uid() = user_id);

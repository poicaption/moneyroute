-- ROOTMAN MONEY ROUTE — Migration 0002: reports
-- Table: reports (deterministic full report per assessment session)
-- Apply via `node scripts/db-migrate.mjs`.
-- No AI — structured_content is produced by the deterministic report engine.

-- ─────────────────────────────────────────────────────────────
-- reports
-- One current report per session (upserted on regeneration).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id                 uuid primary key default gen_random_uuid(),
  session_id         uuid not null references public.assessment_sessions (id) on delete cascade,
  user_id            uuid references auth.users (id) on delete set null,
  report_version     text not null,
  template_version   text not null,
  status             text not null default 'ready'
                       check (status in ('ready', 'stale')),
  structured_content jsonb not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (session_id)
);

create index if not exists idx_reports_user
  on public.reports (user_id);
create index if not exists idx_reports_session
  on public.reports (session_id);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- Server code uses the service role key (bypasses RLS) for writes.
-- Authenticated users may read their own reports.
-- ─────────────────────────────────────────────────────────────
alter table public.reports enable row level security;

create policy "reports_select_own"
  on public.reports for select
  using (auth.uid() = user_id);

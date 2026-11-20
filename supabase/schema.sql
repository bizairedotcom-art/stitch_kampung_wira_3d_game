-- Kampung Wira 3D - Supabase PostgreSQL Schema
-- Run this SQL in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- to store all records in normalized PostgreSQL tables.
-- Note: Until these tables are created, the server automatically uses a private
-- Supabase Storage bucket ('kampung-wira-db') + Supabase Auth so the app works immediately.

create table if not exists public.kw_parents (
  id text primary key,
  auth_user_id uuid unique,
  name text not null,
  email text not null unique,
  is_demo boolean not null default false,
  pin_code text not null default '1234',
  password_hash text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.kw_learners (
  id text primary key,
  parent_id text not null references public.kw_parents(id) on delete cascade,
  name text not null,
  age integer not null default 7,
  class_name text not null default 'Tahun 1 Bestari',
  companion_id text not null default 'rimau',
  companion_level integer not null default 1,
  companion_bond_xp integer not null default 0,
  avatar jsonb not null default '{}'::jsonb,
  coins integer not null default 120,
  stars integer not null default 0,
  xp integer not null default 0,
  level integer not null default 1,
  gems integer not null default 10,
  energy integer not null default 100,
  streak_days integer not null default 1,
  last_active_date text not null default '',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_kw_learners_parent_id on public.kw_learners(parent_id);

create table if not exists public.kw_subtopic_progress (
  id bigserial primary key,
  learner_id text not null references public.kw_learners(id) on delete cascade,
  subtopic_id text not null,
  subject_id text not null,
  chapter_id text not null default '',
  lesson_completed boolean not null default false,
  practice_completed boolean not null default false,
  assessment_score integer not null default 0,
  attempts integer not null default 0,
  best_accuracy integer not null default 0,
  stars_earned integer not null default 0,
  mastery_percent integer not null default 0,
  status text not null default 'not_started',
  last_played_at timestamptz not null default now(),
  next_revision_at timestamptz not null default now(),
  weak_topics jsonb not null default '[]'::jsonb,
  unique (learner_id, subtopic_id)
);

create table if not exists public.kw_reward_transactions (
  transaction_id text primary key,
  learner_id text not null references public.kw_learners(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  coins_delta integer not null default 0,
  stars_delta integer not null default 0,
  xp_delta integer not null default 0,
  gems_delta integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_kw_tx_learner_id on public.kw_reward_transactions(learner_id);

create table if not exists public.kw_missions (
  learner_id text not null references public.kw_learners(id) on delete cascade,
  id text not null,
  title text not null,
  description text not null,
  subject_id text,
  target_count integer not null,
  current_count integer not null default 0,
  reward_coins integer not null default 0,
  reward_stars integer not null default 0,
  claimed boolean not null default false,
  type text not null default 'daily',
  primary key (learner_id, id)
);

create table if not exists public.kw_achievements (
  learner_id text not null references public.kw_learners(id) on delete cascade,
  id text not null,
  title text not null,
  description text not null,
  icon text not null,
  category text not null default 'akademik',
  unlocked_at timestamptz,
  primary key (learner_id, id)
);

create table if not exists public.kw_inventory (
  learner_id text not null references public.kw_learners(id) on delete cascade,
  id text not null,
  name text not null,
  category text not null,
  description text not null default '',
  quantity integer not null default 1,
  cost_coins integer not null default 0,
  icon text not null default 'star',
  primary key (learner_id, id)
);

create table if not exists public.kw_villages (
  learner_id text primary key references public.kw_learners(id) on delete cascade,
  village_name text not null default 'Kampung Wira',
  buildings jsonb not null default '[]'::jsonb,
  decorations jsonb not null default '[]'::jsonb,
  unlocked_plots jsonb not null default '[]'::jsonb,
  celebrations_seen jsonb not null default '[]'::jsonb,
  time_of_day text not null default 'morning',
  updated_at timestamptz not null default now()
);

create table if not exists public.kw_artworks (
  id text primary key,
  learner_id text not null references public.kw_learners(id) on delete cascade,
  title text not null,
  motif text not null,
  data_url text not null,
  stars_earned integer not null default 3,
  displayed_in_gallery boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_kw_artworks_learner_id on public.kw_artworks(learner_id);

alter table public.kw_parents enable row level security;
alter table public.kw_learners enable row level security;
alter table public.kw_subtopic_progress enable row level security;
alter table public.kw_reward_transactions enable row level security;
alter table public.kw_missions enable row level security;
alter table public.kw_achievements enable row level security;
alter table public.kw_inventory enable row level security;
alter table public.kw_villages enable row level security;
alter table public.kw_artworks enable row level security;

create policy "parents_select_own" on public.kw_parents
  for select using (auth.uid() = auth_user_id);

create policy "learners_select_own" on public.kw_learners
  for select using (
    parent_id in (select id from public.kw_parents where auth_user_id = auth.uid())
  );

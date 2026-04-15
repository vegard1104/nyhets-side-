-- ============================================================
-- NYHETSAPPEN core schema
-- Migration 002: sources, articles, categories, XP, quiz, stats
-- ============================================================

-- --------------------------------------------------------
-- Sources
-- --------------------------------------------------------
create table if not exists public.sources (
  id text primary key,               -- e.g. 'nrk', 'vg', 'dagbladet'
  name text not null,
  url text not null,
  rss_url text,
  logo_url text,
  is_active boolean not null default true,
  requires_subscription boolean not null default false,
  created_at timestamptz not null default now()
);

-- Seed well-known Norwegian sources
insert into public.sources (id, name, url, rss_url, requires_subscription) values
  ('nrk',         'NRK',         'https://www.nrk.no',          'https://www.nrk.no/toppsaker.rss',          false),
  ('vg',          'VG',          'https://www.vg.no',           'https://www.vg.no/rss/feed/',               false),
  ('dagbladet',   'Dagbladet',   'https://www.dagbladet.no',    'https://www.dagbladet.no/nyheter/rss',      false),
  ('aftenposten', 'Aftenposten', 'https://www.aftenposten.no',  'https://www.aftenposten.no/rss',            true),
  ('tv2',         'TV 2',        'https://www.tv2.no',          'https://www.tv2.no/rss/',                   false),
  ('e24',         'E24',         'https://e24.no',              'https://e24.no/rss',                        false),
  ('aftenbladet', 'Aftenbladet', 'https://www.aftenbladet.no',  'https://www.aftenbladet.no/rss',            true)
on conflict (id) do nothing;

-- --------------------------------------------------------
-- Categories
-- --------------------------------------------------------
create table if not exists public.categories (
  id text primary key,               -- e.g. 'nyheter', 'sport'
  label text not null,               -- display label, e.g. 'Nyheter'
  icon text,
  sort_order integer not null default 0
);

insert into public.categories (id, label, sort_order) values
  ('nyheter',    'Nyheter',    1),
  ('sport',      'Sport',      2),
  ('kultur',     'Kultur',     3),
  ('teknologi',  'Teknologi',  4),
  ('økonomi',    'Økonomi',    5),
  ('politikk',   'Politikk',  6),
  ('verden',     'Verden',     7)
on conflict (id) do nothing;

-- --------------------------------------------------------
-- Articles  (persisted from RSS, keyed by content hash)
-- --------------------------------------------------------
create table if not exists public.articles (
  id text primary key,               -- md5 of article URL (12 chars), matches RSS fetcher
  title text not null,
  summary text,
  content text,
  url text not null unique,
  image_url text,
  category_id text references public.categories(id),
  source_id text references public.sources(id),
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  is_duplicate boolean not null default false,
  duplicate_of text references public.articles(id),
  view_count integer not null default 0
);

create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_articles_category_id  on public.articles(category_id);
create index if not exists idx_articles_source_id    on public.articles(source_id);
create index if not exists idx_articles_is_duplicate on public.articles(is_duplicate) where is_duplicate = false;

-- --------------------------------------------------------
-- XP levels (static reference table)
-- --------------------------------------------------------
create table if not exists public.xp_levels (
  level integer primary key,
  label text not null,
  min_xp integer not null,
  max_xp integer                     -- null for the highest level
);

insert into public.xp_levels (level, label, min_xp, max_xp) values
  (1,  'Nybegynner',    0,     99),
  (2,  'Leser',         100,   299),
  (3,  'Ivrig leser',   300,   599),
  (4,  'Nyhetselsker',  600,   999),
  (5,  'Journalist',    1000,  1799),
  (6,  'Redaktør',      1800,  2999),
  (7,  'Sjefredaktør',  3000,  4999),
  (8,  'Nyhetsmester',  5000,  null)
on conflict (level) do nothing;

-- --------------------------------------------------------
-- User XP  (one row per user)
-- --------------------------------------------------------
create table if not exists public.user_xp (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp integer not null default 0,
  streak integer not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_xp enable row level security;

create policy "Users can read own XP"
  on public.user_xp for select
  using (auth.uid() = user_id);

create policy "Users can insert own XP"
  on public.user_xp for insert
  with check (auth.uid() = user_id);

create policy "Users can update own XP"
  on public.user_xp for update
  using (auth.uid() = user_id);

-- --------------------------------------------------------
-- XP transactions log
-- --------------------------------------------------------
create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,              -- 'article_read', 'quiz_correct', 'bookmark', 'streak_bonus'
  article_id text references public.articles(id),
  created_at timestamptz not null default now()
);

alter table public.xp_transactions enable row level security;

create policy "Users can read own XP transactions"
  on public.xp_transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own XP transactions"
  on public.xp_transactions for insert
  with check (auth.uid() = user_id);

create index if not exists idx_xp_transactions_user_id on public.xp_transactions(user_id, created_at desc);

-- --------------------------------------------------------
-- Quiz questions
-- --------------------------------------------------------
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('a','b','c','d')),
  explanation text,
  kind text not null check (kind in ('daily','weekly')),
  week_number integer,               -- ISO week number, used for weekly quizzes
  active_date date,                  -- the day this question is active (daily)
  article_id text references public.articles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_questions_kind_date on public.quiz_questions(kind, active_date);
create index if not exists idx_quiz_questions_week on public.quiz_questions(week_number) where kind = 'weekly';

-- --------------------------------------------------------
-- Quiz answers (per user per question)
-- --------------------------------------------------------
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id),
  chosen_option text not null check (chosen_option in ('a','b','c','d')),
  is_correct boolean not null,
  xp_earned integer not null default 0,
  answered_at timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.quiz_answers enable row level security;

create policy "Users can read own quiz answers"
  on public.quiz_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz answers"
  on public.quiz_answers for insert
  with check (auth.uid() = user_id);

create index if not exists idx_quiz_answers_user_id on public.quiz_answers(user_id);

-- --------------------------------------------------------
-- Article statistics (aggregate reads per article)
-- --------------------------------------------------------
create table if not exists public.article_stats (
  article_id text primary key references public.articles(id),
  view_count integer not null default 0,
  unique_readers integer not null default 0,
  bookmark_count integer not null default 0,
  updated_at timestamptz not null default now()
);

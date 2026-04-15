-- User profiles table
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_read_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- XP log table (tracks all XP-earning events)
create table if not exists public.xp_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  xp_earned integer not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.xp_log enable row level security;

create policy "Users can read own xp_log"
  on public.xp_log for select
  using (auth.uid() = user_id);

create policy "Users can insert own xp_log"
  on public.xp_log for insert
  with check (auth.uid() = user_id);

create index if not exists idx_xp_log_user_id on public.xp_log(user_id);
create index if not exists idx_xp_log_created_at on public.xp_log(created_at desc);

-- Quiz tables
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  quiz_type text not null check (quiz_type in ('weekly', 'daily')),
  questions jsonb not null,
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;

create policy "Anyone can read quizzes"
  on public.quizzes for select
  using (true);

create index if not exists idx_quizzes_quiz_type on public.quizzes(quiz_type);
create index if not exists idx_quizzes_published_at on public.quizzes(published_at desc);

-- Quiz attempts table
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  answers jsonb not null,
  score integer not null,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now(),
  unique(user_id, quiz_id)
);

alter table public.quiz_attempts enable row level security;

create policy "Users can read own quiz_attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert quiz_attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create index if not exists idx_quiz_attempts_user_id on public.quiz_attempts(user_id);
create index if not exists idx_quiz_attempts_quiz_id on public.quiz_attempts(quiz_id);
create index if not exists idx_quiz_attempts_completed_at on public.quiz_attempts(completed_at desc);

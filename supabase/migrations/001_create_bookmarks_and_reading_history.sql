-- Bookmarks table
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, article_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Reading history table
create table if not exists public.reading_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text not null,
  read_at timestamptz not null default now()
);

alter table public.reading_history enable row level security;

create policy "Users can read own history"
  on public.reading_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own history"
  on public.reading_history for insert
  with check (auth.uid() = user_id);

-- Index for common queries
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_reading_history_user_id_read_at on public.reading_history(user_id, read_at desc);

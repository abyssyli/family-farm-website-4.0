create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.products (
  id text primary key,
  category_slug text not null references public.categories(slug) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  image_path text,
  image_paths text[] not null default '{}'::text[],
  price_hint text,
  external_url text,
  is_active boolean not null default true,
  stock_quantity integer, -- null means infinite/untracked
  updated_at timestamptz not null default now(),
  unique (category_slug, slug)
);

create table if not exists public.journal_posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.farm_regions (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text,
  image_path text,
  cta_label text,
  cta_href text,
  x double precision not null,
  y double precision not null
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_categories text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type inquiry_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id text references public.products(id) on delete set null,
  category_slug text not null,
  address_id uuid references public.user_addresses(id) on delete set null,
  message text not null,
  status inquiry_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.sunday_rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_date date not null,
  adult_count integer not null default 1,
  child_count integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, event_date)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  journal_post_id text references public.journal_posts(id) on delete cascade,
  content text not null,
  image_urls text[] default '{}'::text[],
  created_at timestamptz not null default now(),
  check (
    (product_id is not null and journal_post_id is null) or
    (product_id is null and journal_post_id is not null)
  )
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journal_post_id text references public.journal_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, journal_post_id)
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  ingredients text[] not null default '{}'::text[],
  instructions text[] not null default '{}'::text[],
  image_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('success','error')),
  source text not null,
  message text,
  ran_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.journal_posts enable row level security;
alter table public.farm_regions enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_addresses enable row level security;
alter table public.inquiries enable row level security;
alter table public.sunday_rsvps enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.recipes enable row level security;
alter table public.sync_runs enable row level security;

drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories" on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_products" on public.products;
create policy "public_read_products" on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_journal_posts" on public.journal_posts;
create policy "public_read_journal_posts" on public.journal_posts
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_farm_regions" on public.farm_regions;
create policy "public_read_farm_regions" on public.farm_regions
for select
to anon, authenticated
using (true);

drop policy if exists "user_manage_own_preferences" on public.user_preferences;
create policy "user_manage_own_preferences" on public.user_preferences
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_manage_own_addresses" on public.user_addresses;
create policy "user_manage_own_addresses" on public.user_addresses
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "insert_inquiries" on public.inquiries;
create policy "insert_inquiries" on public.inquiries
for insert
to anon, authenticated
with check (user_id is null or user_id = auth.uid());

drop policy if exists "read_own_inquiries" on public.inquiries;
create policy "read_own_inquiries" on public.inquiries
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "user_manage_own_rsvps" on public.sunday_rsvps;
create policy "user_manage_own_rsvps" on public.sunday_rsvps
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "public_read_comments" on public.comments;
create policy "public_read_comments" on public.comments
for select
to anon, authenticated
using (true);

drop policy if exists "user_manage_own_comments" on public.comments;
create policy "user_manage_own_comments" on public.comments
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "public_read_likes" on public.likes;
create policy "public_read_likes" on public.likes
for select
to anon, authenticated
using (true);

drop policy if exists "user_manage_own_likes" on public.likes;
create policy "user_manage_own_likes" on public.likes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "public_read_recipes" on public.recipes;
create policy "public_read_recipes" on public.recipes
for select
to anon, authenticated
using (true);

drop policy if exists "admin_read_sync_runs" on public.sync_runs;
create policy "admin_read_sync_runs" on public.sync_runs
for select
to authenticated
using (
  auth.jwt() ->> 'email' = 'admin@example.com' -- Replace with actual admin logic
);


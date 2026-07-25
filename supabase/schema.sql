-- La Fatxa — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists products (
  id text primary key,
  name text not null,
  subtitle text,
  price integer not null,
  was integer,
  cat text not null check (cat in ('Totes','Crossbody','Clutches','Mini Bags')),
  badge text check (badge in ('new','best','ltd','')),
  material text,
  dim_cm text,
  dim_in text,
  fits text[],            -- e.g. '{“13\" laptop”,“Water bottle”}'
  care text,
  size text check (size in ('small','medium','large')),
  carry text[],           -- e.g. '{crossbody,shoulder}'
  rating numeric default 5.0,
  revs integer default 0,
  image_url text,         -- Supabase Storage public URL
  created_at timestamptz default now()
);

create table if not exists variants (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(id) on delete cascade,
  name text not null,     -- color name, e.g. 'Camel'
  hex text not null,      -- swatch color
  stock integer not null default 0,
  image_url text
);

-- Public can read everything (it's a storefront)
alter table products enable row level security;
alter table variants enable row level security;
create policy "public read products" on products for select using (true);
create policy "public read variants" on variants for select using (true);

-- Only authenticated users (Fatxa) can write
create policy "auth write products" on products for all using (auth.role() = 'authenticated');
create policy "auth write variants" on variants for all using (auth.role() = 'authenticated');

-- Storage: create a public bucket named 'bags' for product photos
-- (Dashboard → Storage → New bucket → 'bags' → public)

-- Site-wide settings (hero, marquee, story, FAQs, categories) as one JSON row
create table if not exists site_settings (
  id integer primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table site_settings enable row level security;
create policy "public read settings" on site_settings for select using (true);
create policy "auth write settings" on site_settings for all using (auth.role() = 'authenticated');

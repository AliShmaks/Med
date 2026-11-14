-- UNI MED database setup
-- Run this in Supabase Dashboard > SQL Editor.
-- IMPORTANT: create the first admin user in Authentication > Users first, then
-- replace the UUID below and run the INSERT statement at the bottom.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_unimed_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2),
  category text,
  category_id uuid references public.categories(id) on delete set null,
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  image_urls text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_max_five_images check (cardinality(image_urls) <= 5)
);

create index if not exists products_active_created_idx on public.products(is_active, created_at desc);
create index if not exists products_category_idx on public.products(category_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Admins can view admin list" on public.admin_users;
create policy "Admins can view admin list" on public.admin_users for select to authenticated using (public.is_unimed_admin());

drop policy if exists "Categories are public to read" on public.categories;
create policy "Categories are public to read" on public.categories for select to anon, authenticated using (true);
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all to authenticated using (public.is_unimed_admin()) with check (public.is_unimed_admin());

drop policy if exists "Active products are public" on public.products;
create policy "Active products are public" on public.products for select to anon, authenticated using (is_active = true or public.is_unimed_admin());
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all to authenticated using (public.is_unimed_admin()) with check (public.is_unimed_admin());

-- Public bucket for catalogue photos. Only admins may upload, update or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Product images are publicly viewable" on storage.objects;
create policy "Product images are publicly viewable" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_unimed_admin());
drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_unimed_admin()) with check (bucket_id = 'product-images' and public.is_unimed_admin());
drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_unimed_admin());

-- Starter categories (safe to run more than once)
insert into public.categories (name, slug) values
 ('Dental Equipment','dental-equipment'),
 ('Dental Instruments','dental-instruments'),
 ('Sterilization','sterilization'),
 ('Medical Equipment','medical-equipment'),
 ('Accessories','accessories')
on conflict (slug) do nothing;

-- AFTER creating your first admin user in Authentication > Users, run this
-- separately after replacing the UUID with that user's actual ID:
-- insert into public.admin_users (user_id) values ('PASTE-AUTH-USER-UUID-HERE');

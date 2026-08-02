-- =============================================================
--  ÉCLAT — Bijouterie e-commerce : schéma Supabase
--  À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- Catégories ----------
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name_fr     text not null,
  name_ar     text not null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ---------- Produits ----------
-- material : 'plaque_or' | 'acier' | 'argent' | 'autre'
create table if not exists products (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid references categories(id) on delete set null,
  name_fr      text not null,
  name_ar      text,
  description_fr text,
  description_ar text,
  material     text not null default 'acier',
  price        numeric(10,2) not null default 0,
  old_price    numeric(10,2),
  stock        int not null default 0,
  images       text[] default '{}',
  is_active    boolean default true,
  is_featured  boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_material on products(material);

-- ---------- Commandes ----------
-- status : 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
create table if not exists orders (
  id             uuid primary key default uuid_generate_v4(),
  ref            text unique not null default ('CMD-' || to_char(now(),'YYMMDD') || '-' || substr(md5(random()::text),1,5)),
  customer_name  text not null,
  phone          text not null,
  wilaya         text not null,
  address        text,
  note           text,
  subtotal       numeric(10,2) not null default 0,
  shipping       numeric(10,2) not null default 0,
  total          numeric(10,2) not null default 0,
  status         text not null default 'pending',
  created_at     timestamptz default now()
);

-- ---------- Lignes de commande ----------
create table if not exists order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid references orders(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  product_name text not null,
  unit_price   numeric(10,2) not null,
  quantity     int not null default 1
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ---------- updated_at auto ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

-- =============================================================
--  Row Level Security
--  Lecture publique du catalogue ; écriture réservée aux
--  utilisateurs authentifiés (admin). Les clients peuvent
--  créer une commande (insert) sans être connectés.
-- =============================================================
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Catalogue : lecture pour tous
create policy "public read categories" on categories for select using (true);
create policy "public read products"   on products   for select using (true);

-- Catalogue : écriture pour les admins connectés
create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Commandes : le client (anon) peut créer ; l'admin peut tout voir/modifier
create policy "anyone create order"      on orders for insert with check (true);
create policy "admin read orders"        on orders for select using (auth.role() = 'authenticated');
create policy "admin update orders"      on orders for update using (auth.role() = 'authenticated');

create policy "anyone create order_items" on order_items for insert with check (true);
create policy "admin read order_items"    on order_items for select using (auth.role() = 'authenticated');

-- =============================================================
--  Storage : bucket public pour les images produits
-- =============================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');
create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

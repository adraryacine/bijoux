-- =============================================================
--  ÉCLAT — Fonction de création de commande atomique
--  À exécuter dans : Supabase Dashboard > SQL Editor > New query
--
--  Pourquoi une fonction ?
--   1) Le stock doit être décrémenté au moment de la commande.
--   2) Le client (anon) n'a PAS le droit d'écrire dans `products`
--      (RLS). Une fonction `security definer` s'exécute avec les
--      droits du propriétaire et contourne le RLS de façon contrôlée.
--   3) `for update` verrouille les lignes produit : deux commandes
--      simultanées ne peuvent pas vendre le même stock deux fois.
-- =============================================================

create or replace function create_order(
  p_customer_name text,
  p_phone         text,
  p_wilaya        text,
  p_address       text,
  p_note          text,
  p_subtotal      numeric,
  p_shipping      numeric,
  p_items         jsonb
) returns orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order      orders;
  v_item       jsonb;
  v_product_id uuid;
  v_qty        int;
  v_product    products;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Panier vide';
  end if;

  -- 1) Vérifier + verrouiller le stock de chaque produit
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty        := (v_item->>'quantity')::int;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Quantité invalide';
    end if;

    select * into v_product from products where id = v_product_id for update;

    if not found then
      raise exception 'Produit introuvable';
    end if;

    if v_product.stock < v_qty then
      -- Message reconnu côté client pour afficher une erreur propre.
      raise exception 'STOCK_INSUFFISANT:%', v_product.name_fr;
    end if;
  end loop;

  -- 2) Créer la commande (total recalculé côté serveur, jamais celui du client)
  insert into orders (customer_name, phone, wilaya, address, note, subtotal, shipping, total)
  values (
    p_customer_name, p_phone, p_wilaya, p_address, p_note,
    p_subtotal, p_shipping, p_subtotal + p_shipping
  )
  returning * into v_order;

  -- 3) Créer les lignes de commande + décrémenter le stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty        := (v_item->>'quantity')::int;

    insert into order_items (order_id, product_id, product_name, unit_price, quantity)
    values (
      v_order.id,
      v_product_id,
      v_item->>'product_name',
      (v_item->>'unit_price')::numeric,
      v_qty
    );

    update products set stock = stock - v_qty where id = v_product_id;
  end loop;

  return v_order;
end;
$$;

-- Le client anonyme et l'admin peuvent appeler la fonction.
grant execute on function create_order(text,text,text,text,text,numeric,numeric,jsonb)
  to anon, authenticated;

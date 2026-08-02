-- =============================================================
--  Données de démonstration (facultatif)
--  À exécuter APRÈS schema.sql
-- =============================================================

insert into categories (slug, name_fr, name_ar, sort_order) values
  ('bagues',    'Bagues',    'خواتم',   1),
  ('colliers',  'Colliers',  'قلادات',  2),
  ('bracelets', 'Bracelets', 'أساور',   3),
  ('boucles',   'Boucles d''oreilles', 'أقراط', 4),
  ('ensembles', 'Ensembles', 'أطقم',    5)
on conflict (slug) do nothing;

-- Produits d'exemple (utilise des images de démonstration Unsplash)
with c as (select slug, id from categories)
insert into products (category_id, name_fr, name_ar, description_fr, description_ar, material, price, old_price, stock, images, is_active, is_featured)
values
  ((select id from c where slug='bagues'),    'Bague Solitaire Or', 'خاتم سوليتير ذهبي', 'Bague plaqué or 18k, finition brillante, zircon central.', 'خاتم مطلي بالذهب عيار 18، لمسة لامعة.', 'plaque_or', 3500, 4200, 12, array['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'], true, true),
  ((select id from c where slug='colliers'),  'Collier Perle Acier', 'قلادة لؤلؤ ستيل', 'Collier en acier inoxydable, pendentif perle nacrée.', 'قلادة من الستانلس ستيل مع لؤلؤة.', 'acier', 2200, null, 20, array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'], true, true),
  ((select id from c where slug='bracelets'), 'Bracelet Jonc Argent', 'سوار فضي', 'Bracelet en argent 925, design épuré et intemporel.', 'سوار من الفضة عيار 925.', 'argent', 4800, null, 8, array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'], true, true),
  ((select id from c where slug='boucles'),   'Boucles Puces Or', 'أقراط ذهبية', 'Boucles d''oreilles plaqué or, petites puces zircon.', 'أقراط مطلية بالذهب.', 'plaque_or', 1800, 2300, 30, array['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'], true, false),
  ((select id from c where slug='ensembles'), 'Parure Complète Acier', 'طقم كامل', 'Ensemble collier + boucles + bracelet assortis, acier doré.', 'طقم كامل من الستيل المطلي.', 'acier', 5500, 6900, 6, array['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800'], true, true),
  ((select id from c where slug='bagues'),    'Bague Fantaisie Fleur', 'خاتم زهرة', 'Bague fantaisie motif fleur, plaqué or rose.', 'خاتم بتصميم زهرة.', 'plaque_or', 2600, null, 15, array['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800'], true, false)
;

// Données de démonstration utilisées tant que Supabase n'est pas configuré.
// Permet de présenter le site au client immédiatement.
export const demoCategories = [
  { id: 'c1', slug: 'bagues', name_fr: 'Bagues', name_ar: 'خواتم', sort_order: 1 },
  { id: 'c2', slug: 'colliers', name_fr: 'Colliers', name_ar: 'قلادات', sort_order: 2 },
  { id: 'c3', slug: 'bracelets', name_fr: 'Bracelets', name_ar: 'أساور', sort_order: 3 },
  { id: 'c4', slug: 'boucles', name_fr: "Boucles d'oreilles", name_ar: 'أقراط', sort_order: 4 },
  { id: 'c5', slug: 'ensembles', name_fr: 'Ensembles', name_ar: 'أطقم', sort_order: 5 },
]

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`

export const demoProducts = [
  {
    id: 'p1', category_id: 'c1', name_fr: 'Bague Solitaire Or', name_ar: 'خاتم سوليتير ذهبي',
    description_fr: 'Bague plaqué or 18k, finition brillante, zircon central étincelant.',
    description_ar: 'خاتم مطلي بالذهب عيار 18، لمسة لامعة مع حجر زركون.',
    material: 'plaque_or', price: 3500, old_price: 4200, stock: 12,
    images: [img('1605100804763-247f67b3557e')], is_active: true, is_featured: true,
  },
  {
    id: 'p2', category_id: 'c2', name_fr: 'Collier Perle Acier', name_ar: 'قلادة لؤلؤ ستيل',
    description_fr: 'Collier en acier inoxydable 316L, pendentif perle nacrée intemporel.',
    description_ar: 'قلادة من الستانلس ستيل مع لؤلؤة.',
    material: 'acier', price: 2200, old_price: null, stock: 20,
    images: [img('1599643478518-a784e5dc4c8f')], is_active: true, is_featured: true,
  },
  {
    id: 'p3', category_id: 'c3', name_fr: 'Bracelet Jonc Argent', name_ar: 'سوار فضي',
    description_fr: 'Bracelet en argent 925, design épuré et intemporel.',
    description_ar: 'سوار من الفضة عيار 925.',
    material: 'argent', price: 4800, old_price: null, stock: 8,
    images: [img('1611591437281-460bfbe1220a')], is_active: true, is_featured: true,
  },
  {
    id: 'p4', category_id: 'c4', name_fr: 'Boucles Puces Or', name_ar: 'أقراط ذهبية',
    description_fr: "Boucles d'oreilles plaqué or, petites puces zircon discrètes.",
    description_ar: 'أقراط مطلية بالذهب.',
    material: 'plaque_or', price: 1800, old_price: 2300, stock: 30,
    images: [img('1535632066927-ab7c9ab60908')], is_active: true, is_featured: false,
  },
  {
    id: 'p5', category_id: 'c5', name_fr: 'Parure Complète Acier', name_ar: 'طقم كامل',
    description_fr: 'Ensemble collier + boucles + bracelet assortis, acier doré.',
    description_ar: 'طقم كامل من الستيل المطلي.',
    material: 'acier', price: 5500, old_price: 6900, stock: 6,
    images: [img('1602173574767-37ac01994b2a')], is_active: true, is_featured: true,
  },
  {
    id: 'p6', category_id: 'c1', name_fr: 'Bague Fantaisie Fleur', name_ar: 'خاتم زهرة',
    description_fr: 'Bague fantaisie motif fleur, plaqué or rose délicat.',
    description_ar: 'خاتم بتصميم زهرة.',
    material: 'plaque_or', price: 2600, old_price: null, stock: 15,
    images: [img('1603561591411-07134e71a2a9')], is_active: true, is_featured: false,
  },
  {
    id: 'p7', category_id: 'c2', name_fr: 'Chaîne Fine Argent', name_ar: 'سلسلة فضية رفيعة',
    description_fr: 'Chaîne fine en argent 925, à porter seule ou avec un pendentif.',
    description_ar: 'سلسلة رفيعة من الفضة عيار 925.',
    material: 'argent', price: 3200, old_price: null, stock: 18,
    images: [img('1515562141207-7a88fb7ce338')], is_active: true, is_featured: false,
  },
  {
    id: 'p8', category_id: 'c3', name_fr: 'Bracelet Maille Or', name_ar: 'سوار ذهبي',
    description_fr: 'Bracelet maille plaqué or, fermoir sécurisé, élégant au quotidien.',
    description_ar: 'سوار مطلي بالذهب بإغلاق آمن.',
    material: 'plaque_or', price: 2900, old_price: 3500, stock: 0,
    images: [img('1611652022419-a9419f74343d')], is_active: true, is_featured: false,
  },
]

import { createContext, useContext, useEffect, useState } from 'react'

const translations = {
  fr: {
    dir: 'ltr',
    // Nav
    brand_tagline: 'Bijouterie fantaisie',
    home: 'Accueil',
    shop: 'Boutique',
    about: 'À propos',
    contact: 'Contact',
    cart: 'Panier',
    admin: 'Admin',
    search_placeholder: 'Rechercher un bijou…',
    // Home
    hero_title: "L'éclat qui vous ressemble",
    hero_subtitle: 'Bijoux plaqué or, acier inoxydable et argent. Qualité, élégance et prix justes.',
    hero_cta: 'Découvrir la collection',
    featured: 'Nos coups de cœur',
    featured_sub: 'Une sélection de pièces à ne pas manquer',
    categories: 'Catégories',
    view_all: 'Voir tout',
    why_us: 'Pourquoi nous choisir',
    why_quality: 'Qualité garantie',
    why_quality_d: 'Matériaux durables : plaqué or, acier 316L, argent 925.',
    why_ship: 'Livraison 58 wilayas',
    why_ship_d: 'Livraison à domicile partout en Algérie, paiement à la réception.',
    why_price: 'Prix justes',
    why_price_d: 'Le meilleur rapport qualité-prix, sans intermédiaire.',
    // Shop
    all: 'Tout',
    filters: 'Filtres',
    material: 'Matière',
    sort: 'Trier',
    sort_new: 'Nouveautés',
    sort_price_asc: 'Prix croissant',
    sort_price_desc: 'Prix décroissant',
    no_products: 'Aucun produit trouvé.',
    // Product
    add_to_cart: 'Ajouter au panier',
    out_of_stock: 'Rupture de stock',
    in_stock: 'En stock',
    only_left: 'Plus que {n} en stock',
    stock_insufficient: 'Stock insuffisant pour « {name} ». Veuillez ajuster votre panier.',
    description: 'Description',
    related: 'Vous aimerez aussi',
    back_to_shop: 'Retour à la boutique',
    // Cart
    your_cart: 'Votre panier',
    cart_empty: 'Votre panier est vide.',
    continue_shopping: 'Continuer mes achats',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    total: 'Total',
    checkout: 'Passer la commande',
    remove: 'Retirer',
    quantity: 'Quantité',
    // Checkout
    checkout_title: 'Finaliser la commande',
    delivery_info: 'Informations de livraison',
    full_name: 'Nom complet',
    phone: 'Téléphone',
    wilaya: 'Wilaya',
    select_wilaya: 'Choisir une wilaya',
    address: 'Adresse',
    note: 'Note (facultatif)',
    order_summary: 'Récapitulatif',
    payment_cod: 'Paiement à la livraison (COD)',
    place_order: 'Confirmer la commande',
    placing: 'Envoi en cours…',
    required: 'Ce champ est requis',
    // Success
    order_success: 'Commande confirmée !',
    order_success_d: 'Merci pour votre confiance. Nous vous contacterons pour confirmer la livraison.',
    order_ref: 'Référence',
    back_home: "Retour à l'accueil",
    // Footer
    footer_about: 'Votre bijouterie de confiance : plaqué or, acier et argent, livrés partout en Algérie.',
    quick_links: 'Liens rapides',
    footer_contact: 'Contact',
    rights: 'Tous droits réservés.',
    // Admin
    dashboard: 'Tableau de bord',
    login: 'Connexion',
    logout: 'Déconnexion',
    email: 'E-mail',
    password: 'Mot de passe',
    products: 'Produits',
    orders: 'Commandes',
    revenue: 'Chiffre d\'affaires',
    total_orders: 'Commandes',
    total_products: 'Produits',
    low_stock: 'Stock faible',
    recent_orders: 'Commandes récentes',
    add_product: 'Ajouter un produit',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    status: 'Statut',
    price: 'Prix',
    stock: 'Stock',
    name: 'Nom',
    category: 'Catégorie',
    actions: 'Actions',
    confirm_delete: 'Confirmer la suppression ?',
    currency: 'DA',
  },
  ar: {
    dir: 'rtl',
    brand_tagline: 'مجوهرات عصرية',
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    admin: 'الإدارة',
    search_placeholder: 'ابحث عن قطعة…',
    hero_title: 'بريقٌ يشبهك',
    hero_subtitle: 'مجوهرات مطلية بالذهب، ستانلس ستيل وفضة. جودة وأناقة وأسعار مناسبة.',
    hero_cta: 'اكتشف المجموعة',
    featured: 'مختاراتنا',
    featured_sub: 'قطع مميزة لا تفوّتها',
    categories: 'الأصناف',
    view_all: 'عرض الكل',
    why_us: 'لماذا نحن',
    why_quality: 'جودة مضمونة',
    why_quality_d: 'مواد متينة: مطلي بالذهب، ستيل 316L، فضة 925.',
    why_ship: 'توصيل 58 ولاية',
    why_ship_d: 'توصيل إلى باب المنزل في كل الجزائر، الدفع عند الاستلام.',
    why_price: 'أسعار عادلة',
    why_price_d: 'أفضل جودة بأفضل سعر، بدون وسطاء.',
    all: 'الكل',
    filters: 'تصفية',
    material: 'المادة',
    sort: 'ترتيب',
    sort_new: 'الأحدث',
    sort_price_asc: 'السعر تصاعدي',
    sort_price_desc: 'السعر تنازلي',
    no_products: 'لا توجد منتجات.',
    add_to_cart: 'أضف إلى السلة',
    out_of_stock: 'نفذ المخزون',
    in_stock: 'متوفر',
    only_left: 'بقي {n} فقط',
    stock_insufficient: 'المخزون غير كافٍ لـ «{name}». يرجى تعديل سلتك.',
    description: 'الوصف',
    related: 'قد يعجبك أيضاً',
    back_to_shop: 'العودة إلى المتجر',
    your_cart: 'سلتك',
    cart_empty: 'سلتك فارغة.',
    continue_shopping: 'متابعة التسوق',
    subtotal: 'المجموع الفرعي',
    shipping: 'التوصيل',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب',
    remove: 'إزالة',
    quantity: 'الكمية',
    checkout_title: 'إتمام الطلب',
    delivery_info: 'معلومات التوصيل',
    full_name: 'الاسم الكامل',
    phone: 'الهاتف',
    wilaya: 'الولاية',
    select_wilaya: 'اختر الولاية',
    address: 'العنوان',
    note: 'ملاحظة (اختياري)',
    order_summary: 'ملخص الطلب',
    payment_cod: 'الدفع عند الاستلام',
    place_order: 'تأكيد الطلب',
    placing: 'جارٍ الإرسال…',
    required: 'هذا الحقل مطلوب',
    order_success: 'تم تأكيد الطلب!',
    order_success_d: 'شكراً لثقتك. سنتصل بك لتأكيد التوصيل.',
    order_ref: 'المرجع',
    back_home: 'العودة إلى الرئيسية',
    footer_about: 'مجوهراتك الموثوقة: مطلي بالذهب، ستيل وفضة، توصيل لكل الجزائر.',
    quick_links: 'روابط سريعة',
    footer_contact: 'اتصل بنا',
    rights: 'جميع الحقوق محفوظة.',
    dashboard: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    products: 'المنتجات',
    orders: 'الطلبات',
    revenue: 'رقم الأعمال',
    total_orders: 'الطلبات',
    total_products: 'المنتجات',
    low_stock: 'مخزون منخفض',
    recent_orders: 'أحدث الطلبات',
    add_product: 'إضافة منتج',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    status: 'الحالة',
    price: 'السعر',
    stock: 'المخزون',
    name: 'الاسم',
    category: 'الصنف',
    actions: 'إجراءات',
    confirm_delete: 'تأكيد الحذف؟',
    currency: 'دج',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'fr')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    const dir = translations[lang].dir
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
  }, [lang])

  const t = (key, vars) => {
    let str = translations[lang][key] ?? translations.fr[key] ?? key
    if (vars) Object.entries(vars).forEach(([k, v]) => (str = str.replace(`{${k}}`, v)))
    return str
  }

  const toggle = () => setLang((l) => (l === 'fr' ? 'ar' : 'fr'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, dir: translations[lang].dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}

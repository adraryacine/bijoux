export function formatPrice(value, lang = 'fr') {
  const n = Number(value || 0)
  const formatted = n.toLocaleString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ')
  return lang === 'ar' ? `${formatted} دج` : `${formatted} DA`
}

export const MATERIALS = {
  plaque_or: { fr: 'Plaqué or', ar: 'مطلي بالذهب' },
  acier: { fr: 'Acier inoxydable', ar: 'ستانلس ستيل' },
  argent: { fr: 'Argent 925', ar: 'فضة 925' },
  autre: { fr: 'Autre', ar: 'أخرى' },
}

export function materialLabel(key, lang = 'fr') {
  return MATERIALS[key]?.[lang] ?? key
}

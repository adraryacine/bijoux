import { useLang } from '../lib/i18n.jsx'

export default function LanguageToggle({ className = '' }) {
  const { lang, toggle } = useLang()
  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-gold hover:bg-sand ${className}`}
      aria-label="Changer de langue"
    >
      <span className={lang === 'fr' ? 'text-gold' : 'opacity-50'}>FR</span>
      <span className="opacity-30">/</span>
      <span className={lang === 'ar' ? 'text-gold' : 'opacity-50'}>ع</span>
    </button>
  )
}

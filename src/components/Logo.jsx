import { useLang } from '../lib/i18n.jsx'

export default function Logo({ className = '' }) {
  const { t } = useLang()
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" className="shrink-0">
        <path d="M20 3l6 8-6 26-6-26 6-8z" fill="#C79A3B" />
        <path d="M14 11h12l-6 8-6-8z" fill="#E4C77E" />
        <path d="M20 3l6 8h-12l6-8z" fill="#9A7526" />
      </svg>
      <div className="leading-none">
        <span className="font-display text-2xl font-semibold tracking-wide text-ink">Éclat</span>
        <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
          {t('brand_tagline')}
        </span>
      </div>
    </div>
  )
}

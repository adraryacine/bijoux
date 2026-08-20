import { useLang } from '../lib/i18n.jsx'

export default function Logo({ className = '' }) {
  const { t } = useLang()
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.jpg"
        alt="Bijoux Joëlle"
        width="40"
        height="40"
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <div className="leading-none">
        <span className="font-display text-2xl font-semibold tracking-wide text-ink">Bijoux Joëlle</span>
        <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
          {t('brand_tagline')}
        </span>
      </div>
    </div>
  )
}

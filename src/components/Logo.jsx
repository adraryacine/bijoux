import { useLang } from '../lib/i18n.jsx'

export default function Logo({ className = '' }) {
  const { t } = useLang()
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="Bijoux Joëlle"
        width="44"
        height="44"
        className="h-11 w-11 shrink-0 object-contain"
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

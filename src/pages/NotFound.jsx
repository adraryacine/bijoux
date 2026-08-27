import { Link } from 'react-router-dom'
import { useLang } from '../lib/i18n.jsx'
import { useTitle } from '../lib/useTitle.js'

export default function NotFound() {
  const { t } = useLang()
  useTitle('404')
  return (
    <div className="mx-auto max-w-lg px-4 py-28 text-center">
      <p className="font-display text-7xl font-semibold text-gold">404</p>
      <p className="mt-3 text-muted">{t('no_products')}</p>
      <Link to="/" className="btn-gold mt-8">{t('back_home')}</Link>
    </div>
  )
}

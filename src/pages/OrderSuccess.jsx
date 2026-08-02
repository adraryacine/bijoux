import { Link, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'

export default function OrderSuccess() {
  const { t } = useLang()
  const { state } = useLocation()

  if (!state?.ref) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-gold" />
      <h1 className="font-display text-4xl font-semibold">{t('order_success')}</h1>
      <p className="mt-3 text-muted">{t('order_success_d')}</p>

      <div className="mt-6 inline-block rounded-2xl bg-sand px-6 py-4">
        <p className="text-xs uppercase tracking-wide text-muted">{t('order_ref')}</p>
        <p className="font-display text-2xl font-semibold text-gold-dark">{state.ref}</p>
      </div>

      {state.demo && (
        <p className="mt-4 text-xs text-muted">
          (Mode démo — la commande n'a pas été enregistrée. Configure Supabase pour activer les vraies commandes.)
        </p>
      )}

      <div className="mt-8">
        <Link to="/boutique" className="btn-gold">{t('continue_shopping')}</Link>
        <Link to="/" className="btn-ghost ms-2">{t('back_home')}</Link>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, AlertCircle } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { useCart } from '../lib/cart.jsx'
import { formatPrice } from '../lib/format.js'
import { WILAYAS } from '../data/wilayas.js'
import { createOrder } from '../lib/db.js'

export default function Checkout() {
  const { t, lang } = useLang()
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', phone: '', wilaya: '', address: '', note: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const shipping = useMemo(() => {
    const w = WILAYAS.find((x) => x.fr === form.wilaya)
    return w ? w.ship : 0
  }, [form.wilaya])

  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-muted">{t('cart_empty')}</p>
        <Link to="/boutique" className="btn-gold mt-6">{t('continue_shopping')}</Link>
      </div>
    )
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('required')
    if (!form.phone.trim()) e.phone = t('required')
    if (!form.wilaya) e.wilaya = t('required')
    if (!form.address.trim()) e.address = t('required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      const order = await createOrder({ customer: form, cart: items, subtotal, shipping })
      clear()
      navigate('/merci', { state: { ref: order.ref, demo: order.demo } })
    } catch (err) {
      setServerError(err.message || 'Erreur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-4xl font-semibold">{t('checkout_title')}</h1>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Formulaire */}
        <div className="card p-6">
          <h2 className="mb-5 font-display text-xl font-semibold">{t('delivery_info')}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">{t('full_name')}</label>
              <input className="input" value={form.name} onChange={set('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="label">{t('phone')}</label>
              <input className="input" dir="ltr" placeholder="0X XX XX XX XX" value={form.phone} onChange={set('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">{t('wilaya')}</label>
              <select className="input" value={form.wilaya} onChange={set('wilaya')}>
                <option value="">{t('select_wilaya')}</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.fr}>
                    {w.code} — {lang === 'ar' ? w.ar : w.fr}
                  </option>
                ))}
              </select>
              {errors.wilaya && <p className="mt-1 text-xs text-red-500">{errors.wilaya}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('address')}</label>
              <input className="input" value={form.address} onChange={set('address')} />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('note')}</label>
              <textarea className="input min-h-[80px]" value={form.note} onChange={set('note')} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-sand/60 p-4 text-sm text-ink">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
            {t('payment_cod')}
          </div>
        </div>

        {/* Récap */}
        <div className="card h-fit p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('order_summary')}</h2>
          <div className="max-h-56 space-y-3 overflow-auto pe-1">
            {items.map((i) => {
              const name = (lang === 'ar' && i.name_ar) || i.name_fr
              return (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                    {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 font-medium">{name}</p>
                    <p className="text-muted">×{i.qty}</p>
                  </div>
                  <span className="font-medium">{formatPrice(i.price * i.qty, lang)}</span>
                </div>
              )
            })}
          </div>

          <div className="my-4 border-t border-sand" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t('subtotal')}</span>
              <span>{formatPrice(subtotal, lang)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{t('shipping')}</span>
              <span>{form.wilaya ? formatPrice(shipping, lang) : '—'}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>{t('total')}</span>
              <span className="text-gold-dark">{formatPrice(total, lang)}</span>
            </div>
          </div>

          {serverError && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> {serverError}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-gold mt-5 w-full">
            {submitting ? t('placing') : t('place_order')}
          </button>
        </div>
      </form>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { useCart } from '../lib/cart.jsx'
import { formatPrice } from '../lib/format.js'

export default function Cart() {
  const { t, lang, dir } = useLang()
  const { items, setQty, remove, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-sand" />
        <h1 className="font-display text-3xl font-semibold">{t('your_cart')}</h1>
        <p className="mt-2 text-muted">{t('cart_empty')}</p>
        <Link to="/boutique" className="btn-gold mt-8">{t('continue_shopping')}</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-4xl font-semibold">{t('your_cart')}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((i) => {
            const name = (lang === 'ar' && i.name_ar) || i.name_fr
            return (
              <div key={i.id} className="card flex gap-4 p-4">
                <Link to={`/produit/${i.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                  {i.image ? (
                    <img src={i.image} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted">✦</div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/produit/${i.id}`} className="font-display text-lg font-semibold hover:text-gold">
                      {name}
                    </Link>
                    <button onClick={() => remove(i.id)} className="text-muted hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-sand">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="p-2 hover:text-gold">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          disabled={i.qty >= i.stock}
                          className="p-2 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {i.qty >= i.stock && (
                        <span className="text-xs text-muted">{t('only_left', { n: i.stock })}</span>
                      )}
                    </div>
                    <span className="font-semibold text-gold-dark">
                      {formatPrice(i.price * i.qty, lang)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Résumé */}
        <div className="card h-fit p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">{t('order_summary')}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t('subtotal')}</span>
              <span className="font-medium">{formatPrice(subtotal, lang)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{t('shipping')}</span>
              <span>{lang === 'ar' ? 'يُحسب عند الطلب' : 'Calculé à la commande'}</span>
            </div>
            <div className="my-3 border-t border-sand" />
            <div className="flex justify-between text-lg font-semibold">
              <span>{t('total')}</span>
              <span className="text-gold-dark">{formatPrice(subtotal, lang)}+</span>
            </div>
          </div>
          <Link to="/commande" className="btn-gold mt-6 w-full">
            {t('checkout')}
            <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
          <Link to="/boutique" className="btn-ghost mt-2 w-full">{t('continue_shopping')}</Link>
        </div>
      </div>
    </div>
  )
}

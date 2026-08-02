import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { useCart } from '../lib/cart.jsx'
import { formatPrice, materialLabel } from '../lib/format.js'

export default function ProductCard({ product }) {
  const { lang, t } = useLang()
  const { add } = useCart()
  const name = (lang === 'ar' && product.name_ar) || product.name_fr
  const soldOut = product.stock <= 0
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : 0

  return (
    <div className="group card overflow-hidden transition duration-300 hover:shadow-soft">
      <Link to={`/produit/${product.id}`} className="relative block aspect-square overflow-hidden bg-sand">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">✦</div>
        )}
        {discount > 0 && (
          <span className="chip absolute start-3 top-3 bg-gold text-white">-{discount}%</span>
        )}
        {soldOut && (
          <span className="chip absolute end-3 top-3 bg-ink/80 text-white">{t('out_of_stock')}</span>
        )}
      </Link>

      <div className="p-4">
        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted">
          {materialLabel(product.material, lang)}
        </p>
        <Link to={`/produit/${product.id}`}>
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-ink transition group-hover:text-gold">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gold-dark">{formatPrice(product.price, lang)}</span>
            {product.old_price > product.price && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.old_price, lang)}
              </span>
            )}
          </div>
          <button
            onClick={() => add(product)}
            disabled={soldOut}
            className="rounded-full bg-sand p-2 text-ink transition hover:bg-gold hover:text-white disabled:opacity-40"
            aria-label={t('add_to_cart')}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

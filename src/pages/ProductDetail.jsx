import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { useCart } from '../lib/cart.jsx'
import { fetchProduct, fetchProducts } from '../lib/db.js'
import { formatPrice, materialLabel } from '../lib/format.js'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const { t, lang, dir } = useLang()
  const { add } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setQty(1)
    setActiveImg(0)
    fetchProduct(id)
      .then((p) => {
        setProduct(p)
        if (p) fetchProducts({ material: p.material }).then((list) =>
          setRelated(list.filter((x) => x.id !== p.id).slice(0, 4)),
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">…</div>
  if (!product)
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted">{t('no_products')}</p>
        <Link to="/boutique" className="btn-outline mt-6">{t('back_to_shop')}</Link>
      </div>
    )

  const name = (lang === 'ar' && product.name_ar) || product.name_fr
  const desc = (lang === 'ar' && product.description_ar) || product.description_fr
  const soldOut = product.stock <= 0
  const images = product.images?.length ? product.images : ['']

  const handleAdd = () => {
    add(product, qty)
    navigate('/panier')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/boutique" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-gold">
        <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        {t('back_to_shop')}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galerie */}
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-sand shadow-card">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-muted">✦</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((im, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                    activeImg === i ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img src={im} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {materialLabel(product.material, lang)}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold">{name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-gold-dark">
              {formatPrice(product.price, lang)}
            </span>
            {product.old_price > product.price && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.old_price, lang)}
              </span>
            )}
          </div>

          <div className="mt-3">
            {soldOut ? (
              <span className="chip bg-ink/80 text-white">{t('out_of_stock')}</span>
            ) : product.stock <= 5 ? (
              <span className="chip bg-gold/15 text-gold-dark">{t('only_left', { n: product.stock })}</span>
            ) : (
              <span className="chip bg-green-100 text-green-700">{t('in_stock')}</span>
            )}
          </div>

          {desc && (
            <div className="mt-6">
              <h3 className="mb-2 font-semibold">{t('description')}</h3>
              <p className="leading-relaxed text-muted">{desc}</p>
            </div>
          )}

          {!soldOut && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-sand">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-ink hover:text-gold"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  className="p-3 text-ink hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-gold flex-1 sm:flex-none">
                <ShoppingBag className="h-4 w-4" />
                {t('add_to_cart')}
              </button>
            </div>
          )}

          <div className="mt-8 space-y-3 border-t border-sand pt-6 text-sm text-muted">
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> {t('why_quality_d')}</p>
            <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-gold" /> {t('why_ship_d')}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold">{t('related')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

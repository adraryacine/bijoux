import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { fetchProducts, fetchCategories } from '../lib/db.js'
import { MATERIALS } from '../lib/format.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Shop() {
  const { t, lang } = useLang()
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  const cat = params.get('cat') || ''
  const material = params.get('material') || ''
  const sort = params.get('sort') || 'new'
  const q = (params.get('q') || '').trim().toLowerCase()

  useEffect(() => {
    fetchCategories().then(setCats).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchProducts({ category: cat, material, sort: sort === 'new' ? null : sort })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [cat, material, sort])

  const visible = useMemo(() => {
    if (!q) return products
    return products.filter((p) =>
      `${p.name_fr} ${p.name_ar || ''}`.toLowerCase().includes(q),
    )
  }, [products, q])

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold">{t('shop')}</h1>
        <p className="text-muted">{visible.length} {lang === 'ar' ? 'قطعة' : 'articles'}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filtres */}
        <aside className="space-y-6">
          <div className="card p-5">
            <p className="mb-3 flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-gold" /> {t('categories')}
            </p>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              <button
                onClick={() => update('cat', '')}
                className={`chip ${!cat ? 'bg-gold text-white' : 'bg-sand text-ink'}`}
              >
                {t('all')}
              </button>
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => update('cat', c.slug)}
                  className={`chip ${cat === c.slug ? 'bg-gold text-white' : 'bg-sand text-ink'}`}
                >
                  {(lang === 'ar' && c.name_ar) || c.name_fr}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="mb-3 font-semibold">{t('material')}</p>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              <button
                onClick={() => update('material', '')}
                className={`chip ${!material ? 'bg-gold text-white' : 'bg-sand text-ink'}`}
              >
                {t('all')}
              </button>
              {Object.entries(MATERIALS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => update('material', key)}
                  className={`chip ${material === key ? 'bg-gold text-white' : 'bg-sand text-ink'}`}
                >
                  {val[lang]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Produits */}
        <div>
          <div className="mb-6 flex justify-end">
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value)}
              className="rounded-full border border-sand bg-white px-4 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="new">{t('sort_new')}</option>
              <option value="price_asc">{t('sort_price_asc')}</option>
              <option value="price_desc">{t('sort_price_desc')}</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-sand" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="py-20 text-center text-muted">{t('no_products')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

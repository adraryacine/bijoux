import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { useTitle } from '../lib/useTitle.js'
import { fetchProducts, fetchCategories } from '../lib/db.js'
import { MATERIALS } from '../lib/format.js'
import ProductCard from '../components/ProductCard.jsx'

const PER_PAGE = 12

export default function Shop() {
  const { t, lang } = useLang()
  useTitle(t('shop'))
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

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

  // Pagination : on n'affiche que PER_PAGE produits à la fois pour garder la
  // page fluide même avec un grand catalogue.
  const pageCount = Math.max(1, Math.ceil(visible.length / PER_PAGE))

  // Revenir à la page 1 dès qu'un filtre / la recherche change.
  useEffect(() => {
    setPage(1)
  }, [cat, material, sort, q])

  // Garder la page dans les bornes si la liste rétrécit.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const paged = useMemo(
    () => visible.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [visible, page],
  )

  const goToPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {paged.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 rounded-full border border-sand bg-white px-4 py-2 text-sm text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    {t('prev')}
                  </button>

                  <div className="flex flex-wrap justify-center gap-1">
                    {Array.from({ length: pageCount }).map((_, i) => {
                      const n = i + 1
                      return (
                        <button
                          key={n}
                          onClick={() => goToPage(n)}
                          className={`h-9 w-9 rounded-full text-sm transition ${
                            n === page
                              ? 'bg-gold text-white'
                              : 'bg-sand text-ink hover:bg-gold/20'
                          }`}
                          aria-current={n === page ? 'page' : undefined}
                        >
                          {n}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === pageCount}
                    className="flex items-center gap-1 rounded-full border border-sand bg-white px-4 py-2 text-sm text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t('next')}
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

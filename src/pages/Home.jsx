import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { fetchFeatured, fetchCategories } from '../lib/db.js'
import ProductCard from '../components/ProductCard.jsx'
import TiltCard from '../components/TiltCard.jsx'

export default function Home() {
  const { t, lang, dir } = useLang()
  const [featured, setFeatured] = useState([])
  const [cats, setCats] = useState([])

  useEffect(() => {
    fetchFeatured().then(setFeatured).catch(() => {})
    fetchCategories().then(setCats).catch(() => {})
  }, [])

  const perks = [
    { icon: ShieldCheck, title: t('why_quality'), desc: t('why_quality_d') },
    { icon: Truck, title: t('why_ship'), desc: t('why_ship_d') },
    { icon: Tag, title: t('why_price'), desc: t('why_price_d') },
  ]

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand/60 to-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-4 bg-white text-gold-dark shadow-card">
              ✦ {t('brand_tagline')}
            </span>
            <h1 className="font-display text-5xl font-semibold leading-tight text-ink md:text-6xl">
              {t('hero_title')}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">{t('hero_subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/boutique" className="btn-gold">
                {t('hero_cta')}
                <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <TiltCard className="aspect-[4/5]">
              <div className="h-full w-full overflow-hidden rounded-3xl shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80"
                  alt="Bijoux Joëlle"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Badge en léger relief 3D */}
              <div
                style={{ transform: 'translateZ(45px)' }}
                className="absolute -bottom-5 start-6 rounded-2xl bg-white/90 px-5 py-3 shadow-soft backdrop-blur"
              >
                <p className="font-display text-2xl font-semibold text-gold-dark">100%</p>
                <p className="text-xs text-muted">
                  {lang === 'ar' ? 'جودة مضمونة' : 'Qualité garantie'}
                </p>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      {cats.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="mb-8 font-display text-3xl font-semibold">{t('categories')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cats.map((c) => (
              <Link
                key={c.id}
                to={`/boutique?cat=${c.slug}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-sand bg-white p-6 text-center transition hover:border-gold hover:shadow-card"
              >
                <span className="mb-2 text-2xl text-gold">✦</span>
                <span className="font-medium text-ink transition group-hover:text-gold">
                  {(lang === 'ar' && c.name_ar) || c.name_fr}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">{t('featured')}</h2>
            <p className="mt-1 text-muted">{t('featured_sub')}</p>
          </div>
          <Link to="/boutique" className="hidden text-sm font-medium text-gold hover:underline sm:block">
            {t('view_all')} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* PERKS */}
      <section className="border-y border-sand bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {perks.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <div className="rounded-xl bg-sand p-3 text-gold-dark">
                <p.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

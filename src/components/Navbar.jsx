import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import { useCart } from '../lib/cart.jsx'
import Logo from './Logo.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function Navbar() {
  const { t } = useLang()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const links = [
    { to: '/', label: t('home'), end: true },
    { to: '/boutique', label: t('shop') },
  ]

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/boutique?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-gold ${
                  isActive ? 'text-gold' : 'text-ink/80'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={submitSearch} className="hidden items-center lg:flex">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-52 rounded-full border border-sand bg-white py-2 ps-9 pe-3 text-sm outline-none focus:border-gold"
              />
            </div>
          </form>

          <LanguageToggle />

          <Link
            to="/panier"
            className="relative rounded-full p-2 text-ink transition hover:bg-sand"
            aria-label={t('cart')}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-ink transition hover:bg-sand md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sand bg-cream px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search_placeholder')}
              className="input"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-sand text-gold' : 'text-ink/80'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

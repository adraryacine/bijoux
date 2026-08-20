import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tags, LogOut, Store } from 'lucide-react'
import { useAuth } from '../../lib/auth.jsx'

const nav = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/admin/produits', icon: Package, label: 'Produits' },
  { to: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { to: '/admin/categories', icon: Tags, label: 'Catégories' },
]

export default function AdminLayout() {
  const { session, loading, signOut, isReady } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-muted">…</div>
  }

  // En mode démo (Supabase non configuré) on laisse entrer pour la présentation.
  if (isReady && !session) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-cream" dir="ltr">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sand bg-white p-5 md:flex">
        <div className="mb-8 flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-gold-dark">Bijoux Joëlle</span>
          <span className="chip bg-sand text-[10px]">Admin</span>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-gold text-white' : 'text-ink/70 hover:bg-sand'
                }`
              }
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-sand pt-4">
          <NavLink to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink/70 hover:bg-sand">
            <Store className="h-5 w-5" /> Voir la boutique
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sand bg-white px-4 py-3 md:hidden">
          <span className="font-display text-xl font-semibold text-gold-dark">Bijoux Joëlle Admin</span>
          <button onClick={handleLogout} className="text-red-500"><LogOut className="h-5 w-5" /></button>
        </header>
        <nav className="flex gap-1 overflow-auto border-b border-sand bg-white px-2 py-2 md:hidden">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-gold text-white' : 'text-ink/70'
                }`
              }
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

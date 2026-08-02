import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react'
import { isSupabaseReady } from '../../lib/supabase.js'
import { adminListOrders, adminListProducts } from '../../lib/db.js'
import { demoProducts } from '../../lib/demoData.js'
import { formatPrice } from '../../lib/format.js'
import { STATUS_META } from './orderStatus.js'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [demo, setDemo] = useState(!isSupabaseReady)

  useEffect(() => {
    if (!isSupabaseReady) {
      setProducts(demoProducts)
      return
    }
    adminListProducts().then(setProducts).catch(() => setDemo(true))
    adminListOrders().then(setOrders).catch(() => {})
  }, [])

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0)
  const lowStock = products.filter((p) => p.stock <= 5)

  const stats = [
    { icon: DollarSign, label: "Chiffre d'affaires", value: formatPrice(revenue), tint: 'bg-green-100 text-green-700' },
    { icon: ShoppingCart, label: 'Commandes', value: orders.length, tint: 'bg-blue-100 text-blue-700' },
    { icon: Package, label: 'Produits', value: products.length, tint: 'bg-gold/15 text-gold-dark' },
    { icon: AlertTriangle, label: 'Stock faible', value: lowStock.length, tint: 'bg-orange-100 text-orange-700' },
  ]

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Tableau de bord</h1>
        <Link to="/admin/produits/nouveau" className="btn-gold">+ Ajouter un produit</Link>
      </div>

      {demo && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-ink">
          <strong>Mode démo.</strong> Les données affichées sont des exemples. Configurez Supabase
          (voir <code>README.md</code>) pour gérer vos vrais produits et commandes.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${s.tint}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Commandes récentes</h2>
            <Link to="/admin/commandes" className="text-sm text-gold hover:underline">Tout voir →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Aucune commande pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand text-left text-muted">
                    <th className="py-2 font-medium">Réf</th>
                    <th className="py-2 font-medium">Client</th>
                    <th className="py-2 font-medium">Total</th>
                    <th className="py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o) => {
                    const meta = STATUS_META[o.status] || STATUS_META.pending
                    return (
                      <tr key={o.id} className="border-b border-sand/60">
                        <td className="py-3 font-medium">{o.ref}</td>
                        <td className="py-3">{o.customer_name}</td>
                        <td className="py-3">{formatPrice(o.total)}</td>
                        <td className="py-3">
                          <span className={`chip ${meta.tint}`}>{meta.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock faible */}
        <div className="card p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">Stock faible</h2>
          {lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Tout est bien approvisionné ✓</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1">{p.name_fr}</span>
                  <span className={`chip ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>
                    {p.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { isSupabaseReady } from '../../lib/supabase.js'
import { adminListProducts, deleteProduct } from '../../lib/db.js'
import { demoProducts } from '../../lib/demoData.js'
import { formatPrice, materialLabel } from '../../lib/format.js'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const demo = !isSupabaseReady

  const load = () => {
    setLoading(true)
    if (demo) {
      setProducts(demoProducts)
      setLoading(false)
      return
    }
    adminListProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!confirm('Confirmer la suppression ?')) return
    if (demo) return alert('Mode démo : action désactivée.')
    await deleteProduct(id)
    load()
  }

  const filtered = products.filter((p) =>
    `${p.name_fr} ${p.name_ar || ''}`.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Produits</h1>
        <Link to="/admin/produits/nouveau" className="btn-gold">
          <Plus className="h-4 w-4" /> Ajouter
        </Link>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className="input pl-9"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-sand/40 text-left text-muted">
                <th className="p-4 font-medium">Produit</th>
                <th className="p-4 font-medium">Matière</th>
                <th className="p-4 font-medium">Prix</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">État</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted">…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted">Aucun produit.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-sand/60 hover:bg-sand/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <span className="font-medium">{p.name_fr}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted">{materialLabel(p.material)}</td>
                    <td className="p-4">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <span className={p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-orange-500' : ''}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`chip ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-sand text-muted'}`}>
                        {p.is_active ? 'Actif' : 'Masqué'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/produits/${p.id}`} className="rounded-lg p-2 text-ink hover:bg-sand">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Phone, MapPin } from 'lucide-react'
import { isSupabaseReady } from '../../lib/supabase.js'
import { adminListOrders, updateOrderStatus } from '../../lib/db.js'
import { formatPrice } from '../../lib/format.js'
import { STATUS_META, STATUS_ORDER } from './orderStatus.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)
  const [filter, setFilter] = useState('')
  const demo = !isSupabaseReady

  const load = () => {
    if (demo) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    adminListOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const changeStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    try {
      await updateOrderStatus(id, status)
    } catch {
      load()
    }
  }

  const visible = filter ? orders.filter((o) => o.status === filter) : orders

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Commandes</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setFilter('')} className={`chip ${!filter ? 'bg-gold text-white' : 'bg-sand'}`}>
          Toutes ({orders.length})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`chip ${filter === s ? 'bg-gold text-white' : 'bg-sand'}`}
          >
            {STATUS_META[s].label} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {demo ? (
        <div className="card p-8 text-center text-sm text-muted">
          Mode démo — les commandes réelles apparaîtront ici une fois Supabase configuré.
        </div>
      ) : loading ? (
        <div className="card p-8 text-center text-muted">…</div>
      ) : visible.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">Aucune commande.</div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const meta = STATUS_META[o.status] || STATUS_META.pending
            const isOpen = open === o.id
            return (
              <div key={o.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-sand/20"
                >
                  <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1">
                    <span className="font-semibold">{o.ref}</span>
                    <span className="text-sm text-muted">{o.customer_name}</span>
                    <span className="text-sm text-muted">{new Date(o.created_at).toLocaleDateString('fr-DZ')}</span>
                    <span className="font-medium text-gold-dark">{formatPrice(o.total)}</span>
                  </div>
                  <span className={`chip ${meta.tint}`}>{meta.label}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isOpen && (
                  <div className="border-t border-sand p-5">
                    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-muted">Articles</h4>
                        <ul className="space-y-2">
                          {o.order_items?.map((it) => {
                            const img = it.products?.images?.[0]
                            return (
                              <li key={it.id} className="flex items-center gap-3 text-sm">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                                  {img ? (
                                    <img src={img} alt={it.product_name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-muted">✦</div>
                                  )}
                                </div>
                                <span className="flex-1">{it.product_name} <span className="text-muted">×{it.quantity}</span></span>
                                <span>{formatPrice(it.unit_price * it.quantity)}</span>
                              </li>
                            )
                          })}
                        </ul>
                        <div className="mt-3 space-y-1 border-t border-sand pt-3 text-sm">
                          <div className="flex justify-between text-muted"><span>Sous-total</span><span>{formatPrice(o.subtotal)}</span></div>
                          <div className="flex justify-between text-muted"><span>Livraison</span><span>{formatPrice(o.shipping)}</span></div>
                          <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(o.total)}</span></div>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <h4 className="font-semibold text-muted">Client</h4>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gold" />
                          <a href={`tel:${o.phone}`} className="hover:text-gold">{o.phone}</a>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          <span>{o.wilaya}<br />{o.address}</span>
                        </p>
                        {o.note && <p className="rounded-lg bg-sand/60 p-2 text-xs italic">{o.note}</p>}

                        <div>
                          <label className="label">Statut</label>
                          <select
                            value={o.status}
                            onChange={(e) => changeStatus(o.id, e.target.value)}
                            className="input"
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>{STATUS_META[s].label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

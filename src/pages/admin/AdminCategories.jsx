import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { isSupabaseReady } from '../../lib/supabase.js'
import { fetchCategories, saveCategory, deleteCategory } from '../../lib/db.js'

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [form, setForm] = useState({ name_fr: '', name_ar: '', slug: '' })
  const [error, setError] = useState('')
  const demo = !isSupabaseReady

  const load = () => fetchCategories().then(setCats).catch(() => {})
  useEffect(() => { load() }, [])

  const slugify = (s) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const add = async (e) => {
    e.preventDefault()
    setError('')
    if (demo) return setError('Mode démo : configurez Supabase pour gérer les catégories.')
    try {
      await saveCategory({
        name_fr: form.name_fr,
        name_ar: form.name_ar,
        slug: form.slug || slugify(form.name_fr),
        sort_order: cats.length + 1,
      })
      setForm({ name_fr: '', name_ar: '', slug: '' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    if (demo) return
    await deleteCategory(id)
    load()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-semibold">Catégories</h1>

      {demo && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm">
          Mode démo — catégories d'exemple. Configurez Supabase pour les modifier.
        </div>
      )}

      <form onSubmit={add} className="card mb-6 grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <label className="label">Nom (FR)</label>
          <input className="input" value={form.name_fr}
            onChange={(e) => setForm((f) => ({ ...f, name_fr: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Nom (AR)</label>
          <input className="input" dir="rtl" value={form.name_ar}
            onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-gold w-full">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
        {error && <p className="text-sm text-red-500 sm:col-span-3">{error}</p>}
      </form>

      <div className="card divide-y divide-sand">
        {cats.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">Aucune catégorie.</p>
        ) : (
          cats.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{c.name_fr}</p>
                <p className="text-sm text-muted" dir="rtl">{c.name_ar}</p>
              </div>
              <button onClick={() => remove(c.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

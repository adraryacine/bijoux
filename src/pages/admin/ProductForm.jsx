import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, X, Save, AlertCircle } from 'lucide-react'
import { isSupabaseReady } from '../../lib/supabase.js'
import { fetchCategories, fetchProduct, saveProduct, uploadProductImage } from '../../lib/db.js'
import { MATERIALS } from '../../lib/format.js'

const EMPTY = {
  name_fr: '', name_ar: '', description_fr: '', description_ar: '',
  material: 'acier', category_id: '', price: '', old_price: '', stock: '',
  images: [], is_active: true, is_featured: false,
}

export default function ProductForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [cats, setCats] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const demo = !isSupabaseReady

  useEffect(() => {
    fetchCategories().then(setCats).catch(() => {})
    if (editing) {
      fetchProduct(id).then((p) => p && setForm({ ...EMPTY, ...p, category_id: p.category_id || '' }))
    }
  }, [id])

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (demo) {
      setError('Mode démo : upload désactivé. Configurez Supabase pour envoyer des images.')
      return
    }
    setUploading(true)
    setError('')
    try {
      const urls = await Promise.all(files.map(uploadProductImage))
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (demo) {
      setError('Mode démo : enregistrement désactivé. Configurez Supabase (voir README).')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name_fr: form.name_fr,
        name_ar: form.name_ar || null,
        description_fr: form.description_fr || null,
        description_ar: form.description_ar || null,
        material: form.material,
        category_id: form.category_id || null,
        price: Number(form.price) || 0,
        old_price: form.old_price ? Number(form.old_price) : null,
        stock: Number(form.stock) || 0,
        images: form.images,
        is_active: form.is_active,
        is_featured: form.is_featured,
      }
      await saveProduct(payload, editing ? id : null)
      navigate('/admin/produits')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/produits" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        {editing ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      {demo && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm">
          Mode démo — l'enregistrement est désactivé tant que Supabase n'est pas configuré.
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Images */}
        <div className="card p-6">
          <label className="label">Images</label>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url) => (
              <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl bg-sand">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sand text-muted hover:border-gold hover:text-gold">
              <Upload className="h-5 w-5" />
              <span className="text-[10px]">{uploading ? '…' : 'Ajouter'}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
            </label>
          </div>
        </div>

        {/* Infos */}
        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="label">Nom (FR) *</label>
            <input className="input" value={form.name_fr} onChange={set('name_fr')} required />
          </div>
          <div>
            <label className="label">Nom (AR)</label>
            <input className="input" dir="rtl" value={form.name_ar} onChange={set('name_ar')} />
          </div>
          <div>
            <label className="label">Catégorie</label>
            <select className="input" value={form.category_id} onChange={set('category_id')}>
              <option value="">—</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name_fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Matière</label>
            <select className="input" value={form.material} onChange={set('material')}>
              {Object.entries(MATERIALS).map(([k, v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Prix (DA) *</label>
            <input type="number" min="0" className="input" value={form.price} onChange={set('price')} required />
          </div>
          <div>
            <label className="label">Ancien prix (DA)</label>
            <input type="number" min="0" className="input" value={form.old_price} onChange={set('old_price')} />
          </div>
          <div>
            <label className="label">Stock *</label>
            <input type="number" min="0" className="input" value={form.stock} onChange={set('stock')} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description (FR)</label>
            <textarea className="input min-h-[90px]" value={form.description_fr} onChange={set('description_fr')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description (AR)</label>
            <textarea className="input min-h-[90px]" dir="rtl" value={form.description_ar} onChange={set('description_ar')} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="h-4 w-4 accent-gold" />
            Produit actif (visible en boutique)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="h-4 w-4 accent-gold" />
            Mettre en avant (coup de cœur)
          </label>
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-gold">
            <Save className="h-4 w-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <Link to="/admin/produits" className="btn-outline">Annuler</Link>
        </div>
      </form>
    </div>
  )
}

import { supabase, isSupabaseReady, STORAGE_BUCKET } from './supabase'
import { demoCategories, demoProducts } from './demoData'

// ---- Lecture catalogue (public) ----
export async function fetchCategories() {
  if (!isSupabaseReady) return [...demoCategories]
  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
  if (error) throw error
  return data
}

export async function fetchProducts({ category, material, sort, activeOnly = true } = {}) {
  if (!isSupabaseReady) {
    let list = demoProducts.filter((p) => (activeOnly ? p.is_active : true))
    if (category) {
      const cat = demoCategories.find((c) => c.slug === category)
      list = list.filter((p) => p.category_id === cat?.id)
    }
    if (material) list = list.filter((p) => p.material === material)
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    return list
  }

  let query = supabase.from('products').select('*, categories(slug, name_fr, name_ar)')
  if (activeOnly) query = query.eq('is_active', true)
  if (material) query = query.eq('material', material)
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  let list = data
  if (category) list = list.filter((p) => p.categories?.slug === category)
  return list
}

export async function fetchFeatured() {
  if (!isSupabaseReady) return demoProducts.filter((p) => p.is_featured && p.is_active)
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)
  if (error) throw error
  return data
}

export async function fetchProduct(id) {
  if (!isSupabaseReady) return demoProducts.find((p) => p.id === id) || null
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// ---- Commandes ----
export async function createOrder({ customer, cart, subtotal, shipping }) {
  const total = subtotal + shipping
  if (!isSupabaseReady) {
    // Mode démo : on simule une référence sans persister.
    return { ref: 'DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase(), demo: true }
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_name: customer.name,
      phone: customer.phone,
      wilaya: customer.wilaya,
      address: customer.address,
      note: customer.note,
      subtotal,
      shipping,
      total,
    })
    .select()
    .single()
  if (error) throw error

  const items = cart.map((i) => ({
    order_id: order.id,
    product_id: i.id,
    product_name: i.name_fr,
    unit_price: i.price,
    quantity: i.qty,
  }))
  const { error: itemsError } = await supabase.from('order_items').insert(items)
  if (itemsError) throw itemsError

  return order
}

// ---- Admin : produits ----
export async function adminListProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name_fr)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function saveProduct(payload, id) {
  if (id) {
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.from('products').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ---- Admin : commandes ----
export async function adminListOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

// ---- Admin : catégories ----
export async function saveCategory(payload, id) {
  if (id) {
    const { error } = await supabase.from('categories').update(payload).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('categories').insert(payload)
    if (error) throw error
  }
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Le site fonctionne en mode "démo" (données locales) tant que Supabase
// n'est pas configuré. Dès que .env est rempli, tout passe sur la vraie base.
export const isSupabaseReady = Boolean(url && anonKey)

export const supabase = isSupabaseReady
  ? createClient(url, anonKey)
  : null

export const STORAGE_BUCKET = 'products'

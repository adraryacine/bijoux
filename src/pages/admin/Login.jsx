import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../../lib/auth.jsx'

export default function Login() {
  const { signIn, isReady } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sand/60 to-cream px-4" dir="ltr">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="font-display text-3xl font-semibold text-gold-dark">Bijoux Joëlle</span>
          <p className="mt-1 text-sm text-muted">Espace administrateur</p>
        </div>

        {!isReady && (
          <div className="mb-4 rounded-xl bg-sand/70 p-3 text-xs text-ink">
            Supabase n'est pas encore configuré. Vous pouvez tout de même explorer le dashboard en mode démo via{' '}
            <Link to="/admin" className="font-semibold text-gold-dark underline">/admin</Link>.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">E-mail</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-gold w-full">
            <LogIn className="h-4 w-4" /> {loading ? '…' : 'Connexion'}
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted hover:text-gold">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  )
}

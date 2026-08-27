import { useEffect } from 'react'

const BRAND = 'Bijoux Joëlle'

// Met à jour le <title> de l'onglet pour la page courante.
// useTitle('Boutique')  -> "Boutique — Bijoux Joëlle"
// useTitle()            -> "Bijoux Joëlle — Bijouterie" (défaut)
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BRAND}` : `${BRAND} — Bijouterie`
    return () => {
      document.title = `${BRAND} — Bijouterie`
    }
  }, [title])
}

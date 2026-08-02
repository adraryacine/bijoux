import { Link } from 'react-router-dom'
import { Instagram, Facebook, Phone, MapPin } from 'lucide-react'
import { useLang } from '../lib/i18n.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t } = useLang()
  const whatsapp = import.meta.env.VITE_STORE_WHATSAPP || '213000000000'

  return (
    <footer className="mt-20 border-t border-sand bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t('footer_about')}</p>
          <div className="mt-4 flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              className="rounded-full border border-sand p-2 text-ink transition hover:border-gold hover:text-gold">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"
              className="rounded-full border border-sand p-2 text-ink transition hover:border-gold hover:text-gold">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">{t('quick_links')}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/" className="hover:text-gold">{t('home')}</Link></li>
            <li><Link to="/boutique" className="hover:text-gold">{t('shop')}</Link></li>
            <li><Link to="/panier" className="hover:text-gold">{t('cart')}</Link></li>
            <li><Link to="/admin" className="hover:text-gold">{t('admin')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">{t('footer_contact')}</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-gold">
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              Algérie
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Éclat. {t('rights')}
      </div>
    </footer>
  )
}

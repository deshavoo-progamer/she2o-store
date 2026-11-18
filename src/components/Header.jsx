import { useState } from 'react'
import { whatsappLink } from '../whatsapp.js'

const links = [
  { href: '#models', label: 'الموديلات' },
  { href: '#real', label: 'صور حقيقية' },
  { href: '#sizes', label: 'المقاسات' },
  { href: '#faq', label: 'أسئلة' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-flame text-ink text-center text-[13px] font-medium py-2 px-4">
        توصيل مجاني جوه القاهرة — والدفع عند الاستلام
      </div>

      <div className="bg-ink/95 backdrop-blur text-paper border-b border-white/5">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src="/logo.png" alt="شقو" className="h-11 w-11 rounded-full object-cover" />
            <span className="font-display font-bold text-xl tracking-tight">شقو</span>
          </a>

          <ul className="hidden md:flex items-center gap-8 text-sm text-paper/80">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-teal transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center h-10 px-5 rounded-full bg-teal text-ink text-sm font-semibold hover:bg-paper transition-colors"
            >
              كلمنا واتساب
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-10 w-10 grid place-items-center"
              aria-label="القائمة"
              aria-expanded={open}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute inset-x-0 top-0 h-0.5 bg-paper transition ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-paper transition ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </nav>

        {open && (
          <ul className="md:hidden border-t border-white/5 px-4 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-paper/90 border-b border-white/5 last:border-0"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}

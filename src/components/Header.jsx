import { useState } from 'react'
import { whatsappLink } from '../whatsapp.js'

const links = [
  { href: '#models', label: 'الموديلات' },
  { href: '#real', label: 'صور على الطبيعة' },
  { href: '#sizes', label: 'اعرف مقاسك' },
  { href: '#faq', label: 'عندك سؤال؟' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        document.getElementById('menu-toggle')?.focus()
      }
    }}>
      <div className="announcement">التوصيل ببلاش جوّه القاهرة <span aria-hidden="true">◆</span> ادفع لما تستلم</div>
      <div className="nav-background">
        <nav className="shell header-nav" aria-label="قائمة الموقع">
          <a href="#top" className="brand" aria-label="شقّو، ارجع لأول الصفحة" onClick={() => setOpen(false)}>
            <img src="/shaqo-logo.png" width="72" height="72" alt="" />
            <span>شقّو</span>
          </a>
          <ul className="desktop-links">
            {links.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
          <a className="button button-outline header-cta" href={whatsappLink()} target="_blank" rel="noreferrer">
            كلمنا على واتساب <span aria-hidden="true">↗</span>
          </a>
          <button
            id="menu-toggle"
            className="menu-toggle"
            type="button"
            aria-label={open ? 'اقفل القائمة' : 'افتح القائمة'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(value => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <ul id="mobile-navigation" className="mobile-navigation" hidden={!open}>
            {links.map(({ href, label }) => (
              <li key={href}><a href={href} onClick={() => setOpen(false)}>{label} <span aria-hidden="true">←</span></a></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

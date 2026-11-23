import { useState } from 'react'

const links = [
  { href: '/#models', label: 'الموديلات' },
  { href: '/#sizes', label: 'اعرف مقاسك' },
  { href: '/#faq', label: 'عندك سؤال؟' },
]

export default function Header({ cartCount, cairoFree }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        document.getElementById('menu-toggle')?.focus()
      }
    }}>
      <div className="announcement">{cairoFree && <>التوصيل ببلاش جوّه القاهرة <span aria-hidden="true">◆</span> </>}ادفع لما تستلم</div>
      <div className="nav-background">
        <nav className="shell header-nav" aria-label="قائمة الموقع">
          <a href="/#top" className="brand" aria-label="شقّو، ارجع لأول الصفحة" onClick={() => setOpen(false)}>
            <img src="/shaqo-mark.png" width="98" height="72" alt="" />
          </a>
          <ul className="desktop-links">
            {links.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
          <a className="button button-lime header-cart" href="/cart">
            السلة <span className="cart-count">{cartCount}</span>
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

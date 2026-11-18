import { social, PHONES } from '../data.js'
import { whatsappLink } from '../whatsapp.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <a href="/#top" className="brand" aria-label="شقّو، ارجع لأول الصفحة">
          <img src="/shaqo-mark.png" alt="" width="115" height="84" loading="lazy" />
        </a>
        <div className="footer-contact">
          <h2>كلمنا</h2>
          {PHONES.map(number => <a key={number} href={`tel:${number}`} dir="ltr">{number}</a>)}
        </div>
        <ul className="social-links">
          <li><a href={whatsappLink()} target="_blank" rel="noreferrer">واتساب ↗</a></li>
          <li><a href={social.facebook} target="_blank" rel="noreferrer">فيسبوك ↗</a></li>
          <li><a href={social.instagram} target="_blank" rel="noreferrer">إنستجرام ↗</a></li>
          <li><a href={social.tiktok} target="_blank" rel="noreferrer">تيك توك ↗</a></li>
        </ul>
      </div>
      <p className="shell copyright">© {new Date().getFullYear()} شقّو</p>
    </footer>
  )
}
